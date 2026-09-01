import { SUPPORTED_LOCALES } from "@/domain/content";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
