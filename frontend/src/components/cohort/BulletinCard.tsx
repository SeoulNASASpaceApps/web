import Image from "next/image";
import Link from "next/link";
import type { BulletinPost, Locale } from "@/domain/content";
import { cohortPath } from "./navigation";

function displayDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: locale === "ko" ? "numeric" : "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function BulletinCard({ post, locale }: { post: BulletinPost; locale: Locale }) {
  return (
    <article className="bulletin-card">
      {post.thumbnail ? (
        <div className="bulletin-card__image">
          <Image src={post.thumbnail} alt="" width={800} height={450} />
        </div>
      ) : null}
      <div className="bulletin-card__body">
        <div className="bulletin-card__meta">
          <span>{post.category}</span>
          <time dateTime={post.publishedAt}>{displayDate(post.publishedAt, locale)}</time>
          {post.pinned ? <strong>{locale === "ko" ? "고정" : "Pinned"}</strong> : null}
        </div>
        <h3>
          <Link href={`${cohortPath(2026, locale, "bulletin")}${post.slug}/`}>{post.title[locale]}</Link>
        </h3>
      </div>
    </article>
  );
}
