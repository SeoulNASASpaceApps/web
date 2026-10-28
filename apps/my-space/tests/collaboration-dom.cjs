const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),dir=path.resolve(__dirname,'..');
const settle=()=>new Promise(resolve=>setTimeout(resolve,10));
function fixture({role='participant',saveTeam,sendRelay}={}){
  const dom=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{url:'https://site.test/#my-space',runScripts:'outside-only'});
  const w=dom.window;w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  const snapshot={role,profile:{display_id:'ORBIT-ONE',current_role_ids:['software'],desired_role_ids:['product'],
    challenge_ids:['earth-trend'],bio:'Profile',row_version:1,profile_status:'completed',seeking_status:'paused'},
    owner_teams:role==='owner'?[{team_id:'trusted-team',name:'Trusted Official Team',url:'https://www.spaceappschallenge.org/2026/find-a-team/trusted/',
      challenge_id:'earth-trend',role_ids:['software'],copy:'Existing recruitment',members:2,openings:2,recruitment_status:'seeking',row_version:7}]:[]};
  w.SEOUL_HUB_AUTH={getUserState:()=>role,canUseParticipantFeatures:()=>true,canSaveProfile:()=>true,
    getWorkspaceSnapshot:()=>snapshot,getApprovalStage:()=> 'connected',isAuthenticated:()=>true,requireLogin:()=>true,
    saveTeam:saveTeam||(async()=>({saved:true})),sendRelay:sendRelay||(async()=>({status:'sent'}))};
  w.SEOUL_LIVE_DIRECTORY={ready:true,canEmail:()=>true,displayName:()=> 'ORBIT-TWO'};
  w.SEOUL_LIVE_INTEREST={refresh:async()=>{}};
  w.fetch=async()=>({ok:true,json:async()=>({teams:[],syncedAt:'test'})});
  for(const file of ['hub-policy.js','match-catalog.js','match.js'])w.eval(fs.readFileSync(path.join(dir,file),'utf8'));
  w.dispatchEvent(new w.Event('seoul-server-workspace'));
  return {w,d:w.document,close:()=>w.close()};
}
test('owner form uses server team identity, persists through the API, and never reports success after failure',async()=>{
  const calls=[];let reject=true;
  const f=fixture({role:'owner',saveTeam:async data=>{calls.push(data);if(reject)throw new Error('Save rejected');return {saved:true};}});
  assert.equal(f.d.getElementById('owner-team-name').value,'Trusted Official Team');
  assert.equal(f.d.getElementById('owner-team-url').readOnly,true);
  assert.equal(f.d.getElementById('owner-challenge').disabled,true);
  f.d.getElementById('owner-copy').value='New recruitment copy';
  f.d.getElementById('owner-form').dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));
  assert.equal(f.d.getElementById('owner-preview-dialog').open,true);
  f.d.getElementById('owner-preview-save').click();await settle();
  assert.equal(f.d.getElementById('owner-preview-dialog').open,true);
  assert.equal(f.d.getElementById('hub-toast').textContent,'Save rejected');
  assert.equal(calls[0].team_id,'trusted-team');assert.equal(calls[0].row_version,7);
  assert.equal(Object.hasOwn(calls[0],'owner_participant_id'),false);
  reject=false;f.d.getElementById('owner-preview-save').click();await settle();
  assert.equal(f.d.getElementById('owner-preview-dialog').open,false);
  assert.equal(f.d.getElementById('hub-toast').textContent,'모집글을 저장했습니다.');f.close();
});
test('relay UI retains a failed request key and sends only target ID, message and explicit disclosure consent',async()=>{
  const calls=[];let reject=true;
  const f=fixture({sendRelay:async data=>{calls.push(data);if(reject)throw new Error('Delivery pending');return {status:'sent'};}});
  f.w.dispatchEvent(new f.w.CustomEvent('seoul-thread-email',{detail:{type:'participant',id:'trusted-recipient'}}));
  assert.equal(f.d.getElementById('email-dialog').open,true);
  f.d.getElementById('participant-contact-message').value='Join our team?';
  f.d.getElementById('sender-email-consent').checked=true;
  const submit=()=>f.d.getElementById('participant-contact-form').dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));
  submit();await settle();assert.equal(f.d.getElementById('relay-submit-state').textContent,'Delivery pending');
  reject=false;submit();await settle();
  assert.equal(calls.length,2);assert.equal(calls[0].idempotency_key,calls[1].idempotency_key);
  assert.equal(calls[0].recipient_participant_id,'trusted-recipient');
  assert.equal(calls[0].sender_email_disclosure_consent,true);
  assert.equal(Object.hasOwn(calls[0],'sender_participant_id'),false);
  assert.equal(f.d.getElementById('participant-contact-message').value,'');
  assert.match(f.d.getElementById('relay-submit-state').textContent,/접수/);f.close();
});
