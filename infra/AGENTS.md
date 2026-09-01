# 인프라 작업 지침

## 적용 범위

이 지침은 `infra/`에 적용한다. 루트 `AGENTS.md`의 운영 호스팅과 변경 승인
규칙도 함께 적용한다.

## CloudFront Functions

- `cloudfront-functions/redirect-root.js`는 루트(`/`)만 최신 연도 경로로
  임시 리디렉트하고 다른 요청은 그대로 반환한다.
- 리디렉트 응답에는 브라우저가 다음 연도에도 이전 목적지를 고정하지 않도록
  즉시 재검증하는 Cache-Control을 유지한다.
- 최신 연도를 변경할 때는 `frontend/src/app/page.tsx`의 S3 fallback도 함께
  변경한다.
- 함수 게시와 배포 연결은 코드 변경과 별개의 운영 변경이다. 사용자 승인을
  확인하고 기존 배포 설정과 Function Association을 보존한다.

## 검증

```sh
node infra/cloudfront-functions/redirect-root.test.js
```

운영에 연결했다면 루트가 302를 반환하고 연도별 경로와 정적 자산은 리디렉트하지
않는지 확인한다.
