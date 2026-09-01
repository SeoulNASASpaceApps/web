"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === "ko";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = (() => {
    const navigation = isKorean
      ? [
          { text: "상세 정보", superscript: "01" },
          { text: "행사 일정", superscript: "02" },
          { text: "참여 이유", superscript: "03" },
          { text: "참여 방법", superscript: "04" },
          { text: "심사 및 시상", superscript: "05" },
        ]
      : [
          { text: "Details", superscript: "01" },
          { text: "Local Event Schedule", superscript: "02" },
          { text: "Why Join?", superscript: "03" },
          { text: "How to Join?", superscript: "04" },
          { text: "Judging & Awards", superscript: "05" },
        ];

    const topMenus = isKorean
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
        ];

    return {
      navigation,
      topMenus,
      title: "NASA SPACE APPS SEOUL 2025",
      subtitle: isKorean
        ? "세계 최대 글로벌 해커톤, 한국 서울에서 다시 개최됩니다!"
        : "The world's largest global hackathon, returning to Seoul, Korea!",
    };
  })();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        fontFamily: "var(--font-rethink-regular), sans-serif",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Responsive CSS: sidebar collapse, hamburger menu, fluid typography */}
      <style jsx global>{`
        /* Desktop defaults (preserve current web appearance) */
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
        }

        /* Fluid typography with clamp() */
        h1.hero-title {
          font-size: clamp(24px, 5vw, 70px);
          line-height: 1.2;
          text-align: center;
          color: #003cff;
          margin-bottom: 1.5rem;
          word-break: keep-all;
        }
        p.hero-subtitle {
          font-size: clamp(18px, 3.5vw, 36px);
          line-height: 1.4;
          text-align: center;
          color: #000000;
          margin-bottom: 2rem;
          word-break: keep-all;
        }
        h3.section-heading {
          font-size: clamp(28px, 4.5vw, 60px);
          line-height: 1.25;
          color: #000000;
          margin-bottom: 2rem;
        }
        h4.subsection-heading {
          font-size: clamp(22px, 3.5vw, 32px);
          line-height: 1.3;
          color: #000000;
          margin-bottom: 1.5rem;
        }
        h5.minor-heading {
          font-size: clamp(18px, 3vw, 25px);
          line-height: 1.4;
          color: #000000;
          margin-bottom: 1rem;
        }
        p.body-text,
        ul.body-list li,
        ol.body-list li {
          font-size: clamp(16px, 2.5vw, 25px);
          line-height: 1.6;
          color: #000000;
        }
        ul.schedule-list li {
          font-size: clamp(16px, 2.3vw, 24px);
        }
        ul.schedule-list li span.schedule-title {
          font-size: clamp(15px, 2.2vw, 21px);
        }
        ul.schedule-list li p.schedule-desc {
          font-size: clamp(13px, 2vw, 17px);
        }
        img.section-image {
          width: clamp(60%, 15vw, 80%);
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Tablet & phones: hide sidebar, show hamburger, full-width content */
        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
          .top-menus {
            display: none;
          }
          .mobile-toggle {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            position: absolute;
            left: 2rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 101;
          }
          .lang-switch-mobile {
            position: absolute;
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 101;
          }
          img.section-image {
            width: 100%;
          }
          /* Adjust Contents section layout on mobile */
          .contents-section h2 {
            position: static !important;
            left: auto !important;
            margin-bottom: 1.5rem;
          }
          .contents-section .contents-item {
            margin-left: 0 !important;
          }

          /* Reduce font sizes for sections 04 and 05 on mobile */
          #how-to-join ol li {
            font-size: 20px !important;
          }
          #how-to-join p {
            font-size: 20px !important;
          }
          #judging-prizes ul li {
            font-size: 20px !important;
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="top-bar">
        {/* Desktop menus */}
        <div className="top-menus">
          {content.topMenus.map((menu, idx) => (
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

        {/* Mobile layout - hamburger left, language selector right */}
        <button
          className="mobile-toggle"
          aria-label={isKorean ? "메뉴 열기" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
          title={isKorean ? "메뉴" : "Menu"}
        >
          ☰
        </button>

        <div
          className="lang-switch lang-switch-mobile"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push("/2025/ko/index");
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
              router.push("/2025/en/index");
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
            {content.topMenus.map((menu, idx) => (
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
            {content.navigation.map((item, idx) => {
              const sectionIds = [
                "details",
                "schedule",
                "why-participate",
                "how-to-join",
                "judging-prizes",
              ];
              return (
                <li
                  key={idx}
                  className="cursor-pointer text-black hover:text-blue-600 transition-colors text-sm font-medium"
                  style={{
                    fontSize: 15,
                    fontFamily: "var(--font-rethink-medium), sans-serif",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 0,
                  }}
                  onClick={() => {
                    const targetElement = document.getElementById(
                      sectionIds[idx]
                    );
                    if (targetElement) {
                      const rect = targetElement.getBoundingClientRect();
                      const offsetTop = window.pageYOffset + rect.top - 70;
                      window.scrollTo({ top: offsetTop, behavior: "smooth" });
                    }
                  }}
                >
                  <span>{item.text}</span>
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
                    {item.superscript}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Image */}
        <Image
          src="/images/index/main.png"
          alt={
            isKorean
              ? "달 표면에서 타블렛을 보며 휴식하는 우주비행사"
              : "Astronaut relaxing on moon surface with tablet"
          }
          width={998}
          height={540}
          priority
          style={{
            width: "100%",
            aspectRatio: "16/9",
            marginBottom: "4rem",
            height: "auto",
          }}
        />

        {/* Title */}
        <h1
          className="hero-title"
          style={{
            fontFamily: "var(--font-rethink-extrabold), sans-serif",
            color: "#003CFF",
          }}
        >
          {content.title}
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subtitle"
          style={{
            fontFamily: "var(--font-rethink-medium), sans-serif",
            color: "#000000",
          }}
        >
          {isKorean ? (
            <>
              세계 최대 글로벌 해커톤,
              <br />
              한국 서울에서 다시 개최됩니다!
            </>
          ) : (
            <>
              The world's largest global hackathon,
              <br />
              returning to Seoul, Korea!
            </>
          )}
        </p>

        {/* Grey Divider after Hero Subtitle */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "2rem 0",
          }}
        />

        {/* Contents Section */}
        <section
          className="contents-section"
          style={{
            marginTop: "4rem",
            marginBottom: "4rem",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              margin: 0,
              position: "absolute",
              left: "5%",
              top: 0,
            }}
          >
            {isKorean ? "Contents" : "Contents"}
          </h2>
          <div
            className="contents-item"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.5rem",
              marginBottom: "1rem",
              marginLeft: "50%",
            }}
          >
            <span
              style={{
                fontSize: "30px",
                fontFamily: "var(--font-rethink-medium), sans-serif",
                color: "#575757",
                fontWeight: "bold",
              }}
            >
              01
            </span>
            <span
              style={{
                fontSize: "30px",
                fontFamily: "var(--font-rethink-medium), sans-serif",
                color: "#000000",
              }}
            >
              {isKorean ? "상세 정보" : "Details"}
            </span>
          </div>

          <div>
            {content.navigation.slice(1).map((item, idx) => (
              <div
                key={idx}
                className="contents-item"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                  marginLeft: "50%",
                }}
              >
                <span
                  style={{
                    fontSize: "30px",
                    fontFamily: "var(--font-rethink-medium), sans-serif",
                    color: "#575757",
                    fontWeight: "bold",
                  }}
                >
                  {String(idx + 2).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: "30px",
                    fontFamily: "var(--font-rethink-medium), sans-serif",
                    color: "#000000",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Grey Divider after Contents Section */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "2rem 0",
          }}
        />

        {/* Section: 상세 정보 (Details) */}
        <section id="details" style={{ marginBottom: "4rem" }}>
          <h3
            className="section-heading"
            style={{
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#0033FF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "60px",
                color: "#F45F00",
                fontWeight: "normal",
              }}
            >
              01
            </span>
            <span
              style={{
                color: "#000000",
                flex: 1,
              }}
            >
              {isKorean ? "상세 정보" : "Event Details"}
            </span>
          </h3>

          {/* Section Image */}
          <Image
            className="section-image"
            src="/images/index/index_01_01.png"
            alt="NASA Space Apps Challenge illustration"
            width={394}
            height={296}
            style={{
              width: "40%",
              height: "auto",
              marginBottom: "2rem",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          {/* Section Content */}
          <p
            className="body-text"
            style={{
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "1rem",
              marginLeft: "10%",
              marginRight: "10%",
            }}
          >
            {isKorean ? (
              <>
                NASA Space Apps Challenge는{" "}
                <strong>
                  NASA와 전 세계 파트너 우주 기관들이 주최하는 세계 최대 규모의
                  글로벌 해커톤
                </strong>
                입니다. 작년 2024년, 한국에서 처음 열린 이 해커톤은 한국의 우주
                혁신 생태계에 강력한 이정표를 남겼고, 올해 2025년 서울에서 두
                번째 해를 맞이합니다.
                <br />
                <br />
                이번 행사는 누구나 참여할 수 있는 오픈 이벤트로, 기술, 디자인,
                데이터, 스토리텔링 등 다양한 역량을 가진 사람들이 팀을 이루어{" "}
                <strong>NASA 오픈 데이터</strong>를 활용한 혁신적 솔루션을 2일
                동안 만들어냅니다.
                <br />
                <br />
                누구나 무료로 참여할 수 있으며, 다양한 기술과 창의적 사고를 가진
                사람들이 모여 <strong>우주와 지구의 미래를 설계</strong>합니다.
              </>
            ) : (
              <>
                The NASA Space Apps Challenge,{" "}
                <strong>
                  the world's largest global hackathon hosted by NASA and its
                  international space agency partners
                </strong>
                , is coming back to Seoul, Korea! Following its first launch in
                Korea in 2024, which left a powerful mark on the country's space
                innovation ecosystem, the event returns for its second year in
                2025.
                <br />
                <br />
                This open and inclusive event welcomes participants of all
                backgrounds to form teams and build innovative solutions using{" "}
                <strong>NASA's open data</strong> — all within 2 days. It is
                completely free to join, and participants will collaborate
                across disciplines such as{" "}
                <strong>
                  technology, design, data science, and storytelling to help
                  shape the future of Earth and space
                </strong>
                .
              </>
            )}
          </p>

          {/* Divider after content */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e5e5",
              margin: "1rem 0",
            }}
          />

          {/* 참가 대상 Section */}
          <h4
            className="subsection-heading"
            style={{
              fontFamily: "var(--font-rethink-extrabold), sans-serif",
              color: "#000000",
              marginBottom: "2rem",
              marginTop: "4rem",
            }}
          >
            {isKorean ? "참가 대상" : "WHO CAN PARTICIPATE"}
          </h4>

          <ul
            className="body-list"
            style={{
              listStyleType: "disc",
              paddingLeft: "2rem",
              fontFamily: "var(--font-rethink-bold), sans-serif",
              color: "#000000",
              marginBottom: "2rem",
            }}
          >
            <li style={{ marginBottom: "1rem" }}>
              High school students, University students, Professionals —
              everyone is welcome!
            </li>
          </ul>

          <ul
            className="body-list"
            style={{
              listStyleType: "disc",
              paddingLeft: "3rem",
              fontFamily: "var(--font-rethink-regular), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
            }}
          >
            {isKorean ? (
              <>
                <li style={{ marginBottom: "1rem" }}>
                  코딩, 디자인, 아이디어, 도전정신만 있으면 충분합니다!
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  고급 기술보다 <strong>열정과 협업</strong> 마인드가 더
                  중요합니다.
                </li>
                <li>참가자 등록 시 부모 동의서 또는 보호자 동반 필요</li>
              </>
            ) : (
              <>
                <li style={{ marginBottom: "1rem" }}>
                  All you need is coding, design, ideas, or a spirit of
                  challenge!
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  Passion and a <strong>collaborative mindset</strong> matter
                  more than advanced technical skills.
                </li>
                <li>
                  A signed parental consent form or the presence of a guardian
                  is required at registration.
                </li>
              </>
            )}
          </ul>

          {/* Divider between 참가 대상 and 언제 어디서? */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e5e5",
              margin: "2rem 0",
            }}
          />

          {/* 언제 어디서? Section */}
          <h4
            className="subsection-heading"
            style={{
              fontFamily: "var(--font-rethink-extrabold), sans-serif",
              color: "#000000",
              marginBottom: "2rem",
              marginTop: "4rem",
            }}
          >
            {isKorean ? "언제 어디서?" : "WHEN & WHERE"}
          </h4>

          <h5
            className="minor-heading"
            style={{
              fontFamily: "var(--font-rethink-bold), sans-serif",
              color: "#000000",
              marginBottom: "1rem",
            }}
          >
            Date & Time
          </h5>

          <ul
            className="body-list"
            style={{
              listStyleType: "disc",
              paddingLeft: "3rem",
              fontFamily: "var(--font-rethink-regular), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            <li>
              {isKorean
                ? "2025년 10월 4일(토) 오전 8:00(Opening Ceremony) – 10월 5일(일) 오후 11:59 (KST)"
                : "October 4 (Sat), 8:00 AM(Opening Ceremony ) – October 5 (Sun), 11:59 PM (KST)"}
            </li>
          </ul>

          <h5
            className="minor-heading"
            style={{
              fontFamily: "var(--font-rethink-bold), sans-serif",
              color: "#000000",
              marginBottom: "1rem",
            }}
          >
            {isKorean ? "진행 방식" : "Event Format"}
          </h5>

          <ul
            className="body-list"
            style={{
              listStyleType: "disc",
              paddingLeft: "3rem",
              fontFamily: "var(--font-rethink-regular), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            <li
              dangerouslySetInnerHTML={{
                __html: isKorean
                  ? "2025 NASA Space Apps Challenge 서울 이벤트는 <br /><strong>100% 온라인(virtual)</strong>으로 진행됩니다!"
                  : "The 2025 NASA Space Apps Challenge Seoul event will be held <br /><strong>100% online (virtual)</strong>!",
              }}
            />
          </ul>

          <ol
            className="body-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "3rem",
              fontFamily: "var(--font-rethink-regular), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {isKorean ? (
              <>
                <li
                  style={{ marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `공식 페이지에서 개별 등록을 마치셨다면,
이메일로 전달된 <strong>'2025 접수 등록자 확인'</strong> 폼을 작성해 서울 지역 참여 등록을 완료해 주세요.
현재 저희는 참가를 희망하시는 분들의 대기(waitlist) 신청도 받고 있습니다. 아직 대회까지 시간이 남아 있는 만큼, 몇 차례 안내 후에도 서울 지역 등록 확인이 되지 않으면 다른 분들께 참여 기회를 드릴 수 있음을 미리 알려드립니다.
→ 8월 중 등록하셨으나 아직 <strong>2025 접수 등록자 확인</strong> 을 하지 않으신 분들은 순차적으로 waitlist 전환이 진행되고 있습니다. 내년 대회에는 꼭 함께하실 수 있기를 기대합니다.`,
                  }}
                />
                <li
                  style={{ marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>팀 등록(필수)</strong> – 팀장은 팀을 개설하고, 팀원들은 합류합니다.`,
                  }}
                />
                <li
                  style={{ marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>카카오톡방 안내</strong> – 대회 준비를 위한 전용 소통방이 이어집니다.`,
                  }}
                />
              </>
            ) : (
              <>
                <li
                  style={{ marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `Once you have completed your individual registration on the official page,
Please fill out the <strong>'2025 Participant Confirmation Form'</strong> sent to your email to finalize your registration for the Seoul local event.
We are currently accepting waitlist applications from those who wish to participate. Since there is still some time left before the event, please note that if registration confirmation for the Seoul region is not completed after several reminders, we may offer the opportunity to others. → Those who registered in August but have not yet confirmed their registration via <strong>2025 Participant Confirmation Form</strong> are gradually being moved to the waitlist. We sincerely hope to see you at next year's event.`,
                  }}
                />
                <li
                  style={{ marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Team Registration (required)</strong> – Team leads create teams, and members join.`,
                  }}
                />
                <li
                  style={{ marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>KakaoTalk Group Invitation</strong> – A dedicated chat room will follow to help prepare for the event.`,
                  }}
                />
              </>
            )}
          </ol>

          <ul
            className="body-list"
            style={{
              listStyleType: "disc",
              paddingLeft: "3rem",
              fontFamily: "var(--font-rethink-regular), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
            }}
          >
            {isKorean ? (
              <>
                <li style={{ marginBottom: "0.5rem" }}>
                  공식 사이트 등록 필수 :&nbsp;
                  <a
                    href="https://www.spaceappschallenge.org/2025/local-events/seoul/"
                    style={{
                      color: "#0033FF",
                      textDecoration: "underline",
                      fontFamily: "var(--font-rethink-regular), sans-serif",
                      // fontSize: "25px",
                    }}
                  >
                    공식 사이트
                  </a>
                </li>
                <li
                  style={{ marginBottom: "0.5rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `개별 등록은 <strong>7월 17일</strong>부터 오픈됩니다.`,
                  }}
                />
                <li
                  dangerouslySetInnerHTML={{
                    __html: `팀 등록과 합류 은 <strong>8월 21일</strong>부터 오픈됩니다.`,
                  }}
                />
              </>
            ) : (
              <>
                <li style={{ marginBottom: "0.5rem" }}>
                  All participants must register via the official website
                  :&nbsp;
                  <a
                    href="https://www.spaceappschallenge.org/2025/local-events/seoul/"
                    style={{
                      color: "#0033FF",
                      textDecoration: "underline",
                      fontFamily: "var(--font-rethink-regular), sans-serif",
                      // fontSize: "25px",
                    }}
                  >
                    Official Website
                  </a>
                </li>
                <li
                  style={{ marginBottom: "0.5rem" }}
                  dangerouslySetInnerHTML={{
                    __html: `Individual registration opens on <strong>July 17</strong>.`,
                  }}
                />
                <li
                  dangerouslySetInnerHTML={{
                    __html: `Team registration and joining open on <strong>August 21</strong>.`,
                  }}
                />
              </>
            )}
          </ul>
        </section>

        {/* Divider between Details and Schedule */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "2rem 0",
          }}
        />

        {/* Section: 행사 일정 (Schedule) */}
        <section id="schedule" style={{ marginBottom: "4rem" }}>
          <h3
            className="section-heading"
            style={{
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#0033FF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "60px",
                color: "#F45F00",
                fontWeight: "normal",
              }}
            >
              02
            </span>
            <span
              style={{
                color: "#000000",
                flex: 1,
              }}
            >
              {isKorean ? "행사 일정" : "Local Event Schedule"}
            </span>
          </h3>

          <p
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontFamily: "var(--font-rethink-extrabold), sans-serif",
              color: "#000000",
              marginBottom: "2rem",
              textAlign: "left",
            }}
          >
            {isKorean ? "일정 (온라인)" : "Schedule (Virtual)"}
          </p>

          <ul
            className="schedule-list"
            style={{
              listStyleType: "none",
              paddingLeft: "0",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#F45F00",
              lineHeight: 1.6,
            }}
          >
            {/* I'll include a condensed version here for brevity. Copy the full schedule list from the original file. */}
            {isKorean ? (
              <>
                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, August 17</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        className="schedule-title"
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:00 Info Session I : Introduction to the NASA
                        Hackathon + Review of Last Year's Projects
                      </span>
                      <p
                        className="schedule-desc"
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        NASA 해커톤의 목적, 구조 및 목표에 대한 설명 • 작년 주요
                        프로젝트의 하이라이트 및 핵심 인사이트 공유 | 해당
                        세션은 한국어와 영어로 1시간 동안 진행됩니다 (오후 8–9시
                        KST).
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, August 31</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        23:59 Early Registration Due
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        선착순 혜택 - 지금 등록하시는 분들께 특별 웰컴 키트를
                        드립니다!
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, September 14</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:00 Info Session II : NASA 오픈 데이터: 효과적으로
                        접근하고 활용하는 방법
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        NASA의 오픈 데이터 저장소를 찾고 탐색하는 방법에 대한
                        가이드 • 과거 프로젝트에서 팀들이 NASA 데이터를 활용한
                        사례 연구. 해당 세션은 한국어와 영어로 진행됩니다 (오후
                        8시부터 8시 40분까지, 한국 표준시 KST).
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:01 [ Zoom Session ] : Session II 이후, Session III
                        에서는 간단하게 안내 후 팀원 찾기를 위한 소그룹으로
                        나누어져서 자유롭게 소통할 예정입니다
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        <a
                          href="https://us06web.zoom.us/j/81999985972?pwd=qFVTdDbAVhmMjzGOX893T0t1aklj9b.1"
                          style={{
                            color: "#0033FF",
                            textDecoration: "underline",
                          }}
                        >
                          Zoom Link
                        </a>
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:45 Info Session III : 팀 구성: 팀을 만드는 방법과
                        참여하는 방법
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        권장 팀 규모 및 기술 구성 예시 공유 • 네트워킹, 협업자
                        찾기, 관심사 찾기 위한 팁. 해당 세션은 한국어와 영어로
                        진행됩니다 (오후 8시 45분부터 9시 30분까지, 한국 표준시
                        KST).
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Tuesday, September 30</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        23:59 등록 완료 — 준비되셨나요?
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        준비는 끝났습니다. 이제 도전만 남았습니다!
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Saturday, October 4</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        08:00 NASA Space Apps Seoul 2025 - DAY 1
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Hackathon Day Schedule ( 한국 시간 10월 4-5일 기준)
                        <br />※ 모든 시간대는 팀별 자유 진행을 존중하며, 아래
                        체크인은 네트워킹과 안내 중심으로 운영됩니다.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        08:15 Welcome Kick-off Opening
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        모닝 체크인, 공식 개회식과 함께 모든 참가자와 인사하고,
                        대회의 시작을 알립니다.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        12:00 Lunch Break
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        점심시간 - 금강산도 식후경!
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        15:00 Breaktime!
                      </span>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        21:00 저녁 체크인
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        하루의 열정을 잠시 내려놓고, 지금까지의 프로젝트 진행
                        상황을 돌아봅니다. 팀별로 오늘의 흐름을 정리하고, 내일
                        이어갈 작업을 함께 계획하는 시간입니다. 숨 고르고,
                        방향을 다잡는 저녁. Space Apps의 진짜 여정은 지금부터
                        시작입니다.
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, October 5</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        08:00 NASA Space Apps Seoul 2025 - DAY 2
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        이틀간의 행사 중간 멘토 세션은 추후 공지될 예정입니다.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        09:00 모닝 체크인
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        아침이 밝았습니다! Day 2가 시작됩니다. 이제는 아이디어를
                        구체화하고, 실질적인 구현에 집중할 시간입니다. 팀원들과
                        역할을 다시 맞추고, 오늘 안에 무엇을 완성할지 함께
                        정리해보세요. 어제보다 한 걸음 더 나아갈 오늘,
                        시작해볼까요?
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        12:00 Lunch Break
                      </span>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        15:00 Breaktime!!
                      </span>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:00 저녁 체크인
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        밤 8시, 지금쯤이면 프로젝트 구현부터 제출 요건(Judging
                        Requirements)까지 부담스러우실 수도 있습니다. 그럴수록
                        잠시 숨을 고르고, 진행 상황을 점검해보세요. 완벽하지
                        않아도 괜찮습니다. 중간 점검도 해커톤의 일부입니다.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        23:55 NASA Space Apps Seoul 2025 - 완주, 그 마지막 한
                        걸음까지!
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        모든 프로젝트는 NASA Space Apps 공식 웹사이트를 통해
                        제출해야 합니다.
                        <br />※ 심사를 받기 위해서는 반드시 프로젝트 제출이
                        완료되어야 합니다.
                      </p>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, August 17</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        className="schedule-title"
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:00 Info Session I : Introduction to the NASA
                        Hackathon + Review of Last Year's Projects
                      </span>
                      <p
                        className="schedule-desc"
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Overview of the NASA Hackathon's purpose, structure, and
                        goals • Highlights and key takeaways from selected
                        projects from last year | The session will be offered in
                        both Korean and English for one hour (8–9 PM KST).
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:01 [ Zoom Session ] : No camera or microphone
                        required for session attendees
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        <a
                          href="https://us06web.zoom.us/j/87412927921?pwd=k7TSvqkblMZgHkYy8BkrpEaCM9ywYP.1"
                          style={{
                            color: "#0033FF",
                            textDecoration: "underline",
                          }}
                        >
                          Zoom Link
                        </a>
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        21:00 Info Session I : NASA Hackathon Introduction +
                        Last Year's Project Review
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Explanation of NASA Hackathon's purpose, structure, and
                        goals • Sharing highlights and key insights from last
                        year's major projects | This session will be conducted
                        in both Korean and English for one hour (8–9 PM KST).
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, August 31</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        23:59 Early Registration Due
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        First Come, First Served – Early registrants will
                        receive an exclusive Welcome Kit.
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, September 14</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:00 Info Session II : NASA Open Data: How to Access
                        and Utilize It Effectively
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Guide to finding and navigating NASA's open data
                        repositories • Case studies showing how teams have used
                        NASA data in past projects | The session will be offered
                        in both Korean and English for one hour (8 – 8:40 PM
                        KST).
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:01 [ Zoom Session ] : After Session II, Session III
                        will begin with brief guidance followed by small group
                        breakouts for team finding and open communication
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        <a
                          href="https://us06web.zoom.us/j/81999985972?pwd=qFVTdDbAVhmMjzGOX893T0t1aklj9b.1"
                          style={{
                            color: "#0033FF",
                            textDecoration: "underline",
                          }}
                        >
                          Zoom Link
                        </a>
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:45 Info Session III : Team Formation: How to Build
                        and Join a Team
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Recommended team sizes and skill compositions • Tips for
                        networking, finding collaborators, and aligning
                        interests | The session will be offered in both Korean
                        and English for one hour (8:45 – 9:30 PM KST).
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Tuesday, September 30</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        23:59 Registration Complete
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        You're all set — now it's time to begin!
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Saturday, October 4</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        08:00 NASA Space Apps Seoul 2025 - DAY 1
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Hackathon Day Schedule (KST | October 4–5)
                        <br />※ All project work is self-paced by team, and the
                        following check-ins are designed to support networking
                        and general event guidance.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        08:15 Welcome Kick-off Opening
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Morning Check-in, and the opening ceremony marks the
                        official start of the event and offers a warm welcome to
                        all participants.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        12:00 Lunch Break
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Lunch First — everything's better on a full stomach!
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        15:00 Breaktime!
                      </span>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        21:00 Evening Check-in
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Take a moment to pause and reflect on the progress your
                        team has made so far. It's time to review the day's flow
                        and plan together for what comes next. An evening to
                        breathe, refocus, and realign — because the real journey
                        of Space Apps begins now.
                      </p>
                    </li>
                  </ul>
                </li>

                <li style={{ marginBottom: "2rem" }}>
                  <span>Sunday, October 5</span>
                  <ul
                    style={{
                      marginTop: "1rem",
                      paddingLeft: "2rem",
                      listStyleType: "none",
                    }}
                  >
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        08:00 NASA Space Apps Seoul 2025 - DAY 2
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        Mentor sessions during the two-day event will be
                        announced at a later time.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        09:00 Morning Check-in
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        A new day has dawned — Day 2 begins now! It's time to
                        refine your ideas and focus on turning them into real
                        solutions. Reconnect with your team, align your roles,
                        and set clear goals for what you want to accomplish
                        today. Ready to take one step further than yesterday?
                        Let's begin.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        12:00 Lunch Break
                      </span>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        15:00 Breaktime!!
                      </span>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        20:00 Evening Check-in
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        It's around 8PM — by now, juggling project development
                        and judging requirements might feel overwhelming. Take a
                        moment to breathe and regroup with your team. You don't
                        need to be perfect — checking in is part of the process.
                      </p>
                    </li>
                    <li style={{ marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontFamily: "var(--font-rethink-bold), sans-serif",
                          color: "#000000",
                        }}
                      >
                        23:55 NASA Space Apps Seoul 2025 – You made it to the
                        end!
                      </span>
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "var(--font-rethink-medium), sans-serif",
                          color: "#000000",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        All projects must be submitted through the official NASA
                        Space Apps website.
                        <br />※ Submission is required for your project to be
                        considered for judging.
                      </p>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </section>

        {/* Continue with remaining sections following the same pattern... */}
        {/* For brevity, I'm showing the structure. Please add all remaining sections from the original file following the same responsive approach */}

        {/* Grey Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "2rem 0",
          }}
        />

        {/* Section 03: Why Join */}
        <section id="why-participate" style={{ marginBottom: "4rem" }}>
          <h3
            className="section-heading"
            style={{
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#0033FF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "60px",
                color: "#F45F00",
                fontWeight: "normal",
              }}
            >
              03
            </span>
            <span
              style={{
                color: "#000000",
                flex: 1,
              }}
            >
              {isKorean ? "참여 이유" : "Why Join?"}
            </span>
          </h3>

          <p
            style={{
              fontSize: "32px",
              fontFamily: "var(--font-rethink-bold), sans-serif",
              color: "#000000",
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            {isKorean
              ? "🌍 경계를 넘다: 지구와 우주를 위한 글로벌 미션"
              : "🌍 Beyond Borders: A Global Mission for Earth and Space"}
          </p>

          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "4rem",
              fontSize: "20px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {isKorean ? (
              <>
                <li>
                  NASA가 제공하는 실제 우주·지구 과학 오픈 데이터를 기반으로
                  솔루션을 개발
                </li>
                <li
                  dangerouslySetInnerHTML={{
                    __html: `전 세계 참가자들과 <strong>전문가 및 참가자들과의</strong> 협업과 네트워킹`,
                  }}
                />
                <li>우주 및 지구 문제 해결에 도전 </li>
                <li>NASA 및 글로벌 파트너들의 데이터, 멘토링, 리소스 제공</li>
              </>
            ) : (
              <>
                <li>
                  Develop solutions using real open data from NASA on space and
                  Earth science
                </li>
                <li>
                  Collaborate and network with experts and participants from
                  Korea and around the world
                </li>
                <li>
                  Take on the challenge of solving space and Earth-related
                  problems
                </li>
                <li>
                  Access data, mentoring, and resources provided by NASA and its
                  global partners
                </li>
              </>
            )}
          </ul>

          <p
            style={{
              fontSize: "32px",
              fontFamily: "var(--font-rethink-bold), sans-serif",
              color: "#000000",
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            {isKorean
              ? "🎓 당신의 작업, 세계의 무대 위에"
              : "🎓 Your Work, on a Global Stage"}
          </p>

          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "4rem",
              fontSize: "20px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {isKorean ? (
              <>
                <li>
                  모든 프로젝트 제출자에게 NASA Space Apps 공식 인증서 발급
                </li>
                <li>
                  서울 로컬 수상 (1, 2, 3등) 및 글로벌 심사 대상 팀 선정 기회
                </li>
                <li>
                  Top 10 글로벌 파이널리스트로 선정 시 NASA 본사 초청 (워싱턴
                  D.C.)
                </li>
              </>
            ) : (
              <>
                <li>
                  All participants who submit a project will receive an official
                  NASA Space Apps certificate
                </li>
                <li>
                  Local awards in Seoul (1st, 2nd, and 3rd place) and a chance
                  to be nominated for global judging
                </li>
                <li>
                  Teams selected as Top 10 Global Finalists will be invited to
                  NASA Headquarters in Washington, D.C
                </li>
              </>
            )}
          </ul>

          <p
            style={{
              fontSize: "32px",
              fontFamily: "var(--font-rethink-bold), sans-serif",
              color: "#000000",
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            {isKorean
              ? "🤖 내일의 도구로 오늘을 창조하다"
              : "🤖 Creating with Tomorrow's Tools"}
          </p>

          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "4rem",
              fontSize: "20px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {isKorean ? (
              <>
                <li
                  dangerouslySetInnerHTML={{
                    __html: `AI 기반 도구 및 생성형 AI 활용 적극 장려<br />(e.g.,ChatGPT, GitHub Copilot, Midjourney 등 활용 가능. 단, AI 사용 방식은 제출 시 명시)`,
                  }}
                />
                <li>
                  바이브 코딩의 해, 멋진 팀원과 함께 우주로 항해하며 데이터를
                  넘나드는 경험!
                </li>
              </>
            ) : (
              <>
                <li
                  dangerouslySetInnerHTML={{
                    __html: `Actively encouraged to use AI-based and generative AI tools<br />(e.g., ChatGPT, GitHub Copilot, Midjourney — usage must be clearly documented upon submission)`,
                  }}
                />
                <li>
                  In the year of "vibe coding", set sail into space with amazing
                  teammates and experience the power of data!
                </li>
              </>
            )}
          </ul>

          {/* Images at the bottom of section 3 */}
          <Image
            src="/images/index/index_03_01.png"
            alt={
              isKorean
                ? "NASA Space Apps Seoul 2025 참여 이유 1"
                : "NASA Space Apps Seoul 2025 Why Participate 1"
            }
            width={902}
            height={500}
            style={{
              width: "80%",
              height: "auto",
              marginBottom: "2rem",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          <Image
            src="/images/index/index_03_02.png"
            alt={
              isKorean
                ? "NASA Space Apps Seoul 2025 참여 이유 2"
                : "NASA Space Apps Seoul 2025 Why Participate 2"
            }
            width={902}
            height={500}
            style={{
              width: "80%",
              height: "auto",
              marginBottom: "1rem",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </section>

        {/* Grey Divider after Why Participate Section */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "2rem 0",
          }}
        />

        {/* Section: 참여 방법 (How to Join) */}
        <section id="how-to-join" style={{ marginBottom: "4rem" }}>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-700 mb-8 flex items-center gap-4"
            style={{
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#0033FF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "60px",
                color: "#F45F00",
                fontWeight: "normal",
              }}
            >
              04
            </span>
            <span
              style={{
                color: "#000000",
                flex: 1,
              }}
            >
              {isKorean ? "참여 방법" : "How to Join?"}
            </span>
          </h3>

          <ol
            style={{
              listStyleType: "decimal",
              paddingLeft: "3rem",
              fontSize: "32px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {isKorean ? (
              <>
                <li style={{ marginBottom: "1rem" }}>
                  <a
                    href="https://www.spaceappschallenge.org/2025/local-events/seoul/"
                    style={{
                      color: "#0033FF",
                      textDecoration: "underline",
                    }}
                  >
                    공식 사이트
                  </a>
                  에서 등록 (7월 17일부터)
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  8월 21일 공개되는 챌린지 중 하나를 선택
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  3~6인 팀 구성 (개별 등록 후. 8월21일 이후 팀 등록/ 합류)
                </li>
                <li>
                  10월 4~5일 해커톤에 참여하여 48시간 동안 프로젝트 제작 및 제출
                </li>
              </>
            ) : (
              <>
                <li style={{ marginBottom: "1rem" }}>
                  Register at{" "}
                  <a
                    href="https://www.spaceappschallenge.org/2025/local-events/seoul/"
                    style={{
                      color: "#0033FF",
                      textDecoration: "underline",
                    }}
                  >
                    Official Website
                  </a>{" "}
                  starting July 17
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  Choose one of the official challenges, which will be announced
                  on August 21
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  Teams of 3–6 members (individual registration first; team
                  registration/joining available after August 21)
                </li>
                <li>
                  Join the hackathon on October 4–5 and build and submit your
                  project within 48 hours
                </li>
              </>
            )}
          </ol>

          <p
            style={{
              fontSize: "32px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginLeft: "0%",
              marginRight: "10%",
            }}
          >
            {isKorean ? (
              <>
                공식 등록은 <strong>NASA Space Apps 웹사이트에서 진행</strong>
                되어야 하며, 프로젝트는 오픈소스 형태로{" "}
                <strong>GitHub, Google Drive</strong> 등에 업로드해야 합니다.
              </>
            ) : (
              <>
                All official registrations must be completed through the{" "}
                <strong>NASA Space Apps website</strong>. Projects must be
                submitted in open-source format and uploaded to platforms such
                as <strong>GitHub or Google Drive</strong>.
              </>
            )}
          </p>
        </section>

        {/* Grey Divider after How to Join Section */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "2rem 0",
          }}
        />

        {/* Section: 심사 및 시상 (Judging & Prizes) */}
        <section id="judging-prizes" style={{ marginBottom: "4rem" }}>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-700 mb-8 flex items-center gap-4"
            style={{
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#0033FF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "60px",
                color: "#F45F00",
                fontWeight: "normal",
              }}
            >
              05
            </span>
            <span
              style={{
                color: "#000000",
                flex: 1,
              }}
            >
              {isKorean ? "심사 및 시상" : "Judging & Awards"}
            </span>
          </h3>

          <ul
            style={{
              listStyleType: "disc",
              fontSize: "32px",
              fontFamily: "var(--font-rethink-medium), sans-serif",
              color: "#000000",
              lineHeight: 1.6,
              marginLeft: "0%",
              marginRight: "10%",
              paddingLeft: "1.5rem",
            }}
          >
            <li style={{ marginBottom: "1rem" }}>
              {isKorean
                ? "지역 심사: 서울 이벤트에서 3개의 우승 팀이 선정되며, 글로벌 심사를 위한 추천이 부여됩니다."
                : "Local Judging: Three winning teams will be selected from the Seoul event, along with nominations for global judging."}

              {/* nested criteria list */}
              <ul
                style={{
                  listStyleType: "circle", // 필요하면 "circle"로 바꿔 구분 가능
                  marginTop: "0.75rem",
                  paddingLeft: "1.3rem",
                }}
              >
                {isKorean ? (
                  <>
                    <li style={{ marginBottom: "1rem" }}>
                      임팩트 – 프로젝트가 사회, 과학, 환경 등 실제 세계에 미치는
                      영향
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                      창의성 – 문제 해결 방식의 참신함과 독창성
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                      타당성 – 기술적 완성도 및 구현 가능성
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                      관련성 – 선택한 챌린지 및 NASA 미션과의 연관성
                    </li>
                    <li>
                      발표력 – 프로젝트 설명의 명확성, 전달력, 시각적 완성도
                    </li>
                  </>
                ) : (
                  <>
                    <li style={{ marginBottom: "1rem" }}>
                      Impact – The project's impact on society, science, and the
                      environment
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                      Creativity – Originality and innovativeness of the
                      approach
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                      Validity – Technical completeness and feasibility
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                      Relevance – Alignment with the chosen challenge and NASA
                      mission
                    </li>
                    <li>
                      Presentation – Clarity, communication, and visual quality
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
