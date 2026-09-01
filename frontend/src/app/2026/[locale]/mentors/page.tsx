import { notFound } from "next/navigation";
import ArchiveSkeleton from "@/components/cohort/ArchiveSkeleton";
import { isLocale } from "@/data/content";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <ArchiveSkeleton slug="mentors" locale={locale} />; }
