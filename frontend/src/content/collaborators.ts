export const collaboratorCopy = {
  title: { ko: "협력기관", en: "Local Collaborators" },
  description: {
    ko: "NASA Space Apps Seoul의 협력기관은 행사 운영, 참가자 지원, 공간·교육·물품·재정 지원 등에 함께하는 기관입니다. 이 행사는 운영팀의 재능기부와 지역 협력기관의 소중한 지원으로 만들어집니다.",
    en: "Local Collaborators support NASA Space Apps Seoul through event operations, participant support, venue, education, goods, financial support, and other forms of collaboration. The event is made possible by the organizing team’s volunteer contributions and the valued support of local collaborators.",
  },
};

export const collaboratorOverview = [
  { id: "modulabs", name: { ko: "모두의연구소", en: "MODULABS" }, label: { ko: "교육 협력기관", en: "Education Collaborator" }, placeholder: false },
  { id: "bizdata", name: { ko: "BizData", en: "BizData" }, label: { ko: "데이터·AI 협력기관", en: "Data & AI Collaborator" }, placeholder: false },
  { id: "aws", name: { ko: "AWS", en: "AWS" }, label: { ko: "클라우드·기술 협력기관", en: "Cloud & Technology Collaborator" }, placeholder: false },
  { id: "more", name: { ko: "More coming", en: "More coming" }, label: { ko: "협력기관 추가 예정", en: "More collaborators to be announced" }, placeholder: true },
];

export const modulabs = {
  category: { ko: "교육 협력기관", en: "Education Collaborator" },
  summary: {
    ko: "모두의연구소(ModuLabs)는 AI·소프트웨어 교육과 연구를 중심으로 실무형 학습, 연구 LAB, 세미나·컨퍼런스를 운영하는 커뮤니티 플랫폼입니다. “Share Value, Grow Together” 철학 아래 협업과 자기주도적 성장을 지원합니다.",
    en: "ModuLabs is a community platform offering practical learning, research LABs, seminars, and conferences focused on AI and software education and research. Guided by its philosophy, “Share Value, Grow Together,” it supports collaboration and self-directed growth.",
  },
  welcomeTitle: { ko: "모두의연구소 Welcome Benefit", en: "MODULABS Welcome Benefit" },
  welcomeDescription: {
    ko: "NASA Space Apps Seoul 2026 공식 등록자에게 제공되는 사전 준비 혜택입니다. 참가자의 경험 수준에 따라 AI 기반 웹 개발, Cursor 기반 풀스택 개발 등 해커톤 실전 준비에 도움이 되는 과정을 안내합니다.",
    en: "Preparation benefits for officially registered NASA Space Apps Seoul 2026 participants. Courses in AI-assisted web development and Cursor-based full-stack development support hackathon preparation at different experience levels.",
  },
  welcomeCourses: [
    {
      title: { ko: "비개발자도 할 수 있는 바이브 코딩 웹 개발", en: "Vibe Coding Web Development for Non-developers" },
      description: {
        ko: "프로그래밍 입문자를 대상으로, AI와 함께 웹 포트폴리오 제작, 3D 웹앱 구현, GitHub 프로젝트 관리, 배포까지 첫 웹서비스 개발 경험을 쌓는 과정입니다.",
        en: "For programming beginners: build a first web service with AI, from web portfolios and 3D web apps to GitHub project management and deployment.",
      },
    },
    {
      title: { ko: "바이브 코딩 with Cursor: 챗봇, DB 배포까지", en: "Vibe Coding with Cursor: Chatbots, Databases, and Deployment" },
      description: {
        ko: "현업 개발자·창업 준비자를 대상으로, 챗봇 개발, 회원가입/DB 연동, 배포까지 실제 서비스 수준의 풀스택 개발을 경험하는 과정입니다.",
        en: "For working developers and aspiring founders: experience full-stack development for a real service, including chatbots, sign-up and database integration, and deployment.",
      },
    },
  ],
  courseNote: {
    ko: "두 과정 모두 2026년 8월 리뉴얼된 최신 과정으로, 최신 AI 코딩 도구 Cursor 기반 실습으로 구성되어 있습니다.",
    en: "Both courses were updated in August 2026 and include hands-on practice with the AI coding tool Cursor.",
  },
  operationNote: {
    ko: "Welcome Benefit은 NASA Space Apps Seoul 2026 공식 등록 및 서울 참가 확인을 완료한 참가자를 대상으로 제공되는 사전 준비 혜택입니다.\n\n9월 30일까지는 Early Registration Welcome Benefit으로, 참가 확인을 완료한 등록자에게 개별 안내됩니다.\n\n10월 1일–15일에는 New Joiner Catch-up Welcome Benefit으로, 기존 팀에 합류했거나 신규 팀 등록이 확인된 신규 참가자에게 개별 안내됩니다.",
    en: "Welcome Benefit provides preparation support for participants who have completed official NASA Space Apps Seoul 2026 registration and Seoul participation confirmation.\n\nThrough September 30, registered participants who have completed participation confirmation will receive individual guidance on the Early Registration Welcome Benefit.\n\nFrom October 1–15, new participants who have joined an existing team or whose new team registration has been confirmed will receive individual guidance on the New Joiner Catch-up Welcome Benefit.",
  },
  subsidyTitle: { ko: "국비지원 추천 과정", en: "Recommended Government-subsidized Courses" },
  subsidyIntro: {
    ko: "아래 과정은 NASA Space Apps Seoul 교육 협력기관인 모두의연구소에서 제공하는 국민내일배움카드 기반 국비지원 추천 과정입니다. AI·데이터·개발 역량을 기초부터 다지고 싶은 참가자 및 관심 참가자분들은 필요에 따라 선택적으로 확인하실 수 있습니다.",
    en: "These recommended courses are offered by MODULABS, an Education Collaborator of NASA Space Apps Seoul, with government subsidies through Korea’s National Tomorrow Learning Card. Participants and prospective participants who want to build foundations in AI, data, and development may explore them according to their needs.",
  },
  subsidyCourses: [
    {
      title: { ko: "AI by Hand: 내 손으로 이해하는 딥러닝 기초수학", en: "AI by Hand: Hands-on Foundational Mathematics for Deep Learning" },
      href: "https://service.modulabs.co.kr/r/hdWIsjSI",
      description: {
        ko: "수포자도 괜찮습니다. 딥러닝의 핵심이 되는 기초 수학을 직접 손으로 풀어보며 원리를 이해하는 과정입니다. AI를 처음 접하거나 기초를 탄탄하게 다지고 싶은 분들께 추천합니다.",
        en: "No confidence in math? That is okay. Work through the foundational mathematics behind deep learning by hand to understand its principles. Recommended for AI beginners and those looking to strengthen their foundations.",
      },
    },
    {
      title: { ko: "AI와 함께 코딩하자! 인공지능/데이터 커리어 첫걸음", en: "Code with AI: First Steps toward an AI or Data Career" },
      href: "https://service.modulabs.co.kr/r/nNB_1DY8",
      description: {
        ko: "프로그래밍이 처음이어도 AI 도구와 함께 코딩을 배울 수 있습니다. 해커톤 프로젝트 준비는 물론, 데이터/인공지능 분야로의 커리어 첫걸음을 시작해보고 싶은 분들께 추천합니다.",
        en: "Learn to code with AI tools even if you are new to programming. Recommended for hackathon preparation and for those considering their first steps toward a career in data or AI.",
      },
    },
  ],
  optionalNote: {
    ko: "과정 참여는 선택 사항이며, 해커톤 참가를 위한 필수 조건이 아닙니다. 국비지원 과정의 지원 자격과 수강 조건은 각 과정 안내에서 확인하세요.",
    en: "Courses are optional and are not required to participate in the hackathon. Check each course page for subsidy eligibility and enrollment conditions.",
  },
};
