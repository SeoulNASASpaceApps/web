(() => {
  'use strict';
  // Only the separate review document includes this file. No real identity or data.
  const roles = ['anonymous', 'pending', 'participant', 'owner'];
  const approvalStages = ['required', 'email_pending', 'review_pending', 'expired', 'additional_review', 'rejected'];
  const query = new URLSearchParams(location.search);
  const queryRole = query.get('role');
  const queryStage = query.get('stage');
  const role = roles.includes(queryRole) ? queryRole : 'participant';
  let approvalStage = approvalStages.includes(queryStage)
    ? queryStage
    : localStorage.getItem('seoul-review-approval-stage-v2') || 'required';
  const fixture = {
    profile: { seekingStatus: role === 'owner' ? 'completed' : 'seeking', randomId: role === 'owner' ? 'ORBIT-OWNER' : 'ORBIT-7K2M', completed: true, currentRoles: ['data-ai', 'design'], desiredRoles: ['product', 'data-ai'], copy: '환경 데이터를 이해하기 쉬운 화면과 서비스로 만드는 데 관심이 있습니다.', emailOptIn: ['participant', 'owner'].includes(role), peerEmailOptIn: ['participant', 'owner'].includes(role), challenges: ['clps-browser', 'earth-trend'] },
    ownerTeam: role === 'owner' ? { id: 'my-team', sample: true, name: 'Lunar Window Lab', challengeId: 'clps-browser', members: 3, openings: 3, roles: ['software','design'], copy: '달 탐사 데이터를 한눈에 살펴보는 서비스를 함께 만들 팀원을 찾습니다.', url: '', seeking: true, lastConfirmed: '검토용 예시' } : null
  };
  window.SEOUL_HUB_PREVIEW = Object.freeze({role, fixture, verifiedTeamMembership: role === 'owner'});
  window.SEOUL_HUB_AUTH = Object.freeze({
    isAuthenticated: () => role !== 'anonymous',
    canUseParticipantFeatures: () => ['participant', 'owner'].includes(role),
    getUserState: () => role,
    getApprovalStage: () => approvalStage,
    requireLogin(message) {
      window.dispatchEvent(new Event('seoul-approval-refresh'));
      const box = document.getElementById('auth-connection-state');
      box.hidden = false;
      box.textContent = role === 'pending' ? '서울 참가 기록 확인이 필요합니다. NASA 등록 이메일로 확인을 요청해주세요.' : message;
      document.getElementById('login-dialog').showModal(); return false;
    }
  });
  document.getElementById("approval-request-panel").hidden = role !== "pending";
  function refreshApproval() {
    if (role !== 'pending') return;
    document.getElementById('auth-availability-note').textContent = '검토용 상태입니다. 실제 인증 메일·승인 요청은 전송되지 않습니다.';
    window.SEOUL_APPROVAL_FLOW.render();
    const stageSelector = document.getElementById('preview-approval-stage');
    stageSelector.parentElement.hidden = false;
    stageSelector.value = window.SEOUL_HUB_AUTH.getApprovalStage();
  }
  window.addEventListener('seoul-approval-refresh', refreshApproval);
  function setApprovalStage(stage) {
    if (!approvalStages.includes(stage)) return;
    approvalStage = stage;
    localStorage.setItem('seoul-review-approval-stage-v2', stage);
    if (role === 'pending') {
      const url = new URL(location.href);
      url.searchParams.set('role', 'pending');
      url.searchParams.set('stage', stage);
      history.replaceState(null, '', url);
    }
    window.dispatchEvent(new Event('seoul-approval-refresh'));
  }
  document.getElementById('preview-approval-stage').addEventListener('change', event => {
    setApprovalStage(event.target.value);
  });
  function simulateMail() {
    setApprovalStage('email_pending');
    document.getElementById('approval-nasa-email').value = '';
    document.getElementById('approval-request-state').textContent = '검토용 인증 메일 대기 상태입니다. 실제 이메일은 저장·전송되지 않았습니다.';
  }
  document.getElementById('approval-request-submit').addEventListener('click', () => {
    if (role !== 'pending') return;
    const input = document.getElementById('approval-nasa-email');
    if (!input.value || !input.reportValidity()) return;
    simulateMail();
  });
  document.getElementById('approval-resend').addEventListener('click', simulateMail);
  document.getElementById('approval-refresh').addEventListener('click', refreshApproval);
  refreshApproval();
  const selector = document.getElementById('preview-role'); selector.value = role;
  selector.addEventListener('change', () => {
    const target = new URL('review.html', location.href);
    target.searchParams.set('role', selector.value);
    if (selector.value === 'pending') target.searchParams.set('stage', approvalStage);
    target.hash = 'my-space';
    location.assign(target);
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-signout]')) location.assign('review.html?role=anonymous#my-space');
  });
  // Capture the email submit before the app handler: review never calls a relay.
  document.addEventListener('submit', event => {
    if (event.target.id !== 'participant-contact-form') return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!document.getElementById('sender-email-consent').checked || !document.getElementById('participant-contact-message').value.trim()) return;
    const box = document.getElementById('relay-submit-state'); box.hidden = false;
    box.textContent = '검토용 화면입니다. 실제 이메일은 발송하지 않으며 본문도 저장하지 않습니다.';
    document.getElementById('participant-contact-message').value = '';
  }, true);
})();
