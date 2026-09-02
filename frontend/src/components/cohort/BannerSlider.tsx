import Image from "next/image";
import { getPublishedBanners } from "@/data/content";
import type { Locale } from "@/domain/content";

export default function BannerSlider({ locale }: { locale: Locale }) {
  const banners = getPublishedBanners(2026);
  if (!banners.length) return null;

  return (
    <section className="banner-slider" aria-label={locale === "ko" ? "주요 안내" : "Featured updates"}>
      {banners.map((banner) => (
        <article key={banner.id}>
          {banner.image ? <Image src={banner.image} alt="" width={1920} height={720} /> : null}
          <h2>{banner.title[locale]}</h2>
        </article>
      ))}
    </section>
  );
}
