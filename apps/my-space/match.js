(function () {
  "use strict";

  const OFFICIAL_TEAMS_URL = "https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams";
  const contactConfig = window.SEOUL_HUB_CONTACT_CONFIG || {};
  const contactEndpoint = typeof contactConfig.endpoint === "string" ? contactConfig.endpoint.trim() : "";

  const {ROLES,CHALLENGE_GROUPS,CHALLENGES}=window.SEOUL_HUB_CATALOG;
  const officialTeamSync = window.SEOUL_SEEKING_TEAMS_SYNC || { syncedAt: "", teams: [] };
  const OFFICIAL_SEEKING_TEAMS = Array.isArray(officialTeamSync.teams) ? officialTeamSync.teams : [];

  const reviewStore = window.SEOUL_REVIEW_STORE;
  let state = reviewStore ? reviewStore.loadState() : window.SEOUL_HUB_CATALOG.createState();
  const readReviewProfile = party => reviewStore?.readProfile(party) || null;
  const readReviewTeam = () => reviewStore?.readTeam() || null;
  const publishReviewProfile = () => reviewStore?.publishProfile(state.profile);
  if (window.SEOUL_HUB_PREVIEW?.role === 'owner') state.ownerTeam = readReviewTeam();
  publishReviewProfile();
  let activeTeamId = "";
  let activeParticipantId = "";
  let activeEmailTeamId = "";
  let activeInterestParticipantId = "";
  let activeChallengeGroup = "all";

  const byId = (id) => document.getElementById(id);
  const roleLabel = (id) => ROLES.find((role) => role.id === id)?.label || id;
  const challengeById = (id) => CHALLENGES.find((challenge) => challenge.id === id);

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function safeExternalUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      const officialHost = url.hostname === "spaceappschallenge.org" || url.hostname.endsWith(".spaceappschallenge.org");
      return url.protocol === "https:" && officialHost ? url.href : OFFICIAL_TEAMS_URL;
    } catch (_) {
      return OFFICIAL_TEAMS_URL;
    }
  }

  function saveState() {
    reviewStore?.saveState(state);
  }

  function showToast(message) {
    const toast = byId("hub-toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function randomId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let index = 0; index < 4; index += 1) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ORBIT-${suffix}`;
  }

  function setupRolePicker(containerId, selectedKey) {
    const container = byId(containerId);
    if (!container) return;
    container.replaceChildren();
    ROLES.forEach((role) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.role = role.id;
      button.textContent = role.label;
      button.classList.toggle("selected", state[selectedKey]?.includes(role.id) || state.profile[selectedKey]?.includes(role.id));
      button.addEventListener("click", () => {
        const target = selectedKey === "ownerRoles" ? state.ownerRoles : state.profile[selectedKey];
        const max = Number(container.dataset.max || 2);
        const existingIndex = target.indexOf(role.id);
        if (existingIndex >= 0) {
          target.splice(existingIndex, 1);
        } else if (target.length < max) {
          target.push(role.id);
        } else {
          showToast(`최대 ${max}개까지 선택할 수 있습니다.`);
          return;
        }
        button.classList.toggle("selected", target.includes(role.id));
        updateCounts();
      });
      container.append(button);
    });
  }

  function setupChallenges() {
    const groups = byId("challenge-groups");
    groups.replaceChildren();
    CHALLENGE_GROUPS.forEach((group) => {
      const details = document.createElement("details");
      details.className = "challenge-group";
      const selectedInGroup = () => group.challengeIds.filter((id) => state.profile.challenges.includes(id));

      const summary = document.createElement("summary");
      summary.innerHTML = `<span><b>${group.title}</b><small>${group.description}</small></span><em aria-hidden="true"><span class="challenge-fold-chevron"></span></em>`;
      const syncGroupSelectionState = () => {
        const selectedCount = selectedInGroup().length;
        details.classList.toggle("has-selection", selectedCount > 0);
        summary.setAttribute(
          "aria-label",
          `${group.title}, ${group.challengeIds.length}개 중 ${selectedCount}개 선택`
        );
      };
      details.open = false;
      details.addEventListener("toggle", () => {
        summary.setAttribute("aria-expanded", String(details.open));
      });
      summary.setAttribute("aria-expanded", "false");
      details.append(summary);

      const list = document.createElement("div");
      list.className = "challenge-options";
      group.challengeIds.forEach((challengeId) => {
        const challenge = challengeById(challengeId);
        const label = document.createElement("label");
        label.className = "challenge-option";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = challengeId;
        input.checked = state.profile.challenges.includes(challengeId);
        input.addEventListener("change", () => {
          if (input.checked && state.profile.challenges.length >= 3) {
            input.checked = false;
            showToast("관심 Challenge는 최대 3개까지 선택할 수 있습니다.");
            return;
          }
          if (input.checked) state.profile.challenges.push(challengeId);
          else state.profile.challenges = state.profile.challenges.filter((id) => id !== challengeId);
          label.classList.toggle("selected", input.checked);
          syncGroupSelectionState();
          updateCounts();
        });
        const copy = document.createElement("span");
        copy.innerHTML = `<small>#${String(challenge.number).padStart(2, "0")}</small><b>${challenge.title}</b>`;
        label.append(input, copy);
        label.classList.toggle("selected", input.checked);
        list.append(label);
      });
      details.append(list);
      syncGroupSelectionState();
      groups.append(details);
    });

    const officialLink = document.createElement("a");
    officialLink.className = "challenge-source-link";
    officialLink.href = "https://www.spaceappschallenge.org/2026/challenges/";
    officialLink.target = "_blank";
    officialLink.rel = "noreferrer";
    officialLink.innerHTML = `<span>NASA SPACE APPS OFFICIAL</span><b>Challenge 원문 보기 ↗</b>`;
    groups.append(officialLink);
  }

  function populateSelects() {
    const roleFilter = byId("role-filter");
    ROLES.forEach((role) => roleFilter.add(new Option(role.label, role.id)));

    [byId("challenge-filter"), byId("owner-challenge")].forEach((select) => {
      CHALLENGES.forEach((challenge) => select.add(new Option(`#${challenge.number} ${challenge.title}`, challenge.id)));
    });
  }

  function renderChallengeSummary() {
    const container = byId("selected-challenge-summary");
    container.replaceChildren();
    const selected = state.profile.challenges.map(challengeById).filter(Boolean).slice(0, 3);
    if (!selected.length) {
      const empty = document.createElement("small");
      empty.textContent = "관심 Challenge를 선택해주세요.";
      container.append(empty);
      return;
    }
    selected.forEach(challenge => {
      const tag = document.createElement("span");
      tag.className = "selected-challenge-tag";
      tag.textContent = `#${challenge.number} ${challenge.title}`;
      container.append(tag);
    });
  }

  function updateCounts() {
    renderChallengeSummary();
    byId("current-role-count").textContent = `${state.profile.currentRoles.length} / 3`;
    byId("desired-role-count").textContent = `${state.profile.desiredRoles.length} / 3`;
    byId("challenge-count").textContent = `${state.profile.challenges.length} / 3`;
    byId("copy-count").textContent = byId("profile-copy").value.length;
  }

  function teamMatchScore(team) {
    const challengeMatch = state.profile.challenges.includes(team.challengeId) ? 2 : 0;
    const roleMatch = (team.roles || []).some((role) => state.profile.desiredRoles.includes(role)) ? 1 : 0;
    return challengeMatch + roleMatch;
  }

  function allTeams() {
    const teams = [...OFFICIAL_SEEKING_TEAMS];
    if (window.SEOUL_HUB_PREVIEW) {
      const team = readReviewTeam();
      if (team) teams.push({ ...team, review: true, emailOptIn: readReviewProfile('review-owner').peerEmailOptIn });
    }
    return teams;
  }

  function challengeGroupFor(team) {
    return CHALLENGE_GROUPS.find((group) => group.challengeIds.includes(team.challengeId));
  }

  function setupTeamGroupBubbles() {
    const container = byId("team-group-bubbles");
    container.replaceChildren();
    const groups = [...CHALLENGE_GROUPS, { id: "all", title: "ALL TOPICS", description: "전체 모집 팀 보기" }];
    groups.forEach((group) => {
      const count = allTeams().filter(team => team.seeking && (group.id === "all" || group.challengeIds.includes(team.challengeId))).length;
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.teamGroup = group.id;
      if (group.id === "all") button.id = "show-seeking-teams";
      button.innerHTML = `<span class="bubble-labels"><small>${escapeHtml(group.title)}</small><b>${escapeHtml(group.description)}</b></span><span class="bubble-count">${count}팀 모집 중</span>`;
      const selected = group.id === activeChallengeGroup;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.addEventListener("click", () => {
        activeChallengeGroup = group.id;
        container.querySelectorAll("[data-team-group]").forEach((candidate) => {
          const selected = candidate.dataset.teamGroup === group.id;
          candidate.classList.toggle("selected", selected);
          candidate.setAttribute("aria-pressed", String(selected));
        });
        byId("role-filter").value = "all";
        byId("challenge-filter").value = "all";
        renderTeams();
        renderParticipants();
      });
      container.append(button);
    });
    byId("teams-sync-time").textContent = officialTeamSync.syncedAt || "업데이트 시각 확인 불가";
  }

  function renderParticipants() {
    const authenticated = window.SEOUL_HUB_AUTH?.canUseParticipantFeatures() === true;
    byId("participant-login-gate").hidden = authenticated;
    byId("participant-directory-content").hidden = !authenticated;
    if (!authenticated) {
      const pending = window.SEOUL_HUB_AUTH?.getUserState() === 'pending';
      byId('participant-login-gate').querySelector('h3').textContent = pending ? '서울 참가 확인 후 대원 정보를 볼 수 있습니다.' : '로그인 후 대원 정보를 볼 수 있습니다.';
      byId('participant-login-gate').querySelector('p').textContent = pending ? 'MY SPACE에서 참가 기록 확인을 요청해주세요.' : '로그인하고 같은 주제에 관심 있는 대원을 찾아보세요.';
      byId('participant-login-gate').querySelector('button').textContent = pending ? '참가 기록 확인' : '로그인';
      return;
    }
    const grid = document.querySelector('.participant-card-grid');
    grid.querySelectorAll('[data-review-party]').forEach(card => card.remove());
    if (window.SEOUL_HUB_PREVIEW) {
      const ownParty = window.SEOUL_HUB_AUTH.getUserState() === 'owner' ? 'review-owner' : 'review-participant';
      for (const party of ['review-participant', 'review-owner']) {
        const profile = readReviewProfile(party);
        if (party === ownParty || profile.seekingStatus !== 'seeking') continue;
        const card = document.createElement('article'); card.className = 'participant-card';
        card.dataset.reviewParty = party; card.dataset.challengeIds = profile.challenges.join(' ');
        card.dataset.emailOptIn = String(profile.emailOptIn === true); card.dataset.peerEmailOptIn = String(profile.peerEmailOptIn === true);
        card.innerHTML = `<div><span class="participant-avatar">${escapeHtml(profile.avatar || 'ID')}</span><b>${escapeHtml(profile.randomId)}</b></div><p>${escapeHtml(profile.copy)}</p><dl><div><dt>현재 역할</dt><dd>${profile.currentRoles.map(roleLabel).join(' · ')}</dd></div><div><dt>희망 역할</dt><dd>${profile.desiredRoles.map(roleLabel).join(' · ')}</dd></div><div><dt>관심 Challenge</dt><dd>${profile.challenges.map(id => escapeHtml(challengeById(id)?.title || id)).join(' · ')}</dd></div></dl><div class="participant-actions"><button class="interest-action" type="button" data-interest-participant="${escapeHtml(profile.randomId)}">관심 보내기</button><button class="email-action" type="button" data-contact-participant="${escapeHtml(profile.randomId)}">이메일 보내기</button></div>`;
        card.querySelector('[data-interest-participant]').addEventListener('click', () => openParticipantInterest(profile.randomId));
        card.querySelector('[data-contact-participant]').addEventListener('click', () => openParticipantEmail(profile.randomId));
        grid.append(card);
      }
    }
    const selectedGroup = CHALLENGE_GROUPS.find((group) => group.id === activeChallengeGroup);
    let count = 0;
    document.querySelectorAll("#participant-directory [data-challenge-ids]").forEach((card) => {
      const interests = card.dataset.challengeIds.split(/\s+/);
      const matches = !selectedGroup || interests.some((id) => selectedGroup.challengeIds.includes(id));
      card.hidden = !matches;
      if (matches) count++;
    });
    byId("participant-filter-summary").textContent = `${selectedGroup ? selectedGroup.description : "전체 주제"} · 관심 대원 ${count}명 (예시)`;
    byId("participant-empty").hidden = count !== 0;
    document.querySelectorAll('[data-contact-participant]').forEach(button => { button.disabled = !participantEmailAllowed(button.dataset.contactParticipant); });
  }

  function renderTeams() {
    const authenticated = window.SEOUL_HUB_AUTH?.canUseParticipantFeatures() === true;
    document.querySelectorAll('[data-team-group]').forEach(button => {
      const group = CHALLENGE_GROUPS.find(g => g.id === button.dataset.teamGroup);
      const count = allTeams().filter(team => team.seeking && (!group || group.challengeIds.includes(team.challengeId))).length;
      button.querySelector('.bubble-count').textContent = `${count}팀 모집 중`;
    });
    const roleFilter = byId("role-filter").value;
    const challengeFilter = byId("challenge-filter").value;
    const teams = allTeams()
      .filter((team) => team.seeking)
      .filter((team) => activeChallengeGroup === "all" || challengeGroupFor(team)?.id === activeChallengeGroup)
      .filter((team) => roleFilter === "all" || (team.roles || []).includes(roleFilter))
      .filter((team) => challengeFilter === "all" || team.challengeId === challengeFilter)
      .sort((a, b) => teamMatchScore(b) - teamMatchScore(a));

    const selectedGroup = CHALLENGE_GROUPS.find((group) => group.id === activeChallengeGroup);
    byId("team-filter-summary").textContent = `${selectedGroup ? selectedGroup.description : "전체 주제"} · 모집 팀 ${teams.length}개`;
    const grid = byId("team-grid");
    grid.replaceChildren();
    teams.forEach((team) => {
      const challenge = challengeById(team.challengeId);
      const group = challengeGroupFor(team);
      const score = teamMatchScore(team);
      const skills = team.review ? (team.roles || []).map(roleLabel) : team.skills || [];
      const visibleSkills = skills.slice(0, 5);
      const card = document.createElement("article");
      card.className = "team-card";
      card.innerHTML = `
        <div class="team-card-top">
          <span class="team-sample official">${team.review ? "허브 모집글 · 검토용" : "NASA SEEKING MEMBERS"}</span>
          <span class="team-confirmed">${team.review ? "저장한 모집글 반영" : "공식 목록 반영"}</span>
        </div>
        <div class="team-name-row"><h4>${escapeHtml(team.name)}</h4><a href="${safeExternalUrl(team.url)}" target="_blank" rel="noreferrer">Space Apps 팀 상세 ↗</a></div>
        <p class="team-challenge"><small>#${String(challenge.number).padStart(2, "0")}</small>${escapeHtml(challenge.title)}</p>
        <p class="team-copy">${team.review ? escapeHtml(team.copy) : skills.length ? `NASA 페이지에 공개된 희망 역량을 확인해 보세요.` : `구체적인 모집 역할과 팀 정보는 NASA 공식 팀 페이지에서 확인할 수 있습니다.`}</p>
        <div class="team-meta"><span>서울 분류 <b>${escapeHtml(group?.description || "기타")}</b></span><span>상태 <b>Seeking Members</b></span></div>
        <div class="team-role-list">${visibleSkills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}${skills.length > visibleSkills.length ? `<span>+${skills.length - visibleSkills.length}</span>` : ""}</div>
        ${score ? `<p class="match-score">내 프로필과 ${score === 3 ? "Challenge·역할" : score === 2 ? "Challenge" : "역할"} 일치</p>` : ""}
        <div class="team-actions${authenticated ? "" : " login-required"}">
          <button class="interest-action" type="button" data-interest-team="${escapeHtml(team.id)}">관심 보내기</button>
          <button class="email-action" type="button" data-email-team="${escapeHtml(team.id)}" ${!authenticated || teamEmailAllowed(team) ? "" : 'disabled title="이메일 수신에 동의한 참가자에게만 보낼 수 있습니다."'}>이메일 보내기</button>
        </div>`;
      grid.append(card);
    });

    byId("team-empty").hidden = teams.length !== 0;
    grid.querySelectorAll("[data-email-team]").forEach(button => button.addEventListener("click", () => openTeamEmail(button.dataset.emailTeam)));
    grid.querySelectorAll("[data-interest-team]").forEach((button) => {
      button.addEventListener("click", () => openInterest(button.dataset.interestTeam));
    });
  }

  function switchPanel(panelName) {
    window.dispatchEvent(new CustomEvent("seoul-workspace-view", { detail: panelName }));
    const target = panelName === "dashboard"
      ? byId("match")
      : panelName === "owner"
        ? byId("owner-title")
        : byId("profile");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function syncJourneyProgress() {
    const progress = document.querySelector(".journey-progress");
    const action = byId("journey-next-action");
    if (!progress || !action) return;

    const role = window.SEOUL_HUB_AUTH?.getUserState() || 'anonymous';
    const approved = ['participant', 'owner'].includes(role);
    document.querySelector('.verified-chip').textContent = approved ? '✓ 서울 참가 확인 완료' : role === 'pending' ? '서울 참가 확인 필요' : '로그인 전';
    progress.hidden = !approved;
    document.querySelector('.verified-checklist').hidden = !approved;
    if (!approved) {
      byId('journey-current-title').textContent = role === 'pending' ? '서울 참가 기록 확인이 필요합니다.' : '로그인하고 참가 상태를 확인하세요.';
      byId('journey-current-body').textContent = role === 'pending' ? 'NASA 등록 이메일로 확인을 요청해주세요. 확인 요청 후 운영팀이 참가 기록을 대조합니다.' : '팀 목록은 로그인 전에도 볼 수 있습니다. 참가자 기능은 서울 참가 확인 후 이용할 수 있습니다.';
      action.textContent = role === 'pending' ? '참가 기록 확인 요청' : '로그인';
      action.href = '#my-space'; action.dataset.targetPanel = 'profile';
      byId('journey-next-note').textContent = '소셜 로그인과 참가자 기능 이용 승인은 별개입니다.';
      return;
    }
    const membershipConfirmed = window.SEOUL_HUB_PREVIEW?.verifiedTeamMembership === true;
    const stage = membershipConfirmed ? 'project' : state.profile.completed ? 'team' : 'profile';
    const order = ["registration", "profile", "team", "project", "finish"];
    const currentIndex = order.indexOf(stage);
    progress.dataset.stage = stage;

    progress.querySelectorAll("[data-journey-step]").forEach((item) => {
      const index = order.indexOf(item.dataset.journeyStep);
      const complete = index < currentIndex;
      const current = index === currentIndex;
      item.classList.toggle("complete", complete);
      item.classList.toggle("current", current);
      if (current) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
      item.querySelector(".journey-node").textContent = complete ? "✓" : String(index + 1);
      const status = item.querySelector("[data-step-status]");
      if (complete) status.textContent = "완료";
      else if (current) status.textContent = "현재 단계";
      else if (item.dataset.journeyStep === "project") status.textContent = "11.14–15";
      else if (item.dataset.journeyStep === "finish") status.textContent = "행사 종료 전";
      else status.textContent = index === currentIndex + 1 ? "다음" : "예정";
    });

    const title = byId("journey-current-title");
    const body = byId("journey-current-body");
    const note = byId("journey-next-note");
    action.removeAttribute("target");
    action.removeAttribute("rel");

    if (stage === "profile") {
      title.textContent = "프로필이 준비되어 있어요.";
      body.textContent = "서울 참가 완료 Survey에 작성한 희망 역할을 기준으로 준비했습니다. 지금과 달라졌다면 편하게 업데이트해 주세요.";
      action.innerHTML = "내 프로필 확인·수정 <b aria-hidden=\"true\">→</b>";
      action.href = "#profile";
      action.dataset.targetPanel = "profile";
      note.textContent = "Random ID는 자동 배정 · 캐릭터는 선택";
    } else if (stage === "team") {
      title.textContent = "이제 함께할 팀을 찾아보세요.";
      body.textContent = "희망 역할과 관심 Challenge가 맞는 모집 팀을 확인하고, Team Owner에게 관심 요청을 보낼 수 있습니다.";
      action.innerHTML = "모집 중인 팀 보기 <b aria-hidden=\"true\">→</b>";
      action.href = "#match";
      action.dataset.targetPanel = "dashboard";
      note.textContent = "연락 가능한 팀만 표시됩니다.";
    } else {
      title.textContent = "팀 정보가 준비되었습니다.";
      body.textContent = "팀의 역할과 Challenge를 확인하고, 11월 14–15일 프로젝트 참가를 준비하세요.";
      action.innerHTML = "공식 Challenge 확인 <b aria-hidden=\"true\">↗</b>";
      action.href = "https://www.spaceappschallenge.org/2026/challenges/";
      action.target = "_blank";
      action.rel = "noreferrer";
      delete action.dataset.targetPanel;
      note.textContent = "프로젝트 제작은 공식 행사 시작 후 진행합니다.";
    }
  }

  function syncAvatarUi() {
    const avatar = state.profile.avatar || "";
    const sessionAvatar = byId("session-avatar");
    sessionAvatar.hidden = !avatar;
    sessionAvatar.textContent = avatar;
    byId("profile-avatar-preview").textContent = avatar || "ID";
    document.querySelectorAll("[data-avatar]").forEach((button) => {
      const selected = button.dataset.avatar === avatar;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function setupAvatarPicker() {
    document.querySelectorAll("[data-avatar]").forEach((button) => {
      button.addEventListener("click", () => {
        state.profile.avatar = button.dataset.avatar;
        syncAvatarUi();
      });
    });
    syncAvatarUi();
  }

  function requireParticipantLogin(message) {
    if (window.SEOUL_HUB_AUTH?.canUseParticipantFeatures() === true) return true;
    if (window.SEOUL_HUB_AUTH?.requireLogin) return window.SEOUL_HUB_AUTH.requireLogin(message);
    byId("login-dialog").showModal();
    byId("auth-connection-state").hidden = false;
    byId("auth-connection-state").textContent = message;
    return false;
  }

  function teamEmailAllowed(team) {
    const recipient = team.review ? readReviewProfile('review-owner') : team.ownerProfile;
    return window.SEOUL_HUB_POLICY.canReceiveEmail(recipient, 'participant', true);
  }

  function openTeamEmail(teamId) {
    if (!requireParticipantLogin("로그인 후 이메일을 보낼 수 있습니다.")) return;
    const team = allTeams().find(team => team.id === teamId);
    if (!team || !teamEmailAllowed(team)) return;
    if (window.SEOUL_HUB_PREVIEW?.role === 'owner' && teamId === 'my-team') { showToast('내 팀에는 이메일을 보낼 수 없습니다.'); return; }
    activeEmailTeamId = teamId;
    activeParticipantId = "";
    byId("contact-participant-title").textContent = `${team.name} 팀 오너에게 이메일 보내기`;
    byId("participant-contact-message").value = "";
    byId("sender-email-consent").checked = false;
    byId("relay-submit-state").hidden = true;
    byId("email-dialog").showModal();
  }

  function openParticipantInterest(participantId) {
    if (!requireParticipantLogin("로그인 후 관심을 보낼 수 있습니다.")) return;
    activeInterestParticipantId = participantId;
    activeTeamId = "";
    byId("interest-team-name").textContent = `${participantId} 대원에게 관심 보내기`;
    byId("interest-message").value = "";
    byId("interest-message-count").textContent = "0 / 50";
    byId("interest-dialog").showModal();
  }

  function openInterest(teamId) {
    if (!requireParticipantLogin("로그인 후 관심을 보낼 수 있습니다.")) return;
    const team = allTeams().find((candidate) => candidate.id === teamId);
    if (!team) return;
    activeTeamId = teamId;
    activeInterestParticipantId = "";
    byId("interest-team-name").textContent = `${team.name}에 관심 보내기`;
    byId("interest-message").value = "";
    byId("interest-message-count").textContent = "0 / 50";
    byId("interest-dialog").showModal();
  }

  function renderRequests() {
    const list = byId("request-list");
    list.replaceChildren();
    const interests = state.receivedInterests || [];
    interests.forEach((request) => {
      const item = document.createElement("article");
      item.dataset.requestId = request.id;
      item.innerHTML = `<div><b>${escapeHtml(request.participantId)}</b><span>받은 관심${request.sample ? " · 예시" : ""}</span></div>
        <p>${escapeHtml(request.message)}</p>
        <small>관심 메시지${request.sample ? " · 예시 데이터" : ""}</small>
        ${request.emailOptIn === true ? `<button type="button" class="email-action" data-email-received="${escapeHtml(request.participantId)}">이메일 보내기</button>` : "<small>이메일 수신 미동의</small>"}`;
      list.append(item);
    });
    list.querySelectorAll("[data-email-received]").forEach(button => button.addEventListener("click", () => openParticipantEmail(button.dataset.emailReceived)));
    if (!interests.length) list.textContent = "아직 받은 관심이 없습니다.";
    byId("request-count").textContent = interests.length;
    window.dispatchEvent(new Event("seoul-interest-refresh"));
  }

  function participantEmailAllowed(participantId) {
    const owner = window.SEOUL_HUB_AUTH?.getUserState() === "owner";
    if (window.SEOUL_HUB_PREVIEW) {
      const profile = ['review-participant', 'review-owner'].map(readReviewProfile).find(profile => profile.randomId === participantId);
      if (profile) return window.SEOUL_HUB_POLICY.canReceiveEmail(profile, owner ? 'owner' : 'participant');
    }
    const card = Array.from(document.querySelectorAll(".participant-card")).find(card => card.querySelector("[data-contact-participant]")?.dataset.contactParticipant === participantId);
    if (card) return owner ? card.dataset.emailOptIn === "true" : card.dataset.peerEmailOptIn === "true";
    return owner && (state.receivedInterests || []).some(request => request.participantId === participantId && request.emailOptIn === true);
  }

  window.addEventListener("seoul-thread-email", event => {
    if (event.detail.type === "participant") openParticipantEmail(event.detail.id);
    else openTeamEmail(event.detail.id);
  });
  window.SEOUL_HUB_CONTACT = Object.freeze({ canEmailParticipant: participantEmailAllowed,
    reviewProfile: readReviewProfile,
    reviewTeam: readReviewTeam,
    canEmailTeam: id => { const team = allTeams().find(t => t.id === id); return !!team && teamEmailAllowed(team); } });

  function openParticipantEmail(participantId) {
    if (!requireParticipantLogin("로그인 후 이메일을 보낼 수 있습니다.")) return;
    if (!participantEmailAllowed(participantId)) {
      showToast("이메일 수신에 동의한 참가자에게만 보낼 수 있습니다.");
      return;
    }
    activeParticipantId = participantId;
    activeEmailTeamId = "";
    byId("contact-participant-title").textContent = `${participantId} 대원에게 이메일 보내기`;
    byId("participant-contact-message").value = "";
    byId("sender-email-consent").checked = false;
    byId("relay-submit-state").hidden = true;
    byId("email-dialog").showModal();
  }

  function restoreProfileForm() {
    byId("session-id").textContent = state.profile.randomId;
    byId("random-id-input").value = state.profile.randomId;
    byId("profile-copy").value = state.profile.copy;
    byId("profile-seeking-status").value = state.profile.seekingStatus || "seeking";
    if (window.SEOUL_HUB_PREVIEW) {
      const party = window.SEOUL_HUB_AUTH.getUserState() === "owner" ? "review-owner" : "review-participant";
      byId("profile-seeking-status").value = localStorage.getItem(`seoul-review-seeking-${party}`) || state.profile.seekingStatus || "seeking";
    }
    document.querySelectorAll('[name="profile-seeking-choice"]').forEach(input => { input.checked = input.value === byId("profile-seeking-status").value; });
    if (byId("profile-seeking-status").value === 'completed' && window.SEOUL_HUB_PREVIEW?.verifiedTeamMembership) byId("profile-seeking-note").textContent = '소속 팀이 확인되어 팀 찾기 완료로 설정됐습니다. 팀원 모집은 내 팀 관리에서 설정하세요.';
    byId("profile-email-opt-in").checked = state.profile.emailOptIn !== false;
    byId("profile-peer-email-opt-in").checked = state.profile.peerEmailOptIn === true;
    if (state.profile.completed) byId("profile-save-state").textContent = "프로필 저장됨";
    setupRolePicker("current-role-picker", "currentRoles");
    setupRolePicker("desired-role-picker", "desiredRoles");
    setupRolePicker("owner-role-picker", "ownerRoles");
    setupChallenges();
    setupAvatarPicker();
    updateCounts();
  }

  document.querySelectorAll('[name="profile-seeking-choice"]').forEach(input => input.addEventListener('change', () => {
    if (!input.checked) return;
    byId("profile-seeking-status").value = input.value;
    byId("profile-seeking-note").textContent = input.value === "seeking" ? "저장하면 대원 목록에 표시됩니다." : "저장하면 대원 목록에서 숨겨집니다. 기존 대화는 계속할 수 있습니다.";
  }));

  document.querySelectorAll('[name="owner-recruitment-choice"]').forEach(input => input.addEventListener('change', () => {
    if (input.checked) byId("owner-seeking").checked = input.value === "seeking";
  }));

  function restoreOwnerForm() {
    const team = state.ownerTeam;
    if (!team) return;
    byId("owner-team-url").value = team.url === OFFICIAL_TEAMS_URL ? "" : team.url;
    byId("owner-team-name").value = team.name;
    byId("owner-challenge").value = team.challengeId;
    byId("owner-members").value = team.members;
    byId("owner-openings").value = team.openings;
    byId("owner-copy").value = team.copy;
    const recruitmentStatus = team.recruitmentStatus || (team.seeking ? "seeking" : "completed");
    document.querySelectorAll('[name="owner-recruitment-choice"]').forEach(input => { input.checked = input.value === recruitmentStatus; });
    byId("owner-seeking").checked = recruitmentStatus === "seeking";
    byId("owner-status").textContent = team.seeking ? "모집 중" : team.recruitmentStatus === "paused" ? "잠시 쉬는 중" : "모집 완료";
    byId("owner-status").classList.toggle("closed", !team.seeking);
  }

  document.querySelectorAll("[data-match-tab]").forEach((button) => {
    button.addEventListener("click", () => switchPanel(button.dataset.matchTab));
  });

  byId("journey-next-action")?.addEventListener("click", (event) => {
    if (!window.SEOUL_HUB_AUTH?.canUseParticipantFeatures()) {
      event.preventDefault();
      window.SEOUL_HUB_AUTH?.requireLogin('로그인하고 서울 참가 기록을 확인해주세요.');
      return;
    }
    const panelName = event.currentTarget.dataset.targetPanel;
    if (!panelName) return;
    event.preventDefault();
    switchPanel(panelName);
  });

  document.querySelectorAll("[data-match-link='profile']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      switchPanel("profile");
    });
  });

  document.querySelectorAll("[data-directory-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const participantView = button.dataset.directoryView === "participants";
      byId("team-directory").hidden = participantView;
      byId("participant-directory").hidden = !participantView;
      if (participantView) renderParticipants();
      document.querySelectorAll("[data-directory-view]").forEach((candidate) => {
        candidate.classList.toggle("active", candidate === button);
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
    });
  });

  document.querySelectorAll("[data-open-login]").forEach((button) => {
    button.addEventListener("click", () => byId("login-dialog").showModal());
  });

  document.querySelectorAll("[data-interest-participant]").forEach(button => button.addEventListener("click", () => openParticipantInterest(button.dataset.interestParticipant)));
  document.querySelectorAll("[data-contact-participant]").forEach((button) => {
    button.addEventListener("click", () => {
      openParticipantEmail(button.dataset.contactParticipant);
    });
  });

  document.querySelectorAll("[data-open-participant-directory]").forEach((link) => {
    link.addEventListener("click", () => {
      const participantButton = document.querySelector('[data-directory-view="participants"]');
      participantButton?.click();
    });
  });

  byId("participant-contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = byId("participant-contact-message").value.trim();
    if ((!activeParticipantId && !activeEmailTeamId) || !message || !byId("sender-email-consent").checked) return;
    if (!requireParticipantLogin("로그인 후 이메일을 보낼 수 있습니다.")) return;
    if (activeParticipantId && !participantEmailAllowed(activeParticipantId)) return;
    if (activeEmailTeamId && !teamEmailAllowed(allTeams().find(team => team.id === activeEmailTeamId) || {})) return;
    if (!contactEndpoint) {
      byId("relay-submit-state").hidden = false;
      byId("relay-submit-state").textContent = "이메일 발송 기능을 준비 중입니다. 발송되지 않았습니다.";
      return;
    }
    const contact = {
      id: `contact-${Date.now()}`,
      recipientType: activeEmailTeamId ? "team" : "participant",
      recipientId: activeEmailTeamId || activeParticipantId,
      status: "sending",
      createdAt: "방금"
    };
    state.ownerContacts = Array.isArray(state.ownerContacts) ? state.ownerContacts : [];
    state.ownerContacts.unshift(contact);
    saveState();
    renderRequests();

    const statusBox = byId("relay-submit-state");
    statusBox.hidden = false;
    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientParticipantId: activeParticipantId || undefined,
          recipientTeamId: activeEmailTeamId || undefined,
          senderParticipantId: state.profile.randomId,
          teamId: state.ownerTeam?.id || undefined,
          message,
          senderEmailDisclosureConsent: true
        })
      });
      if (!response.ok) throw new Error("email_relay_failed");
      contact.status = "sent";
      byId("participant-contact-message").value = "";
    byId("sender-email-consent").checked = false;
      statusBox.textContent = "이메일 발송 요청을 완료했습니다.";
      showToast("이메일 발송 요청을 완료했습니다.");
    } catch (_) {
      contact.status = "failed";
      statusBox.textContent = "발송하지 못했습니다. 잠시 후 다시 시도해 주세요.";
    }
    saveState();
    renderRequests();
  });

  byId("email-dialog").querySelector("[data-close-participant-contact]").addEventListener("click", () => {
    byId("email-dialog").close();
  });

  byId("regenerate-id").addEventListener("click", () => {
    byId("random-id-input").value = randomId();
  });

  byId("profile-copy").addEventListener("input", updateCounts);

  byId("profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const proposedId = byId("random-id-input").value.trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,14}$/.test(proposedId)) {
      showToast("Random ID는 영문 대문자·숫자·하이픈 4–14자로 입력해 주세요.");
      byId("random-id-input").focus();
      return;
    }
    if (!state.profile.currentRoles.length || !state.profile.desiredRoles.length) {
      showToast("현재 역할과 희망 역할을 각각 1개 이상 선택해 주세요.");
      return;
    }
    if (!state.profile.challenges.length) {
      showToast("관심 Challenge를 1개 이상 선택해 주세요.");
      return;
    }
    state.profile.randomId = proposedId;
    state.profile.copy = byId("profile-copy").value.trim();
    state.profile.emailOptIn = byId("profile-email-opt-in").checked;
    state.profile.peerEmailOptIn = byId("profile-peer-email-opt-in").checked;
    state.profile.seekingStatus = byId("profile-seeking-status").value;
    if (window.SEOUL_HUB_PREVIEW) {
      const party = window.SEOUL_HUB_AUTH.getUserState() === "owner" ? "review-owner" : "review-participant";
      localStorage.setItem(`seoul-review-seeking-${party}`, state.profile.seekingStatus);
    }
    state.profile.completed = true;
    publishReviewProfile();
    saveState();
    byId("session-id").textContent = proposedId;
    byId("profile-save-state").textContent = "프로필 저장됨";
    byId("profile-seeking-note").textContent = state.profile.seekingStatus === "seeking" ? "대원 목록에 표시됩니다." : "대원 목록에서 숨겨집니다. 새 관심은 받지 않고 기존 대화는 계속할 수 있습니다.";
    renderTeams();
    renderParticipants();
    window.dispatchEvent(new Event("seoul-interest-refresh"));
    syncJourneyProgress();
    showToast("프로필 업데이트를 완료했어요. 이제 함께할 팀을 찾아보세요!");
  });

  byId("role-filter").addEventListener("change", renderTeams);
  byId("challenge-filter").addEventListener("change", renderTeams);
  byId("match-profile-shortcut").addEventListener("click", () => {
    activeChallengeGroup = "all";
    document.querySelectorAll("[data-team-group]").forEach((button) => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });
    byId("role-filter").value = state.profile.desiredRoles[0] || "all";
    byId("challenge-filter").value = state.profile.challenges[0] || "all";
    renderTeams();
  });

  byId("interest-message").addEventListener("input", () => {
    byId("interest-message-count").textContent = `${byId("interest-message").value.length} / 50`;
  });
  byId("interest-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requireParticipantLogin("로그인 후 관심을 보낼 수 있습니다.")) return;
    const interestMessage = byId("interest-message").value.trim();
    if (!interestMessage || interestMessage.length > 50) {
      showToast("관심 메시지는 1~50자로 작성해 주세요.");
      return;
    }
    const team = allTeams().find((candidate) => candidate.id === activeTeamId);
    const target = { recipientId: activeInterestParticipantId || activeTeamId, recipientType: activeInterestParticipantId ? "participant" : "team", teamName: activeInterestParticipantId || team?.name || "팀" };
    const gate = window.SEOUL_INTEREST_GATE?.(target);
    if (gate && !gate.allowed) { showToast(gate.message); return; }
    state.requests.unshift({
      id: `request-${Date.now()}`,
      recipientType: activeInterestParticipantId ? "participant" : "team",
      recipientId: activeInterestParticipantId || activeTeamId,
      teamId: activeTeamId || undefined,
      participantId: state.profile.randomId,
      message: interestMessage,
      status: "pending"
    });
    saveState();
    renderRequests();
    byId("interest-dialog").close();
    window.dispatchEvent(new CustomEvent("seoul-interest-sent", { detail: { recipientId: activeInterestParticipantId || activeTeamId, recipientType: activeInterestParticipantId ? "participant" : "team", teamName: activeInterestParticipantId || team?.name || "팀", message: byId("interest-message").value.trim() } }));
    showToast(window.SEOUL_HUB_PREVIEW ? "예시 요청을 저장했습니다. 실제로 발송하지 않았습니다." : `${team?.name || "팀"}에 관심 요청이 저장되었습니다.`);
  });

  byId("interest-dialog").querySelector("[data-close-interest]").addEventListener("click", () => {
    byId("interest-dialog").close();
  });

  let pendingOwnerTeam = null;
  byId("owner-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requireParticipantLogin("로그인 후 팀을 관리할 수 있습니다.")) return;
    if (window.SEOUL_HUB_AUTH?.getUserState() !== "owner") return;
    const name = state.ownerTeam?.name || "";
    const challengeId = state.ownerTeam?.challengeId || "";
    const copy = byId("owner-copy").value.trim();
    const members = Number(byId("owner-members").value);
    const openings = Number(byId("owner-openings").value);
    if (!name || !challengeId) {
      showToast("NASA Space Apps 공식 팀 정보를 먼저 연결해 주세요.");
      return;
    }
    if (state.ownerRoles.length > 5) {
      showToast("찾는 역할은 최대 5개까지 선택할 수 있습니다.");
      return;
    }
    if (!name || !challengeId || !copy || !state.ownerRoles.length) {
      showToast("팀명, Challenge, 찾는 역할, 광고 문구를 모두 입력해 주세요.");
      return;
    }
    if (members + openings > 6) {
      showToast(`NASA 공식 팀 최대 인원은 6명입니다. 추가 모집은 최대 ${Math.max(0, 6 - members)}명입니다.`);
      return;
    }
    if (byId("owner-seeking").checked && openings < 1) {
      showToast("모집 중인 팀은 추가 모집 인원을 1명 이상 입력해 주세요.");
      return;
    }
    pendingOwnerTeam = {
      id: "my-team",
      sample: false,
      name,
      challengeId,
      members,
      openings,
      roles: [...state.ownerRoles],
      copy,
      lastConfirmed: "방금 확인",
      url: byId("owner-team-url").value.trim() || OFFICIAL_TEAMS_URL,
      recruitmentStatus: document.querySelector('[name="owner-recruitment-choice"]:checked').value,
      seeking: byId("owner-seeking").checked
    };
    showOwnerPreview(pendingOwnerTeam);
  });

  function showOwnerPreview(team) {
    const challenge = challengeById(team.challengeId);
    byId("owner-preview-status").textContent = `${team.seeking ? "모집 중" : `${team.recruitmentStatus === "paused" ? "잠시 쉬는 중" : "모집 완료"} · 허브 팀 목록에서 숨김 · 기존 대화 유지`}${window.SEOUL_HUB_PREVIEW ? " · 검토용 예시, 실제 게시되지 않습니다" : ""}`;
    byId("owner-preview-card").innerHTML = `
      <div class="team-name-row"><h4>${escapeHtml(team.name)}</h4><a href="${safeExternalUrl(team.url)}" target="_blank" rel="noreferrer">Space Apps 팀 상세 ↗</a></div>
      <p class="team-challenge">${escapeHtml(challenge.title)}</p>
      <p class="team-copy">${escapeHtml(team.copy)}</p>
      <div class="team-meta"><span>현재 팀원 <b>${team.members}명</b></span><span>추가 모집 <b>${team.openings}명</b></span></div>
      <div class="team-role-list">${team.roles.map(id => `<span>${escapeHtml(ROLES.find(role => role.id === id)?.label || id)}</span>`).join("")}</div>
      <div class="team-actions"><button class="interest-action" type="button" disabled>관심 보내기</button><button class="email-action" type="button" disabled>이메일 보내기</button></div>`;
    byId("owner-preview-dialog").showModal();
  }
  byId("owner-preview-close").addEventListener("click", () => byId("owner-preview-dialog").close());
  byId("owner-preview-dialog").addEventListener("close", () => { pendingOwnerTeam = null; });
  byId("owner-preview-save").addEventListener("click", () => {
    if (!pendingOwnerTeam) return;
    if (!requireParticipantLogin("로그인 후 팀을 관리할 수 있습니다.")) return;
    if (window.SEOUL_HUB_AUTH?.getUserState() !== "owner") return;
    state.ownerTeam = pendingOwnerTeam;
    if (window.SEOUL_HUB_PREVIEW) {
      localStorage.setItem("seoul-review-recruitment-review-owner", state.ownerTeam.recruitmentStatus);
      reviewStore?.saveTeam(state.ownerTeam);
    }
    pendingOwnerTeam = null;
    saveState();
    restoreOwnerForm();
    renderTeams();
    syncJourneyProgress();
    byId("owner-preview-dialog").close();
    showToast(window.SEOUL_HUB_PREVIEW ? "검토용 모집글을 저장했습니다. 실제 게시되지 않습니다." : "모집글을 저장했습니다.");
  });

  window.addEventListener('storage', () => { renderTeams(); renderParticipants(); window.dispatchEvent(new Event('seoul-interest-refresh')); });
  window.addEventListener('seoul-approval-refresh', () => {
    syncJourneyProgress();
    window.SEOUL_APPROVAL_FLOW?.render();
  });
  populateSelects();
  setupTeamGroupBubbles();
  restoreProfileForm();
  restoreOwnerForm();
  renderTeams();
  renderParticipants();
  renderRequests();
  syncJourneyProgress();
  window.dispatchEvent(new Event("seoul-approval-refresh"));
})();
