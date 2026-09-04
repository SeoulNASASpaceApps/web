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

function TeamEditorial({ locale }: { locale: Locale }) {
  return locale === "ko" ? (
    <div className="page-intro__editorial">
      <strong>참가자에서 운영진으로, 다시 다음 참가자에게</strong>
      <p>NASA Space Apps Seoul은 한 번의 해커톤으로 끝나는 행사가 아니라, 참가 경험이 다음 기회로 이어지는 커뮤니티를 만들어가고 있습니다.</p>
      <p>운영팀에는 이전 NASA Space Apps 참가 경험을 가진 Alumni가 함께합니다. 참가자로 시작해 다음 해에는 운영진과 멘토로 참여하고, 자신의 경험과 네트워크를 다시 새로운 참가자들과 나누는 선순환 구조를 만들어가고 있습니다.</p>
      <p>서울 지역 행사는 운영진의 재능기부 형태의 자원봉사와 지역 기업·기관의 후원 및 협력을 바탕으로 운영됩니다.</p>
      <p>매년 새로운 참가자가 들어오고, 그중 누군가는 다시 커뮤니티를 만드는 사람이 되는 것.</p>
      <p>Space Apps Seoul은 사람과 경험, 기회가 계속 이어지는 커뮤니티를 만들어가고자 합니다.</p>
    </div>
  ) : (
    <div className="page-intro__editorial">
      <strong>From participants to organizers, and onward to the next participants</strong>
      <p>NASA Space Apps Seoul is more than a one-time hackathon. We are building a community where the participant experience leads to new opportunities.</p>
      <p>Our organizing team includes alumni with prior NASA Space Apps experience. Participants return in following years as organizers and mentors, sharing their experience and networks with new participants and continuing this cycle.</p>
      <p>The Seoul Local Event is made possible by the organizing team&apos;s volunteer contributions and the support and collaboration of local companies and institutions.</p>
      <p>Each year brings new participants, and some of them return to become the people who build the community.</p>
      <p>Space Apps Seoul seeks to create a community where people, experiences, and opportunities continue to connect.</p>
    </div>
  );
}

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
      introContent={slug === "team" ? <TeamEditorial locale={locale} /> : undefined}
    >
      <EmptyState title={empty.title} description={empty.description} />
    </CohortPage>
  );
}
