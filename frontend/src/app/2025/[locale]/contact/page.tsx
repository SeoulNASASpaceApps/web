"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === "ko";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = (() => {
    return {
      title: isKorean ? "문의하기" : "Contact Us",
      email: "seoul@nasaspaceappskr.org",
      instagram: "https://www.instagram.com/nasaspaceapps_seoul/",
      hashtags: isKorean
        ? "#SpaceApps #SpaceAppsSeoul"
        : "#SpaceApps #SpaceAppsSeoul",
      naverCafe: "https://cafe.naver.com/nasaspaceappspangyo",
      naverBlog: "https://blog.naver.com/nasaspaceapps_pangyo",
    };
  })();

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
      {/* Responsive CSS: sidebar collapse, hamburger menu, fluid typography */}
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

        /* Contact list styles */
        .contact-list {
          list-style-type: none;
          padding: 0;
          font-size: clamp(16px, 3vw, 25px);
          font-family: var(--font-rethink-medium), sans-serif;
          color: #000000;
          line-height: 1.6;
        }
        .contact-list li {
          margin-bottom: 1rem;
          word-break: break-word;
        }
        .contact-list strong {
          display: inline-block;
          min-width: clamp(80px, 15vw, 150px);
        }
        .contact-list a {
          color: #0033ff;
          text-decoration: underline;
          word-break: break-all;
        }
        .contact-list a:hover {
          color: #0026cc;
        }

        /* Tablet & phones: hide sidebar, show hamburger */
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

          .contact-list {
            padding-left: 0;
          }
          .contact-list strong {
            display: block;
            margin-bottom: 0.25rem;
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
              router.push("/2025/ko/contact");
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
              router.push("/2025/en/contact");
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
        {/* No sidebar navigation items for contact page */}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Title */}
        <h1 className="page-title">{content.title}</h1>

        {/* Grey Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e5e5",
            margin: "1.5rem 0",
          }}
        />

        {/* Contact Information */}
        <section style={{ marginBottom: "4rem" }}>
          <ul className="contact-list">
            <li>
              <strong>{isKorean ? "이메일" : "Email"}:</strong>{" "}
              <a href={`mailto:${content.email}`}>{content.email}</a>
            </li>
            <li>
              <strong>{isKorean ? "인스타그램" : "Instagram"}:</strong>{" "}
              <a
                href={content.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.instagram}
              </a>
            </li>
            <li>
              <strong>{isKorean ? "해시태그" : "Hashtags"}:</strong>{" "}
              {content.hashtags}
            </li>
            <li>
              <strong>{isKorean ? "네이버 카페" : "Naver Cafe"}:</strong>{" "}
              <a
                href={content.naverCafe}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.naverCafe}
              </a>
            </li>
            <li>
              <strong>{isKorean ? "네이버 블로그" : "Naver Blog"}:</strong>{" "}
              <a
                href={content.naverBlog}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.naverBlog}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
