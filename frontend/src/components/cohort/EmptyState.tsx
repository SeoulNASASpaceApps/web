import type { Locale } from "@/domain/content";

interface EmptyStateProps {
  locale: Locale;
  title?: string;
  description?: string;
}

export default function EmptyState({ locale, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__eyebrow">TODO · CONTENT</span>
      <h2>{title ?? (locale === "ko" ? "콘텐츠 준비 중" : "Content in preparation")}</h2>
      <p>
        {description ??
          (locale === "ko"
            ? "확인된 정보가 준비되는 대로 이 페이지에 공개됩니다."
            : "Verified information will be published here when it is ready.")}
      </p>
    </div>
  );
}
