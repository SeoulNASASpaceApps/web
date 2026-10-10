# 공식 웹 저장소 통합 기록

## 확인한 현재 구조

- 공식 웹은 `frontend/`의 Next.js 정적 export이며 서버 route가 없다.
- 기존 저장소에는 참가자 인증, 승인 API, 운영 DB 또는 scheduler 구현이 없다.
- MY SPACE 원본은 `apps/my-space/`, 공개 팀 수집 도구는
  `tools/my-space-team-sync/`에 보존한다.
- 기존 Sites 식별 파일 `hub/.openai/hosting.json`과 생성된 `hub/dist/`는 가져오지
  않았다.

## 정적 연결 방식

`frontend`의 dev/build 직전에 `apps/my-space/scripts/export-production.mjs`가 운영용
정적 파일만 `frontend/public/my-space/`에 생성한다. 이 디렉터리는 생성물이라 Git에
커밋하지 않는다. Next.js export 결과에서는 `/my-space/index.html`로 포함되며 공식
사이트의 MY SPACE 메뉴는 `/my-space/`를 가리킨다.

`preview.js`, `review-store.js`, `review.html`은 검토용 예시 identity와 localStorage를
사용하므로 공식 정적 export에서 제외한다. 원본과 로컬 QA 빌드에는 남겨 둔다.

## 아직 연결하지 않은 범위

- 현재 `auth-config.js`의 API origin은 비어 있고 참가자 기능 잠금은 유지된다.
- Node/SQLite 인증 서버는 현재 Vercel 정적 프로젝트에 배포하지 않는다.
- `/auth/*`, `/admin`, `/verify-email` rewrite는 받을 서버가 정해지기 전 추가하지
  않는다.
- OAuth, Resend, Sheets, 기존 운영 DB, 03:00 KST scheduler와 운영 Secret은 모두
  미연결 상태다.

이 브랜치는 정적 앱의 소스 편입과 Preview 검증 범위다. `main` 병합과 Production
공개는 프로젝트 소유자의 별도 승인 후 진행한다.
