# 공식 웹 저장소 통합 기록

## 확인한 현재 구조

- 공식 웹은 `frontend/`의 Next.js 정적 export이며 서버 route가 없다.
- 기존 저장소에는 참가자 인증, 승인 API, 운영 DB 또는 scheduler 구현이 없었다.
- MY SPACE 화면 원본은 `apps/my-space/`에 보존한다. 팀 수집·DB import 코드는
  인증 서버와 함께 공용 Git 밖의 로컬 전용 후보 폴더로 분리했다.
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
- 인증·승인·DB·메일·팀 수집 서버 코드는 공용 Git 밖의 로컬 전용 후보 폴더로
  분리했다. GitHub 소유 계정과 비공개 저장소는 아직 선택하지 않았다.
- 공용 빌드는 공개값 `MY_SPACE_API_BASE_URL`이 주어질 때만 `auth-config.js`에 별도
  서비스 origin을 기록한다. 값이 없으면 주소는 빈 문자열이고 로그인 및 참가자
  기능 잠금이 유지된다.
- 별도 서비스는 정확히 허용한 화면 origin에만 credentialed CORS를 반환하고,
  OAuth callback은 서비스 origin에서 처리한 뒤 공식 화면 origin으로 돌아간다.
- OAuth, Resend, Sheets, 기존 운영 DB, 03:00 KST scheduler와 운영 Secret은 모두
  미연결 상태다.

상세 경계와 로컬 파일 위치는 `10_PUBLIC_PRIVATE_BOUNDARY.md`를 따른다. 이 브랜치는
로컬 정리와 검증 범위이며 commit, push, `main` 병합과 Production 공개는 하지 않는다.
