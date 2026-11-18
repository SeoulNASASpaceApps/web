import { notFound } from "next/navigation";
import CohortPage from "@/components/cohort/CohortPage";
import JudgeProfiles, { judgePageCopy } from "@/components/cohort/JudgeProfiles";
import { isLocale } from "@/data/content";
import "../../judges.css";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = judgePageCopy[locale];

  return (
    <CohortPage
      locale={locale}
      activeSlug="judges"
      eyebrow="2026 SEOUL · JUDGES"
      title={copy.title}
      description={copy.description}
      introContent={<div className="judge-page-intro"><span>{copy.description}</span><p>{copy.thanks}</p></div>}
    >
      <JudgeProfiles locale={locale} />
    </CohortPage>
  );
}
