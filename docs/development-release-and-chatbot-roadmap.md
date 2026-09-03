# 2026 개발·릴리스 및 챗봇 도입 가이드

이 문서는 2026 사이트를 AWS 변경 없이 개발·검토하는 현재 단계와, 후원 및
운영 여건이 확정된 뒤 챗봇과 production 배포를 추가하는 후속 단계를 구분한다.

## 1. 현재 운영 결정

- 2026 초기 버전은 정적 public website로 운영한다.
- 회원가입, 로그인, 계정, Dashboard, 자체 참가 신청 backend는 만들지 않는다.
- Seoul Participation Confirmation은 승인된 외부 Form을 사용한다.
- 2026 챗봇은 초기 버전에 포함하지 않는다.
- AWS S3, CloudFront, DNS와 루트 리디렉트는 별도 승인 전까지 변경하지 않는다.
- production 루트 `/`는 계속 `/2025/`로 연결한다.

AWS는 개발에 필요한 조건이 아니라 최종 production 파일을 제공하는 호스팅
수단이다. AWS를 변경하지 않아도 로컬 개발, 정적 build, 브라우저 검수, GitHub
branch push와 Pull Request 검토를 진행할 수 있다. 다만 외부 사용자가 접속할
공개 URL은 별도의 호스팅 또는 기존 AWS production 배포 전에는 생기지 않는다.

## 2. 저장소 역할

- `SeoulNASASpaceApps/web`: 공식 source of truth
- `intellius-empowered/nasa-space-apps-seoul-web`: 선택적인 검토·백업 mirror
- 로컬 `origin`: 공식 NASA 저장소
- 로컬 `review`: 검토용 intellius 저장소

동일 기능을 두 저장소에서 따로 수정하지 않는다. 공식 `origin/main`을 기준으로
feature branch를 만들고, 필요할 때만 같은 commit을 `review`에도 push한다.

## 3. AWS 없는 일상 개발 흐름

### 작업 시작

```sh
git switch main
git pull --ff-only origin main
git switch -c codex/<작업명>
```

이미 존재하는 feature branch를 이어서 작업할 때는 해당 branch에서 먼저
`origin/main`의 새 commit을 확인하고 충돌 여부를 검토한다. 작업 중인 변경이
있는 상태에서 무리하게 rebase하거나 reset하지 않는다.

### 로컬 실행

```sh
cd frontend
corepack yarn install --frozen-lockfile
corepack yarn dev
```

확인 주소 예시:

- `http://127.0.0.1:3000/2026/ko/`
- `http://127.0.0.1:3000/2026/en/`
- `http://127.0.0.1:3000/2026/ko/bulletin/`

### 정적 결과물 검증

개발 서버를 종료한 뒤 실행한다. `next dev`와 `next build`를 동시에 실행하면
둘이 같은 `.next/` 디렉터리를 사용해 로컬 미리보기가 깨질 수 있다.

```sh
cd frontend
corepack yarn lint
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn check:routes
cd ..
node infra/cloudfront-functions/redirect-root.test.js
git diff --check
git status --short
```

`frontend/out/`이 정적 배포 결과물이다. `.next/`와 `out/`은 직접 수정하거나
commit하지 않는다.

### GitHub 검토

```sh
git push -u origin codex/<작업명>
```

그 후 공식 NASA 저장소에서 Pull Request를 만들고 다음을 확인한다.

- 한국어와 영어 화면
- desktop과 mobile 화면
- `/2025/**` 회귀 여부
- `/`가 아직 `/2025/`를 향하는지
- 미확정 콘텐츠와 `published: false` Bulletin이 노출되지 않는지
- production 배포 또는 AWS 변경이 포함되지 않았는지

현재 저장소에는 GitHub Actions 기반 production deploy가 없다. 따라서 branch
push와 PR merge는 source 변경이며, S3/CloudFront 배포와는 별도다.

## 3.1 Vercel 무료 미리보기

Vercel 프로젝트의 Root Directory는 `frontend`로 설정한다. 해당 디렉터리의
`vercel.json`이 Next.js build와 `out/` 정적 결과물을 명시하므로 Dashboard에서
Build Command, Output Directory와 환경변수를 별도로 입력하지 않는다.

- Framework: Next.js
- Install: `yarn install --frozen-lockfile`
- Build: `yarn build`
- Output: `out`
- Environment Variables: 없음

Vercel 배포는 AWS, 기존 CloudFront와 공식 도메인을 변경하지 않는다. 공식 도메인
DNS는 별도 승인 전까지 Vercel 프로젝트에 연결하지 않는다.

## 4. 릴리스 단계 구분

### Stage A — Local development

- feature branch에서 구현
- 로컬 브라우저와 static export 검증
- AWS 변경 없음

### Stage B — Source review

- NASA 저장소에 feature branch push
- Pull Request 검토
- 필요하면 intellius 저장소에 동일 commit mirror
- AWS 변경 없음

### Stage C — Merge-ready 2026

- 승인된 콘텐츠, 외부 Form URL, 이미지와 접근성 검수 완료
- `main` merge 가능
- merge만으로 production은 변경되지 않음
- 루트는 계속 `/2025/`

### Stage D — 2026 path publication

- 명시적 production 승인 후 `frontend/out/`을 기존 S3에 업로드
- `/2026/**`를 직접 접속할 수 있게 하되 루트 redirect는 아직 `/2025/` 유지 가능
- 배포 절차는 `docs/deployment-playbook.md`를 따른다.

### Stage E — Root cutover

- 별도 승인 후에만 `/` 목적지를 `/2026/`으로 변경
- `frontend/src/app/page.tsx`와 CloudFront Function을 함께 변경
- `/2025/**`는 archive URL로 계속 보존

## 5. 2026 챗봇 도입 원칙

### 초기 버전

- 2026 navigation과 route에 활성 챗봇을 추가하지 않는다.
- API key, provider SDK, 대화 저장소, 사용자 식별 기능을 추가하지 않는다.
- 기존 `/2025/{locale}/chatbot/`은 종료된 2025 기록이므로 그대로 보존한다.

### 후원·예산 검토 후 Go/No-Go 조건

다음 항목이 모두 정해졌을 때 별도 프로젝트 단계로 시작한다.

1. 챗봇의 목적과 답변 범위
2. 행사 전·행사 중 운영 기간
3. 예상 사용자 수와 월 사용 한도
4. 모델/API 비용 책임 주체와 예산 상한
5. 답변 근거가 될 승인된 한국어·영어 콘텐츠
6. 운영 담당자, 장애 대응자와 종료 정책
7. 개인정보·대화 로그의 수집 여부와 보존 기간
8. 부정확한 답변 신고와 사람에게 문의하는 fallback

### 권장 기술 경계

현재 정적 Next.js 사이트는 유지한다. 챗봇을 도입해도 전체 사이트를 server
application으로 바꾸지 않고 다음처럼 분리한다.

```text
Static public website
        │
        └── /2026/{locale}/chatbot UI (후기 추가)
                    │ HTTPS
                    ▼
             Separate chat API
                    ├── server-side model credential
                    ├── approved event knowledge
                    ├── rate limit / budget limit
                    └── safety / logging policy
```

- 모델 API key를 browser bundle, Markdown, GitHub 또는 static S3 파일에 넣지 않는다.
- 브라우저에서 모델 API를 직접 호출하지 않는다.
- 챗봇 API 장애가 Main/Bulletin/Archive 이용을 막지 않게 한다.
- public content ID와 locale만 전달하고 계정 시스템에 의존하지 않는다.
- 질문·답변 로그는 기본적으로 수집하지 않으며, 필요 시 별도 동의와 정책을 먼저
  정한다.
- 비용 보호를 위해 요청 크기, 분당 요청 수, 일/월 예산 한도와 kill switch를 둔다.
- 챗봇 답변은 공식 참가 등록이나 운영진의 확정 안내를 대체하지 않음을 표시한다.

### 단계적 구현안

1. **Prototype:** 로컬 mock 답변으로 UI와 한국어/영어 경험만 검증
2. **Closed pilot:** 운영진만 접근하여 승인 콘텐츠와 답변 품질 평가
3. **Limited public:** 정해진 기간과 예산 한도로 공개, 사람 문의 fallback 제공
4. **Event operation:** 모니터링 담당자가 있을 때만 행사 기간 활성화
5. **Archive:** 행사 종료 후 API를 끄고 정적 종료 안내로 전환

챗봇 상세 provider, backend hosting, 모델과 예산은 Go 결정 시점의 요구사항과
가격을 다시 확인해 선택한다. 지금 미리 특정 backend나 authentication을 도입하지
않는다.

## 6. Production 승인 체크리스트

- [ ] `/2026/ko/`, `/2026/en/` 콘텐츠 승인
- [ ] 등록 URL과 외부 Form URL 승인
- [ ] 이미지·기관 로고의 공개 및 사용 승인
- [ ] Bulletin의 `published` 상태 검토
- [ ] lint, type check, build, route check 통과
- [ ] `/2025/**` regression 확인
- [ ] S3 dry-run 결과 검토와 기존 파일 백업
- [ ] CloudFront invalidation 범위 승인
- [ ] `/2026/**` 공개와 `/` root cutover를 별도 결정
- [ ] rollback 담당자와 복구 파일 확인
