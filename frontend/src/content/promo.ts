export type PromoLocale = "ko" | "en";
export type PromoCopy = Record<PromoLocale, string>;
export type PromoCategory = "explore" | "life" | "earth" | "create";
export type PromoFilterKey = "all" | PromoCategory;

export interface PromoChallenge {
  number: string;
  category: PromoCategory;
  categoryLabel: PromoCopy;
  shortTitle: PromoCopy;
  officialTitle: string;
  summary: PromoCopy;
  officialUrl: string;
}

export interface PromoTimelineItem {
  date: string;
  endDate?: string;
  displayDate: PromoCopy;
  title: PromoCopy;
  description: PromoCopy;
  highlighted?: boolean;
}

const categories: Record<PromoCategory, PromoCopy> = {
  explore: { ko: "우주 탐사", en: "Space Exploration" },
  life: { ko: "우주 생활", en: "Living in Space" },
  earth: { ko: "지구 · 데이터", en: "Earth & Data" },
  create: { ko: "게임 · 이야기", en: "Games & Stories" },
};

const nasaSeoulUrl = "https://www.spaceappschallenge.org/2026/local-events/seoul/";
const officialChallengesUrl = "https://www.spaceappschallenge.org/2026/challenges/";

export const promoContent = {
  links: {
    nasaSeoul: nasaSeoulUrl,
    officialChallenges: officialChallengesUrl,
  },
  hero: {
    eyebrow: { ko: "SEOUL LOCAL EVENT · 2026", en: "SEOUL LOCAL EVENT · 2026" },
    theme: { ko: "2026 테마 · The Next Frontier", en: "2026 Theme · The Next Frontier" },
    titleLines: [
      { ko: "NASA", en: "NASA" },
      { ko: "SPACE APPS", en: "SPACE APPS" },
      { ko: "SEOUL 2026", en: "SEOUL 2026" },
    ],
    lead: { ko: "NASA의 우주 데이터를\n직접 써볼 기회.", en: "Put NASA's space data\nto work." },
    description: {
      ko: "화성 지도부터 위성이 담은 지구, 망원경이 관측한 하늘까지. NASA와 우주 기관 파트너의 공개 데이터를 내 프로젝트에 써보세요. 우주를 좋아하는 마음과 아이디어가 있다면, 전공에 관계없이 함께할 수 있습니다.",
      en: "From maps of Mars to satellite views of Earth and telescope observations of the sky, turn open data from NASA and its space agency partners into a project of your own. Curiosity and an idea are all you need, whatever your background.",
    },
    cta: { ko: "NASA 데이터로 도전하기", en: "Take on a NASA data challenge" },
    note: { ko: "참가비 무료 · 온라인 중심 + 일부 오프라인 프로그램", en: "Free to join · Primarily online + selected offline programs" },
    scrollCue: { ko: "14개 챌린지 먼저 둘러보기", en: "Explore the 14 challenges" },
    posterAlt: {
      ko: "NASA Space Apps Seoul 2026 홍보 포스터. 11월 14일부터 15일까지 온라인 중심으로 열리며, NASA 데이터를 활용하는 다양한 전공의 참가자를 모집합니다.",
      en: "NASA Space Apps Seoul 2026 poster. The primarily online event runs November 14–15 and welcomes people from all backgrounds to build with NASA data.",
    },
    posterLabel: { ko: "포스터 원본 크게 보기", en: "View or download the original poster" },
  },
  facts: {
    ariaLabel: { ko: "행사 핵심 정보", en: "Event essentials" },
    items: [
      { label: { ko: "언제", en: "When" }, value: { ko: "2026. 11. 14–15", en: "November 14–15, 2026" } },
      { label: { ko: "어디서", en: "Where" }, value: { ko: "온라인 중심 · 서울", en: "Primarily online · Seoul" } },
      { label: { ko: "누가", en: "Who" }, value: { ko: "누구나, 혼자 또는 팀으로", en: "Anyone, solo or with a team" } },
      { label: { ko: "참가비", en: "Cost" }, value: { ko: "무료", en: "Free" } },
    ],
  },
  countdown: {
    ariaLabel: { ko: "해커톤 카운트다운", en: "Hackathon countdown" },
    until: { ko: "해커톤까지", en: "until the hackathon" },
    day: { ko: "일", en: "day" },
    days: { ko: "일", en: "days" },
    hour: { ko: "시간", en: "hour" },
    hours: { ko: "시간", en: "hours" },
    minute: { ko: "분", en: "minute" },
    minutes: { ko: "분", en: "minutes" },
    live: { ko: "진행 중", en: "Live" },
    ended: { ko: "행사 종료", en: "Event ended" },
  },
  invitation: {
    kicker: { ko: "01 / THE CHALLENGE", en: "01 / THE CHALLENGE" },
    title: { ko: "화성 지도도,\n우주 게임도.", en: "Map Mars.\nBuild a space game." },
    description: {
      ko: "NASA 데이터로 화성 탐사 지도를 만들고, 달 기지를 운영하는 게임을 설계하고, 지구의 변화를 소리로 표현해보세요. 코딩, 디자인, 과학, 스토리텔링 등 각자의 강점을 보태면 됩니다.",
      en: "Map a route across Mars, design a game about running a lunar base, or turn changes on Earth into sound. Bring what you know—code, design, science, storytelling, or something else entirely.",
    },
    communityNote: {
      ko: "서울에서는 지난해 37개 팀이 프로젝트를 완주했습니다. 올해는 어떤 해답이 나올까요?",
      en: "Last year, 37 Seoul teams completed their projects. What will this year's teams discover?",
    },
    awardeesLink: { ko: "2025 수상 기록 보기", en: "See the 2025 awardees" },
  },
  challengesSection: {
    kicker: { ko: "02 / CHOOSE YOUR CHALLENGE", en: "02 / CHOOSE YOUR CHALLENGE" },
    title: { ko: "어떤 문제에\n도전할까요?", en: "Which problem\nwill you take on?" },
    description: {
      ko: "공개된 14개 챌린지에서 관심 있는 문제를 찾아보세요. 제목을 누르면 한국어 요약과 공식 안내를 볼 수 있습니다.",
      en: "Browse the 14 published challenges and find a problem that matters to you. Open a title for a short summary and the official brief.",
    },
    officialLink: { ko: "공식 챌린지 전체 보기", en: "Browse all official challenges" },
    officialUrl: officialChallengesUrl,
    filterAriaLabel: { ko: "관심 분야로 챌린지 찾기", en: "Filter challenges by interest" },
    filters: [
      { key: "all", label: { ko: "전체", en: "All" } },
      { key: "explore", label: categories.explore },
      { key: "life", label: categories.life },
      { key: "earth", label: categories.earth },
      { key: "create", label: categories.create },
    ],
    countSuffix: { ko: "개", en: "" },
    browseNote: { ko: "둘러보기용 분류입니다.", en: "Categories are provided for browsing." },
    sourceNote: {
      ko: "공식 Challenge Summary를 바탕으로 요약했습니다. 상세 요건과 자료는 각 챌린지의 공식 페이지에서 확인하세요.",
      en: "These summaries are based on the official Challenge Summaries. Check each challenge page for complete requirements and resources.",
    },
    officialChallengeLink: { ko: "NASA 공식 챌린지 보기", en: "Open the official NASA challenge" },
  },
  challenges: [
    {
      number: "01", category: "create", categoryLabel: categories.create,
      shortTitle: { ko: "달과 화성에 남겨진 장비의 이야기", en: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars" },
      officialTitle: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars",
      summary: { ko: "달·화성 등에 남겨진 NASA 장비와 그 장비가 가능하게 한 과학을 어린이와 청소년에게 이야기로 전해보세요.", en: "Tell young audiences the stories of NASA equipment left on the Moon, Mars, and beyond—and the science those machines made possible." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/abandoned-but-not-forgotten-storytelling-about-nasas-discarded-equipment-on-the-moon-and-mars/",
    },
    {
      number: "02", category: "earth", categoryLabel: categories.earth,
      shortTitle: { ko: "지구의 변화를 추적하는 탐정", en: "Be An Earth System Trend Detective!" },
      officialTitle: "Be An Earth System Trend Detective!",
      summary: { ko: "NASA 관측·모델 데이터에서 시간에 따른 변화를 찾아 시각화하고, 변화의 크기와 통계적 유의성을 살펴보세요.", en: "Find and visualize changes over time in NASA observations and model data, then examine their scale and statistical significance." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/",
    },
    {
      number: "03", category: "create", categoryLabel: categories.create,
      shortTitle: { ko: "어린 우주비행사를 위한 미션 게임", en: "Build a Junior Astronaut Mission Trainer" },
      officialTitle: "Build a Junior Astronaut Mission Trainer",
      summary: { ko: "달이나 화성 기지의 생명유지·방사선 차폐·전력·식량을 관리하며 배우는 게임이나 앱을 만들어보세요.", en: "Build a game or app that teaches young explorers to manage life support, radiation shielding, power, and food at a lunar or Martian base." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/build-a-junior-astronaut-mission-trainer/",
    },
    {
      number: "04", category: "explore", categoryLabel: categories.explore,
      shortTitle: { ko: "달 착륙지를 비교하는 브라우저", en: "CLPS Lunar Mission Browser" },
      officialTitle: "CLPS Lunar Mission Browser",
      summary: { ko: "달 남극의 착륙 후보지와 날짜에 따라 태양·지구의 위치를 보여주고, 발전과 통신 가능 시간을 비교해보세요.", en: "Compare candidate landing sites and dates near the lunar south pole by showing the positions of the Sun and Earth and estimating power and communications windows." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/clps-lunar-mission-browser/",
    },
    {
      number: "05", category: "life", categoryLabel: categories.life,
      shortTitle: { ko: "우주비행사의 건강 모니터링", en: "Create Health Monitoring Software for Astronauts on Space Missions" },
      officialTitle: "Create Health Monitoring Software for Astronauts on Space Missions",
      summary: { ko: "건강 지표를 모아 우주비행사가 자신의 상태를 파악하고 대응할 수 있도록 돕는 소프트웨어를 만들어보세요.", en: "Create software that brings health indicators together so astronauts can understand their condition and respond during a mission." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/create-health-monitoring-software-for-astronauts-on-space-missions/",
    },
    {
      number: "06", category: "earth", categoryLabel: categories.earth,
      shortTitle: { ko: "레이더로 읽는 지표의 변화", en: "Dancing with the SARs" },
      officialTitle: "Dancing with the SARs",
      summary: { ko: "NISAR 레이더 데이터를 활용해 습지, 산불, 지진, 농지, 빙하 등 지표의 변화를 추적하고 시각화해보세요.", en: "Use NISAR radar data to track and visualize changes across wetlands, wildfires, earthquakes, farmland, glaciers, and other landscapes." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/dancing-with-the-sars/",
    },
    {
      number: "07", category: "earth", categoryLabel: categories.earth,
      shortTitle: { ko: "NASA 데이터로 설계하는 농업", en: "Field Shift: Adapting Farms with NASA Data" },
      officialTitle: "Field Shift: Adapting Farms with NASA Data",
      summary: { ko: "지구 관측과 토양·작물 정보를 결합해 농부가 토양 건강과 변화하는 환경을 고려한 윤작 전략을 탐색하도록 도와주세요.", en: "Combine Earth observations with soil and crop information to help farmers explore crop rotations suited to soil health and changing conditions." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/",
    },
    {
      number: "08", category: "life", categoryLabel: categories.life,
      shortTitle: { ko: "무중력 화재 데이터를 읽는 AI", en: "Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data" },
      officialTitle: "Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data",
      summary: { ko: "미세중력 연소 실험 결과를 요약·비교·해석해 우주 탐사의 화재 안전에 도움을 주는 AI 대시보드를 만들어보세요.", en: "Build an AI dashboard that summarizes, compares, and interprets microgravity combustion experiments to support fire safety in space exploration." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall-ai-powered-fire-safety-insights-from-microgravity-combustion-data/",
    },
    {
      number: "09", category: "earth", categoryLabel: categories.earth,
      shortTitle: { ko: "위성으로 만드는 화재 활동 달력", en: "Harmonization of MODIS and VIIRS Hot Spots" },
      officialTitle: "Harmonization of MODIS and VIIRS Hot Spots",
      summary: { ko: "MODIS와 VIIRS의 화재 탐지 기록을 통합해 지역별 과거 화재 패턴과 주의가 필요한 시기를 살펴보세요.", en: "Combine MODIS and VIIRS fire detections to reveal historical fire patterns by region and the times of year that call for extra attention." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/harmonization-of-modis-and-viirs-hot-spots/",
    },
    {
      number: "10", category: "explore", categoryLabel: categories.explore,
      shortTitle: { ko: "지구에서 찾는 달과 화성", en: "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars" },
      officialTitle: "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars",
      summary: { ko: "지구·달·화성의 공개 데이터로 미래 기지나 착륙지와 환경이 닮은 지구의 장소를 찾고 특성을 분석해보세요.", en: "Use open data from Earth, the Moon, and Mars to find and analyze places on Earth that resemble future base or landing environments." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/identify-earth-locations-that-analog-the-permanent-moon-base-locations-and-mars/",
    },
    {
      number: "11", category: "explore", categoryLabel: categories.explore,
      shortTitle: { ko: "화성 탐사를 위한 생존 지도", en: "Interplanetary Survival Guide: Martian Map" },
      officialTitle: "Interplanetary Survival Guide: Martian Map",
      summary: { ko: "여러 NASA 미션의 데이터를 겹쳐 보여주는 지도로 우주비행사의 화성 이동 경로와 현장 탐사를 도와주세요.", en: "Layer data from multiple NASA missions into a map that helps astronauts plan routes and field exploration on Mars." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/",
    },
    {
      number: "12", category: "explore", categoryLabel: categories.explore,
      shortTitle: { ko: "SPHEREx로 찾아보는 하늘의 변화", en: "Planet X and SPHEREx" },
      officialTitle: "Planet X and SPHEREx",
      summary: { ko: "SPHEREx의 하늘 이미지를 시간별로 비교해 누구나 천체의 위치 변화를 쉽게 살펴볼 수 있는 웹 도구를 만들어보세요.", en: "Compare SPHEREx sky images over time in a web tool that makes changes in celestial positions easy for anyone to explore." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/",
    },
    {
      number: "13", category: "create", categoryLabel: categories.create,
      shortTitle: { ko: "나만의 우주 미션 설계 게임", en: "Space Mission Design Game" },
      officialTitle: "Space Mission Design Game",
      summary: { ko: "예산·전력·질량·통신 등 제한된 자원 안에서 우주 미션을 설계하고 운영하며 결과를 실험하는 게임을 만들어보세요.", en: "Create a game for designing and operating a space mission within limits such as budget, power, mass, and communications—and experimenting with the outcome." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/",
    },
    {
      number: "14", category: "create", categoryLabel: categories.create,
      shortTitle: { ko: "지구 데이터를 소리로 듣는 주크박스", en: "The Earth Information Jukebox" },
      officialTitle: "The Earth Information Jukebox",
      summary: { ko: "NASA Earth Information Center의 시각 자료를 실시간 소리로 바꾸어 지구과학을 여러 감각으로 경험하게 해보세요.", en: "Turn visuals from NASA's Earth Information Center into real-time sound and create a multisensory way to experience Earth science." },
      officialUrl: "https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/",
    },
  ] satisfies PromoChallenge[],
  join: {
    kicker: { ko: "03 / HOW TO JOIN", en: "03 / HOW TO JOIN" },
    title: { ko: "서울 참가,\n이 순서로 진행해요.", en: "Join Seoul\nin six steps." },
    steps: [
      { title: { ko: "NASA 공식 사이트에서 등록", en: "Register on the NASA site" }, description: { ko: "2026 Seoul Local Event에 먼저 등록하세요.", en: "Start by registering for the 2026 Seoul Local Event." }, link: { url: "https://www.spaceappschallenge.org/2026/local-events/seoul/", label: { ko: "NASA 등록 페이지", en: "NASA registration page" }, external: true } },
      { title: { ko: "서울 참가 확인", en: "Confirm your Seoul participation" }, description: { ko: "매주 화·목 순차 발송되는 「나사 서울 2026 참가 확인」 이메일을 확인하세요. Google Form 또는 Naver Form 중 하나를 제출하면 됩니다.", en: "Check the “NASA Seoul 2026 Participation Confirmation” email sent in batches every Tuesday and Thursday. Submit either the Google Form or the Naver Form." } },
      { title: { ko: "Challenge 선택", en: "Choose a challenge" }, description: { ko: "공개된 NASA Space Apps Challenge를 확인하고 관심 있는 문제를 선택하세요.", en: "Review the published NASA Space Apps Challenges and choose a problem that interests you." }, link: { url: "#challenges", label: { ko: "14개 챌린지 둘러보기", en: "Browse the 14 challenges" }, external: false } },
      { title: { ko: "팀 구성", en: "Form or join a team" }, description: { ko: "팀을 만들거나 기존 팀에 합류해 함께 도전할 문제를 정하고 준비하세요.", en: "Create a team or join one, then agree on a challenge and prepare together." }, link: { url: "https://www.spaceappschallenge.org/2026/find-a-team/", label: { ko: "공식 팀 찾기", en: "Official team finder" }, external: true } },
      { title: { ko: "해커톤 참가", en: "Take part in the hackathon" }, description: { ko: "2026년 11월 14–15일, 이틀 동안 팀과 함께 아이디어를 프로젝트로 완성합니다.", en: "On November 14–15, 2026, work with your team to turn an idea into a project." } },
      { title: { ko: "프로젝트 제출", en: "Submit your project" }, description: { ko: "NASA Space Apps 공식 플랫폼에 프로젝트를 제출하세요. 세부 마감 시간과 제출 방법은 공식 안내를 확인해주세요.", en: "Submit your project through the official NASA Space Apps platform. Check the official guidance for the deadline and submission process." } },
    ],
    note: { ko: "NASA 공식 등록과 서울 참가 확인을 모두 완료해야 합니다. 안내된 기간 내 확인을 마치지 않으면 대기 명단으로 전환될 수 있습니다.", en: "Complete both NASA registration and the Seoul participation confirmation. If confirmation is not completed within the stated period, you may be moved to the waitlist." },
  },
  timeline: {
    kicker: { ko: "04 / SAVE THE DATES", en: "04 / SAVE THE DATES" },
    title: { ko: "준비부터 제출까지,\n다가오는 일정.", en: "From preparation\nto submission." },
    description: { ko: "관심 있는 주제를 살펴보고 팀을 만나보세요.\n11월, 이틀의 도전이 시작됩니다.", en: "Explore the topics and meet your team.\nThe two-day challenge begins in November." },
    bulletinLink: { ko: "서울 공식 공지 확인", en: "See the Seoul bulletin" },
    pastSuffix: { ko: "(지난 일정)", en: "(past)" },
    items: [
      { date: "2026-08-26", displayDate: { ko: "08.26", en: "AUG 26" }, title: { ko: "참가 등록 시작", en: "Registration opens" }, description: { ko: "NASA 공식 등록 + 서울 참가 확인", en: "NASA registration + Seoul confirmation" } },
      { date: "2026-09-17", displayDate: { ko: "09.17", en: "SEP 17" }, title: { ko: "챌린지 요약 공개", en: "Challenge Summaries released" }, description: { ko: "14개 주제에서 관심 분야 찾기", en: "Explore 14 challenge topics" } },
      { date: "2026-10-15", displayDate: { ko: "10.15", en: "OCT 15" }, title: { ko: "Catch-up Welcome Benefits 마감", en: "Catch-up Welcome Benefits close" }, description: { ko: "10월 15일까지 팀 합류", en: "Join a team by Oct 15" } },
      { date: "2026-10-28", displayDate: { ko: "10.28", en: "OCT 28" }, title: { ko: "챌린지 상세 내용 공개", en: "Challenge Statements released" }, description: { ko: "Challenge Statement", en: "Full Challenge Statements" } },
      { date: "2026-11-03", displayDate: { ko: "11.03", en: "NOV 03" }, title: { ko: "NASA Space Apps Connect", en: "NASA Space Apps Connect" }, description: { ko: "공식 프로그램 안내 확인", en: "Check the official program guidance" } },
      { date: "2026-11-14", endDate: "2026-11-16", displayDate: { ko: "11.14—15", en: "NOV 14—15" }, title: { ko: "Hackathon Weekend", en: "Hackathon Weekend" }, description: { ko: "온라인 중심으로 함께하는 이틀", en: "Two primarily online days together" }, highlighted: true },
      { date: "2026-12-02", displayDate: { ko: "12.02", en: "DEC 02" }, title: { ko: "Local Nominee", en: "Local Nominees" }, description: { ko: "서울 공식 사이트에 안내된 주요 일정", en: "Key date listed on the Seoul site" } },
    ] satisfies PromoTimelineItem[],
  },
  globalStage: {
    kicker: { ko: "05 / FROM SEOUL TO THE WORLD", en: "05 / FROM SEOUL TO THE WORLD" },
    title: { ko: "서울에서 시작한 아이디어,\n글로벌 무대까지.", en: "An idea from Seoul,\non the global stage." },
    description: { ko: "프로젝트 제출 시 공식 참가 인증서가 발급되며, 서울 지역의 우수 프로젝트는 글로벌 심사 대상으로 추천될 수 있습니다.", en: "Submit a project to receive an official participation certificate. Outstanding Seoul projects may be nominated for Global Judging." },
    stats: [
      { label: { ko: "2025 서울 완주 팀", en: "2025 Seoul teams completed" }, value: "37", unit: { ko: "팀", en: "teams" } },
      { label: { ko: "2025 글로벌 심사 진출", en: "2025 advanced to Global Judging" }, value: "4", unit: { ko: "팀", en: "teams" } },
      { label: { ko: "2025 Global Finalists", en: "2025 Global Finalists" }, value: "2", unit: { ko: "팀", en: "teams" } },
      { label: { ko: "2025 Global Honorable Mention", en: "2025 Global Honorable Mention" }, value: "1", unit: { ko: "팀", en: "team" } },
    ],
    source: { ko: "2025년 서울 행사 성과", en: "2025 Seoul event results" },
    officialSeoul: { ko: "NASA 공식 서울 소개", en: "Official NASA Seoul page" },
    teamLink: { ko: "서울 운영팀 알아보기", en: "Meet the Seoul team" },
    partnersLink: { ko: "협력기관 · 교육 혜택", en: "Partners · learning benefits" },
  },
  faq: {
    kicker: { ko: "06 / BEFORE YOU JOIN", en: "06 / BEFORE YOU JOIN" },
    title: { ko: "궁금한 것부터\n확인하세요.", en: "Questions before\nyou join?" },
    items: [
      { question: { ko: "개발을 잘해야 참여할 수 있나요?", en: "Do I need to be an experienced developer?" }, answer: { ko: "고급 개발 역량이나 우주 전문 지식이 필수는 아닙니다. 코딩, 데이터, 과학, 디자인, 스토리텔링, 비즈니스 등 다양한 분야의 참가자가 함께할 수 있습니다.", en: "Advanced development skills and space expertise are not required. People from coding, data, science, design, storytelling, business, and many other fields can contribute." } },
      { question: { ko: "서울에 직접 가야 하나요?", en: "Do I need to be in Seoul in person?" }, answer: { ko: "온라인 중심으로 진행합니다. 일부 참가자와 팀에게 제한적인 오프라인 협업·교류 기회가 제공될 예정이며, 세부 사항은 운영팀의 안내를 확인해주세요.", en: "The event is primarily online. Limited in-person collaboration and networking opportunities may be offered to selected participants and teams; check the organizers' announcements for details." } },
      { question: { ko: "미성년자도 참가할 수 있나요?", en: "Can minors participate?" }, answer: { ko: "고등학생도 참여할 수 있습니다. 공식 참가 규정의 해당 연령 기준 미만인 참가자는 부모·보호자 동의가 필요합니다. 신청 과정에서 운영팀이 보내는 안내를 확인해주세요.", en: "High school students may participate. Anyone below the applicable age in the official participation rules needs consent from a parent or guardian. Follow the instructions sent by the organizers during registration." } },
      { question: { ko: "사전 교육과 행사 프로그램도 있나요?", en: "Are there preparation sessions and event programs?" }, answer: { ko: "9월 30일까지 진행된 Early Registration Welcome Benefits는 마감되었습니다. Catch-up Welcome Benefits는 10월 15일까지 팀에 합류한 참가자에게 제공됩니다. 한국어 Zoom 세션, 시상·네트워킹 행사의 세부 일정은 추후 공지됩니다.", en: "Early Registration Welcome Benefits closed on September 30. Catch-up Welcome Benefits are available to participants who join a team by October 15. Details for the Korean-language Zoom sessions, awards, and networking events will be announced later." }, link: { ko: "최신 공지 보기", en: "See latest bulletin" } },
      { question: { ko: "심사는 어떤 기준으로 진행하나요?", en: "How are projects judged?" }, answer: { ko: "임팩트, 창의성, 타당성, 관련성, 발표력을 기준으로 심사합니다. 서울 로컬 심사를 거친 우수 프로젝트는 NASA Space Apps 글로벌 심사 추천 대상이 될 수 있습니다.", en: "Projects are judged on impact, creativity, validity, relevance, and presentation. Outstanding projects from Seoul's local judging may be recommended for NASA Space Apps Global Judging." } },
    ],
  },
  closing: {
    kicker: { ko: "11.14 — 11.15 / 2026", en: "11.14 — 11.15 / 2026" },
    title: { ko: "우주 좋아하는 사람들,\n11월에 만나요.", en: "Space people,\nsee you in November." },
    cta: { ko: "NASA 공식 사이트에서 등록하기", en: "Register on the NASA Space Apps site" },
    ctaUrl: nasaSeoulUrl,
  },
  connect: {
    kicker: { ko: "07 / STAY CONNECTED", en: "07 / STAY CONNECTED" },
    title: { ko: "소식도, 질문도.\n여기서 만나요.", en: "News and questions,\nall in one place." },
    description: { ko: "참가 관련 문의는 서울 운영팀으로 보내주세요.", en: "Send participation questions to the Seoul organizing team." },
    email: "seoul@nasaspaceappskr.org",
    channels: [
      { label: { ko: "인스타그램", en: "Instagram" }, strong: { ko: "@nasaspaceapps_seoul", en: "@nasaspaceapps_seoul" }, url: "https://www.instagram.com/nasaspaceapps_seoul/" },
      { label: { ko: "네이버 블로그", en: "Naver Blog" }, strong: { ko: "NASA SpaceApps코리아", en: "NASA SpaceApps Korea" }, url: "https://blog.naver.com/nasaspaceapps_pangyo" },
      { label: { ko: "네이버 카페", en: "Naver Cafe" }, strong: { ko: "NASA SpaceApps Seoul 챌린지", en: "NASA SpaceApps Seoul Challenge" }, url: "https://cafe.naver.com/nasaspaceappspangyo" },
      { label: { ko: "링크드인", en: "LinkedIn" }, strong: { ko: "NASA Space Apps Seoul", en: "NASA Space Apps Seoul" }, url: "https://www.linkedin.com/company/nasa-space-apps-seoul/" },
    ],
    hashtags: ["#SpaceApps", "#SpaceAppsSeoul"],
    copyButton: { ko: "해시태그 복사", en: "Copy hashtags" },
    copySuccess: { ko: "해시태그를 복사했어요.", en: "Hashtags copied." },
    copyFailure: { ko: "해시태그를 직접 선택해 복사해주세요.", en: "Select the hashtags and copy them manually." },
  },
  nav: {
    ariaLabel: { ko: "페이지 바로가기", en: "On this page" },
    items: [
      { id: "challenges", label: { ko: "챌린지 탐색", en: "Challenges" }, count: "14" },
      { id: "join", label: { ko: "참가 방법", en: "How to join" } },
      { id: "schedule", label: { ko: "주요 일정", en: "Schedule" } },
      { id: "connect", label: { ko: "문의 · 커뮤니티", en: "Connect" } },
    ],
  },
  ui: {
    newTabHint: { ko: "(새 탭)", en: "(opens in new tab)" },
    skipLink: { ko: "본문으로 바로 가기", en: "Skip to main content" },
    orbitLabel: { ko: "챌린지", en: "CHALLENGES" },
    challengeCount: { ko: "전체 14개", en: "All 14" },
    latestKicker: { ko: "LATEST UPDATES", en: "LATEST UPDATES" },
    latestTitle: { ko: "최근 공지", en: "Latest bulletin" },
    viewAll: { ko: "전체 보기", en: "View all" },
    collaboratorKicker: { ko: "LOCAL COLLABORATORS", en: "LOCAL COLLABORATORS" },
    collaboratorLink: { ko: "협력 내용과 학습 혜택 보기", en: "Explore collaboration and learning benefits" },
  },
} as const;
