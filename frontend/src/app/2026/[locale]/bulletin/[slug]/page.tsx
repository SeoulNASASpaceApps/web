import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BulletinArticle from "@/components/cohort/BulletinArticle";
import { getPublishedBulletin, getPublishedBulletins } from "@/data/bulletins";
import { isLocale } from "@/data/content";
import { SUPPORTED_LOCALES } from "@/domain/content";

export const dynamicParams = false;
const EMPTY_BULLETIN_SLUG = "__no-public-bulletins";

export function generateStaticParams() {
  const posts = getPublishedBulletins(2026);
  return (posts.length ? posts.map((post) => post.slug) : [EMPTY_BULLETIN_SLUG]).flatMap((slug) =>
    SUPPORTED_LOCALES.map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getPublishedBulletin(2026, slug);
  return post ? { title: post.title[locale] } : {};
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPublishedBulletin(2026, slug);
  if (!post) notFound();
  return <BulletinArticle post={post} locale={locale} />;
}
