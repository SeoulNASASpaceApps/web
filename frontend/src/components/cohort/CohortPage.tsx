import type { ReactNode } from "react";
import type { Locale } from "@/domain/content";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

interface CohortPageProps {
  locale: Locale;
  activeSlug?: string;
  eyebrow: string;
  title: string;
  description: string;
  introMeta?: string;
  children: ReactNode;
}

export default function CohortPage({
  locale,
  activeSlug,
  eyebrow,
  title,
  description,
  introMeta,
  children,
}: CohortPageProps) {
  return (
    <div className="cohort-site" lang={locale}>
      <SiteHeader year={2026} locale={locale} activeSlug={activeSlug} />
      <main className="cohort-main">
        <header className="page-intro">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          {introMeta ? <strong className="page-intro__meta">{introMeta}</strong> : null}
          <span>{description}</span>
        </header>
        {children}
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
