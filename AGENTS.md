# 저장소 작업 지침

## 적용 범위

이 지침은 저장소 전체에 적용한다. `frontend/AGENTS.md`와
`infra/AGENTS.md`의 세부 지침은 해당 디렉터리 안에서 이 문서보다 우선한다.

## 프로젝트 구조

- `frontend/`: NASA Space Apps Seoul 2025 정적 Next.js 사이트
- `infra/`: 운영 CloudFront 동작을 재현하는 함수 코드와 검증
- `docs/`: 행사 콘텐츠와 일회성 프로젝트 기록

챗봇 페이지는 행사 종료 안내를 보여주는 정적 기록이며 채팅 API는 없다.

## URL과 연도별 아카이브

- 대표 진입 주소는 `https://nasaspaceappskr.org/`이다.
- 루트(`/`)는 최신 행사인 `/2025/`로 임시 리디렉트하고, 연도별 경로는
  이후에도 아카이브 URL로 유지한다.
- CloudFront 리디렉트가 적용되지 않았거나 S3 웹사이트 엔드포인트로 직접
  접근할 때는 `frontend/src/app/page.tsx`의 meta refresh를 fallback으로 쓴다.
- 최신 연도를 바꿀 때는 CloudFront Function과 위 fallback의 목적지를 함께
  변경한다.

## 운영 호스팅과 DNS

- 현재 최신 연도 아카이브 주소는 `https://nasaspaceappskr.org/2025/`이다.
- 도메인은 Squarespace에 등록되어 있으며 권한 DNS는
  `ns-cloud-e1`부터 `ns-cloud-e4.googledomains.com`까지 사용한다.
  Route 53은 사용하지 않는다.
- 루트 도메인은 외부 DNS의 ALIAS/CNAME flattening을 통해 CloudFront 배포
  `E2YXIKKQFK315W`(`d59q30zryhd0u.cloudfront.net`)를 가리킨다.
- CloudFront는 공개 S3 웹사이트 오리진
  `nasa-space-app-frontend.s3-website.ap-northeast-2.amazonaws.com`을
  제공하며 HTTP 요청을 HTTPS로 리다이렉트한다.
- 루트 리디렉트 코드는 `infra/cloudfront-functions/redirect-root.js`에 있다.
  운영 연결 대상은 배포 `E2YXIKKQFK315W`의 Default 캐시 동작 Viewer
  Request이며, 저장소 코드의 존재만으로 배포된 것으로 간주하지 않는다.
- ACM 인증서는 `us-east-1`에 있으며 `nasaspaceappskr.org`만 포함한다.
  `www.nasaspaceappskr.org`는 지원하지 않아 현재 HTTPS가 실패하고 403을
  반환한다.
- DNS, 인증서, CloudFront, S3 호스팅 변경은 사용자의 명시적 승인이
  필요하다. 이 도메인에 Route 53 명령이 적용된다고 가정하지 않는다.

## 작업 원칙

- 요청받은 영역만 수정하며 당장 필요하지 않은 추상화나 의존성을 추가하지
  않는다.
- 새 구현보다 기존 페이지, 로케일, 스타일 패턴을 우선 재사용한다.
- 다국어 페이지를 변경할 때 한국어와 영어 콘텐츠를 함께 유지한다.
- 자격 증명을 커밋하거나 비밀값을 출력하지 않는다.
- 사용자가 명시적으로 요청하지 않으면 AWS 리소스를 배포하거나 변경하지
  않는다.
- 저장소의 인프라 코드를 수정하는 것과 운영 AWS에 게시·연결하는 것을
  구분하고, 실제 배포 여부를 완료 보고에 명시한다.
- 생성 결과물(`frontend/.next/`, `frontend/out/`)과 외부 의존성 코드는
  직접 수정하지 않는다.

## 로컬 실행

`frontend/`에서 `yarn dev`를 실행한다. 프론트엔드는 3000번 포트를 사용한다.

## 작업 완료 전 확인

- 해당 디렉터리의 `AGENTS.md`에 적힌 최소 범위의 검증을 실행한다.
- `git diff --check`와 `git status --short`를 확인한다.
- 실행하지 못한 검증이 있으면 그 이유를 보고한다.
