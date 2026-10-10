(() => {
  'use strict';
  const policy = window.SEOUL_HUB_POLICY;
  const replyPolicy = policy.replyPolicy;
  window.SEOUL_INTEREST_POLICY = replyPolicy;
  // Explicit local review fixtures only. Production requires authenticated API storage.
  if (!window.SEOUL_HUB_PREVIEW || !window.SEOUL_HUB_AUTH?.canUseParticipantFeatures()) return;
  const owner = window.SEOUL_HUB_AUTH.getUserState() === 'owner';
  const me = owner ? 'review-owner' : 'review-participant';
  const key = 'seoul-review-interest-threads-v1';
  const loadThreads = window.SEOUL_REVIEW_STORE.loadThreads;
  let threads = loadThreads();
  function recipientFor(target) {
    if (target.recipientType === 'team' && target.recipientId === 'my-team') return 'review-owner';
    const party = ['review-participant', 'review-owner'].find(party => window.SEOUL_HUB_CONTACT.reviewProfile(party).randomId === target.recipientId);
    return party || `${target.recipientType}:${target.recipientId}`;
  }
  window.SEOUL_INTEREST_GATE = target => {
    const recipient = recipientFor(target);
    if (recipient === me) return { allowed: false, message: '내 프로필이나 내 팀에는 관심을 보낼 수 없습니다.' };
    if (target.recipientType === 'participant' && recipient.startsWith('review-') && window.SEOUL_HUB_CONTACT.reviewProfile(recipient).seekingStatus !== 'seeking') return { allowed: false, message: '상대방이 팀 찾기를 중지했습니다. 기존 대화는 계속할 수 있습니다.' };
    if (recipient === 'review-participant' && ['paused', 'completed'].includes(localStorage.getItem(`seoul-review-seeking-${recipient}`))) return { allowed: false, message: '상대방이 팀 찾기를 중지했습니다. 기존 대화는 계속할 수 있습니다.' };
    if (target.recipientType === 'team' && recipient === 'review-owner' && ['paused', 'completed'].includes(localStorage.getItem('seoul-review-recruitment-review-owner'))) return { allowed: false, message: '이 팀은 허브에서 모집을 중지했습니다. 기존 대화는 계속할 수 있습니다.' };
    const pair = loadThreads().filter(t => (t.starter === me && t.recipient === recipient) || (t.starter === recipient && t.recipient === me));
    if (pair.some(t => policy.threadStatus(t) === 'active')) return { allowed: false, message: '진행 중인 대화가 있습니다. MY SPACE에서 기존 대화 로그를 열어주세요.' };
    if (pair.length >= policy.LIMITS.threadsPerPair) return { allowed: false, message: '같은 상대와의 새 관심 대화는 행사 기간 동안 최대 3개입니다.' };
    return { allowed: true };
  };
  function save() { window.SEOUL_REVIEW_STORE.saveThreads(threads); }
  const el = (tag, text, className) => { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; };
  function renderCard(thread) {
    const policy = replyPolicy(thread, me);
    const other = me === thread.starter ? thread.recipient : thread.starter;
    const otherPolicy = replyPolicy(thread, other);
    const card = el('article', '', 'interest-thread');
    const finished = policy.status !== 'active';
    const heading = el('div', '', 'thread-heading');
    const otherName = other === 'review-participant' ? window.SEOUL_HUB_CONTACT.reviewProfile(other).randomId : other === 'review-owner' ? window.SEOUL_HUB_CONTACT.reviewTeam().name : thread.names[other] || other;
    heading.append(el('b', otherName));
    if (!finished) {
      const status = el('span', policy.canReply ? '답변 필요' : '대기', 'thread-status');
      status.dataset.status = policy.canReply ? 'reply' : 'waiting';
      heading.append(status);
    } else {
      heading.append(el('span', policy.status === 'expired' ? '5일 미응답 종료' : '대화 완료', 'thread-status'));
    }
    card.append(heading);
    const quota = el('div', '', 'thread-quota-row');
    quota.append(el('span', `나 ${policy.used}/${policy.limit}회 ${finished ? ' · 종료' : ` · 남음 ${policy.remaining}`}`, 'quota-mine'), el('span', `상대 ${otherPolicy.used}/${otherPolicy.limit}회 ${finished ? ' · 종료' : ` · 남음 ${otherPolicy.remaining}`}`, 'quota-other'), el('span', `대화 ${thread.messages.length}/5${finished ? (policy.status === 'expired' ? ' · 자동 종료' : ' · 완료') : ''}`, 'quota-total'));
    card.append(quota);
    const pairCount = threads.filter(t => [t.starter, t.recipient].includes(me) && [t.starter, t.recipient].includes(other)).length;
    card.append(el('small', `이 상대와 관심 대화 ${pairCount}/3개 · 행사 기간 기준`));
    const log = el('ol', '', 'thread-messages');
    thread.messages.forEach(message => {
      const row = el('li', '', message.sender === me ? 'mine' : 'theirs');
      row.append(el('small', `${message.sender === me ? '나' : otherName} · ${message.at}`), el('p', message.text));
      log.append(row);
    });
    const conversation = el('details', '', 'thread-conversation');
    const summary = el('summary', `대화 로그 보기 · ${thread.messages.length}개 메시지`);
    conversation.append(summary, log);
    if (policy.canReply) {
      const form = el('form', '', 'thread-reply');
      const input = el('textarea'); input.maxLength = 50; input.rows = 2; input.required = true; input.placeholder = '답변을 입력하세요. 최대 50자'; input.setAttribute('aria-label', `${thread.names[other]}에게 답변`);
      const count = el('small', '0 / 50');
      const button = el('button', '답변 보내기', 'interest-action'); button.type = 'submit';
      input.addEventListener('input', () => { count.textContent = `${input.value.length} / 50`; });
      form.append(input, count, button);
      form.addEventListener('submit', event => {
        event.preventDefault();
        const message = input.value.trim();
        threads = loadThreads();
        const current = threads.find(item => item.id === thread.id);
        if (!window.SEOUL_HUB_AUTH?.canUseParticipantFeatures() || !current || !replyPolicy(current, me).canReply || !message || message.length > 50) { render(); return; }
        const at = new Date().toISOString();
        current.messages.push({ sender: me, text: message, at: new Date().toLocaleString('ko-KR'), at_iso: at });
        current.last_message_at = at;
        save(); render();
      });
      conversation.append(form);
    }
    card.append(conversation);
    const contact = other === 'review-owner' ? { type: 'team', id: 'my-team' }
      : other === 'review-participant' ? { type: 'participant', id: window.SEOUL_HUB_CONTACT.reviewProfile(other).randomId }
      : thread.contacts?.[other] || (other.startsWith('participant:') ? { type: 'participant', id: other.slice(12) } : other.startsWith('team:') ? { type: 'team', id: other.slice(5) } : null);
    if (contact) {
      const email = el('button', '이메일 보내기', 'email-action'); email.type = 'button';
      email.disabled = contact.type === 'team' ? !window.SEOUL_HUB_CONTACT.canEmailTeam(contact.id) : !window.SEOUL_HUB_CONTACT.canEmailParticipant(contact.id);
      if (email.disabled) email.title = '이메일 수신에 동의한 참가자에게만 보낼 수 있습니다.';
      email.addEventListener('click', () => window.dispatchEvent(new CustomEvent('seoul-thread-email', { detail: contact })));
      card.append(email);
    }
    conversation.append(el('small', '검토용 대화 · 같은 브라우저의 두 역할에서 확인 가능'));
    return card;
  }
  function renderList(list, records) {
    list.replaceChildren(); records.forEach(thread => list.append(renderCard(thread)));
    if (!records.length) list.append(el('p', '아직 관심 기록이 없습니다.'));
  }
  function render() {
    const sent = threads.filter(thread => thread.starter === me);
    const received = threads.filter(thread => thread.recipient === me);
    renderList(document.querySelector('#sent-contact-log .contact-log-list'), sent);
    renderList(document.querySelector('#received-contact-log .contact-log-list'), received);
    document.querySelector('#sent-contact-log .save-state').textContent = `${sent.length}건`;
    document.querySelector('#received-contact-log .save-state').textContent = `${received.length}건`;
    if (owner) { renderList(document.getElementById('request-list'), received); document.getElementById('request-count').textContent = received.length; }
  }
  window.addEventListener('seoul-interest-sent', event => {
    const target = event.detail;
    if (!window.SEOUL_INTEREST_GATE(target).allowed) return;
    threads = loadThreads();
    const recipient = recipientFor(target);
    const at = new Date().toISOString();
    threads.unshift({ created_at: at, last_message_at: at, id: `review-thread-${Date.now()}`, starter: me, recipient, names: { [me]: owner ? 'Lunar Window Lab' : window.SEOUL_HUB_CONTACT.reviewProfile(me).randomId, [recipient]: target.teamName }, messages: [{ sender: me, text: target.message, at: new Date().toLocaleString('ko-KR'), at_iso: at }] });
    save(); render();
  });
  window.addEventListener('seoul-interest-refresh', () => { threads = loadThreads(); render(); });
  window.addEventListener('storage', event => { if (event.key === key) { threads = loadThreads(); render(); } });
  const refresh = () => { threads = loadThreads(); render(); };
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  setInterval(refresh, 60000);
  render();
})();
