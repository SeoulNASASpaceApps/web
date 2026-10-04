import { notFound } from "next/navigation";
import PromoHome from "@/components/cohort/PromoHome";
import { isLocale } from "@/data/content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PromoHome locale={locale} />;
}
