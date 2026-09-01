# 프론트엔드 작업 지침

## 적용 범위

이 지침은 `frontend/`에 적용한다. 루트 `AGENTS.md`의 공통 지침도 함께
적용한다.

## 구조

- Next.js 15 App Router, React 19, TypeScript를 사용한다.
- `src/app/2025/page.tsx`: 행사 랜딩 페이지
- `src/app/2025/[locale]/`: 한국어와 영어 행사 페이지
- `src/app/page.tsx`: CloudFront를 거치지 않을 때 사용하는 최신 연도 redirect
  fallback
- `src/app/registry.tsx`: 페이지의 `styled-jsx`를 초기 HTML에 삽입하는 registry
- `public/`: 폰트와 이미지
- `next.config.js`: `output: "export"`를 사용하며 운영 결과물은 정적 파일이다.

## 개발

`frontend/`에서 실행한다.

```sh
yarn install
yarn dev
yarn lint
yarn tsc --noEmit
yarn build
```

`package.json`에 Yarn 1.22.19가 선언되어 있으므로 Yarn을 사용한다. 다른
패키지 관리자나 잠금 파일을 추가하지 않는다.

## 변경 원칙

- 정적 내보내기와 호환되는 라우트를 유지한다. Next.js 서버가 필요한
  서버 전용 핸들러, 미들웨어, 런타임 이미지 최적화, 동적 기능을 추가하지
  않는다.
- 사용자에게 보이는 문구와 내비게이션은 `ko`와 `en`을 모두 지원한다.
- 기존 페이지 레이아웃과 시각 언어를 재사용하며, 일부 콘텐츠 변경을 위해
  전체 디자인을 바꾸지 않는다.
- 접근 가능한 이름, 대체 텍스트, 키보드 조작, 포커스 표시를 유지한다.
- 자산은 `public/` 아래에 추가하고 루트 기준 경로로 참조한다.
- 내부 페이지 이동은 `next/link`, 이미지 크기 예약은 `next/image`, 로컬 폰트는
  루트 layout의 `next/font/local` 설정을 재사용한다.
- 페이지별 `styled-jsx`가 하이드레이션 전에 적용되도록 루트 layout의
  `StyledJsxRegistry`를 유지한다.

## 검증

- 코드, 라우트, 설정, 의존성을 변경했다면 `yarn lint`, `yarn tsc --noEmit`,
  `yarn build`를 실행한다.
- 변경한 페이지의 한국어와 영어 버전을 모두 확인한다.
- 레이아웃을 변경했다면 데스크톱과 모바일 너비를 확인하고 개발 서버뿐
  아니라 정적으로 내보낸 경로도 검증한다.
