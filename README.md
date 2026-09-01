# NASA Space Apps Seoul Web

NASA Space Apps Seoul의 연도별 공개 웹사이트와 정적 배포 설정을 관리합니다.

## 현재 공개 상태

- Production root: `https://nasaspaceappskr.org/` → `/2025/`
- 2025 archive: 기존 source와 URL을 그대로 유지
- 2026: Multi-Cohort architecture 기반 skeleton만 구현, production 미배포
- 회원가입, 로그인, dashboard, authentication backend 없음
- 2026 Seoul Participation Confirmation은 향후 승인된 외부 Form URL을 연결

`CURRENT_COHORT`는 콘텐츠 설계상 2026이지만, production entry cohort는 2025로
분리되어 있습니다. 공개 전환 승인 전에는 다음 파일의 `/2025/` 목적지를 변경하지
않습니다.

- `frontend/src/app/page.tsx`
- `infra/cloudfront-functions/redirect-root.js`

## 디렉터리

- `frontend/`: Next.js 15, React 19, TypeScript, static export
- `frontend/src/content/`: cohort별 공개 static content
- `frontend/src/domain/`: 공개 콘텐츠 type과 relation
- `frontend/src/data/`: component가 사용하는 data access layer
- `frontend/src/components/cohort/`: 2026+ 공통 layout과 UI
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
