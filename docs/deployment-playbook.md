# NASA Space Apps Seoul 웹 배포 플레이북

이 문서는 정적 Next.js 사이트를 S3에 올리고 CloudFront 캐시를 갱신한 뒤,
루트 도메인을 최신 연도 경로로 리디렉트하는 절차를 설명한다.

## 1. 배포 대상

- 대표 진입점: `https://nasaspaceappskr.org/`
- 최신 아카이브: `https://nasaspaceappskr.org/2025/`
- S3 버킷: `nasa-space-app-frontend`
- CloudFront 배포 ID: `E2YXIKKQFK315W`
- CloudFront 도메인: `d59q30zryhd0u.cloudfront.net`
- AWS CLI 프로필: `nasa-space-apps`
- AWS 기본 리전: `ap-northeast-2`

DNS는 Squarespace에서 관리하며 Route 53은 사용하지 않는다. 일반 콘텐츠 배포에
DNS, 인증서 또는 오리진 설정 변경은 필요하지 않다.

## 2. 필수 요건

- Node.js와 Yarn 1.22.19
- AWS CLI v2
- `nasa-space-apps` AWS CLI 프로필
- 대상 S3 버킷과 CloudFront 배포를 변경할 AWS 인증
- 다음 작업을 수행할 권한
  - S3 객체 조회와 업로드
  - CloudFront 배포 조회와 캐시 무효화
  - CloudFront Function 생성·테스트·게시
  - CloudFront Default 캐시 동작의 Function Association 조회·변경

macOS에서 AWS CLI가 없다면 다음 명령으로 설치한다.

```sh
brew install awscli
aws --version
```

프로젝트 프로필의 기본값은 다음과 같이 설정한다.

```sh
aws configure set region ap-northeast-2 --profile nasa-space-apps
aws configure set output json --profile nasa-space-apps
```

IAM 콘솔 사용자는 브라우저 로그인으로 만료되는 단기 자격 증명을 받는다. 이
프로젝트의 기본 인증 방법이다.

```sh
aws login --profile nasa-space-apps
aws sts get-caller-identity --profile nasa-space-apps
```

세션이 만료되면 `aws login`을 다시 실행한다. 조직에서 IAM Identity Center를
사용하는 경우에만 다음 SSO 방식을 대신 사용한다.

```sh
aws configure sso --profile nasa-space-apps
aws sso login --profile nasa-space-apps
```

브라우저 로그인과 SSO를 모두 사용할 수 없을 때만 장기 액세스 키를 로컬
프로필에 입력한다. 키를 저장소, `.env`, 문서 또는 터미널 기록에 복사하지
않는다.

```sh
aws configure --profile nasa-space-apps
```

## 3. 배포 전 확인

반드시 인증 계정과 대상 리소스를 먼저 확인한다.

```sh
aws sts get-caller-identity --profile nasa-space-apps
aws s3api head-bucket \
  --bucket nasa-space-app-frontend \
  --profile nasa-space-apps
aws cloudfront get-distribution \
  --id E2YXIKKQFK315W \
  --profile nasa-space-apps \
  --query 'Distribution.{Status:Status,DomainName:DomainName,Enabled:DistributionConfig.Enabled}'
```

다음 조건을 모두 만족할 때만 진행한다.

- 로그인한 AWS 계정이 운영 계정이다.
- 버킷과 배포 조회가 성공한다.
- CloudFront 상태가 `Deployed`, `Enabled`가 `true`다.
- 작업 트리의 변경 사항이 배포하려는 내용과 일치한다.

## 4. 빌드와 로컬 검증

저장소 루트에서 실행한다.

```sh
cd frontend
yarn install --frozen-lockfile
yarn lint
yarn tsc --noEmit
yarn build
cd ..
node infra/cloudfront-functions/redirect-root.test.js
git diff --check
git status --short
```

브라우저에서 한국어와 영어, 데스크톱과 모바일 화면을 확인한다. 배포 대상은
`frontend/out/`이며 `.next/`는 업로드하지 않는다.

## 5. 현재 운영 파일 백업

롤백이 필요할 때 덮어쓴 객체를 복구할 수 있도록 배포마다 다른 로컬 디렉터리에
현재 버킷 내용을 내려받는다. `<배포시각>`은 예를 들어
`20260901-140000`처럼 작성한다.

```sh
mkdir -p .tmp/deploy-backups/<배포시각>
aws s3 sync \
  s3://nasa-space-app-frontend/ \
  .tmp/deploy-backups/<배포시각>/ \
  --profile nasa-space-apps
```

`.tmp/`의 백업은 커밋하지 않는다.

## 6. S3 배포

먼저 실제로 변경될 객체를 확인한다.

```sh
aws s3 sync \
  frontend/out/ \
  s3://nasa-space-app-frontend/ \
  --dryrun \
  --profile nasa-space-apps
```

목록에 예상하지 않은 경로나 삭제가 없다면 업로드한다.

```sh
aws s3 sync \
  frontend/out/ \
  s3://nasa-space-app-frontend/ \
  --profile nasa-space-apps
```

기본 배포에서는 `--delete`를 사용하지 않는다. S3에만 남은 객체를 삭제해야
한다면 목록과 백업을 확인한 후 별도 승인하에 실행한다.

## 7. CloudFront 캐시 무효화

새 정적 파일이 즉시 보이도록 전체 경로를 무효화한다.

```sh
aws cloudfront create-invalidation \
  --distribution-id E2YXIKKQFK315W \
  --paths '/*' \
  --profile nasa-space-apps
```

출력된 invalidation ID로 완료를 기다린다.

```sh
aws cloudfront wait invalidation-completed \
  --distribution-id E2YXIKKQFK315W \
  --id <INVALIDATION_ID> \
  --profile nasa-space-apps
```

## 8. 루트 리디렉트 함수 최초 적용

CloudFront 콘솔에서 다음 순서로 진행한다. 기존 Default 캐시 동작의 Viewer
Request에 다른 함수가 이미 연결돼 있다면 덮어쓰지 말고 중단한다.

1. CloudFront → Functions에서 `nasa-space-apps-redirect-latest`를 생성한다.
2. JavaScript runtime 2.0을 선택한다.
3. `infra/cloudfront-functions/redirect-root.js`의 내용을 함수 코드로 저장한다.
4. URI `/` 테스트가 302와 `Location: /2025/`를 반환하는지 확인한다.
5. URI `/2025/` 테스트가 원래 request를 반환하는지 확인한다.
6. 함수를 `LIVE`로 게시한다.
7. 배포 `E2YXIKKQFK315W`에 Association을 추가한다.
8. 캐시 동작은 Default (`*`), 이벤트는 Viewer Request를 선택한다.
9. 배포 상태가 다시 `Deployed`가 될 때까지 기다린다.

함수 코드만 수정한 이후 배포에서는 저장·테스트 후 `Publish and update`를
사용한다. 최신 연도를 바꿀 때는 다음 두 파일의 목적지를 함께 변경한다.

- `infra/cloudfront-functions/redirect-root.js`
- `frontend/src/app/page.tsx`

참고 문서:

- [CloudFront Function 생성](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/create-function.html)
- [CloudFront Function 게시](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/publish-function.html)
- [CloudFront 배포에 함수 연결](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/associate-function.html)
- [CloudFront 캐시 무효화](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation_Requests.html)

## 9. 운영 검증

```sh
curl -sS -D - -o /dev/null https://nasaspaceappskr.org/
curl -sS -D - -o /dev/null https://nasaspaceappskr.org/2025/
curl -sS -D - -o /dev/null https://nasaspaceappskr.org/2025/ko/index/
curl -sS -D - -o /dev/null https://nasaspaceappskr.org/2025/en/index/
```

정상 결과는 다음과 같다.

- `/`: 302, `Location: /2025/`, `Cache-Control: max-age=0, must-revalidate`
- `/2025/`와 한국어·영어 페이지: 200
- 브라우저 페이지 이동 시 폰트와 로고 크기 플래시 없음
- 챗봇 페이지에 행사 종료 안내가 표시되고 입력이 비활성화됨
- 모바일 메뉴가 페이지 이동 후 닫힘

## 10. 롤백

정적 사이트에 문제가 있으면 5단계에서 만든 백업을 다시 업로드하고 캐시를
무효화한다.

```sh
aws s3 sync \
  .tmp/deploy-backups/<배포시각>/ \
  s3://nasa-space-app-frontend/ \
  --profile nasa-space-apps
aws cloudfront create-invalidation \
  --distribution-id E2YXIKKQFK315W \
  --paths '/*' \
  --profile nasa-space-apps
```

루트 리디렉트에 문제가 있으면 CloudFront 콘솔에서 해당 Viewer Request
Association을 제거한다. `frontend/src/app/page.tsx`의 meta refresh가 fallback으로
남아 있으므로 루트 진입은 계속 `/2025/`로 이동한다.
