const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const dir = path.resolve(__dirname, '..');
async function fixture(state,{ready=true,workspaceFails=false}={}) {
  const dom = new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{
    url:'https://site.test/my-space/?auth_status=approved',runScripts:'outside-only'});
  const w=dom.window,requests=[];
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.SEOUL_HUB_AUTH_CONFIG={backendBaseUrl:'https://api.test',enabledProviders:['google','naver']};
  w.fetch=async url=>{
    const pathname=new URL(url).pathname;
    requests.push(pathname);
    const value=pathname==='/auth/config'?{storage_ready:ready,enabledProviders:ready?['google']:[]}:
      pathname==='/auth/session'?state:pathname==='/auth/logout'?{signed_out:true}:
      {role:state.role,participant_id:'synthetic-id',profile:null};
    return {ok:!(pathname==='/api/my-space'&&workspaceFails),json:async()=>value};
  };
  w.eval(fs.readFileSync(path.join(dir,'auth.js'),'utf8'));
  await new Promise(resolve=>setTimeout(resolve,5));
  return {w,requests,close:()=>w.close()};
}
test('server-backed approval enables MY SPACE identity view while unsupported writes stay locked',async()=>{
  const f=await fixture({authenticated:true,workspace_access:true,role:'participant',linked_status:'linked',approval_stage:'connected'});
  assert.equal(f.w.SEOUL_HUB_AUTH.getUserState(),'participant');
  assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),true);
  assert.equal(f.w.SEOUL_HUB_AUTH.canUseParticipantFeatures(),false);
  assert.equal(f.w.document.querySelector('[data-auth-provider="google"]').getAttribute('aria-disabled'),'false');
  assert.equal(f.w.document.querySelector('[data-auth-provider="naver"]').getAttribute('aria-disabled'),'true');
  f.close();
});
test('pending/rejected/suspended state and failed workspace response cannot expose approved view',async()=>{
  for(const stage of ['required','review_pending','rejected','suspended']){
    const f=await fixture({authenticated:true,workspace_access:false,role:'pending',approval_stage:stage});
    assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),false);
    assert.equal(f.w.SEOUL_HUB_AUTH.getUserState(),'pending');f.close();
  }
  const f=await fixture({authenticated:true,workspace_access:true,role:'owner'},{workspaceFails:true});
  assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),false);f.close();
});
test('missing settings and callback query alone never enable login or approved view',async()=>{
  const f=await fixture({authenticated:false},{ready:false});
  assert.equal(f.w.SEOUL_HUB_AUTH.canAccessMySpace(),false);
  assert.equal(f.w.SEOUL_HUB_AUTH.getUserState(),'anonymous');
  assert.ok([...f.w.document.querySelectorAll('[data-auth-provider]')].every(b=>b.getAttribute('aria-disabled')==='true'));
  f.close();
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
