export interface TeamProfileSection {
  title: string;
  bullets?: readonly string[];
  paragraphs?: readonly {
    text: string;
    emphasized?: boolean;
  }[];
}

export interface TeamProfile {
  id: string;
  name: string;
  role?: string;
  affiliation?: string;
  highlight: string;
  highlightPlaceholder?: boolean;
  sections: readonly TeamProfileSection[];
}

export const organizingTeamProfiles: readonly TeamProfile[] = [
  {
    id: "eunice-kimjiye",
    name: "김지예 Eunice Kimjiye",
    role: "NASA Space Apps Seoul Local Lead",
    affiliation: "Intellius 대표 | MBB Career 총괄",
    highlight: "Intellius를 통해 지성과 호기심을 연결하고, 사람들이 성장과 도전의 기회를 경험할 수 있는 서비스를 만들고 있습니다.",
    sections: [
      {
        title: "Background",
        bullets: [
          "Rhode Island School of Design (RISD) 산업디자인 학사",
          "연세대학교 공학대학원 컴퓨터소프트웨어 석사",
          "Goldman Sachs 10,000 Small Businesses Alumni",
          "IDEA Design Award Bronze 수상",
          "NASA International Space Apps Challenge Alumni — 2024 People’s Choice",
          "NASA Space Apps Challenge 2025 운영팀",
        ],
      },
      {
        title: "Introduction",
        paragraphs: [
          {
            text: "사람과 아이디어가 만나 실제 제품과 서비스로 연결되는 과정에 관심이 많습니다.",
            emphasized: true,
          },
          {
            text: "미국에서 디자인과 비즈니스를 경험한 뒤 소프트웨어를 공부하며 활동 영역을 기술로 확장해 왔습니다.",
          },
          {
            text: "현재 Intellius를 통해 지성과 호기심을 연결하고, 사람들이 성장과 도전의 기회를 경험할 수 있는 서비스를 만들고 있습니다. NASA 공개 데이터를 활용해 다양한 사람들이 문제 해결에 도전하는 국제 해커톤 NASA Space Apps Seoul을 비영리로 운영하고 있으며, MBB Career를 통해 더 높은 커리어를 목표로 하는 인재들이 자신의 역량을 효과적으로 전달할 수 있도록 돕는 프리미엄 AI 직무 인터뷰 준비 서비스를 운영하고 있습니다.",
          },
          {
            text: "NASA Space Apps와의 인연은 2024년 참가자로 시작해, 2025년 운영팀을 거쳐 현재 Seoul Local Lead로 이어지고 있습니다.",
            emphasized: true,
          },
          {
            text: "Space Apps의 가장 큰 매력은 서로 다른 배경의 사람들이 과학과 기술이라는 공통의 문제를 놓고 함께 무언가를 만들어본다는 데 있다고 생각합니다. 서울 운영팀은 더 많은 참가자가 정보나 연결의 부족 때문에 좋은 도전의 기회를 놓치지 않도록 팀 빌딩, 교육, 멘토링과 외부 기회를 연결하고 있습니다.",
          },
          {
            text: "서울 운영팀 역시 각자의 경험과 전문성을 나누는 자발적인 참여를 기반으로 운영됩니다. 참가자의 경험이 또 다른 참가자의 기회로 이어지는 커뮤니티를 만드는 것, 그리고 사람·기술·아이디어 사이의 연결을 실제 결과로 이어가는 것이 제가 Space Apps Seoul을 운영하는 이유입니다.",
          },
        ],
      },
    ],
  },
  {
    id: "jade-jeon",
    name: "전선민 Jade Jeon",
    affiliation: "Hanwha Systems",
    highlight: "Full profile coming soon.",
    highlightPlaceholder: true,
    sections: [
      {
        title: "Background",
        bullets: [
          "연세대학교 공학대학원 컴퓨터소프트웨어 석사",
          "NASA International Space Apps Challenge Alumni — 2024 People’s Choice",
          "NASA Space Apps Challenge 2025 운영팀",
        ],
      },
      {
        title: "Introduction",
        paragraphs: [{ text: "Full profile coming soon.", emphasized: true }],
      },
    ],
  },
  {
    id: "kyunghwan-koo",
    name: "구경환",
    affiliation: "한국항공우주연구원(KARI) KPS 지상사용자시스템체계팀 연구원",
    highlight: "위성항법·위성통신 및 우주 시스템 현장에서 쌓은 경험을 바탕으로 참가자들의 아이디어를 실제 우주 시스템 관점에서 구체화하는 데 도움을 드리고 싶습니다.",
    sections: [
      {
        title: "Background",
        bullets: [
          "한양대학교 공학석사(통신정보공학)",
          "한국항공우주연구원 한국형 위성항법시스템(KPS) 지상시스템 연구",
          "NASA International Space Apps Challenge Seoul Alumni — 2025 Data Excellence Recognition",
        ],
      },
      {
        title: "Space Apps 참가 경험 및 운영팀 참여 이유",
        paragraphs: [
          {
            text: "NASA Space Apps Challenge Seoul 2025에서 직접 참가하여 Data Excellence Recognition을 받은 경험이 있습니다. 아이디어를 제한된 시간 안에 실제 기술과 서비스의 형태로 구체화하는 Space Apps의 과정을 경험했고, 이번에는 참가자가 아닌 운영진으로서 새로운 아이디어를 가진 팀들이 기술적 가능성을 충분히 펼칠 수 있도록 돕고자 참여하게 되었습니다.",
          },
        ],
      },
      {
        title: "이번 행사에서 참가자들에게 기여하고 싶은 부분",
        paragraphs: [
          {
            text: "위성항법·위성통신 및 우주 시스템 현장에서 쌓은 경험을 바탕으로 참가자들의 아이디어를 실제 우주 시스템 관점에서 구체화하는 데 도움을 드리고 싶습니다. 특히 위성·지상시스템의 구성과 인터페이스, 데이터 활용, 기술적 실현 가능성 등을 함께 살펴보고, 좋은 아이디어가 단순한 해커톤 결과물에 그치지 않고 실제 연구·개발이나 서비스로 발전할 수 있도록 지원하고 싶습니다.",
          },
        ],
      },
    ],
  },
];
