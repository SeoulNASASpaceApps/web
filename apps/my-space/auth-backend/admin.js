(() => {
 'use strict';
 const byId=id=>document.getElementById(id);let session;
 const make=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
 async function api(path,data){const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...(data?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf_token},body:JSON.stringify(data)}:{})});const result=await response.json();if(!response.ok)throw new Error(result.message);return result;}
 async function load(){
  try{session=await api('/auth/session');if(!session.is_admin)throw new Error('운영자 계정으로 로그인해주세요.');const result=await api('/admin/approval-requests');byId('requests').replaceChildren();byId('state').textContent=result.requests.length?`${result.requests.length}개 요청`:'현재 요청이 없습니다.';
   for(const row of result.requests){
    const card=make('article'),dl=make('dl');card.append(make('h2',`${row.status} · ${row.verification_status}`));
    for(const [title,value]of [['NASA 등록 이메일',row.email],['소셜 로그인 이메일',row.login_email||'제공되지 않음'],['로그인 제공자',row.provider],['등록 대조',row.candidates.length===1?'유일 기록':`${row.candidates.length}개 기록 · 추가 확인 필요`]]){dl.append(make('dt',title),make('dd',value));}card.append(dl);
    const select=make('select');select.setAttribute('aria-label','연결할 참가 기록');select.append(new Option('참가 기록 선택',''));
    for(const p of row.candidates){select.append(new Option(`${p.name} · NASA ${p.official_confirmed?'확인':'미확인'} · 서울 ${p.seoul_confirmed?'확인':'미확인'} · 보호자 ${p.guardian_status} · 자격 ${p.eligible?'확인':'미확인'}`,p.id));}card.append(select);
    const label=make('label'),checked=make('input');checked.type='checkbox';label.append(checked,document.createTextNode('NASA 등록·서울 Form·이름·보호자 확인·연결 충돌을 대조했습니다.'));card.append(label);
    const reason=make('input');reason.placeholder='처리 사유 (선택)';reason.maxLength=300;reason.setAttribute('aria-label','처리 사유');card.append(reason);
    for(const [decision,text]of [['approved','승인'],['additional_review','추가 확인'],['rejected','거절']]){const button=make('button',text);button.disabled=row.status==='approved';button.addEventListener('click',async()=>{button.disabled=true;try{await api(`/admin/approval-requests/${row.id}/decision`,{decision,version:row.version,participant_id:select.value,records_checked:checked.checked,reason:reason.value});await load();}catch(error){byId('state').textContent=error.message;button.disabled=false;}});card.append(button);}
    byId('requests').append(card);
   }
  }catch(error){byId('state').textContent=error.message;}
 }
 byId('refresh').addEventListener('click',load);load();
})();
