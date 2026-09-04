# NASA Space Apps Seoul Vercel 릴리스 절차

현재 운영 릴리스의 기본 흐름은 다음과 같습니다.

> **Local Draft → Feature Branch → Local Approval → Checks → Single Push → Preview → Owner Approval → Main → Production Verify**

`SeoulNASASpaceApps/web`가 배포 기준 원본입니다. 개인 repository나 local folder,
`review` remote는 작업 또는 참고 공간일 뿐 Production source of truth가 아닙니다.

## 1. Git 상태와 배포 환경

| Git 상태 | Vercel 동작 | 용도 |
| --- | --- | --- |
| 로컬 변경만 존재 | 배포 없음 | 작성과 반복 검토 |
| Feature branch push | Preview 자동 배포 | 최종 다국어·반응형 QA |
| Pull Request update | Preview 갱신 | 발견된 문제 수정 확인 |
| `main` merge/push | Production 자동 배포 | 소유자가 승인한 공식 반영 |

`main`에는 직접 작업하거나 push하지 않습니다. 프로젝트 소유자의 명시적 승인
없이 `main`에 merge하거나 다른 방법으로 Production을 시작하지 않습니다.

## 2. Local Draft와 Branch

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/<작업명>
```

Codex 작업은 `codex/<작업명>`을 사용합니다. 작업 중인 변경이 있으면 무리하게
switch, rebase 또는 reset하지 말고 먼저 현재 상태를 보존합니다.

다음 단계는 localhost에서 반복합니다.

```sh
cd frontend
corepack yarn install --frozen-lockfile
corepack yarn dev
```

- 한국어와 영어
- desktop과 mobile
- 변경한 2026 route
- shared 변경이면 `/2025/**` archive
- 미확정 콘텐츠와 `published: false` Bulletin 비노출

이 단계에서는 불필요한 commit, push 또는 Preview 배포를 만들지 않습니다.

## 3. Local Approval과 Checks

하나의 일관된 작업 단위가 localhost에서 승인되면 개발 서버를 종료하고 실행합니다.

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

실패한 검증을 우회하지 않습니다. 문서만 변경했다면 `git diff --check`와 link,
현재 cohort 및 hosting 설명의 일관성을 확인합니다.

## 4. Single Push와 Pull Request

승인된 작업 단위만 stage하고 diff를 다시 확인한 뒤 commit과 push를 준비합니다.
commit과 push는 사용자가 명시적으로 요청한 경우에만 수행합니다.

```sh
git add <변경한 파일>
git commit -m "<변경 설명>"
git push -u origin <feature-branch>
```

원칙적으로 로컬 검토를 끝낸 한 번의 정리된 push로 Preview를 만듭니다. Preview에서
문제가 발견되면 feature branch에서 수정·재검증하고 문제 해결 단위로 추가 push할
수 있습니다.

Pull Request에는 변경 범위, 실행한 검증, Preview URL, 2025 회귀 여부, 콘텐츠
승인 상태와 Production 영향을 기록합니다.

## 5. Preview QA와 Owner Approval

Vercel Preview에서 다음을 확인합니다.

- `/2026/ko/`와 `/2026/en/`
- 변경한 목록과 상세 route
- desktop과 mobile layout
- `/2025/` 및 대표 2025 하위 route
- 비공개 초안과 개인정보 비노출
- 승인되지 않은 이미지, 기관명, logo 비노출

Repository maintainer의 기술 검토와 project owner의 Production 승인은 별개의
책임일 수 있습니다. `main` merge 전에 project owner의 명시적 승인이 PR에
기록되어야 합니다.

## 6. Main과 Production Verify

승인된 Pull Request를 `main`에 merge하면 Vercel Production이 자동 시작됩니다.
별도의 Vercel Deploy 버튼이나 AWS 명령은 일반 릴리스에 필요하지 않습니다.

Production이 Ready가 된 뒤 확인합니다.

- `https://nasaspaceappskr.org/`
- `https://nasaspaceappskr.org/2026/ko/`
- `https://nasaspaceappskr.org/2026/en/`
- `https://nasaspaceappskr.org/2025/`

## 7. 실패와 롤백

- Preview 실패 시 `main`에 merge하지 않고 feature branch에서 수정합니다.
- Production 문제는 project owner 승인하에 직전 정상 Vercel deployment로
  rollback하거나 문제 commit을 `git revert`합니다.
- 일반 콘텐츠 릴리스 중 DNS, Squarespace, AWS 또는 CloudFront를 변경하지 않습니다.
- rollback도 Production 변경이므로 project owner의 명시적 승인이 필요합니다.

## 8. Bulletin 추가 사항

Bulletin 작성 형식은 `frontend/content/README.md`를 따릅니다. 검토 중에는
`published: false`로 유지하고, 공개 승인 후 `published: true` 상태를 Preview에서
다시 확인합니다. Markdown 한 건이 목록, 상세 route와 Main의 최신 Bulletin에
자동 반영되므로 React page를 직접 수정할 필요가 없습니다.
