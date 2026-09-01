import Link from "next/link";
import { getBulletins, getOrganizationsByRole, getRegistrationConfig } from "@/data/content";
import type { Locale } from "@/domain/content";
import CohortPage from "./CohortPage";
import EmptyState from "./EmptyState";
import { cohortPath } from "./navigation";

export default function CohortHome({ locale }: { locale: Locale }) {
  const registration = getRegistrationConfig(2026);
  const bulletins = getBulletins(2026).slice(0, 3);
  const partners = getOrganizationsByRole(2026);

  return (
    <CohortPage
      locale={locale}
      eyebrow="SEOUL LOCAL EVENT · 2026"
      title="NASA SPACE APPS SEOUL 2026"
      description={
        locale === "ko"
          ? "2026 행사 정보는 확인되는 순서대로 공개됩니다."
          : "Verified 2026 event information will be published as it becomes available."
      }
    >
      <section className="hero-skeleton" aria-labelledby="event-status-title">
        <div>
          <p className="section-label">CURRENT COHORT</p>
          <h2 id="event-status-title">{locale === "ko" ? "공개 준비 중" : "Preparing for publication"}</h2>
          <p>
            {locale === "ko"
              ? "행사 날짜, 장소, 등록 링크 등은 운영팀 확인 후 게시합니다."
              : "Dates, format, venue, and registration links will appear after confirmation."}
          </p>
        </div>
        <dl className="event-facts">
          <div><dt>{locale === "ko" ? "일정" : "When"}</dt><dd>{locale === "ko" ? "확인 중" : "To be confirmed"}</dd></div>
          <div><dt>{locale === "ko" ? "방식 및 장소" : "Format & place"}</dt><dd>{locale === "ko" ? "확인 중" : "To be confirmed"}</dd></div>
          <div><dt>{locale === "ko" ? "참가 안내" : "Participation"}</dt><dd>{locale === "ko" ? "추후 공개" : "Coming soon"}</dd></div>
        </dl>
        {registration?.published && registration.seoulParticipationUrl ? (
          <a className="primary-cta" href={registration.seoulParticipationUrl} target="_blank" rel="noopener noreferrer">
            {locale === "ko" ? "서울 참가 확인" : "Confirm Seoul participation"}
          </a>
        ) : (
          <span className="primary-cta primary-cta--disabled" aria-disabled="true">
            {locale === "ko" ? "외부 참가 확인 Form · 준비 중" : "External participation form · coming soon"}
          </span>
        )}
      </section>

      <section className="cohort-section">
        <div className="section-heading">
          <p className="section-label">HOW TO PARTICIPATE</p>
          <h2>{locale === "ko" ? "참가 흐름" : "Participation flow"}</h2>
        </div>
        <ol className="steps-grid">
          <li><span>01</span><strong>{locale === "ko" ? "NASA 공식 등록" : "Official NASA registration"}</strong><p>{locale === "ko" ? "공식 등록 URL 확인 후 연결합니다." : "The verified official URL will be linked here."}</p></li>
          <li><span>02</span><strong>{locale === "ko" ? "Seoul 참가 확인" : "Seoul participation confirmation"}</strong><p>{locale === "ko" ? "2026에는 승인된 외부 Form을 사용합니다." : "An approved external form will be used in 2026."}</p></li>
          <li><span>03</span><strong>{locale === "ko" ? "후속 안내 확인" : "Follow the updates"}</strong><p>{locale === "ko" ? "팀 구성과 행사 운영 안내는 Bulletin에 게시합니다." : "Team and event guidance will be published in the Bulletin."}</p></li>
        </ol>
      </section>

      <section className="cohort-section">
        <div className="section-heading section-heading--inline">
          <div><p className="section-label">LATEST UPDATES</p><h2>{locale === "ko" ? "최근 공지" : "Latest bulletin"}</h2></div>
          <Link href={cohortPath(2026, locale, "bulletin")}>{locale === "ko" ? "전체 보기" : "View all"}</Link>
        </div>
        {bulletins.length ? null : <EmptyState locale={locale} />}
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
          {partners.length ? null : <p className="muted-copy">{locale === "ko" ? "확정 및 로고 사용 승인 후 공개됩니다." : "Partners will appear after confirmation and logo approval."}</p>}
        </div>
      </section>
    </CohortPage>
  );
}
