# NASA Space Apps Seoul Web

NASA Space Apps Seoul의 연도별 공개 웹사이트와 정적 배포 설정을 관리합니다.

## 현재 공개 상태

- Vercel production root: `https://nasa-space-apps-seoul.vercel.app/` → `/2026/ko/`
- Official domain: `https://nasaspaceappskr.org/`의 Vercel 연결은 별도 DNS 전환 필요
- 2025 archive: 기존 source와 URL을 그대로 유지
- 2026: Multi-Cohort architecture와 확정 행사 콘텐츠 기반 public skeleton 배포
- 회원가입, 로그인, dashboard, authentication backend 없음
- 2026 Seoul Participation Confirmation은 향후 승인된 외부 Form URL을 연결

`CURRENT_COHORT`와 Vercel production entry cohort는 2026입니다. 루트 이동
목적지를 변경할 때는 다음 두 파일을 함께 갱신합니다.

- `frontend/src/app/page.tsx`
- `infra/cloudfront-functions/redirect-root.js`

## 디렉터리

- `frontend/`: Next.js 15, React 19, TypeScript, static export
- `frontend/src/content/`: cohort별 공개 static content
- `frontend/src/domain/`: 공개 콘텐츠 type과 relation
- `frontend/src/data/`: component가 사용하는 data access layer
- `frontend/src/components/cohort/`: 2026+ 공통 layout과 UI
- `frontend/content/cohorts/{year}/bulletin/`: 운영자가 작성하는 Markdown 공지
- `infra/`: CloudFront root redirect source와 test
- `docs/`: deployment 및 architecture 문서

## 로컬 검증

```sh
cd frontend
corepack yarn install --frozen-lockfile
corepack yarn lint
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn check:routes
cd ..
node infra/cloudfront-functions/redirect-root.test.js
git diff --check
```

배포는 GitHub push로 자동 실행되지 않습니다. `docs/deployment-playbook.md`의 S3와
CloudFront 수동 절차는 별도의 production 승인 후에만 수행합니다.

AWS 없이 진행하는 개발·PR 흐름과 향후 챗봇 도입 기준은
`docs/development-release-and-chatbot-roadmap.md`를 참고합니다.
