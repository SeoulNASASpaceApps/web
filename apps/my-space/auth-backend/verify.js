(() => {
 'use strict';
 let token=new URLSearchParams(location.hash.slice(1)).get('token');
 // Keep the secret in memory only, never storage or request paths.
 history.replaceState({},'',location.pathname);
 const state=document.getElementById('state'),button=document.getElementById('confirm'),login=document.getElementById('login');let session;
 async function load(){
  if(!token){state.textContent='메일의 인증 링크를 다시 열어주세요. 만료되었다면 새 링크를 요청해주세요.';return;}
  try{const response=await fetch('/auth/session',{cache:'no-store',credentials:'same-origin'});if(!response.ok)throw new Error();session=await response.json();
   if(!session.authenticated){state.textContent='이 링크를 요청한 계정으로 로그인한 뒤 메일의 링크를 다시 열어주세요.';login.hidden=false;return;}
   state.textContent='아래 버튼을 눌러 이메일 인증을 완료해주세요.';button.hidden=false;
  }catch{state.textContent='로그인 상태를 확인하지 못했습니다. 메일의 링크를 다시 열어주세요.';}
 }
 button.addEventListener('click',async()=>{
  button.disabled=true;
  try{const response=await fetch('/auth/email-verifications/confirm',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf_token},body:JSON.stringify({token})});const result=await response.json();if(!response.ok)throw new Error(result.message);token=null;button.hidden=true;state.textContent='이메일 인증이 완료되었습니다. 운영팀이 참가 기록을 확인하고 있습니다.';}
  catch(error){state.textContent=error.message||'인증을 완료하지 못했습니다. 링크를 다시 요청해주세요.';}
  finally{button.disabled=false;}
 });
 load();
})();
