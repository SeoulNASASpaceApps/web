# 지예 소유 설정과 비밀 환경변수

`.env.example`에는 이름·안전한 기본값만 둔다. 실제 값은 지예가 관리하는 배포 프로젝트의 서버 Secret 설정에 입력한다. 비공개 Git이라도 실제 키는 커밋하지 않는다.

**환경변수라는 형식 자체가 지예만 열람한다는 보장은 없다.** 배포 프로젝트 관리자·DB 관리자·서버 코드를 배포할 수 있는 사람은 값 또는 데이터에 접근할 수 있다. ‘지예만’ 요구는 production Secret/DB/배포 계정 권한을 지예로 제한하고, 다른 개발자에게는 코드·mock·가짜 샘플만 제공해야 성립한다. 공동 개발 권한과 운영 권한을 구분한다.

| 이름 | 용도 | 서버 전용 여부 |
|---|---|---|
| PUBLIC_HUB_ORIGIN | 경로 없는 공개 origin | 공개값, 서버 설정 |
| PORT | 로컬 서버 port | 서버 설정 |
| EVENT_ID | space-apps-seoul-2026 | 공개 식별값, 서버 설정 |
| GOOGLE_CLIENT_ID / NAVER_CLIENT_ID | 앱 식별값 | 민감도 낮아도 현재 서버에 설정 |
| GOOGLE_CLIENT_SECRET / NAVER_CLIENT_SECRET | OAuth secret | 비밀 |
| RESEND_API_KEY | 인증/연락 메일 발송 권한 | 비밀 |
| VERIFICATION_FROM_EMAIL | 확인된 발신 주소 | 설정값 |
| ADMIN_IDENTITIES | 확인된 provider:user_id | 제한된 운영 설정; 이메일로 승격 금지 |
| HUB_DB_PATH | 지속 가능한 기존 로컬 DB 경로 | 서버 전용, 현재 env example에는 없음 |
| EMAIL_VERIFICATION_TTL_SECONDS | 기본 1800 | 제안값 |
| EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS | 기본 60 | 제안값 |
| EMAIL_VERIFICATION_HOURLY_LIMIT | 기본 3 | 제안값 |
| EMAIL_DAILY_LIMIT | 기본 100 | 제안값 |

현재 서버는 난수 세션과 token hash를 SQLite에 저장한다. 존재하지 않는 AUTH_SESSION_SECRET 등 필수값을 임의로 추가하지 않는다. 실제 Sheets 자격증명은 어댑터가 아직 없어 이름/저장방식 미확정이다. 기존 DB 접근권한과 읽기 전용 범위를 먼저 확인한다.

## 지예가 설정할 항목

1. 소유 Google/Naver 앱과 허용 callback. 개발용 origin과 운영 origin을 각각 확인.
2. Resend 키·발신 도메인/주소·링크 추적 해제. 서비스 쿼터는 실제 계정 설정에서 재확인.
3. 지예 운영자 provider ID. 미설정이면 관리자 접근을 열지 않는다.
4. 선택한 기존 DB 연결·백업·권한, 원본 참가 자료 열 매핑.
5. 비공개 staging 배포의 허용 사용자 범위와 production 배포 권한.

키는 파일·채팅·스크린샷으로 전달하지 않고 지예가 Secret 입력 화면에서 설정한다. 개발자에게는 설정 여부와 변수 이름만 공유한다. 프론트 public prefix 환경변수에 비밀을 넣지 않는다.

현재 Sites 비공개 공유 권한은 Google/Naver 앱 권한과 별개다. 도메인 이전 때 그 제한이 자동 이동하지 않는다. 새 비공개 staging에서 접근 제한·인증 callback·쿠키·CSRF를 검증하고, 지예 승인 없이 공개 전환하지 않는다.
