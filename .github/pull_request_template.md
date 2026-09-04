## 변경 목적

<!-- 무엇을 왜 변경했는지 간단히 설명해 주세요. -->

## 영향 범위

- [ ] 2025 archive
- [ ] 2026 active site/content
- [ ] Shared layout, CSS, dependency, configuration 또는 asset
- [ ] Documentation/governance only
- [ ] Legacy infrastructure

## 검증

- [ ] `corepack yarn lint`
- [ ] `corepack yarn tsc --noEmit`
- [ ] `corepack yarn build`
- [ ] `corepack yarn check:routes`
- [ ] `node infra/cloudfront-functions/redirect-root.test.js`
- [ ] `git diff --check`
- [ ] 한국어와 영어 확인
- [ ] Desktop과 mobile 확인
- [ ] `/2025/` 및 대표 archive route 회귀 확인

실행하지 않은 항목과 이유:

<!-- 해당 사항이 없으면 "없음"이라고 작성해 주세요. -->

## Preview와 공개 승인

Vercel Preview URL 또는 Preview가 필요하지 않은 이유:

<!-- URL에 secret이나 접근 token을 포함하지 마세요. -->

- [ ] 미확정 또는 비공개 콘텐츠가 노출되지 않음을 확인했습니다.
- [ ] 문구, 이미지, 기관명과 logo의 공개 승인을 확인했습니다.
- [ ] 비밀번호, token, API key, recovery code 또는 실제 환경변수 값을 포함하지 않습니다.

## Production 영향과 승인

<!-- 문서 변경을 포함해 main merge는 Vercel Production을 자동 시작합니다. -->

- [ ] 표준 Vercel 배포 외의 추가 운영 설정 영향이 없습니다.
- [ ] 추가 Production/운영 인프라 영향이 있으며 아래에 내용을 설명했습니다.
- [ ] 프로젝트 소유자가 `main` merge 및 Production 시작을 명시적으로 승인했습니다.

Production/운영 영향:

<!-- DNS, 이메일, Vercel 설정, AWS 등 별도 운영 작업은 코드 PR과 구분하세요. -->
