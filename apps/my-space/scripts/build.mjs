import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of ["index.html", "styles.css", "hub-policy.js", "match-catalog.js", "auth-config.js", "auth.js", "approval-flow.js", "contact-config.js", "seeking-teams.js", "match.js", "app.js", "workspace-ui.js", "interest-threads.js", "preview.js", "review-store.js"]) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(`../dist/${file}`, import.meta.url));
}

console.log("built static site in dist/");

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const reviewToolbar = `<aside class="preview-toolbar" aria-label="검토용 상태 전환"><div><b>MY SPACE 화면 검토</b><small>예시 데이터 · 실제 로그인·메일 발송 없음</small></div><label>사용자 상태 <select id="preview-role"><option value="anonymous">비로그인</option><option value="pending">참가 확인 대기</option><option value="participant">일반 참가자</option><option value="owner">팀 오너</option></select></label><label hidden>인증 검토 단계 <select id="preview-approval-stage"><option value="required">이메일 인증 필요</option><option value="email_pending">인증 메일 대기</option><option value="review_pending">인증 완료 · 운영팀 확인 대기</option><option value="expired">인증 링크 만료</option><option value="additional_review">추가 확인</option><option value="rejected">연결 거절</option></select></label><a href="index.html">로그인 전 화면 ↗</a></aside>`;
const review = html.replace("<body>", `<body class="review-page">${reviewToolbar}`).replace('<script src="approval-flow.js"></script>', '<script src="approval-flow.js"></script>\n    <script src="preview.js"></script>\n    <script src="review-store.js"></script>');
await writeFile(new URL("../dist/review.html", import.meta.url), review);
