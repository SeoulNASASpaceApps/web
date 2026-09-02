import {
  awards,
  bannerSlots,
  cohorts,
  organizationRoles,
  organizations,
  people,
  personRoles,
  preparationItems,
  projects,
  registrationConfigs,
  timelineItems,
  visualAssetSpecs,
} from "@/content/site";
import type {
  CohortYear,
  Locale,
  OrganizationRoleType,
  PersonRoleType,
} from "@/domain/content";
import { getPublishedBulletins } from "./bulletins";

export function isLocale(value: string): value is Locale {
  return value === "ko" || value === "en";
}

export function getCohort(year: CohortYear) {
  return cohorts.find((cohort) => cohort.year === year);
}

export function getRegistrationConfig(year: CohortYear) {
  return registrationConfigs.find((config) => config.cohort === year);
}

export function getTimeline(year: CohortYear) {
  return timelineItems.filter((item) => item.cohort === year && item.state === "CONFIRMED");
}

export function getPreparationItems(year: CohortYear) {
  return preparationItems.filter((item) => item.cohort === year && item.state !== "UNPUBLISHED");
}

export function getPublishedBanners(year: CohortYear) {
  return bannerSlots
    .filter((banner) => banner.cohort === year && banner.published && banner.image)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 5);
}

export function getVisualAssetSpecs(year: CohortYear) {
  return visualAssetSpecs.filter((asset) => asset.cohort === year);
}

export function getBulletins(year: CohortYear) {
  return getPublishedBulletins(year);
}

export function getProjects(year: CohortYear) {
  return projects.filter((project) => project.cohort === year && project.published);
}

export function getAwards(year: CohortYear) {
  return awards.filter((award) => award.cohort === year && award.published);
}

export function getPeopleByRole(year: CohortYear, roleTypes: PersonRoleType[]) {
  return personRoles
    .filter(
      (role) =>
        role.cohort === year && role.published && roleTypes.includes(role.roleType),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((role) => {
      const person = people.find((candidate) => candidate.id === role.personId);
      return person ? [{ person, role }] : [];
    });
}

export function getOrganizationsByRole(
  year: CohortYear,
  roleTypes?: OrganizationRoleType[],
) {
  return organizationRoles
    .filter(
      (role) =>
        role.cohort === year &&
        role.published &&
        (!roleTypes || roleTypes.includes(role.type)),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((role) => {
      const organization = organizations.find(
        (candidate) => candidate.id === role.organizationId,
      );
      return organization ? [{ organization, role }] : [];
    });
}
