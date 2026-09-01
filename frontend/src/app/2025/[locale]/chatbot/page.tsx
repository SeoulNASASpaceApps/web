"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === "ko";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = (() => {

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
      topMenus,
      title: "SPACE CHATBOT",
      sendButton: isKorean ? "보내기" : "Send",
      placeholder: isKorean
        ? "해커톤 종료로 채팅이 비활성화되었습니다."
        : "Chat is disabled because the hackathon has ended.",
      messages: [
        {
          id: "welcome",
          type: "assistant" as const,
          content: isKorean
            ? "안녕하세요! NASA Space Apps Seoul 2025 챗봇입니다."
            : "Hello! I’m the NASA Space Apps Seoul 2025 chatbot.",
          timestamp: new Date(),
        },
        {
          id: "closed",
          type: "assistant" as const,
          content: isKorean
            ? "해커톤 일정이 종료되어 현재 채팅 기능은 운영하지 않습니다. 행사 기록은 다른 메뉴에서 계속 확인하실 수 있습니다."
            : "The hackathon has ended, so the chat service is no longer active. You can still explore the event archive through the other menu pages.",
          timestamp: new Date(),
        },
      ] satisfies ChatMessage[],
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
        overflowX: "hidden",
      }}
    >
      {/* Responsive CSS: sidebar collapse, hamburger menu, fluid typography, chat adaptation */}
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
          display: flex;
          flex-direction: column;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* Fluid typography with clamp() */
        h1.page-title {
          font-size: clamp(32px, 6vw, 59px);
          line-height: 1.2;
          text-align: center;
          color: #003cff;
          margin-bottom: 1rem;
          word-break: keep-all;
        }
        p.page-subtitle {
          font-size: clamp(16px, 3vw, 25px);
          line-height: 1.4;
          text-align: center;
          color: #000000;
          margin-bottom: 2rem;
          word-break: keep-all;
        }

        /* Chat-specific styles */
        .chat-container {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background-color: #fafafa;
          max-height: 60vh;
          min-height: 400px;
          max-width: 100%;
          box-sizing: border-box;
        }
        .chat-message {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .chat-message.user {
          flex-direction: row-reverse;
        }
        .chat-bubble {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          max-width: 70%;
          word-wrap: break-word;
          font-size: clamp(14px, 2.5vw, 16px);
          font-family: var(--font-rethink-medium), sans-serif;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .chat-bubble.user {
          background-color: #0033ff;
          color: #ffffff;
        }
        .chat-bubble.assistant {
          background-color: #ffffff;
          color: #000000;
          border: 1px solid #e5e5e5;
        }
        .chat-input-area {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          padding: 1rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background-color: #ffffff;
          max-width: 100%;
          box-sizing: border-box;
        }
        .chat-textarea {
          width: 100%;
          min-height: 60px;
          padding: 0.75rem;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-family: var(--font-rethink-medium), sans-serif;
          font-size: clamp(14px, 2.5vw, 16px);
          resize: vertical;
          outline: none;
          box-sizing: border-box;
        }
        .chat-send-button {
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-family: var(--font-rethink-medium), sans-serif;
          font-size: clamp(14px, 2.5vw, 16px);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 80px;
          white-space: nowrap;
        }
        .chat-send-button:enabled {
          background-color: #0033ff;
          color: #ffffff;
        }
        .chat-send-button:disabled {
          background-color: #e5e5e5;
          color: #575757;
          cursor: not-allowed;
        }

        /* Tablet & phones: hide sidebar, show hamburger, adapt chat */
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

          /* Chat adaptations */
          .chat-container {
            min-height: 300px;
            max-height: 50vh;
            padding: 0.75rem;
          }
          .chat-bubble {
            max-width: 85%;
          }
          .chat-input-area {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 0.75rem;
          }
          .chat-send-button {
            width: 100%;
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
          .chat-container {
            padding: 0.5rem;
            min-height: 250px;
          }
          .chat-bubble {
            max-width: 90%;
            padding: 0.5rem 0.75rem;
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
            onClick={() => router.push("/2025/ko/chatbot")}
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
            onClick={() => router.push("/2025/en/chatbot")}
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
      </div>

      {/* Main Chat Content */}
      <div className="main-content">
        {/* Chat Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 className="page-title">{content.title}</h1>
          <p className="page-subtitle">
            {isKorean
              ? "NASA Space Apps Seoul 2025 챗봇 운영 기록"
              : "NASA Space Apps Seoul 2025 chatbot archive"}
          </p>
        </div>

        {/* Chat Messages */}
        <div className="chat-container" aria-live="polite">
          {content.messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.type}`}>
              <div className={`chat-bubble ${message.type}`}>
                {message.id === "welcome" ? (
                  <span
                    style={{
                      fontSize: "14px",
                      fontStyle: "italic",
                      opacity: 0.7,
                    }}
                  >
                    {message.content}
                  </span>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="chat-input-area">
          <div style={{ flex: 1, width: "100%" }}>
            <textarea
              placeholder={content.placeholder}
              disabled
              className="chat-textarea"
              rows={1}
            />
          </div>
          <button
            disabled
            className="chat-send-button"
          >
            {content.sendButton}
          </button>
        </div>
      </div>
    </div>
  );
}
