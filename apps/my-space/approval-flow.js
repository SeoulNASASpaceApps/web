(() => {
  'use strict';
  const steps = {
    required: { title: 'NASA 등록 이메일 인증이 필요합니다.', copy: 'NASA 등록 이메일로 인증 링크를 받으세요. 인증 후 운영팀이 참가 기록을 확인합니다.', action: '인증 메일 요청', chip: '이메일 인증 필요' },
    email_pending: { title: 'NASA 등록 이메일을 인증해주세요.', copy: '요청한 메일의 링크를 열고, 지금 로그인한 계정으로 인증을 완료해주세요. 아직 MY SPACE 이용 승인은 완료되지 않았습니다.', action: '인증 상태 보기', chip: '이메일 인증 대기' },
    review_pending: { title: '서울 참가 기록을 확인하고 있습니다.', copy: '이메일 인증이 완료되었습니다. 운영팀이 NASA 등록과 서울 참가 확인 정보를 대조한 뒤 계정을 연결합니다.', action: '확인 상태 보기', chip: '운영팀 확인 대기' },
    additional_review: { title: '운영팀의 추가 확인이 필요합니다.', copy: '참가 기록 또는 기존 계정 연결을 확인하고 있습니다. 운영팀 안내를 확인해주세요.', action: '확인 상태 보기', chip: '추가 확인' },
    expired: { title: '인증 링크를 다시 요청해주세요.', copy: '인증 링크가 만료되었거나 취소되었습니다. 새 링크를 요청하고 이메일 인증을 완료해주세요.', action: '인증 메일 다시 요청', chip: '이메일 재인증 필요' },
    rejected: { title: '계정 연결을 확인하지 못했습니다.', copy: '서울 운영팀에 문의해주세요. 이메일 인증만으로 이용 승인이 완료되지는 않습니다.', action: '확인 상태 보기', chip: '운영팀 문의' },
    connected: { title: '참가 계정 연결이 완료되었습니다.', copy: '참가자 기능 연결을 준비하고 있습니다. 팀 연락 수신 동의는 이용 가능해진 뒤 내 프로필에서 따로 설정합니다.', action: '확인 상태 보기', chip: '계정 연결 완료' }
  };
  const getStage = () => window.SEOUL_HUB_AUTH?.getApprovalStage?.() || 'required';
  const get = () => steps[getStage()] || steps.required;
  function render() {
    const role = window.SEOUL_HUB_AUTH?.getUserState?.();
    if (!['pending', 'connected'].includes(role)) return;
    const item = get(), stage = getStage();
    const byId = id => document.getElementById(id);
    const panel = byId('approval-request-panel'); panel.hidden = false;
    panel.querySelector('b').textContent = item.title;
    byId('approval-stage-copy').textContent = item.copy;
    panel.querySelector('label').hidden = !['required', 'expired'].includes(stage);
    byId('approval-request-submit').hidden = !['required', 'expired'].includes(stage);
    byId('approval-resend').hidden = stage !== 'email_pending';
    byId('approval-refresh').hidden = stage === 'required';
    document.querySelector('.auth-provider-actions').hidden = true;
    document.querySelector('.login-intro').textContent = 'NASA 등록 이메일 인증과 MY SPACE 이용 승인은 별도 단계입니다.';
    byId('my-space-gate-title').textContent = item.title;
    byId('my-space-gate-copy').textContent = item.copy;
    const button = byId('my-space-login-gate').querySelector('button'); button.hidden = false; button.textContent = item.action;
    document.querySelector('.verified-chip').textContent = item.chip;
    byId('journey-current-title').textContent = item.title;
    byId('journey-current-body').textContent = item.copy;
    byId('journey-next-action').textContent = item.action;
    byId('journey-next-note').textContent = '인증 완료 후에도 운영팀 승인 전에는 참가자 기능을 이용할 수 없습니다.';
  }
  window.SEOUL_APPROVAL_FLOW = Object.freeze({getStage, get, render});
  window.addEventListener('seoul-approval-refresh', render);
})();
