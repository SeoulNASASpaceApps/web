import type { Locale } from "@/domain/content";

export interface JudgeProfileCopy {
  name: string;
  englishName: string;
  affiliation: string;
  background: readonly string[];
  expertise: string;
  introduction: readonly string[];
  judging: readonly string[];
  reference: string;
  links: readonly { label: string; url: string }[];
}

export interface JudgeProfile {
  id: string;
  copy: Record<Locale, JudgeProfileCopy>;
}

// Hyunwoo Park: current appointment, biography, and laboratory checked 2026-11-19.
// https://gsds.snu.ac.kr/people-post/hyunwoo-park/
// https://hyunwoopark.com/bio/
// https://dial.snu.ac.kr/
// Other biographies retain the event organizer's approved Korean/English copy.
export const judgeProfiles: readonly JudgeProfile[] = [
  {
    "id": "sung-hong-park",
    "copy": {
      "ko": {
        "name": "박성홍 박사님",
        "englishName": "Sung-Hong Park, Ph.D.",
        "affiliation": "한국천문연구원(KASI) · 과학기술연합대학원대학교(UST)",
        "background": [
          "한국천문연구원(KASI) 기초천문연구본부 연구원",
          "과학기술연합대학원대학교(UST) 천문우주과학 전공 교수"
        ],
        "expertise": "태양·태양권 물리학과 우주환경 예측",
        "introduction": [
          "박성홍 박사님께서는 한국천문연구원(KASI) 기초천문연구본부 소속 연구원이며 또한 과학기술연합대학원대학교(UST) 천문우주과학 전공 교수로 활동하고 계십니다. 박사님께서는 태양활동과 태양권 우주환경 변화를 이해하기 위해서 여러 관측 데이터를 분석하는 연구를 선도하며 석·박사 대학원생들과 함께 차세대 태양권 물리학 연구를 이끌고 계십니다. 주요 연구 분야는 태양 대기에서 발생하는 대규모 분출 현상 이해, 태양 고에너지 입자 이벤트 예측을 위한 모델 개발, 태양풍에 의한 지구 자기장 교란 현상 이해, 태양활동에 의한 태양권 우주환경 변화 예측 모델 개발 등이 있습니다. 이를 통해 인류의 태양권 이해와 안전한 우주 탐사의 기반 마련에 기여하고 있으며, 동시에 대학원 교육과 연구실 운영을 통해 차세대 연구자 양성에도 힘쓰고 계십니다."
        ],
        "judging": [
          "NASA Space Apps Challenge 심사위원으로서 박성홍 박사님의 전문성은 참가자들에게 우주에 대한 인간의 지적 호기심을 탐구하는데 영감을 줄 수 있을 것으로 기대하며 또한 참가자들이 제시한 아이디어의 학문적 가치와 실현 가능성을 평가하는 데 중요한 역할을 할 것으로 기대합니다."
        ],
        "reference": "KASI 기초천문연구본부 | UST 천문우주과학 전공",
        "links": [
          {
            "label": "KASI · UST 공식 교수진",
            "url": "https://www.kasi.re.kr/eng/pageView/367"
          }
        ]
      },
      "en": {
        "name": "Dr. Sung-Hong Park",
        "englishName": "Sung-Hong Park, Ph.D.",
        "affiliation": "Korea Astronomy and Space Science Institute · University of Science and Technology",
        "background": [
          "Researcher, Division of Fundamental Astronomy and Space Science, KASI",
          "Professor, Astronomy and Space Science Program, UST"
        ],
        "expertise": "Solar and heliospheric physics · Space weather prediction",
        "introduction": [
          "Dr. Sung-Hong Park ( KASI / UST ) is a researcher in the Division of Fundamental Astronomy and Space Science at the Korea Astronomy and Space Science Institute (KASI) and a professor in the Astronomy and Space Science Program at the University of Science and Technology (UST). He leads a research group of UST graduate students working on a comprehensive analysis of observations obtained from various instruments on the ground and in space, in order to advance our understanding of how various activities of the Sun can disturb physical conditions in the heliosphere (so-called the space weather). His research mainly focuses on understanding the triggering process of solar eruptions such as flares and coronal mass ejections, developing a prediction model of earth-directed solar energetic particles, and investigating the interaction of the solar wind with the Earth's magnetosphere. His research has contributed to a better understanding of the Sun as our nearest star as well as its activity that influences the heliosphere, which will help to ensure the safety of human space exploration."
        ],
        "judging": [
          "As a judge for the NASA Space Apps Challenge, his expertise will inspire participants to explore the complex system of the heliosphere, while assessing the academic value and feasibility of their innovative ideas."
        ],
        "reference": "Theoretical Astronomy Research Center, KASI | Astronomy and Space Science Program, UST",
        "links": [
          {
            "label": "KASI · UST faculty",
            "url": "https://www.kasi.re.kr/eng/pageView/367"
          }
        ]
      }
    }
  },
  {
    "id": "hyunwoo-park",
    "copy": {
      "ko": {
        "name": "박현우 교수님",
        "englishName": "Hyunwoo Park",
        "affiliation": "서울대학교 데이터사이언스대학원",
        "background": [
          "서울대학교 데이터사이언스대학원 교수 (2026~현재)",
          "DIAL Lab · 데이터 인텔리전스 및 학습 연구실",
          "2024년 Y-KAST 회원 선정 · INFORMS TIMES 회장",
          "2025년 INFORMS TIMES Distinguished Service Award 수상"
        ],
        "expertise": "AI·데이터 기반 의사결정 · 데이터 시각화 · 공급망 네트워크 · 기술혁신경영",
        "introduction": [
          "박현우 교수님께서는 서울대학교 데이터사이언스대학원 교수로 재직하고 계시며, DIAL Lab(데이터 인텔리전스 및 학습 연구실)을 이끌고 계십니다. AI와 데이터가 인간의 판단, 조직의 업무, 제품과 서비스의 설계를 어떻게 변화시키는지 연구하시며, 데이터 시각화·공급망 네트워크·기술혁신경영도 주요 연구 분야입니다.",
          "서울대학교 데이터사이언스대학원 부교수(2021~2026)와 교무부원장을 지내셨으며, 서울대 부임 전에는 오하이오주립대학교 피셔경영대학 조교수와 조지아공과대학교 박사후연구원으로 활동하셨습니다.",
          "2024년 한국차세대과학기술한림원(Y-KAST) 회원으로 선정되셨고 같은 해 INFORMS TIMES 회장을 맡으셨으며, 2025년 INFORMS TIMES Distinguished Service Award를 수상하셨습니다. 서울대학교 전기공학 학사, UC버클리 정보관리시스템 석사, 조지아공과대학교 산업공학 박사 학위를 취득하셨습니다."
        ],
        "judging": [
          "NASA Space Apps Challenge 심사위원으로서 박현우 교수님께서는 AI·데이터 분석과 시각화, 네트워크 해석 분야의 전문성을 바탕으로 참가자들의 프로젝트를 살펴봐 주십니다. 복잡한 우주 데이터에서 의미 있는 정보를 도출하고 이를 명확하게 전달하는 과정, 데이터 기반 문제 해결의 타당성과 실질적인 활용 가능성에 대한 관점을 더해주실 예정입니다."
        ],
        "reference": "DIAL Lab · 서울대학교 데이터사이언스대학원",
        "links": [
          {
            "label": "서울대학교 공식 교수 소개",
            "url": "https://gsds.snu.ac.kr/people-post/hyunwoo-park/"
          },
          {
            "label": "연구실 홈페이지 · DIAL Lab",
            "url": "https://dial.snu.ac.kr/"
          }
        ]
      },
      "en": {
        "name": "Professor Hyunwoo Park",
        "englishName": "Hyunwoo Park",
        "affiliation": "Graduate School of Data Science, Seoul National University",
        "background": [
          "Professor, Graduate School of Data Science, SNU (2026–present)",
          "DIAL Lab · Data Intelligence and Learning Lab",
          "Y-KAST member (2024 class) · INFORMS TIMES President (2024)",
          "INFORMS TIMES Distinguished Service Award (2025)"
        ],
        "expertise": "AI and data-driven decisions · Visual analytics · Supply chain networks · Technology and innovation management",
        "introduction": [
          "Professor Hyunwoo Park is a Professor at Seoul National University’s Graduate School of Data Science and leads the Data Intelligence and Learning Lab (DIAL Lab). His research examines AI and data in human judgment, organizational work, and product and service design, alongside visual analytics, supply chain networks, and technology and innovation management.",
          "He previously served as an Associate Professor at SNU (2021–2026) and as Associate Dean for Academic Affairs. Before SNU, he held an Assistant Professorship at The Ohio State University’s Fisher College of Business and a postdoctoral position at Georgia Tech.",
          "A member of the 2024 Y-KAST class, he served as INFORMS TIMES President in 2024 and received its Distinguished Service Award in 2025. His degrees are from SNU (electrical engineering), UC Berkeley (information management and systems), and Georgia Tech (industrial engineering)."
        ],
        "judging": [
          "As a NASA Space Apps Challenge judge, Professor Park will contribute expertise in AI, data analysis, visualization, and network science. He will consider how projects extract meaningful information from complex space data, communicate findings clearly, and offer valid and practically useful approaches to data-driven problem solving."
        ],
        "reference": "DIAL Lab · Graduate School of Data Science, Seoul National University",
        "links": [
          {
            "label": "SNU faculty profile",
            "url": "https://gsds.snu.ac.kr/people-post/hyunwoo-park/"
          },
          {
            "label": "Lab website · DIAL Lab",
            "url": "https://dial.snu.ac.kr/"
          }
        ]
      }
    }
  },
  {
    "id": "sukyoung-lee",
    "copy": {
      "ko": {
        "name": "이수경 교수님",
        "englishName": "SuKyoung Lee",
        "affiliation": "연세대학교 컴퓨터과학과",
        "background": [
          "연세대학교 컴퓨터과학과 교수",
          "무선네트워킹 연구실(Wireless Networking Lab) 책임 교수",
          "학술지 편집위원 · 국제학회 논문 심사·조직위원장"
        ],
        "expertise": "무선 네트워킹 · IoT · 지상·비지상 통신망 · 6G",
        "introduction": [
          "이수경 교수님께서는 연세대학교 컴퓨터과학과 교수이자 무선네트워킹 연구실(Wireless Networking Lab) 책임 교수이십니다. 연구 분야는 사물인터넷(IoT), 자율주행차 통신, 그리고 6G 시스템에 걸쳐 있습니다. 이수경 교수님의 혁신적 비전과 기술적 리더십은 6G 프로토콜, 지상·비지상 통신망(Integrated Terrestrial and Non-Terrestrial Networks), AI 기반 IoT–엣지 협력 분야의 기술을 선도적으로 연구하고 계십니다.",
          "이수경 교수님께서는 학술지 편집위원, 국제학회 논문 심사·조직위원장, 국내외 다수 연구 프로젝트의 책임자로 활발히 활동해오셨습니다. 이러한 연구 성과와 리더십은 6G 프로토콜, IoT-엣지 협력, 견고한 모바일 네트워킹 분야의 발전을 이끌어왔습니다."
        ],
        "judging": [
          "NASA Space Apps Challenge 심사위원으로서, 이수경 교수님의 전문성과 비전은 참가자들에게 위성과 지상 네트워크가 융합된 차세대 통신 패러다임을 탐구하도록 영감을 줄 것으로 기대합니다."
        ],
        "reference": "연세대학교 무선네트워킹 연구실 Winet Lab",
        "links": [
          {
            "label": "무선네트워킹 연구실 · Winet Lab",
            "url": "http://winet.yonsei.ac.kr/"
          },
          {
            "label": "연세대학교 공식 연구실 안내",
            "url": "https://cs.yonsei.ac.kr/csai/researchNW.do"
          }
        ]
      },
      "en": {
        "name": "Professor SuKyoung Lee",
        "englishName": "SuKyoung Lee",
        "affiliation": "Department of Computer Science, Yonsei University",
        "background": [
          "Professor, Department of Computer Science, Yonsei University",
          "Head, Wireless Networking Laboratory",
          "Editorial board member · International conference organizer"
        ],
        "expertise": "Wireless networking · IoT · Terrestrial and non-terrestrial networks · 6G",
        "introduction": [
          "Professor SuKyoung Lee ( Yonsei ) is a professor at Yonsei University’s Department of Computer Science and head of the Wireless Networking Laboratory. She is a distinguished expert in wireless networking, edge computing, and next-generation 6G wireless communications. Her work envisions a future where seamless global connectivity is achieved by integrating terrestrial networks, aerial platforms, and low Earth orbit (LEO) satellites. This unified approach, central to the 6G paradigm, aims to expand communications coverage worldwide—beyond the limitations of ground-based infrastructure—by leveraging LEO satellite constellations in harmony with advanced terrestrial systems.",
          "Her academic interests span Internet of Things (IoT), autonomous vehicle communication, and 6G systems. Professor Lee’s innovative vision and technical leadership have propelled advancements in 6G protocols, Integrated Terrestrial and Non-Terrestrial Networks, and AI-enabled IoT-edge collaboration. She has also contributed extensively as an editorial board member, international conference organizer, and principal investigator in collaborative research projects."
        ],
        "judging": [
          "As a NASA Space Apps Challenge judge, Professor Lee’s expertise in advanced network architectures—including the convergence of satellite and terrestrial technologies—will inspire participants to deliver pioneering solutions for tomorrow’s most complex global challenges."
        ],
        "reference": "Yonsei Wireless Networking Laboratory Winet Lab",
        "links": [
          {
            "label": "Wireless Networking Laboratory · Winet Lab",
            "url": "http://winet.yonsei.ac.kr/"
          },
          {
            "label": "Yonsei research laboratory directory",
            "url": "https://cs.yonsei.ac.kr/csai/researchNW.do"
          }
        ]
      }
    }
  },
  {
    "id": "kevin-wondoo-yoo",
    "copy": {
      "ko": {
        "name": "유원두 리드님",
        "englishName": "Kevin Wondoo Yoo · Korea Business Lead",
        "affiliation": "Amazon Web Services · Aerospace & Satellite Solutions APJ",
        "background": [
          "AWS Aerospace & Satellite Solutions APJ Account Executive (2023~현재)",
          "한화시스템 ICT 및 우주·방위산업 경력 (2009~2022)",
          "연세대학교 MBA(전략경영) · 건국대학교 경영정보학(MIS) 학사"
        ],
        "expertise": "우주산업 생태계 · 스타트업 육성 · 클라우드 도입 및 글로벌 확산",
        "introduction": [
          "유원두 리드님께서는 Amazon Web Services(AWS) 우주위성사업부 Asia-Pacific Team 소속으로, Korea Business Lead(Account Executive) 역할을 맡고 있습니다. 한화시스템에서 약 14년간 ICT 및 우주·방위산업 분야의 경력을 쌓은 뒤, 현재는 AWS에서 우주 기업의 클라우드 도입과 글로벌 확산을 지원하는 전략적 업무를 수행하고 계십니다.",
          "AWS 우주위성사업부는 위성 데이터를 수집·저장·처리하고, AI/ML 및 생성형 AI 서비스를 활용하여 위성 정보 활용을 촉진할 수 있는 혁신적 클라우드 기반 솔루션을 제공합니다. 또한 우주 기업을 위한 AWS 크레딧 패키지, 교육·트레이닝, 기술 지원을 운영하며, 국경을 넘는 글로벌 협업과 함께 APJ 지역 우주 산업 성장을 견인하는 비즈니스 리더로 자리매김하고 있습니다.",
          "현직: AWS Aerospace & Satellite Solutions APJ Account Executive (2023~현재)\r\n이전 경력: 한화시스템 (2009~2022)\r\n학력: 연세대학교 MBA(전략경영), 건국대학교 경영정보학(MIS) 학사"
        ],
        "judging": [
          "유원두 리드님께서는 우주산업 생태계 지원과 스타트업 육성, 우주 기업의 클라우드 도입 및 글로벌 확산을 지원해오신 경험을 바탕으로 산업 전문가의 관점을 더해주십니다. 참가자들의 아이디어가 실제 산업의 수요와 어떻게 연결될 수 있는지, 우주·위성 데이터를 활용한 솔루션이 현장에서 어떻게 활용되고 확장될 수 있는지 살펴보며, 프로젝트의 실현 가능성과 산업적 활용 가치를 함께 검토해주실 예정입니다."
        ],
        "reference": "",
        "links": [
          {
            "label": "AWS Aerospace & Satellite",
            "url": "https://aws.amazon.com/aerospace-and-satellite/"
          },
          {
            "label": "AWS 우주 스타트업 지원 프로그램 소개",
            "url": "https://aws.amazon.com/blogs/publicsector/aws-launches-space-accelerator-program-across-australia-india-and-japan/"
          }
        ]
      },
      "en": {
        "name": "Kevin Wondoo Yoo",
        "englishName": "Kevin Wondoo Yoo · Korea Business Lead",
        "affiliation": "Amazon Web Services · Aerospace & Satellite Solutions APJ",
        "background": [
          "Korea Business Lead (Account Executive), AWS Aerospace & Satellite Solutions",
          "APJ Account Executive (2023–present) · Hanwha Systems (2009–2022)",
          "MBA, Yonsei University · B.A. in MIS, Konkuk University"
        ],
        "expertise": "Space ecosystem · Startup development · Cloud adoption and global expansion",
        "introduction": [
          "Kevin Wondoo Yoo is the Korea Business Lead (Account Executive) for the Asia-Pacific Team of Amazon Web Services (AWS) Aerospace & Satellite Solutions. He built a career of about 14 years at Hanwha Systems in the ICT and space/defense sectors before joining AWS, where he now plays a strategic role in supporting space companies with cloud adoption and global expansion.",
          "AWS Aerospace & Satellite Solutions provides innovative cloud-based solutions that enable space companies to collect, store, and process satellite data, as well as leverage AI/ML and generative AI services to accelerate the utilization of satellite information. The division also operates AWS credit packages, training programs, and technical support for space companies, driving cross-border collaboration and leading the growth of the space industry in the APJ region.",
          "Current Position: AWS Aerospace & Satellite Solutions, APJ Account Executive (2023–present)\r\nPrevious Experience: Hanwha Systems (2009–2022)\r\nEducation: MBA in Strategic Management, Yonsei University; B.A. in Management Information Systems, Konkuk University"
        ],
        "judging": [
          "As a NASA Space Apps judge, Kevin Wondoo Yoo will bring an industry perspective informed by his work supporting the space ecosystem, startup development, and cloud adoption and global expansion for space companies. He will consider how participants’ ideas connect with real industry needs and how solutions using space and satellite data could be applied and scaled in practice, contributing his perspective on feasibility and practical value."
        ],
        "reference": "",
        "links": [
          {
            "label": "AWS Aerospace & Satellite",
            "url": "https://aws.amazon.com/aerospace-and-satellite/"
          },
          {
            "label": "AWS space startup support program",
            "url": "https://aws.amazon.com/blogs/publicsector/aws-launches-space-accelerator-program-across-australia-india-and-japan/"
          }
        ]
      }
    }
  }
];
