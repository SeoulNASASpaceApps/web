"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function SponsorsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === "ko";

  // Mobile top bar menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sponsors = [
    {
      id: "aws",
      name: { ko: "Amazon Web Services", en: "Amazon Web Services" },
      image: "/images/sponsors/sponsors_03.png",
      width: 462,
      height: 292,
      content: {
        ko: "Amazon Web Services(AWS)의 Aerospace & Satellite Solutions 부문은 전 세계 우주 기업들이 위성 데이터를 활용해 혁신을 이루도록 지원하는 전문 조직이다. 위성 데이터의 수집·저장·처리에서 AI/ML 및 생성형 AI 기반 분석까지 아우르는 클라우드 솔루션을 제공하며, 우주 기업을 위한 크레딧 지원, 교육·트레이닝, 기술 협력 프로그램을 운영한다. 이러한 노력을 통해 AWS는 글로벌 협업을 촉진하고, 특히 아시아·태평양(APJ) 지역에서 우주 산업의 성장을 선도하는 핵심 파트너로 자리매김하고 있다.",
        en: "The Aerospace & Satellite Solutions division of Amazon Web Services (AWS) is a specialized organization that empowers space companies worldwide to drive innovation through satellite data. It delivers end-to-end cloud solutions—from data collection, storage, and processing to AI/ML and generative AI–driven analytics—while offering credit support, training, and technical collaboration programs for space enterprises. Through these initiatives, AWS fosters global collaboration and plays a leading role in advancing the growth of the space industry, particularly across the Asia-Pacific (APJ) region.",
      },
    },
    {
      id: "bizdata",
      name: { ko: "BizData", en: "BizData" },
      image: "/images/sponsors/sponsors_01.png",
      width: 454,
      height: 117,
      content: {
        ko: "BizData는 데이터 컴퓨팅과 AI 기술을 바탕으로 환경 관리, 비즈니스 인텔리전스, 스마트팩토리, 데이터 컨설팅 등 전 산업 영역에서 자율운영 서비스를 제공하는 선도 기업입니다. 자체 AI 자율운영 플랫폼(AOS)과 통합 빅데이터 솔루션을 통해 기업의 의사결정과 운영을 자동화하고, 환경·제조·경영 분석 분야에서 ESG 가치를 실현하는 혁신적 데이터 전문 기업으로 자리매김하고 있습니다.",
        en: "BizData is a leading Korean enterprise that delivers data-driven autonomous services across environment, business intelligence, smart factories, and consulting. Leveraging its proprietary AI Autonomous Operating System (AOS) and integrated big data platforms, the company enables real-time decision-making and operational automation while advancing ESG-driven innovation in environmental management, manufacturing, and enterprise analytics.",
      },
    },
    {
      id: "modulabs",
      name: { ko: "모두의연구소", en: "ModuLabs" },
      image: "/images/sponsors/sponsors_02.png",
      width: 439,
      height: 173,
      content: {
        ko: "모두의연구소는 대한민국 대표 AI·소프트웨어 교육·연구 커뮤니티 플랫폼으로, 부트캠프(아이펠, 액티브러닝 캠프), 다양한 연구 LAB(AI Inference, DAO, UX 등), 오픈 세미나·컨퍼런스(모두팝, 모두콘)를 통해 누구나 참여할 수 있는 실무 중심 학습과 자율적 연구 문화를 제공합니다. 'Share Value, Grow Together' 철학 아래, 협업과 자기주도적 성장을 지향합니다.",
        en: "ModuLabs is South Korea's leading AI and software education and research community platform, offering practical bootcamps (AIFFEL, Active Learning Camp), diverse research labs (AI Inference, DAO, UX), and open seminars and conferences (ModuPop, ModuCon). Guided by the philosophy of 'Share Value, Grow Together,' ModuLabs fosters collaboration, autonomy, and self-directed growth in an open learning environment.",
      },
    },
  ];

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
      }}
    >
      {/* Responsive CSS: no hidden mobile menu by default; fluid type; sidebar collapse */}
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
          /* scales down on mobile, caps to current 18px on desktop */
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
          z-index: 101; /* above the top-bar */
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

        /* Fluid typography with clamp(): scales down on small screens, keeps desktop caps */
        h1.page-title {
          font-size: clamp(28px, 5.2vw, 59px);
          line-height: 1.2;
          text-align: center;
          color: #003cff;
          margin-bottom: 1.5rem;
          word-break: keep-all;
        }
        h3.section-title {
          font-size: clamp(20px, 4vw, 32px);
          line-height: 1.25;
          color: #000000;
          margin-bottom: 2rem;
          word-break: keep-all;
        }
        p.body-text {
          font-size: clamp(16px, 2.5vw, 25px);
          line-height: 1.6;
          color: #000000;
          margin-left: 10%;
          margin-right: 10%;
          margin-bottom: 1rem;
        }
        img.sponsor {
          width: 60%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Tablet & phones: hide sidebar, show hamburger, full-width images, compact paddings */
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
          } /* hide desktop menus */
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
          img.sponsor {
            width: 100%;
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
              className="text-base md:text-lg font-bold text-black no-underline transition-colors hover:text-blue-700"
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
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          className="md:hidden"
        >
          <button
            className="mobile-toggle"
            aria-label={isKorean ? "메뉴 열기" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            title={isKorean ? "메뉴" : "Menu"}
          >
            ☰
          </button>
        </div>

        <div
          className="lang-switch lang-switch-mobile"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push("/2025/ko/sponsors");
            }}
            style={{
              color: isKorean ? "#0033FF" : "#000000",
              cursor: "pointer",
              fontWeight: isKorean ? "bold" : "normal",
            }}
          >
            KOREAN
          </span>
          <span style={{ color: "#000000" }}> | </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push("/2025/en/sponsors");
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

      {/* Mobile dropdown / scroller menu (rendered only when open; no CSS display:none) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu"
          onClick={() => setMobileMenuOpen(false)}
        >
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

      {/* Navigation (Sidebar) */}
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
            {sponsors.map((sponsor, idx) => (
              <li
                key={sponsor.id}
                className="cursor-pointer text-black hover:text-blue-600 transition-colors text-sm font-medium"
                style={{
                  fontSize: 15,
                  fontFamily: "var(--font-rethink-medium), sans-serif",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0,
                }}
                onClick={() => {
                  const targetElement = document.getElementById(sponsor.id);
                  if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const offsetTop = window.pageYOffset + rect.top - 70;
                    window.scrollTo({ top: offsetTop, behavior: "smooth" });
                  }
                }}
              >
                <span>{sponsor.name[isKorean ? "ko" : "en"]}</span>
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
        <h1 className="page-title">
          {isKorean ? "도움 주시는 분들" : "Sponsors Who Make This Possible"}
        </h1>

        {/* Grey Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "1.5rem 0",
          }}
        />

        {/* Sponsors Sections */}
        {sponsors.map((sponsor, idx) => (
          <section
            key={sponsor.id}
            id={sponsor.id}
            style={{ marginBottom: "4rem" }}
          >
            <h3 className="section-title">
              {sponsor.name[isKorean ? "ko" : "en"]}
            </h3>

            {/* Sponsor Image */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              <Image
                className="sponsor"
                src={sponsor.image}
                alt={sponsor.name[isKorean ? "ko" : "en"]}
                width={sponsor.width}
                height={sponsor.height}
              />
            </div>

            {/* Content */}
            <p className="body-text">
              {sponsor.content[isKorean ? "ko" : "en"]}
            </p>

            {/* Divider between sponsors */}
            {idx < sponsors.length - 1 && (
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e5e5",
                  margin: "1rem 0",
                }}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
