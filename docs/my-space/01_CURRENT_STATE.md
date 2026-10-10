# 현재 구현 상태

| 기능 | 확인한 상태 | 남은 작업 |
|---|---|---|
| HTML/CSS/JS 허브 | 최신 소스 확보, 정적 Site v70 | 공식 사이트 `/my-space` 통합 |
| 4가지 검토 상태 | 비로그인·승인 대기·참가자·오너, 같은 review 페이지 | 실제 계정 권한과 분리 유지 |
| 공통 정책 | hub-policy.js에 3+2회·3대화·5일 만료·수신 동의 판단 | 서버 관심 API에서 동일 규칙 원자적 적용 |
| OAuth/세션/승인 | Node 24 로컬 서버 + SQLite + mock 테스트 | 앱 등록·callback·HTTPS·기존 DB 연결·실계정 검증 |
| NASA 이메일 인증 | 계정에 묶인 1회 링크·명시적 확인·Resend 어댑터 구현 | 키·발신 도메인 설정, 실제 수신/확인 |
| 운영자 승인 | `/admin` 권한 검사와 승인 이력 | 지예 provider ID 설정·실명단 대조 |
| 등록 대조 | JSON 입력의 읽기 전용 대조 및 로컬 관리 DB 반영 | 실제 NASA 자료/서울 Form 열 매핑·Sheets 읽기 어댑터 |
| 공식 팀 수집 | 기존 보고서상 10/9 16:09–16:10 KST 수동 1회, 32팀/2페이지/4표본 | 운영 환경 반복 검증 |
| 수집기→importer | 이번 필드 변환·검증 및 메모리 DB 통합 준비 | 선택한 운영 DB에서 dry-run→반영 |
| 팀 목록 | UI는 10/6 고정 15개 모집팀 스냅샷 | DB 조회 API·최종 성공 시각 표시 |
| 프로필/모집/관심/연락 | review 예시·localStorage 중심, 운영 기능 잠김 | 서버 API·실계정 저장/조회/동시성 |
| 자동 03:00 수집 | 실행 파일과 일정 안내만 준비 | 실제 scheduler 등록·운영 모니터링 |

## 다음 개발자가 반드시 알아야 할 제약

- `auth.js`의 `canUseParticipantFeatures()`는 항상 false다. 승인 후에도 API 연결 전에는 기능을 해제하면 안 된다.
- `auth-backend/schema.sql`의 `identities`는 `UNIQUE(participant_id)`를 둔다. 현재 참가자 하나에 Google+Naver 두 identity를 동시에 연결할 수 없다. 추가 provider 연결 요구는 마이그레이션과 소유 증명을 구현하기 전 완료로 표시하지 않는다. 기존 설계의 1:N과 차이가 있다.
- 현재 schema의 participants.id/teams.id는 UUID지만 화면 ORBIT 코드는 내부 ID가 아니다. 공식 encoded ID 역시 내부 UUID와 구분한다.
- 로컬 Node/SQLite 서버는 Sites 정적 호스팅이나 Worker에 그대로 배포할 수 없다. 공식 사이트의 기존 API/DB에 포팅하거나 호환 Node 호스트를 연결한다.
- 기존 다른 Codex DB의 실제 구조·데이터는 이번에 조회하지 않았다. 파일에 테이블 정의가 있다고 그 DB와 연결된 것이 아니다. 운영 DB 중복 생성·무조건 schema.sql 적용 금지.
- 기존 importer는 자체로 성공/완전성 필드를 검사하지 않는다. 이번 normalizeSnapshot 검증을 통과한 파일만 importer에 전달한다.
- 현재 공식 Challenge 제목은 문자열 저장이다. 내부 challenge_id의 정확 매핑·미매칭 검토는 추가 작업이다.
- `review.html`은 생성 파일이다. 4개는 웹사이트 4개가 아니라 사용자 상태 4개다. 검토 query는 권한 증거가 아니다.
