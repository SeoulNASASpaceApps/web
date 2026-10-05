import Image from "next/image";
import type { Locale } from "@/domain/content";
import { promoContent } from "@/content/promo";
import PromoCountdown from "../PromoCountdown";

const posterPng = "/images/2026/promo/seoul-2026-poster.png";

export default function PromoHero({ locale }: { locale: Locale }) {
  const { hero, facts } = promoContent;
  const newTabHint = promoContent.ui.newTabHint[locale];

  return (
    <>
      <section className="hero" aria-labelledby="promo-hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="red-dot" aria-hidden="true" />{hero.eyebrow[locale]}</p>
          <p className="hero-theme">{hero.theme[locale]}</p>
          <h1 id="promo-hero-title">
            <span>{hero.titleLines[0][locale]}</span>
            <span>{hero.titleLines[1][locale]}</span>
            <em>{hero.titleLines[2][locale]}</em>
          </h1>
          <p className="hero-lead">{hero.lead[locale]}</p>
          <p className="hero-description">{hero.description[locale]}</p>
          <a className="primary-link" href="#join">{hero.cta[locale]} <span aria-hidden="true">↓</span></a>
          <p className="hero-note">{hero.note[locale]}</p>
          <PromoCountdown locale={locale} />
          <a className="scroll-cue" href="#challenges">{hero.scrollCue[locale]} <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="hero-visual">
          <a href={posterPng} target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/2026/promo/seoul-2026-poster.webp"
              alt={hero.posterAlt[locale]}
              width={1122}
              height={1402}
              sizes="(max-width: 900px) 90vw, 520px"
              priority
            />
            <span className="promo-sr-only"> {newTabHint}</span>
          </a>
          <figcaption>
            <a href={posterPng} target="_blank" rel="noopener noreferrer">
              {hero.posterLabel[locale]} <span aria-hidden="true">↗</span>
              <span className="promo-sr-only"> {newTabHint}</span>
            </a>
          </figcaption>
        </figure>
      </section>
      <section className="facts" aria-label={facts.ariaLabel[locale]}>
        <dl>
          {facts.items.map((item) => <div key={item.label.en}><dt>{item.label[locale]}</dt><dd>{item.value[locale]}</dd></div>)}
        </dl>
      </section>
    </>
  );
}
