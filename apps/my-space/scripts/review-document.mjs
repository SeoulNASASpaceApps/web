export const reviewAssetFiles = ["preview.js", "review-store.js"];

const reviewToolbar = `<aside class="preview-toolbar" aria-label="검토용 상태 전환"><div><b>MY SPACE 화면 검토</b><small>Vercel Preview 전용 · 예시 데이터 · 실제 로그인·메일 발송 없음</small></div><label>사용자 상태 <select id="preview-role"><option value="anonymous">비로그인</option><option value="pending">로그인 후 참가 확인 대기</option><option value="participant">승인된 참가자</option><option value="owner">승인된 팀 오너</option></select></label><label hidden>참가 확인 단계 <select id="preview-approval-stage"><option value="required">이메일 인증 전</option><option value="email_pending">인증 메일 발송 대기</option><option value="review_pending">인증 완료 · 운영팀 확인 대기</option><option value="expired">인증 링크 만료</option><option value="additional_review">추가 확인</option><option value="rejected">연결 거절</option></select></label><a href="index.html">실제 잠금 화면 ↗</a></aside>`;

export function createReviewDocument(html) {
  return html
    .replace("<head>", '<head>\n    <meta name="robots" content="noindex, nofollow" />')
    .replace("<body>", `<body class="review-page">${reviewToolbar}`)
    .replace(
      '<script src="approval-flow.js"></script>',
      '<script src="approval-flow.js"></script>\n    <script src="preview.js"></script>\n    <script src="review-store.js"></script>',
    );
}
