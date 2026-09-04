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
| **Semantic** | 의미 부여 + 시스템 전체 옵션 정의 | "이 모드에서 '강조색'·'본문 텍스트'란 무엇인가?" | 색상은 `[data-theme]`(테마별 전환), 모션·scale은 `:root`(테마 불변) |
| **Component** | 컴포넌트별 역할 바인딩 (좌표계) | "이 컴포넌트의 이 부분은 어떤 옵션을 쓰는가?" | 색상은 `[data-theme]`, 크기·모션은 `:root`. 테마별 예외는 `[data-theme="dark"]` 오버라이드 |

> ⚠️ **스코프 규칙은 "참조 대상이 어디에 정의됐는가"로 판단한다.** 참조자가 아니라 피참조자의 위치가 기준이다.
>
> | 컴포넌트 토큰이 참조하는 것 | 그 값이 정의된 곳 | 컴포넌트 토큰을 선언할 곳 |
> |---|---|---|
> | `var(--semantic-{색상 계열}-*)` | `[data-theme="light"]` / `[data-theme="dark"]` | **`[data-theme]`** |
> | `var(--primitive-spacing-*)`, `var(--primitive-radius-*)` | `:root` | `:root` |
> | `var(--semantic-duration-*)`, `var(--semantic-easing-*)`, `var(--semantic-scale-press-*)` | `:root` (테마 불변) | `:root` |
>
> 색상 semantic 은 `[data-theme]` 안에만 존재하므로, 그것을 참조하는 컴포넌트 토큰을 `:root`에 두면
> var() 체인이 끊어져 값이 빈다. 반대로 모션·scale semantic 은 `:root`에 있으므로 `:root`에서 참조해도 멀쩡하다
> — 실제로 `--comp-scale-press-transition-in`이 `:root`에서 `var(--semantic-duration-fast)`를 쓰고 있다.

**비유**: Semantic = **옵션 메뉴** (어떤 선택지가 있는가), Component = **메뉴에서 선택** (이 컴포넌트는 어떤 선택지를 쓰는가)

---

## 테마/모드 분기 위치 결정

| 상황 | 어디서 분기? | 예시 |
|------|------------|------|
| 색상이 테마 전체에서 달라짐 | **Semantic** | `--semantic-neutral-solid-950`: light=`gray-950` / dark=`gray-0` 로 테마별 primitive 매핑 |
| 시스템 전체 radius 방향이 달라짐 | **Semantic** | `--semantic-radius-default`, `--semantic-radius-full` 추가 |
| 특정 컴포넌트만 테마별로 다름 | **Component 오버라이드** | `[data-theme="X"] { --comp-button-radius-md: ... }` |

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
  --comp-button-radius-md: var(--primitive-radius-3);   /* 12px */
}

/* 특정 테마에서만 오버라이드 */
[data-theme="X"] {
  --comp-button-radius-md: var(--primitive-radius-0);   /* 0px */
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
[data-theme="X"] {
  --semantic-radius-default: var(--primitive-radius-0);     /* 각진 UI */
  --semantic-radius-full: var(--primitive-radius-24);       /* pill 형태 */
}

/* Component: 각 컴포넌트가 어떤 옵션을 쓸지 선택
   — semantic 을 참조하므로 :root 가 아니라 [data-theme] 스코프에 둔다 (위 ⚠️ 참고) */
[data-theme] {
  --comp-button-radius-md: var(--semantic-radius-default);  /* 각진 */
  --comp-chip-radius: var(--semantic-radius-full);          /* 둥근 */
  --comp-tab-radius: var(--semantic-radius-full);           /* 둥근 */
}
```

> 위 `--semantic-radius-*` 는 아직 존재하지 않는 **가상의 예시**다. 오늘 radius 는 semantic 레이어 없이
> `--comp-*-radius-*` → `var(--primitive-radius-*)` 로 곧장 내려간다.

---

## Semantic 없이 Component만 쓰면 안 되는 이유

1. **중복 폭발**: 컴포넌트 N개 x 테마 M개 = N x M 벌 선언. 대부분 동일한 값이 반복됨.
2. **일관성 파괴**: `--comp-button-focus-border: gray-1000`, `--comp-tab-focus-border: gray-900` 같은 불일치가 구조적으로 발생 가능. Semantic이 있으면 둘 다 `var(--semantic-neutral-solid-1000)`을 참조하므로 불일치 불가. 실제로 Button·Tab·Chip(Universal·BadgeLike)·NavVertical·Switch·Checkbox·Radio의 `focus-border` **8개**가 전부 이 한 토큰을 가리킨다. 예외는 SegmentBar 하나뿐이다.
3. **변경 비용**: "accent 색 변경" 시 모든 컴포넌트를 찾아다녀야 함. Semantic이 있으면 1곳만 수정.

---

## 실전 판단 플로우차트

```
새 토큰 값을 추가할 때:

1. "이 값은 하드코딩된 원시값인가?"
   → Yes → Primitive (:root에 hex/px/ms)

2. "이 값이 바뀌면 여러 컴포넌트가 함께 바뀌어야 하는가?"
   → Yes → Semantic (색상은 [data-theme]에, 테마 불변인 것(duration·easing·scale)은 :root에)

3. "이 값은 특정 컴포넌트의 특정 부위에만 쓰이는가?"
   → Yes → Component (역할 바인딩)

4. "이 Component 토큰의 값이 var(--semantic-*)인가?"
   → Yes → [data-theme] 스코프에 선언 (색상 토큰은 전부 여기)
   → No (var(--primitive-spacing/radius-*) 등) → :root에 선언

5. "특정 테마에서만 값이 달라야 하는가?"
   → Yes → [data-theme="dark"] 오버라이드를 **차이점만** 추가
```

---

## 값 흐름 예시

### 색상 (테마 변동, Semantic 경유)

```
Primitive (:root)      →  Semantic ([data-theme])       →  Component ([data-theme])              →  CVA
--primitive-gray-950      --semantic-neutral-solid-950     --comp-button-bg-primary                 bg-[var(--comp-button-bg-primary)]
  #1d1e22        ─light─►   var(--primitive-gray-950)  ───►  var(--semantic-neutral-solid-950)
--primitive-gray-0
  #fdfefe        ─dark──►   var(--primitive-gray-0)
```

### 크기 (테마 불변, Semantic 생략)

```
Primitive          →  Component                →  CVA
--primitive-spacing-10          --comp-button-height-md      h-[var(--comp-...)]
40px                  var(--primitive-spacing-10)
```

### 색상 (accent — 테마 불변, Component가 Semantic accent 참조)

```
--semantic-emphasized-purple-300 → var(--primitive-purple-300)   #c9b1f8 (light/dark 동일)

--comp-segment-item-focus-border: var(--semantic-emphasized-purple-300)
→ accent 팔레트는 두 테마가 같은 primitive 를 가리키므로 테마를 바꿔도 색이 유지된다.
```

대비: 같은 focus 역할이라도 neutral 을 참조하면 테마에 따라 반전된다.

```
--comp-button-focus-border: var(--semantic-neutral-solid-1000)
→ light = gray-1000 #101013 / dark = gray-0 #fdfefe
```
