# MY SPACE 구현·인계 안내

- [LOCAL_SETUP.md](LOCAL_SETUP.md): 현재 실행 방법, 서버 전용 설정, 연결 제약과 검증 범위.
- [POLICIES_AND_ARCHITECTURE.md](POLICIES_AND_ARCHITECTURE.md): 확정 정책, 네 역할, 공통/역할별/검토 코드 책임.
- [CODEX_HANDOFF.md](CODEX_HANDOFF.md): 상세 DB/API 목표 계약과 남은 작업.
- [PILOT_POLICY.md](PILOT_POLICY.md): 정책 요약.

현재 Hosted Site는 비공개 정적 화면이다. 실제 Node 서버와 SQLite를 배포하지 않았다. 로컬 서버는 같은 origin에서 화면과 API를 제공한다. nasaspaceappskr.org 통합 시 `/auth/*`, `/admin/*`, `/verify-email`, `/verify.js` 등을 같은 origin의 허브 서버에 reverse proxy해야 한다. 다른 origin을 auth-config.js에 입력하는 것만으로는 연결되지 않는다. 교차 origin 쿠키/CORS 방식은 현재 지원하지 않는다.

환경변수는 `.env.example`와 LOCAL_SETUP.md를 기준으로 한다. 이 구현은 DB에 해시된 불투명 세션 토큰을 저장하므로 별도 AUTH_SESSION_SECRET을 사용하지 않는다. Google Sheets 어댑터는 미구현이며, Sheets 관련 설정을 현재 필수 변수로 오해하지 않는다.

실제 참가 자료·이메일·비밀키는 이 저장소에 넣지 않는다. 원본 Forms/Sheets는 읽기 전용이며 연결 권한과 운영 DB 변경 범위는 별도 관리한다.
