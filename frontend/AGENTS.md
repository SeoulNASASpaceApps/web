# 프론트엔드 작업 지침

## 적용 범위

이 지침은 `frontend/`에 적용한다. 루트 `AGENTS.md`의 공통 개발·승인 및 보안
규칙도 함께 적용한다.

## 기술과 구조

- Next.js 15 App Router, React 19, TypeScript, Yarn 1.22.19를 사용한다.
- `src/app/2025/`: 기존 구현과 URL을 보존하는 2025 아카이브
- `src/app/2026/`: 현재 활성 cohort route와 2026 전용 CSS
- `src/components/cohort/`: 2026 이후 cohort가 재사용하는 layout과 UI
- `src/content/site.ts`: cohort별 공개 정적 데이터와 현재 cohort 설정
- `src/data/`, `src/domain/`: selector와 공개 콘텐츠 type
- `content/cohorts/{year}/`: 연도별 Markdown 콘텐츠
- `src/app/page.tsx`: Vercel 및 정적 호스팅의 최신 cohort redirect fallback
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/registry.tsx`: 모든 연도가
  공유하는 application layer
- `public/`: 모든 연도가 공유하는 폰트와 이미지. 2026 전용 이미지는 가능한 한
  `public/images/2026/` 아래에 둔다.
- `next.config.js`: `output: "export"`를 사용하는 정적 사이트 설정

## 개발

`frontend/`에서 실행한다.

```sh
corepack yarn install --frozen-lockfile
corepack yarn dev
corepack yarn lint
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn check:routes
```

다른 패키지 관리자나 잠금 파일을 추가하지 않는다. `next dev`와 `next build`는
같은 `.next/`를 사용하므로 동시에 실행하지 않는다.

## 변경 원칙

- 정적 내보내기와 호환되는 route를 유지한다. Next.js 서버가 필요한 handler,
  middleware, runtime image optimization 또는 서버 전용 기능을 추가하지 않는다.
- 사용자에게 보이는 문구와 navigation은 `ko`와 `en`을 모두 지원한다.
- 기존 layout과 시각 언어를 재사용하며 일부 콘텐츠 변경을 위해 전체 디자인을
  바꾸지 않는다.
- 접근 가능한 이름, 대체 텍스트, 키보드 조작과 focus 표시를 유지한다.
- 내부 이동은 `next/link`, 이미지 크기 예약은 `next/image`, 로컬 폰트는 root
  layout의 `next/font/local` 설정을 재사용한다.
- page별 `styled-jsx`가 hydration 전에 적용되도록 `StyledJsxRegistry`를 유지한다.
- 2025 route와 legacy 콘텐츠는 명시적 요청 없이 재구성하지 않는다.
- root layout, 전역 CSS, dependency, build 설정 또는 공용 asset을 바꾸면 2025와
  2026 양쪽에 대한 변경으로 취급한다.

## 검증

- 코드, 콘텐츠, route, 설정, asset 또는 dependency 변경에는 `yarn lint`,
  `yarn tsc --noEmit`, `yarn build`, `yarn check:routes`를 실행한다.
- 변경한 페이지의 한국어와 영어 버전을 확인한다.
- layout 변경은 desktop과 mobile 너비에서 확인한다.
- 공유 계층 변경은 `/2025/`와 대표 2025 하위 route, `/2026/ko/`, `/2026/en/`를
  함께 확인한다.
- 개발 서버뿐 아니라 `out/`의 정적 export route도 검증한다.
