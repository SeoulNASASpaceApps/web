import { notFound } from "next/navigation";
import BulletinList from "@/components/cohort/BulletinList";
import { isLocale } from "@/data/content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <BulletinList locale={locale} />;
}
