# Multi-Cohort 공개 사이트 구조

## 원칙

- 연도는 모든 주요 공개 콘텐츠의 첫 번째 관계다.
- 공개 `Person`과 미래의 비공개 `User` 계정은 분리한다.
- 확인되지 않은 2026 콘텐츠는 static data에서 unpublished 또는 null로 둔다.
- 새로운 cohort를 추가할 때 page component를 복제하지 않는다.
- 2025 source와 legacy URL은 migration이 검증될 때까지 독립적으로 보존한다.

## 공개 콘텐츠

```text
Cohort
├── BulletinPost
├── Project ── Team ── Award
├── Person ── PersonRole
└── Organization ── OrganizationRole
```

현재 데이터는 `frontend/src/content/site.ts`에 있으며 component는
`frontend/src/data/content.ts`의 selector를 통해 읽습니다. 데이터가 늘어나면
`content/cohorts/2026/`처럼 연도별 파일로 나눌 수 있지만 selector의 호출 방식은
유지합니다.

## 2025 compatibility

기존 URL은 계속 정적으로 export됩니다.

```text
/2025/
/2025/{ko,en}/index/
/2025/{ko,en}/judges/
/2025/{ko,en}/sponsors/
/2025/{ko,en}/awardees/
/2025/{ko,en}/crew/
/2025/{ko,en}/chatbot/
/2025/{ko,en}/contact/
```

기존에 없던 `/2025/ko/`와 `/2025/en/`는 각 locale의 `index` archive로 연결합니다.
향후 추가 2025 source를 발견하면 이 경로와 기존 slug를 유지한 채 data와 component만
교체합니다.

## 2026 registration

2026에는 authentication이나 자체 registration system을 사용하지 않습니다.
`RegistrationConfig.mode`는 `EXTERNAL`이며 URL이 승인되기 전까지 `published: false`와
`null`을 유지합니다.

## 미래 계정 시스템

미래의 `User`, `CohortMembership`, `TeamMembership`, `RegistrationRecord`는 별도
private backend domain에 둡니다. 참가자 이메일과 다른 개인정보를 현재 static content
파일에 추가하지 않습니다. 향후 backend는 공개 Project, Team, Award의 stable ID를
참조할 수 있으므로 공개 사이트를 전면 재작성할 필요가 없습니다.
