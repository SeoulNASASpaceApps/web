(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SpaceAppsStatus = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const LINKS = {
    official: "https://www.spaceappschallenge.org/2026/local-events/seoul/",
    seoul: "https://nasaspaceappskr.org/2026/ko/",
    team: "https://www.spaceappschallenge.org/resources/team-formation-guide/",
    challenges: "https://www.spaceappschallenge.org/2026/challenges/"
  };

  function determineStatus(input, now) {
    const current = now instanceof Date ? now : new Date(now || Date.now());
    const earlyDeadline = new Date("2026-09-30T14:59:59.000Z"); // 23:59:59 KST
    const afterEarly = current > earlyDeadline;

    if (input.nasa !== "yes") {
      return {
        key: "official-needed",
        whitelistEligible: false,
        tone: "warning",
        title: "먼저 NASA 공식 등록이 필요합니다.",
        body: "Whitelist 초청 조건 1번이 아직 확인되지 않았습니다. 2026 대회 등록 후 Local Event에서 Seoul을 선택하세요. 서울 참가 확인 Form만 제출해서는 공식 참가 등록이 되지 않습니다.",
        actions: [
          { label: "NASA 공식 Seoul 페이지", href: LINKS.official },
          { label: "전체 참가 흐름", href: "#journey", secondary: true }
        ]
      };
    }

    if (input.seoul !== "yes") {
      return {
        key: "seoul-needed",
        whitelistEligible: false,
        tone: "warning",
        title: "Local Event를 Seoul로 확인해 주세요.",
        body: "Whitelist 초청 조건 2번이 아직 확인되지 않았습니다. NASA 계정에서 2026 대회 등록 상태와 선택 지역을 확인하세요. 다른 지역을 선택했다면 공식 사이트에서 Seoul로 변경해야 서울 운영 명단과 연결됩니다.",
        actions: [
          { label: "Seoul Local Event 확인", href: LINKS.official },
          { label: "서울 안내 사이트", href: LINKS.seoul, secondary: true }
        ]
      };
    }

    if (input.local !== "yes") {
      return {
        key: "local-needed",
        whitelistEligible: false,
        tone: "warning",
        title: "서울 참가 확인 Form이 남았습니다.",
        body: "Whitelist 초청 조건 3번이 아직 확인되지 않았습니다. 서울 운영팀이 화·목에 순차 발송하는 ‘나사 서울 2026 참가 확인’ 이메일을 확인하세요. Google Form 또는 Naver Form 중 하나만 제출하면 됩니다.",
        actions: [
          { label: "서울 등록 안내 보기", href: LINKS.seoul },
          { label: "메일 미수신 FAQ", href: "#help", secondary: true }
        ]
      };
    }

    if (input.team === "confirmed") {
      return {
        key: "ready",
        whitelistEligible: true,
        tone: "success",
        title: "Whitelist 초청 조건 완료 · 팀 확인 상태입니다.",
        body: "1·2·3이 모두 확인되어 초청·Whitelist 대상입니다. 4번 팀 상태는 입장 자격이 아니라 승인 후 팀 매칭을 돕기 위한 정보입니다.",
        actions: [
          { label: "Team Match 보기", href: "#match" },
          { label: "2026 Challenges", href: LINKS.challenges, secondary: true }
        ]
      };
    }

    if (afterEarly) {
      return {
        key: "waitlist-check",
        whitelistEligible: true,
        tone: "warning",
        title: "Whitelist 초청 조건 완료 · Waitlist 여부를 확인하세요.",
        body: "1·2·3이 모두 확인되어 초청·Whitelist 대상입니다. 다만 Early Registration 종료 시점에 팀이 확인되지 않아 팀 정보·참가 의사와 서울 프로그램 수용 여건을 별도로 확인합니다.",
        actions: [
          { label: "Waitlist 기준 보기", href: "#waitlist" },
          { label: "팀 구성 가이드", href: LINKS.team, secondary: true }
        ]
      };
    }

    return {
      key: "team-needed",
      whitelistEligible: true,
      tone: "success",
      title: "Whitelist 초청 조건 완료 · 이제 팀을 구성하세요.",
      body: "1·2·3이 모두 확인되어 초청·Whitelist 대상입니다. 4번 팀 상태는 입장 자격에 영향을 주지 않으며, 승인 후 Team Match에서 팀을 찾을 수 있습니다.",
      actions: [
        { label: "Team Match 보기", href: "#match" },
        { label: "Waitlist 기준 보기", href: "#waitlist", secondary: true }
      ]
    };
  }

  return { determineStatus, LINKS };
});
