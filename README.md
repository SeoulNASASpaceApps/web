# NASA Space Apps Seoul Web

NASA Space Apps Seoul의 연도별 공개 웹사이트와 정적 배포 설정을 관리합니다.

## 현재 공개 상태

- Production root: `https://nasaspaceappskr.org/` → `/2026/ko/`
- Hosting: Vercel Production (`https://nasa-space-apps-seoul.vercel.app/`)
- 2025: 기존 source와 URL을 보존하는 공개 archive
- 2026: 현재 활성 public website
- 회원가입, 로그인, dashboard, authentication backend 없음
- 2026 Seoul Participation Confirmation은 승인된 외부 Form URL을 연결하는 방식

`CURRENT_COHORT`와 Production entry cohort는 2026입니다. root 목적지를 변경할
때는 다음 두 파일을 함께 갱신합니다.

- `frontend/src/app/page.tsx`
- `infra/cloudfront-functions/redirect-root.js`

## 디렉터리

- `frontend/src/app/2025/`: 2025 archive route와 legacy page
- `frontend/src/app/2026/`: 2026 활성 route
- `frontend/src/components/cohort/`: 2026 이후 공용 layout과 UI
- `frontend/src/content/`, `src/data/`, `src/domain/`: 공개 콘텐츠와 data layer
- `frontend/content/cohorts/{year}/`: 연도별 Markdown 콘텐츠
- `infra/`: legacy CloudFront root redirect source와 test
- `docs/`: architecture, release, roadmap 문서

root layout, 전역 CSS, package/lockfile, Next 설정, 폰트, favicon과 공용 logo는 두
연도에 영향을 줄 수 있습니다.

## 로컬 실행과 검증

```sh
cd frontend
corepack yarn install --frozen-lockfile
corepack yarn dev
```

전체 검증:

```sh
cd frontend
corepack yarn lint
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn check:routes
cd ..
node infra/cloudfront-functions/redirect-root.test.js
git diff --check
```

## 기여와 배포

기여자는 local-first 방식으로 feature branch와 Pull Request를 사용합니다. 로컬
승인이 끝난 하나의 일관된 작업 단위를 push해 Vercel Preview에서 최종 QA합니다.
프로젝트 소유자의 명시적 승인 없이 `main`에 merge하거나 Production 배포를
시작하지 않습니다.

- 역할, 접근 분리, 기여 규칙: `CONTRIBUTING.md`
- 상세 Preview/Production 절차: `docs/vercel-release-formula.md`
- 2026 Bulletin 작성: `frontend/content/README.md`
- cohort 구조: `docs/multi-cohort-architecture.md`
- 향후 chatbot 도입 기준: `docs/development-release-and-chatbot-roadmap.md`

현재 `main` merge/push는 Vercel Production을 자동 시작합니다. AWS S3/CloudFront
플레이북은 legacy 복구 참고 자료이며 일반 콘텐츠 배포에는 사용하지 않습니다.
