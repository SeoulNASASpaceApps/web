import Link from "next/link";
import {
  getBulletins,
  getCohort,
  getOrganizationsByRole,
  getPreparationItems,
  getRegistrationConfig,
  getTimeline,
} from "@/data/content";
import type { Locale } from "@/domain/content";
import BannerSlider from "./BannerSlider";
import CohortPage from "./CohortPage";
import EmptyState from "./EmptyState";
import { cohortPath } from "./navigation";

function RegistrationLink({ href, label }: { href: string | null | undefined; label: string }) {
  return href ? (
    <a className="registration-link" href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <span className="registration-coming-soon">Coming Soon</span>
  );
}

export default function CohortHome({ locale }: { locale: Locale }) {
  const cohort = getCohort(2026);
  const registration = getRegistrationConfig(2026);
  const timeline = getTimeline(2026);
  const preparation = getPreparationItems(2026);
  const bulletins = getBulletins(2026).slice(0, 3);
  const partners = getOrganizationsByRole(2026);

  if (!cohort?.displayDates || !cohort.location || !cohort.format || !cohort.participationFee) {
    return null;
  }

  const participationSteps = [
    {
      title: { ko: "NASA 공식 등록", en: "NASA OFFICIAL REGISTRATION" },
      description: {
        ko: "NASA Space Apps 공식 사이트에서 Seoul Local Event 참가 등록.",
        en: "Register for the Seoul Local Event on the official NASA Space Apps website.",
      },
    },
    {
      title: { ko: "서울 참가 확인", en: "SEOUL PARTICIPATION CONFIRMATION" },
      description: {
        ko: "NASA 공식 등록 후 Seoul 운영팀의 외부 Form을 통해 참가 확인 절차 진행.",
        en: "After official registration, complete the Seoul confirmation process using the external form.",
      },
    },
    {
      title: { ko: "Challenge 선택", en: "CHOOSE A CHALLENGE" },
      description: {
        ko: "공개된 NASA Space Apps Challenge를 확인하고 관심 있는 문제를 선택.",
        en: "Review the published NASA Space Apps Challenges and choose a problem that interests you.",
      },
    },
    {
      title: { ko: "팀 구성", en: "FORM OR JOIN A TEAM" },
      description: {
        ko: "팀을 만들거나 기존 팀에 합류하여 Challenge 준비.",
        en: "Create a team or join an existing team to prepare for your Challenge.",
      },
    },
    {
      title: { ko: "해커톤 참가", en: "HACKATHON WEEKEND" },
      description: { ko: "2026년 11월 14일–15일", en: "November 14–15, 2026" },
    },
    {
      title: { ko: "프로젝트 제출", en: "PROJECT SUBMISSION" },
      description: {
        ko: "NASA Space Apps 공식 시스템을 통해 프로젝트 제출.",
        en: "Submit your project through the official NASA Space Apps system.",
      },
    },
  ] as const;

  return (
    <CohortPage
      locale={locale}
      eyebrow="SEOUL LOCAL EVENT · 2026"
      title="NASA SPACE APPS SEOUL 2026"
      introMeta={cohort.displayDates[locale].toUpperCase()}
      description={
        locale === "ko"
          ? "서울에서 NASA의 글로벌 해커톤에 참여하세요.\nNASA와 Space Agency Partner의 오픈 데이터를 활용해 지구와 우주에 관한 실제 문제에 도전합니다."
          : "Join NASA's global hackathon from Seoul.\nUse NASA and Space Agency Partner open data to tackle real-world challenges on Earth and in space."
      }
    >
      <section className="hero-skeleton" aria-labelledby="event-information-title">
        <div>
          <p className="section-label">REGISTRATION OPEN</p>
          <h2 id="event-information-title">2026 SEOUL EVENT</h2>
          <p>{cohort.eventType}</p>
        </div>
        <dl className="event-facts">
          <div><dt>{locale === "ko" ? "일정" : "When"}</dt><dd>{cohort.displayDates[locale]}</dd></div>
          <div><dt>{locale === "ko" ? "방식 및 장소" : "Format & place"}</dt><dd>{cohort.format[locale]}<br />{cohort.location[locale]}</dd></div>
          <div><dt>{locale === "ko" ? "참가비" : "Participation"}</dt><dd>{cohort.participationFee[locale]}</dd></div>
        </dl>
      </section>

      <BannerSlider locale={locale} />

      <section className="cohort-section split-copy-section">
        <div className="section-heading">
          <p className="section-label">WHO CAN PARTICIPATE</p>
          <h2>{locale === "ko" ? "누구나 함께할 수 있습니다" : "Open to diverse backgrounds"}</h2>
        </div>
        <div className="large-body-copy">
          <p>{locale === "ko" ? "전공과 기술 수준에 관계없이 다양한 참가자가 함께할 수 있습니다." : "Open to participants from diverse backgrounds and skill levels."}</p>
          <p>{locale === "ko" ? "학생, 개발자, 디자이너, 엔지니어, 과학자, 기획자, 창업가 등 오픈 데이터를 활용해 문제 해결에 도전하고 싶은 누구나 참여할 수 있습니다." : "Students, developers, designers, engineers, scientists, storytellers, entrepreneurs, and anyone interested in solving challenges using open data are welcome."}</p>
        </div>
      </section>

      <section className="cohort-section">
        <div className="section-heading">
          <p className="section-label">REGISTRATION</p>
          <h2>{locale === "ko" ? "등록 및 서울 참가 확인" : "Registration & Seoul confirmation"}</h2>
        </div>
        <div className="registration-flow" aria-label={locale === "ko" ? "참가 등록 흐름" : "Registration flow"}>
          <article>
            <span>01</span>
            <h3>{locale === "ko" ? "NASA 공식 등록" : "NASA Official Registration"}</h3>
            <RegistrationLink href={registration?.nasaRegistrationUrl} label={locale === "ko" ? "공식 등록" : "Official registration"} />
          </article>
          <span className="registration-flow__arrow" aria-hidden="true">→</span>
          <article>
            <span>02</span>
            <h3>{locale === "ko" ? "Seoul 참가 확인" : "Seoul Participation Confirmation"}</h3>
            <RegistrationLink href={registration?.seoulParticipationUrl} label={locale === "ko" ? "서울 참가 확인" : "Confirm Seoul participation"} />
          </article>
          <span className="registration-flow__arrow" aria-hidden="true">→</span>
          <article>
            <span>03</span>
            <h3>{locale === "ko" ? "참가 확인 완료" : "Participation Confirmed"}</h3>
            <p>{locale === "ko" ? "두 절차 완료 후 참가가 확인됩니다." : "Participation is confirmed after both steps are complete."}</p>
          </article>
        </div>
        <p className="registration-note">{locale === "ko" ? "Seoul Participation Confirmation은 NASA 공식 등록을 대체하지 않습니다." : "Seoul Participation Confirmation does not replace NASA Official Registration."}</p>
      </section>

      <section className="cohort-section">
        <div className="section-heading">
          <p className="section-label">HOW TO PARTICIPATE</p>
          <h2>{locale === "ko" ? "참가 흐름" : "Participation flow"}</h2>
        </div>
        <ol className="steps-grid steps-grid--six">
          {participationSteps.map((step, index) => (
            <li key={step.title.en}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.title[locale]}</strong>
              <p>{step.description[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cohort-section">
        <div className="section-heading section-heading--inline">
          <div><p className="section-label">2026 KEY TIMELINE</p><h2>{locale === "ko" ? "주요 일정" : "Key dates"}</h2></div>
          <Link href={cohortPath(2026, locale, "bulletin")}>{locale === "ko" ? "상세 안내" : "Event updates"}</Link>
        </div>
        <ol className="timeline-grid">
          {timeline.map((item) => <li key={item.id}><time dateTime={item.date}>{item.displayDate[locale]}</time><strong>{item.title[locale]}</strong></li>)}
        </ol>
      </section>

      <section className="cohort-section">
        <div className="section-heading">
          <p className="section-label">PARTICIPANT PREPARATION</p>
          <h2>{locale === "ko" ? "Welcome 일정" : "Welcome timeline"}</h2>
        </div>
        <div className="preparation-grid">
          {preparation.map((item) => (
            <article key={item.id}><time>{item.displayPeriod[locale]}</time><h3>{item.title[locale]}</h3><p>{item.description[locale]}</p></article>
          ))}
        </div>
        <dl className="coming-soon-list">
          <div><dt>{locale === "ko" ? "한국어 Zoom Session" : "Korean Zoom Sessions"}</dt><dd>Coming Soon</dd></div>
          <div><dt>Celebration / Awards Event</dt><dd>Coming Soon</dd></div>
          <div><dt>Networking Event</dt><dd>Coming Soon</dd></div>
        </dl>
      </section>

      <section className="cohort-section">
        <div className="section-heading section-heading--inline">
          <div><p className="section-label">LATEST UPDATES</p><h2>{locale === "ko" ? "최근 공지" : "Latest bulletin"}</h2></div>
          <Link href={cohortPath(2026, locale, "bulletin")}>{locale === "ko" ? "전체 보기" : "View all"}</Link>
        </div>
        {bulletins.length ? null : <EmptyState title={locale === "ko" ? "Coming Soon" : "Updates Coming Soon"} />}
      </section>

      <section className="cohort-section two-column-section">
        <div>
          <p className="section-label">FROM OUR COMMUNITY</p>
          <h2>{locale === "ko" ? "지난 기록" : "Past cohort"}</h2>
          <p>{locale === "ko" ? "2025 행사 콘텐츠와 수상 기록은 기존 URL에서 계속 확인할 수 있습니다." : "The 2025 event and award archive remains available at its original URLs."}</p>
          <Link className="text-link" href={`/2025/${locale}/awardees/`}>{locale === "ko" ? "2025 수상 기록 보기" : "View 2025 awardees"}</Link>
        </div>
        <div>
          <p className="section-label">PARTNERS</p>
          <h2>{locale === "ko" ? "2026 파트너" : "2026 partners"}</h2>
          {partners.length ? null : <p className="muted-copy">Coming Soon</p>}
        </div>
      </section>
    </CohortPage>
  );
}
