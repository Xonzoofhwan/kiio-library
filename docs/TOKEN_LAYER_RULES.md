# Token Layer Decision Rules

> 토큰을 어느 레이어(Primitive / Semantic / Component)에 배치할지 판단하는 규칙.
> 새 컴포넌트 구현 시 반드시 이 규칙을 따른다.

---

## 핵심 판단 질문

> **"이 값이 바뀌면 시스템 전체가 바뀌어야 하는가?"**
>
> - Yes → **Semantic**
> - No, 이 컴포넌트만 → **Component**

---

## 각 레이어의 역할

| 레이어 | 역할 | 질문 | CSS 스코프 |
|--------|------|------|------------|
| **Primitive** | 원시값 (hex, px, ms) | "팔레트에 어떤 값들이 존재하는가?" | `:root`, 테마 불변 |
| **Semantic** | 의미 부여 + 시스템 전체 옵션 정의 | "이 모드/브랜드에서 'primary'란 무엇인가?" | `[data-theme]`, 테마별 전환 |
| **Component** | 컴포넌트별 역할 바인딩 (좌표계) | "이 컴포넌트의 이 부분은 어떤 옵션을 쓰는가?" | `:root` 기본, `[data-theme]` 예외 오버라이드 |

> ⚠️ **주의**: 컴포넌트 토큰이 `var(--semantic-*)`를 참조하면 반드시 `[data-theme]` 스코프에 선언해야 한다.
> `:root`에 선언하면 시맨틱 토큰이 해당 스코프에 존재하지 않아 var() 체인이 끊어진다.
> 크기/스페이싱 토큰(`var(--spacing-*)`, `var(--radius-*)`)은 `:root`에 정의되므로 `:root`에 선언 가능.

**비유**: Semantic = **옵션 메뉴** (어떤 선택지가 있는가), Component = **메뉴에서 선택** (이 컴포넌트는 어떤 선택지를 쓰는가)

---

## 테마/모드 분기 위치 결정

| 상황 | 어디서 분기? | 예시 |
|------|------------|------|
| 브랜드 전체 색상이 달라짐 | **Semantic** | `--semantic-primary-500`: brand1→purple, brand2→red-orange |
| 시스템 전체 radius 방향이 달라짐 | **Semantic** | `--semantic-radius-default`, `--semantic-radius-full` 추가 |
| 특정 컴포넌트만 테마별로 다름 | **Component 오버라이드** | `[data-theme="brand2"] { --comp-button-radius-md: ... }` |

---

## Semantic에 적합한 것 vs Component에 적합한 것

### Semantic

- 색상 역할 (primary, success, error, neutral...)
- 시스템 전체 모드 (둥근 UI vs 각진 UI, 모션 on/off 등)
- 텍스트 역할 (on-bright, on-dim)
- 상태 역할 (state-on-bright, state-on-dim)
- 모션 역할 (duration-fast, easing-enter)

### Component

- 컴포넌트별 bg/content/border 역할 매핑
- 컴포넌트별 size variant (height, padding, gap, radius, icon)
- 컴포넌트별 상태 (disabled bg/content, hover/active overlay)
- 컴포넌트별 focus 스타일

---

## Component 레벨 테마 오버라이드 패턴

기본값은 `:root`에 두고, 예외만 `[data-theme]`에서 덮는다:

```css
/* 기본 (모든 테마 공통) */
:root {
  --comp-button-radius-md: var(--radius-3);   /* 12px */
}

/* brand2에서만 오버라이드 */
[data-theme="brand2"] {
  --comp-button-radius-md: var(--radius-0);   /* 0px */
}
```

### 규칙

- `:root`의 기본값은 가장 일반적인 테마 기준으로 설정
- `[data-theme]` 오버라이드는 **차이점만** 선언 (동일한 값 중복 금지)
- 컴포넌트 코드(Button.tsx 등)는 **변경 없이** 동작해야 함

### Semantic + Component 조합 예시

특정 모드에서 대부분 radius 0이지만, 칩/탭은 pill(999px)을 유지하는 경우:

```css
/* Semantic: 시스템 전체 옵션 정의 */
[data-theme="brand2"] {
  --semantic-radius-default: var(--radius-0);     /* 각진 UI */
  --semantic-radius-full: var(--radius-24);       /* pill 형태 */
}

/* Component: 각 컴포넌트가 어떤 옵션을 쓸지 선택 */
:root {
  --comp-button-radius-md: var(--semantic-radius-default);  /* 각진 */
  --comp-chip-radius: var(--semantic-radius-full);          /* 둥근 */
  --comp-tab-radius: var(--semantic-radius-full);           /* 둥근 */
}
```

---

## Semantic 없이 Component만 쓰면 안 되는 이유

1. **중복 폭발**: 컴포넌트 N개 x 테마 M개 = N x M 벌 선언. 대부분 동일한 값이 반복됨.
2. **일관성 파괴**: `--comp-button-focus: purple-300`, `--comp-input-focus: purple-400` 같은 불일치가 구조적으로 발생 가능. Semantic이 있으면 둘 다 `var(--semantic-primary-300)`을 참조하므로 불일치 불가.
3. **변경 비용**: "primary 색 변경" 시 모든 컴포넌트를 찾아다녀야 함. Semantic이 있으면 1곳만 수정.

---

## 실전 판단 플로우차트

```
새 토큰 값을 추가할 때:

1. "이 값은 하드코딩된 원시값인가?"
   → Yes → Primitive (:root에 hex/px/ms)

2. "이 값이 바뀌면 여러 컴포넌트가 함께 바뀌어야 하는가?"
   → Yes → Semantic ([data-theme]에 의미 역할 정의)

3. "이 값은 특정 컴포넌트의 특정 부위에만 쓰이는가?"
   → Yes → Component (:root에 역할 바인딩)

4. "이 Component 토큰이 테마별로 달라야 하는가?"
   → Yes → [data-theme] 오버라이드 추가
   → No → :root에만 선언
```

---

## 값 흐름 예시

### 색상 (테마 변동, Semantic 경유)

```
Primitive          →  Semantic              →  Component                →  CVA
--primitive-gray-950   --semantic-neutral-950    --comp-button-bg-primary    bg-[var(--comp-...)]
#1d1e22                var(--primitive-gray-950) var(--semantic-neutral-950)
```

### 크기 (테마 불변, Semantic 생략)

```
Primitive          →  Component                →  CVA
--spacing-10          --comp-button-height-md      h-[var(--comp-...)]
40px                  var(--spacing-10)
```

### 색상 (테마 변동, Component가 Semantic primary 참조)

```
brand1: --semantic-primary-300 → var(--primitive-purple-300) → #c9b1f8
brand2: --semantic-primary-300 → var(--primitive-red-orange-300) → #ff9d85

--comp-button-focus-border: var(--semantic-primary-300)
→ data-theme 전환만으로 focus 색상 자동 변경
```
