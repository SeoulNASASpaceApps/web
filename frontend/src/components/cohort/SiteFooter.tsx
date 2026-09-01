import Link from "next/link";
import type { Locale } from "@/domain/content";

export default function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="cohort-footer">
      <div>
        <p className="cohort-footer__brand">NASA Space Apps Seoul</p>
        <p>
          {locale === "ko"
            ? "NASA International Space Apps Challenge의 Seoul Local Event 공개 웹사이트입니다."
            : "The public website for the Seoul Local Event of the NASA International Space Apps Challenge."}
        </p>
      </div>
      <nav aria-label={locale === "ko" ? "외부 링크" : "External links"}>
        <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noopener noreferrer">
          Official NASA Space Apps Website
        </a>
        <a href="https://www.instagram.com/nasaspaceapps_seoul/" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href="https://github.com/SeoulNASASpaceApps/web" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <Link href={`/2025/${locale}/contact/`}>Contact</Link>
      </nav>
    </footer>
  );
}
