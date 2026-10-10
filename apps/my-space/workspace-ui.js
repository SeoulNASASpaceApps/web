(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const state = () => window.SEOUL_HUB_AUTH?.getUserState() || 'anonymous';
  const canUse = () => ['participant', 'owner'].includes(state());
  function showWorkspace(view = 'profile') {
    const role = state();
    if (role === 'owner' && view === 'received') view = 'inbox';
    const allowed = canUse();
    byId('my-space-login-gate').hidden = allowed;
    byId('my-space-content').hidden = !allowed;
    const pending = ['pending', 'connected'].includes(role);
    const requested = window.SEOUL_APPROVAL_FLOW?.getStage() === 'review_pending';
    byId('my-space-gate-title').textContent = pending ? (requested ? '서울 참가 기록을 확인하고 있습니다.' : '서울 참가 기록 확인이 필요합니다.') : '로그인 후 MY SPACE를 이용할 수 있습니다.';
    byId('my-space-gate-copy').textContent = pending ? (requested ? '확인 요청이 접수되었습니다. 운영팀 확인 후 MY SPACE를 이용할 수 있습니다.' : 'NASA 등록 이메일을 입력하고 참가 기록 확인을 요청해주세요.') : '내 참가 상태와 프로필을 확인하고, 함께할 팀을 찾아보세요.';
    byId('my-space-login-gate').querySelector('button').hidden = pending && requested;
    document.querySelectorAll('[data-owner-navigation]').forEach(el => el.hidden = role !== 'owner');
    const owner = role === 'owner';
    document.querySelectorAll('[data-participant-navigation]').forEach(el => el.hidden = owner);
    document.querySelectorAll('[data-sent-navigation] span').forEach(el => el.textContent = owner ? '04' : '03');
    byId('interest-logs').classList.toggle('participant-interest-logs', !owner);
    byId('interest-logs').classList.toggle('owner-interest-logs', owner);
    byId('profile-editor').hidden = ['sent', 'received'].includes(view);
    byId('profile-session-role').textContent = owner ? 'Team Owner' : 'APPROVED PARTICIPANT';
    byId('profile-session-status').textContent = owner ? '서울 참가 확인 완료 · Team Owner' : '서울 참가 확인 완료';
    byId('profile-owner-badge').hidden = !owner;
    const activeHref = view === 'received' || (!owner && view === 'sent') ? '#received-contact-log' : view === 'sent' ? '#sent-contact-log' : view === 'inbox' ? '#owner-inbox' : view === 'owner' ? '#owner-title' : '#profile';
    document.querySelectorAll('.case-menu a').forEach(link => {
      const active = link.getAttribute('href') === activeHref;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.getElementById('owner-form').hidden = owner && view === 'inbox';
    document.querySelector('.owner-layout').classList.toggle('inbox-view', owner && view === 'inbox');
    document.querySelector('.owner-session-card strong').textContent = document.getElementById('session-id').textContent;
    const teamView = owner && ['owner', 'inbox'].includes(view);
    document.querySelector('.participant-case').hidden = !allowed || teamView;
    document.querySelector('.owner-case').hidden = !teamView;
    const header = document.querySelector('.header-actions [data-open-login]');
    window.SEOUL_APPROVAL_FLOW?.render();
    header.textContent = allowed ? 'MY SPACE' : pending ? '참가 확인' : '로그인';
    if (!pending) byId('my-space-login-gate').querySelector('button').textContent = '로그인';
  }
  window.addEventListener('seoul-workspace-view', event => showWorkspace(event.detail));
  document.addEventListener('click', event => {
    if (event.target.closest('a[href="#my-space"]')) showWorkspace('profile');
    const nav = event.target.closest('.case-menu a');
    if (nav) {
      const views = { '#profile': 'profile', '#received-contact-log': 'received', '#sent-contact-log': 'sent', '#owner-title': 'owner', '#owner-inbox': 'inbox' };
      showWorkspace(views[nav.getAttribute('href')] || 'profile');
    }
    const login = event.target.closest('[data-open-login]');
    if (login && canUse()) {
      event.preventDefault(); event.stopImmediatePropagation();
      showWorkspace('profile'); location.hash = 'my-space';
    }
  }, true);
  const viewForHash = () => ({ '#profile': 'profile', '#received-contact-log': 'received', '#sent-contact-log': 'sent', '#owner-title': 'owner', '#owner-inbox': 'inbox' }[location.hash] || 'profile');
  window.addEventListener('hashchange', () => showWorkspace(viewForHash()));
  window.addEventListener('seoul-approval-refresh', () => showWorkspace(viewForHash()));
  showWorkspace(viewForHash());
})();
