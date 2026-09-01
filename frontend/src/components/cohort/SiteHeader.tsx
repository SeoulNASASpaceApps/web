import Image from "next/image";
import Link from "next/link";
import { cohorts } from "@/content/site";
import type { Locale } from "@/domain/content";
import { cohortPath, pageNavigation } from "./navigation";

interface SiteHeaderProps {
  year: 2026;
  locale: Locale;
  activeSlug?: string;
}

export default function SiteHeader({ year, locale, activeSlug = "" }: SiteHeaderProps) {
  const otherLocale: Locale = locale === "ko" ? "en" : "ko";

  return (
    <header className="cohort-header">
      <div className="cohort-header__inner">
        <Link className="cohort-brand" href={cohortPath(year, locale)}>
          <Image src="/images/logo/logo.svg" alt="NASA Space Apps" width={72} height={63} priority />
          <span>SEOUL</span>
        </Link>

        <nav className="cohort-nav" aria-label={locale === "ko" ? "주요 메뉴" : "Primary navigation"}>
          {pageNavigation.map((item) => (
            <Link
              key={item.slug}
              href={cohortPath(year, locale, item.slug)}
              aria-current={activeSlug === item.slug ? "page" : undefined}
            >
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        <div className="cohort-tools">
          <details className="cohort-switcher">
            <summary>{year} <span aria-hidden="true">⌄</span></summary>
            <div className="cohort-switcher__menu">
              {cohorts.map((cohort) => (
                <Link key={cohort.year} href={cohort.publicMainPath[locale]}>
                  <span>{cohort.year}</span>
                  <small>
                    {cohort.isCurrent
                      ? locale === "ko" ? "현재 준비 중" : "Current · preparing"
                      : locale === "ko" ? "지난 행사" : "Past cohort"}
                  </small>
                </Link>
              ))}
            </div>
          </details>
          <Link className="language-link" href={cohortPath(year, otherLocale)} lang={otherLocale}>
            {otherLocale.toUpperCase()}
          </Link>
        </div>

        <details className="mobile-navigation">
          <summary aria-label={locale === "ko" ? "메뉴 열기" : "Open menu"}>☰</summary>
          <nav aria-label={locale === "ko" ? "모바일 메뉴" : "Mobile navigation"}>
            {pageNavigation.map((item) => (
              <Link key={item.slug} href={cohortPath(year, locale, item.slug)}>
                {item.label[locale]}
              </Link>
            ))}
            <div className="mobile-navigation__tools">
              <Link href={cohortPath(year, otherLocale)}>{otherLocale.toUpperCase()}</Link>
              {cohorts.map((cohort) => (
                <Link key={cohort.year} href={cohort.publicMainPath[locale]}>{cohort.year}</Link>
              ))}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
