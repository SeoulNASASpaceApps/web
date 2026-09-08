# 2026 개발 범위와 챗봇 도입 로드맵

이 문서는 2026 사이트의 제품 범위와 향후 챗봇 도입 조건을 기록합니다. 사람의
기여와 접근 책임은 `CONTRIBUTING.md`, 현재 Vercel 릴리스 절차는
`docs/vercel-release-formula.md`를 기준으로 합니다.

## 1. 현재 결정

- 2026 사이트는 Vercel Production에서 제공하는 정적 public website다.
- 대표 주소의 root는 `/2026/ko/`로 이동하며 `/2025/**`는 archive로 유지한다.
- 회원가입, 로그인, 계정, dashboard 또는 자체 참가 신청 backend를 만들지 않는다.
- Seoul Participation Confirmation은 승인된 외부 Form을 사용한다.
- 2026 chatbot은 현재 공개 버전에 포함하지 않는다.
- 일반 개발과 릴리스에는 AWS, CloudFront, S3 또는 DNS 변경이 필요하지 않다.
- legacy AWS 환경을 복구하거나 다시 사용하는 작업은 project owner의 별도 명시적
  승인이 있어야 한다.

공식 source of truth는 `SeoulNASASpaceApps/web`입니다. 개인 repository 또는
`review` remote는 참고나 임시 검토에 사용할 수 있지만 별도 제품으로 개발하지
않고 Production source로 사용하지 않습니다.

## 2. 현재 공개 사이트 경계

```text
Static public website
├── /2025/**                  archived legacy pages
├── /2026/{ko,en}/**          active cohort pages
├── approved public content
└── no account or chat API
```

- 기존 `/2025/{locale}/chatbot/`은 종료된 2025 기록이므로 유지한다.
- 공개 `Person`, `Project`, `Team`, `Award`와 미래의 private user account는 분리한다.
- 참가자 이메일과 비공개 개인정보는 static content에 추가하지 않는다.
- 미확정 콘텐츠는 unpublished 또는 `null` 상태로 유지한다.

## 3. 챗봇 Go/No-Go 조건

다음 항목이 모두 정해졌을 때 별도 project 단계로 시작합니다.

1. 챗봇의 목적과 답변 범위
2. 행사 전·행사 중 운영 기간
3. 예상 사용자 수와 월 사용 한도
4. 모델/API 비용 책임 주체와 예산 상한
5. 답변 근거가 될 승인된 한국어·영어 콘텐츠
6. 운영 담당자, 장애 대응자와 종료 정책
7. 개인정보·대화 로그 수집 여부와 보존 기간
8. 부정확한 답변 신고와 사람 문의 fallback

## 4. 권장 기술 경계

챗봇을 도입해도 현재 정적 사이트 전체를 server application으로 바꾸지 않습니다.

```text
Static public website
        │
        └── /2026/{locale}/chatbot UI
                    │ HTTPS
                    ▼
             Separate chat API
                    ├── server-side model credential
                    ├── approved event knowledge
                    ├── rate limit and budget limit
                    └── safety and logging policy
```

- 모델 API key를 browser bundle, Markdown, GitHub 또는 static export에 넣지 않는다.
- browser에서 모델 API를 직접 호출하지 않는다.
- chatbot 장애가 Main, Bulletin 또는 Archive 이용을 막지 않게 한다.
- 공개 content ID와 locale만 전달하고 account system에 의존하지 않는다.
- 질문·답변 log는 기본적으로 수집하지 않는다. 필요하면 동의와 보존 정책을 먼저
  정한다.
- 요청 크기, 분당 요청 수, 일·월 예산 한도와 kill switch를 둔다.
- 답변이 공식 참가 등록이나 운영진의 확정 안내를 대체하지 않음을 표시한다.

## 5. 단계적 도입안

1. **Prototype:** local mock 답변으로 UI와 한국어·영어 경험만 검증
2. **Closed pilot:** 운영진만 승인 콘텐츠와 답변 품질 평가
3. **Limited public:** 정한 기간과 예산 한도로 공개하고 사람 문의 fallback 제공
4. **Event operation:** monitoring 담당자가 있을 때만 행사 기간 활성화
5. **Archive:** 행사 종료 후 API를 끄고 정적 종료 안내로 전환

provider, backend hosting, model과 예산은 Go 결정 시점의 요구사항과 가격을 다시
확인해 선택합니다. 그 전에는 provider SDK, API key, chat storage 또는 불필요한
authentication을 추가하지 않습니다.
