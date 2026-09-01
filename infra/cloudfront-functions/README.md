# 최신 연도 리디렉트

`redirect-root.js`는 루트 요청(`/`)만 최신 행사 경로(`/2025/`)로 302
리디렉트한다. 연도별 경로와 그 밖의 자산 요청은 그대로 오리진으로 전달한다.

## 검증

```sh
node infra/cloudfront-functions/redirect-root.test.js
```

## 운영 적용

CloudFront Functions에서 `nasa-space-apps-redirect-latest` 함수를 JavaScript
runtime 2.0으로 생성하고 `redirect-root.js`를 함수 코드로 사용한다. 테스트 후
함수를 게시하고 다음 항목으로 연결한다.

- 배포: `E2YXIKKQFK315W`
- 캐시 동작: Default (`*`)
- 이벤트 유형: Viewer request

`frontend/src/app/page.tsx`의 0초 meta refresh는 CloudFront를 거치지 않는 S3
웹사이트 엔드포인트의 fallback이므로 유지한다. 다음 연도 공개 시 함수와 해당
fallback의 `/2025/`를 함께 변경한다.
