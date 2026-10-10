# Vercel Preview 역할별 UI 검토

`apps/my-space/scripts/export-production.mjs`는 Vercel이 빌드 시 제공하는
`VERCEL_ENV`가 `preview`일 때만 `review.html`, `preview.js`, `review-store.js`를
공식 정적 export에 포함한다. `production` 및 일반 로컬 Production 빌드에는 이 세
파일이 포함되지 않는다.

로컬 Preview 검증은 저장소 루트에서 다음과 같이 실행한다.

```powershell
$env:MY_SPACE_REVIEW='1'
cd frontend
corepack yarn build
corepack yarn check:routes
Remove-Item Env:MY_SPACE_REVIEW
```

## 직접 검토 URL

배포별 Preview origin 뒤에 다음 경로를 붙인다.

| 상태 | 경로 |
|---|---|
| 비로그인 | `/my-space/review/?role=anonymous#my-space` |
| 로그인 후 참가 확인 대기 | `/my-space/review/?role=pending&stage=required#my-space` |
| 승인된 참가자 | `/my-space/review/?role=participant#my-space` |
| 승인된 팀 오너 | `/my-space/review/?role=owner#my-space` |

Vercel의 clean URL 처리로 배포된 `review.html`은 `/my-space/review/`에서 제공된다.

참가 확인 대기 화면의 선택 도구는 `required`, `email_pending`, `review_pending`을
비롯한 기존 승인 단계를 URL의 `stage` 값과 동기화한다. 검토 화면의 역할·승인 단계는
예시 데이터와 localStorage만 사용하며 실제 로그인, 승인, 메일 발송 또는 운영 DB 쓰기를
수행하지 않는다. 일반 `/my-space/`에서는 기존 참가자 기능 잠금을 유지한다.
