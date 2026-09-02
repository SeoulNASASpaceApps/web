import type {
  Award,
  BannerSlot,
  Cohort,
  CohortYear,
  Organization,
  OrganizationRole,
  Person,
  PersonRole,
  Project,
  RegistrationConfig,
  PreparationItem,
  TimelineItem,
  VisualAssetSpec,
} from "@/domain/content";

export const CURRENT_COHORT: CohortYear = 2026;

// Production still enters through /2025/. Do not couple the published entry
// point to CURRENT_COHORT until the user approves the public launch.
export const PUBLISHED_ENTRY_COHORT: CohortYear = 2025;

export const cohorts: Cohort[] = [
  {
    year: 2026,
    title: { ko: "NASA Space Apps Seoul 2026", en: "NASA Space Apps Seoul 2026" },
    status: "REGISTRATION_OPEN",
    isCurrent: true,
    publicMainPath: { ko: "/2026/ko/", en: "/2026/en/" },
    officialName: {
      ko: "2026 NASA International Space Apps Challenge Seoul",
      en: "NASA International Space Apps Challenge Seoul 2026",
    },
    shortName: "NASA Space Apps Seoul 2026",
    location: { ko: "서울, 대한민국", en: "Seoul, Republic of Korea" },
    displayDates: {
      ko: "2026년 11월 14일–15일",
      en: "November 14–15, 2026",
    },
    eventStartDate: "2026-11-14",
    eventEndDate: "2026-11-15",
    participationFee: { ko: "무료", en: "Free" },
    eventStatus: "REGISTRATION_OPEN",
    eventType: "NASA International Space Apps Challenge Local Event",
    format: {
      ko: "온라인 중심 + 일부 오프라인 프로그램",
      en: "Virtual + Selected Offline Programs",
    },
    heroImage: null,
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
    published: true,
    nasaRegistrationUrl: null,
    seoulParticipationUrl: null,
  },
];

export const timelineItems: TimelineItem[] = [
  { id: "registration-opens", cohort: 2026, title: { ko: "참가 등록 시작", en: "Registration Opens" }, displayDate: { ko: "2026.08.26", en: "August 26, 2026" }, date: "2026-08-26", state: "CONFIRMED" },
  { id: "challenge-summaries", cohort: 2026, title: { ko: "Challenge Summary 공개", en: "Challenge Summaries" }, displayDate: { ko: "2026.09.17", en: "September 17, 2026" }, date: "2026-09-17", state: "CONFIRMED" },
  { id: "challenge-statements", cohort: 2026, title: { ko: "Challenge Statement 공개", en: "Challenge Statements" }, displayDate: { ko: "2026.10.28", en: "October 28, 2026" }, date: "2026-10-28", state: "CONFIRMED" },
  { id: "space-apps-connect", cohort: 2026, title: { ko: "NASA Space Apps Connect", en: "NASA Space Apps Connect" }, displayDate: { ko: "2026.11.03", en: "November 3, 2026" }, date: "2026-11-03", state: "CONFIRMED" },
  { id: "hackathon-weekend", cohort: 2026, title: { ko: "Hackathon Weekend", en: "Hackathon Weekend" }, displayDate: { ko: "2026.11.14–15", en: "November 14–15, 2026" }, date: "2026-11-14", state: "CONFIRMED" },
  { id: "local-nominees", cohort: 2026, title: { ko: "Local Nominee", en: "Local Nominees" }, displayDate: { ko: "2026.12.02", en: "December 2, 2026" }, date: "2026-12-02", state: "CONFIRMED" },
];

export const preparationItems: PreparationItem[] = [
  {
    id: "alumni-priority-access",
    cohort: 2026,
    title: { ko: "Alumni Priority Access", en: "Alumni Priority Access" },
    displayPeriod: { ko: "2026.08.26–31", en: "August 26–31, 2026" },
    description: { ko: "Alumni Priority Access 기간입니다.", en: "Priority access period for alumni." },
    state: "CONFIRMED",
  },
  {
    id: "early-registration-benefits",
    cohort: 2026,
    title: { ko: "Early Registration Welcome Benefits", en: "Early Registration Welcome Benefits" },
    displayPeriod: { ko: "2026.09.30까지", en: "Through September 30, 2026" },
    description: {
      ko: "9월 30일까지 일찍 등록하고 사전 교육과 참가 준비 혜택을 먼저 만나보세요.",
      en: "Register early through September 30 for participant preparation and welcome benefits.",
    },
    state: "CONFIRMED",
  },
  {
    id: "catch-up-welcome-benefits",
    cohort: 2026,
    title: { ko: "Catch-up Welcome Benefits", en: "Catch-up Welcome Benefits" },
    displayPeriod: { ko: "2026.10.01–15", en: "October 1–15, 2026" },
    description: {
      ko: "10월 15일까지 팀에 합류하고 Catch-up 웰컴 혜택과 함께 본격적인 Challenge 준비를 시작하세요.",
      en: "Join your team by October 15 to access the Catch-up Welcome Benefits and get ready for the next stage of the challenge.",
    },
    state: "CONFIRMED",
  },
];

export const bannerSlots: BannerSlot[] = [
  { id: "registration", cohort: 2026, title: { ko: "Registration / Join Seoul", en: "Registration / Join Seoul" }, image: null, plannedFilename: "2026-banner-registration.webp", displayOrder: 1, published: false, startDate: null, endDate: null },
  { id: "welcome-benefits", cohort: 2026, title: { ko: "Welcome Benefits / Participant Preparation", en: "Welcome Benefits / Participant Preparation" }, image: null, plannedFilename: "2026-banner-welcome-benefits.webp", displayOrder: 2, published: false, startDate: null, endDate: null },
  { id: "team-formation", cohort: 2026, title: { ko: "Challenge & Team Formation", en: "Challenge & Team Formation" }, image: null, plannedFilename: "2026-banner-team-formation.webp", displayOrder: 3, published: false, startDate: null, endDate: null },
  { id: "hackathon", cohort: 2026, title: { ko: "Hackathon Weekend", en: "Hackathon Weekend" }, image: null, plannedFilename: "2026-banner-hackathon.webp", displayOrder: 4, published: false, startDate: null, endDate: null },
  { id: "celebration", cohort: 2026, title: { ko: "Celebration / Awards / Networking", en: "Celebration / Awards / Networking" }, image: null, plannedFilename: "2026-banner-celebration.webp", displayOrder: 5, published: false, startDate: null, endDate: null },
];

export const visualAssetSpecs: VisualAssetSpec[] = [
  { id: "hero", cohort: 2026, filename: "2026-hero-seoul.webp", dimensions: "2400 × 1350", aspectRatio: "16:9", component: "CohortHome hero visual", state: "COMING_SOON" },
  { id: "cohort-cover", cohort: 2026, filename: "2026-cohort-cover.webp", dimensions: "1600 × 900", aspectRatio: "16:9", component: "Cohort selector and archive preview", state: "COMING_SOON" },
  { id: "og-default", cohort: 2026, filename: "2026-og-default.jpg", dimensions: "1200 × 630", aspectRatio: "1.91:1", component: "2026 Open Graph metadata", state: "COMING_SOON" },
  ...bannerSlots.map((slot) => ({
    id: `banner-${slot.id}`,
    cohort: 2026 as const,
    filename: slot.plannedFilename,
    dimensions: "1920 × 720",
    aspectRatio: "8:3",
    component: "BannerSlider",
    state: "COMING_SOON" as const,
  })),
];

// Phase 1 intentionally keeps unconfirmed 2026 content unpublished.
export const projects: Project[] = [];
export const awards: Award[] = [];
export const people: Person[] = [];
export const personRoles: PersonRole[] = [];
export const organizations: Organization[] = [];
export const organizationRoles: OrganizationRole[] = [];
