import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {createHash,randomUUID} from 'node:crypto';
import {createApp} from './server.mjs';
const digest=s=>createHash('sha256').update(s).digest('hex');
function fixture(env={}){
 let time=2000000000;const mails=[];const app=createApp({db:new DatabaseSync(':memory:'),env:{PUBLIC_HUB_ORIGIN:'http://127.0.0.1:8787',ADMIN_IDENTITIES:'google:admin',...env},now:()=>time,mailer:async mail=>{mails.push(mail);return 'test-message';}});
 const request=async(path,{token,csrf,body,method='GET',origin='http://127.0.0.1:8787'}={})=>app.handle(new Request(`http://127.0.0.1:8787${path}`,{method,headers:{...(token?{Cookie:`seoul_session=${token}`} :{}),...(csrf?{'X-CSRF-Token':csrf}:{}),...(method==='POST'?{Origin:origin,'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})}));
 const login=(sub,email='login@example.com',verified=true,provider='google')=>{const user=app.establishIdentity(provider,{sub,email,email_verified:verified}),token=randomUUID(),csrf=randomUUID();app.db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token),user.id,csrf,time+86400);return {...user,token,csrf};};
 const participant=(email='nasa@example.com',overrides={})=>{const p={id:randomUUID(),event:'space-apps-seoul-2026',email,name:'Test Participant',official:1,seoul:1,guardian:'not_required',eligible:1,status:'pending',...overrides};app.db.prepare('INSERT INTO participants VALUES(?,?,?,?,?,?,?,?,?,?)').run(p.id,p.event,p.email,p.name,p.official,p.seoul,p.guardian,p.eligible,p.status,time);return p;};
 const post=(path,user,body={})=>request(path,{...user,body,method:'POST'});
 async function verify(user,email='nasa@example.com'){assert.equal((await post('/auth/approval-requests',user,{nasa_email:email})).status,200);assert.equal((await post('/auth/email-verifications',user)).status,200);const token=new URL(mails.at(-1).link).hash.slice(7);assert.equal((await post('/auth/email-verifications/confirm',user,{token})).status,200);return token;}
 return {app,mails,request,login,participant,post,verify,tick:n=>{time+=n;}};
}
test('typed email and link GET never grant approval; explicit confirmation requires requesting identity',async()=>{
 const f=fixture(),user=f.login('user');f.participant();
 assert.equal((await f.post('/auth/approval-requests',user,{nasa_email:'nasa@example.com'})).status,200);
 assert.equal((await f.post('/auth/email-verifications',user)).status,200);
 assert.equal((await f.request('/verify-email',{token:user.token})).status,200);
 const state=await(await f.request('/auth/session',user)).json();assert.equal(state.approval_stage,'email_pending');assert.equal(state.linked_status,'pending');
 const raw=new URL(f.mails[0].link).hash.slice(7);assert.equal(f.app.db.prepare('SELECT token_hash FROM verifications').get().token_hash,digest(raw));
 const other=f.login('other');assert.equal((await f.post('/auth/email-verifications/confirm',other,{token:raw})).status,400);
 assert.equal((await f.post('/auth/email-verifications/confirm',user,{token:raw})).status,200);
 assert.equal((await f.post('/auth/email-verifications/confirm',user,{token:raw})).status,200);
 assert.equal(f.app.db.prepare("SELECT COUNT(*) n FROM verifications WHERE status='verified'").get().n,1);
 const verified=await(await f.request('/auth/session',user)).json();assert.equal(verified.approval_stage,'review_pending');assert.equal(verified.linked_status,'pending');f.app.close();
});
test('operator approval requires evidence and latest version; contact consents stay off',async()=>{
 const f=fixture(),user=f.login('user'),operator=f.login('admin'),p=f.participant();
 const reqPath=()=>'/admin/approval-requests/'+f.app.db.prepare('SELECT id FROM approval_requests').get().id+'/decision';
 await f.post('/auth/approval-requests',user,{nasa_email:p.email});
 assert.equal((await f.post(reqPath(),operator,{decision:'approved',version:1,participant_id:p.id,records_checked:true})).status,409);
 await f.verify(user);assert.equal((await f.post(reqPath(),user,{decision:'approved',version:1,participant_id:p.id,records_checked:true})).status,403);
 assert.equal((await f.post(reqPath(),operator,{decision:'additional_review',version:1})).status,200);
 assert.equal((await f.post(reqPath(),operator,{decision:'approved',version:1,participant_id:p.id,records_checked:true})).status,409);
 assert.equal((await f.post(reqPath(),operator,{decision:'approved',version:2,participant_id:p.id,records_checked:true})).status,200);
 const status=await(await f.request('/auth/session',user)).json();assert.equal(status.linked_status,'linked');
 const profile=f.app.db.prepare('SELECT * FROM profiles').get();assert.equal(profile.owner_email_opt_in,0);assert.equal(profile.peer_email_opt_in,0);assert.equal(f.app.db.prepare('SELECT COUNT(*) n FROM approval_audit').get().n,2);f.app.close();
});
test('expiry, resend revocation, hourly cap and target change invalidate old tokens',async()=>{
 const f=fixture(),u=f.login('user');await f.post('/auth/approval-requests',u,{nasa_email:'nasa@example.com'});await f.post('/auth/email-verifications',u);const token1=new URL(f.mails.at(-1).link).hash.slice(7);
 assert.equal((await f.post('/auth/email-verifications',u)).status,429);f.tick(61);await f.post('/auth/email-verifications',u);assert.equal((await f.post('/auth/email-verifications/confirm',u,{token:token1})).status,400);const token2=new URL(f.mails.at(-1).link).hash.slice(7);
 await f.post('/auth/approval-requests',u,{nasa_email:'changed@example.com'});assert.equal((await f.post('/auth/email-verifications/confirm',u,{token:token2})).status,400);
 f.tick(61);await f.post('/auth/email-verifications',u);const token3=new URL(f.mails.at(-1).link).hash.slice(7);f.tick(61);assert.equal((await f.post('/auth/email-verifications',u)).status,429);f.tick(1800);assert.equal((await f.post('/auth/email-verifications/confirm',u,{token:token3})).status,400);f.app.close();
});
test('CSRF and server session required; callback query and browser role do not authenticate',async()=>{
 const f=fixture(),u=f.login('user');assert.equal((await f.post('/auth/approval-requests',{...u,csrf:'bad'},{nasa_email:'x@example.com'})).status,403);
 assert.equal((await f.request('/auth/approval-requests',{...u,body:{nasa_email:'x@example.com'},method:'POST',origin:'https://other.test'})).status,403);
 assert.equal((await f.request('/auth/session?auth_status=approved&role=owner')).status,200);assert.equal((await(await f.request('/auth/session?auth_status=approved')).json()).authenticated,false);
 assert.equal((await f.request('/admin/approval-requests')).status,401);assert.equal((await f.post('/auth/logout',u)).status,200);assert.equal((await(await f.request('/auth/session',u)).json()).authenticated,false);f.app.close();
});
test('unique verified match links automatically, duplicates and unverified emails do not',()=>{
 const f=fixture();f.participant('unique@example.com',{status:'approved'});const a=f.login('unique','unique@example.com');assert.ok(a.participant_id);
 f.participant('duplicate@example.com',{status:'approved'});f.participant('duplicate@example.com',{status:'approved'});assert.equal(f.login('dup','duplicate@example.com').participant_id,null);
 f.participant('naver@example.com',{status:'approved'});assert.equal(f.login('naver','naver@example.com',false,'naver').participant_id,null);
 f.participant('suspended@example.com',{status:'suspended'});assert.equal(f.login('suspended','suspended@example.com').participant_id,null);
 assert.equal(f.login('second','unique@example.com').participant_id,null);f.app.close();
});
test('eligibility changes and conflicting identities block operator approval',async()=>{
 const f=fixture(),u=f.login('user'),a=f.login('admin'),p=f.participant();await f.verify(u);
 const id=f.app.db.prepare('SELECT id FROM approval_requests').get().id,data={decision:'approved',version:1,participant_id:p.id,records_checked:true};
 f.app.db.prepare("UPDATE participants SET guardian_status='pending' WHERE id=?").run(p.id);assert.equal((await f.post(`/admin/approval-requests/${id}/decision`,a,data)).status,409);
 f.app.db.prepare("UPDATE participants SET guardian_status='verified' WHERE id=?").run(p.id);const other=f.login('other');f.app.db.prepare('UPDATE identities SET participant_id=? WHERE id=?').run(p.id,other.id);assert.equal((await f.post(`/admin/approval-requests/${id}/decision`,a,data)).status,409);f.app.close();
});
test('failed delivery keeps unapproved and cannot confirm reserved token',async()=>{
 const db=new DatabaseSync(':memory:');let captured;const app=createApp({db,env:{PUBLIC_HUB_ORIGIN:'http://127.0.0.1:8787'},mailer:async m=>{captured=m;throw new Error('secret provider response');}});
 const u=app.establishIdentity('google',{sub:'user',email:'u@example.com',email_verified:true});const token='session',csrf='csrf';db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token),u.id,csrf,9999999999);
 const post=(path,body)=>app.handle(new Request('http://127.0.0.1:8787'+path,{method:'POST',headers:{Cookie:'seoul_session=session',Origin:'http://127.0.0.1:8787','X-CSRF-Token':csrf},body:JSON.stringify(body)}));
 await post('/auth/approval-requests',{nasa_email:'nasa@example.com'});const result=await post('/auth/email-verifications',{});assert.equal(result.status,500);assert.equal((await result.text()).includes('secret'),false);assert.equal(db.prepare('SELECT status,send_status FROM verifications').get().status,'revoked');assert.equal((await post('/auth/email-verifications/confirm',{token:new URL(captured.link).hash.slice(7)})).status,400);app.close();
});
test('OAuth state is bound to cookie and single use; Google PKCE and server profile are verified through provider adapters',async()=>{
 const calls=[],db=new DatabaseSync(':memory:');const app=createApp({db,env:{PUBLIC_HUB_ORIGIN:'http://127.0.0.1:8787',GOOGLE_CLIENT_ID:'test-client',GOOGLE_CLIENT_SECRET:'test-secret'},fetchRemote:async(url,options)=>{calls.push({url,options});return Response.json(url.includes('/token')?{access_token:'provider-access-token'}:{sub:'verified-sub',email:'verified@example.com',email_verified:true});}});
 const start=await app.handle(new Request('http://127.0.0.1:8787/auth/google/start?return_to=//attacker.test'));assert.equal(start.status,302);const target=new URL(start.headers.get('location'));assert.equal(target.searchParams.get('code_challenge_method'),'S256');const state=target.searchParams.get('state'),cookie=start.headers.get('set-cookie').split(';')[0];
 const callback=`http://127.0.0.1:8787/auth/google/callback?code=test-code&state=${state}`;
 assert.equal((await app.handle(new Request(callback))).status,400);
 const result=await app.handle(new Request(callback,{headers:{Cookie:cookie}}));assert.equal(result.status,302);assert.equal(new URL(result.headers.get('location')).origin,'http://127.0.0.1:8787');assert.match(result.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);assert.equal(calls.length,2);assert.ok(calls[0].options.body.get('code_verifier'));assert.equal(calls[1].options.headers.Authorization,'Bearer provider-access-token');
 assert.equal((await app.handle(new Request(callback,{headers:{Cookie:cookie}}))).status,400);assert.equal(calls.length,2);app.close();
});
