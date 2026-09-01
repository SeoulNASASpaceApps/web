import type { Locale } from "@/domain/content";

export const pageNavigation = [
  { slug: "", label: { ko: "홈", en: "Home" } },
  { slug: "bulletin", label: { ko: "공지", en: "Bulletin" } },
  { slug: "hall-of-fame", label: { ko: "명예의 전당", en: "Hall of Fame" } },
  { slug: "projects", label: { ko: "프로젝트", en: "Projects" } },
  { slug: "judges", label: { ko: "심사위원", en: "Judges" } },
  { slug: "partners", label: { ko: "파트너", en: "Partners" } },
  { slug: "team", label: { ko: "운영팀", en: "Team" } },
  { slug: "mentors", label: { ko: "멘토", en: "Mentors" } },
] as const;

export function cohortPath(year: number, locale: Locale, slug = "") {
  return `/${year}/${locale}/${slug ? `${slug}/` : ""}`;
}
