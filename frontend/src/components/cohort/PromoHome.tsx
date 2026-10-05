import Link from "next/link";
import { collaboratorCopy, modulabs } from "@/content/collaborators";
import { promoContent } from "@/content/promo";
import { getBulletins, getOrganizationsByRole } from "@/data/content";
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
  const collaborators = getOrganizationsByRole(2026);
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
              {collaborators.map(({ organization }) => (
                <div key={organization.id}>
                  <h3>{organization.name[locale]}</h3>
                  <p>{modulabs.category[locale]} · {modulabs.welcomeTitle[locale]}</p>
                  <Link className="text-link" href={cohortPath(2026, locale, "partners")}>{ui.collaboratorLink[locale]} <span aria-hidden="true">→</span></Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} />
      <PromoInteractions />
    </div>
  );
}
