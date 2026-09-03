# File-based content

## 2026 Bulletin 작성 방법

1. `content/cohorts/2026/bulletin/notice-template.md`를 복사합니다.
2. 파일명을 `registration-guide.md`처럼 영문 소문자 kebab-case slug로 변경합니다.
3. frontmatter와 Markdown 본문을 작성합니다.
4. 검토 중에는 `published: false`, 공개 준비가 끝나면 `published: true`로 설정합니다.
5. `yarn build` 후 생성된 목록과 상세 페이지를 확인합니다.

필수 frontmatter:

- `titleKo`, `titleEn`: 한국어/영어 제목
- `publishedAt`, `updatedAt`: `YYYY-MM-DD`
- `category`: `REGISTRATION`, `TEAM`, `EVENT`, `SUBMISSION`, `AWARDS`, `NOTICE` 중 하나
- `pinned`, `published`: `true` 또는 `false`
- `thumbnail`: `/images/...` 경로 또는 `null`

공개 글은 pinned 글을 먼저, 이후 `publishedAt` 최신순으로 정렬합니다. 새 파일은 Bulletin 목록과 상세 route, Main의 Latest Bulletin 최대 3개에 자동 반영됩니다. `published: false`인 파일은 public export에 포함되지 않습니다.

공지 작성자는 React/TypeScript component나 page source를 수정할 필요가 없습니다.
배포 전에는 `corepack yarn build`와 `corepack yarn check:routes`를 실행해 잘못된
frontmatter와 비공개 글 노출 여부를 확인합니다. 전체 Preview/Production 절차는
`docs/vercel-release-formula.md`를 따릅니다.
