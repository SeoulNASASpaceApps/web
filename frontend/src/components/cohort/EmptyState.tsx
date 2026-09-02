interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__eyebrow">COMING SOON</span>
      <h2>{title ?? "Coming Soon"}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
