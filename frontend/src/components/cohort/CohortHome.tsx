import Link from "next/link";
import {
  getBulletins,
  getCohort,
  getOrganizationsByRole,
  getPreparationItems,
  getPublishedBanners,
  getRegistrationConfig,
  getTimeline,
} from "@/data/content";
import type { Locale } from "@/domain/content";
import BannerSlider from "./BannerSlider";
import BulletinCard from "./BulletinCard";
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
  const banners = getPublishedBanners(2026);
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

  const projectJourneySteps = [
    {
      title: { ko: "프로젝트 제출", en: "Project Submission" },
      description: {
        ko: "해커톤 기간 동안 완성한 프로젝트를 NASA Space Apps 공식 시스템에 제출합니다.",
        en: "Submit the project completed during the hackathon through the official NASA Space Apps system.",
      },
      stage: "local",
    },
    {
      title: { ko: "서울 지역 심사", en: "Local Judging" },
      description: {
        ko: "제출된 프로젝트를 대상으로 Seoul Local Judges가 지역 심사를 진행합니다.",
        en: "Seoul Local Judges evaluate the submitted projects in the local judging round.",
      },
      stage: "local",
    },
    {
      title: { ko: "서울 지역 시상", en: "Local Awards" },
      description: {
        ko: "지역 심사 결과에 따라 Seoul Local Awards 및 우수 프로젝트를 선정합니다.",
        en: "Seoul Local Awards and outstanding projects are selected based on the local judging results.",
      },
      stage: "local",
    },
    {
      title: { ko: "Global Nominee 추천", en: "Global Nominee Recommendation" },
      description: {
        ko: "서울 지역의 우수 프로젝트 중 Global Judging 대상으로 추천할 프로젝트를 선정하여 NASA Space Apps에 제출합니다.",
        en: "Seoul selects outstanding local projects to recommend for Global Judging and submits them to NASA Space Apps.",
      },
      stage: "local",
    },
    {
      title: { ko: "Global Nominees", en: "Global Nominees" },
      description: {
        ko: "NASA Space Apps의 공식 절차를 거쳐 Global Nominees가 발표됩니다.",
        en: "Global Nominees are announced through the official NASA Space Apps process.",
      },
      stage: "global",
    },
    {
      title: { ko: "Global 심사", en: "Global Judging" },
      description: {
        ko: "전 세계 Global Nominees를 대상으로 Global Judging이 진행됩니다.",
        en: "Global Judging is conducted for Global Nominees from around the world.",
      },
      stage: "global",
    },
    {
      title: { ko: "Global Finalists", en: "Global Finalists" },
      description: {
        ko: "Global Judging을 통해 NASA Space Apps Global Finalists가 선정됩니다.",
        en: "NASA Space Apps Global Finalists are selected through Global Judging.",
      },
      stage: "global",
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
      <BannerSlider banners={banners} locale={locale}>
        <div>
          <p className="section-label">REGISTRATION OPEN</p>
          <h2 id="event-information-title">2026 SEOUL EVENT</h2>
          <p>{cohort.eventType}</p>
        </div>
        <dl className="event-facts">
          <div><dt>{locale === "ko" ? "일정" : "When"}</dt><dd>{cohort.displayDates[locale]}</dd></div>
          <div>
            <dt>{locale === "ko" ? "방식 및 장소" : "Format & place"}</dt>
            <dd className="event-facts__format">
              {cohort.format[locale].split("\n").map((line) => <span key={line}>{line}</span>)}
              <span className="event-facts__location">{cohort.location[locale]}</span>
            </dd>
          </div>
          <div>
            <dt>{locale === "ko" ? "참가비" : "Participation"}</dt>
            <dd className="event-facts__fee">
              <strong>{cohort.participationFee[locale]}</strong>
              <span className="event-facts__fee-divider" aria-hidden="true" />
              <span className="event-facts__fee-copy">Bring your ideas.<br />Build what’s next.</span>
            </dd>
          </div>
        </dl>
      </BannerSlider>

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

      <section className="cohort-section registration-section">
        <div className="section-heading">
          <p className="section-label">REGISTRATION</p>
          <h2>{locale === "ko" ? "등록 및 서울 참가 확인" : "Registration & Seoul confirmation"}</h2>
        </div>
        <div className="registration-flow" aria-label={locale === "ko" ? "참가 등록 흐름" : "Registration flow"}>
          <article>
            <span>01</span>
            <h3>{locale === "ko" ? "NASA 공식 등록" : "NASA Official Registration"}</h3>
            <p>
              {locale === "ko"
                ? "NASA Space Apps 공식 사이트에서 Seoul Local Event에 등록하세요."
                : "Register for the Seoul Local Event on the official NASA Space Apps website."}
            </p>
            <RegistrationLink href={registration?.nasaRegistrationUrl} label={locale === "ko" ? "NASA 공식 등록하기 ↗" : "Register with NASA ↗"} />
          </article>
          <span className="registration-flow__arrow" aria-hidden="true">→</span>
          <article>
            <span>02</span>
            <h3>{locale === "ko" ? "Seoul 참가 확인" : "Seoul Participation Confirmation"}</h3>
            <p>
              {locale === "ko" ? (
                <>NASA 등록 확인 후 발송되는 <strong className="registration-flow__email-subject">「나사 서울 2026 참가 확인」</strong> 이메일을 확인하세요. Google Form 또는 Naver Form 중 하나만 제출하면 됩니다.</>
              ) : (
                <>Check the <strong className="registration-flow__email-subject">“NASA Seoul 2026 Participation Confirmation”</strong> email sent after your NASA registration is verified. Submit either the Google Form or Naver Form.</>
              )}
            </p>
            <small className="registration-flow__dispatch-note">
              {locale === "ko" ? "매주 화·목 순차 발송" : "Sent sequentially every Tuesday and Thursday"}
            </small>
          </article>
          <span className="registration-flow__arrow" aria-hidden="true">→</span>
          <article>
            <span>03</span>
            <h3>{locale === "ko" ? "참가 확인 완료" : "Participation Confirmed"}</h3>
            <p>
              {locale === "ko"
                ? "서울 참가 확인이 완료되면 확인 안내 이메일을 보내드립니다. 이후 Open Kakao 참여(선택) 및 Welcome Benefits 안내를 확인하세요."
                : "We will send a confirmation email once your Seoul participation confirmation is complete. Then review the optional Open Kakao participation and Welcome Benefits information."}
            </p>
          </article>
        </div>
        <div className="registration-note">
          <p>{locale === "ko" ? "Seoul Participation Confirmation은 NASA 공식 등록을 대체하지 않습니다." : "Seoul Participation Confirmation does not replace NASA Official Registration."}</p>
          <small>{locale === "ko" ? "NASA 공식 등록 + Seoul 참가 확인 = 서울 참가 확인 완료" : "NASA Official Registration + Seoul Participation Confirmation = Seoul Participation Confirmed"}</small>
        </div>
      </section>

      <section className="cohort-section participation-section">
        <div className="section-heading">
          <p className="section-label">HOW TO PARTICIPATE</p>
          <div className="participation-section__title-row">
            <h2>{locale === "ko" ? "참가 흐름" : "Participation flow"}</h2>
            <span>NOW IN PROGRESS</span>
          </div>
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

      <section className="cohort-section project-journey-section">
        <div className="section-heading project-journey__heading">
          <p className="section-label">PROJECT JOURNEY</p>
          <h2>{locale === "ko" ? "프로젝트 진출 과정" : "Project journey"}</h2>
          <p className="project-journey__intro">
            {locale === "ko"
              ? "해커톤에서 제출된 프로젝트는 서울 지역 심사와 시상을 거치며, 우수 프로젝트는 NASA Space Apps Global Judging 대상으로 추천될 수 있습니다. 이후 Global 단계는 NASA Space Apps의 공식 절차에 따라 진행됩니다."
              : "Projects submitted during the hackathon go through Seoul local judging and awards, and outstanding projects may be recommended for NASA Space Apps Global Judging. The Global stages then proceed according to the official NASA Space Apps process."}
          </p>
        </div>
        <div className="project-journey" aria-label={locale === "ko" ? "프로젝트 진출 단계" : "Project advancement stages"}>
          <svg className="project-journey__arrow" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="project-journey-gradient" gradientUnits="userSpaceOnUse" x1="20" y1="960" x2="20" y2="42">
                <stop offset="0%" stopColor="#003cff" />
                <stop offset="72%" stopColor="#087dff" />
                <stop offset="82%" stopColor="#54c8ff" />
                <stop offset="91%" stopColor="#d8f53c" />
                <stop offset="100%" stopColor="#f4ff55" />
              </linearGradient>
              <marker id="project-journey-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>
            <path className="project-journey__arrow-path" d="M 20 960 L 20 42" />
          </svg>
          <ol className="project-journey__steps">
            {projectJourneySteps.map((step, index) => (
              <li className={`project-journey__step project-journey__step--${step.stage}`} key={step.title.en}>
                {index === 6 || index === 3 || index === 2 ? (
                  <span className="project-journey__stage-heading">
                    {index === 6 ? "GLOBAL STAGE" : index === 3 ? "LOCAL → GLOBAL" : "LOCAL STAGE"}
                  </span>
                ) : null}
                <article className="project-journey__card">
                  <span className="project-journey__number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="project-journey__copy">
                    <h3>{step.title[locale]}</h3>
                    <span className="project-journey__translation">
                      {locale === "ko" ? step.title.en : step.title.ko}
                    </span>
                    <p>{step.description[locale]}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
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
        {bulletins.length ? (
          <div className="bulletin-grid bulletin-grid--latest">
            {bulletins.map((post) => <BulletinCard key={post.id} post={post} locale={locale} />)}
          </div>
        ) : <EmptyState title={locale === "ko" ? "Coming Soon" : "Updates Coming Soon"} />}
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
