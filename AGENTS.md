# 저장소 작업 지침

## 적용 범위와 우선순위

이 지침은 저장소 전체에 적용한다. `frontend/AGENTS.md`와 `infra/AGENTS.md`의
세부 지침은 해당 디렉터리 안에서 이 문서보다 우선한다.

사람이 참여하는 방법과 승인 책임은 `CONTRIBUTING.md`, 상세 릴리스 절차는
`docs/vercel-release-formula.md`를 기준으로 한다.

## 현재 프로젝트 구조

- `frontend/src/app/2025/`: URL과 화면을 보존하는 2025 아카이브
- `frontend/src/app/2026/`: 현재 활성 행사 사이트
- `frontend/src/components/cohort/`, `src/content/`, `src/data/`, `src/domain/`:
  2026 이후 cohort에 사용하는 공통 계층
- `frontend/content/cohorts/{year}/`: 연도별 파일 기반 공개 콘텐츠
- `infra/`: 이전 AWS/CloudFront 운영 환경을 위한 legacy 코드와 검증
- `docs/`: 아키텍처, 릴리스, 운영 기록

2025 챗봇 페이지는 행사 종료 안내를 보여주는 정적 기록이며 채팅 API는 없다.

## 현재 URL과 호스팅

- 대표 주소는 `https://nasaspaceappskr.org/`이고 현재 `/2026/ko/`로 이동한다.
- Vercel이 현재 Production을 호스팅한다.
- `/2025/**`는 이후에도 유지해야 하는 아카이브 URL이다.
- `frontend/src/app/page.tsx`와 `infra/cloudfront-functions/redirect-root.js`는 최신
  cohort 목적지를 함께 유지한다. 후자는 legacy AWS 복구용이며 저장소 코드가
  현재 운영에 연결됐다고 가정하지 않는다.
- DNS, 도메인, 인증서, Vercel Production, AWS, CloudFront 또는 S3 설정 변경은
  프로젝트 소유자의 별도 명시적 승인이 필요하다.

## 개발·승인 원칙

- 로컬 개발을 기본으로 한다. 디자인, UI, 콘텐츠는 localhost에서 충분히
  반복·검토하고 불필요한 commit, push, Preview 배포를 만들지 않는다.
- `main`에서 직접 작업하거나 직접 push하지 않는다. 일관된 작업 단위는 feature
  branch에서 준비한다.
- 사용자가 명시적으로 요청하지 않으면 commit, push 또는 배포하지 않는다.
- 로컬 승인이 끝난 작업은 필수 검증 후 한 번의 정리된 feature-branch push를
  준비하고 Vercel Preview에서 최종 QA한다.
- 프로젝트 소유자의 명시적 승인 없이 `main`에 merge하거나 Production 배포를
  시작하지 않는다. 현재는 `main` merge/push가 Vercel Production을 자동 시작한다.
- 코드 변경과 GitHub/Vercel/AWS 운영 설정 변경을 구분하고, 실제로 수행한 범위를
  완료 보고에 명시한다.

## 변경 경계

- 요청받은 영역만 수정하며 당장 필요하지 않은 추상화나 의존성을 추가하지 않는다.
- 새 구현보다 기존 페이지, locale, 스타일 패턴을 우선 재사용한다.
- 사용자에게 보이는 콘텐츠를 변경할 때 한국어와 영어를 함께 유지한다.
- `frontend/src/app/2025/`와 기존 2025 URL·콘텐츠를 명시적 요청 없이 현대화하거나
  재구성하지 않는다.
- 루트 layout, 전역 CSS, 패키지/잠금 파일, Next 설정, 폰트, favicon, 공용 logo는
  2025와 2026에 모두 영향을 줄 수 있으므로 두 연도를 회귀 검증한다.
- 생성 결과물(`frontend/.next/`, `frontend/out/`)과 외부 의존성 코드는 직접
  수정하거나 commit하지 않는다.

## 자격 증명과 운영 접근

- 비밀번호, 복구 코드, API key, app password, access token, 개인키 또는 세션 값을
  저장소, 문서, issue, PR, 로그에 넣거나 출력하지 않는다.
- 공식 이메일, 도메인/DNS, Vercel Production, AWS 등 민감한 운영 서비스 접근은
  코드 기여 권한과 분리한다.
- 공개 설정에 필요한 환경변수가 생기기 전에는 빈 `.env.example`을 만들지 않는다.
  추가할 때는 변수 이름과 설명만 기록하고 실제 값은 넣지 않는다.
- 참가자 이메일과 비공개 개인정보를 정적 콘텐츠에 추가하지 않는다.

## 로컬 실행과 검증

`frontend/`에서 실행한다.

```sh
corepack yarn install --frozen-lockfile
corepack yarn dev
```

코드, 콘텐츠, route, 설정 또는 의존성을 변경했다면 개발 서버를 종료한 뒤 다음을
실행한다.

```sh
cd frontend
corepack yarn lint
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn check:routes
cd ..
node infra/cloudfront-functions/redirect-root.test.js
git diff --check
git status --short
```

문서만 변경했다면 최소한 `git diff --check`와 `git status --short`를 확인한다.
실행하지 못한 검증이 있으면 이유를 보고한다.
