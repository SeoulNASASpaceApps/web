(() => {
  'use strict';
  if (!window.SEOUL_HUB_PREVIEW) return;
  const preview=window.SEOUL_HUB_PREVIEW;
  const key=`space-apps-seoul-review-${preview.role}-v1`,teamKey='seoul-review-owner-team';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||clone(fallback);}catch{return clone(fallback);}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  function loadState(){
    const empty=window.SEOUL_HUB_CATALOG.createState();
    const fallback={...empty,...clone(preview.fixture),ownerRoles:preview.fixture.ownerTeam?.roles || ['software','design'],profile:{...empty.profile,...clone(preview.fixture.profile)}};
    const loaded=read(key,fallback),state={...empty,...loaded,profile:{...empty.profile,...loaded.profile}};
    state.ownerContacts=(state.ownerContacts||[]).map(({message,...metadata})=>metadata);
    // Apply verified membership once; a later explicit seeking choice is preserved.
    if(preview.verifiedTeamMembership&&!localStorage.getItem('seoul-review-owner-membership-applied-v1')){
      state.profile.seekingStatus='completed';localStorage.setItem('seoul-review-seeking-review-owner','completed');localStorage.setItem('seoul-review-owner-membership-applied-v1','true');
    }
    if(preview.role==='owner'&&state.profile.randomId==='ORBIT-7K2M')state.profile.randomId='ORBIT-OWNER';
    return state;
  }
  function readProfile(party){
    const fallback=party==='review-owner'
      ?{randomId:'ORBIT-OWNER',seekingStatus:'completed',emailOptIn:true,peerEmailOptIn:true,challenges:['clps-browser'],currentRoles:['software'],desiredRoles:['design'],copy:'함께 프로젝트를 만들 대원을 찾습니다.'}
      :{randomId:'ORBIT-7K2M',seekingStatus:'seeking',emailOptIn:true,peerEmailOptIn:true,challenges:['clps-browser','earth-trend'],currentRoles:['data-ai','design'],desiredRoles:['product'],copy:'데이터 분석과 디자인 역할로 함께하고 싶습니다.'};
    return read(`seoul-review-profile-${party}`,fallback);
  }
  function readTeam(){return read(teamKey,{id:'my-team',name:'Lunar Window Lab',challengeId:'clps-browser',roles:['software','design'],copy:'달 탐사 데이터를 한눈에 살펴보는 서비스를 함께 만들 팀원을 찾습니다.',members:3,openings:3,seeking:true,recruitmentStatus:'seeking',url:'https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams',review:true});}
  function publishProfile(profile){if(window.SEOUL_HUB_AUTH.canUseParticipantFeatures())write(`seoul-review-profile-${preview.role==='owner'?'review-owner':'review-participant'}`,profile);}
  function saveState(state){write(key,{...state,ownerContacts:(state.ownerContacts||[]).map(({message,...metadata})=>metadata)});}
  const threadKey='seoul-review-interest-threads-v1';
  function seedThreads(){
    const at=new Date().toISOString();
    return [
      {id:'review-incoming-owner',starter:'review-participant',recipient:'review-owner',names:{'review-participant':'ORBIT-7K2M','review-owner':'Lunar Window Lab'},created_at:at,last_message_at:at,messages:[{sender:'review-participant',text:'데이터 시각화와 UX 설계 역할로 함께하고 싶습니다.',at:'검토용 예시',at_iso:at}]},
      {id:'review-incoming-participant',starter:'review-owner',recipient:'review-participant',names:{'review-participant':'ORBIT-7K2M','review-owner':'Lunar Window Lab'},created_at:at,last_message_at:at,messages:['데이터 시각화 역할로 함께하고 싶어요.','관심 감사합니다. 어떤 데이터를 다루나요?','달 탐사 데이터를 다룹니다.','이메일로 자세히 협의하면 좋겠습니다.','좋습니다. 이메일로 연락드리겠습니다.'].map((text,i)=>({sender:i%2?'review-participant':'review-owner',text,at:'검토용 예시',at_iso:at}))}
    ];
  }
  function loadThreads(){
    let threads=read(threadKey,seedThreads());if(!Array.isArray(threads))threads=seedThreads();
    const legacy=threads.find(t=>t.id==='review-incoming-participant'&&t.messages.length===1&&t.messages[0].at==='검토용 예시');
    if(legacy)legacy.messages=seedThreads()[1].messages;
    const now=Date.now();
    for(const thread of threads){
      if(!Number.isFinite(Date.parse(thread.last_message_at))){
        const latest=thread.messages.at(-1);const parsed=Date.parse(latest?.at_iso||latest?.at);
        thread.last_message_at=new Date(Number.isFinite(parsed)?parsed:now).toISOString();
        thread.created_at=thread.created_at||thread.last_message_at;
      }
      const status=window.SEOUL_HUB_POLICY.threadStatus(thread,now);
      if(status!=='active'&&thread.status!==status){
        thread.status=status;
        thread.closed_at=status==='expired'?new Date(Date.parse(thread.last_message_at)+window.SEOUL_HUB_POLICY.INACTIVITY_MS).toISOString():thread.last_message_at;
        thread.closed_reason=status==='expired'?'inactivity':'message_limit';
      }
    }
    write(threadKey,threads);return threads;
  }
  const saveThreads=threads=>write(threadKey,threads);
  window.SEOUL_REVIEW_STORE=Object.freeze({loadState,readProfile,readTeam,publishProfile,saveState,loadThreads,saveThreads,saveTeam:team=>write(teamKey,team)});
})();
