const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const dir = path.resolve(__dirname, '..');
async function fixture(state,{ready=true,workspaceFails=false,sessionFails=false,sessionWait=null,configWait=null,configFails=false,callback=true}={}) {
  const dom = new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{
    url:`https://site.test/my-space/${callback?'?auth_status=approved':''}#match`,runScripts:'outside-only'});
  const w=dom.window,requests=[],navigations=[];
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.SEOUL_HUB_AUTH_CONFIG={backendBaseUrl:'https://api.test',enabledProviders:['google','naver']};
  w.fetch=async (url,options={})=>{
    const pathname=new URL(url).pathname;
    requests.push(pathname);
    if(pathname==='/auth/config') {
      if(configWait) await configWait;
      if(configFails) throw new Error('Connection unavailable');
    }
    if(pathname==='/auth/session') {
      if(sessionWait) await sessionWait;
      if(sessionFails) throw new Error('Session unavailable');
    }
    const value=pathname==='/auth/config'?{storage_ready:ready,enabledProviders:ready?['google']:[]}:
      pathname==='/auth/session'?state:pathname==='/auth/logout'?{signed_out:true}:
      pathname==='/api/my-space/profile'?{saved:true,row_version:2}:
      {role:state.role,participant_id:'synthetic-id',profile:{display_id:'',avatar_code:'',current_role_ids:[],
        desired_role_ids:['product'],bio:'',challenge_ids:[],email_from_owner_opt_in:false,
        email_from_peer_opt_in:false,profile_status:'draft',seeking_status:'paused',row_version:1}};
    return {ok:!(pathname==='/api/my-space'&&workspaceFails),json:async()=>value};
  };
  // Keep real DOM and URL behavior; capture cross-origin navigation without leaving the fixture.
  const testLocation={
    get pathname(){return w.location.pathname;},get search(){return w.location.search;},
    get hash(){return w.location.hash;},set hash(value){w.location.hash=value;},
    assign:url=>navigations.push(url)
  };
  w.eval(`(function(location){${fs.readFileSync(path.join(dir,'auth.js'),'utf8')}\n})`)(testLocation);
  w.eval(fs.readFileSync(path.join(dir,'approval-flow.js'),'utf8'));
  w.eval(fs.readFileSync(path.join(dir,'workspace-ui.js'),'utf8'));
  await new Promise(resolve=>setTimeout(resolve,5));
  return {w,requests,navigations,close:()=>w.close()};
}
test('server-backed approval enables MY SPACE identity view and versioned profile writes',async()=>{
  const f=await fixture({authenticated:true,workspace_access:true,profile_features_ready:true,participant_features_ready:true,csrf_token:'csrf',role:'participant',linked_status:'linked',approval_stage:'connected'});
  assert.equal(f.w.SEOUL_HUB_AUTH.getUserState(),'participant');
  assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),true);
  assert.equal(f.w.SEOUL_HUB_AUTH.canSaveProfile(),true);
  assert.equal(f.w.SEOUL_HUB_AUTH.canUseParticipantFeatures(),true);
  assert.equal(f.w.document.getElementById('login-dialog').open,false);
  assert.equal(f.w.location.hash,'#my-space');
  assert.equal(f.w.document.getElementById('auth-connection-state').hidden,true);
  assert.equal(f.w.document.activeElement.id,'my-space');
  assert.equal(f.w.document.getElementById('my-space-content').hidden,false);
  assert.equal((await f.w.SEOUL_HUB_AUTH.saveProfile({row_version:1})).row_version,2);
  assert.ok(f.requests.includes('/api/my-space/profile'));
  assert.equal(f.w.document.querySelector('[data-auth-provider="google"]').getAttribute('aria-disabled'),'false');
  assert.equal(f.w.document.querySelector('[data-auth-provider="naver"]').getAttribute('aria-disabled'),'true');
  f.close();
});
test('pending/rejected/suspended state and failed workspace response cannot expose approved view',async()=>{
  for(const stage of ['required','review_pending','rejected','suspended']){
    const f=await fixture({authenticated:true,workspace_access:false,role:'pending',approval_stage:stage});
    assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),false);
    assert.equal(f.w.document.getElementById('login-dialog').open,false);
    assert.equal(f.w.location.hash,'#my-space');
    assert.equal(f.w.document.getElementById('my-space-content').hidden,true);
    assert.equal(f.w.document.getElementById('my-space-login-gate').hidden,false);
    assert.equal(f.w.document.getElementById('my-space-gate-title').textContent,f.w.SEOUL_APPROVAL_FLOW.get().title);
    assert.equal(f.w.SEOUL_HUB_AUTH.getUserState(),'pending');f.close();
  }
  const f=await fixture({authenticated:true,workspace_access:true,role:'owner'},{workspaceFails:true});
  assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),false);
  assert.equal(f.w.document.getElementById('login-dialog').open,true);f.close();
});
test('missing settings and callback query alone never enable login or approved view',async()=>{
  const f=await fixture({authenticated:false},{ready:false});
  assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),false);
  assert.equal(f.w.SEOUL_HUB_AUTH.getUserState(),'anonymous');
  assert.equal(f.w.document.getElementById('login-dialog').open,true);
  assert.equal(f.w.location.hash,'#match');
  assert.equal(f.w.document.getElementById('auth-connection-state').textContent,'로그인 세션을 확인하지 못했습니다. 같은 브라우저에서 다시 로그인해주세요.');
  assert.ok([...f.w.document.querySelectorAll('[data-auth-provider]')].every(b=>b.getAttribute('aria-disabled')==='true'));
  f.close();
});

test('callback waits for the server before closing and keeps failures visible',async()=>{
  let release;
  const sessionWait=new Promise(resolve=>{release=resolve;});
  const f=await fixture({authenticated:true,workspace_access:true,role:'participant'},{sessionWait});
  assert.equal(f.w.document.getElementById('login-dialog').open,true);
  assert.equal(f.w.location.hash,'#match');
  release();await f.w.SEOUL_HUB_AUTH.refreshSession();
  assert.equal(f.w.document.getElementById('login-dialog').open,false);
  assert.equal(f.w.location.hash,'#my-space');f.close();
  const failed=await fixture({authenticated:true},{sessionFails:true});
  assert.equal(failed.w.document.getElementById('login-dialog').open,true);
  assert.equal(failed.w.document.getElementById('auth-connection-state').dataset.kind,'error');
  assert.equal(failed.w.location.hash,'#match');failed.close();
});

test('later approval refreshes and ordinary visits do not close a dialog or change navigation',async()=>{
  const f=await fixture({authenticated:true,workspace_access:false,role:'pending',approval_stage:'required'});
  f.w.document.getElementById('login-dialog').showModal();
  f.w.location.hash='match';
  await f.w.SEOUL_HUB_AUTH.refreshSession();
  assert.equal(f.w.document.getElementById('login-dialog').open,true);
  assert.equal(f.w.location.hash,'#match');f.close();
  const visit=await fixture({authenticated:true,workspace_access:true,role:'participant'},{callback:false});
  assert.equal(visit.w.location.hash,'#match');visit.close();
});

test('initial load queries session once, repeated concurrent refreshes coalesce and no polling is started',async()=>{
  const f=await fixture({authenticated:true,workspace_access:true,role:'participant'});
  assert.deepEqual(f.requests.sort(),['/api/my-space','/auth/config','/auth/session']);
  const original=f.w.fetch;
  f.w.fetch=async(...args)=>{await new Promise(resolve=>setTimeout(resolve,10));return original(...args);};
  f.requests.length=0;
  const a=f.w.SEOUL_HUB_AUTH.refreshSession(),b=f.w.SEOUL_HUB_AUTH.refreshSession(),c=f.w.SEOUL_HUB_AUTH.refreshSession();
  assert.equal(a,b);assert.equal(b,c);await a;
  assert.deepEqual(f.requests,['/auth/session','/api/my-space']);
  await new Promise(resolve=>setTimeout(resolve,30));assert.equal(f.requests.length,2);
  assert.equal(f.w.document.getElementById('approval-refresh').disabled,false);f.close();
});

test('first provider choice continues after readiness arrives without a second click',async()=>{
  let release;
  const configWait=new Promise(resolve=>{release=resolve;});
  const f=await fixture({authenticated:false},{callback:false,configWait});
  const button=f.w.document.querySelector('[data-auth-provider="google"]');
  const notice=f.w.document.getElementById('auth-connection-state');
  button.click();button.click();f.w.document.querySelector('[data-auth-provider="naver"]').click();
  assert.equal(notice.textContent,'로그인 연결을 확인하고 있습니다. 잠시만 기다려주세요.');
  assert.equal(notice.dataset.kind,'pending');
  assert.equal(f.requests.filter(p=>p==='/auth/config').length,1);
  release();await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(button.getAttribute('aria-disabled'),'false');
  assert.equal(notice.textContent,'Google 로그인으로 이동합니다.');
  assert.deepEqual(f.navigations,['https://api.test/auth/google/start?return_to=%2Fmy-space%2F%23match']);f.close();
});

test('failed login connection shows an error and a later click can recover',async()=>{
  const f=await fixture({authenticated:false},{callback:false,configFails:true});
  const button=f.w.document.querySelector('[data-auth-provider="google"]');
  const notice=f.w.document.getElementById('auth-connection-state');
  button.click();await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(notice.textContent,'로그인 서버에 연결하지 못했습니다. 다시 시도해주세요.');
  assert.equal(notice.dataset.kind,'error');
  const original=f.w.fetch;
  f.w.fetch=async(url,...args)=>new URL(url).pathname==='/auth/config'
    ? {ok:true,json:async()=>({storage_ready:true,enabledProviders:['google']})}
    : original(url,...args);
  button.click();await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(button.getAttribute('aria-disabled'),'false');
  assert.equal(notice.textContent,'Google 로그인으로 이동합니다.');
  assert.equal(f.navigations.length,1);f.close();
});

test('closing the dialog cancels pending login and a new choice works after reopening',async()=>{
  let release;
  const configWait=new Promise(resolve=>{release=resolve;});
  const f=await fixture({authenticated:false},{callback:false,configWait});
  const dialog=f.w.document.getElementById('login-dialog');dialog.showModal();
  f.w.document.querySelector('[data-auth-provider="google"]').click();dialog.close();
  release();await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(f.navigations.length,0);
  assert.equal(f.w.document.getElementById('auth-connection-state').hidden,true);
  dialog.showModal();f.w.document.querySelector('[data-auth-provider="google"]').click();
  assert.equal(f.navigations.length,1);f.close();
});

test('login guidance returns after signout and Naver uses its own start endpoint',async()=>{
  const f=await fixture({authenticated:true,workspace_access:false,role:'pending',approval_stage:'required'});
  assert.equal(f.w.document.getElementById('login-email-guidance').hidden,true);
  f.w.document.querySelector('[data-signout]').click();await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(f.w.document.getElementById('login-email-guidance').hidden,false);
  assert.match(f.w.document.querySelector('.login-intro').textContent,/NASA 공식 등록/);
  const original=f.w.fetch;
  f.w.fetch=async(url,...args)=>new URL(url).pathname==='/auth/config'
    ? {ok:true,json:async()=>({storage_ready:true,enabledProviders:['naver']})}
    : original(url,...args);
  f.w.document.querySelector('[data-auth-provider="naver"]').click();
  await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(f.w.document.getElementById('auth-connection-state').textContent,'Naver 로그인으로 이동합니다.');
  assert.match(f.navigations[0],/^https:\/\/api.test\/auth\/naver\/start\?/);f.close();
});
