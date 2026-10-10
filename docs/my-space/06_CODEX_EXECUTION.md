# 내일 Codex 작업 순서

> 2026-10-10 공식 저장소 편입 경로와 현재 적용 범위는
> `08_REPOSITORY_INTEGRATION.md`를 우선한다. 아래 내용은 인계 당시 실행 계획이다.

## 1. Git 이전

공식 저장소 `https://github.com/SeoulNASASpaceApps/web`에서 현재 remote·브랜치·미커밋 변경·AGENTS.md·빌드/배포 설정을 확인한다. 다른 팀원의 변경을 보존하고 최신 기준에서 작업 브랜치를 만든다. push는 그 브랜치로 수행하고 merge·공개 production 전환은 별도 승인 범위다.

허브 소스는 기존 React 앱을 덮어쓰지 않는 독립 디렉터리에 보관한다. 실제 저장소 convention에 맞춰 위치를 정한다. 예: `apps/my-space`에 hub 추적 파일, `tools/my-space-team-sync`에 수집/검증 코드, `docs/my-space`에 통합 문서. 이 위치는 추천이며 현재 repo 구조를 확인하지 않았다. 상대 import 경로와 shell의 task_root는 옮긴 위치에 맞춰 조정한다.

`hub/.openai/hosting.json`은 기존 Sites 식별값이라 공식 프로젝트 배포 설정으로 복사하지 않는다. .git·node_modules·실제 env·개인 명단·SQLite·로그·업로드 인증정보는 Git 대상에서 제외한다. `npm run build` 산출 dist/review.html은 생성 파일이며 source와 중복 관리 여부를 저장소 기준에 맞춘다. review 페이지는 비공개 QA로만 제공한다.

## 2. 기존 DB와 배포를 먼저 조사

이미 준비했다는 기존 DB의 테이블/스키마/participant_id/승인 API/접근방식을 찾는다. 로컬 SQLite schema를 운영 DB에 곧바로 적용하지 않는다. 컬럼 대응표·실제 구현/빈 틀/미구현을 보고한다. Google Sheets는 원본 읽기 전용으로 참가 확인 대조에 사용하고, 인증·토큰·대화의 동시성 기준을 충족하는 하나의 관리 저장 경로를 정한다.

추가 Google/Naver identity 연결은 현재 UNIQUE 제약으로 제한돼 있다. 하나의 계정으로 시작한다는 현재 코드 제한을 유지하거나, 기존 ID 보존·소유 증명·중복 충돌 처리·마이그레이션 테스트를 준비한 뒤 확장한다. 이메일만으로 두 계정을 합치지 않는다.

## 3. 비공개 연결 구현

1. `/my-space` 정적 자산·auth-config·same-origin 인증 경로·callback·쿠키·CSRF를 구성한다.
2. 지예 소유 Secret/운영자 ID를 설정하고 원본 열을 읽기 전용으로 매핑한다.
3. 두 테스트 계정으로 유일 매치/불일치/만료/다른 계정/수동 승인/로그아웃을 검증한다.
4. Python 결과 검증→dry-run diff→공식 열 import→팀 API→화면을 연결한다. 신규 import의 paused 기본과 공식 모집 배지를 구분한다.
5. 프로필 API·오너 검증·모집 저장·관심 API·수신 동의·실제 이메일 relay를 연결한다. 실제 API 검증 전 canUseParticipantFeatures 잠금을 해제하지 않는다.
6. 확인한 scheduler에서 03:00 KST 등록·이력·오류 유지·알림을 연결한다. 샘플 JSON 반복 import는 수집 자동화 검증이 아니다.

## 인수 조건

미승인/제3자 접근 거부, 승인 identity에서 실제 참가자 ID 확정, 일반 API에 명단/보호자/Secret 없음, 대화 순서·3+2·50자·동시1·총3·120시간·idempotency 원자적 검증, 팀 오너만 모집 수정, 실제 가입은 별도 Membership, 이메일 동의 철회 시 서버 거부, 실제 OAuth/Resend/DB/두 계정 흐름, 모바일 좁은 화면·팝업·접힘·가로 넘침 확인.

OAuth mock/DOM 테스트와 실제 외부 테스트를 따로 기록한다. 현재 fail/pass를 그대로 보고하고 미완료 기능을 완료라고 표시하지 않는다. 이번 ZIP의 합격만으로 서비스 공개하지 않는다.

## 롤백

push 전 diff/Secret 검사와 필수 테스트를 수행한다. 운영 데이터 쓰기 전 백업·dry-run·ID 보존 계획을 준비한다. 문제 발생 시 새 endpoint/참가자 기능을 잠그고 이전 정적 화면·이전 정상 팀 자료를 유지한다. DB 변경은 기존 승인/ID를 잃지 않는 마이그레이션으로 되돌린다. force push·원본 응답 수정·기존 데이터 삭제는 하지 않는다.
