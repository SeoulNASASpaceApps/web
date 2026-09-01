import { notFound } from "next/navigation";
import CohortHome from "@/components/cohort/CohortHome";
import { isLocale } from "@/data/content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CohortHome locale={locale} />;
}
