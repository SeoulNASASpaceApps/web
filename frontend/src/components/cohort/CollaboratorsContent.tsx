import { collaboratorCopy, collaboratorOverview, modulabs } from "@/content/collaborators";
import { getOrganizationsByRole } from "@/data/content";
import type { Locale } from "@/domain/content";

export { collaboratorCopy };

export default function CollaboratorsContent({ locale }: { locale: Locale }) {
  const collaborator = getOrganizationsByRole(2026).find(({ organization }) => organization.id === "modulabs");
  if (!collaborator) return null;

  return (
    <>
    <ul className="collaborator-overview" aria-label={collaboratorCopy.title[locale]}>
      {collaboratorOverview.map((item) => (
        <li key={item.id} className={`collaborator-overview__item${item.placeholder ? " collaborator-overview__item--placeholder" : ""}`}>
          <strong>{item.name[locale]}</strong>
          <span>{item.label[locale]}</span>
        </li>
      ))}
    </ul>
    <article className="collaborator-content" id="modulabs">
      <header className="collaborator-content__intro">
        <p className="section-label">{modulabs.category[locale]}</p>
        <h2>{collaborator.organization.name[locale]}</h2>
        {locale === "ko" && <span className="collaborator-content__english-name">MODULABS</span>}
        <p>{modulabs.summary[locale]}</p>
      </header>

      <section aria-labelledby="modulabs-welcome-title">
        <h3 id="modulabs-welcome-title">{modulabs.welcomeTitle[locale]}</h3>
        <p>{modulabs.welcomeDescription[locale]}</p>
        <div className="collaborator-course-grid">
          {modulabs.welcomeCourses.map((course) => (
            <article key={course.title.en} className="collaborator-course">
              <h4>{course.title[locale]}</h4>
              <p>{course.description[locale]}</p>
            </article>
          ))}
        </div>
        <p className="collaborator-content__note">{modulabs.courseNote[locale]}</p>
        <div className="collaborator-content__operation">
          {modulabs.operationNote[locale].split("\n\n").map((paragraph) => (
            <p key={paragraph}>
              {paragraph.split("Early Registration Welcome Benefit").map((part, index) => (
                <span key={index}>
                  {index > 0 && <mark className="collaborator-benefit-highlight">Early Registration Welcome Benefit</mark>}
                  {part}
                </span>
              ))}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="modulabs-subsidy-title">
        <div className="collaborator-subsidy-heading">
          <h3 id="modulabs-subsidy-title">{modulabs.subsidyTitle[locale]}</h3>
          <span className="collaborator-subsidy-heading__divider" aria-hidden="true" />
          <p>{modulabs.subsidyIntro[locale]}</p>
        </div>
        <div className="collaborator-course-grid">
          {modulabs.subsidyCourses.map((course) => (
            <article key={course.href} className="collaborator-course">
              <h4>{course.title[locale]}</h4>
              <p>{course.description[locale]}</p>
              <a className="text-link" href={course.href} target="_blank" rel="noopener noreferrer">
                {locale === "ko" ? "과정 안내 보기 (새 창) ↗" : "View course (new tab) ↗"}
              </a>
            </article>
          ))}
        </div>
        <p className="collaborator-content__note">{modulabs.optionalNote[locale]}</p>
      </section>
    </article>
    </>
  );
}
