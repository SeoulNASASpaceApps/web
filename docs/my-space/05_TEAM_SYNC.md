# 공식 팀 동기화 인계

기존 `collect_seoul_teams.py`를 그대로 보존했다. 표준 Python만 사용하며 로그인/API Key/AI API 없이 공개 자료를 읽는다. 기존 보고서에 수동 전체 수집 1회 성공이 기록돼 있다. 이번 작업에서는 외부 재수집 없이 그 결과와 연결 코드를 검증했다.

원문은 `https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams`다. 공개 페이지의 내부 GraphQL query를 사용하는 코드이며 외부용 공식 지원 API 계약으로 표현하지 않는다. 모집 판단은 canAcceptMembers이다. joinEnabled와 다르다. ‘공개 게시된 Seoul 팀 전체’이며 모든 비공개/미게시 등록팀까지 포함하지 않는다.

## 연결과 실행

수집→원본 JSON 보존→성공/완전성/건수/중복/URL/필드 검증→import 형식 변환→dry-run 검토→선택한 DB 공식 열 upsert→조회 API→허브 화면 순서다.

| 수집 출력 | 현재 importer 입력 |
|---|---|
| official_team_id | external_id |
| official_team_url | official_url |
| team_name | name |
| challenge | challenge |
| seeking_members | seeking_members(bool/null) |
| 각 retrieved_at | collected_at은 팀 조회 시각 중 마지막 시각 |
| source_url | source_url |

실행 위치는 묶음 루트다.

```bash
python3 tools/my-space-team-sync/collect_seoul_teams.py --output /PRIVATE_WORK/seoul-new.json
node tools/my-space-team-sync/normalize-snapshot.mjs /PRIVATE_WORK/seoul-new.json /PRIVATE_WORK/seoul-normalized.json
node --test tools/my-space-team-sync/integration.test.mjs
# 기존 운영 DB 구조를 대조하고 dry-run 검토한 다음에만:
HUB_DB_PATH=/PRIVATE_DB/hub.sqlite EVENT_ID=space-apps-seoul-2026 node apps/my-space/auth-backend/data-tools.mjs teams /PRIVATE_WORK/seoul-normalized.json --apply
```

PRIVATE_WORK/PRIVATE_DB는 예시 경로이며 그대로 실행하지 않는다. 통합 테스트는 제공된 실수집 파일을 메모리 DB에만 반영한다. importer 자체 CLI에는 dry-run이 없으므로 운영 dry-run diff/이력 조회는 후속 구현 대상이다.

실패·부분·빈 결과는 importer에 전달하지 않는다. 미관측 팀을 삭제/모집 종료로 해석하지 않는다. 공식 열만 갱신하고 내부 UUID·오너·모집글·역할·상태·동의·대화는 보존한다. 공식 ID/URL 변경 충돌, 오래된 스냅샷 재반영, Challenge 미매칭 검토와 run 이력은 추가해야 한다.

## 매일 03:00 Asia/Seoul

최신 계획은 하루 한 번 03:00 KST다. 과거 08:00/17:00 계획은 대체한다. UTC scheduler라면 전날 18:00 UTC, cron 표현은 `0 18 * * *`다. 현재 실제 job을 등록하지 않았다. 이번 실행 파일은 `SYNC_APPLY=0` 기본으로 수집·검증까지만 한다. Linux flock과 Python/Node가 필요하다.

운영 환경에서 일정 지원 방식·타임존·지속 DB를 확인한 뒤 등록한다. `SYNC_WORK_DIR`는 비공개 절대경로, `HUB_DB_PATH`는 검토한 DB, `SYNC_APPLY=1`은 검토 후 실제 쓰기 활성화 값이다. 실패 시 이전 정상 자료 유지, 성공/실패/최종성공시각 기록, 중복 실행 잠금, 실패 알림 대상을 설정한다. 실패 알림 발송은 대상과 발송 권한 확정 후 연결한다. 이번 shell은 실행 잠금만 제공하며 이력·알림·오래된 데이터 거부는 제공하지 않는다.

화면의 ‘매일 자동 갱신’ 표시는 job·DB import·조회 API를 실제 운영 환경에서 확인한 뒤 켠다. 최신 성공 시각과 장애/이전 자료 사용 상태를 보여준다.
