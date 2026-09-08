# NASA Space Apps Seoul 기여 가이드

이 저장소는 공개 웹사이트 코드 기여 권한과 민감한 운영 서비스 접근 권한을
분리합니다. 모든 기여자는 아래 local-first workflow를 따릅니다.

## 역할과 책임

### Contributors

- 로컬에서 구현하고 feature branch로 Pull Request를 연다.
- 디자인, UI, 콘텐츠를 localhost에서 충분히 반복한 뒤 Preview를 요청한다.
- 필요한 경우 Vercel Preview에서 최종 화면을 검토한다.
- 공식 이메일, 도메인/DNS, Vercel Production, AWS 또는 복구 수단에 대한 접근은
  코드 기여를 위해 제공되지 않는다.

### Repository maintainers

- 코드와 콘텐츠를 검토하고 shared architecture와 CI를 유지한다.
- 2025 archive 회귀, 한국어/영어, 접근성, 공개 승인 여부를 확인한다.
- 프로젝트 소유자의 승인 없이 `main` merge 또는 Production 작업을 수행하지 않는다.

### Project owner

- `main` 반영과 Production go-live를 승인한다.
- Vercel Production, 공식 이메일, 도메인/DNS와 기타 관리 계정의 소유권 및
  복구 수단을 관리한다.
- 필요한 최소 인원에게만 운영 접근을 제공하고 변경·회수 여부를 관리한다.

저장소에는 계정 비밀번호, app password, API secret, recovery code, access token,
private key 또는 실제 환경변수 값을 기록하지 않습니다. 운영 계정 inventory와
복구 절차는 접근 제한된 password manager 또는 private runbook에서 관리합니다.

## 표준 개발 흐름

1. 최신 `origin/main`에서 짧은 feature branch를 만든다.
2. localhost에서 구현하고 desktop/mobile 및 한국어/영어 화면을 반복 검토한다.
3. 불필요한 중간 commit, push, Preview 배포를 만들지 않는다.
4. 일관된 작업 단위가 로컬에서 승인되면 필수 검증을 모두 실행한다.
5. 정리된 feature branch를 한 번 push하고 Pull Request를 연다.
6. Vercel Preview에서 최종 QA하고 프로젝트 소유자의 승인을 받는다.
7. 승인된 변경만 `main`에 merge한다. 현재 merge는 Production 배포를 자동 시작한다.
8. Production이 Ready가 된 뒤 2026 route와 2025 archive를 검증한다.

Preview에서 문제가 발견되면 feature branch에서 수정하고 필요한 검증을 다시
실행합니다. 추가 push는 해당 문제를 해결하는 일관된 단위로 제한합니다.

## Branch와 Pull Request

사람이 만드는 branch는 `feature/<topic>`, `fix/<topic>`, `content/<topic>`처럼
목적이 드러나는 이름을 권장합니다. Codex 작업 branch는 `codex/<topic>`을
사용합니다. `main`에서 직접 작업하거나 직접 push하지 않습니다.

Pull Request는 다음을 포함해야 합니다.

- 변경 목적과 범위
- 2025, 2026 또는 shared 변경 여부
- 실행한 자동 검증과 수동 QA
- Vercel Preview URL 또는 Preview가 필요하지 않은 이유
- 공개 콘텐츠와 이미지 승인 상태
- Production 또는 운영 인프라 영향

상세 명령과 릴리스 절차는 `docs/vercel-release-formula.md`를 따릅니다.

## 변경 경계

- 2025 archive는 명시적 요청 없이 재구성하지 않는다.
- root layout, 전역 CSS, dependency, build 설정, 폰트와 공용 asset 변경은 두 연도
  모두 회귀 검증한다.
- 사용자에게 보이는 변경은 한국어와 영어를 함께 유지한다.
- 미확정 콘텐츠와 비공개 개인정보는 static source에 게시하지 않는다.
- DNS, 인증서, AWS, CloudFront, S3, Vercel project 설정 변경은 일반 코드 PR과
  구분하고 프로젝트 소유자의 별도 명시적 승인을 받는다.

## 필수 검증

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
git status --short
```

문서만 바꾼 경우에도 `git diff --check`를 실행하고 link, 현재 연도, hosting 설명이
서로 모순되지 않는지 확인합니다.
