import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/data/content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const destination = `/2025/${locale}/index/`;
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <div>
        <p>{locale === "ko" ? "2025 아카이브로 이동합니다." : "Opening the 2025 archive."}</p>
        <Link href={destination}>{locale === "ko" ? "계속하기" : "Continue"}</Link>
      </div>
    </main>
  );
}
