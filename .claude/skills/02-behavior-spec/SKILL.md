---
name: behavior-spec
description: "동작 스펙 작성 — 분류, Props, States, 구현 계획을 정의하여 JSON 스펙 완성"
argument-hint: "[ComponentName]"
---

# Behavior Spec — 동작 스펙 정의

컴포넌트의 동작 사양을 정의하여 `specs/{component}.json`을 완성한다.
분류, 라이브러리 평가, Props 설계, States 설계, 구현 계획을 순차적으로 진행한다.

**입력**: `$ARGUMENTS` = 컴포넌트명

---

## 전제조건

1. `specs/$ARGUMENTS.json`이 존재하고 시각 섹션(`variants.size`, `variants.{visualAxis}`)이 채워져 있어야 한다.
2. 시각 섹션이 없으면 **중단**: "시각 스펙이 먼저 필요합니다. `/visual-spec $ARGUMENTS`를 실행해주세요."

---

## Step 1 — 컴포넌트 분류

`docs/DESIGN_PRINCIPLES.md`의 컴포넌트 분류 기준을 적용한다:

| 분류 | 기준 | 패턴 | 예시 |
|------|------|------|------|
| **Primitive** | 단일 HTML 요소 | CVA + cn | Button, Badge, Avatar |
| **Composite** | 여러 Primitive 조합, 단순 props 전달 | Props pass-through | FormField, Card, Alert |
| **Pattern** | 복합 상태 공유, 사용자가 구조 제어 | Compound + Context | Dialog, Tabs, Select, DropdownMenu |

### 판단 과정

1. 이 컴포넌트는 몇 개의 HTML 요소로 구성되는가?
2. 하위 요소 간 상태 공유가 필요한가? (선택 상태, 열림/닫힘 등)
3. 사용자가 하위 요소의 배치를 제어해야 하는가?

→ 분류 결과와 근거를 사용자에게 제시한다. 확인을 받은 후 진행.

---

## Step 2 — 라이브러리 평가

### Pattern 유형일 때

Radix UI 프리미티브가 존재하는지 확인한다:

```
@radix-ui/react-dialog
@radix-ui/react-tabs
@radix-ui/react-select
@radix-ui/react-dropdown-menu
@radix-ui/react-accordion
@radix-ui/react-tooltip
@radix-ui/react-popover
@radix-ui/react-toggle-group
```

- Radix가 있으면: "Radix 프리미티브를 래핑하고 프로젝트 토큰으로 스타일링" 권장
- Radix가 없으면: `docs/ADVANCED_PATTERNS.md`의 Compound Component 패턴으로 직접 구현

### 모든 유형

기존 컴포넌트 토큰 재사용 가능성을 검토한다:

| 재사용 패턴 | 예시 |
|-------------|------|
| 높이/아이콘 공유 | TextField → `var(--comp-button-height-*)`, `var(--comp-button-icon-*)` |
| 색상 토큰 공유 | SearchField → `var(--comp-textfield-*)` 전체 재사용 |
| 완전 독립 | Badge — 고유 토큰 세트 |

→ 선택지를 사용자에게 제시. 확인 후 진행.

---

## Step 3 — Props 설계

Props Decision Tree를 순차적으로 적용한다:

### 판단 트리

각 후보 prop에 대해:

1. **Figma에 variant로 존재하는가?** → prop으로 추가
2. **앱 고유 동작인가?** (특정 비즈니스 로직) → prop이 아닌 composition으로 해결
3. **className이나 children으로 해결 가능한가?** → prop 불필요
4. **표준 HTML attribute인가?** (onClick, disabled, id 등) → 이미 상속됨, 재선언 금지
5. **시각적/동작적 variant인가?** → prop으로 추가, JSDoc 필수

### Props 테이블 작성

각 prop에 대해:

| Prop | Type | Default | Description | 근거 |
|------|------|---------|-------------|------|
| variant | `ButtonVariant` | `'primary'` | 시각적 계층 | Figma variant |
| size | `ButtonSize` | `'medium'` | 크기 | Figma variant |
| disabled | `boolean` | `false` | 비활성 | 상태 prop |
| ... | ... | ... | ... | ... |

### 네이밍 규칙

- Figma property 이름을 camelCase로 변환
- 아이콘: `iconLeading` / `iconTrailing` (RTL-safe, iconLeft/iconRight 금지)
- Boolean state: `disabled`, `loading`, `readOnly` (variant가 아님)
- `as const` 배열: `{COMPONENT}_{PROP}S` SCREAMING_SNAKE_CASE

→ props 테이블을 사용자에게 제시. 확인 후 진행.

---

## Step 4 — States 설계

적용 가능한 상태를 파악하고 각각의 전략을 명시한다.

### 상태별 전략

| State | 전략 | 토큰 참조 |
|-------|------|-----------|
| **hover** | State overlay `<span>` + `group-hover` | 어두운 bg → `semantic-state-on-dim-*`, 밝은 bg → `semantic-state-on-bright-*` |
| **pressed** | State overlay + `group-active` | 동일 로직, 더 강한 토큰 |
| **focused** | `group-focus-visible` + ring | `focus-visible:ring-2 ring-[var(--comp-{name}-focus-border)]` |
| **disabled** | `cursor-not-allowed` + per-variant 색상 override | `--comp-{name}-bg-{variant}-disabled`, `--comp-{name}-content-{variant}-disabled` |
| **loading** | Content invisible + absolute Spinner | `pointer-events-none` + `aria-disabled` + `aria-busy` |

### Overlay 방향 결정

각 시각적 variant에 대해:
- 배경이 어두운가 (solid-800~950, primary-500+)? → `on-dim`
- 배경이 밝은가 (solid-0~300, alpha, transparent)? → `on-bright`

→ states 요약을 사용자에게 제시.

---

## Step 5 — Implementation 계획

최종 구현 계획을 작성한다.

### 작성 항목

```json
"implementation": {
  "pattern": "CVA + cn + @radix-ui/react-slot",
  "classification": "Primitive",
  "stateOverlay": "on-dim for primary, on-bright for secondary/outlined/ghost",
  "files": [
    "src/tokens/tokens.css",
    "src/components/{Name}/{Name}.tsx",
    "src/components/{Name}/index.ts",
    "src/showcase/{Name}Showcase.tsx",
    "src/App.tsx",
    "src/components/showcase-layout/Sidebar.tsx"
  ],
  "dependencies": [
    "@radix-ui/react-slot",
    "src/components/icons/Spinner.tsx"
  ],
  "tokenReuse": "none | partial (from Button) | full (from TextField)"
}
```

→ 전체 spec JSON을 사용자에게 제시. 확인 후 `specs/{component}.json`에 기록.

→ "동작 스펙이 완성되었습니다. 다음 단계는 `/implement $ARGUMENTS`로 구현을 시작합니다."

---

## 참조 파일

| 목적 | 경로 |
|------|------|
| 컴포넌트 분류 & Props 판단 트리 | `docs/DESIGN_PRINCIPLES.md` §A |
| Compound Component 패턴 | `docs/ADVANCED_PATTERNS.md` |
| CVA + cn, Icon, Loading, asChild | `docs/COMPONENT_PATTERNS.md` |
| 모션 토큰, 상태 전이 | `docs/INTERACTION_DESIGN.md` |
| Gold standard (Primitive) | `src/components/Button/Button.tsx` |
| Input-based 참조 | `src/components/TextField/TextField.tsx` |
| Compound 참조 | `src/components/Tab/Tab.tsx` |
| 기존 컴포넌트 토큰 | `src/tokens/tokens.css` |
