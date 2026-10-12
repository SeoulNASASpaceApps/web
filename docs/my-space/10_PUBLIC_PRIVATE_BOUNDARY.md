# MY SPACE 공용/전용 경계

## 파일 안내

| 구분 | 공용 저장소 위치 | 책임 |
|---|---|---|
| 공식 사이트 | `frontend/` | 기존 2025/2026 정적 사이트와 `/my-space/` export |
| MY SPACE 화면 | `apps/my-space/index.html`, `styles.css`, 화면 JS | 참가 여정·팀 탐색·MY SPACE UI |
| 화면 인증 어댑터 | `apps/my-space/auth-config.js`, `auth.js`, `approval-flow.js` | 공개 API origin과 세션/승인 상태 표시; 권한 판정은 하지 않음 |
| Preview 검토 | `apps/my-space/preview.js`, `review-store.js`, `scripts/review-document.mjs` | 예시 identity·대화·상태 전환; Vercel Preview에서만 export |
| 공개 연결 빌드 | `apps/my-space/scripts/service-config.mjs`, `export-production.mjs` | `MY_SPACE_API_BASE_URL` 공개값 검증 및 `auth-config.js` 생성 |

로컬 전용 후보 폴더는
`C:\Users\<LOCAL_USER>\Documents\ChatGPT\NASA Space Apps Seoul Private\my-space-service`다.
여기에는 OAuth/세션, NASA 이메일 인증, 운영자 승인, DB schema/importer, 메일 adapter,
팀 수집·검증·스케줄 준비 코드가 있다. 전용 비공개 저장소는
`intellius-empowered/my-space-service`, 기존 작업 브랜치는
`codex/private-service-setup`이다. 실제 명부와 인증파일은 Git에 포함하지 않는다.

## API와 데이터 경계

1. 공용 화면 빌드에 `MY_SPACE_API_BASE_URL=https://<service-origin>`을 넣으면 그 공개
   origin만 브라우저 설정 파일에 포함된다. Secret은 포함할 수 없다.
2. 전용 서비스는 `PUBLIC_APP_ORIGIN` 및 정확한 `ALLOWED_APP_ORIGINS`에만 credentialed
   CORS를 반환한다. `*` wildcard는 허용하지 않는다.
3. OAuth callback, 세션 cookie, CSRF, 승인 판정, 관리자 권한, 참가자 DB와 메일 발송은
   전용 서비스가 소유한다. 화면 query/localStorage/역할 선택은 권한 증거가 아니다.
4. 공개 화면의 `canUseParticipantFeatures()`는 실제 participant API가 구현·검증되기
   전까지 항상 `false`다. Preview는 별도 예시 저장소만 사용한다.
5. 실제 참가자 목록·이메일·보호자 자료·DB 파일·Secret은 브라우저 bundle, 공용 Git,
   문서와 로그에 두지 않는다.

## 권한과 배포

| 자원 | 권한 원칙 |
|---|---|
| 공용 Git/Vercel Preview | 팀 개발·UI 검토. 실제 운영 데이터와 Secret 접근 없음 |
| 전용 비공개 Git | 소유 계정 확정 후 최소 인원만 코드 접근 |
| 전용 서버/Secret | 프로젝트 소유자만 Production 설정·배포·복구 권한 관리 |
| 운영 DB | 서비스 identity에 최소 권한; 개발자·Preview에는 운영 접속정보 미제공 |
| `main`/Production | 프로젝트 소유자의 별도 승인 전 변경 금지 |

별도 서비스는 공식 사이트와 같은 registrable domain의 API subdomain을 권장한다.
다른 사이트의 호스팅 domain을 쓰면 `COOKIE_SAME_SITE=None; Secure` 및 브라우저의
third-party cookie 제한을 실제 계정으로 검증해야 한다.

## 아직 필요한 결정

- 전용 서버 제공자와 서비스 origin/API subdomain
- Production 배포 가능 계정, Secret 관리자, DB 관리자 명단
- 기존 운영 DB 종류·schema·백업·migration 방법과 읽기/쓰기 권한
- 공식/서울 등록 원본의 안전한 읽기 adapter와 열 매핑
- Google/Naver callback, Resend 발신 domain, 운영자 provider ID

위 항목이 확정되기 전에는 전용 폴더를 임의 계정에 push하거나 운영 DB에 schema를
적용하지 않는다.

## 2026-10-12 배포 없는 Git 보존 경계

공용 `codex/my-space-integration` 브랜치는 Vercel Preview Git 배포와 연결되어 있다.
사이트/서버 배포 금지 요청 중에는 로컬 commit까지만 수행하고 push를 보류한다.
자동 배포 차단을 임의로 설정하거나 commit 메시지의 skip 표시에 의존하지 않는다.
전용 staging 프로젝트는 Git repository 미연결 상태를 확인했다. 비공개 서비스
브랜치 push는 사이트 main 병합이나 Production 배포 승인을 뜻하지 않는다.
