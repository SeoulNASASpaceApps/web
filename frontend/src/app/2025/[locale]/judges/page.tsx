"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Judge {
  id: string;
  gender: string;
  image: string;
  alt: { ko: string; en: string };
  name: { ko: string; en: string };
  affiliation: { ko: string; en: string };
  bioShort: { ko: string; en: string };
  bioLong: { ko: string; en: string };
  links: { label: string; url: string }[];
}

export default function JudgesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === "ko";

  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedCardRef = useRef<HTMLButtonElement | null>(null);

  const judges: Judge[] = [
    {
      id: "sung-hong-park",
      gender: "male",
      image: "/images/judges/judges_01.png",
      alt: { ko: "박성홍 박사 초상", en: "Portrait of Dr. Sung-Hong Park" },
      name: { ko: "박성홍 박사님", en: "Dr. Sung-Hong Park" },
      affiliation: {
        ko: "한국천문연구원 / 과학기술연합대학원대학교",
        en: "KASI / UST",
      },
      bioShort: {
        ko: "태양 활동과 태양권 우주환경 변화를 관측·예측하는 연구를 선도하는 KASI 연구원, UST 교수.",
        en: "KASI researcher and UST professor leading heliospheric observation and prediction research.",
      },
      bioLong: {
        ko: "박성홍 박사는 한국천문연구원(KASI) 기초천문연구본부 소속 연구원이며 또한 과학기술연합대학원대학교(UST) 천문우주과학 전공 교수로 활동하고 있다. 그는 태양활동과 태양권 우주환경 변화를 이해하기 위해서 여러 관측 데이터를 분석하는 연구를 선도하며 석·박사 대학원생들과 함께 차세대 태양권 물리학 연구를 이끌고 있다. 주요 연구 분야는 태양 대기에서 발생하는 대규모 분출 현상 이해, 태양 고에너지 입자 이벤트 예측을 위한 모델 개발, 태양풍에 의한 지구 자기장 교란 현상 이해, 태양활동에 의한 태양권 우주환경 변화 예측 모델 개발 등이다. NASA Space Apps Challenge 심사 위원으로서 참가 아이디어의 학문적 가치와 실현 가능성을 평가한다.",
        en: "Dr. Sung-Hong Park is a researcher at KASI's Division of Fundamental Astronomy and Space Science and a professor at UST. He leads a research group analyzing multi-instrument observations to understand how solar activities disturb the heliosphere. His work focuses on triggers of flares/CMEs, prediction of earth-directed SEPs, and solar wind-magnetosphere interactions, contributing to safer human space exploration. As a judge, he assesses academic value and feasibility while inspiring participants to explore heliophysics.",
      },
      links: [
        { label: "KASI", url: "https://www.kasi.re.kr/" },
        {
          label: "UST Program",
          url: "https://www.ust.ac.kr/prog/major/kor/sub03_03_04/AA/view.do?majorNo=22",
        },
      ],
    },
    {
      id: "hyunwoo-park",
      gender: "male",
      image: "/images/judges/judges_02.png",
      alt: { ko: "박현우 교수 초상", en: "Portrait of Prof. Hyunwoo Park" },
      name: { ko: "박현우 교수님", en: "Prof. Hyunwoo Park" },
      affiliation: {
        ko: "서울대학교 데이터사이언스대학원 / ViBA Lab",
        en: "SNU Graduate School of Data Science / ViBA Lab",
      },
      bioShort: {
        ko: "대규모 네트워크 분석·시각화 전문가, 데이터 기반 의사결정 및 복잡계 분석 연구.",
        en: "Expert in large-scale network analytics and visualization; data-driven decision making.",
      },
      bioLong: {
        ko: "박현우 교수는 서울대학교 데이터사이언스대학원 부교수이자 Network Analytics & Visualization Lab 책임 교수이다. 대규모 네트워크 분석, 데이터 시각화, 비즈니스 애널리틱스, 운영관리, 복잡계 시스템 해석을 연구하며, 위성·우주 탐사 데이터의 시각화와 실시간 분석을 선도한다. 국제 학술지/학회 활동과 정부·산업 프로젝트를 이끌어왔고, 2024년 Y-KAST 회원으로 선정되었다. 심사 위원으로서 참가자들이 대규모 복잡 데이터를 심층 분석하고 첨단 시각화 기법을 적용하도록 이끈다.",
        en: "Prof. Hyunwoo Park is Associate Professor at SNU GSDS and director of the Network Analytics & Visualization Lab. His research spans network analysis, visualization, business analytics, operations, and complex systems, including satellite and exploration data. Recognized by Y-KAST (2024), he guides teams to extract insights from massive networks via advanced visual analytics.",
      },
      links: [{ label: "ViBA Lab", url: "https://viba.snu.ac.kr/" }],
    },
    {
      id: "sukyoung-lee",
      gender: "female",
      image: "/images/judges/judges_05.png",
      alt: { ko: "이수경 교수 초상", en: "Portrait of Prof. SuKyoung Lee" },
      name: { ko: "이수경 교수님", en: "Prof. SuKyoung Lee" },
      affiliation: {
        ko: "연세대학교 컴퓨터과학과 / Wireless Networking Lab",
        en: "Yonsei University Computer Science / Wireless Networking Lab",
      },
      bioShort: {
        ko: "6G·IoT·자율주행 통신 및 위성-지상 통합 네트워크 전문가.",
        en: "Expert in 6G, IoT, AV communications, and integrated satellite-terrestrial networks.",
      },
      bioLong: {
        ko: "이수경 교수는 연세대학교 컴퓨터과학과 교수이자 무선네트워킹 연구실 책임 교수로, IoT, 자율주행 통신, 6G 시스템을 연구한다. 6G 프로토콜, 지상·비지상 통신망 통합, AI 기반 IoT–엣지 협력을 선도하며, 학술·산업 프로젝트를 폭넓게 이끌고 있다. 심사 위원으로서 위성·지상 네트워크 융합의 차세대 통신 패러다임을 탐구하도록 영감을 준다.",
        en: "Prof. SuKyoung Lee (Yonsei) leads the Wireless Networking Lab, focusing on IoT, autonomous vehicle communication, and 6G. She advances protocols, integrated terrestrial/non-terrestrial networks, and AI-enabled IoT-edge collaboration, inspiring solutions that merge satellite and terrestrial systems.",
      },
      links: [{ label: "Winet Lab", url: "http://winet.yonsei.ac.kr/home/" }],
    },
    {
      id: "wondoo-yoo",
      gender: "male",
      image: "/images/judges/judges_03.png",
      alt: { ko: "유원두 리더 초상", en: "Portrait of Kevin Wondoo Yoo" },
      name: { ko: "유원두 리더님", en: "Kevin Wondoo Yoo" },
      affiliation: {
        ko: "Amazon Web Services, Aerospace & Satellite Solutions (APJ)",
        en: "AWS Aerospace & Satellite Solutions (APJ)",
      },
      bioShort: {
        ko: "AWS 우주위성사업부 Korea Business Lead, 위성 데이터·AI/ML 활용 클라우드 전략 지원.",
        en: "AWS APJ business lead supporting cloud, AI/ML, and satellite data solutions.",
      },
      bioLong: {
        ko: "유원두 리더는 AWS 우주위성사업부 APJ Team 소속으로 Korea Business Lead 역할을 맡고 있다. 한화시스템에서 14년 경력을 쌓은 뒤, 위성 데이터 수집·저장·처리와 생성형 AI 서비스 적용을 포함한 클라우드 기반 솔루션 확산을 지원한다. 크레딧 패키지, 교육·트레이닝, 기술 지원으로 APJ 우주 산업 성장을 이끈다.",
        en: "Kevin Wondoo Yoo is Korea Business Lead (Account Executive) for AWS Aerospace & Satellite Solutions (APJ). With 14 years at Hanwha Systems, he now drives cloud adoption for space companies—data collection, storage, processing, and generative AI—backed by credits, training, and technical support across APJ.",
      },
      links: [],
    },
    {
      id: "myung-hwan-yun",
      gender: "male",
      image: "/images/judges/judges_04.png",
      alt: { ko: "윤명환 교수 초상", en: "Portrait of Prof. Myung Hwan Yun" },
      name: { ko: "윤명환 교수님", en: "Prof. Myung Hwan Yun" },
      affiliation: {
        ko: "서울대학교 산업공학과 / HIS Lab",
        en: "SNU Industrial Engineering / HIS Lab",
      },
      bioShort: {
        ko: "인간공학·HCI·사용자 중심 설계·인간-AI 협업 전문가.",
        en: "Expert in ergonomics, HCI, user-centered design, and human-AI teaming.",
      },
      bioLong: {
        ko: "윤명환 교수는 서울대학교 산업공학과 교수로, 인간공학, HCI, 사용자 중심 제품 설계, 감성공학, 생체역학, 인간-AI 협업을 연구한다. 대한인간공학회 회장, IEA 조직위원장 등 학술 리더십을 수행해왔으며, 우주 환경에서 인간과 첨단 기술의 상호작용을 탐구하는 창의적 솔루션을 독려한다.",
        en: "Prof. Myung Hwan Yun (SNU) researches ergonomics, HCI, user-centered design, Kansei engineering, biomechanics, and human-AI teaming. A former ESK president and IEA congress organizer, he promotes human-centered innovation for space environments.",
      },
      links: [{ label: "HIS Lab", url: "https://his.snu.ac.kr/" }],
    },
  ];

  const closeModal = () => {
    setSelectedJudge(null);
    requestAnimationFrame(() => selectedCardRef.current?.focus());
  };

  useEffect(() => {
    if (!selectedJudge) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedJudge]);

  const topMenus = (
    isKorean
      ? [
          { text: "홈으로", url: "/2025/ko/index" },
          { text: "심사 위원", url: "/2025/ko/judges" },
          { text: "후원사", url: "/2025/ko/sponsors" },
          { text: "수상팀", url: "/2025/ko/awardees" },
          { text: "서울 운영진", url: "/2025/ko/crew" },
          { text: "스페이스 챗봇", url: "/2025/ko/chatbot" },
          { text: "Contact Us", url: "/2025/ko/contact" },
        ]
      : [
          { text: "Home", url: "/2025/en/index" },
          { text: "Judges", url: "/2025/en/judges" },
          { text: "Sponsors", url: "/2025/en/sponsors" },
          { text: "Awarded Team", url: "/2025/en/awardees" },
          { text: "Meet the Seoul Team", url: "/2025/en/crew" },
          { text: "Space ChatBot", url: "/2025/en/chatbot" },
          { text: "Contact Us", url: "/2025/en/contact" },
        ]
  ) as { text: string; url: string }[];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        fontFamily: "var(--font-rethink-regular), sans-serif",
        maxWidth: "1280px",
        margin: "0 auto",
        overflowX: "hidden",
      }}
    >
      {/* Responsive CSS: sidebar collapse, hamburger menu, fluid typography, grid adaptation */}
      <style jsx global>{`
        /* Prevent horizontal scroll globally */
        html,
        body {
          overflow-x: hidden;
          max-width: 100vw;
        }

        /* Desktop defaults */
        .top-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          font-family: var(--font-rethink-medium), sans-serif;
          max-width: 100vw;
          box-sizing: border-box;
        }
        .top-menus {
          display: flex;
          gap: 3rem;
        }
        .top-menus a {
          color: #000000;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          transition: color 0.3s;
        }
        .top-menus a:hover {
          color: #0033ff;
        }

        .lang-switch span,
        .lang-switch .sep {
          font-size: clamp(14px, 3.3vw, 18px);
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
          z-index: 101;
        }

        .mobile-menu {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 1rem;
          z-index: 99;
          max-width: 100vw;
          box-sizing: border-box;
        }
        .mobile-menu .menu-row {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 0.25rem;
        }
        .mobile-menu a {
          color: #000000;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
        }

        .sidebar {
          position: fixed;
          width: 250px;
          left: 0;
          top: 60px;
          background: #ffffff;
          padding: 2rem 0 2rem 2rem;
          z-index: 10;
          height: calc(100vh - 60px);
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
        }
        .main-content {
          margin-left: 250px;
          margin-top: 60px;
          padding: 2rem;
          z-index: 5;
          min-height: calc(100vh - 60px);
          overflow-y: visible;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* Fluid typography with clamp() */
        h1.page-title {
          font-size: clamp(28px, 5.2vw, 59px);
          line-height: 1.2;
          text-align: center;
          color: #003cff;
          margin-bottom: 1.5rem;
          word-break: keep-all;
        }

        /* Judge card styles */
        .judges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 100%;
          width: 100%;
        }
        .judge-card {
          border: 0;
          padding: 1rem;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          cursor: pointer;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }
        .judge-card:hover {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        .judge-card:focus-visible {
          outline: 3px solid #0033ff;
          outline-offset: 3px;
        }
        .judge-name {
          font-size: clamp(20px, 3.5vw, 24px);
          font-family: var(--font-rethink-extrabold), sans-serif;
          color: #000000;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .judge-affiliation {
          font-size: clamp(14px, 2.5vw, 16px);
          font-family: var(--font-rethink-medium), sans-serif;
          color: #575757;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          overflow-y: auto;
          max-width: 100vw;
          box-sizing: border-box;
        }
        .modal-content {
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 1.5rem;
          position: relative;
          box-sizing: border-box;
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        .modal-name {
          font-size: clamp(22px, 4vw, 28px);
          font-family: var(--font-rethink-extrabold), sans-serif;
          color: #000000;
          margin: 0;
          margin-bottom: 0.25rem;
          word-break: keep-all;
        }
        .modal-affiliation {
          font-size: clamp(13px, 2.2vw, 16px);
          font-family: var(--font-rethink-medium), sans-serif;
          color: #575757;
          margin: 0;
          margin-bottom: 1rem;
          white-space: normal;
          overflow: visible;
          word-break: keep-all;
          line-height: 1.4;
        }
        .modal-bio {
          font-size: clamp(15px, 2.3vw, 18px);
          font-family: var(--font-rethink-medium), sans-serif;
          line-height: 1.6;
          color: #000000;
          margin-bottom: 1rem;
          word-break: keep-all;
        }
        .modal-link {
          display: inline-block;
          color: #0033ff;
          font-family: var(--font-rethink-medium), sans-serif;
          font-size: clamp(14px, 2.2vw, 16px);
          text-decoration: underline;
          margin-right: 1rem;
          margin-bottom: 0.5rem;
        }

        /* Tablet & phones: hide sidebar, show hamburger, adapt grid and modal */
        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
          .main-content {
            margin-left: 0;
            padding: 1rem;
            width: 100%;
            max-width: 100vw;
          }
          .top-bar {
            padding: 0 1rem;
          }
          .top-menus {
            display: none;
          }
          .mobile-toggle {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 101;
          }
          .lang-switch-mobile {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 101;
          }

          /* Grid: single column on mobile with reduced minmax */
          .judges-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            width: 100%;
          }
          .judge-card {
            padding: 0.75rem;
          }

          /* Modal: stack image and bio vertically on mobile */
          .modal-overlay {
            padding: 0.75rem;
            align-items: flex-start;
            padding-top: 2rem;
          }
          .modal-content {
            padding: 1rem;
            max-height: 90vh;
            width: 100%;
            max-width: calc(100vw - 1.5rem);
          }
          .modal-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .modal-affiliation {
            white-space: normal;
          }
        }

        /* Extra small phones */
        @media (max-width: 480px) {
          .top-bar {
            padding: 0 0.5rem;
          }
          .mobile-toggle {
            left: 0.5rem;
          }
          .lang-switch-mobile {
            right: 0.5rem;
          }
          .main-content {
            padding: 0.75rem;
          }
          .modal-overlay {
            padding: 0.5rem;
          }
          .modal-content {
            padding: 0.75rem;
            max-width: calc(100vw - 1rem);
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="top-bar">
        {/* Desktop menus */}
        <div className="top-menus">
          {topMenus.map((menu, idx) => (
            <Link
              key={idx}
              href={menu.url}
              style={{
                color: pathname === menu.url ? "#0033FF" : "#000000",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLElement).style.color = "#0033FF")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLElement).style.color =
                  pathname === menu.url ? "#0033FF" : "#000000")
              }
            >
              {menu.text}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-toggle"
          aria-label={isKorean ? "메뉴 열기" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
          title={isKorean ? "메뉴" : "Menu"}
        >
          ☰
        </button>

        {/* Language selector */}
        <div
          className="lang-switch lang-switch-mobile"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push("/2025/ko/judges");
            }}
            style={{
              color: isKorean ? "#0033FF" : "#000000",
              cursor: "pointer",
              fontWeight: isKorean ? "bold" : "normal",
            }}
          >
            KOREAN
          </span>
          <span style={{ color: "#000000" }}>|</span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push("/2025/en/judges");
            }}
            style={{
              color: isKorean ? "#000000" : "#0033FF",
              cursor: "pointer",
              fontWeight: isKorean ? "normal" : "bold",
            }}
          >
            ENGLISH
          </span>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
          <div className="menu-row" onClick={(e) => e.stopPropagation()}>
            {topMenus.map((menu, idx) => (
              <Link
                key={idx}
                href={menu.url}
                onClick={() => setMobileMenuOpen(false)}
              >
                {menu.text}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className="sidebar">
        {/* Logo */}
        <div
          style={{
            width: "calc(100% - 2rem)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "-1rem",
            marginRight: "-1rem",
            marginBottom: "2rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <Image
            src="/images/logo/logo.svg"
            alt={isKorean ? "NASA 스페이스 앱스 로고" : "NASA Space Apps Logo"}
            width={96}
            height={84}
            style={{ width: "100%", height: "auto", transform: "scale(1.5)" }}
          />
        </div>

        <nav className="w-full" style={{ marginLeft: "0.5rem" }}>
          <ul className="list-none p-0 m-0 space-y-4">
            {judges.map((judge, idx) => (
              <li
                key={judge.id}
                className="cursor-pointer text-black hover:text-blue-600 transition-colors text-sm font-medium"
                style={{
                  fontSize: 15,
                  fontFamily: "var(--font-rethink-medium), sans-serif",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0,
                }}
                onClick={() => {
                  const targetElement = document.getElementById(judge.id);
                  if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const offsetTop = window.pageYOffset + rect.top - 70;
                    window.scrollTo({ top: offsetTop, behavior: "smooth" });
                  }
                }}
              >
                <span>{judge.name[isKorean ? "ko" : "en"]}</span>
                <span
                  style={{
                    color: "#575757",
                    fontSize: 10,
                    fontFamily: "var(--font-rethink-medium), sans-serif",
                    verticalAlign: "top",
                    marginLeft: 0,
                    lineHeight: "1",
                    position: "relative",
                    top: "-0.3em",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Title */}
        <h1 className="page-title">{isKorean ? "심사 위원" : "Judges"}</h1>

        {/* Grey Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "1.5rem 0",
          }}
        />

        {/* Judges Grid */}
        <div className="judges-grid">
          {judges.map((judge, idx) => (
            <button
              type="button"
              key={judge.id}
              id={judge.id}
              className="judge-card"
              onClick={(event) => {
                selectedCardRef.current = event.currentTarget;
                setSelectedJudge(judge);
              }}
              aria-haspopup="dialog"
            >
              {/* Judge Image */}
              <div style={{ marginBottom: "0.75rem", width: "100%" }}>
                <Image
                  src={judge.image}
                  alt={judge.alt[isKorean ? "ko" : "en"]}
                  width={640}
                  height={800}
                  style={{
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    borderRadius: "8px",
                    width: "100%",
                    height: "auto",
                  }}
                  priority={idx < 2}
                />
              </div>

              {/* Judge Name */}
              <h3 className="judge-name">
                {judge.name[isKorean ? "ko" : "en"]}
              </h3>

              {/* Judge Affiliation */}
              <p
                className="judge-affiliation"
                title={judge.affiliation[isKorean ? "ko" : "en"]}
              >
                {judge.affiliation[isKorean ? "ko" : "en"]}
              </p>
            </button>
          ))}
        </div>

        {/* Modal */}
        {selectedJudge && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="judge-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Two-column layout: image left, bio right (stacks on mobile) */}
              <div className="modal-grid">
                {/* Left: Portrait */}
                <div style={{ width: "100%" }}>
                  <Image
                    src={selectedJudge.image}
                    alt={selectedJudge.alt[isKorean ? "ko" : "en"]}
                    width={720}
                    height={900}
                    style={{
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      borderRadius: "10px",
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>

                {/* Right: Name, affiliation, and bio */}
                <div style={{ minWidth: 0 }}>
                  <h2 id="judge-modal-title" className="modal-name">
                    {selectedJudge.name[isKorean ? "ko" : "en"]}
                  </h2>
                  <p
                    className="modal-affiliation"
                    title={selectedJudge.affiliation[isKorean ? "ko" : "en"]}
                  >
                    {selectedJudge.affiliation[isKorean ? "ko" : "en"]}
                  </p>

                  <p className="modal-bio">
                    {isKorean
                      ? selectedJudge.bioLong.ko
                      : selectedJudge.bioLong.en}
                  </p>

                  {/* Links */}
                  {selectedJudge.links?.length > 0 && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {selectedJudge.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-link"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "#000000",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={closeModal}
                autoFocus
                aria-label={isKorean ? "닫기" : "Close"}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
