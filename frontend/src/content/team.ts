import type { Locale } from "@/domain/content";

export interface TeamProfileParagraphPart {
  text: string;
  emphasized?: boolean;
  tone?: "navy";
}

export interface TeamProfileSection {
  title: "Background" | "Introduction";
  bullets?: readonly string[];
  paragraphs?: readonly (readonly TeamProfileParagraphPart[])[];
}

export interface TeamProfileCopy {
  affiliation: string;
  highlight: string;
  sections: readonly TeamProfileSection[];
}

export interface TeamProfile {
  id: string;
  name: string;
  copy: Record<Locale, TeamProfileCopy>;
}

const text = (value: string, emphasized = false): TeamProfileParagraphPart => ({
  text: value,
  ...(emphasized ? { emphasized: true } : {}),
});

const navyText = (value: string): TeamProfileParagraphPart => ({
  text: value,
  tone: "navy",
});

export const organizingTeamProfiles: readonly TeamProfile[] = [
  {
    id: "eunice-kimjiye",
    name: "김지예 Eunice Kimjiye",
    copy: {
      ko: {
        affiliation: "Intellius 대표 | MBB Career 총괄",
        highlight: "Intellius를 통해 지성과 호기심을 연결하고, 사람들이 성장과 도전의 기회를 경험할 수 있는 서비스를 만들고 있습니다.",
        sections: [
          { title: "Background", bullets: [
            "연세대학교 공학석사 (컴퓨터소프트웨어)",
            "Rhode Island School of Design (RISD) 산업디자인 학사",
            "Goldman Sachs 10,000 Small Businesses Alumni",
            "IDEA Design Award Bronze 수상",
            "NASA International Space Apps Challenge Alumni — 2024 People’s Choice",
            "NASA Space Apps Challenge Seoul 2025 운영팀",
          ] },
          { title: "Introduction", paragraphs: [
            [text("사람과 아이디어가 만나 실제 제품과 서비스로 연결하는 일을 좋아합니다.", true)],
            [text("미국에서 디자인과 비즈니스를 경험한 뒤 소프트웨어를 공부하며 활동 영역을 기술로 확장해 왔습니다.")],
            [navyText("Intellius를 통해 지성과 호기심을 연결하고, 사람들이 성장과 도전의 기회를 경험할 수 있는 서비스를 만들고 있습니다."), text(" NASA 공개 데이터를 활용해 다양한 사람들이 문제 해결에 도전하는 국제 해커톤 NASA Space Apps Seoul을 비영리로 운영하고 있으며, MBB Career를 통해 더 높은 커리어를 목표로 하는 인재들이 자신의 역량을 효과적으로 전달할 수 있도록 돕는 프리미엄 AI 직무 인터뷰 준비 서비스를 운영하고 있습니다.")],
            [text("NASA Space Apps에는 2024년 참가자로 처음 참여했습니다. 이후 2025년 운영팀을 거쳐 현재 Seoul Local Lead로 함께하고 있습니다.", true)],
            [text("Space Apps의 가장 큰 매력은 서로 다른 배경의 사람들이 과학과 기술이라는 공통의 문제를 놓고 함께 무언가를 만들어본다는 데 있다고 생각합니다. 서울 운영팀은 더 많은 참가자가 정보나 연결의 부족 때문에 좋은 도전의 기회를 놓치지 않도록 팀 빌딩, 교육, 멘토링과 외부 기회를 연결하고 있습니다.")],
            [text("서울 운영팀 역시 각자의 경험과 전문성을 나누는 자발적인 참여를 기반으로 운영됩니다. 참가자의 경험이 또 다른 참가자의 기회로 이어지는 커뮤니티를 만드는 것, 그리고 사람·기술·아이디어 사이의 연결을 실제 결과로 이어가는 것이 제가 Space Apps Seoul을 운영하는 이유입니다.")],
          ] },
        ],
      },
      en: {
        affiliation: "CEO, Intellius | Head of MBB Career",
        highlight: "Through Intellius, I connect intellect and curiosity to create services that help people experience opportunities for growth and new challenges.",
        sections: [
          { title: "Background", bullets: [
            "M.E. in Computer Software, Yonsei University",
            "B.F.A. in Industrial Design, Rhode Island School of Design (RISD)",
            "Goldman Sachs 10,000 Small Businesses Alumni",
            "IDEA Design Award Bronze winner",
            "NASA International Space Apps Challenge Alumni — 2024 People’s Choice",
            "NASA Space Apps Challenge Seoul 2025 Organizing Team",
          ] },
          { title: "Introduction", paragraphs: [
            [text("I enjoy bringing people and ideas together and connecting them to real products and services.", true)],
            [text("After gaining experience in design and business in the United States, I studied software and expanded my work into technology.")],
            [navyText("Through Intellius, I connect intellect and curiosity to create services that help people experience opportunities for growth and new challenges."), text(" I run NASA Space Apps Seoul as a nonprofit international hackathon where people use NASA open data to tackle problems, and I lead MBB Career, a premium AI-powered interview preparation service that helps ambitious professionals communicate their capabilities effectively.")],
            [text("I first participated in NASA Space Apps in 2024. After joining the organizing team in 2025, I now serve as Seoul Local Lead.", true)],
            [text("To me, the greatest appeal of Space Apps is that people from different backgrounds come together around shared challenges in science and technology to build something. The Seoul organizing team connects participants with team-building, education, mentoring, and external opportunities so that a lack of information or connections does not keep anyone from a meaningful challenge.")],
            [text("The Seoul organizing team is also powered by volunteers sharing their experience and expertise. I organize Space Apps Seoul to build a community where one participant’s experience creates opportunities for another, and to turn connections among people, technology, and ideas into tangible outcomes.")],
          ] },
        ],
      },
    },
  },
  {
    id: "jade-jeon",
    name: "전선민 Jade Jeon",
    copy: {
      ko: {
        affiliation: "한화시스템 ERP 컨설턴트",
        highlight: "개발과 컨설팅을 오가며 복잡한 문제를 정리하고, 실제로 작동하는 시스템과 프로세스로 만들어가는 경험을 쌓아왔습니다.",
        sections: [
          { title: "Background", bullets: [
            "연세대학교 공학석사 (컴퓨터소프트웨어)",
            "한국외국어대학교 영어전공 학사 · 광고홍보 부전공",
            "웹서비스 및 사내 시스템 개발 경력",
            "한화시스템 SAP ERP 재무회계 컨설턴트",
            "NASA International Space Apps Challenge Alumni — 2024 People’s Choice",
            "NASA Space Apps Challenge Seoul 2025 운영팀",
          ] },
          { title: "Introduction", paragraphs: [
            [text("기술을 실제 사람과 비즈니스의 문제에 연결하는 과정에 관심이 많습니다.", true)],
            [text("개발자로 약 6년간 웹서비스와 사내 시스템을 만들고 운영했으며, 한화시스템에서 SAP ERP 재무회계 컨설턴트로 일하고 있습니다. "), navyText("개발과 컨설팅을 오가며 복잡한 문제를 정리하고, 실제로 작동하는 시스템과 프로세스로 만들어가는 경험을 쌓아왔습니다.")],
            [text("NASA Space Apps에는 2024년 참가자로 처음 참여했습니다. 이후 2025년 운영팀을 거쳐 현재 Seoul Co-Lead로 함께하고 있습니다.", true)],
            [text("Space Apps에서는 좋은 아이디어만큼 서로 다른 사람들이 팀을 만들고, 필요한 정보와 사람을 만나 실제 결과물까지 만들어가는 과정이 중요하다고 생각합니다. 올해는 참가자 운영과 행사 실행을 중심으로 콘텐츠·커뮤니티 운영과 운영 프로세스 정리에 함께 참여하고 있습니다.")],
            [text("참가자들이 정보나 연결의 부족 때문에 좋은 도전을 놓치지 않고, 행사 이후에도 사람과 경험이 다시 연결될 수 있는 Space Apps를 만드는 데 기여하고 싶습니다.")],
          ] },
        ],
      },
      en: {
        affiliation: "ERP Consultant, Hanwha Systems",
        highlight: "Working across development and consulting, I have learned to organize complex problems and turn them into systems and processes that work in practice.",
        sections: [
          { title: "Background", bullets: [
            "M.E. in Computer Software, Yonsei University",
            "B.A. in English with a minor in Advertising and Public Relations, Hankuk University of Foreign Studies",
            "Experience developing web services and internal systems",
            "SAP ERP Financial Accounting Consultant, Hanwha Systems",
            "NASA International Space Apps Challenge Alumni — 2024 People’s Choice",
            "NASA Space Apps Challenge Seoul 2025 Organizing Team",
          ] },
          { title: "Introduction", paragraphs: [
            [text("I am interested in the process of connecting technology to real problems faced by people and businesses.", true)],
            [text("I spent about six years building and operating web services and internal systems as a developer, and I work at Hanwha Systems as an SAP ERP Financial Accounting consultant. "), navyText("Working across development and consulting, I have learned to organize complex problems and turn them into systems and processes that work in practice.")],
            [text("I first participated in NASA Space Apps in 2024. After joining the organizing team in 2025, I now serve as Seoul Co-Lead.", true)],
            [text("At Space Apps, I believe the process matters as much as the idea: people with different backgrounds form teams, find the information and collaborators they need, and build a real outcome together. This year, I am helping with participant operations and event delivery, including content, community, and operational processes.")],
            [text("I want to help create a Space Apps where participants do not miss meaningful challenges because they lack information or connections, and where people and experiences reconnect after the event.")],
          ] },
        ],
      },
    },
  },
  {
    id: "kyunghwan-koo",
    name: "구경환 Ryan Koo",
    copy: {
      ko: {
        affiliation: "한국항공우주연구원(KARI) KPS 지상사용자시스템체계팀 연구원",
        highlight: "한국항공우주연구원(KARI)에서 한국형 위성항법시스템(KPS) 지상시스템을 연구하며, 위성항법·위성통신과 우주 시스템 분야의 연구개발을 수행하고 있습니다.",
        sections: [
          { title: "Background", bullets: [
            "한양대학교 공학석사 (통신정보공학)",
            "한국항공우주연구원 한국형 위성항법시스템(KPS) 지상시스템 연구",
            "위성항법·위성통신 및 우주 시스템 연구",
            "NASA International Space Apps Challenge Seoul Alumni — 2025 Data Excellence Recognition",
          ] },
          { title: "Introduction", paragraphs: [
            [text("우주 시스템 현장의 경험을 참가자들의 아이디어와 연결하고 싶습니다.", true)],
            [navyText("한국항공우주연구원(KARI)에서 한국형 위성항법시스템(KPS) 지상시스템을 연구하고 있으며, 위성항법·위성통신과 우주 시스템 분야의 연구개발을 수행하고 있습니다.")],
            [text("2025년 서울 대회 참가 경험을 계기로 올해는 운영진으로 함께하고 있습니다.", true)],
            [text("서울 대회에서 직접 프로젝트를 개발해 Data Excellence Recognition을 받은 경험이 있으며, 제한된 시간 안에 아이디어를 실제 기술과 서비스의 형태로 구체화하는 Space Apps의 과정을 경험했습니다. 이번에는 참가자가 아닌 운영진으로서 새로운 아이디어를 가진 팀들이 기술적 가능성을 충분히 펼칠 수 있도록 돕고자 참여했습니다.")],
            [text("위성·지상시스템의 구성과 인터페이스, 데이터 활용, 기술적 실현 가능성 등 실제 우주 시스템 현장에서 쌓은 경험을 참가자들과 나누고 싶습니다. 좋은 아이디어가 해커톤 결과물에 그치지 않고 향후 연구·개발이나 서비스로 발전할 수 있는 가능성까지 함께 살펴보는 데 기여하고 싶습니다.")],
          ] },
        ],
      },
      en: {
        affiliation: "Researcher, KPS Ground User System Engineering Team, Korea Aerospace Research Institute (KARI)",
        highlight: "At the Korea Aerospace Research Institute (KARI), I research the ground segment of the Korean Positioning System (KPS) and conduct R&D in satellite navigation, satellite communications, and space systems.",
        sections: [
          { title: "Background", bullets: [
            "M.E. in Communication and Information Engineering, Hanyang University",
            "Research on the ground segment of the Korean Positioning System (KPS) at KARI",
            "Research in satellite navigation, satellite communications, and space systems",
            "NASA International Space Apps Challenge Seoul Alumni — 2025 Data Excellence Recognition",
          ] },
          { title: "Introduction", paragraphs: [
            [text("I want to connect hands-on space systems experience with participants’ ideas.", true)],
            [navyText("At the Korea Aerospace Research Institute (KARI), I research the ground segment of the Korean Positioning System (KPS) and conduct R&D in satellite navigation, satellite communications, and space systems.")],
            [text("After participating in the 2025 Seoul event, I joined this year’s organizing team.", true)],
            [text("I developed a project at the Seoul event and received the Data Excellence Recognition, experiencing firsthand how Space Apps turns ideas into tangible technologies and services under tight time constraints. This time, I joined the organizing team to help teams with new ideas realize their full technical potential.")],
            [text("I want to share practical experience in satellite and ground-system architecture, interfaces, data use, and technical feasibility. I hope to help teams explore how strong ideas can grow beyond a hackathon deliverable into future research, development, or services.")],
          ] },
        ],
      },
    },
  },
  {
    id: "hyunji-na",
    name: "나현지",
    copy: {
      ko: {
        affiliation: "알라딘커뮤니케이션 백엔드 개발자",
        highlight: "백엔드 개발자로 근무하며 인증·인가 및 회원 시스템을 개발하고 있습니다.",
        sections: [
          { title: "Background", bullets: [
            "알라딘커뮤니케이션 백엔드 개발자",
            "인증·인가 및 회원 시스템 개발",
            "OIDC/OAuth2 기반 인증 시스템 구축",
            "Java·Spring 기반 백엔드 서비스 및 클라우드 환경 개발",
            "NASA Space Apps Challenge 2024 참가 및 우승팀 ‘가지니’ 멤버",
          ] },
          { title: "Introduction", paragraphs: [
            [text("아이디어가 실제로 동작하는 서비스가 되는 과정에 관심이 있습니다.", true)],
            [navyText("알라딘커뮤니케이션에서 백엔드 개발자로 근무하며 인증·인가 및 회원 시스템을 개발하고 있습니다."), text(" OIDC/OAuth2 기반 인증 시스템 구축과 Java·Spring 기반 백엔드 서비스, 클라우드 환경에서의 개발 경험을 쌓아왔으며, 백엔드 아키텍처와 AI를 활용한 개발 생산성 향상에도 관심을 가지고 있습니다.")],
            [text("2024년 팀 ‘가지니’로 Space Apps에 참가한 경험이 있습니다. 참가자로서 좋은 경험을 얻었던 만큼, 올해는 운영진으로 함께하고 있습니다.", true)],
            [text("짧은 시간 안에 처음 만난 문제를 이해하고, 팀원들과 아이디어를 구체화해 실제 결과물로 만들어가는 과정이 특히 인상 깊었습니다. 참가자로서 좋은 경험을 얻었던 만큼, 이번에는 운영진으로 참여해 새로운 참가자들이 Space Apps를 즐겁고 의미 있게 경험할 수 있도록 돕고자 참여했습니다.")],
            [text("해커톤에서는 기술적으로 완벽한 결과물을 만드는 것보다 주어진 문제를 어떻게 정의하고, 아이디어를 실제 구현 가능한 형태로 발전시킬 것인지가 중요하다고 생각합니다. 백엔드 개발 경험과 직접 해커톤에 참가했던 경험을 바탕으로 아이디어 구체화, 기술적 방향 설정, 그리고 제한된 시간 안에 결과물을 완성하는 과정에서 참가자들에게 실질적인 도움을 드리고 싶습니다.")],
          ] },
        ],
      },
      en: {
        affiliation: "Backend Developer, Aladin Communication",
        highlight: "I work as a backend developer, building authentication, authorization, and member systems.",
        sections: [
          { title: "Background", bullets: [
            "Backend Developer, Aladin Communication",
            "Development of authentication, authorization, and member systems",
            "OIDC/OAuth2-based authentication system development",
            "Java and Spring backend services and cloud development",
            "Member of ‘Gajini,’ a winning team at NASA Space Apps Challenge 2024",
          ] },
          { title: "Introduction", paragraphs: [
            [text("I am interested in the process of turning ideas into services that work in practice.", true)],
            [navyText("I work as a backend developer at Aladin Communication, building authentication, authorization, and member systems."), text(" I have built OIDC/OAuth2-based authentication systems and developed Java and Spring backend services in cloud environments. I am also interested in backend architecture and using AI to improve development productivity.")],
            [text("I participated in Space Apps in 2024 as a member of Team ‘Gajini.’ After such a rewarding participant experience, I joined this year’s organizing team.", true)],
            [text("I was especially inspired by the process of understanding an unfamiliar problem, developing an idea with my teammates, and turning it into a real outcome in a short time. After such a rewarding participant experience, I joined the organizing team to help new participants enjoy a meaningful Space Apps experience.")],
            [text("In a hackathon, I believe it is more important to define the problem and develop an idea into something feasible than to pursue a technically perfect result. Drawing on my backend development and hackathon experience, I want to offer practical help as participants refine ideas, set technical direction, and complete their work within a limited time.")],
          ] },
        ],
      },
    },
  },
  {
    id: "sungeun-choi",
    name: "최성은 Sungeun Choi",
    copy: {
      ko: {
        affiliation: "알라딘커뮤니케이션 AI Engineer",
        highlight: "AI Engineer로 근무하며 LLM과 추천 시스템을 중심으로 AI 모델 기반 서비스를 개발하고 있습니다.",
        sections: [
          { title: "Background", bullets: [
            "연세대학교 공학석사 (컴퓨터소프트웨어)",
            "고려대학교 바이오시스템의과학부 · 응용통계학과 학사",
            "알라딘커뮤니케이션 AI Engineer — LLM · 추천 시스템",
            "NASA International Space Apps Challenge Alumni — 2024 Global Finalist, Team 가지니",
            "Google·AWS 등 기술 해커톤 다수 참여",
          ] },
          { title: "Introduction", paragraphs: [
            [text("데이터와 AI를 활용해 아이디어를 실제 서비스로 구체화하는 과정에 관심이 있습니다.", true)],
            [navyText("알라딘커뮤니케이션에서 AI Engineer로 근무하며 LLM과 추천 시스템을 중심으로 AI 모델 기반 서비스를 개발하고 있습니다."), text(" 서비스 설계부터 데이터 탐색과 파이프라인 구축, 모델 개발, 실제 서비스 적용까지 전반적인 개발 과정을 경험하며 아이디어를 실제로 동작하는 서비스로 만들어가고 있습니다.")],
            [text("2024년 팀 ‘가지니’로 Space Apps에 참가해 NASA 공개 데이터를 활용한 프로젝트를 진행했고, Global Finalist에 선정되었습니다.", true)],
            [text("당시 팀 ‘가지니’로 NASA 공개 데이터를 활용한 프로젝트를 진행해 Global Finalist에 선정되었습니다. 어떤 문제를 풀 것인지 정의하는 것부터 필요한 데이터를 직접 찾고 구조를 설계하는 과정까지 많은 시행착오를 경험했고, 제한된 시간 안에 수많은 데이터와 아이디어 가운데 가능성 있는 방향을 선택해 실제 결과물로 만들어가는 과정이 Space Apps에서 가장 기억에 남는 경험이 되었습니다.")],
            [text("해커톤에서는 좋은 아이디어만큼 "), text("무슨 문제를 풀 것인지, 어떤 데이터를 사용할 것인지, 제한된 시간 안에 어디까지 구현할 것인지", true), text("를 빠르게 결정하는 과정이 중요하다고 생각합니다. 참가자들이 막연한 아이디어를 구체적인 문제로 정의하고, 필요한 데이터를 찾아 분석하며, AI와 기술을 활용해 실제 구현 가능한 서비스와 결과물로 발전시키는 과정에서 제 경험을 나누고 싶습니다.")],
          ] },
        ],
      },
      en: {
        affiliation: "AI Engineer, Aladin Communication",
        highlight: "I work as an AI Engineer, developing AI-powered services centered on LLMs and recommendation systems.",
        sections: [
          { title: "Background", bullets: [
            "M.E. in Computer Software, Yonsei University",
            "B.S. in Biosystems and Biomedical Sciences and Applied Statistics, Korea University",
            "AI Engineer at Aladin Communication — LLMs and recommendation systems",
            "NASA International Space Apps Challenge Alumni — 2024 Global Finalist, Team Gajini",
            "Participant in multiple technology hackathons, including Google and AWS events",
          ] },
          { title: "Introduction", paragraphs: [
            [text("I am interested in using data and AI to turn ideas into real services.", true)],
            [navyText("I work as an AI Engineer at Aladin Communication, developing AI-powered services centered on LLMs and recommendation systems."), text(" My work spans service design, data exploration, pipeline construction, model development, and production deployment, giving me experience turning ideas into services that work in practice.")],
            [text("In 2024, I participated in Space Apps as a member of Team ‘Gajini,’ worked on a project using NASA open data, and was selected as a Global Finalist.", true)],
            [text("As a member of Team ‘Gajini,’ I worked on a project using NASA open data and was selected as a Global Finalist. From defining the problem to finding the right data and designing its structure, the project involved plenty of trial and error. Choosing a promising direction from many datasets and ideas and turning it into a real outcome under time constraints remains my most memorable Space Apps experience.")],
            [text("In a hackathon, a good idea matters, but so does quickly deciding "), text("which problem to solve, which data to use, and how much to build within the available time", true), text(". I want to share my experience as participants turn broad ideas into concrete problems, find and analyze the data they need, and use AI and technology to develop feasible services and outcomes.")],
          ] },
        ],
      },
    },
  },
];
