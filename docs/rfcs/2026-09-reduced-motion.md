# RFC: reduced-motion — 움직임만 제거하고 색·투명도 전환은 유지한다

> 상태: **확정**
> 작성일: 2026-09-05 · 등급: L3 (semantic 토큰의 런타임 값 재정의) · 승인: 2026-09-05

---

## 1. 문제

문서와 구현이 반대를 말하고 있었다.

[INTERACTION_DESIGN.md §A](../INTERACTION_DESIGN.md#a-motion--timing-원칙)의 판단 트리는 이렇게 적는다.

> 기본 전략: opacity 변화만 유지 → `prefers-reduced-motion` 시 모든 transform(slide, scale, rotate) 제거, fade만 유지

그런데 `src/index.css`는 정반대였다.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;   /* ← 모든 전환을 죽인다 */
    scroll-behavior: auto !important;
  }
}
```

`transition-duration: 0.01ms`는 **transform뿐 아니라 색·투명도·그림자 전환까지 전부** 죽인다. 그 결과 reduced-motion 사용자는 hover 배경이 툭 바뀌고 포커스 링이 깜빡이듯 나타난다.

**이것이 왜 문제인가**: `prefers-reduced-motion`이 다루는 것은 **전정기관을 자극하는 움직임**이다(WCAG 2.3.3, MDN). 색 전환은 그 대상이 아니며, 오히려 끄면 **상태 변화가 덜 보인다** — 어디에 hover가 걸렸는지, 무엇이 포커스를 받았는지가 순간적으로만 드러난다. 접근성 설정을 켠 사용자가 접근성이 나빠지는 결과다.

**트리거**: [QUALITY_GATES_PLAN.md](../QUALITY_GATES_PLAN.md) Phase 1에서 입력 장치 규칙을 검사로 옮기며 같은 블록을 읽다가 발견했다.

## 2. 선택지

| 선택지 | 내용 | 비용 | 되돌리는 비용 |
|---|---|---|---|
| **A. 문서대로 CSS 수정** | 전역 `transition-duration` 킬을 빼고, 움직이는 것만 개별 차단 | 전역 규칙 1줄 삭제 + 움직임 사이트 식별 | 낮음 — 한 줄 되돌리면 끝 |
| B. CSS대로 문서 수정 | §A 판단 트리 3줄을 현실에 맞게 고친다 | 거의 0 | 낮음 |
| C. 아무것도 하지 않음 | 문서와 구현이 갈린 채로 둔다 | 0 | — |

## 3. 확정 방향

**A — 문서 쪽이 맞다.**

근거는 [DESIGN_PRINCIPLES.md §F](../DESIGN_PRINCIPLES.md#f-디자인-판단의-기초-원칙-meta)의 두 원칙이다.

- **원칙 7 (사용자 자율성 보호)** — 사용자가 "움직임을 줄여 달라"고 한 것이지 "상태 피드백을 없애 달라"고 한 것이 아니다. 요청 범위를 넘어 끄는 것은 자율성의 존중이 아니라 대리 결정이다.
- **원칙 3 (실증 지향)** — 어느 쪽이 맞는지는 취향이 아니라 명세가 정한다. `prefers-reduced-motion`의 정의가 *motion*이고, 색은 motion이 아니다.

B를 기각한 이유: 문서를 현실에 맞추면 **틀린 것이 규범이 된다.** 문서와 구현이 갈렸을 때 어느 쪽을 고칠지는 "어느 쪽이 옳은가"로 정해야 하며, 여기서는 문서가 옳았다.

C를 기각한 이유: 갈린 채로 두면 다음 사람이 어느 쪽을 따를지 알 수 없다.

## 4. 설계

### 4.1 전역 규칙 — 애니메이션만 끈다

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    /* transition-duration 은 여기서 끄지 않는다 */
  }
}
```

keyframe 애니메이션(shimmer·slide·scale-in/out·press·shake)은 전부 움직임이므로 전역으로 끈다.

### 4.2 press scale — **토큰으로 끈다**

이 RFC에서 가장 중요한 설계 판단이다.

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --semantic-scale-press-sm: 1;
    --semantic-scale-press-lg: 1;
  }
}
```

컴포넌트를 **하나도 건드리지 않는다.** `--comp-button-scale-pressed`·`--comp-tab-scale-pressed` 등 **8개 컴포넌트 토큰이 이미 이 둘을 참조**하고 있어서, 상위 두 개를 덮으면 전부 따라온다.

> 이것이 토큰 계층이 만들어 두는 고정점의 값이다(원칙 1). 컴포넌트마다 `motion-reduce:scale-100`을 붙였다면 8곳을 빠짐없이 기억해야 했고, 새 컴포넌트가 생길 때마다 다시 기억해야 했다.

### 4.3 transform 전환 — `none`이 아니라 `transform 0s`

```css
--comp-scale-press-transition-in:  transform 0s;
--comp-scale-press-transition-out: transform 0s;
```

**`none`을 쓰면 안 된다.** `Tab.tsx`가 이 토큰을 합성 목록 안에 넣기 때문이다.

```
[transition:color_var(--dur)_var(--ease),var(--comp-scale-press-transition-out)]
```

여기에 `none`이 들어가면 `transition: color 100ms ease-out, none`이 되어 **목록 전체가 무효**가 되고, 막으려던 것이 아니라 **색 전환까지 함께 죽는다.** `transform 0s`는 유효한 목록 항목이므로 안전하다.

### 4.4 위치·크기가 바뀌는 개별 사이트

토큰으로 덮을 수 없는 곳만 `motion-reduce:` 변형을 직접 단다. 현재 2곳이다.

| 사이트 | 처리 |
|---|---|
| Switch placer (translate) | `motion-reduce:transition-none` — 위치 이동을 즉시 반영 |
| Switch knob (width·height 모프) | `motion-reduce:transition-[background-color,box-shadow]` — **색·그림자는 남기고** 크기 전환만 뺀다 |

두 번째가 이 RFC의 원칙을 그대로 보여준다. 전환을 통째로 끄지 않고 **움직임에 해당하는 속성만** 목록에서 뺀다.

### 4.5 `.motion-essential` 탈출구

정보 전달에 필수인 애니메이션(스피너·프로그레스)은 제거가 아니라 축소한다.

```css
.motion-essential { animation-duration: var(--semantic-duration-fast) !important; }
```

**현재 사용처 0건이다.** 스피너류가 아직 없어서이며, 생기면 여기에 붙인다.

## 5. 영향 범위 — 공개 표면 diff

| 대상 | 변경 | 파괴적인가 |
|---|---|---|
| `--comp-*` 토큰 **이름** | 없음 | 아니오 |
| semantic 토큰 이름 | 없음 | 아니오 |
| `--semantic-scale-press-sm/lg` **값** | reduced-motion 미디어 쿼리 안에서만 `1`로 재정의 | 아니오 — 기본 값은 그대로 |
| `--comp-scale-press-transition-in/out` **값** | 같은 조건에서 `transform 0s` | 아니오 |
| Switch 클래스 문자열 | `motion-reduce:` 변형 2개 추가 | 아니오 — additive |
| export · prop · variant | 없음 | 아니오 |

**파괴적 변경 0건.** 이 RFC가 L3인 이유는 결과가 파괴적이어서가 아니라 **semantic 토큰의 런타임 값을 조건부로 재정의하는 결정**이기 때문이다. 토큰 값을 미디어 쿼리로 덮는 패턴을 이 저장소가 처음 도입한 자리이므로, 그 선례를 기록으로 남긴다.

## 6. 검증 방법

- [x] **자동 검사** — `src/testing/cssContract.test.ts` 계약 3: reduced-motion 블록에 `*` 셀렉터의 `transition-duration`(및 `transition` 단축) 선언이 없다.
- [x] **red 시연** — 판정기에 `*, *::before, *::after { transition-duration: 0.01ms !important }`가 든 가짜 CSS를 넣어 위반 1건이 잡히는 것을 확인. `animation-duration`만 끄는 블록은 통과하는 것도 함께 확인(오탐 없음).
- [x] **실브라우저 계산값** — Chromium을 `reducedMotion: 'reduce'`로 띄워 측정:

  | 대상 | 기본 | reduced-motion |
  |---|---|---|
  | 루트 (press scale) | `transform / 0.15s` | `transform / **0s**` |
  | 포커스 링 span | `opacity / 0.1s` | `opacity / **0.1s**` |
  | 상태 오버레이 span | `color, background-color, … / 0.1s` | `… / **0.1s**` |
  | `--semantic-scale-press-sm` · `-lg` | `.98` · `.99` | **`1` · `1`** |

  움직임은 사라지고 색·투명도 전환은 남는다 — 의도한 그대로다.

- [ ] **수동 확인** — OS 설정에서 "동작 줄이기"를 켜고 쇼케이스를 눌러 보는 것은 하지 않았다. 계산값과 실제 지각이 다를 여지는 남아 있다.

## 7. 롤백

미디어 쿼리 블록 안의 `:root` 재정의 4줄을 지우고 전역 규칙에 `transition-duration`을 되돌리면 끝난다. Switch의 `motion-reduce:` 클래스 2개는 additive라 남겨도 무해하다.

---

## 부록 — 논의 기록

### `none` 대신 `transform 0s`를 쓰게 된 경위

처음에는 `--comp-scale-press-transition-in/out: none`으로 적으려 했다. 뒤집힌 계기는 이 토큰의 **사용 형태**를 확인한 것이다 — `Button.tsx`는 단독으로 쓰지만(`[transition:var(...)]`) `Tab.tsx`는 합성 목록에 넣는다(`[transition:color_…,var(...)]`). 후자에서 `none`은 CSS 파서가 목록 전체를 버리게 만든다.

**교훈**: 토큰의 값을 조건부로 바꿀 때는 그 토큰이 **어떤 문법 자리에 놓이는지**를 전수 확인한다. 단독 값으로만 쓰인다는 보장이 없다.

### 왜 컴포넌트마다 `motion-reduce:`를 붙이지 않았나

`grep -rn "scale-pressed" src/tokens/tokens.css`가 8개 컴포넌트 토큰을 보여줬고, 전부 `--semantic-scale-press-*` 두 개를 참조하고 있었다. 상위를 덮는 쪽이 컴포넌트 수와 무관하게 한 번만 적으면 되고, **새 컴포넌트가 자동으로 따라온다.**

반대로 Switch의 placer·knob은 참조 관계가 없는 개별 transition이라 토큰으로 덮을 수 없었다. 두 방식이 갈리는 기준은 **"공통 토큰을 경유하는가"**다.

### 미해결

`.motion-essential`의 사용처가 0건이다. 규칙만 있고 그것이 옳게 작동하는지 확인할 대상이 없다 — 스피너를 도입할 때 함께 검증해야 한다.
