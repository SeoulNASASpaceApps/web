import EmptyState from "./EmptyState";
import CohortPage from "./CohortPage";
import type { Locale } from "@/domain/content";

const pageCopy = {
  bulletin: {
    ko: ["BULLETIN", "공지", "2026 Seoul Local Event의 공식 안내를 연도별로 관리합니다."],
    en: ["BULLETIN", "Bulletin", "Official updates for the 2026 Seoul Local Event will be organized here."],
  },
  "hall-of-fame": {
    ko: ["HALL OF FAME", "명예의 전당", "Seoul Local Event의 수상 기록을 프로젝트와 연결해 축적합니다."],
    en: ["HALL OF FAME", "Hall of Fame", "Seoul award records will be connected to their projects and cohorts."],
  },
  projects: {
    ko: ["PROJECT ARCHIVE", "프로젝트", "공개가 승인된 참가 프로젝트를 cohort별로 축적합니다."],
    en: ["PROJECT ARCHIVE", "Projects", "Published participant projects will be archived by cohort."],
  },
  judges: {
    ko: ["JUDGES", "심사위원", "확정되고 공개가 승인된 2026 심사위원 정보를 제공합니다."],
    en: ["JUDGES", "Judges", "Confirmed and approved 2026 judge information will appear here."],
  },
  partners: {
    ko: ["PARTNERS", "파트너", "기관별 공식 관계와 로고 사용 승인을 구분해 관리합니다."],
    en: ["PARTNERS", "Partners", "Official relationship types and logo approvals will be managed separately."],
  },
  team: {
    ko: ["ORGANIZING TEAM", "운영팀", "확정되고 공개가 승인된 Seoul 운영 역할을 안내합니다."],
    en: ["ORGANIZING TEAM", "Team", "Confirmed and approved Seoul organizing roles will appear here."],
  },
  mentors: {
    ko: ["MENTORS", "멘토", "Local Mentor와 NASA Global 역할을 구분해 안내합니다."],
    en: ["MENTORS", "Mentors", "Local Mentors will remain distinct from NASA Global roles."],
  },
} as const;

export type ArchiveSlug = keyof typeof pageCopy;

export default function ArchiveSkeleton({ slug, locale }: { slug: ArchiveSlug; locale: Locale }) {
  const [eyebrow, title, description] = pageCopy[slug][locale];
  const emptyCopy = {
    bulletin: {
      ko: { title: "Coming Soon", description: undefined },
      en: { title: "Updates Coming Soon", description: undefined },
    },
    "hall-of-fame": {
      ko: { title: "Coming Soon", description: "2026 수상 결과는 행사 종료 후 공개됩니다." },
      en: { title: "Coming Soon", description: "2026 results will be announced after the event." },
    },
    projects: {
      ko: { title: "Coming Soon", description: "2026 프로젝트는 해커톤 이후 공개됩니다." },
      en: { title: "Coming Soon", description: "2026 projects will be published after the hackathon." },
    },
    judges: { ko: { title: "Coming Soon", description: undefined }, en: { title: "Coming Soon", description: undefined } },
    partners: { ko: { title: "Coming Soon", description: undefined }, en: { title: "Coming Soon", description: undefined } },
    team: { ko: { title: "Coming Soon", description: undefined }, en: { title: "Coming Soon", description: undefined } },
    mentors: { ko: { title: "Coming Soon", description: undefined }, en: { title: "Coming Soon", description: undefined } },
  } as const;
  const empty = emptyCopy[slug][locale];

  return (
    <CohortPage
      locale={locale}
      activeSlug={slug}
      eyebrow={eyebrow}
      title={title}
      description={description}
    >
      <EmptyState title={empty.title} description={empty.description} />
    </CohortPage>
  );
}
