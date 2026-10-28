# MY SPACE 공용 저장소 안내

공용 저장소에는 공식 사이트와 `/my-space/` 정적 화면, Preview 전용 예시 검토 도구,
그리고 별도 API origin을 받는 공개 연결 계약만 둔다. 인증·승인·DB·메일·팀 수집
서버 구현은 공용 Git에서 분리했다.

## 무엇이 들어 있는가

| 경로 | 내용 |
|---|---|
| `apps/my-space/` | 허브 HTML·CSS·JS, 공통 화면 정책, Preview 예시 저장소, 정적 빌드와 테스트 |
| `frontend/` | 기존 Next.js 공식 사이트와 `/my-space/` 정적 export 연결 |
| `docs/my-space/08_REPOSITORY_INTEGRATION.md` | 공식 저장소 통합 방식 |
| `docs/my-space/09_PREVIEW_REVIEW.md` | Preview 전용 네 상태 검토 방식 |
| `docs/my-space/10_PUBLIC_PRIVATE_BOUNDARY.md` | 공용/전용 파일·API·권한 경계 |

실제 Secret·참가 명단·보호자 자료·SQLite 데이터·Git 인증정보는 이 저장소에 넣지
않는다. Preview 검토는 예시 데이터만 사용하며 권한 증거가 아니다.

## 빠른 검증

Node 24 이상.

```bash
cd apps/my-space
npm ci
npm run check
npm test
npm run test:roles
```

외부 설정 없이 검토하려면 `apps/my-space`에서 `npm run build` 후 별도 로컬 정적
서버로 `dist/review.html`을 연다. 실제 로그인·메일·DB를 검증했다는 뜻은 아니다.
