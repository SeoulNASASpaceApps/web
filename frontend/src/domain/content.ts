export const SUPPORTED_LOCALES = ["ko", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type CohortYear = 2025 | 2026;
export type LocalizedText = Record<Locale, string>;
export type ContentState = "CONFIRMED" | "COMING_SOON" | "UNPUBLISHED";

export type CohortStatus = "REGISTRATION_OPEN" | "PREPARING" | "ARCHIVED";

export interface Cohort {
  year: CohortYear;
  title: LocalizedText;
  status: CohortStatus;
  isCurrent: boolean;
  publicMainPath: Record<Locale, string>;
  officialName?: LocalizedText;
  shortName?: string;
  location?: LocalizedText;
  displayDates?: LocalizedText;
  eventStartDate?: string;
  eventEndDate?: string;
  participationFee?: LocalizedText;
  eventStatus?: "REGISTRATION_OPEN";
  eventType?: string;
  format?: LocalizedText;
  heroImage?: string | null;
}

export interface RegistrationConfig {
  cohort: CohortYear;
  mode: "EXTERNAL" | "INTERNAL";
  published: boolean;
  nasaRegistrationUrl: string | null;
  seoulParticipationUrl: string | null;
}

export interface TimelineItem {
  id: string;
  cohort: CohortYear;
  title: LocalizedText;
  displayDate: LocalizedText;
  date: string;
  state: ContentState;
}

export interface PreparationItem {
  id: string;
  cohort: CohortYear;
  title: LocalizedText;
  displayPeriod: LocalizedText;
  description: LocalizedText;
  state: ContentState;
}

export interface BannerSlot {
  id: string;
  cohort: CohortYear;
  title: LocalizedText;
  image: string | null;
  plannedFilename: string;
  displayOrder: number;
  published: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface VisualAssetSpec {
  id: string;
  cohort: CohortYear;
  filename: string;
  dimensions: string;
  aspectRatio: string;
  component: string;
  state: ContentState;
}

export interface BulletinPost {
  id: string;
  cohort: CohortYear;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  category: "REGISTRATION" | "TEAM" | "EVENT" | "SUBMISSION" | "AWARDS" | "NOTICE";
  publishedAt: string;
  updatedAt: string;
  pinned: boolean;
  published: boolean;
  thumbnail: string | null;
  body: string;
}

export interface Project {
  id: string;
  cohort: CohortYear;
  slug: string;
  projectName: string;
  teamId: string | null;
  summary: LocalizedText;
  published: boolean;
}

export interface Award {
  id: string;
  cohort: CohortYear;
  teamId: string | null;
  projectId: string | null;
  awardType: string;
  title: LocalizedText;
  published: boolean;
}

export interface Person {
  id: string;
  name: LocalizedText;
  organization: LocalizedText;
  title: LocalizedText;
  photo: string | null;
}

export type PersonRoleType =
  | "LOCAL_LEAD"
  | "CO_LEAD"
  | "ORGANIZER"
  | "JUDGE"
  | "MENTOR"
  | "ADVISOR"
  | "SME"
  | "NAVIGATOR";

export interface PersonRole {
  personId: string;
  cohort: CohortYear;
  roleType: PersonRoleType;
  published: boolean;
  displayOrder: number;
}

export interface Organization {
  id: string;
  name: LocalizedText;
  logo: string | null;
  website: string | null;
}

export type OrganizationRoleType =
  | "LOCAL_COLLABORATOR"
  | "SPONSOR"
  | "VENUE"
  | "EDUCATION"
  | "COMMUNITY"
  | "GOVERNMENT_AGENCY"
  | "OTHER";

export interface OrganizationRole {
  organizationId: string;
  cohort: CohortYear;
  type: OrganizationRoleType;
  logoUsageApproved: boolean;
  published: boolean;
  displayOrder: number;
}

// Future private User/CohortMembership records intentionally do not belong in
// this public static content domain. A future account backend can reference
// these stable public IDs without exposing participant personal information.
