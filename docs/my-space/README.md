# MY SPACE 통합 핸드오프 — 2026-10-09 KST

이 문서는 2026-10-09 인계본의 시작 문서를 보존한 기록이다. 공식 저장소에 적용한
실제 경로와 범위는 `08_REPOSITORY_INTEGRATION.md`를 우선한다. 이번 묶음은 운영 배포
완료본이 아니라 **최신 소스 + 검증한 연결 코드 + 통합 지시서**다.

## 무엇이 들어 있는가

| 경로 | 내용 |
|---|---|
| `apps/my-space/` | 최신 허브 HTML·CSS·JS, 공통 정책, 검토 저장소, 로컬 인증 서버, SQLite 스키마, 테스트 |
| `tools/my-space-team-sync/` | 기존 Python 수집기, 출력 변환·검증 코드, 공개 32팀 fixture, 메모리 DB 통합 테스트, 실행 스크립트 |
| `docs/my-space/` | 현재 상태, 정책, 아키텍처, 배포 경계, 검토 결과와 저장소 통합 기록 |
| docs/01_CURRENT_STATE.md | 실제 구현·미구현·발견한 제약 |
| docs/02_POLICY.md | 최신 통합 정책과 미확정 항목 |
| docs/03_ARCHITECTURE.md | 공통/역할별 책임, `/my-space` 연결 설계 |
| docs/04_SECRETS_AND_DEPLOYMENT.md | 환경변수 이름·권한·비공개 배포 준비 |
| docs/05_TEAM_SYNC.md | Python→검증→import→DB→화면, 매일 03:00 KST 계획 |
| docs/06_CODEX_EXECUTION.md | Git 이전·기존 DB 대조·구현 순서·인수 조건 |
| docs/07_REVIEW_REPORT.md | 세 차례 점검 결과와 실제 테스트 결과 |
| MANIFEST.json | 파일별 SHA-256, 기준 소스 커밋 |

## 기준 버전과 문서 우선순위

허브 최신 Site v70, 소스 커밋 `613ef1128d30be4204a8fcf491c67bf84e49c580`를 소스 저장소에서 확인해 가져왔다. `hub/`는 그 커밋의 추적 파일을 보존했다. 단, `tests/match-static.test.cjs`의 오래된 7일 재확인 문구 검사를 확정된 5일 미응답 안내 검사로 수정했고, `LOCAL_SETUP.md`의 수집 파일 부재 설명을 이번 포함 파일에 맞게 갱신했다. 새 연결 코드는 `team-sync/`에 별도로 두었다. 호스팅·접근 범위·운영 데이터는 변경하지 않았다.

1. 이번 `docs/`의 현재 상태·통합 기준을 우선한다.
2. 소스의 `hub/auth-backend/POLICIES_AND_ARCHITECTURE.md`, `LOCAL_SETUP.md`로 구현 상세를 확인한다.
3. `CODEX_HANDOFF.md`의 DB/API 표는 **목표 계약**이다. v67 기준 상태·08:00/17:00·초기 수동승인 설명을 최신 구현으로 오해하지 않는다.
4. 과거 00–06·Phase1·Resend 문서의 정책 변경은 이번 통합 기준으로 설명했다. 과거 문서의 ‘테스트 통과’ 기록보다 이번 실행 결과가 우선이다.

실제 Secret·참가 명단·보호자 자료·SQLite 데이터·Git 인증정보는 포함하지 않는다. `hub/.openai/hosting.json`은 기존 Sites 식별 정보이며 공식 GitHub 사이트의 배포 설정으로 그대로 복사하지 않는다.

## 빠른 검증

Node 24 이상, Python 3.10 이상. 허브의 Node 서버는 SQLite 영구 저장소가 있는 호스트가 필요하다.

```bash
cd apps/my-space
npm ci
npm run check
npm test
npm run test:roles
npm run test:server
cd ..
cd ..
node --test tools/my-space-team-sync/integration.test.mjs
```

위 검증은 외부 OAuth·실제 메일·원본 Sheet 연결 완료를 뜻하지 않는다. 외부 설정 없이 검토하려면 `apps/my-space`에서 `npm run build` 후 별도 로컬 정적 서버로 `dist/review.html`을 연다. 실제 로그인 로컬 실행은 `apps/my-space/auth-backend/LOCAL_SETUP.md`를 따른다.
