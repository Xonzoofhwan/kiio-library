# 컨텍스트 엔지니어링 — Anthropic 스킬 설계 원칙

> 2026년 Anthropic 공식 가이드 + 엔지니어링 블로그 기반. 스킬 작성·리구조화 시 참조.

---

## 1. Progressive Disclosure (단계별 공개)

스킬은 프롬프트처럼 대화에 바로 주입되지 않는다. 3단계로 로딩된다:

| 단계 | 로딩 시점 | 토큰 비용 |
|------|-----------|-----------|
| 1단계 | name + description — 상시 로딩 | ~100 토큰/스킬 |
| 2단계 | SKILL.md body — 매칭 시에만 | body 크기만큼 |
| 3단계 | references/ 파일 — 실제 참조 시점에 | 해당 파일만큼 |

**결론**: SKILL.md는 TOC(목차) 역할만 하고, 상세 내용은 references/에 분리한다.

## 2. Description = 유일한 트리거

- description이 유일한 발동 조건. body에 "when to use" 적어도 Claude가 참조 안 함
- description은 최대 1,024자. 3인칭으로 작성 시 발견 정확도 향상
- body에는 "무엇을 어떻게 할지"만 작성

## 3. Body 500줄 제한

- Context window는 공공재 — 스킬이 로딩되면 대화 기록과 토큰을 나눠 사용
- SKILL.md body ≤ 500줄. 초과 시 references/로 분리
- 참조 파일은 SKILL.md에서 1단계 깊이로만 링크
- 2단계 이상 중첩 참조 시 Claude가 `head -100`으로 일부만 읽을 위험

## 4. Claude는 이미 똑똑하다

- Python 기본 문법, 프레임워크 공식 문서의 재설명은 토큰 낭비
- 50토큰 코드 예시가 150토큰 개념 설명보다 성능 우수
- 모든 문장에 "이 설명이 토큰값을 하는가?" 자문
- 작업 자유도를 3단계로 구분하여 지시 강도 조절:
  - **낮음** (DB 마이그레이션, 보안): 단계별 체크리스트 + MUST 강제
  - **중간** (기능 구현): 코드 예시 + expected output
  - **높음** (코드 리뷰, 설계): 원칙만 제시, 구체적 형태는 위임

## 5. 검증 루프를 body에 삽입

- 실행 → 검증 → 수정 → 재검증 루프를 body에 명시
- 체크리스트를 넣으면 단계 건너뛰기가 줄어듦
- "MUST"가 "always"보다 준수율 높음 (Anthropic 가이드 명시)
- 에러 메시지를 구체적으로 작성해야 Claude가 자동 수정 가능

## 6. 동적 컨텍스트 운영 (Static → Dynamic)

- 정적 컨텍스트의 시대는 끝남
- 작업 유형별로 필요한 참조 파일만 동적 로딩 (Init Checklist 테이블 패턴)
- 참조 파일의 Index/TOC를 먼저 읽고, 관련 섹션만 `Read(offset, limit)`로 drill down
- KV-Cache 적중률을 높이려면 자주 로드하는 컨텍스트를 프롬프트 앞쪽에 배치

## 7. 계층화된 메모리

| 계층 | 수명 | 파일 |
|------|------|------|
| 단기 | 세션 내 | WORKSPACE.md |
| 중기 | 세션 간 | lesson-learnings.md (Active) |
| 장기 | 영구 | Embedded/Enforced 레슨, CODEBASE.md, 가이드 파일 |

- 실패한 액션과 스택 트레이스를 남겨두면 같은 실수 반복 방지
- todo.md 패턴: 목표를 컨텍스트 끝에 반복 삽입하여 'lost-in-the-middle' 문제 해결
