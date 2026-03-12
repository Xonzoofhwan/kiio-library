---
name: new-component
description: "4 Phase 컴포넌트 개발 통합 플로우 (Visual Spec → Behavior Spec → Implement → Showcase → Verify)"
argument-hint: "[ComponentName] [FigmaURL?]"
---

# New Component — 전체 개발 플로우

컴포넌트 개발의 4 Phase를 순차적으로 안내한다.
각 Phase 완료 후 사용자 확인을 받고 다음으로 진행한다.

**입력**: `$ARGUMENTS` = 컴포넌트명 (선택: Figma URL)

---

## 시작 — 상태 확인

컴포넌트명을 파싱하고, 기존 진행 상태를 확인한다:

1. `specs/$ARGUMENTS.json` 존재 여부 확인
2. `src/components/{Name}/{Name}.tsx` 존재 여부 확인
3. `src/showcase/{Name}Showcase.tsx` 존재 여부 확인

상태에 따라 시작 Phase를 결정한다:

| specs JSON | 컴포넌트 소스 | 쇼케이스 | → 시작 Phase |
|:----------:|:-----------:|:--------:|:----------:|
| ✗ | ✗ | ✗ | **Phase 1** (처음부터) |
| 시각만 | ✗ | ✗ | **Phase 2** (동작 스펙부터) |
| 완성 | ✗ | ✗ | **Phase 3** (구현부터) |
| 완성 | ✓ | ✗ | **Phase 4** (쇼케이스부터) |
| 완성 | ✓ | ✓ | **Verify** (검증만) |

사용자에게 현재 상태와 시작 Phase를 알려주고, 확인을 받는다.

---

## Phase 1 — Visual Spec

`.claude/skills/01-visual-spec/SKILL.md`의 **전체 절차**를 실행한다.

완료 기준: `specs/{name}.json`에 시각 섹션(variants.size, variants.{visualAxis})이 작성됨.

→ **체크포인트**: "시각 스펙이 완료되었습니다. 동작 스펙(Phase 2)으로 진행할까요?"

---

## Phase 2 — Behavior Spec

`.claude/skills/02-behavior-spec/SKILL.md`의 **전체 절차**를 실행한다.

전제: `specs/{name}.json`에 시각 섹션이 존재해야 한다.

완료 기준: `specs/{name}.json`의 props, states, implementation 섹션이 완성됨.

→ **체크포인트**: "동작 스펙이 완료되었습니다. 구현(Phase 3)으로 진행할까요?"

---

## Phase 3 — Implement

`.claude/skills/03-implement/SKILL.md`의 **전체 절차**를 실행한다.

전제: `specs/{name}.json`이 완성 상태(시각 + 동작)여야 한다.

완료 기준:
- `src/tokens/tokens.css`에 컴포넌트 토큰 추가
- `src/components/{Name}/{Name}.tsx` + `index.ts` 생성
- `src/App.tsx`, `src/components/showcase-layout/Sidebar.tsx`에 등록
- `npm run build` 통과

→ **체크포인트**: "구현이 완료되었습니다. 쇼케이스(Phase 4)를 구성할까요?"

---

## Phase 4 — Showcase

`.claude/skills/04-showcase/SKILL.md`의 **전체 절차**를 실행한다.

전제: 컴포넌트가 구현되고 빌드가 통과해야 한다.

완료 기준:
- `src/showcase/{Name}Showcase.tsx` 생성
- `{COMPONENT}_TOC` export
- `npm run build` 통과

---

## Final — Verify

`.claude/skills/05-verify/SKILL.md`를 실행하여 전체 검증한다.

검증 항목:
- 빌드
- 토큰 무결성
- 패턴 준수 (12항목)
- 쇼케이스 등록 (4항목)

→ 최종 리포트를 사용자에게 제시한다.

→ "컴포넌트 개발이 완료되었습니다. `npm run dev`로 시각적으로 확인해주세요."

---

## 참조

| Phase | 개별 스킬 | 산출물 |
|-------|----------|--------|
| 1. Visual Spec | `/visual-spec` | `specs/{name}.json` 시각 섹션 |
| 2. Behavior Spec | `/behavior-spec` | `specs/{name}.json` 전체 |
| 3. Implement | `/implement` | 토큰 + 컴포넌트 + 등록 |
| 4. Showcase | `/showcase` | 쇼케이스 페이지 |
| Verify | `/verify` | 검증 리포트 |

**개별 Phase 재실행**: 특정 단계만 다시 실행하려면 해당 개별 스킬을 직접 호출한다.
예: 쇼케이스만 재구성 → `/showcase {Name}`
