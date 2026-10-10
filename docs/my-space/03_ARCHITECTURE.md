# 기존 HTML 보존과 연결 설계

공식 안내 사이트는 기존 React 계열 코드를 유지하고, MY SPACE는 독립 HTML/CSS/JavaScript 앱으로 `/my-space/`에 연결한다. 서로 언어가 완전히 다른 것은 아니다. React도 JavaScript 기반이며 UI를 구성하는 방식이 다르므로 전체 React 전환은 필요 없다.

## 코드 책임

| 구분 | 현재 파일 | 책임/후속 작업 |
|---|---|---|
| 공통 정책 | hub-policy.js | DOM 없는 대화·만료·동의 판단; 서버 적용은 별도 |
| 공통 기준 | match-catalog.js | 역할·Challenge·테마 |
| 공통 인증 | auth.js, approval-flow.js | 세션 API와 상태 문구 |
| 역할 화면 | workspace-ui.js | 참가자/오너 메뉴·전환 |
| 목록/폼 조율 | match.js | 일부 프로필·오너·review 분기가 남음 |
| 관심 표시 | interest-threads.js | 공통 카드·답변; 현재 review 저장소 |
| 검토 전용 | preview.js, review-store.js | 예시 identity·대화·localStorage, 운영 페이지에 로드 금지 |
| 서버 | auth-backend/server.mjs | OAuth·세션·메일 인증·운영자 승인 |
| 저장/변환 | schema.sql, data-tools.mjs | 로컬 DB와 등록·공식 팀 반영 |
| 외부 팀 동기화 | team-sync/ | 수집→검증→형식 변환, UI와 분리 |

남은 match.js의 역할별 폼은 실제 API 연결 때 profile-ui/team-owner-ui 및 api-client/storage-adapter 정도로 책임을 나눌 수 있다. 지금 파일명만 바꾸는 대규모 재작성은 하지 않는다. 공통 규칙을 복제하지 않고 테스트를 유지한다. review fixture는 운영 fallback으로 사용하지 않는다.

## 주소 연결 계약

| 외부 경로 | 전달 대상/조건 |
|---|---|
| `/`와 기존 `/2026/ko/`, `/2026/en/` | 기존 공식 사이트 |
| `/my-space/` | 허브 dist/index.html |
| `/my-space/*.css`, `/my-space/*.js` | 허브 정적 파일. auth-config.js는 아래 예외 |
| `/my-space/auth-config.js` | 서버의 `/auth-config.js`로 rewrite, no-store; Secret 없는 origin/providers만 반환 |
| `/auth/*` | 동일 공개 origin의 인증 서버, GET/POST·쿠키·Origin 보존 |
| `/admin`, `/admin/*`, `/admin.js` | 인증 서버, 관리자 권한 필수 |
| `/verify-email`, `/verify.js` | 인증 서버; fragment 토큰·명시적 POST 유지 |

현재 서버 origin은 경로 없이 `https://nasaspaceappskr.org`이고 callback은 `/auth/google/callback`, `/auth/naver/callback`이다. 서버에는 `/my-space` prefix 처리가 없다. `/my-space`를 `/my-space/`로 redirect하거나 정적 자산 경로를 명시적으로 고친다. 기존 공식 `/auth`·`/admin` 충돌 여부를 먼저 검사한다. 충돌 시 라우트와 UI 호출·callback을 함께 변경해야 한다.

현재 auth-config 기본은 빈 주소다. `/my-space` 자산만 복사하면 로그인이 연결되지 않는다. 별도 외부 backend URL 입력만으로 CORS·SameSite 쿠키를 해결한 것으로 간주하지 않는다. 같은 origin의 reverse proxy를 권장한다.

Node 서버는 loopback 수신한다. Node 호스트에서 reverse proxy로 HTTPS를 연결하거나 기존 서버 환경에 구현을 포팅한다. Vercel 등의 요청 단위 임시 파일시스템에 로컬 SQLite를 운영 DB로 쓰지 않는다. 실제 선택은 기존 공식 저장소·배포 설정·기존 DB를 확인한 뒤 정한다. 배포 업체별 설정은 이번에 검증하지 않았다.

개발자는 UI 저장/조회와 서버 정책/DB 쓰기의 경계를 명시한다. 실제 참가자 목록·이메일·보호자 자료는 브라우저 전체 데이터 파일로 내리지 않는다. API는 본인·허용된 공개 프로필·공식 팀·당사자 대화만 반환한다.
