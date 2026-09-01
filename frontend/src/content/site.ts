import type {
  Award,
  BulletinPost,
  Cohort,
  CohortYear,
  Organization,
  OrganizationRole,
  Person,
  PersonRole,
  Project,
  RegistrationConfig,
} from "@/domain/content";

export const CURRENT_COHORT: CohortYear = 2026;

// Production still enters through /2025/. Do not couple the published entry
// point to CURRENT_COHORT until the user approves the public launch.
export const PUBLISHED_ENTRY_COHORT: CohortYear = 2025;

export const cohorts: Cohort[] = [
  {
    year: 2026,
    title: { ko: "NASA Space Apps Seoul 2026", en: "NASA Space Apps Seoul 2026" },
    status: "PREPARING",
    isCurrent: true,
    publicMainPath: { ko: "/2026/ko/", en: "/2026/en/" },
  },
  {
    year: 2025,
    title: { ko: "NASA Space Apps Seoul 2025", en: "NASA Space Apps Seoul 2025" },
    status: "ARCHIVED",
    isCurrent: false,
    publicMainPath: { ko: "/2025/ko/index/", en: "/2025/en/index/" },
  },
];

export const registrationConfigs: RegistrationConfig[] = [
  {
    cohort: 2026,
    mode: "EXTERNAL",
    published: false,
    nasaRegistrationUrl: null,
    seoulParticipationUrl: null,
  },
];

// Phase 1 intentionally keeps unconfirmed 2026 content unpublished.
export const bulletinPosts: BulletinPost[] = [];
export const projects: Project[] = [];
export const awards: Award[] = [];
export const people: Person[] = [];
export const personRoles: PersonRole[] = [];
export const organizations: Organization[] = [];
export const organizationRoles: OrganizationRole[] = [];
