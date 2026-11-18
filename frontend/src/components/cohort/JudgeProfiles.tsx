import { judgeProfiles } from "@/content/judges";
import type { Locale } from "@/domain/content";

export const judgePageCopy = {
  ko: {
    title: "심사위원",
    description: "서울의 도전을 함께 살펴봐 주시는 심사위원을 소개합니다.",
    thanks: "시간과 전문성을 나누어 NASA Space Apps Seoul 2026의 프로젝트를 심사해주시는 네 분께 감사드립니다.",
    region: "2026 서울 심사위원 약력",
    background: "주요 약력",
    expertise: "전문 분야",
    introduction: "약력 및 연구·활동 소개",
    judging: "NASA Space Apps 심사위원 소개",
    references: "연구실·소속 안내",
    links: "공식 연구실·소속 기관",
    details: "전체 약력 및 소개",
    newTab: "새 탭",
  },
  en: {
    title: "Judges",
    description: "Meet the judges reviewing the work of our Seoul participants.",
    thanks: "We thank our four judges for sharing their time and expertise with NASA Space Apps Seoul 2026.",
    region: "2026 Seoul judge biographies",
    background: "Background",
    expertise: "Expertise",
    introduction: "Biography & Research",
    judging: "NASA Space Apps",
    references: "Lab / Institutional References",
    links: "Official lab & organization links",
    details: "Full biography",
    newTab: "New tab",
  },
} as const;

export default function JudgeProfiles({ locale }: { locale: Locale }) {
  const copy = judgePageCopy[locale];

  return (
    <section className="judge-profiles team-profiles" aria-label={copy.region}>
      <div className="team-profile-grid">
        {judgeProfiles.map((profile) => {
          const bio = profile.copy[locale];

          return (
            <details className="team-profile-card" id={profile.id} key={profile.id}>
              <summary aria-label={`${bio.name} — ${copy.details}`}>
                <div className="judge-kicker">2026 SEOUL JUDGE</div>
                <span className="team-profile-card__summary">
                  <strong>{bio.name}</strong>
                  <span className="judge-name-en">{bio.englishName}</span>
                  <span className="judge-affiliation">{bio.affiliation}</span>
                </span>
                <div className="judge-facts">
                  <p className="judge-facts-label">{copy.background}</p>
                  <ul>{bio.background.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <p className="judge-focus">{copy.expertise} · {bio.expertise}</p>
                <span className="team-profile-card__toggle" aria-hidden="true">
                  <span className="team-profile-card__toggle-label">{copy.details}</span>
                  <span className="team-profile-card__toggle-icon" />
                </span>
              </summary>
              <div className="team-profile-card__body">
                <section className="team-profile-card__section">
                  <h3>{copy.introduction}</h3>
                  {bio.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
                <section className="team-profile-card__section">
                  <h3>{copy.judging}</h3>
                  {bio.judging.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
                {bio.reference ? (
                  <section className="team-profile-card__section">
                    <h3>{copy.references}</h3>
                    <p>{bio.reference}</p>
                  </section>
                ) : null}
                <section className="team-profile-card__section">
                  <h3>{copy.links}</h3>
                  <div className="judge-official-links">
                    {bio.links.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label} <span aria-hidden="true">↗</span>
                        <span className="cohort-sr-only"> ({copy.newTab})</span>
                      </a>
                    ))}
                  </div>
                </section>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
