# 인프라 작업 지침

## 적용 범위와 현재 상태

이 지침은 `infra/`에 적용한다. 루트 `AGENTS.md`의 승인과 자격 증명 규칙도 함께
적용한다.

현재 일반 사이트 배포는 Vercel을 사용한다. `infra/`는 이전 AWS/CloudFront
환경을 복구하거나 별도 승인으로 재사용할 때를 위한 legacy 코드이며, 저장소에
존재한다는 이유만으로 Production에 연결됐다고 간주하지 않는다.

## CloudFront Functions

- `cloudfront-functions/redirect-root.js`는 루트(`/`)만 최신 cohort 경로로 302
  redirect하고 다른 요청은 그대로 반환한다.
- 응답에는 다음 연도에도 이전 목적지가 고정되지 않도록 즉시 재검증하는
  `Cache-Control`을 유지한다.
- 목적지를 변경할 때는 `frontend/src/app/page.tsx`의 fallback과 함께 변경한다.
- 코드 수정, 함수 게시, 배포 association, DNS/인증서/S3 변경은 서로 다른 작업이다.
- AWS, CloudFront, S3, DNS 또는 인증서에 대한 모든 실제 변경은 프로젝트 소유자의
  명시적 승인 후에만 수행한다. 기존 설정과 association을 먼저 읽기 전용으로
  확인하고 임의로 덮어쓰지 않는다.
- 자격 증명이나 계정 식별 정보는 저장소와 실행 로그에 남기지 않는다.

## 검증

```sh
node infra/cloudfront-functions/redirect-root.test.js
```

승인받아 실제 환경에 연결했다면 루트의 302 목적지와 cache header를 확인하고,
연도별 route와 정적 asset이 redirect되지 않는지 검증한다. 완료 보고에는 코드만
변경했는지, 실제 운영 설정까지 변경했는지를 명확히 구분한다.
