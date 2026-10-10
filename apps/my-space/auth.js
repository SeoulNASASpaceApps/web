(() => {
  'use strict';
  const config = window.SEOUL_HUB_AUTH_CONFIG || {};
  const allowedProviders = new Set(['google', 'naver']);
  const enabledProviders = new Set((config.enabledProviders || []).filter(p => allowedProviders.has(p)));
  const backendBaseUrl = (config.backendBaseUrl || '').trim().replace(/\/$/, '');
  let session = null, ready = false;
  const byId = id => document.getElementById(id);
  function showState(message, kind = 'info') {
    const box = byId('auth-connection-state'); box.hidden = false; box.dataset.kind = kind; box.textContent = message;
  }
  const role = () => session?.authenticated ? (session.linked_status === 'linked' ? 'connected' : 'pending') : 'anonymous';
  const stage = () => session?.approval_stage || 'required';
  window.SEOUL_HUB_AUTH = Object.freeze({
    isAuthenticated: () => ready && session?.authenticated === true,
    // Participant data endpoints are not yet integrated; never unlock fixture writes.
    canUseParticipantFeatures: () => false,
    getUserState: role,
    getApprovalStage: stage,
    refreshSession,
    requireLogin(message) {
      window.dispatchEvent(new Event('seoul-approval-refresh'));
      byId('login-dialog').showModal(); showState(message); return false;
    }
  });
  async function api(path, data) {
    if (!backendBaseUrl) throw new Error('서버 연결을 준비 중입니다. 이메일은 저장·전송되지 않았습니다.');
    const response = await fetch(`${backendBaseUrl}${path}`, {
      credentials: 'include', cache: 'no-store',
      ...(data !== undefined ? {method: 'POST', headers: {'Content-Type': 'application/json', 'X-CSRF-Token': session?.csrf_token || ''}, body: JSON.stringify(data)} : {})
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || '요청을 처리하지 못했습니다. 다시 시도해주세요.');
    return result;
  }
  async function refreshSession() {
    if (window.SEOUL_HUB_PREVIEW || !backendBaseUrl) return;
    try { session = await api('/auth/session'); ready = true; window.dispatchEvent(new Event('seoul-approval-refresh')); }
    catch (_) { ready = false; session = null; showState('로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.', 'error'); }
  }
  async function sendVerification(resend) {
    if (window.SEOUL_HUB_PREVIEW) return;
    const input = byId('approval-nasa-email');
    if (!resend && (!input.value || !input.reportValidity())) return;
    const button = byId(resend ? 'approval-resend' : 'approval-request-submit'); button.disabled = true;
    try {
      if (!resend) await api('/auth/approval-requests', {nasa_email: input.value});
      await api('/auth/email-verifications', {});
      input.value = ''; byId('approval-request-state').textContent = '인증 메일을 요청했습니다. 메일의 링크를 확인해주세요.';
      await refreshSession();
    } catch (error) { byId('approval-request-state').textContent = error.message; await refreshSession(); }
    finally { button.disabled = false; }
  }
  byId('approval-request-submit').addEventListener('click', () => sendVerification(false));
  byId('approval-resend').addEventListener('click', () => sendVerification(true));
  byId('approval-refresh').addEventListener('click', refreshSession);
  document.querySelectorAll('[data-auth-provider]').forEach(button => {
    const provider = button.dataset.authProvider;
    const available = backendBaseUrl && enabledProviders.has(provider);
    button.setAttribute('aria-disabled', available ? 'false' : 'true');
    button.addEventListener('click', () => {
      if (!available) { showState('로그인 기능을 준비 중입니다.', 'pending'); return; }
      const startUrl = new URL(`${backendBaseUrl}/auth/${provider}/start`);
      startUrl.searchParams.set('return_to', `${location.pathname}${location.hash || '#my-space'}`);
      location.assign(startUrl.toString());
    });
  });
  document.addEventListener('click', async event => {
    if (!event.target.closest('[data-signout]') || window.SEOUL_HUB_PREVIEW || !backendBaseUrl) return;
    try { await api('/auth/logout', {}); session = null; window.dispatchEvent(new Event('seoul-approval-refresh')); }
    catch (error) { showState(error.message, 'error'); }
  });
  byId('auth-availability-note').textContent = backendBaseUrl ? '' : '현재 화면에서는 실제 로그인·인증 메일 발송이 연결되지 않았습니다.';
  const params = new URLSearchParams(location.search), callback = params.get('auth_status');
  if (callback) {
    // Callback query values never establish identity or approval.
    const messages = {pending: '서버에서 인증·승인 상태를 확인하고 있습니다.', approved: '서버에서 계정 연결 결과를 확인하고 있습니다.', rejected: '계정 연결을 확인하지 못했습니다.', error: '로그인을 완료하지 못했습니다.'};
    if (messages[callback]) { byId('login-dialog').showModal(); showState(messages[callback]); }
    params.delete('auth_status'); history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  refreshSession();
})();
