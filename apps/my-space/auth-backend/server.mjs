import {DatabaseSync} from 'node:sqlite';
import {createHash,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
import {dirname,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
const root=dirname(fileURLToPath(import.meta.url));
const hash=value=>createHash('sha256').update(value).digest('hex');
const secret=()=>randomBytes(32).toString('base64url');
const equal=(a,b)=>typeof a==='string' && typeof b==='string' && a.length===b.length && timingSafeEqual(Buffer.from(a),Buffer.from(b));
const normalize=value=>{
 if(typeof value!=='string'||value.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw new Failure(400,'올바른 이메일을 입력해주세요.');
 return value.trim().toLowerCase();
};
class Failure extends Error {constructor(status,message){super(message);this.status=status;}}
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer',...headers}});
const redirect=(url,cookie)=>new Response(null,{status:302,headers:{Location:url,'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
const cookies=request=>Object.fromEntries((request.headers.get('cookie')||'').split(';').map(x=>x.trim().split('=')).filter(x=>x.length===2));
export function createApp(options={}) {
 const settings={...process.env,...options.env};
 const origin=settings.PUBLIC_HUB_ORIGIN||'http://127.0.0.1:8787';
 const urlOrigin=new URL(origin);if(origin!==urlOrigin.origin) throw new Error('PUBLIC_HUB_ORIGIN must be an origin without a path.');
 const local=['127.0.0.1','localhost'].includes(urlOrigin.hostname);
 if(urlOrigin.protocol!=='https:'&&!local) throw new Error('HTTPS is required outside localhost.');
 const event=settings.EVENT_ID||'space-apps-seoul-2026';
 const db=options.db||new DatabaseSync(settings.HUB_DB_PATH||resolve(root,'private/hub.sqlite'));
 db.exec(readFileSync(resolve(root,'schema.sql'),'utf8'));db.exec('PRAGMA busy_timeout=5000;');
 const now=options.now||(()=>Math.floor(Date.now()/1000));
 const fetchRemote=options.fetchRemote||fetch;
 const ttl=Number(settings.EMAIL_VERIFICATION_TTL_SECONDS||1800),cooldown=Number(settings.EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS||60),hourLimit=Number(settings.EMAIL_VERIFICATION_HOURLY_LIMIT||3),dailyLimit=Number(settings.EMAIL_DAILY_LIMIT||100);
 if(![ttl,cooldown,hourLimit,dailyLimit].every(x=>Number.isSafeInteger(x)&&x>0)) throw new Error('Invalid verification limits.');
 const admins=new Set((settings.ADMIN_IDENTITIES||'').split(',').map(x=>x.trim()).filter(Boolean));
 const get=(sql,...args)=>db.prepare(sql).get(...args),all=(sql,...args)=>db.prepare(sql).all(...args),run=(sql,...args)=>db.prepare(sql).run(...args);
 function transaction(fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}
 const cookie=(name,value,maxAge)=>`${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${local?'':'; Secure'}`;
 function identity(request) {
  const row=get('SELECT i.*,s.csrf FROM sessions s JOIN identities i ON i.id=s.identity_id WHERE s.token_hash=? AND s.expires_at>?',hash(cookies(request).seoul_session||''),now());
  if(!row)throw new Failure(401,'다시 로그인해주세요.');return row;
 }
 function csrf(request,user){if(request.headers.get('origin')!==origin||!equal(request.headers.get('x-csrf-token'),user.csrf))throw new Failure(403,'요청을 확인하지 못했습니다. 화면을 새로고침해주세요.');}
 function admin(user){if(!admins.has(`${user.provider}:${user.provider_user_id}`))throw new Failure(403,'운영자 권한이 필요합니다.');}
 function participantEligible(p){return p&&p.event_id===event&&p.eligible===1&&p.official_confirmed===1&&p.seoul_confirmed===1&&['not_required','verified'].includes(p.guardian_status)&&!['rejected','suspended','withdrawn'].includes(p.approval_status);}
 function requestFor(user){return get('SELECT * FROM approval_requests WHERE identity_id=? AND event_id=?',user.id,event);}
 function verificationFor(req){return req?get('SELECT * FROM verifications WHERE request_id=? AND request_version=? ORDER BY created_at DESC,rowid DESC LIMIT 1',req.id,req.version):null;}
 function sessionResult(user){
  const participant=user.participant_id?get('SELECT * FROM participants WHERE id=?',user.participant_id):null;
  const linked=participantEligible(participant)&&participant.approval_status==='approved';
  const req=requestFor(user),v=verificationFor(req);
  let stage='required';
  if(linked)stage='connected';
  else if(req?.status==='rejected')stage='rejected';
  else if(req?.status==='additional_review')stage='additional_review';
  else if(v?.status==='verified')stage='review_pending';
  else if(v?.status==='pending'&&v.expires_at>now()&&v.send_status==='accepted')stage='email_pending';
  else if(v&&['pending','expired','revoked'].includes(v.status))stage='expired';
  return {authenticated:true,linked_status:linked?'linked':'pending',approval_stage:stage,csrf_token:user.csrf,is_admin:admins.has(`${user.provider}:${user.provider_user_id}`),participant_features_ready:false};
 }
 function establishIdentity(provider,profile){
  return transaction(()=>{
   const subject=String(profile.sub||'');if(!subject||subject.length>512)throw new Failure(502,'로그인 정보를 확인하지 못했습니다.');
   let user=get('SELECT * FROM identities WHERE provider=? AND provider_user_id=?',provider,subject);
   const email=profile.email?normalize(profile.email):null,verified=profile.email_verified===true?1:0;
   if(!user){const id=randomUUID();run('INSERT INTO identities(id,provider,provider_user_id,email,email_verified) VALUES(?,?,?,?,?)',id,provider,subject,email,verified);user=get('SELECT * FROM identities WHERE id=?',id);}
   else run('UPDATE identities SET email=?,email_verified=? WHERE id=?',email,verified,user.id);
   if(!user.participant_id&&verified&&email){
    const matches=all('SELECT * FROM participants WHERE event_id=? AND nasa_email=?',event,email);
    const req=requestFor(user);
    if(matches.length===1&&participantEligible(matches[0])&&matches[0].approval_status==='approved'&&!get('SELECT id FROM identities WHERE participant_id=?',matches[0].id)&&!['rejected','additional_review'].includes(req?.status)){
     run('UPDATE identities SET participant_id=? WHERE id=?',matches[0].id,user.id);
     run('INSERT OR IGNORE INTO profiles(participant_id) VALUES(?)',matches[0].id);
    }
   }
   return get('SELECT * FROM identities WHERE id=?',user.id);
  });
 }
 async function readBody(request){
  const text=await request.text();if(Buffer.byteLength(text)>16384)throw new Failure(413,'요청이 너무 큽니다.');
  try{return JSON.parse(text||'{}');}catch{throw new Failure(400,'잘못된 요청입니다.');}
 }
 async function providerIdentity(provider,code,state,verifier){
  const prefix=provider.toUpperCase(),client=settings[`${prefix}_CLIENT_ID`],key=settings[`${prefix}_CLIENT_SECRET`];
  if(!client||!key)throw new Failure(503,'로그인 설정을 준비 중입니다.');
  const callback=`${origin}/auth/${provider}/callback`;
  const tokenURL=provider==='google'?'https://oauth2.googleapis.com/token':'https://nid.naver.com/oauth2.0/token';
  const body=new URLSearchParams({grant_type:'authorization_code',client_id:client,client_secret:key,code,redirect_uri:callback,...(provider==='google'?{code_verifier:verifier}:{state})});
  const response=await fetchRemote(tokenURL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Failure(502,'로그인을 완료하지 못했습니다.');
  const tokens=await response.json();if(!tokens.access_token)throw new Failure(502,'로그인을 완료하지 못했습니다.');
  const profileResponse=await fetchRemote(provider==='google'?'https://openidconnect.googleapis.com/v1/userinfo':'https://openapi.naver.com/v1/nid/me',{headers:{Authorization:`Bearer ${tokens.access_token}`},signal:AbortSignal.timeout(15000)});
  if(!profileResponse.ok)throw new Failure(502,'로그인 정보를 확인하지 못했습니다.');
  const profile=await profileResponse.json();
  // Naver's documented profile has no email_verified proof. Require ownership verification.
  if(provider==='naver'){if(profile.resultcode!=='00'||!profile.response?.id)throw new Failure(502,'로그인 정보를 확인하지 못했습니다.');return {sub:profile.response.id,email:profile.response.email,email_verified:false};}
  return profile;
 }
 const mailer=options.mailer|| (async ({to,link,id})=>{
  if(!settings.RESEND_API_KEY||!settings.VERIFICATION_FROM_EMAIL)throw new Failure(503,'인증 메일 발송 설정을 준비 중입니다.');
  const response=await fetchRemote('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${settings.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':id},body:JSON.stringify({from:settings.VERIFICATION_FROM_EMAIL,to:[to],subject:'NASA Space Apps Seoul — 등록 이메일 인증',text:`아래 링크를 열고 요청한 MY SPACE 계정으로 로그인하여 인증을 완료해주세요.\n${link}\n\n이메일 인증과 MY SPACE 이용 승인은 별개입니다. 요청하지 않았다면 이 메일을 무시해주세요.`}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Failure(502,'인증 메일을 발송하지 못했습니다. 잠시 후 다시 시도해주세요.');const result=await response.json();if(!result.id)throw new Failure(502,'메일 접수 결과를 확인하지 못했습니다.');return result.id;
 });
 async function sendVerification(user){
  if(!options.mailer&&(!settings.RESEND_API_KEY||!settings.VERIFICATION_FROM_EMAIL))throw new Failure(503,'인증 메일 발송 설정을 준비 중입니다.');
  const issued=transaction(()=>{
   const req=requestFor(user);if(!req||req.status!=='pending')throw new Failure(409,'인증 요청 상태를 다시 확인해주세요.');
   const prior=verificationFor(req);if(prior?.status==='verified')throw new Failure(409,'이미 인증되었습니다. 운영팀 확인을 기다려주세요.');
   const attempts=all('SELECT created_at FROM verifications WHERE identity_id=? ORDER BY created_at DESC',user.id);
   const addressAttempts=all('SELECT created_at FROM verifications WHERE email=? AND created_at>?',req.email,now()-3600);
   if(attempts[0]&&now()-attempts[0].created_at<cooldown)throw new Failure(429,'재발송 간격이 지나면 다시 요청해주세요.');
   if(attempts.filter(x=>x.created_at>now()-3600).length>=hourLimit||addressAttempts.length>=hourLimit||get('SELECT COUNT(*) AS n FROM verifications WHERE created_at>?',now()-86400).n>=dailyLimit)throw new Failure(429,'메일 요청 한도에 도달했습니다. 나중에 다시 시도해주세요.');
   run("UPDATE verifications SET status='revoked' WHERE request_id=? AND status='pending'",req.id);
   const id=randomUUID(),token=secret();run('INSERT INTO verifications(id,request_id,identity_id,email,request_version,token_hash,status,created_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?)',id,req.id,user.id,req.email,req.version,hash(token),'pending',now(),now()+ttl);
   return {id,token,to:req.email};
  });
  try {
   // Fragment tokens stay out of HTTP request paths, access logs and referrers.
   const messageId=await mailer({to:issued.to,link:`${origin}/verify-email#token=${issued.token}`,id:issued.id});
   run("UPDATE verifications SET send_status='accepted',message_id=? WHERE id=?",messageId,issued.id);
  }catch(error){run("UPDATE verifications SET status='revoked',send_status='failed' WHERE id=?",issued.id);throw error;}
  return {accepted:true};
 }
 function confirm(user,token){
  if(typeof token!=='string'||token.length>200)throw new Failure(400,'인증 링크를 확인해주세요.');
  return transaction(()=>{
   const v=get('SELECT * FROM verifications WHERE token_hash=?',hash(token));
   const req=v?get('SELECT * FROM approval_requests WHERE id=?',v.request_id):null;
   if(!v||v.identity_id!==user.id||!req||req.identity_id!==user.id||req.event_id!==event||req.version!==v.request_version||req.email!==v.email)throw new Failure(400,'요청한 계정으로 로그인하거나 인증 링크를 다시 요청해주세요.');
   if(v.status==='verified'&&req.status==='pending')return {verified:true};
   if(v.status!=='pending'||v.send_status!=='accepted'||v.expires_at<=now()||req.status!=='pending')throw new Failure(400,'인증 링크가 만료되었거나 취소되었습니다. 새 링크를 요청해주세요.');
   run("UPDATE verifications SET status='verified',verified_at=? WHERE id=? AND status='pending'",now(),v.id);
   return {verified:true};
  });
 }
 function decision(operator,id,data){
  if(!['approved','rejected','additional_review'].includes(data.decision)||!Number.isInteger(data.version))throw new Failure(400,'처리 내용과 최신 요청을 확인해주세요.');
  return transaction(()=>{
   const req=get('SELECT * FROM approval_requests WHERE id=? AND event_id=?',id,event);
   if(!req||req.version!==data.version||req.status==='approved')throw new Failure(409,'요청이 변경되었거나 이미 처리되었습니다. 새로고침해주세요.');
   if(data.decision==='approved'){
    const v=verificationFor(req),target=get('SELECT * FROM participants WHERE id=?',data.participant_id||'');
    const matches=all('SELECT * FROM participants WHERE event_id=? AND nasa_email=?',event,req.email);
    if(!v||v.status!=='verified'||!participantEligible(target)||target.nasa_email!==req.email||matches.length!==1||data.records_checked!==true)throw new Failure(409,'이메일 인증·참가 자격·등록 대조를 다시 확인해주세요.');
    const own=get('SELECT * FROM identities WHERE id=?',req.identity_id),other=get('SELECT id FROM identities WHERE participant_id=? AND id<>?',target.id,req.identity_id);
    if(other||(own.participant_id&&own.participant_id!==target.id))throw new Failure(409,'기존 계정 연결 충돌을 확인해주세요.');
    run("UPDATE participants SET approval_status='approved',updated_at=? WHERE id=?",now(),target.id);
    run('UPDATE identities SET participant_id=? WHERE id=?',target.id,req.identity_id);
    run('INSERT OR IGNORE INTO profiles(participant_id) VALUES(?)',target.id);
   }
   run('UPDATE approval_requests SET status=?,version=version+1,reviewed_at=?,reviewed_by=?,reason=? WHERE id=?',data.decision,now(),operator.id,String(data.reason||'').slice(0,300),id);
   run('UPDATE verifications SET request_version=? WHERE request_id=? AND request_version=?',req.version+1,req.id,req.version);
   run('INSERT INTO approval_audit VALUES(?,?,?,?,?)',randomUUID(),id,operator.id,data.decision,now());
   return {processed:true};
  });
 }
 async function handle(request){
  try {
   const url=new URL(request.url),path=url.pathname;
   if(url.origin!==origin)throw new Failure(400,'잘못된 요청 주소입니다.');
   if(request.method==='GET'&&path==='/auth/session'){
    try{return json(sessionResult(identity(request)));}catch(error){if(error.status===401)return json({authenticated:false});throw error;}
   }
   const route=path.match(/^\/auth\/(google|naver)\/(start|callback)$/);
   if(request.method==='GET'&&route){
    const [,provider,action]=route;
    if(!settings[`${provider.toUpperCase()}_CLIENT_ID`]||!settings[`${provider.toUpperCase()}_CLIENT_SECRET`])throw new Failure(503,'로그인 설정을 준비 중입니다.');
    if(action==='start'){
     let returnTo=url.searchParams.get('return_to')||'/#my-space';if(!returnTo.startsWith('/')||returnTo.startsWith('//')||/[\\\r\n]/.test(returnTo))returnTo='/#my-space';
     const state=secret(),verifier=secret();run('INSERT INTO oauth_states VALUES(?,?,?,?,?)',hash(state),provider,verifier,returnTo,now()+600);
     const target=new URL(provider==='google'?'https://accounts.google.com/o/oauth2/v2/auth':'https://nid.naver.com/oauth2.0/authorize');
     const params={response_type:'code',client_id:settings[`${provider.toUpperCase()}_CLIENT_ID`],redirect_uri:`${origin}/auth/${provider}/callback`,state};
     if(provider==='google')Object.assign(params,{scope:'openid email',code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'});
     target.search=new URLSearchParams(params).toString();return redirect(target.toString(),cookie('seoul_oauth',hash(state),600));
    }
    const state=url.searchParams.get('state')||'',code=url.searchParams.get('code');
    const record=transaction(()=>{const r=get('SELECT * FROM oauth_states WHERE state_hash=?',hash(state));if(!r||r.provider!==provider||r.expires_at<=now()||!equal(cookies(request).seoul_oauth,hash(state))||!code)throw new Failure(400,'로그인 요청이 만료되었습니다. 다시 로그인해주세요.');run('DELETE FROM oauth_states WHERE state_hash=?',hash(state));return r;});
    const profile=await providerIdentity(provider,code,state,record.verifier),user=establishIdentity(provider,profile);
    const token=secret();run('INSERT INTO sessions VALUES(?,?,?,?)',hash(token),user.id,secret(),now()+86400);
    const destination=new URL(record.return_to,origin);destination.searchParams.set('auth_status',user.participant_id?'approved':'pending');
    return redirect(destination.toString(),cookie('seoul_session',token,86400));
   }
   if(path.startsWith('/auth/')||path.startsWith('/admin/')){
    const user=identity(request);
    if(path.startsWith('/admin/'))admin(user);
    if(request.method==='POST'){
     csrf(request,user);const data=await readBody(request);
     if(path==='/auth/logout'){run('DELETE FROM sessions WHERE token_hash=?',hash(cookies(request).seoul_session));return json({signed_out:true},200,{'Set-Cookie':cookie('seoul_session','',0)});}
     if(path==='/auth/approval-requests'){
      if(user.participant_id)throw new Failure(409,'이미 연결된 계정입니다. 운영팀에 문의해주세요.');
      const email=normalize(data.nasa_email);
      transaction(()=>{const prior=requestFor(user);if(prior&&['approved','rejected','additional_review'].includes(prior.status))throw new Failure(409,'운영팀 확인이 필요합니다.');
       if(prior?.email===email)return;
       if(prior){run("UPDATE verifications SET status='revoked' WHERE request_id=?",prior.id);run("UPDATE approval_requests SET email=?,status='pending',version=version+1 WHERE id=?",email,prior.id);}
       else run('INSERT INTO approval_requests(id,identity_id,event_id,email,created_at) VALUES(?,?,?,?,?)',randomUUID(),user.id,event,email,now());});
      return json({requested:true});
     }
     if(path==='/auth/email-verifications')return json(await sendVerification(user));
     if(path==='/auth/email-verifications/confirm')return json(confirm(user,data.token));
     const decisionRoute=path.match(/^\/admin\/approval-requests\/([^/]+)\/decision$/);
     if(decisionRoute)return json(decision(user,decisionRoute[1],data));
    }
    if(request.method==='GET'&&path==='/admin/approval-requests'){
     const rows=all('SELECT r.*,i.provider,i.email AS login_email FROM approval_requests r JOIN identities i ON i.id=r.identity_id WHERE r.event_id=? ORDER BY r.created_at DESC LIMIT 200',event);
     return json({requests:rows.map(r=>({...r,verification_status:verificationFor(r)?.status||'not_sent',candidates:all('SELECT * FROM participants WHERE event_id=? AND nasa_email=?',event,r.email)}))});
    }
    return json({message:'지원하지 않는 요청입니다.'},404);
   }
   if(request.method==='GET'&&path==='/verify-email')return new Response(readFileSync(resolve(root,'verify.html')),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"}});
   if(request.method==='GET'&&path==='/verify.js')return new Response(readFileSync(resolve(root,'verify.js')),{headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'}});
   if(request.method==='GET'&&path==='/admin') {const user=identity(request);admin(user);return new Response(readFileSync(resolve(root,'admin.html')),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"}});}
   if(request.method==='GET'&&path==='/admin.js') {admin(identity(request));return new Response(readFileSync(resolve(root,'admin.js')),{headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'}});}
   if(request.method==='GET'&&path==='/auth-config.js')return new Response(`window.SEOUL_HUB_AUTH_CONFIG=Object.freeze(${JSON.stringify({backendBaseUrl:origin,enabledProviders:['google','naver'].filter(p=>settings[`${p.toUpperCase()}_CLIENT_ID`]&&settings[`${p.toUpperCase()}_CLIENT_SECRET`])})});`,{headers:{'Content-Type':'text/javascript','Cache-Control':'no-store'}});
   if(request.method==='GET'){
    const base=resolve(root,'../dist'),file=resolve(base,decodeURIComponent(path==='/'?'index.html':path.slice(1)));
    if(!file.startsWith(base+'/')||!existsSync(file)||!['.html','.css','.js'].includes(extname(file)))return json({message:'페이지를 찾을 수 없습니다.'},404);
    return new Response(readFileSync(file),{headers:{'Content-Type':{'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript'}[extname(file)]}});
   }
   return json({message:'지원하지 않는 요청입니다.'},405);
  }catch(error){return json({message:error instanceof Failure?error.message:'요청을 처리하지 못했습니다. 다시 시도해주세요.'},error instanceof Failure?error.status:500);}
 }
 return {handle,db,establishIdentity,close:()=>db.close()};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const dbPath=process.env.HUB_DB_PATH||resolve(root,'private/hub.sqlite');mkdirSync(dirname(dbPath),{recursive:true,mode:0o700});
 const app=createApp({env:{HUB_DB_PATH:dbPath}}),origin=new URL(process.env.PUBLIC_HUB_ORIGIN||'http://127.0.0.1:8787');
 createServer(async(req,res)=>{
  // Bound request body before constructing a Fetch Request. Never log URLs or payloads.
  let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16384){res.writeHead(413);res.end();return;}chunks.push(chunk);}
  const input=new Request(new URL(req.url,origin),{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const result=await app.handle(input);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }).listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log('MY SPACE local server ready (loopback only).'));
}
