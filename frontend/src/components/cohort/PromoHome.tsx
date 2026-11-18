import Link from "next/link";
import { collaboratorCopy, collaboratorOverview } from "@/content/collaborators";
import { promoContent } from "@/content/promo";
import { getBulletins } from "@/data/content";
import type { Locale } from "@/domain/content";
import BulletinCard from "./BulletinCard";
import EmptyState from "./EmptyState";
import PromoInteractions from "./PromoInteractions";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { cohortPath } from "./navigation";
import PromoChallenges from "./promo/PromoChallenges";
import PromoHero from "./promo/PromoHero";
import {
  PromoClosing,
  PromoConnect,
  PromoFaq,
  PromoGlobalStage,
  PromoInvitation,
  PromoJoin,
  PromoSchedule,
} from "./promo/PromoSections";

export default function PromoHome({ locale }: { locale: Locale }) {
  const bulletins = getBulletins(2026).slice(0, 3);
  const collaborators = collaboratorOverview.filter((item) => !item.placeholder);
  const ui = promoContent.ui;

  return (
    <div className="cohort-site promo-home" lang={locale}>
      <a className="promo-skip-link" href="#promo-main">{ui.skipLink[locale]}</a>
      <SiteHeader year={2026} locale={locale} activeSlug="" />
      <nav className="section-nav" aria-label={promoContent.nav.ariaLabel[locale]}>
        <div className="nav-inner">
          {promoContent.nav.items.map((item) => (
            <a href={`#${item.id}`} key={item.id}>{item.label[locale]}{"count" in item ? <span>{item.count}</span> : null}</a>
          ))}
        </div>
        <div className="reading-progress" aria-hidden="true" />
      </nav>
      <main className="promo-main" id="promo-main">
        <section className="celebration-notice section-wrap" aria-labelledby="celebration-title">
          <p className="celebration-kicker">{promoContent.celebration.kicker[locale]}</p>
          <div className="celebration-grid">
            <div>
              <h2 id="celebration-title">{promoContent.celebration.title[locale]}</h2>
              <p className="celebration-description">{promoContent.celebration.description[locale]}</p>
              <p className="celebration-program">{promoContent.celebration.program[locale]}</p>
            </div>
            <div className="celebration-details">
              <p className="celebration-time">{promoContent.celebration.time[locale]}</p>
              <p className="celebration-place"><time dateTime="2026-11-29T14:00:00+09:00">{promoContent.celebration.date[locale]}</time><br />{promoContent.celebration.venue}</p>
            </div>
          </div>
          <div className="celebration-footer">
            <p className="celebration-email">{promoContent.celebration.email[locale]}</p>
            <Link className="celebration-link" href={cohortPath(2026, locale, `bulletin/${promoContent.celebration.slug}`)}>
              {promoContent.celebration.link[locale]} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <aside className="event-notice judging-notice section-wrap" aria-labelledby="event-notice-title">
          <div className="judging-status"><span className="judging-dot" aria-hidden="true" />{promoContent.notice.status[locale]}</div>
          <h2 id="event-notice-title">{promoContent.notice.title[locale]}</h2>
          <p>{promoContent.notice.encouragement[locale]}<br />{promoContent.notice.description[locale]}</p>
          <p className="judging-closing">{promoContent.notice.closing[locale]}</p>
        </aside>
        <PromoHero locale={locale} />
        <PromoInvitation locale={locale} />
        <PromoChallenges locale={locale} />
        <PromoJoin locale={locale} />
        <PromoSchedule locale={locale} />
        <PromoGlobalStage locale={locale} />
        <PromoFaq locale={locale} />
        <PromoClosing locale={locale} />
        <PromoConnect locale={locale} />

        <div className="promo-cohort-sections section-wrap">
          <section className="cohort-section">
            <div className="section-heading section-heading--inline">
              <div><p className="section-label">{ui.latestKicker[locale]}</p><h2>{ui.latestTitle[locale]}</h2></div>
              <Link href={cohortPath(2026, locale, "bulletin")}>{ui.viewAll[locale]}</Link>
            </div>
            {bulletins.length ? (
              <div className="bulletin-grid bulletin-grid--latest">
                {bulletins.map((post) => <BulletinCard key={post.id} post={post} locale={locale} />)}
              </div>
            ) : <EmptyState title={locale === "ko" ? "Coming Soon" : "Updates Coming Soon"} />}
          </section>

          <section className="cohort-section two-column-section promo-collaborators">
            <div>
              <p className="section-label">{ui.collaboratorKicker[locale]}</p>
              <h2>{collaboratorCopy.title[locale]}</h2>
              <p>{collaboratorCopy.description[locale]}</p>
              <ul className="collaborator-overview promo-collaborator-list" aria-label={collaboratorCopy.title[locale]}>
                {collaborators.map((item) => (
                  <li className="collaborator-overview__item" key={item.id}>
                    <strong>{item.name[locale]}</strong>
                    <span>
                      {item.label[locale]}
                      {item.id === "modulabs" ? " · Welcome Benefit" : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="text-link promo-collaborator-link" href={cohortPath(2026, locale, "partners")}>{ui.collaboratorLink[locale]} <span aria-hidden="true">→</span></Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} />
      <PromoInteractions />
    </div>
  );
}
