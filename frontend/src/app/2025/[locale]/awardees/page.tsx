"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function AwardeesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === "ko";

  // Mobile top bar menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const awardees = [
    {
      id: "ds",
      teamName: "!DS",
      projectTitle: "Space Biology Knowledge Explorer",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/ds/",
      award: "1ST PLACE",
      isGlobal: true,
      participantsKR: ["김도현", "조의현", "강정규"],
      participantsEN: ["DOHYUN KIM", "UIHYUN CHO", "JEONGGYU KANG"],
      image: "/images/awardees/ds.png"
    },
    {
      id: "find-your-friend",
      teamName: "find your friend",
      projectTitle: "Planet Scope",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/find-your-friend/",
      award: "2ND PLACE",
      isGlobal: true,
      participantsKR: ["유승환", "한사랑", "김성준", "이건우", "강형욱"],
      participantsEN: ["YOO SEUNG HWAN", "HAN SARANG", "SEONGJOON KIM", "GEONWU LEE", "KANG HYEONG UK"],
      image: "/images/awardees/find-your-friend.png"
    },
    {
      id: "nups",
      teamName: "NUPS",
      projectTitle: "EXOHUNT",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/nups/",
      award: "3RD PLACE",
      isGlobal: true,
      participantsKR: ["서인성", "유동호", "이채준", "권순범", "김태현", "이서현"],
      participantsEN: ["INSEONG SEO", "DONGHO YOU", "LEE CHAEJUN", "KWON SOONBEOM", "KIM TAEHYEON", "SEOHYUN LEE"],
      image: "/images/awardees/nups.png"
    },
    {
      id: "spacewalk",
      teamName: "SPACEWALK",
      projectTitle: "The Three Solar Rascals - A Sun and Space Weather Story Told by HERMES",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/jakdang-moui/",
      award: "HONORABLE MENTION",
      isGlobal: true,
      participantsKR: ["문형근", "이민재", "조시현", "이찬호", "김지하", "김지윤"],
      participantsEN: ["HYEONGGEUN MOON", "MINJAE LEE", "SEAN CHO", "LEE CHANHO", "JIHA KIM", "JIYOUN KIM"],
      image: "/images/awardees/spacewalk.png"
    },
    {
      id: "nasar",
      teamName: "NASAR",
      projectTitle: "Nationwide Alert and Subsidence Assessment of Reclaimed areas",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/nasar/",
      award: "HONORABLE MENTION",
      isGlobal: false,
      participantsKR: ["변경호", "김승호", "강민석", "장원준"],
      participantsEN: ["KYUNGHO BYOUN", "SEUNGHO KIM", "MINSUK KANG", "WONJUN CHANG"],
      image: "/images/awardees/nasar.png"
    },
    {
      id: "exolix",
      teamName: "ExoLiX",
      projectTitle: "Project ExoLiX",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/exolix/",
      award: "RISING STAR RECOGNITION",
      isGlobal: false,
      participantsKR: ["와지 임리키", "Chala Adane Deresa", "PHISANNUPAWONG THAWEERATH", "Joshua Julian Damanik"],
      participantsEN: ["WAJIH IMLIKI", "CHALA ADANE DERESA", "PHISANNUPAWONG THAWEERATH", "JOSHUA JULIAN DAMANIK"],
      image: "/images/awardees/exolix.png"
    },
    {
      id: "geesecrossing",
      teamName: "GeeseCrossing",
      projectTitle: "SARchive : Interactive Mountain Archive Using SAR Data",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/geesecrossing/",
      award: "TECH INNOVATOR RECOGNITION",
      isGlobal: false,
      participantsKR: ["김민재", "김서호", "조영서", "윤여문", "윤겸", "강현구"],
      participantsEN: ["MINJAE KIM", "KIM SEOHO", "YOUNGSEO CHO", "YOON YEOMOON", "YUN GYEOM", "HYEONGU KANG"],
      image: "/images/awardees/geesecrossing.png"
    },
    {
      id: "leafline",
      teamName: "Leafline",
      projectTitle: "BloomBee",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/leafline/",
      award: "IMPACT MAKER RECOGNITION",
      isGlobal: false,
      participantsKR: ["장은영", "오유성", "조은서", "홍기현", "방태림", "윤세휘"],
      participantsEN: ["JANG EUNYEONG", "YUSUNG OH", "EUNSECHO", "HONG GI HYEON", "BANG TAERIM", "SEHWI YOON"],
      image: "/images/logo/logo.svg"
    },
    {
      id: "leorbiters",
      teamName: "LEOrbiters",
      projectTitle: "FIR-Based LEO Satellite Collision Early-Warning and Visualization System",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/leorbiters/",
      award: "DATA EXCELLENCE RECOGNITION",
      isGlobal: false,
      participantsKR: ["유재은", "유효진", "강지훈", "구경환", "강민규", "리안 라잘"],
      participantsEN: ["RYUJAEUN", "HYOJIN YU", "KANG JI HOON", "GYEONGHWAN GU", "KANG MIN GYU", "RHIAN KIRSTEN RAZAL"],
      image: "/images/awardees/leorbiters.png"
    },
    {
      id: "retro",
      teamName: "retro",
      projectTitle: "H.E.R.A. (Habitat Efficiency Rating Algorithm)",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/retro4/",
      award: "BEST STORYTELLING RECOGNITION",
      isGlobal: false,
      participantsKR: ["곽윤지", "조은지", "김미소"],
      participantsEN: ["KWAK YUNJI", "CHO EUNJI", "KIM MISO"],
      image: "/images/logo/logo.svg"
    },
    {
      id: "ummigo-de-nasa",
      teamName: "Ummigo de NASA",
      projectTitle: "Project Cycle Colony",
      teamLink: "https://www.spaceappschallenge.org/2025/find-a-team/ummigo-de-nasa/",
      award: "YOUNG SCHOLAR DISTINCTION",
      isGlobal: false,
      participantsKR: ["김강민", "유채연", "강성호", "엄시울"],
      participantsEN: ["KANGMIN KIM", "CHANNEY YU", "SUNGHO KANG", "엄시울"],
      image: "/images/logo/logo.svg"
    }
  ];

  const getAwardColor = (award: string) => {
    switch (award) {
      case "1ST PLACE": return "#FFD700";
      case "2ND PLACE": return "#C0C0C0";
      case "3RD PLACE": return "#CD7F32";
      default: return "#0033FF";
    }
  };

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
      {/* Responsive CSS */}
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

        /* Fluid typography */
        h1.page-title {
          font-size: clamp(28px, 5.2vw, 59px);
          line-height: 1.2;
          text-align: center;
          color: #003cff;
          margin-bottom: 1.5rem;
          word-break: keep-all;
        }

        /* Awardee card styles */
        .awardees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 100%;
          width: 100%;
        }
        .awardee-card {
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          max-width: 100%;
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }
        .awardee-card:hover {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        .global-badge {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 90px;
          height: 90px;
          z-index: 5;
        }
        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-spacer {
          flex: 1;
        }
        .team-name {
          font-size: clamp(20px, 3.5vw, 24px);
          font-family: var(--font-rethink-extrabold), sans-serif;
          color: #000000;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .project-title {
          font-size: clamp(16px, 2.8vw, 18px);
          font-family: var(--font-rethink-medium), sans-serif;
          color: #000000;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .award-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: clamp(14px, 2.5vw, 16px);
          font-family: var(--font-rethink-bold), sans-serif;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .participants {
          font-size: clamp(12px, 2.2vw, 14px);
          font-family: var(--font-rethink-regular), sans-serif;
          color: #575757;
          margin-bottom: 1.5rem;
          line-height: 1.4;
          word-break: keep-all;
        }
        .view-team-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #0033ff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-size: clamp(14px, 2.5vw, 16px);
          font-family: var(--font-rethink-medium), sans-serif;
          transition: background 0.3s ease;
        }
        .view-team-btn:hover {
          background: #0022cc;
        }

        /* Tablet & phones: hide sidebar, show hamburger, adapt grid */
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

          /* Grid: adjust for mobile */
          .awardees-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }
          .awardee-card {
            padding: 1rem;
            min-height: 450px;
          }
          .global-badge {
            width: 90px;
            height: 90px;
            top: -8px;
            left: -8px;
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
          .awardees-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
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
              router.push("/2025/ko/awardees");
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
              router.push("/2025/en/awardees");
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
            {awardees.map((awardee, idx) => (
              <li
                key={awardee.id}
                className="cursor-pointer text-black hover:text-blue-600 transition-colors text-sm font-medium"
                style={{
                  fontSize: 15,
                  fontFamily: "var(--font-rethink-medium), sans-serif",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0,
                }}
                onClick={() => {
                  const targetElement = document.getElementById(awardee.id);
                  if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const offsetTop = window.pageYOffset + rect.top - 70;
                    window.scrollTo({ top: offsetTop, behavior: "smooth" });
                  }
                }}
              >
                <span>{awardee.teamName}</span>
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
        <h1 className="page-title">{isKorean ? "수상팀" : "Awarded Team"}</h1>

        {/* Grey Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "1.5rem 0",
          }}
        />

        {/* Awardees Grid */}
        <div className="awardees-grid">
          {awardees.map((awardee, idx) => (
            <div
              key={awardee.id}
              id={awardee.id}
              className="awardee-card"
            >
              {/* Global Badge */}
              {awardee.isGlobal && (
                <Image
                  src="/images/awardees/badge.png"
                  alt="Global Winner"
                  width={637}
                  height={640}
                  className="global-badge"
                />
              )}

              <div className="card-content">
                {/* Team Image */}
                <div style={{ marginBottom: "1rem", width: "100%" }}>
                  <Image
                    src={awardee.image}
                    alt={`${awardee.teamName} team`}
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

                {/* Team Name */}
                <h3 className="team-name">{awardee.teamName}</h3>

                {/* Project Title */}
                <p className="project-title">{awardee.projectTitle}</p>

                {/* Award Badge */}
                <div
                  className="award-badge"
                  style={{ backgroundColor: getAwardColor(awardee.award) }}
                >
                  {awardee.award}
                </div>

                {/* Participants */}
                <p className="participants">
                  {isKorean
                    ? awardee.participantsKR.join(", ")
                    : awardee.participantsEN.join(", ")}
                </p>

                {/* Spacer to push button to bottom */}
                <div className="card-spacer"></div>

                {/* View Team Button */}
                <a
                  href={awardee.teamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-team-btn"
                >
                  {isKorean ? "팀 보기" : "View Team"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
