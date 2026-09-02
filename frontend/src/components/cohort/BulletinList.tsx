import { getBulletins } from "@/data/content";
import type { Locale } from "@/domain/content";
import BulletinCard from "./BulletinCard";
import CohortPage from "./CohortPage";
import EmptyState from "./EmptyState";

export default function BulletinList({ locale }: { locale: Locale }) {
  const posts = getBulletins(2026);

  return (
    <CohortPage
      locale={locale}
      activeSlug="bulletin"
      eyebrow="BULLETIN"
      title={locale === "ko" ? "공지" : "Bulletin"}
      description={
        locale === "ko"
          ? "2026 Seoul Local Event의 공식 안내입니다."
          : "Official updates for the 2026 Seoul Local Event."
      }
    >
      {posts.length ? (
        <section className="bulletin-grid" aria-label={locale === "ko" ? "공지 목록" : "Bulletin posts"}>
          {posts.map((post) => <BulletinCard key={post.id} post={post} locale={locale} />)}
        </section>
      ) : (
        <EmptyState title={locale === "ko" ? "Coming Soon" : "Updates Coming Soon"} />
      )}
    </CohortPage>
  );
}
