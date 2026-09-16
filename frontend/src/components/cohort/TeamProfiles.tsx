import type { Locale } from "@/domain/content";
import { organizingTeamProfiles } from "@/content/team";

const sectionCopy = {
  ko: {
    eyebrow: "TEAM PROFILES",
    title: "운영팀 멤버",
    details: "상세 프로필",
  },
  en: {
    eyebrow: "TEAM PROFILES",
    title: "Organizing Team",
    details: "Profile details",
  },
} as const;

export default function TeamProfiles({ locale }: { locale: Locale }) {
  const copy = sectionCopy[locale];

  return (
    <section className="team-profiles" aria-labelledby="team-profiles-title">
      <header className="team-profiles__heading">
        <p className="section-label">{copy.eyebrow}</p>
        <h2 id="team-profiles-title">{copy.title}</h2>
      </header>

      <div className="team-profile-grid">
        {organizingTeamProfiles.map((profile) => {
          const profileCopy = profile.copy[locale];

          return (
            <details key={profile.id} className="team-profile-card">
              <summary>
                <span className="team-profile-card__summary">
                  <strong>{profile.name}</strong>
                  <span className="team-profile-card__affiliation">{profileCopy.affiliation}</span>
                  <span className="team-profile-card__highlight">{profileCopy.highlight}</span>
                </span>
                <span className="team-profile-card__toggle" aria-hidden="true">
                  <span className="team-profile-card__toggle-label">{copy.details}</span>
                  <span className="team-profile-card__toggle-icon" />
                </span>
              </summary>

              <div className="team-profile-card__body">
                {profileCopy.sections.map((section) => (
                  <section key={section.title} className="team-profile-card__section">
                    <h3>{section.title}</h3>
                    {section.bullets ? (
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                    {section.paragraphs?.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>
                        {paragraph.map((part, partIndex) =>
                          part.tone === "navy" ? (
                            <span className="team-profile-card__navy-emphasis" key={partIndex}>
                              {part.text}
                            </span>
                          ) : part.emphasized ? (
                            <strong key={partIndex}>{part.text}</strong>
                          ) : (
                            part.text
                          ),
                        )}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
