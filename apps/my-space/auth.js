(() => {
  'use strict';
  const config = window.SEOUL_HUB_AUTH_CONFIG || {};
  const allowedProviders = new Set(['google', 'naver']);
  const enabledProviders = new Set((config.enabledProviders || []).filter(p => allowedProviders.has(p)));
  const backendBaseUrl = (config.backendBaseUrl || '').trim().replace(/\/$/, '');
  let session = null, ready = false, workspace = null, sessionFlight = null, loginStarted = false, callbackNotice = null;
  const byId = id => document.getElementById(id);
  const loginIntro = document.querySelector('.login-intro').textContent;
  let loginAttempt = 0;
  function showState(message, kind = 'info') {
    const box = byId('auth-connection-state'); box.hidden = false; box.dataset.kind = kind; box.textContent = message;
  }
  function completeLogin() {
    const dialog = byId('login-dialog');
    if (dialog.open) dialog.close();
    const notice = byId('auth-connection-state');
    notice.hidden = true; notice.textContent = ''; delete notice.dataset.kind;
    location.hash = 'my-space';
    const target = byId('my-space');
    target.setAttribute('tabindex', '-1');
    target.focus({preventScroll: true});
  }
  const role = () => ready && session?.authenticated ? (session.workspace_access === true && workspace ? session.role : 'pending') : 'anonymous';
  const stage = () => session?.approval_stage || 'required';
  window.SEOUL_HUB_AUTH = Object.freeze({
    isAuthenticated: () => ready && session?.authenticated === true,
    canUseParticipantFeatures: () => ready && session?.participant_features_ready === true && session?.workspace_access === true && workspace !== null,
    canSaveProfile: () => ready && session?.profile_features_ready === true && session?.workspace_access === true && workspace !== null,
    canAccessMySpace: () => ready && session?.workspace_access === true && workspace !== null,
    getWorkspaceSnapshot: () => workspace,
    getUserState: role,
    getApprovalStage: stage,
    refreshSession,
    async saveProfile(profile) {
      if (!this.canSaveProfile()) throw new Error('프로필 저장 권한을 확인하지 못했습니다. 다시 로그인해주세요.');
      const result = await api('/api/my-space/profile', profile);
      await refreshSession();
      return result;
    },
    listDirectory: () => api('/api/directory'),
    listInterests: () => api('/api/interests'),
    listTeams: () => api('/api/teams'),
    async saveTeam(team) {
      const result=await api('/api/my-space/team',team);
      await refreshSession();
      return result;
    },
    sendRelay: data => api('/api/email-relay',data,60000),
    createInterest: (recipientParticipantId, messageText) => api('/api/interests', {recipient_participant_id: recipientParticipantId, message_text: messageText}),
    createTeamInterest: (recipientTeamId, messageText) => api('/api/interests', {recipient_team_id:recipientTeamId,message_text:messageText}),
    replyInterest: (threadId, version, messageText) => api(`/api/interests/${encodeURIComponent(threadId)}/messages`, {version, message_text: messageText}),
    requireLogin(message) {
      window.dispatchEvent(new Event('seoul-approval-refresh'));
      byId('login-dialog').showModal(); showState(message); return false;
    }
  });
  async function api(path, data, timeout=15000) {
    if (!backendBaseUrl) throw new Error('서버 연결을 준비 중입니다. 이메일은 저장·전송되지 않았습니다.');
    const response = await fetch(`${backendBaseUrl}${path}`, {
      credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(timeout),
      ...(data !== undefined ? {method: 'POST', headers: {'Content-Type': 'application/json', 'X-CSRF-Token': session?.csrf_token || ''}, body: JSON.stringify(data)} : {})
    });
    const result = await response.json();
    if (!response.ok) throw Object.assign(new Error(result.message || '요청을 처리하지 못했습니다. 다시 시도해주세요.'),{code:result.code});
    return result;
  }
  function refreshSession() {
    if (window.SEOUL_HUB_PREVIEW || !backendBaseUrl) return;
    if (sessionFlight) return sessionFlight;
    const refreshButton = byId('approval-refresh'); refreshButton.disabled = true;
    sessionFlight = (async () => {
    try {
      session = await api('/auth/session'); workspace = null;
      if (session.workspace_access === true) workspace = await api('/api/my-space');
      ready = true;
      window.dispatchEvent(new Event('seoul-server-workspace'));
      window.dispatchEvent(new Event('seoul-approval-refresh'));
      if (callbackNotice) {
        callbackNotice = null;
        if (session.authenticated === true) {
          completeLogin();
        } else {
          showState('로그인 세션을 확인하지 못했습니다. 같은 브라우저에서 다시 로그인해주세요.', 'error');
        }
      }
    }
    catch (_) { ready = false; session = null; workspace = null; window.dispatchEvent(new Event('seoul-approval-refresh')); showState('로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.', 'error'); }
    })().finally(() => { sessionFlight = null; refreshButton.disabled = false; });
    return sessionFlight;
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
  byId('login-dialog').addEventListener('close', () => {
    loginAttempt++;
    if (loginStarted) {
      const notice = byId('auth-connection-state');
      notice.hidden = true; notice.textContent = ''; delete notice.dataset.kind;
    }
    loginStarted = false;
  });
  document.querySelectorAll('[data-auth-provider]').forEach(button => {
    const provider = button.dataset.authProvider;
    const available = () => backendBaseUrl && readyProviders.has(provider);
    button.setAttribute('aria-disabled', 'true');
    button.addEventListener('click', async () => {
      if (loginStarted) return;
      loginStarted = true;
      const attempt = ++loginAttempt;
      if (!available()) {
        showState('로그인 연결을 확인하고 있습니다. 잠시만 기다려주세요.', 'pending');
        await configureProviders();
        if (attempt !== loginAttempt) return;
        if (!available()) {
          loginStarted = false;
          showState('로그인 서버에 연결하지 못했습니다. 다시 시도해주세요.', 'error');
          return;
        }
      }
      if (session?.authenticated === true) {
        await refreshSession();
        if (attempt !== loginAttempt) return;
        loginStarted = false;
        if (ready && session?.authenticated === true) completeLogin();
        else showState('로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.', 'error');
        return;
      }
      showState(`${provider === 'google' ? 'Google' : 'Naver'} 로그인으로 이동합니다.`, 'pending');
      const startUrl = new URL(`${backendBaseUrl}/auth/${provider}/start`);
      startUrl.searchParams.set('return_to', `${location.pathname}${location.hash || '#my-space'}`);
      location.assign(startUrl.toString());
    });
  });
  document.addEventListener('click', async event => {
    if (!event.target.closest('[data-signout]') || window.SEOUL_HUB_PREVIEW || !backendBaseUrl) return;
    try {
      await api('/auth/logout', {}); session = null; workspace = null; ready = true;
      byId('approval-request-panel').hidden = true;
      document.querySelector('.auth-provider-actions').hidden = false;
      byId('login-email-guidance').hidden = false;
      document.querySelector('.login-intro').textContent = loginIntro;
      window.dispatchEvent(new Event('seoul-server-workspace')); window.dispatchEvent(new Event('seoul-approval-refresh'));
      showState('로그아웃되었습니다.', 'success');
    }
    catch (error) { showState(error.message, 'error'); }
  });
  byId('auth-availability-note').textContent = backendBaseUrl ? '' : '현재 화면에서는 실제 로그인·인증 메일 발송이 연결되지 않았습니다.';
  const params = new URLSearchParams(location.search), callback = params.get('auth_status');
  if (callback) {
    // Callback query values never establish identity or approval.
    const messages = {pending: '서버에서 인증·승인 상태를 확인하고 있습니다.', approved: '서버에서 계정 연결 결과를 확인하고 있습니다.', rejected: '계정 연결을 확인하지 못했습니다.', error: '로그인을 완료하지 못했습니다.'};
    if (messages[callback]) { callbackNotice = callback; byId('login-dialog').showModal(); showState(messages[callback]); }
    params.delete('auth_status'); history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  const readyProviders = new Set();
  let providerFlight = null;
  function configureProviders() {
    if (window.SEOUL_HUB_PREVIEW || !backendBaseUrl) return Promise.resolve();
    if (providerFlight) return providerFlight;
    providerFlight = (async () => {
    try {
      const server = await api('/auth/config');
      if (server.storage_ready === true) (server.enabledProviders || []).forEach(p => { if (enabledProviders.has(p)) readyProviders.add(p); });
    } catch (_) { readyProviders.clear(); }
    document.querySelectorAll('[data-auth-provider]').forEach(button => button.setAttribute('aria-disabled', readyProviders.has(button.dataset.authProvider) ? 'false' : 'true'));
    })().finally(() => { providerFlight = null; });
    return providerFlight;
  }
  configureProviders();
  refreshSession();
})();
