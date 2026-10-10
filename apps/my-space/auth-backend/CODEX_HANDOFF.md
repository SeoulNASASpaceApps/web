## 2026-10-09 보완 확정 — 최신 기준

정책·공통/역할별 구조는 POLICIES_AND_ARCHITECTURE.md, 현재 실행과 환경변수는 LOCAL_SETUP.md를 기준으로 한다. **마지막 메시지 후 5일(120시간) 미응답 자동 종료**를 확정했다. 종료 기록/메시지/행사별 같은 상대와 사용한 대화 횟수는 유지한다. 팀 카드 이메일은 확인된 팀 오너에게 전달하고 오너 프로필의 peer(‘대원에게 이메일 받기’) 동의를 사용한다. 별도 팀 수신 동의를 생성하지 않는다. 코드에서 hub-policy.js/기준표/검토 저장소를 분리했다. 실제 관심 API/DB 연결은 남아 있으므로 아래 전체 목표 계약을 이미 배포된 운영 기능으로 해석하지 않는다.

## 2026-10-09 최신 구현 상태

로컬 실행 서버(`server.mjs`), 인증 화면(`/verify-email`), 운영자 승인 화면(`/admin`), 참가 기록 대조/공식 생성팀 import 도구를 추가했습니다. [LOCAL_SETUP.md](LOCAL_SETUP.md)에 실행 방법·설정·검증 범위를 정리했습니다. 기존 아래 v67 기준 ‘실행 서버 없음’은 이 로컬 추가 이전의 상태입니다. Hosted Site는 여전히 정적 검토 화면이며 OAuth/Resend/원본 Sheets/기존 DB 실연결·참가자 기능 API·수집 예약 실행은 완료되지 않았습니다. 검토 화면은 이메일 인증 전후를 구분하고 인증만으로 이용 권한/팀 연락 동의를 켜지 않습니다.

# Seoul Hub — DB 항목표·점검 결과·Codex 작업 지시서

기준: 2026-10-09 KST, 현재 Site v67. 원래 파일명은 버전 이력 유지를 위해 유지한다. 대상은 `space-apps-seoul-2026-hub.family-1616.chatgpt.site`의 MY SPACE 허브다. 다른 GitHub 웹사이트의 PR이나 공식 홈페이지 코드를 이 문서만으로 변경하지 않는다.

## 1. 먼저 이해할 현재 단계

**화면·로컬 검토 흐름은 구현됐지만, 실제 인증 1단계는 완료되지 않았다.**

- 운영 페이지의 `auth.js`는 서버 세션을 조회할 수 있지만 실제 참가자 기능은 계속 잠긴다. `backendBaseUrl`과 이메일 `endpoint`는 빈 값이다.
- `auth-backend/README.md`는 계약 문서다. 로컬 OAuth·승인 서버는 추가되었고, Sheets 서버 연결은 아직 없다.
- `review.html`만 `preview.js`를 불러와 참가자·팀 오너 역할을 흉내 낸다. 실제 사용자 간 전달이 아니다.
- 프로필·팀 수정은 역할별 localStorage, 대화는 같은 브라우저의 공용 검토용 localStorage에 저장된다. 실제 DB가 아니다.
- 팀 목록은 `seeking-teams.js`의 저장된 공식 목록 스냅샷이다. 자동 동기화나 NASA 공식 API 연결이 완료된 것은 아니다.
- Site 접근 권한은 앱 로그인과 별개다. 현재 비공개 공유 범위를 유지한다. 공개 전환·계정 추가·원본 참가자 자료 수정은 이번 지시 범위 밖이다.

이 문서는 2026-10-09까지의 합의를 통합한 인계 기준이다. 최초 로그인 일괄 수동 승인·양쪽 이메일 주소 비공개·새 관심 횟수 미정이라는 이전 설명을 대체한다. 예전의 작업 가능 범위는 완료 내역이 아니다. 다른 Codex 작업에서 DB 테이블을 준비했다는 사용자 설명이 있으므로, 기존 테이블과 이 설계를 대조하고 중복 생성하지 않는다. 그 DB의 실제 연결 상태는 이 checkout에서 확인되지 않았다.

## 2. 예전 설계와 현재 확정 사항

| 항목 | 현재 기준 |
|---|---|
| 로그인 | Google / Naver. 제공자가 검증한 이메일이 해당 행사에서 이미 승인된 자격 있는 참가 기록 1명과 유일하게 일치하면 자동 계정 연결 |
| 참가자 연결 | 이메일 불일치 시 NASA 이메일 소유 인증 후 운영팀이 공식/서울 등록·기존 연결을 대조해 수동 승인. 중복·정지 등 충돌은 자동 해제하지 않음 |
| NASA 이메일 입력 | 입력만으로 인증·승인하지 않음. 인증 링크 완료는 주소 소유 증빙이며 허브 이용 승인과 별개 |
| 안정적인 신원 | 내부 participant_id는 불변. 화면의 ORBIT 코드와 구분 |
| 개인 메뉴 | 01 내 프로필 / 02 받은 관심 \| 보낸 관심 |
| 팀 오너 메뉴 | 01 내 프로필 / 02 내 팀 관리 / 03 받은 관심 / 04 보낸 관심 |
| 참가자 프로필 | 현재 역할 최대 3개, 희망 역할 최대 3개, 관심 Challenge 최대 3개 |
| Challenge UI | 프로필 5개 주제는 기본 접힘, 선택 그룹 노란색, 동그라미에 아래/위 화살표. 팀 찾기 상태 오른쪽에 선택한 Challenge 최대 3개 노란 태그 요약. 탐색에는 전체 포함 원형 버튼 6개 |
| 참가자 팀 찾기 | seeking / paused / completed. 확인된 팀 소속이 생기면 완료로 자동 변경. 기존 대화 유지, 재개 선택 가능 |
| 팀 오너 모집 상태 | seeking / paused / completed. NASA 공식 상태 및 오너 개인 팀 찾기 상태와 별개 |
| 대원 목록 | 승인된 로그인 사용자만 조회. 비로그인 응답에 실제 대원 자료를 넣지 않음 |
| 연락 방향 | 참가자→팀 오너, 팀 오너→대원, 대원→대원 가능 |
| 관심 메시지 | 최초 관심 포함, 한 대화당 총 5개. 시작자 3개 / 답변자 2개, 순서 교대, 각 최대 50자 |
| 자동 종료 | 마지막 메시지 후 5일(120시간) 미응답. 기록·사용 횟수 유지, 응답 시 기한 재계산 |
| 새 관심 제한 | 행사별 같은 두 참가자 사이에 최대 3개 대화, 동시 활성 대화 최대 1개. 팀/대원 경로와 시작자 변경에도 같은 제한 |
| 대화 조회 | 두 당사자만 조회. 받은·보낸 목록은 같은 대화 데이터를 상대 관점으로 표시 |
| 대화 UI | 기본 접힘, 오른쪽 위 답변 필요/대기. 사용·남은 횟수는 한 줄, 5회 완료는 횟수 옆 표시 |
| 색 | 내부 관심·답변·로그 CTA는 버건디, 이메일은 파랑, 수신 미동의 이메일은 회색 비활성 |
| 이메일 동의 | ‘Team Owner에게 받기’와 ‘팀을 찾는 대원에게 받기’를 각각 선택 |
| 이메일 | 서버가 기존 수신 동의를 재검사. 발송자가 자기 이메일 공개에 동의하면 검증된 주소를 Reply-To로 전달. 답장은 허브 밖에서 진행하며 수신자도 답장 시 주소가 보일 수 있음. 본문·외부 답장 미저장, 발송 메타데이터만 저장 |
| 팀명·Challenge | NASA Space Apps 공식 팀 정보에서 가져오며 팀 오너가 허브에서 수정 불가 |
| 팀 모집 수정 | 찾는 역할 최대 5개, 광고 문구 최대 240자. 상태 확인→팝업→팝업 안에서 저장 |
| 팀 가입 | 관심·답변·이메일은 가입 확정이 아님. 실제 소속은 검증된 Membership 기록으로 별도 관리 |
| 규모 가정 | 약 100명, 1인 최대 50회 이용을 예상한 추정치. 아직 서비스 사용 상한으로 확정하지 않음 |

## 3. 이번 코드 점검 결과

### 확인한 것

- `npm run check` 통과. `interest-threads.js`, `workspace-ui.js`도 별도 문법 검사 통과.
- 상태 로직 테스트, 정적 구조·링크·모바일 규칙 테스트, 인증 설정·클라이언트 Secret 금지 테스트 각각 통과.
- 대화 정책 함수 검사: 시작자 3 / 답변자 2 / 총 5, 교대 순서, 제3자 답변 불가 확인.
- DOM ID 중복 없음, HTML에 쓰인 스크립트의 빌드 포함 확인, 운영 HTML에 preview.js 미포함 확인.
- 팀 오너 5개 역할 설정, 개인 통합 메뉴, 미리보기 단계에 saveState 호출이 없고 팝업 저장에만 저장 동작이 있는 것 확인.
- 데스크톱/모바일 CSS 분기 존재. **실제 모바일 브라우저의 시각·터치 검수 완료를 의미하지 않는다.**

### v67에서 수정·검증한 역할 흐름

- 비로그인·승인 대기의 참가 확인 완료/체크리스트 표시 제거. 검토 화면에서 요청 전·접수 후를 구분.
- 검토용 프로필·모집 저장과 상대 목록·버블 수 연결. 참가자·오너 이메일 버튼의 상대 수신 동의 갱신.
- 역할별 서로 다른 ORBIT 코드, 메뉴 직접 접근 복원, 동시 활성 예시 대화 중복 제거. verified membership을 여정 근거로 사용.
- 예전 정적 테스트 기준 개정. `npm run check`, `npm test`, `npm run test:roles` 통과. DOM 기반 양방향 답변·3+2·중복/3개 제한·모집 미리보기/저장·상태 숨김·동의 검사.
- 브라우저 smoke 시나리오는 현재 네 역할 기준으로 개정했지만 Chromium 설치 실패로 실화면 검수는 미완료. 실제 모바일/터치 검증과 실제 두 계정·두 기기 서버 통합 검증은 남음.

### 실제 DB 연결 때 남은 기능

| 항목 | 서버 구현 지시 |
|---|---|
| 인증·계정 연결 | 서버 세션·자동 유일 매치·불일치 NASA 이메일 소유 인증·운영자 승인 구현 |
| 검토용 목록·프로필·모집 | 공유 localStorage 대신 실제 participant_id/team_id와 API 사용. 실제 대원 자료를 비로그인 HTML에 넣지 않음 |
| 수신 동의 | 실제 수신자·역할별 최신 동의를 서버에서 확인. 미확인/미동의 기본 거부 |
| 대화 | 두 당사자의 같은 thread_id, UUID pair_key로 행사별 3개/동시 1개, 차례·3+2·50자·동시성·중복 검사 |
| 참가여정·팀 소속 | 서버에서 확인된 등록·프로필·Membership·프로젝트 상태 사용. verified 소속 전환 시 seeking_status 자동 완료 |
| 공식 팀 수집·7일 숨김 | 고정 스냅샷을 실제 수집/갱신 기록으로 교체. 7일 자동 숨김은 예정임을 화면에 표시했으며 서버 구현 전에는 동작으로 간주하지 않음 |
| ORBIT 코드 | 테스트 ID는 구분했지만 실제 고유성·변경 횟수 제한은 서버에서 구현 |
| Resend 인증 링크 | 5.3A의 계약을 추가했으나 링크 발급·검증·메일 서버는 미구현 |

v67 화면 검토 흐름의 수정과 실제 인증·DB·발송 연결을 구분한다. 이번 정책 보완은 문서 통합이며 추가 화면/서버 배포 완료를 뜻하지 않는다.

## 4. 데이터 공통 규칙

- 아래 Sheet는 **새 운영 DB 설계안**이다. 원본 Forms 응답 Sheet는 읽기 전용으로 보존하고 승인 없이 수정하지 않는다.
- 열 이름은 영문 snake_case, 화면 라벨은 한국어로 사용한다. Google Sheets는 테이블 저장소이며 접근권한·검증·동시성은 서버의 책임이다.
- 내부 PK는 서버가 생성하는 UUID. `participant_id`, `team_id`, `thread_id`는 이메일·행 번호·ORBIT 코드·URL slug에서 만들지 않는다.
- FK는 다른 표의 불변 PK를 가리킨다. 관계를 이메일/이름 문자열로 저장하지 않는다.
- `created_at`, `updated_at` 등 시각은 ISO 8601 UTC. 화면만 KST로 변환한다.
- boolean은 TRUE/FALSE, 미확인은 빈 값 또는 별도 enum. 동의가 없으면 false로 처리한다.
- JSON 배열은 작은 프로필 목록에 한해 허용한다. 예: `["software","design"]`. 일반 DB 이전 시 관계 테이블로 정규화한다.
- 이메일은 원본값과 매칭용 정규화값을 구분한다. Gmail 점/플러스 제거 등으로 다른 주소를 임의 합치지 않는다. 소셜 신원은 `(provider, provider_user_id)`로 고유하게 식별한다.
- 저장·수정·응답에는 서버 권한 검사를 적용한다. UI hidden, localStorage, `?role=owner`는 권한 근거가 아니다.
- 최소 수집 원칙: 본 단계에 필요한 상태·증빙 참조만 저장. 보호자 상세·개인 서류·이메일 본문을 공개 데이터에 포함하지 않는다.

## 5. 필요한 Sheet와 DB Label

‘필수’는 인증·프로필·팀·연락 기능을 실제 운영할 때의 기준이다. 첫 연결 단계에서 모든 표를 한꺼번에 채울 필요는 없다.

### 5.1 Participants_Private — 참가자 원본·확인 상태 [1단계 필수, 비공개]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| participant_id | 참가자 내부 ID / UUID, PK, 불변 |
| event_id | 행사 ID / `seoul-2026` 등 |
| nasa_email | NASA 공식 등록 이메일 / 원본 문자열 |
| nasa_email_normalized | NASA 이메일 매칭값 / 서버 생성 |
| name_ko | 한국어 이름 / 비공개 |
| name_en | 영문 이름 / 비공개 |
| nasa_registration_status | 공식 등록 상태 / unverified, registered, waitlisted 등 실제 원본 상태 |
| seoul_form_status | 서울 참가 확인 Form 상태 / missing, submitted, verified |
| participation_status | 서울 참가 자격 / pending, confirmed, ineligible, withdrawn |
| approval_status | 허브 이용 승인 / pending, approved, rejected, suspended |
| approved_at | 승인 시각 / UTC |
| approved_by | 수동 승인 운영진 ID / 자동 처리 시 빈 값, 개인을 시스템으로 가장하지 않음 |
| approval_method | 허브 승인 방식 / verified_email_match, admin_manual |
| guardian_review_status | 보호자 확인 / not_required, pending, verified, rejected |
| source_record_ref | 원본 참가 기록 참조 / 운영진 전용 |
| created_at, updated_at | 생성·수정 시각 / UTC |

NASA Waitlist와 허브 승인 상태를 같은 열에 넣지 않는다. 미성년 자료 상세는 추후 별도 비공개 표에서 연결한다. 모든 private 열을 프론트에 반환하지 않는다.

### 5.2 Auth_Identities — 소셜 계정 연결 [1단계 필수, 비공개]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| auth_identity_id | 소셜 신원 ID / UUID, PK |
| participant_id | 연결 참가자 ID / FK, 승인 연결 전에는 빈 값 |
| provider | 로그인 제공자 / google, naver |
| provider_user_id | 제공자 고유 사용자 ID / 문자열 |
| provider_email | 소셜 이메일 / 제공 가능한 경우, 비공개 |
| provider_email_verified | 제공자가 확인한 이메일 여부 / boolean 또는 미확인 |
| linked_status | 연결 상태 / pending, linked, rejected, unlinked |
| created_at, linked_at | 최초 로그인·연결 시각 / UTC |
| linked_by | 수동 연결 운영진 ID / 자동 처리 시 빈 값 |
| link_method | 연결 방식 / verified_email_match, admin_manual |
| unlinked_at | 연결 해제 시각 / UTC, 선택 |
| last_login_at | 최근 로그인 시각 / UTC |

고유 조건: `(provider, provider_user_id)`. 서버에서 provider_email_verified=true이고 대상 행사 이용 자격을 충족한 참가자 1명만 정확히 매치될 때 자동 연결한다. 승인 거절·정지·철회 상태를 자동 매치로 우회하지 않는다. 검증 이메일이 없거나 제공자의 검증 근거가 확인되지 않으면 수동 경로로 보낸다. 다중 소셜 계정 연결은 기존 연결 충돌 검사·중복 참가자 방지를 적용하며, 모호한 계정 병합은 운영진 확인으로 보낸다. access_token, refresh_token, client_secret, session cookie를 Sheet에 평문 저장하지 않는다.

### 5.3 Auth_Approval_Requests — 승인 대기·결정 기록 [1단계 권장, 비공개]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| approval_request_id | 승인 요청 ID / UUID, PK |
| event_id | 해당 행사 ID |
| verification_id | 현재 NASA 이메일 소유 인증 증빙 / FK, 미인증 시 빈 값 |
| request_version | 판정 동시성 검사 버전 / 정수 |
| auth_identity_id | 요청한 소셜 신원 / FK |
| submitted_nasa_email | 사용자가 입력한 대조용 NASA 이메일 / 비공개 |
| matched_participant_id | 운영진이 찾은 참가자 / FK, 미확인 시 빈 값 |
| request_status | 승인 요청 상태 / pending, approved, rejected, cancelled |
| requested_at | 요청 시각 / UTC |
| reviewed_at, reviewed_by | 검토 시각·운영진 |
| decision_reason_code | 결정 사유 코드 / 내부용 |
| admin_note | 내부 메모 / 비공개, 최소 수집 |

자동 매치에 실패한 사용자가 제출한 요청·재신청·결정 이력은 이 표를 기준으로 관리한다. 지예에게 보내는 새 요청 알림은 부가 기능이며 처리 상태는 이 목록에 기록한다. 승인 전에는 participant_id가 없을 수 있으므로 모든 요청에 참가자 FK를 필수로 요구하지 않는다.

### 5.3A NASA 이메일 소유 인증 — 2026-10-09 정책 보완

첨부 `MY_SPACE_Resend_Auth_Handoff_20261009.txt`를 기존 인증 정책과 통합한다. 이 절차는 구현 계약이며, 현재 v67 정적 허브에는 인증 링크 발급·검증·Resend 발송 서버가 없다. 다른 Codex의 기존 DB·서버를 먼저 대조하고 중복 생성하지 않는다.

**세 상태를 따로 관리한다.** 이메일 소유 인증(Email_Verifications), 참가 등록·자격(Participants_Private), 소셜 계정 연결 승인(Auth_Approval_Requests / Auth_Identities)은 서로 대체하지 않는다. 인증 링크 완료만으로 허브 권한·NASA 등록·보호자 확인·팀 소속을 변경하지 않는다.

#### 반영 정책 / 제안 / 미확정

| 구분 | 내용 |
|---|---|
| 반영 정책 | 제공자가 검증한 소셜 이메일이 해당 행사의 이미 승인되고 자격이 있는 참가 기록 1명과 유일하게 일치하면 기존 자동 연결 유지. 불일치 경로 때문에 전체를 수동 승인으로 바꾸지 않음 |
| 반영 정책 | 이메일 불일치 시 NASA 등록 이메일 입력 → 해당 주소로 인증 링크 → 요청한 소셜 계정으로 로그인하여 명시적 확인 → 운영팀 대조·수동 승인 → 기존 participant_id 연결 |
| 반영 정책 | 직접 입력한 이메일은 증거가 아님. 인증 완료도 주소 소유 증빙일 뿐, 이용 승인 아님 |
| 반영 정책 | 승인 요청 목록이 처리 기준. 운영자 알림은 선택적이며 mailto 또는 메일 답장 ‘OK’로 DB 자동 승인하지 않음 |
| 반영 정책 | 운영팀은 NASA 이메일·Seoul 등록·서울 Form·이름·기존 계정 연결 충돌을 대조. 한글/영문 이름 차이는 추가 확인 사유, 자동 거절 근거 아님 |
| 반영 정책 | 인증 링크 GET은 상태를 변경하지 않음. 로그인된 요청 계정의 명시적 POST 확인으로만 1회 소비. 다른 기기도 동일 소셜 계정으로 로그인하면 확인 가능 |
| 반영 정책 | 재발송·대상 이메일 변경·취소 시 이전 토큰 철회. 이메일 인증으로 기존 거절·정지·철회를 해제하거나 다른 계정 연결을 덮어쓰지 않음 |
| 반영 정책 | 팀 연락 수신 동의·발신자 주소 공개 동의·Reply-To 정책은 유지. 인증 성공으로 수신 동의를 켜지 않음 |
| 설정 제안 | 링크 유효시간 30분, 재발송 간격 60초, 계정별 및 대상 이메일별 시간당 3회. 수치는 아직 확정하지 않고 서버 설정값으로 준비 |
| 미확정 | 서비스 전체 일일/월간 발송 한도, 인증·팀 연락의 쿼터 배분, 인증 기록 보관·삭제 기간, 문의 처리 SLA |
| 구현 전 확인 | Resend 실제 계약 한도·발송 도메인·서버 배포 위치·기존 DB/API·원자적 저장 경로. 요금·무료 한도를 이 문서에서 확정하지 않음 |

#### 계정별 상태 전이와 화면

| 조건 | 다음 상태 / 권한 | 화면·다음 행동 |
|---|---|---|
| 검증된 소셜 이메일과 승인된 참가자 1명 유일 일치, 충돌 없음 | linked; 참가자 권한 부여 | MY SPACE로 이동 |
| 소셜 이메일 불일치 또는 제공자 검증 근거 불명 | pending; 권한 없음 | ‘NASA 등록 이메일을 인증해주세요.’ 이메일 입력·인증 메일 요청 |
| 발송 실패·한도 초과 | pending 유지, 이메일 미인증 | 실패/재시도 가능 시각과 문의 경로. 발송 완료로 표시하지 않음 |
| 업체 발송 접수 성공 | pending + 이메일 인증 대기 | ‘인증 메일을 요청했습니다. 메일의 링크를 확인해주세요.’ delivered와 구분 |
| 유효 링크 + 요청 계정으로 명시적 확인 | pending + 이메일 verified | ‘이메일 인증이 완료되었습니다. 운영팀이 참가 기록을 확인하고 있습니다.’ |
| 만료·철회·다른 계정·잘못된 토큰 | pending 유지, 인증 거부 | 재발송 또는 요청한 계정으로 로그인. 타인 계정 정보·명단 일치 여부는 비공개 |
| 이미 사용한 링크 | 추가 기록·승인 없음 | 같은 요청자에게 현재 상태 안내, 중복 클릭도 1회만 처리 |
| 중복 참가 기록·다른 계정에 연결·정보 불일치 | pending 또는 기존 제한 상태 유지 | 운영팀 추가 확인. 이메일 인증만으로 병합하지 않음 |
| 거절·정지·철회 계정 | 기존 제한 유지 | 수동 문의·검토 경로. 자동 해제 금지 |
| 공식/서울 등록 자료 확인 불가 | pending, 권한 없음 | 등록·서울 참가 확인 안내와 수동 문의. 명단 포함 여부를 외부에 노출하지 않음 |
| 운영팀 승인, 최신 자격·충돌 재검사 성공 | linked; 기존 participant_id 유지 | 다음 서버 세션 조회부터 MY SPACE 이용 |

운영자 UI의 구분: **이메일 미인증 / 이메일 인증 완료·운영팀 확인 대기 / 추가 확인 / 승인 / 거절**. 사용자 입력 이메일, 이메일 인증 시각, 공식 등록과 서울 Form 근거, 이름 차이, 중복 연결, 보호자 확인 상태를 따로 표시한다. 미성년자 정책의 자격 판단은 기존 정책을 적용하며 주소 인증만으로 충족 처리하지 않는다.

#### 최소 저장 항목 — 기존 구조에 추가

`Auth_Approval_Requests` 추가 후보: `event_id`, `verification_id`(현재 증빙 FK), `request_version`(승인 동시성 검사). 기존 request_status는 승인 상태의 기준이고, 인증 상태를 그 열에 합치지 않는다. 승인 완료 후에는 Auth_Identities 연결 상태·Participants_Private 이용 자격을 함께 검사한다.

| Email_Verifications 열 | 의미 |
|---|---|
| verification_id | UUID, PK |
| approval_request_id | 해당 승인 요청 FK |
| auth_identity_id | 요청한 안정적인 소셜 신원 FK; 세션에서 확정 |
| event_id | 해당 행사 |
| normalized_email | 인증 대상 NASA 이메일; 비공개 |
| token_hash | 안전한 난수 토큰의 해시만 서버 저장; 브라우저·공개 응답 금지 |
| status | pending, verified, expired, revoked |
| created_at, expires_at | 발급·만료 시각 UTC |
| verified_at, revoked_at | 성공 확인·철회 시각 UTC |

발송 메타데이터는 기존 Email_Delivery_Log를 재사용할 수 있으면 `purpose=auth_verification`, `verification_id`, `provider_message_id`, `send_status`, `sent_at`, `failure_code`만 추가한다. 기존 표가 참가자 FK를 필수로 요구하면 미연결 계정도 기록할 수 있는 별도 인증 발송 표를 사용한다. 팀 연락 로그의 동의 검사를 인증 메일 발급과 혼동하지 않는다. 본문·원문 토큰·인증 링크 전체를 로그에 저장하지 않는다. 재발송 제한·전체 발송 예산·중복 요청 키는 서버의 공용 저장 경로에서 영속적으로 관리하며 메모리 카운터만 사용하지 않는다.

#### 서버/API 구현 계약

1. OAuth 검증 후 안정적인 AuthIdentity와 pending 세션 생성. 기존 유일 매치 자동 연결을 먼저 검사한다.
2. `POST /auth/approval-requests`: NASA 이메일 대조 요청 생성/갱신. 세션 신원 사용, 클라이언트 participant_id를 신원 증거로 신뢰하지 않음.
3. `POST /auth/email-verifications`: 발급/재발송. 계정·대상·전체 한도 검사, 토큰을 요청 ID·신원·행사·이메일·만료에 연결, 해시 저장 후 Resend 발송. 업체 접수와 인증 완료를 구분.
4. 링크 GET 화면: 인증한 요청 계정으로 로그인 안내. GET·메일 검사기 방문으로 상태 변경하지 않음.
5. `POST /auth/email-verifications/confirm`: 계정·요청·토큰·만료·철회·사용 여부 검사와 1회 소비를 원자적으로 수행. 이메일 verified만 기록하고 참가자 권한 부여하지 않음.
6. `GET /auth/session`: 본인의 최소 인증/승인 상태. 관리표·명단 전체를 응답하지 않음.
7. `GET /admin/approval-requests`, `POST /admin/approval-requests/:id/decision`: 운영자 권한·request_version·최신 참가 자격·인증 증빙·계정 충돌 확인 후 수동 승인/거절/추가 확인. 승인 이력 기록.

Sheets를 쓰면 모든 writer가 동일한 직렬화/잠금 경로를 사용해야 한다. 단순 Worker 메모리 잠금은 불충분하다. 토큰 소비와 승인·중복 연결을 보장하지 못하는 구조에서는 검증되지 않은 성공 응답을 하지 말고 원자적 저장 경로를 먼저 마련한다. 원본 Forms/Sheets는 읽기 전용이다.

링크 추적을 끄고 URL·로그·분석 도구에 토큰이 남지 않게 한다. 확인 화면에 제3자 추적·리소스를 넣지 않고 Referrer-Policy를 적용한다. Secret은 서버 전용. 설정 이름 후보: `RESEND_API_KEY`, `VERIFICATION_FROM_EMAIL`, `PUBLIC_HUB_ORIGIN`, `EMAIL_VERIFICATION_TTL_SECONDS`, `EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS`. OAuth·Sheets·세션 설정은 기존 계약 재사용. `/my-space`의 API origin·cookie·callback·토큰 URL 처리 가능성을 실제 배포 환경에서 확인한다.

#### 기존 설명 수정안

| 이전 설명 | 통합 수정안 |
|---|---|
| 이메일이 다르면 NASA 이메일 입력 후 운영팀 확인 | 입력 → NASA 이메일 소유 인증 → 운영팀 등록·연결 승인 |
| 이메일 매치 시 자동 승인 | 제공자가 검증한 이메일이 **이미 승인된 자격 있는 참가자 1명**과 유일하게 일치하면 자동 계정 연결; 임의 신규 승인 아님 |
| 링크 인증을 마치면 MY SPACE 사용 | 이메일 소유만 확인. 불일치 경로의 이용 승인·계정 연결은 운영팀 판단 후 |
| 요청 메일에 운영자가 OK 답장 | 서버 승인 목록에서 권한 있는 운영자가 판정. 이메일 알림/답장은 승인 API 대신 사용할 수 없음 |
| 승인 대기 한 화면 | 이메일 입력·발송/재발송·인증 대기·만료/실패·운영팀 확인 대기로 구분 |

#### 구현 범위와 인수 조건

정책·스키마·UI 상태 계약은 이번에 통합한다. 실행 가능한 서버·OAuth·실제 Resend 발송·DB 연결은 후속 구현이다. 현재 화면의 모의 요청 접수는 이메일 소유 인증 완료 증빙이 아니다.

- 잘못된/만료/사용/철회 토큰과 다른 소셜 계정 거부. 단순 GET은 변경 없음. 재발송 이전 링크 거부.
- 동시 확인·더블클릭에도 1회 소비. 서버 재시작 후 상태 유지. 이메일 인증 후에도 pending API 접근 차단.
- 운영자만 승인; 판정 직전 최신 자격·인증 증빙·충돌 재검사. participant_id 유지, 다중 계정 자동 병합 금지.
- 발송 실패·한도 초과·Sheets 장애에서 성공 표시 금지. 안전한 재시도와 등록/문의 링크 제공.
- 실명·이메일 명단·타인 연결 상태·Secret·토큰 노출 없음. 미성년 확인·팀 연락 동의·횟수·Reply-To와 별도 작동.
- mock 검증과 실제 OAuth 복귀·메일 수신·시트 반영·모바일 검증을 구분. 연결된 키·도메인·승인된 테스트 계정 범위에서만 실제 통합 검증. 기존 비공개 공유 범위 유지.

### 5.4 Participant_Profiles — 참가자가 관리하는 프로필 [2단계 필수]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| participant_id | 참가자 ID / FK, PK |
| display_id | 화면 Random ID / 고유 ORBIT 코드, 내부 ID와 별개 |
| display_id_change_count | Random ID 변경 횟수 / 정수 |
| avatar_code | 캐릭터 선택 / none, satellite 등 허용된 코드 |
| current_role_ids_json | 현재 가능한 역할 / 역할 ID 배열, 최대 3 |
| desired_role_ids_json | 희망 역할 / 역할 ID 배열, 최대 3 |
| bio | 자기 홍보 한 줄 / 최대 160자 |
| challenge_ids_json | 관심 Challenge / ID 배열, 최대 3 |
| email_from_owner_opt_in | Team Owner에게 이메일 받기 / boolean |
| email_from_peer_opt_in | 팀 찾는 대원에게 이메일 받기 / boolean |
| email_from_owner_consent_at | 오너 수신 동의 변경 시각 / UTC |
| email_from_peer_consent_at | 대원 수신 동의 변경 시각 / UTC |
| seeking_status | 팀 찾기 상태 / seeking, paused, completed |
| seeking_status_updated_at | 팀 찾기 상태 변경 시각 / UTC |
| profile_status | 프로필 작성 상태 / draft, completed. 팀 찾기 완료와 구분 |
| updated_at | 수정 시각 / UTC |

seeking만 대원 목록에 노출하고 새 관심을 받는다. paused/completed는 숨기고 새 관심을 막지만 기존 대화·답변·기록은 유지한다. 이메일 수신 동의는 별개이며 허용 여부를 발송 시 검사한다. verified 팀 소속이 생기면 completed로 자동 설정한다. 사용자는 필요하면 팀 찾기를 다시 시작할 수 있으며, 소속이 있다는 이유로 매 로그인마다 수동 선택을 덮어쓰지 않는다. 오른쪽 Challenge 요약은 challenge_ids_json과 기준표에서 파생하며 별도 이름 복사 열을 만들지 않는다.

검토 데이터의 체크값을 실제 이용자의 동의로 복사하지 않는다. 동의 미확인은 false. 프로필 공개는 승인된 사용자에게 제공할 별도 API 필드 목록으로 제한한다.

### 5.5 Teams — 공식 팀 정보 + 서울 모집 설정 [2단계 필수]

| 열 이름 | 한국어 라벨 / 형식·수정 주체 |
|---|---|
| team_id | 팀 내부 ID / UUID, PK |
| event_id | 행사 ID |
| nasa_team_external_id | NASA 팀 외부 ID / 공식 식별자 확보 시 저장 |
| nasa_team_url | Space Apps 팀 상세 URL / 검증된 공식 HTTPS URL |
| nasa_team_name | 공식 팀명 / 동기화·운영진, 오너 수정 불가 |
| nasa_challenge_id | 공식 Challenge ID / 동기화·운영진, 오너 수정 불가 |
| nasa_seeking_members | 공식 Seeking Members 상태 / boolean 또는 미확인 |
| nasa_synced_at | 공식 정보 최종 갱신 / UTC |
| owner_participant_id | 검증된 Team Owner / FK, 미검증은 빈 값 |
| owner_verification_status | 오너 검증 / unclaimed, pending, verified, rejected |
| owner_verified_at, owner_verified_by | 오너 검증 기록 |
| recruitment_role_ids_json | 찾는 역할 / 역할 ID 배열, 최대 5, 오너 수정 |
| recruitment_copy | 팀 광고 문구 / 최대 240자, 오너 수정 |
| member_count_reported | 오너가 입력한 현재 인원 / 검증된 소속과 구분 |
| openings_reported | 추가 모집 인원 / 정수, 인원 합계 최대 6 |
| recruitment_status | 허브 모집 상태 / seeking, paused, completed |
| recruitment_status_updated_at | 허브 모집 상태 변경 시각 / UTC |
| last_confirmed_at | 모집글 최종 상태 확인·저장 시각 / UTC |
| visibility_expires_at | 재확인 기한 / UTC, 7일 규칙 적용 시 |
| updated_at | 수정 시각 / UTC |

모집 중(seeking)만 허브 모집 목록에 표시한다. paused/completed는 숨기고 새 관심을 막지만 기존 대화·기록은 유지하며 재개 가능하다. 기존 open→seeking, closed→completed 변환은 실제 의미를 검토한다. draft는 게시 여부로 구분하고 모집 3상태에 섞지 않는다. 기존 seeking boolean은 recruitment_status에서 계산하고 독립적으로 서로 다른 값을 저장하지 않는다. 팝업 미리보기/닫기는 저장하지 않고 팝업의 모집글 저장에서 상태·시각·모집 내용을 함께 반영한다.

공식 미등록/소유 미검증 팀에 임의로 오너 권한을 주지 않는다. 공식 팀 정보와 허브 모집 설정은 하나의 내부 team_id로 연결하고, 목록·팝업에서 같은 데이터를 사용한다. 팀 카드 이메일은 확인된 owner_participant_id로 전달하며 해당 오너의 email_from_peer_opt_in을 기준으로 한다. 별도 Teams 수신 동의를 만들지 않는다. 오너 미연결 또는 최신 수신 동의 미확인 상태는 이메일을 허용하지 않는다.

### 5.6 Team_Memberships — 실제 팀 소속 [2단계 필수, 가입 판정용]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| membership_id | 소속 기록 ID / UUID, PK |
| team_id, participant_id | 팀·참가자 FK |
| membership_role | 팀 내 역할 / owner, member |
| membership_status | 소속 확인 / pending, verified, left, rejected |
| source | 확인 근거 / nasa_snapshot, admin_verified |
| joined_at, left_at | 합류·탈퇴 시각 / 확인 가능한 경우 |
| verified_at, verified_by | 운영진 확인 |

Contact_Request 수락이나 답변으로 이 표를 자동 생성·verified 처리하지 않는다. Team Owner도 승인된 참가자이며, 별도 검증된 소유 관계로 권한을 얻는다. 진행 상태는 verified 소속을 기준으로 한다. owner/member 모두 pending→verified 또는 신규 verified 소속 확정 시 프로필 seeking_status=completed로 처리한다. 관심 요청·모집 초안은 근거가 아니다. 팀 모집 상태는 변경하지 않는다.

### 5.7 Interest_Threads — 관심 1건의 두 당사자 [2단계 필수, 당사자 전용]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| thread_id | 관심 대화 ID / UUID, PK |
| event_id | 행사 ID |
| pair_key | event_id와 두 participant_id를 정렬해 만든 서버 고유 조합 / 팀 경로·발신 순서 무관 |
| starter_participant_id | 첫 관심을 보낸 참가자 / FK |
| recipient_participant_id | 실제 답변자 / FK. 팀 대상이라도 당시 검증된 오너를 지정 |
| target_type | 관심 대상 / team, participant |
| target_team_id | 관심 대상 팀 / FK, team인 경우 필수 |
| target_participant_id | 관심 대상 대원 / FK, participant인 경우 필수 |
| thread_status | 서버 대화 상태 / active, completed, expired |
| idempotency_key | 최초 요청 중복 방지 키 / 호출별 고유 문자열 |
| version | 동시 수정 충돌 감지 / 정수 |
| created_at, updated_at | 생성·최근 변경 시각 / UTC |
| last_message_at | 마지막 메시지 저장 시각 / 서버 UTC |
| expires_at | last_message_at + 120시간 / 서버 UTC |
| closed_reason | 종료 사유 / message_limit, inactivity |
| closed_at | 종료 시각 / 선택 |

행사 기간 동안 같은 pair_key의 대화는 최대 3개, 활성(active) 대화는 최대 1개다. 마지막 메시지의 서버 UTC 시각부터 120시간 경과 시 expired로 종료하고 기록/메시지/사용 횟수는 유지한다. 응답 저장 시 last_message_at과 expires_at을 다시 계산한다. 조회/새 요청/답변 트랜잭션에서 만료를 먼저 반영하고 이미 종료된 대화에는 답변을 저장하지 않는다. 활성 대화가 있으면 새 관심을 저장하지 않고 기존 thread로 안내한다. 종료 후 남은 대화 한도 안에서 재요청할 수 있다. 팀 대상은 당시 검증된 owner_participant_id로 계산하므로 팀/대원 경로 전환이나 발신자 교대로 제한을 우회하지 못한다. 제한 검사는 첫 메시지 저장과 함께 서버에서 원자적으로 수행한다. 임의 종료/삭제로 전체 대화 사용 횟수를 초기화하지 않는다.

시작자와 답변자는 서로 다른 참가자여야 한다. received/sent Sheet를 따로 만들어 메시지를 복사하지 않는다. 받은/보낸 목록은 현재 참가자 ID로 필터링한다. 오너 변경 시 대화 접근권한을 신규 오너에게 자동 이전하지 않는다.

### 5.8 Interest_Messages — 최초 관심과 답변 로그 [2단계 필수, 당사자 전용]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| message_id | 메시지 ID / UUID, PK |
| thread_id | 소속 관심 대화 / FK |
| sequence_no | 대화 순서 / 1~5 |
| sender_participant_id | 작성자 / 두 당사자 중 하나 |
| message_text | 짧은 메시지 / 1~50자 |
| created_at | 전송 시각 / 서버 UTC |
| idempotency_key | 중복 전송 방지 키 |

고유 조건: `(thread_id, sequence_no)`와 요청 idempotency_key. 1·3·5는 시작자, 2·4는 답변자. 기존 메시지 수정은 이번 UI 범위에 없으므로 기본 불가. 첫 관심과 첫 메시지는 하나의 성공 작업으로 처리한다.

사용/남은 횟수, 현재 차례, 화면의 ‘답변 필요/대기’, 마지막 메시지 시각은 이 표에서 계산한다. 클라이언트가 보내는 used_count·remaining_count를 믿거나 별도 상태값으로 중복 저장하지 않는다. 총 5개가 되면 thread_status=completed로 정리하되 파생 계산으로 복구 가능하게 한다.

### 5.9 Email_Delivery_Logs — 이메일 발송 메타데이터 [2단계 필수, 제한 공개]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| email_delivery_id | 발송 기록 ID / UUID, PK |
| sender_participant_id, recipient_participant_id | 발신·수신 참가자 FK |
| context_team_id | 관련 팀 / FK, 없으면 빈 값 |
| context_thread_id | 관련 관심 대화 / FK, 선택 |
| sender_role_at_send | 발송 당시 권한 / owner, participant |
| consent_scope_checked | 확인한 수신 동의 / from_owner, from_peer, team_contact |
| consent_checked_at | 동의 확인 시각 / UTC |
| sender_email_disclosure_consent_at | 이번 발송자의 이메일 공개 동의 시각 / 서버 UTC |
| sender_email_disclosure_consent_version | 동의한 공개·외부 답장 안내 버전 |
| delivery_status | 발송 상태 / requested, provider_accepted, delivered, failed, blocked |
| provider_message_id | 이메일 업체 발송 ID / 비공개 내부 조회 |
| idempotency_key | 중복 발송 방지 키 |
| requested_at, sent_at | 요청·업체 접수 시각 / UTC |
| error_code | 오류 코드 / 본문·이메일 주소 포함 금지 |

발송 팝업은 발송자 자기 주소 공개 동의만 받는다. 수신자는 프로필에서 이미 동의했으므로 발송마다 새 동의를 요청하지 않고 서버가 최신 동의를 검사한다. From은 서비스가 검증한 발신 도메인, Reply-To는 서버가 확인한 발송자의 연락 이메일이다. 주소는 처음 탐색 화면에 노출하지 않지만 이메일 발송 시 발송자 주소를 상대에게 전달한다. 상대가 개인 이메일로 답장하면 상대 주소도 발송자에게 공개될 수 있다. 외부 답장 수집·관리 기능은 없다.

**message_body·메일 본문·이메일 주소는 이 발송 로그 표에 넣지 않는다.** 실제 수신 주소는 서버가 승인된 신원/참가 기록에서 찾아 발송에만 사용한다. 업체의 delivered 신호가 없으면 ‘전달 완료’로 표시하지 않는다. 본문은 서버·에러 로그에도 남기지 않도록 로그 처리한다. 이메일 서비스 자체의 처리·보관 정책과 사이트 DB 미저장은 별개다.

### 5.10 Admin_Audit_Log — 운영 변경 이력 [실제 승인부터 권장, 비공개]

| 열 이름 | 한국어 라벨 / 형식 |
|---|---|
| audit_id | 감사 기록 ID / UUID, PK |
| actor_id | 처리 운영진 ID |
| action_type | 승인·거절·연결 해제·오너 검증·모집 수정 등 |
| target_table, target_id | 변경 대상 표·내부 ID |
| changed_fields_json | 변경한 열 목록 / 비밀·본문 미포함 |
| reason_code | 처리 사유 / 선택 |
| created_at | 처리 시각 / UTC |

### 5.11 기준 데이터 — Themes / Challenges / Roles [2단계 기준표]

| Sheet | 열 이름 / 한국어 의미 |
|---|---|
| Themes | theme_id(PK), title_en(영문명), title_ko(한국어명), display_order(순서), is_active(활성) |
| Challenges | challenge_id(PK), nasa_challenge_external_id(공식 ID), challenge_number(번호), title_en(공식명), theme_id(FK), official_url(공식 상세), synced_at(갱신 시각), is_active(활성) |
| Roles | role_id(PK), label_en(영문 라벨), label_ko(한국어 라벨), display_order(순서), is_active(활성) |

현재 역할 ID: software, data-ai, science, product, design, story, business, other.
현재 테마 ID: mission, earth, climate, human, discovery. **현재 CHALLENGE_GROUPS와 대응을 유지한다.** 제목의 표시 순서/영문명은 현재 화면을 기준으로 하고 공식 Challenge와 서울 참고 분류를 구분한다. 변경되는 공식 데이터는 연결 시 원본과 재대조한다.

### 5.12 후속 확장 — 지금 먼저 수집하지 않을 표

| Sheet | 목적 / 최소 후보 열 |
|---|---|
| Projects | project_id(PK), team_id(FK), nasa_project_external_id, official_project_url, submission_status, verified_at |
| Participant_Progress | participant_id(FK), event_id, project_id(FK), submission_verified_at, completion_verified_at, source_record_ref. 단순 화면 단계는 파생 계산 가능하면 중복 저장하지 않음 |
| Guardian_Reviews | guardian_review_id(PK), participant_id(FK), review_status, reviewed_at, reviewed_by, private_source_ref. 상세 수집·열람 범위는 기존 보호자 절차와 별도 확정 |

## 6. 사용자에게 보이는 상태와 서버 저장값

| 화면 | 계산/근거 |
|---|---|
| 승인 대기 | 신원 연결 요청 pending 또는 참가자 허브 승인 미완료 |
| MY SPACE 진입 | 유효 서버 세션 AND identity linked AND participant approved |
| Team Owner | 위 조건 AND 검증된 팀 소유 관계 |
| 내 답변 필요 | 해당 thread의 두 당사자 AND 내 차례 AND 5개 미만 |
| 대기 | 활성 thread에서 상대 차례 |
| 대화 완료 | message 수=5 또는 별도로 닫힌 상태. 완료를 계속 ‘대기’로만 표현하지 않음 |
| 모집 팀 목록 | 로컬 모집 설정이 있으면 recruitment_status=seeking인 팀만. 공식 목록만 존재하는 미연결 팀의 표시·연락 가능 조건은 별도 확정 |
| 대원 목록 | 세션·허브 승인 확인 후 seeking_status=seeking만 조회 |
| 팀 구성 완료 | 검증된 Team_Memberships 존재. 팀 오너만 팀 구성 완료로 판단하지 않음 |
| 프로젝트·제출·완주 | 해당 공식/운영 기록의 검증값. 팀 모집글 저장만으로 완료 처리 금지 |

참가자에게는 두 메뉴만, 팀 오너에게는 네 메뉴. 공용 카드·상태·버튼·팝업·반응형 스타일은 하나의 구현을 공유한다.

## 7. 아직 확정해야 할 정책 — 구현자가 임의 확정하지 말 것

1. 관심·답변 로그 보관 종료일, 삭제/탈퇴 처리, 행사 종료 후 Alumni로 남길 항목.
2. 팀 카드 이메일→확인된 오너, 오너 개인 peer 동의 사용은 확정됐다. 별도 팀 동의를 생성하지 않는다.
3. 허브 모집 3상태는 확정됐다. 공식 Seeking Members와의 충돌 표시, 오너 미연결 공식 팀의 노출/연락 조건은 추가 결정이 필요하다.
4. 오너 검증 근거·오너 변경 절차. 기존 대화는 기존 두 당사자에게 유지하며 신규 오너에게 자동 이전하지 않는다.
5. 7일 모집글 재확인 규칙의 적용 여부와 안내 방식.
6. 미성년 참가자의 허브 접근·연락 허용과 보호자 확인 절차.
7. 운영진의 메시지 본문 예외 열람 범위. 기본은 당사자 전용이다.
8. 발송자의 Reply-To 및 수신 주소에 사용할 검증된 연락 이메일 기준(NASA 등록/소셜). 본인 입력만으로 변경하지 않는다.
9. 차단 기능의 도입·해제·기존 대화 처리와 이메일 발송 한도. 구체 규칙은 아직 확정되지 않았다.

같은 상대와 최대 3개 대화·동시 활성 1개, 발송자 이메일 공개, 외부 답장, 참가자/오너의 3가지 찾기·모집 상태는 이미 확정된 정책이며 다시 미정으로 취급하지 않는다.

예상 100명×50회는 부하 가정이다. 50회가 관심 대화 50건이라면 최대 5,000 threads / 25,000 messages까지 예상 가능하고, ‘총 행동 50회’면 다른 수치가 된다. 이용 상한과 이메일 발송 한도는 아직 별도 정책이다.

## 7A. 공식 웹페이지 수집·검증·팀 업데이트 계약

2026-10-09 기준: 지예는 다른 채팅방에서 공식 팀 정보 수집 가능성을 수동 1회 실행으로 검증하려 한다. 수동은 프로그램을 사람이 실행하고 결과를 확인한다는 뜻이다. 결과가 이 문서에 전달되기 전까지 수집 성공·자동화 완료를 주장하지 않는다. 공식 API는 제공된다고 전제하지 않으며 AI API는 필수가 아니다.

### 진행 순서

1. 준비 단계: 이 문서의 DB 열·소스 우선순위·팀 수집 전달 형식·미확정 정책 검토.
2. DB 준비: 새 운영용 Sheet에 빈 탭/열 header와 예시 데이터를 만들고 검증. 기존 참가자 원본은 그대로 보존.
3. 최소 인증 연결: 신원·승인·참가자 매핑을 실제 두 테스트 계정으로 검증.
4. 공식 팀 데이터 연결: 검증된 수집 결과를 검증해 Teams 공식 열에 반영하고 실제 목록 조회와 연결.
5. 프로필·모집·관심 답변·이메일을 기능별로 연결·검수.

### 현재 준비된 것 / 아직 준비되지 않은 것

- 준비됨: 허브 Git 소스, 현재 스냅샷의 화면 표시 형식, 공식 팀 상세 URL과 Challenge의 매핑, 모집 중인 팀 필터, 이번 데이터 계약 문서.
- 미구현: 수집 코드의 실제 검증·등록/실행, 인증된 수집 입력 endpoint, 자동 검증·검토·upsert, 전체 등록 팀 수집, 실제 08:00/17:00 스케줄, 실패 알림·실행 이력.
- 현재 `seeking-teams.js`는 2026-10-06 08:00 KST라고 표시된 15개 모집 팀 스냅샷이다. 이것만으로 자동 업데이트 완료를 주장하지 않는다.
- 기존 공식 홈페이지 GitHub repo와 이 Sites repo는 별개의 코드 대상이다. GitHub로의 실제 이전/PR 연결 완료를 주장하지 않는다. Codex가 선택된 repo의 구조를 확인해 소스와 기능을 이식해야 한다.

### 역할 분리

**수집 프로그램:** 공식 Seoul 팀 목록·상세의 공개 정보만 읽는다. 먼저 일반 추출 코드의 가능성을 확인하고, AI는 필요한 해석에만 선택적으로 사용한다. 실제 제공 가능한 API나 공개 웹페이지의 접근·로딩·페이지네이션을 확인한다. 아래 형식으로 결과를 제출한다.

**서버 importer:** 입력 검증·변경 검토·안정적인 team_id 연결·중복 방지·허용된 공식 열 upsert를 담당한다. AI가 임의로 운영 Sheet 전체를 수정하거나 참가자·오너·이메일 동의를 추정해서 쓰지 않는다.

**허브:** DB/API에서 검증된 팀 정보를 읽는다. 사이트 코드와 화면은 Git에서 관리하지만, 팀 데이터가 갱신될 때마다 사이트 코드를 다시 배포해야 하는 구조를 목표로 하지 않는다.

먼저 수동 1회 실행→JSON 추출→원문 표본 대조→범위/누락 확인→dry-run 변경 검토를 수행한다. 검증 후 DB importer와 하루 2회(08:00/17:00 KST) 작업 연결을 진행한다. 아직 예약 실행은 없다. 수집 가능성 검증에서는 실제 DB 수정·배포·예약 실행·비공개 개인정보 수집을 하지 않는다.

### 수집 프로그램 → importer 전달 형식

```json
{
  "schema_version": "1.0",
  "event_id": "seoul-2026",
  "source_run_id": "collector-generated-unique-run-id",
  "source_url": "https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams",
  "fetched_at": "ISO-8601-UTC",
  "coverage": "all_registered_teams",
  "is_complete": false,
  "teams": [
    {
      "source_team_key": "normalized-official-team-url",
      "nasa_team_external_id": null,
      "official_team_url": "https://www.spaceappschallenge.org/2026/find-a-team/amalgo/",
      "official_team_name": "AMALGO",
      "official_challenge_title": "official-title-as-observed",
      "official_challenge_url": null,
      "seeking_members": null,
      "public_skills_raw": [],
      "evidence_url": "https://www.spaceappschallenge.org/2026/find-a-team/amalgo/"
    }
  ]
}
```

위 JSON은 입력 형식 예시이며 새로 수집·검증한 실제 결과가 아니다. 시각·Challenge·Seeking 상태는 실제 확인한 값만 넣는다. 확인 불가 값은 null, 빈 결과·추측값으로 대체하지 않는다.

- `coverage`: all_registered_teams 또는 seeking_members_only. 현재 화면은 모집 팀을 보여도 원본 동기화는 가능하면 등록 팀 전체를 대상으로 한다.
- `is_complete`: 모든 페이지/목록을 빠짐없이 조회한 경우만 true. 부분 결과에서 누락됐다는 이유로 기존 팀을 삭제하거나 모집 종료 처리하지 않는다.
- 외부의 실제 고유 팀 ID가 확인되면 그것을 우선 매칭한다. 없으면 공식 상세 URL을 정규화한 source_team_key를 사용해 기존 team_id에 연결하고 새 팀만 UUID를 생성한다. URL 변경 충돌은 검토 대상으로 남긴다.
- Challenge는 공식 제목/URL을 기준표와 정확히 대조해 내부 challenge_id에 매핑. 모호한 것은 운영진 검토로 보내며 AI 유사도만으로 확정하지 않는다.
- roles/skills의 AI 해석은 별도 제안이다. 원문을 보존하고 공식 확정 사실과 구분한다. 사용자가 입력한 모집 역할·광고 문구를 덮어쓰지 않는다.
- 이름·Challenge 변경은 출처와 변경 전후를 검토할 수 있게 기록한다. 동기화는 공식 열만 변경하고 owner_participant_id, recruitment_copy, recruitment_role_ids_json, 이메일 동의, 관심 대화, 소속 확인을 변경하지 않는다.
- 수집 인증 Secret은 서버 환경변수에만 둔다. 브라우저나 AI 결과 JSON에 넣지 않는다.

### 추가 DB Label: 수집·검토 이력

| Sheet | 열 이름 / 의미 |
|---|---|
| Team_Sync_Runs | sync_run_id(PK), source_run_id(외부 실행 키·고유), event_id, source_url, coverage, is_complete, fetched_at, received_at, run_status(received/needs_review/applied/failed), discovered_count, accepted_count, rejected_count, applied_at, reviewed_by, error_code |
| Team_Source_Staging | staging_id(PK), sync_run_id(FK), source_team_key, nasa_team_external_id, official_team_url, official_team_name, official_challenge_title, official_challenge_url, seeking_members(TRUE/FALSE/미확인), public_skills_raw_json, evidence_url, matched_team_id(FK·미확정은 빈 값), mapped_challenge_id(FK·미확정은 빈 값), validation_status(valid/needs_review/rejected), review_note, applied_at |

별도 Team_Sync_Runs/Team_Source_Staging은 공식 팀 수집 연결 시 추가한다. 최초 인증만 연결하는 단계에서는 필수 생성 대상이 아니다. 명시된 시각의 자동 실행은 실제 job 등록과 실패 재시도까지 확인한 후 운영 화면에 표시한다.

### Codex가 준비할 파일·검증물

- 팀 수집 입력 JSON Schema와 샘플 파일, 입력 validator, dry-run importer, 검토 가능한 변경 diff, 승인된 결과의 upsert 함수.
- (백엔드 선택 후) 서버 전용 `POST /admin/team-sync/import` 및 실행 결과 조회 API. 브라우저 참가자 계정에 importer 권한을 부여하지 않음.
- 전체/부분 수집, 동일 배치 재전송, 팀 중복, Challenge 미매칭, 잘못된 URL, 모집 상태 미확인, 공식 팀명 변경, 수집 실패 시 이전 정상 데이터 유지 테스트.
- NASA 공개 웹페이지 구조나 robots/접근 제약에 따라 수집 방식의 가용성을 먼저 확인하고, 차단·실패를 우회하지 말고 수동 입력/검토 경로를 유지.
- 구현 결과를 지예가 이 대화에 전달할 수 있도록 변경 파일·샘플 수집 결과·dry-run diff·시험 결과를 묶어 제출. 실제 DB 쓰기 전에 검토 가능하게 준비.

## 7B. 로컬·Git 인계 및 서울 사이트 연결 방향

현재 HTML·CSS·JavaScript 화면 구조를 유지한다. 기존 서울 안내 사이트와 다른 앱으로 운영할 수 있다. 목표 주소는 nasaspaceappskr.org/my-space지만 기존 호스팅의 경로 연결 가능성을 먼저 확인한다. React 전환은 이번 범위가 아니다. CSS/이미지/링크 경로·OAuth callback·쿠키 경로·API 연결은 실제 배포 구조에 맞게 수정한다. 현재 Sites Git과 공식 사이트 GitHub는 별개이며 이전 완료로 간주하지 않는다. 경로 연결이 불가능하면 서브도메인 등 대안을 보고하고 임의로 공개하지 않는다.

## 8. Codex 작업 지시

**후속 요청 우선:** 먼저 7A의 준비 단계와 기존 DB 구조 대조·팀 수집 계약을 검토 가능한 결과로 준비한다. 사용자 소유 계정 연결이나 실제 운영 데이터 쓰기는 연결 조건을 확인한 다음 단계에서 진행한다. 아래 목록은 전체 구현 범위이며 모두 즉시 실행하라는 뜻은 아니다.

1. **소스 연결부터 확인:** 현재 Site v67의 코드와 본 문서를 읽고, 다른 repo에 작업한다면 정확한 소스·변경 범위를 먼저 정리한다. 검토용 localStorage와 실제 신원 데이터를 섞지 않는다.
2. **검증 유지:** v67에서 갱신한 정적/DOM 테스트를 재사용하고 실제 서버 권한·통합·모바일 실화면 검증을 추가한다. mock 통과를 실제 인증·발송 완료로 보고하지 않는다.
3. **1단계 인증:** Participants_Private / Auth_Identities / 승인 요청 기록부터 연결. OAuth state 검증·세션·logout·운영진 승인·거절·연결 해제를 구현하고 승인된 participant_id를 서버에서 반환한다. 제공자의 검증 이메일을 유일한 이용 승인 대상과 대조해 자동 연결하고 충돌은 수동 요청으로 처리한다. 불일치 경로는 5.3A에 따라 NASA 이메일 인증 링크를 확인한 후에도 운영자 승인 전 pending을 유지한다. 사용자 입력 NASA 이메일·URL 콜백·브라우저 저장소는 자동 승인 근거가 아니다.
4. **계정 소유:** Google/Naver 앱, OAuth 설정, 새 Sheet와 발송 도메인은 지예 소유로 설정. Secret은 서버 환경변수/Secret 저장소에만 입력. 채팅·프론트·git·문서에 값 기재 금지.
5. **2단계 DB:** 위 항목표를 읽고 실제 Sheet header/데이터 사전/검증 규칙을 준비한다. 원본 읽기와 새 운영 DB 쓰기를 분리. 화면 역할·관심 Challenge와 승인·팀 소유 정보를 통합한다.
6. **팀 연결:** 검증된 팀 오너에게만 수정 API 허용. name·Challenge는 요청에 들어와도 수정 불가. 광고·5개 역할·모집 상태 저장은 팝업 확인 이후에만. 목록 카드와 미리보기 카드의 데이터·렌더링을 일치시킨다.
7. **대화:** 두 실제 계정에서 같은 thread_id로 수신/발신을 조회. 서버가 행사별 pair_key의 3개/동시 1개 제한과 매 메시지의 당사자·차례·3+2 상한·50자를 검사한다. UUID·idempotency·동시 전송 제어를 적용한다.
8. **Sheets 동시성:** UI 버튼만 잠그지 않는다. 하나의 서버 저장 경로에서 잠금 획득→최신 대화 읽기→권한/순서/중복 재검사→메시지 기록→완료/시각 갱신→잠금 해제 순서로 처리한다. 여러 writer를 섞지 않는다. 중간 실패 후 idempotency로 재시도·복구 가능해야 한다. Apps Script를 쓰는 경우 LockService는 그 Script를 통하는 모든 writer에 적용돼야 한다. 단순 Worker 메모리 boolean은 분산 잠금이 아니다.
9. **이메일:** 서버에서 실제 수신자와 역할별 최신 동의를 확인. 미동의 시 UI 회색과 API 거부를 함께 적용. 발송자 주소 공개 동의 기록·검증된 Reply-To·외부 답장 정책을 적용한다. 본문 미저장, 중복 발송 방지, 발송 업체 접수와 delivered를 구분. SMTP/Resend 권한과 실제 서비스 연결 전에 예시 발송으로 성공 표시 금지.
10. **비공개 검수:** 기존 Site 접근 범위 유지. 실제 앱 로그인과 Site 공유 설정을 분리해 보고. 승인 없는 외부 발송·원본 자료 변경·공개 전환 금지.
11. **검토용 제거:** 실제 인증·DB와 인수 조건이 확인된 운영 페이지에서 역할 선택 도구·검토용 문구·예시 계정·demo fallback을 제거한다. 별도 비공개 QA 경로를 남기더라도 실제 사용자 권한 우회와 혼용하지 않는다.

## 9. Codex가 제출할 확인 자료

- 이번 작업 파일·변경 요약과 실행 방법. 실제로 수행한 검사 / 아직 수행하지 못한 검사 구분.
- Sheet 이름·실제 열 header·형식·수정 주체·API 노출 필드 목록. 가짜 ID를 실제 UUID로 변환한 대응 방식.
- API 계약: 세션, 프로필 읽기/수정, 공식 팀 조회, 오너 모집 미리보기/저장, 받은/보낸 관심 조회, 새 관심 생성, 답변 추가, 이메일 발송, 운영진 승인/오너 검증.
- 당사자·비당사자·미승인·운영진·팀 오너별 접근권한 테스트 결과. 일반 화면 API에 실명/이메일/보호자 정보가 노출되지 않는지 검사. 이메일에는 동의한 발송자 주소만 Reply-To로 전달되는지 확인.
- 두 계정·별도 브라우저에서 A→B→A→B→A 전송 후 여섯 번째 거부, 새로고침/재로그인 후 동일 로그 복원, 동시·더블클릭 전송의 중복 방지 결과.
- 50자/51자, 3개/4개 프로필 선택, 5개/6개 오너 역할, 팀 인원 6명/7명, 미동의 이메일 요청 API 거부 결과.
- 팝업 닫기에는 저장 없음, 팝업 저장 후 목록·상태·모집 내용 일치 결과.
- 같은 pair의 진행 중 중복·네 번째 대화 거부, 팀/대원 경로·발신자 전환 우회 방지 결과.
- 참가자/팀 paused·completed 목록 숨김·새 관심 거부·기존 답변 유지, confirmed 팀 소속 발생 시 참가자 자동 완료 결과.
- 검증 소셜 이메일 유일 매치 자동 연결, 불일치 NASA 이메일 인증→수동 승인, GET 무변경·요청 계정 제한·토큰 만료/철회/재사용·동시 소비·재발송 제한 검사. 중복/미검증/정지 계정 우회 거부. 인증 완료만으로 pending 권한이 열리지 않는 결과.
- 390px/좁은 모바일·태블릿·PC에서 네 탭 시작 위치, 메뉴, 로그 접힘, 답변 입력, 팝업, 가로 넘침 검수 결과. 실제 기기 검수와 에뮬레이션 구분.
- 정책 미확정 사항과 구현 전 결정이 필요한 선택지를 별도로 표시. 지예의 승인을 작업자가 임의 추정하지 않음.
- 테스트 데이터·계정은 실제 참가자/발송 대상과 분리. 테스트 완료 후의 정리 계획.

## 10. 근거

코드 기준: `index.html`, `styles.css`, `match.js`, `auth.js`, `auth-config.js`, `contact-config.js`, `preview.js`, `workspace-ui.js`, `interest-threads.js`, `scripts/build.mjs`, `auth-backend/README.md`, `tests/*`.

Google 공식 문서: [Apps Script Lock Service](https://developers.google.com/apps-script/reference/lock/) — 공유 자원의 동시 접근 제어. [Class Lock](https://developers.google.com/apps-script/reference/lock/lock.html) — Spreadsheet 작업 시 잠금 해제 전 flush 안내. 이는 Apps Script 경유 저장의 참고이며 현재 프로젝트에 구현됐다는 뜻이 아니다.

이 문서는 2026-10-09 통합 정책·구현 지시서·DB 설계안이다. 초기 1단계 설명과 충돌하면 이 문서의 최신 확정 정책을 사용한다. 소스 auth-backend/README.md 및 PILOT_POLICY.md도 이 통합 기준으로 갱신했다. 다른 채팅방의 소스/DB 변경은 별도 결과를 대조해야 한다.

이 문서 통합은 실제 Sheet 생성·개인정보 연결·OAuth/이메일 설정·웹사이트 재배포를 수행한 결과가 아니다.
