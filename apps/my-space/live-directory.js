(() => {
  'use strict';
  if (window.SEOUL_HUB_PREVIEW) return;
  const auth = window.SEOUL_HUB_AUTH;
  const catalog = window.SEOUL_HUB_CATALOG;
  let ready = false, participantId = '', refreshFlight = null;
  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const roleLabel = id => catalog.ROLES.find(role => role.id === id)?.label || id;
  const challengeLabel = id => catalog.CHALLENGES.find(challenge => challenge.id === id)?.title || id;
  const liveDirectory = {};
  Object.defineProperty(liveDirectory, 'ready', {get: () => ready});
  window.SEOUL_LIVE_DIRECTORY = Object.freeze(liveDirectory);

  function renderDirectory(participants) {
    const grid = document.querySelector('.participant-card-grid');
    grid.replaceChildren();
    for (const profile of participants) {
      const card = document.createElement('article');
      card.className = 'participant-card';
      card.dataset.participantId = profile.participant_id;
      card.dataset.challengeIds = (profile.challenge_ids || []).join(' ');
      card.innerHTML = `<div><span class="participant-avatar">${escapeHtml(profile.avatar_code || 'ID')}</span><span><small>SEEKING TEAM</small><b>${escapeHtml(profile.display_id)}</b></span></div>
        <p>${escapeHtml(profile.bio || '함께할 팀을 찾고 있습니다.')}</p>
        <dl><div><dt>현재 역할</dt><dd>${escapeHtml((profile.current_role_ids || []).map(roleLabel).join(' · ') || '미설정')}</dd></div>
        <div><dt>희망 역할</dt><dd>${escapeHtml((profile.desired_role_ids || []).map(roleLabel).join(' · ') || '미설정')}</dd></div>
        <div><dt>관심 Challenge</dt><dd>${escapeHtml((profile.challenge_ids || []).map(challengeLabel).join(' · ') || '미설정')}</dd></div></dl>
        <div class="participant-actions"><button class="interest-action" type="button">관심 메시지 보내기</button></div>`;
      card.querySelector('button').addEventListener('click', () => window.dispatchEvent(new CustomEvent('seoul-open-participant-interest', {detail:{participantId:profile.participant_id}})));
      grid.append(card);
    }
    byId('participant-filter-summary').textContent = `팀을 찾는 승인 참가자 ${participants.length}명`;
    byId('participant-empty').hidden = participants.length !== 0;
    byId('participant-login-gate').hidden = true;
    byId('participant-directory-content').hidden = false;
  }

  function threadCard(thread) {
    const card = document.createElement('article');
    card.className = 'interest-thread';
    const mine = thread.starter_participant_id === participantId;
    const messages = thread.messages || [];
    const expired = thread.thread_status !== 'active' || Date.parse(thread.expires_at) <= Date.now();
    const myTurn = !expired && messages.length < 5 && messages.at(-1)?.sender_participant_id !== participantId;
    card.innerHTML = `<div class="thread-heading"><b>${escapeHtml(thread.other?.display_id || '참가자')}</b><span class="thread-status">${expired ? '종료' : myTurn ? '답변 필요' : '대기'}</span></div>
      <small>대화 ${messages.length}/5 · 상대별 최대 3개 · 5일 미응답 시 종료</small>
      <ol class="thread-messages">${messages.map(message=>`<li class="${message.sender_participant_id===participantId?'mine':'theirs'}"><small>${message.sender_participant_id===participantId?'나':escapeHtml(thread.other?.display_id||'상대')} · ${escapeHtml(new Date(message.created_at).toLocaleString('ko-KR'))}</small><p>${escapeHtml(message.message_text)}</p></li>`).join('')}</ol>
      ${myTurn?'<form class="thread-reply"><textarea maxlength="50" rows="2" required placeholder="답변을 입력하세요. 최대 50자"></textarea><button class="interest-action" type="submit">답변 보내기</button></form>':''}`;
    const form = card.querySelector('form');
    form?.addEventListener('submit', async event => {
      event.preventDefault(); const input=form.querySelector('textarea'),text=input.value.trim(); if(!text)return;
      const button=form.querySelector('button');button.disabled=true;
      try { await auth.replyInterest(thread.thread_id, thread.version, text); await refresh(); }
      catch (error) { button.disabled=false; alert(error.message || '답변을 보내지 못했습니다.'); }
    });
    return {card,mine};
  }

  function renderThreads(data) {
    participantId = data.participant_id;
    const sent = document.querySelector('#sent-contact-log .contact-log-list');
    const received = document.querySelector('#received-contact-log .contact-log-list');
    sent.replaceChildren(); received.replaceChildren();
    let sentCount=0,receivedCount=0;
    for (const thread of data.threads || []) {
      const rendered=threadCard(thread);
      if(rendered.mine){sent.append(rendered.card);sentCount++;}else{received.append(rendered.card);receivedCount++;}
    }
    if(!sentCount)sent.textContent='아직 보낸 관심 메시지가 없습니다.';
    if(!receivedCount)received.textContent='아직 받은 관심 메시지가 없습니다.';
    document.querySelector('#sent-contact-log .save-state').textContent=`${sentCount}건`;
    document.querySelector('#received-contact-log .save-state').textContent=`${receivedCount}건`;
  }

  async function refresh() {
    if (!auth?.canUseParticipantFeatures?.()) { ready=false; return; }
    if (refreshFlight) return refreshFlight;
    refreshFlight = Promise.all([auth.listDirectory(), auth.listInterests()]).then(([directory,interests])=>{
      renderDirectory(directory.participants || []);renderThreads(interests);ready=true;
      window.dispatchEvent(new Event('seoul-live-directory-ready'));
    }).catch(error=>{
      ready=false;byId('participant-login-gate').hidden=false;byId('participant-directory-content').hidden=true;
      byId('participant-login-gate').querySelector('h3').textContent='참가자 목록을 불러오지 못했습니다.';
      byId('participant-login-gate').querySelector('p').textContent=error.message||'잠시 후 다시 시도해주세요.';
    }).finally(()=>{refreshFlight=null;});
    return refreshFlight;
  }
  window.SEOUL_LIVE_INTEREST = Object.freeze({
    async send(recipientParticipantId,messageText){await auth.createInterest(recipientParticipantId,messageText);await refresh();},
    refresh
  });
  window.addEventListener('seoul-server-workspace', refresh);
  window.addEventListener('focus', refresh);
  setInterval(refresh, 60000);
  refresh();
})();
