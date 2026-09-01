import {
  awards,
  bulletinPosts,
  cohorts,
  organizationRoles,
  organizations,
  people,
  personRoles,
  projects,
  registrationConfigs,
} from "@/content/site";
import type {
  CohortYear,
  Locale,
  OrganizationRoleType,
  PersonRoleType,
} from "@/domain/content";

export function isLocale(value: string): value is Locale {
  return value === "ko" || value === "en";
}

export function getCohort(year: CohortYear) {
  return cohorts.find((cohort) => cohort.year === year);
}

export function getRegistrationConfig(year: CohortYear) {
  return registrationConfigs.find((config) => config.cohort === year);
}

export function getBulletins(year: CohortYear) {
  return bulletinPosts
    .filter((post) => post.cohort === year && post.published)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
    });
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
