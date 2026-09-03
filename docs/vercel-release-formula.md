# NASA Space Apps Seoul 배포 공식

현재 운영 배포의 기본 공식은 다음과 같다.

> **Draft → Branch → Local Check → Preview → Approval → Main → Verify**

`SeoulNASASpaceApps/web`가 배포 기준 원본이다. 개인 저장소나 로컬 폴더는 작업
공간으로 사용할 수 있지만, 운영 배포는 공식 저장소의 검토된 변경만 사용한다.

## 1. 브랜치와 배포 환경

| Git 상태 | Vercel 동작 | 용도 |
| --- | --- | --- |
| `codex/*` 등 feature branch push | Preview 자동 배포 | 검토와 모바일/다국어 확인 |
| Pull Request | Preview 갱신 | 변경 내역 승인 |
| `main` merge/push | Production 자동 배포 | 공식 사이트 반영 |
| 로컬 변경만 존재 | 배포 없음 | 작성 중인 초안 |

따라서 `main`에는 직접 작업하지 않는다. 운영에 반영할 의도가 없다면 feature
branch까지만 push하고 Preview URL에서 확인한다.

## 2. 표준 릴리스 절차

### Draft

- 공지는 `frontend/content/cohorts/2026/bulletin/`에서 작성한다.
- 이미지와 문구는 공개 승인을 받은 자료만 사용한다.
- 미확정 공지는 `published: false`로 유지한다.

### Branch

```sh
git switch main
git pull --ff-only origin main
git switch -c codex/<작업명>
```

### Local Check

```sh
cd frontend
corepack yarn install --frozen-lockfile
corepack yarn lint
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn check:routes
cd ..
node infra/cloudfront-functions/redirect-root.test.js
git diff --check
git status --short
```

한국어와 영어, 데스크톱과 모바일, `/2025/` 아카이브를 함께 확인한다.

### Preview

```sh
git add <변경한 파일>
git commit -m "<변경 설명>"
git push -u origin codex/<작업명>
```

Vercel이 생성한 Preview URL에서 다음을 확인한다.

- `/2026/ko/`와 `/2026/en/`
- 변경한 목록 및 상세 route
- 공개하면 안 되는 초안이 노출되지 않는지
- 데스크톱과 모바일 레이아웃
- `/2025/` 및 대표 2025 하위 URL

### Approval

운영 담당자가 Preview를 확인한 후 Pull Request를 승인한다. 승인 전에는
`main`에 merge하지 않는다.

### Main

Pull Request를 `main`에 merge하면 Vercel Production 배포가 자동 시작된다.
별도의 Vercel Deploy 버튼이나 AWS 명령은 필요하지 않다.

### Verify

Production 상태가 `Ready`가 된 후 아래 주소를 확인한다.

- `https://nasaspaceappskr.org/`
- `https://nasaspaceappskr.org/2026/ko/`
- `https://nasaspaceappskr.org/2026/en/`
- `https://nasaspaceappskr.org/2025/`

## 3. 실패 시 중단과 롤백

- Preview가 실패하면 `main`에 merge하지 않고 feature branch에서 수정한다.
- Production에 문제가 생기면 Vercel의 직전 정상 Production Deployment로
  rollback하거나 문제 commit을 `git revert`한다.
- DNS, Squarespace, AWS, CloudFront 설정은 일반 콘텐츠 배포 중 변경하지 않는다.
- 비밀값, 로그인 정보, API key는 저장소에 커밋하지 않는다.

## 4. 공지 한 건을 배포하는 최소 절차

1. `notice-template.md`를 복사해 영문 소문자 kebab-case 파일명을 정한다.
2. frontmatter와 한국어/영어 제목, Markdown 본문을 작성한다.
3. 검토 중에는 `published: false`로 Preview를 확인한다.
4. 공개 승인 후 `published: true`로 바꾸고 다시 Preview를 확인한다.
5. PR을 승인·merge하고 Production에서 목록, 상세, Main 최근 공지를 확인한다.

공지 파일 하나만 추가해도 Bulletin 목록, 상세 페이지, Main Latest Bulletin 최대
3개가 build 시 자동 생성된다. React/TypeScript 페이지를 수정할 필요가 없다.
