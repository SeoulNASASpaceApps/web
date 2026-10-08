import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import type { BulletinPost, Locale } from "@/domain/content";
import CohortPage from "./CohortPage";
import { cohortPath } from "./navigation";

export default function BulletinArticle({ post, locale }: { post: BulletinPost; locale: Locale }) {
  const MarkdownAnchor: Components["a"] = ({ node: _node, href, children, ...rest }) => {
    let isExternal = false;
    if (typeof href === "string" && /^https?:\/\//i.test(href)) {
      try {
        const { hostname } = new URL(href);
        isExternal = hostname !== "nasaspaceappskr.org" && !hostname.endsWith(".nasaspaceappskr.org");
      } catch {
        isExternal = false;
      }
    }

    return isExternal ? (
      <a {...rest} href={href} target="_blank" rel="noopener noreferrer">
        {children}<span className="cohort-sr-only">{locale === "ko" ? " (새 탭)" : " (opens in new tab)"}</span>
      </a>
    ) : <a {...rest} href={href}>{children}</a>;
  };

  return (
    <CohortPage
      locale={locale}
      activeSlug="bulletin"
      eyebrow={post.category}
      title={post.title[locale]}
      description=""
    >
      <article className="bulletin-article">
        <div className="bulletin-article__meta">
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          {post.updatedAt !== post.publishedAt ? (
            <span>{locale === "ko" ? `수정 ${post.updatedAt}` : `Updated ${post.updatedAt}`}</span>
          ) : null}
        </div>
        {post.thumbnail ? <Image className="bulletin-article__thumbnail" src={post.thumbnail} alt="" width={1200} height={675} priority /> : null}
        <div className="markdown-body" lang={post.contentLocale[locale]}><ReactMarkdown components={{ a: MarkdownAnchor }}>{post.body[locale]}</ReactMarkdown></div>
        <Link className="text-link bulletin-article__back" href={cohortPath(2026, locale, "bulletin")}>
          {locale === "ko" ? "공지 목록으로" : "Back to bulletin"}
        </Link>
      </article>
    </CohortPage>
  );
}
