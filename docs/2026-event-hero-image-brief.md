# 2026 Event Hero 슬라이드 이미지 요청서

## 납품 규격

- 수량: 3장
- 데스크톱 원본: **2400 × 1000 px**, 12:5
- 형식: WebP, sRGB, 이미지당 권장 450 KB 이하
- 이미지 안에 글자, 행사 일정, 로고, 버튼을 넣지 않는다.
- 중요한 피사체는 가장자리 위주로 두고 중앙과 좌우 텍스트 영역은 단순하게
  유지한다. 실제 화면에서는 반응형 `cover` crop과 어두운 overlay가 적용된다.
- 모바일에서 구도가 중요하면 같은 장면의 **1200 × 1600 px, 3:4** 별도 버전을
  추가로 요청한다. 1차 구현은 데스크톱 원본을 반응형 crop한다.

파일명:

1. `2026-event-01-earth-data.webp`
2. `2026-event-02-seoul-collaboration.webp`
3. `2026-event-03-space-innovation.webp`

최종 파일 위치는 `frontend/public/images/2026/hero/`이다. 이미지가 도착하기
전에는 기존 navy gradient가 그대로 표시되며 빈 이미지나 깨진 링크는 노출하지
않는다.

## 공통 생성 조건

아래 문장을 각 프롬프트 끝에 공통으로 붙인다.

> Ultra-wide website hero background, 12:5 aspect ratio, 2400×1000 composition,
> deep navy and indigo palette with restrained cyan highlights, premium editorial
> technology photography, atmospheric depth, clean negative space for white
> foreground text and translucent information cards, no words, no letters, no
> numbers, no logos, no badges, no watermark, no identifiable person, no fictional
> event details, avoid busy detail in the center and right text-safe areas.

## 이미지 1 — Earth Data

```text
A cinematic view of Earth from low orbit at night, the Korean peninsula and East
Asia suggested through subtle city lights, elegant scientific data arcs and faint
topographic grid lines flowing around the planet, realistic atmosphere and cloud
detail, calm and credible rather than science fiction. Keep the planet's brightest
detail toward the far left and lower edge while preserving broad dark negative
space across the center and right.

[공통 생성 조건]
```

## 이미지 2 — Seoul Collaboration

```text
A contemporary collaborative hackathon environment in Seoul, diverse anonymous
participants seen only as soft silhouettes and hands working around laptops,
notebooks and data visualizations, a subtle Seoul night skyline through glass in
the background, energetic but organized, authentic documentary lighting. Keep
faces unidentifiable and the center and right side visually quiet for overlaid
information.

[공통 생성 조건]
```

## 이미지 3 — Space Innovation

```text
An elegant visual metaphor for open-data innovation connecting Earth and space:
satellite observation paths, atmospheric layers, abstract orbital geometry and
small points of light forming a collaborative network, grounded in real aerospace
visual language, sophisticated and minimal, not a fantasy spaceship scene. Place
the main luminous forms near the outer edges and retain dark negative space for
foreground content.

[공통 생성 조건]
```

생성 도구가 negative prompt를 별도로 지원하면 다음을 사용한다.

```text
text, typography, logo, NASA wordmark, NASA insignia, watermark, poster layout,
fake UI, fake event date, astronaut close-up, identifiable face, oversaturated neon,
clutter, low resolution, distorted hands
```
