# 로컬 연결 구현 — 2026-10-09

정책·역할·공통 코드 책임은 [POLICIES_AND_ARCHITECTURE.md](POLICIES_AND_ARCHITECTURE.md)를 기준으로 확인한다. 이 문서는 현재 로컬 실행과 연결 범위를 설명한다.

## 현재 구현 범위

- 관심 검토 화면: 마지막 메시지 후 5일 미응답 자동 종료, 기록·사용 횟수 유지. hub-policy.js를 공통 판단에 사용한다. 실제 관심 API/DB의 서버 시각·원자적 만료 처리는 아직 연결하지 않았다.
- 팀 이메일 수신: 팀 자체 주소가 아니라 확인된 오너에게 전달하며 오너의 ‘대원에게 이메일 받기’를 기준으로 한다. 별도 팀 동의를 만들지 않는다.
- 승인 대기 화면: 이메일 인증 필요 / 인증 메일 대기 / 인증 완료·운영팀 확인 대기 / 만료 / 추가 확인 / 거절.
- Node 24 로컬 서버: Google·Naver OAuth, HttpOnly 세션, CSRF 검사, 자동 유일 매치, Resend 링크 발급, 요청 계정의 명시적 1회 확인, 운영자 승인 UI(`/admin`), 승인 이력.
- SQLite 로컬 저장소: 실제 원본 Forms/Sheets를 수정하지 않는다. 기존 다른 Codex DB는 이 checkout에 연결돼 있지 않으며 이전·병합을 수행하지 않았다.
- 원본 파일 읽기 기반 등록 대조, 공개 생성팀 JSON 반영 도구. 팀 갱신은 공식 필드만 수정하며 허브 모집글·모집 상태·소유자 연결을 보존한다.
- 인증·대조·팀 갱신은 로컬 테스트로 검증. 실제 제공자 로그인·Resend 발송은 서비스 설정이 없어 실서비스 검증하지 않았다.
- Hosted Site는 HTML/CSS/JS 정적 검토 화면이다. Node 서버와 SQLite는 배포되지 않는다. `auth-config.js` 기본 주소는 빈 값이다.
- 실제 참가자 프로필·모집글·관심 대화·연락 이메일의 서버 API 연결은 아직 남아 있다. 운영 화면의 참가자 기능은 계속 잠그고, 검토 화면에서만 예시 흐름을 제공한다.

## 실행

Node 24 이상. 추가 서버 패키지는 필요 없다. 저장소 루트(`hub`)에서:

```bash
npm run build
cp auth-backend/.env.example auth-backend/.env
# auth-backend/.env의 서버 전용 값을 로컬에서 설정
npm run server
```

기본 주소: `http://127.0.0.1:8787/`. 서버는 loopback만 수신한다. 실제 배포는 HTTPS reverse proxy 뒤에서 실행하고 외부 origin·callback·쿠키·CSRF를 다시 검증해야 한다. Sites Worker는 Node 서버/SQLite를 그대로 실행할 수 없다. nasaspaceappskr.org 통합 배포에서는 이 서버를 호환 Node 호스트에 연결하거나 기존 DB/API 환경에 포팅한다.

운영 화면: `/admin`. `ADMIN_IDENTITIES`에 확인된 `google:provider_user_id` 또는 `naver:provider_user_id`를 명시한다. 이메일이나 클라이언트 역할값으로 관리자 권한을 주지 않는다. 운영자 대상이 확정되기 전에는 누구도 관리자 접근할 수 없다.

OAuth 등록 주소:

- `${PUBLIC_HUB_ORIGIN}/auth/google/callback`
- `${PUBLIC_HUB_ORIGIN}/auth/naver/callback`

`PUBLIC_HUB_ORIGIN`은 경로 없는 origin이다. `/my-space` 통합 때 프런트 경로와 API reverse proxy를 같은 origin으로 설정한다. 별도 외부 origin을 auth-config.js에 입력하기만 하는 방식은 CORS/쿠키 연결이 구현되지 않아 지원하지 않는다. 현재 서버 API는 `/auth/*`, `/admin/*`이며 해당 경로와 `/verify-email`, `/verify.js`를 허브 서버에 전달해야 한다.

Google은 userinfo의 `email_verified=true`일 때만 검증된 이메일로 자동 연결한다. Naver 공식 프로필은 같은 검증 필드를 제공하지 않으므로 이 구현에서는 이메일 인증·운영자 확인 경로를 사용한다.

Resend: 발신 도메인 확인, `RESEND_API_KEY`, `VERIFICATION_FROM_EMAIL` 설정과 링크 추적 해제가 필요하다. 메일 링크는 `/verify-email#token=...` 형식이며 토큰은 브라우저 메모리에만 두고 명시적 POST로 확인한다. 첫 GET 방문·메일 검사기 방문은 인증 상태를 변경하지 않는다. 미로그인 시 로그인한 후 메일 링크를 다시 열도록 안내한다.

30분 유효·60초 재발송 간격·시간당 3회·전체 일일 100회는 환경변수 기본 제안값이다. 운영 정책 확정 전에 검토한다. 동시 요청·카운터·1회 소비는 SQLite 트랜잭션으로 처리한다. 기본 세션 유효시간은 24시간이다.

## 참가 기록 대조

원본을 변환한 **서버 비공개 JSON** 입력 형식:

공식 등록: 배열, 각 행 `nasa_email`, `name`, `seoul_registered`(boolean).
서울 Form: 배열, 각 행 `nasa_email`, `name`, `guardian_status`(`not_required` 또는 `verified`, 그 외는 확인 대기).

```bash
node auth-backend/data-tools.mjs reconcile official.json seoul.json
node auth-backend/data-tools.mjs reconcile official.json seoul.json --apply
```

첫 명령은 합계만 출력하고 DB를 수정하지 않는다. `--apply`는 로컬 관리 DB만 갱신한다. 원본은 읽기 전용이다. 중복·누락·보호자 미확인은 적격 처리하지 않는다. 이름 차이는 등록 자격과 별도로 운영자 추가 확인 사유이며 영구 거절이 아니다. 새 기록은 이름 일치 여부와 관계없이 pending이며 운영자가 원본 이름을 대조하기 전에는 승인하지 않는다. 기존 참가자 ID·승인 상태는 유지하며 새 행은 pending이다. 반영 전에 원본 파일에 대한 운영자 대조가 필요하다. Google Sheets 실시간 읽기 어댑터는 아직 연결하지 않았다.

## NASA에 생성된 팀 정보

다른 방에서 검증한 Python 수집기의 출력과 맞춰야 하는 입력 계약:

```json
{
  "source_url": "https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams",
  "collected_at": "2026-10-09T09:00:00Z",
  "teams": [
    {
      "external_id": "공식 안정적인 팀 ID",
      "official_url": "https://www.spaceappschallenge.org/2026/teams/공식-경로/",
      "name": "공식 팀명",
      "challenge": "공식 Challenge",
      "seeking_members": true
    }
  ]
}
```

위 JSON은 형식 설명이며 실수집 결과가 아니다. 명령:

```bash
node auth-backend/data-tools.mjs teams teams.json --apply
```

이번 인계 묶음의 `../../team-sync/`와 `../../evidence/`에 수집기·실수집 결과·형식 변환 검증 코드를 포함했다. `../../docs/05_TEAM_SYNC.md`를 따른다. 기존 결과를 메모리 DB에 반영하는 통합 테스트는 통과했지만, 실제 운영 DB·예약 실행·모집팀 화면 API는 아직 연결하지 않았다. 예정 시각은 **매일 03:00 Asia/Seoul**. 수집 실패·빈 결과는 삭제로 해석하지 않으며 기존 팀은 보존한다.

## 검사

```bash
npm test
npm run test:roles
npm run test:server
```

서버 테스트는 외부 서비스 대신 테스트 전용 메일러/제공자 응답을 사용한다. 실제 발송·외부 등록 자료·실서비스 사용자 인증을 검증했다는 뜻은 아니다.

## 다음 연결에 필요한 값

1. Google/Naver 앱 ID·Secret과 등록한 callback 주소.
2. Resend 키·검증한 발신 주소.
3. 기존 DB/Google Sheets 접근 방식과 원본 참가 기록의 열 매핑.
4. 운영자 provider ID.
5. 검증한 Python 수집 코드와 실제 결과 JSON.

비밀값은 코드·문서·브라우저 파일에 넣지 않는다. 개인별 민감 자료와 SQLite 파일은 gitignore 대상이다. 원본 데이터를 다른 개발자에게 전달하지 않고 서버 배포 설정에서 연결한다.
