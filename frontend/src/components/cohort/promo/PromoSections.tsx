import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/domain/content";
import { promoContent } from "@/content/promo";
import { cohortPath } from "../navigation";
import { PromoHashtagCopy, PromoTimeline } from "../PromoInteractions";

function ExternalLink({ children, className, href, locale }: { children: ReactNode; className?: string; href: string; locale: Locale }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
      <span className="promo-sr-only"> {promoContent.ui.newTabHint[locale]}</span>
    </a>
  );
}

export function PromoInvitation({ locale }: { locale: Locale }) {
  const section = promoContent.invitation;
  return (
    <section className="invitation section-wrap" aria-labelledby="invitation-title">
      <div className="section-heading">
        <p className="section-kicker">{section.kicker[locale]}</p>
        <h2 id="invitation-title">{section.title[locale]}</h2>
      </div>
      <div className="invitation-copy">
        <p>{section.description[locale]}</p>
        <p className="community-note">{section.communityNote[locale]}</p>
        <Link className="text-link" href={`/2025/${locale}/awardees/`}>{section.awardeesLink[locale]} <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}

export function PromoJoin({ locale }: { locale: Locale }) {
  const section = promoContent.join;
  return (
    <section className="join" id="join" aria-labelledby="join-title">
      <div className="section-wrap">
        <p className="section-kicker">{section.kicker[locale]}</p>
        <h2 id="join-title">{section.title[locale]}</h2>
        <ol className="steps">
          {section.steps.map((step, index) => (
            <li key={step.title.en}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title[locale]}</h3>
                <p>{step.description[locale]}</p>
                {"link" in step ? step.link.external ? (
                  <ExternalLink className="text-link" href={step.link.url} locale={locale}>{step.link.label[locale]}</ExternalLink>
                ) : (
                  <a className="text-link" href={step.link.url}>{step.link.label[locale]} <span aria-hidden="true">↑</span></a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="join-note">{section.note[locale]}</p>
      </div>
    </section>
  );
}

export function PromoSchedule({ locale }: { locale: Locale }) {
  const section = promoContent.timeline;
  return (
    <section className="schedule section-wrap" id="schedule" aria-labelledby="schedule-title">
      <div data-promo-reveal>
        <p className="section-kicker">{section.kicker[locale]}</p>
        <h2 id="schedule-title">{section.title[locale]}</h2>
        <p className="section-description">{section.description[locale]}</p>
        <Link className="text-link" href={cohortPath(2026, locale, "bulletin")}>{section.bulletinLink[locale]} <span aria-hidden="true">→</span></Link>
      </div>
      <PromoTimeline items={section.items} locale={locale} pastSuffix={section.pastSuffix} />
    </section>
  );
}

export function PromoGlobalStage({ locale }: { locale: Locale }) {
  const section = promoContent.globalStage;
  return (
    <section className="global-stage" aria-labelledby="global-title">
      <div className="section-wrap" data-promo-reveal>
        <p className="section-kicker">{section.kicker[locale]}</p>
        <h2 id="global-title">{section.title[locale]}</h2>
        <p className="global-description">{section.description[locale]}</p>
        <dl className="results">
          {section.stats.map((stat) => <div key={stat.label.en}><dt>{"emphasis" in stat && stat.emphasis ? <strong>{stat.label[locale]}</strong> : stat.label[locale]}</dt><dd>{stat.value}<span>{stat.unit[locale]}</span></dd></div>)}
        </dl>
        <p className="source-note">
          {section.source[locale]}{" · "}
          <ExternalLink href={promoContent.links.nasaSeoul} locale={locale}>{section.officialSeoul[locale]}</ExternalLink>
        </p>
        <div className="global-links">
          <Link href={cohortPath(2026, locale, "team")}>{section.teamLink[locale]} <span aria-hidden="true">→</span></Link>
          <Link href={cohortPath(2026, locale, "partners")}>{section.partnersLink[locale]} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}

export function PromoFaq({ locale }: { locale: Locale }) {
  const section = promoContent.faq;
  return (
    <section className="faq section-wrap" aria-labelledby="faq-title">
      <div data-promo-reveal><p className="section-kicker">{section.kicker[locale]}</p><h2 id="faq-title">{section.title[locale]}</h2></div>
      <div className="faq-list">
        {section.items.map((item) => (
          <details key={item.question.en}>
            <summary>{item.question[locale]}<span aria-hidden="true">+</span></summary>
            <p>{item.answer[locale]}</p>
            {"link" in item ? <Link className="text-link" href={cohortPath(2026, locale, "bulletin")}>{item.link[locale]} <span aria-hidden="true">→</span></Link> : null}
          </details>
        ))}
      </div>
    </section>
  );
}

export function PromoClosing({ locale }: { locale: Locale }) {
  const section = promoContent.closing;
  return (
    <section className="closing section-wrap" aria-labelledby="closing-title" data-promo-reveal>
      <div><p className="section-kicker">{section.kicker[locale]}</p><h2 id="closing-title">{section.title[locale]}</h2></div>
      <ExternalLink className="primary-link" href={section.ctaUrl} locale={locale}>{section.cta[locale]}</ExternalLink>
    </section>
  );
}

export function PromoConnect({ locale }: { locale: Locale }) {
  const section = promoContent.connect;
  return (
    <section className="connect" id="connect" aria-labelledby="connect-title">
      <div className="section-wrap">
        <p className="section-kicker">{section.kicker[locale]}</p>
        <div className="connect-heading">
          <h2 id="connect-title">{section.title[locale]}</h2>
          <div><p>{section.description[locale]}</p><a className="email-link" href={`mailto:${section.email}`}>{section.email}</a></div>
        </div>
        <div className="channel-links">
          {section.channels.map((channel) => (
            <a href={channel.url} target="_blank" rel="noopener noreferrer" key={channel.url}>
              <small>{channel.label[locale]}</small><strong>{channel.strong[locale]}</strong><span aria-hidden="true">↗</span>
              <span className="promo-sr-only"> {promoContent.ui.newTabHint[locale]}</span>
            </a>
          ))}
        </div>
        <PromoHashtagCopy
          copyFailure={section.copyFailure}
          copyLabel={section.copyButton}
          copySuccess={section.copySuccess}
          hashtags={section.hashtags}
          locale={locale}
        />
      </div>
    </section>
  );
}
