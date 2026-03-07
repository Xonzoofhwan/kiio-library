# Interaction Design Guide

> 이 문서는 kiio-library 디자인 시스템의 **인터랙션 설계 원칙과 판단 프레임워크**를 정리한다.
> "이 상황에서 어떤 인터랙션 패턴을 선택하는가"와 "왜 이렇게 움직여야 하는가"에 답한다.
> 컴포넌트 API 설계와 시각적 토큰은 [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md), 복합 컴포넌트 구현은 [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md), 페이지 레벨 UI 패턴은 [UI_PATTERNS.md](./UI_PATTERNS.md) 참고.

---

## 목차

- [A. Motion & Timing 원칙](#a-motion--timing-원칙)
- [B. State Transition 모델](#b-state-transition-모델)
- [C. Feedback 패턴](#c-feedback-패턴)
- [D. Loading & Empty States](#d-loading--empty-states)
- [E. Progressive Disclosure](#e-progressive-disclosure)
- [F. Layout Composition](#f-layout-composition)
- [G. Responsive Strategy](#g-responsive-strategy)

---

## A. Motion & Timing 원칙

### 토큰 아키텍처

색상·타이포그래피와 동일한 3계층 구조를 따른다. 모션도 예외가 아니다.

```
Ref (Primitive) → Sys (Semantic) → Component
```

| 규칙 | 설명 |
|------|------|
| **ref 토큰 직접 사용 금지** | 컴포넌트에서 `duration-100`, `ease-in` 사용 금지. 반드시 `duration-fast`, `ease-enter` 사용. |
| **하드코딩 값 금지** | `transition-duration: 200ms`, `transition: all 0.3s ease` 금지. |
| **Tailwind 기본 유틸리티 제한** | `duration-100` 대신 `duration-fast`, `ease-out` 대신 `ease-enter` 사용. |
| **토큰이 없으면 추가** | 필요한 값이 토큰에 없으면 코드에 하드코딩하지 말고, ref 토큰을 먼저 추가 → sys에 매핑한다. |

### 설계 철학

모션은 장식이 아니라 **정보 전달 수단**이다. 모든 애니메이션은 다음 중 하나 이상의 목적이 있어야 한다:

| 목적 | 설명 | 예시 |
|------|------|------|
| **인과관계** | 사용자 행동과 결과를 연결 | 버튼 클릭 → 모달 등장 |
| **공간 안내** | 요소가 어디서 왔고 어디로 가는지 설명 | 드롭다운이 트리거 아래에서 펼쳐짐 |
| **상태 변화** | 현재 상태가 바뀌었음을 인지시킴 | 토글 스위치 슬라이드 |
| **대기 완화** | 시스템이 동작 중임을 알려 불안 감소 | 스켈레톤 shimmer |

**목적이 없는 모션은 제거한다.** "예뻐 보이니까"는 충분한 이유가 아니다.

### Duration 토큰

색상 토큰과 동일하게 **Ref (Primitive) → Sys (Semantic)** 2계층으로 관리한다.

#### Ref 토큰 (Primitive)

원시 시간 값. 컴포넌트에서 직접 사용 금지.

```css
/* src/tokens/tokens.css — Ref: Motion Duration */
:root {
  --ref-duration-0: 0ms;
  --ref-duration-100: 100ms;
  --ref-duration-200: 200ms;
  --ref-duration-300: 300ms;
  --ref-duration-500: 500ms;
}
```

#### Sys 토큰 (Semantic)

의미 기반 이름. **컴포넌트에서는 반드시 sys 토큰만 사용한다.**

```css
/* src/tokens/tokens.css — Sys: Motion Duration */
:root {
  --sys-duration-instant: var(--ref-duration-0);
  --sys-duration-fast: var(--ref-duration-100);
  --sys-duration-normal: var(--ref-duration-200);
  --sys-duration-slow: var(--ref-duration-300);
  --sys-duration-slower: var(--ref-duration-500);
}
```

```js
// tailwind.config.js — extends
transitionDuration: {
  instant: 'var(--sys-duration-instant)',
  fast:    'var(--sys-duration-fast)',
  normal:  'var(--sys-duration-normal)',
  slow:    'var(--sys-duration-slow)',
  slower:  'var(--sys-duration-slower)',
},
```

#### 스케일 참조

| Ref (직접 사용 금지) | Sys | 값 | 용도 | Tailwind |
|:-------------------:|-----|:---:|------|---------|
| `ref-duration-0` | `sys-duration-instant` | 0ms | 색상/투명도 같은 즉각 변화 | `duration-instant` |
| `ref-duration-100` | `sys-duration-fast` | 100ms | 호버, 포커스 등 마이크로 상태 변화 | `duration-fast` |
| `ref-duration-200` | `sys-duration-normal` | 200ms | 요소의 등장/퇴장, 드롭다운 열림 | `duration-normal` |
| `ref-duration-300` | `sys-duration-slow` | 300ms | 모달, 오버레이 등 큰 영역의 등장/퇴장 | `duration-slow` |
| `ref-duration-500` | `sys-duration-slower` | 500ms | 페이지 전환, 복잡한 레이아웃 변화 | `duration-slower` |

> **Tailwind 기본 `duration-100` 등은 사용하지 않는다.** `duration-fast`처럼 sys 토큰을 사용해야 나중에 시스템 전체의 모션 속도를 ref↔sys 매핑 한 곳에서 조절할 수 있다.
>
> **테마별 모션 속도 조절**: 필요 시 `data-theme` 셀렉터 안에서 sys 토큰만 재매핑하면 된다. 예를 들어 한 테마에서 전체적으로 느린 모션을 원하면 `--sys-duration-fast: var(--ref-duration-200)`으로 변경.

#### Duration 선택 판단 트리

```
이 전이에 얼마의 시간을 할당해야 하는가?

1. 변화 영역이 화면의 몇 %를 차지하는가?
   → 10% 미만 (호버, 포커스, 배지 등): fast (100ms)
   → 10-50% (드롭다운, 토스트, 패널): normal (200ms)
   → 50% 이상 (모달, 풀스크린): slow (300ms)

2. 사용자가 전이를 인지할 필요가 있는가?
   → NO (배경색, 텍스트 색상): instant (0ms) 또는 fast (100ms)
   → YES (위치 변화, 크기 변화): normal 이상

3. 반복적으로 트리거되는가? (예: 호버)
   → YES: 최대 fast (100ms). 느린 호버는 UI를 무겁게 만든다.
   → NO: normal 이상 허용
```

### Easing 토큰

Duration과 동일하게 **Ref (Primitive) → Sys (Semantic)** 2계층으로 관리한다.

#### Ref 토큰 (Primitive)

원시 커브 값. 컴포넌트에서 직접 사용 금지.

```css
/* src/tokens/tokens.css — Ref: Motion Easing */
:root {
  --ref-easing-ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ref-easing-ease-in: cubic-bezier(0.4, 0.0, 1, 1);
  --ref-easing-ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ref-easing-linear: linear;
}
```

#### Sys 토큰 (Semantic)

의미 기반 이름. **컴포넌트에서는 반드시 sys 토큰만 사용한다.**

```css
/* src/tokens/tokens.css — Sys: Motion Easing */
:root {
  --sys-easing-enter: var(--ref-easing-ease-out);       /* 진입: 빠르게 나타나서 천천히 정착 */
  --sys-easing-exit: var(--ref-easing-ease-in);         /* 퇴장: 천천히 출발하여 빠르게 사라짐 */
  --sys-easing-move: var(--ref-easing-ease-in-out);     /* 이동: 부드럽게 시작하고 부드럽게 끝남 */
  --sys-easing-linear: var(--ref-easing-linear);        /* 반복: 일정한 속도 */
}
```

```js
// tailwind.config.js — extends
transitionTimingFunction: {
  enter:  'var(--sys-easing-enter)',
  exit:   'var(--sys-easing-exit)',
  move:   'var(--sys-easing-move)',
  linear: 'var(--sys-easing-linear)',
},
```

#### 스케일 참조

| Ref (직접 사용 금지) | Sys | CSS 값 | 용도 | Tailwind |
|:-------------------:|-----|--------|------|---------|
| `ref-easing-ease-out` | `sys-easing-enter` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | **진입**: 화면에 등장하는 요소 | `ease-enter` |
| `ref-easing-ease-in` | `sys-easing-exit` | `cubic-bezier(0.4, 0.0, 1, 1)` | **퇴장**: 화면에서 사라지는 요소 | `ease-exit` |
| `ref-easing-ease-in-out` | `sys-easing-move` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | **이동/변형**: 위치·크기 변화 | `ease-move` |
| `ref-easing-linear` | `sys-easing-linear` | `linear` | **반복/무한**: 스피너, 프로그레스 바 | `ease-linear` |

> **Tailwind 기본 `ease-in`, `ease-out` 등은 사용하지 않는다.** `ease-enter`, `ease-exit`처럼 sys 토큰 이름이 "왜 이 커브를 적용하는가"를 명확히 전달한다.
>
> **커브 커스터마이징**: 전체 시스템의 모션 느낌(예: 더 탄성 있게)을 바꾸고 싶으면 ref 토큰의 `cubic-bezier` 값만 수정하면 sys를 통해 전파된다.

#### Easing 선택 판단 트리

```
이 요소에 어떤 easing을 적용해야 하는가?

1. 요소가 화면에 새로 등장하는가?
   → YES: ease-enter (빠르게 나타나서 천천히 자리 잡음)

2. 요소가 화면에서 사라지는가?
   → YES: ease-exit (천천히 출발하여 빠르게 사라짐)

3. 요소가 화면 안에서 위치/크기가 변하는가?
   → YES: ease-move (부드럽게 시작하고 부드럽게 끝남)

4. 반복 애니메이션인가? (스피너, shimmer 등)
   → YES: ease-linear (일정한 속도)
```

### 진입/퇴장 애니메이션 패턴

| 패턴 | 진입 | 퇴장 | 적용 대상 |
|------|------|------|----------|
| **Fade** | opacity 0→1, ease-enter | opacity 1→0, ease-exit | 토스트, 툴팁, 배지 |
| **Fade + Scale** | opacity 0→1 + scale 95%→100%, ease-enter | 역순, ease-exit | 드롭다운, 팝오버, 모달 |
| **Fade + Slide** | opacity 0→1 + translateY 8px→0, ease-enter | 역순, ease-exit | 바텀시트, 슬라이드 패널 |
| **Slide** | translateX/Y, ease-move | 역순, ease-move | 네비게이션 드로어, 탭 전환 |

#### 기본 Tailwind 구현

```tsx
// Fade + Scale 패턴 예시 (드롭다운)
const dropdownAnimation = {
  enter: 'animate-in fade-in-0 zoom-in-95 duration-normal ease-enter',
  exit: 'animate-out fade-out-0 zoom-out-95 duration-fast ease-exit',
}

// Fade + Slide 패턴 예시 (바텀시트)
const bottomSheetAnimation = {
  enter: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-slow ease-enter',
  exit: 'animate-out fade-out-0 slide-out-to-bottom-4 duration-normal ease-exit',
}
```

**원칙: 퇴장은 진입보다 빠르게.** 사용자가 닫기를 트리거한 후에는 결과를 빠르게 확인하고 싶다. 진입의 2/3 시간을 퇴장에 할당한다 (예: 진입 300ms → 퇴장 200ms).

### `prefers-reduced-motion` 대응

```
판단 트리:
1. 이 애니메이션이 정보 전달에 필수인가?
   → YES (스피너의 회전, 프로그레스 바 진행):
     축소(reduce) — duration을 sys-duration-fast로 줄이되 완전히 제거하지 않는다.
   → NO (장식적 전이, fade, slide):
     제거(remove) — opacity 전이만 유지하거나 즉시 전환.

2. 기본 전략: opacity 변화만 유지
   → prefers-reduced-motion 시 모든 transform(slide, scale, rotate) 제거
   → fade만 sys-duration-fast로 유지
```

#### 구현 패턴

```css
/* tokens.css 또는 globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* 정보 전달 필수 애니메이션은 축소만 */
  .motion-essential {
    animation-duration: var(--sys-duration-fast) !important;
    transition-duration: var(--sys-duration-fast) !important;
  }
}
```

```tsx
// 컴포넌트 내 사용
<Spinner className="motion-essential" />  // reduced-motion에서도 동작 (축소됨)
<div className="animate-in fade-in-0" />  // reduced-motion에서 즉시 전환
```

### Motion 토큰 요약 테이블

| 상황 | Duration | Easing | 패턴 |
|------|:--------:|:------:|------|
| 호버/포커스 상태 전이 | `duration-fast` | `ease-enter` | 색상/투명도만 |
| 드롭다운 열림 | `duration-normal` | `ease-enter` | Fade + Scale |
| 드롭다운 닫힘 | `duration-fast` | `ease-exit` | Fade + Scale |
| 모달 열림 | `duration-slow` | `ease-enter` | Fade + Scale |
| 모달 닫힘 | `duration-normal` | `ease-exit` | Fade + Scale |
| 토스트 등장 | `duration-normal` | `ease-enter` | Fade + Slide |
| 토스트 퇴장 | `duration-fast` | `ease-exit` | Fade |
| 스피너 회전 | 연속 | `ease-linear` | Rotate |
| 스켈레톤 shimmer | 연속 (1.5s) | `ease-linear` | Gradient sweep |
| 탭 패널 전환 | `duration-instant` | — | 없음 (즉시 교체) |
| 툴팁 등장 | `duration-fast` | `ease-enter` | Fade |

---

## B. State Transition 모델

### 범용 상태 머신

대부분의 인터랙티브 컴포넌트는 아래 상태 모델을 공유한다.

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    ▼                                      │
  ┌───────┐   pointer   ┌───────┐   pointerdown   ┌─────────┐
  │       │ ──enter──▶  │       │ ──────────────▶  │         │
  │ Idle  │             │ Hover │                  │ Pressed │
  │       │ ◀──leave──  │       │ ◀────────────── │         │
  └───┬───┘             └───┬───┘   pointerup     └────┬────┘
      │                     │                          │
      │    keyboard         │    keyboard              │ pointerup
      │    focus            │    focus                  │ (outside)
      │                     │                          │
      ▼                     ▼                          ▼
  ┌───────┐           ┌─────────────┐            ┌──────────┐
  │       │           │             │            │          │
  │Focused│           │Focused+Hover│            │ Activate │
  │       │           │             │            │          │
  └───────┘           └─────────────┘            └──────────┘


  별도 축: ──── disabled ──── loading ────
  (이들은 위 상태 머신과 독립적으로 적용됨)
```

### 상태별 시각 피드백 규칙

| 상태 | 시각적 변화 | 토큰 참조 | 전이 시간 |
|------|-----------|----------|:--------:|
| **Idle** | 기본 스타일 | — | — |
| **Hover** | 배경 오버레이 추가 | `sys-state-on-{bright\|dim}-50` | `duration-fast` |
| **Pressed** | 더 강한 배경 오버레이 | `sys-state-on-{bright\|dim}-100` | `duration-instant` |
| **Focused** | 포커스 링 표시 | `border-sys-primary-300` (2px) | `duration-instant` |
| **Focused+Hover** | 포커스 링 + 호버 오버레이 | 위 두 가지 결합 | `duration-fast` |
| **Disabled** | 투명도 감소 + 커서 변경 | `opacity-40`, `cursor-not-allowed` | `duration-instant` |
| **Loading** | 콘텐츠 숨김 + 스피너 표시 | `aria-busy="true"`, `aria-disabled="true"` | `duration-fast` |

> Motion 적용 세부사항(duration, easing)은 [A절](#a-motion--timing-원칙)의 Motion 토큰 요약 테이블 참고.

### on-dim / on-bright 오버레이 판단

상태 오버레이의 색상은 **배경 밝기**에 의해 결정된다. 컴포넌트가 아닌 배경이 기준이다.

```
이 컴포넌트의 상태 오버레이는 어떤 계열을 사용해야 하는가?

1. 컴포넌트 배경이 어두운가? (예: primary → neutral-solid-950)
   → YES: on-dim 계열 (흰색 반투명 오버레이)
     hover: sys-state-on-dim-50
     pressed: sys-state-on-dim-100

2. 컴포넌트 배경이 밝은가? (예: secondary, outlined, ghost)
   → YES: on-bright 계열 (검정 반투명 오버레이)
     hover: sys-state-on-bright-50
     pressed: sys-state-on-bright-70
```

| hierarchy | 배경 | 오버레이 계열 | hover | pressed |
|-----------|------|:----------:|-------|---------|
| primary | `sys-neutral-solid-950` | **on-dim** | `sys-state-on-dim-50` | `sys-state-on-dim-100` |
| secondary | `sys-neutral-solid-100` | **on-bright** | `sys-state-on-bright-50` | `sys-state-on-bright-70` |
| outlined | 투명 (border만) | **on-bright** | `sys-state-on-bright-50` | `sys-state-on-bright-70` |
| ghost | 투명 | **on-bright** | `sys-state-on-bright-50` | `sys-state-on-bright-70` |

### 컴포넌트 유형별 상태 매트릭스

#### 액션 컴포넌트 (Button, IconButton, Link)

| 상태 | hover | pressed | focused | disabled | loading |
|------|:-----:|:-------:|:-------:|:--------:|:-------:|
| 배경 오버레이 | O | O (강화) | — | — | — |
| 포커스 링 | — | — | O | — | — |
| 투명도 감소 | — | — | — | O (0.4) | — |
| 커서 변경 | pointer | pointer | — | not-allowed | not-allowed |
| 콘텐츠 숨김 | — | — | — | — | O (+ 스피너) |
| 클릭 가능 | O | O | O | X | X |
| 탭 접근 가능 | O | O | O | X | O (`aria-disabled`) |

#### 입력 컴포넌트 (Input, Textarea, Select)

| 상태 | hover | focused | error | disabled | readonly |
|------|:-----:|:-------:|:-----:|:--------:|:--------:|
| 테두리 색 변화 | O (강화) | O (primary) | O (error) | — | — |
| 배경 변화 | — | — | — | O (밝은 회색) | O (밝은 회색) |
| 포커스 링 | — | O | O (error색) | — | — |
| 투명도 감소 | — | — | — | O | — |
| 편집 가능 | O | O | O | X | X |
| 탭 접근 가능 | O | O | O | X | O |
| 에러 메시지 표시 | — | — | O | — | — |

#### 토글 컴포넌트 (Switch, Checkbox, Radio)

| 상태 | hover | pressed | checked | disabled |
|------|:-----:|:-------:|:-------:|:--------:|
| 배경 오버레이 | O | O | — | — |
| 채움/체크 표시 | — | — | O | O (투명도 감소) |
| 색상 변화 | — | — | O (primary색) | — |
| 전이 애니메이션 | — | — | O (`duration-fast`) | — |

### disabled vs loading 구분

| 특성 | disabled | loading |
|------|:--------:|:-------:|
| 시각적 처리 | 투명도 감소 (0.4) | 콘텐츠 숨김 + 스피너 |
| 탭 접근 | **제거** (`disabled` attribute) | **유지** (`aria-disabled`) |
| 사유 | 조건 미충족 (영구적이거나 사용자 액션 필요) | 처리 중 (일시적, 자동 해제) |
| 커서 | `not-allowed` | `not-allowed` 또는 `wait` |
| 스크린 리더 | "비활성화됨" 안내 | "처리 중" 안내 (`aria-busy`) |

**핵심**: loading은 **일시적 비활성화**이므로 탭 순서에서 제거하면 안 된다. 키보드 사용자가 로딩이 끝난 후 다시 해당 요소를 찾아야 하기 때문이다.

---

## C. Feedback 패턴

### 피드백 유형 분류

사용자에게 시스템 상태를 전달하는 피드백은 3계층으로 나뉜다.

| 계층 | 위치 | 지속성 | 예시 |
|------|------|:------:|------|
| **Inline** | 해당 요소 바로 옆/아래 | 영구 (조건 해소까지) | 폼 에러 메시지, 필드 힌트, 인풋 상태 아이콘 |
| **Overlay** | 화면 가장자리에 떠오름 | 일시 (자동 또는 수동 닫힘) | 토스트, 스낵바, 알림 배너 |
| **Page-level** | 페이지 콘텐츠 영역 | 영구 (다른 페이지 이동까지) | 에러 페이지, 빈 상태, 성공 확인 화면 |

#### 피드백 유형 선택 판단 트리

```
사용자에게 어떤 유형의 피드백을 보여줘야 하는가?

1. 피드백이 특정 요소에 직접 관련되는가? (예: 이 입력값이 잘못됨)
   → YES: Inline 피드백
   → NO: 계속

2. 사용자가 현재 작업을 중단해야 하는가?
   → YES: Page-level 피드백 (에러 페이지, 확인 화면)
   → NO: Overlay 피드백 (토스트)

3. Overlay를 선택했다면 — 사용자 액션이 필요한가?
   → YES (실행 취소, 재시도 등): 수동 닫힘 토스트 + 액션 버튼
   → NO (단순 확인): 자동 닫힘 토스트 (5초)
```

### Error Handling UX

#### Validation 타이밍 판단 트리

```
이 필드의 유효성 검증은 언제 트리거해야 하는가?

1. 형식(format) 검증인가? (이메일 형식, 전화번호 패턴 등)
   → onBlur: 사용자가 입력을 마치고 떠날 때 검증
   → 이유: 입력 중간에 에러를 보여주면 짜증남 (아직 타이핑 중인데)

2. 실시간 피드백이 도움이 되는가? (비밀번호 강도, 글자 수 제한)
   → onChange (debounced): 입력하는 동안 즉시 피드백
   → 이유: 사용자가 조건 충족 여부를 실시간으로 확인하고 싶음

3. 서버 검증이 필요한가? (중복 이메일, 재고 확인)
   → onSubmit: 제출 시점에 서버로 확인
   → 선택적으로 onBlur + debounce로 사전 확인 가능 (UX 개선)

4. 여러 필드의 관계 검증인가? (비밀번호 확인, 날짜 범위)
   → onBlur (두 번째 필드): 관련 필드가 모두 입력된 후 검증
   → 또는 onSubmit: 제출 시 한꺼번에 검증
```

| 검증 유형 | 타이밍 | 디바운스 | 에러 표시 | 에러 해제 |
|----------|:------:|:-------:|----------|----------|
| 형식 (이메일, URL) | onBlur | — | blur 직후 | 올바른 값 입력 시 즉시 |
| 필수 값 | onBlur | — | blur 직후 (값이 비어있을 때) | 값 입력 시 즉시 |
| 실시간 피드백 (비밀번호 강도) | onChange | 300ms | 타이핑 중 | 조건 충족 시 즉시 |
| 서버 검증 (중복 확인) | onSubmit 또는 onBlur | 500ms | 서버 응답 후 | 값 변경 시 즉시 |
| 관계 검증 (비밀번호 확인) | onBlur (후행 필드) | — | blur 직후 | 일치 시 즉시 |

#### 에러 표시 원칙

1. **에러 위치는 해당 필드 바로 아래**
   - 에러 메시지는 필드와 시각적/구조적으로 인접해야 한다
   - `aria-describedby`로 프로그래밍적 연결 필수 (구현: [ADVANCED_PATTERNS.md §J](./ADVANCED_PATTERNS.md#j-form-context-상태-전파-패턴) 참고)

2. **에러 발생 시 에러 필드는 시각적으로 강조**
   - 테두리 색: `sys-error-500`
   - 에러 텍스트: `sys-error-500`, `typography-13-regular`
   - 아이콘(선택): 에러 아이콘을 필드 우측에 표시

3. **에러 해제는 즉시 (사용자가 수정하는 순간)**
   - 에러 조건이 해소되면 다음 blur/submit을 기다리지 않고 즉시 해제
   - 이유: "고쳤는데 아직 빨간색"은 혼란을 준다

4. **Submit 시 첫 번째 에러 필드로 스크롤 + 포커스**
   - 여러 에러가 있을 때 사용자가 어디부터 고쳐야 하는지 명확하게 안내
   - 에러 요약을 상단에 배치하는 것은 선택 사항 (긴 폼에서 유용)

#### 에러 메시지 작성 규칙

| 원칙 | Good ✓ | Bad ✗ | 이유 |
|------|--------|-------|------|
| 무엇이 잘못되었는지 설명 | "이메일 형식이 올바르지 않습니다" | "유효하지 않은 입력입니다" | 사용자가 무엇을 고쳐야 하는지 모름 |
| 어떻게 고치는지 안내 | "@ 기호를 포함해주세요" | "오류가 발생했습니다" | 해결 방법이 없는 에러는 무용 |
| 간결하게 | "8자 이상 입력해주세요" | "비밀번호는 보안을 위해 최소 8자 이상이어야 합니다" | 에러 메시지는 읽히는 게 중요 |
| 비난하지 않기 | "전화번호를 입력해주세요" | "전화번호를 입력하지 않았습니다" | "~하지 않았다"는 비난 느낌 |

### 성공/경고/정보 피드백

#### 토스트 vs 인라인 vs 배너 판단 트리

```
이 피드백을 어떤 방식으로 표시해야 하는가?

1. 사용자의 작업 흐름을 방해해야 하는가?
   → YES (치명적 에러, 데이터 손실 위험): Modal / Alert Dialog
   → NO: 계속

2. 피드백이 특정 컨텐츠 영역에 관련되는가?
   → YES: Inline 배너 (해당 영역 상단)
   → NO: 계속

3. 사용자 액션이 필요한가? (실행 취소, 재시도 등)
   → YES: 토스트 + 액션 버튼 (수동 닫힘 또는 긴 자동 닫힘 8초)
   → NO: 토스트 (자동 닫힘 5초)
```

#### 토스트 세부 규칙

**위치 (position)**:

토스트 위치는 제품의 레이아웃 맥락에 따라 선택한다.

| 위치 | 적합한 상황 | 주의점 |
|------|-----------|--------|
| **하단 중앙** (기본값) | 범용. 대부분의 레이아웃에서 안전 | 모바일 FAB/네비바와 겹침 확인 |
| **하단 우측** | 사이드바 레이아웃, 대시보드 | 좌측 사이드바가 있을 때 시선 균형 |
| **상단 중앙** | 폼 제출 결과, 페이지 상단에 관심이 집중될 때 | 헤더/배너와 겹침 확인 |
| **상단 우측** | 실시간 알림, 채팅/메신저 스타일 | 데스크탑 OS 알림과 위치 유사 (친숙함) |

```
토스트 위치 선택:

1. 사용자의 주 시선이 어디에 있는가?
   → 페이지 중앙 (콘텐츠 소비): 하단 중앙
   → 좌측 (사이드바 네비게이션): 하단 우측
   → 상단 (폼, 입력 작업): 상단 중앙

2. 고정 UI 요소와 겹치는가?
   → 하단에 FAB/탭바 있음: 상단으로 이동 또는 하단에서 충분한 offset
   → 상단에 배너/알림 있음: 하단으로 이동

3. 제품 전체에서 통일
   → 같은 제품 내에서 위치를 섞지 않는다. 하나를 선택하고 유지.
```

**타이밍 및 동작**:

| 규칙 | 값 | 이유 |
|------|:---:|------|
| 자동 닫힘 (액션 없음) | 5초 | 읽고 인지하기 충분한 시간 |
| 자동 닫힘 (액션 있음) | 8초 | 읽고 판단까지 하기 충분한 시간 |
| 최대 동시 표시 | 3개 | 그 이상은 정보 과부하 |
| 쌓임 방향 | 새 토스트가 기존 토스트 위 (또는 아래, 위치에 따라) | 최근 알림에 시선이 먼저 감 |
| 호버 시 자동 닫힘 | 일시정지 | 사용자가 읽는 중이면 사라지지 않게 |
| 포커스 가능 | YES (Tab으로 접근) | 스크린 리더 사용자를 위해 |

**쌓임 방향 규칙**: 토스트 위치에 따라 쌓이는 방향이 달라진다.

| 토스트 위치 | 쌓임 방향 | 이유 |
|-----------|----------|------|
| 하단 (중앙/우측) | 위로 쌓임 (새 토스트가 위) | 콘텐츠 영역 침범 최소화 |
| 상단 (중앙/우측) | 아래로 쌓임 (새 토스트가 아래) | 헤더 침범 방지, 아래로 밀어내기 |

#### 피드백 의미별 토큰 매핑

| 의미 | 배경 | 텍스트/아이콘 | 아이콘 |
|------|------|-------------|--------|
| 성공 (success) | `sys-success-50` | `sys-success-700` | ✓ CheckCircle |
| 경고 (warning) | `sys-warning-50` | `sys-warning-700` | ⚠ AlertTriangle |
| 에러 (error) | `sys-error-50` | `sys-error-700` | ✕ XCircle |
| 정보 (info) | `sys-primary-50` | `sys-primary-700` | ℹ Info |
| 중립 (neutral) | `sys-neutral-solid-100` | `sys-text-on-bright-900` | — |

---

## D. Loading & Empty States

### Loading 패턴 선택

#### 판단 트리

```
이 로딩 상태에 어떤 패턴을 사용해야 하는가?

1. 예상 소요 시간은?
   → < 300ms: 로딩 표시 없음 (인지 불가능한 시간)
   → 300ms ~ 2초: 스피너 (간단한 표시)
   → 2초 ~ 10초: 스켈레톤 또는 프로그레스 바
   → > 10초: 프로그레스 바 + 예상 시간 텍스트

2. 콘텐츠의 레이아웃이 예측 가능한가?
   → YES: 스켈레톤 (콘텐츠 형태를 미리 보여줌)
   → NO: 스피너 (형태를 모르므로 일반적 로딩 표시)

3. 진행률을 알 수 있는가?
   → YES: 프로그레스 바 (determinate)
   → NO: 스피너 또는 스켈레톤 (indeterminate)

4. 화면 전체인가, 부분인가?
   → 전체 페이지: 페이지 레벨 스켈레톤 또는 중앙 스피너
   → 섹션 일부: 해당 영역에만 스피너/스켈레톤 배치
   → 단일 컴포넌트: 컴포넌트 내부 로딩 상태 (예: Button의 loading prop)
```

### Loading 패턴 상세

#### 스피너 (Spinner)

| 속성 | 규칙 |
|------|------|
| 사용 시점 | 예상 시간 300ms~2초, 콘텐츠 레이아웃 예측 불가 |
| 크기 | 컴포넌트 내부: 컴포넌트 크기에 맞춤. 섹션: 24px. 페이지: 32~48px |
| 위치 | 교체 대상의 중앙 |
| 레이블 | 3초 이상 지속 시 "로딩 중..." 텍스트 추가 |
| 접근성 | `role="status"`, `aria-label="로딩 중"` |

#### 스켈레톤 (Skeleton)

| 속성 | 규칙 |
|------|------|
| 사용 시점 | 예상 시간 2초 이상, 콘텐츠 레이아웃 예측 가능 |
| 형태 | 실제 콘텐츠의 레이아웃을 반영 (텍스트 → 긴 직사각형, 이미지 → 정사각형 등) |
| 애니메이션 | shimmer (좌→우 그라데이션 스윕), linear, 1.5s 주기 |
| 색상 | `sys-neutral-solid-100` (배경) + `sys-neutral-solid-50` (shimmer) |
| 콘텐츠 전환 | 데이터 도착 시 fade-in (`duration-normal`, `ease-enter`) |
| 접근성 | `aria-busy="true"` on 컨테이너, `aria-hidden="true"` on 스켈레톤 요소 |

#### 프로그레스 바 (Progress Bar)

| 속성 | 규칙 |
|------|------|
| 사용 시점 | 진행률을 알 수 있거나, 10초 이상 소요 |
| Determinate | 진행률 0~100%를 표시. `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Indeterminate | 반복 애니메이션 (좌→우 이동). 진행률을 모를 때 사용 |
| 텍스트 | 10초 이상 시 "X% 완료" 또는 "약 N초 남음" 텍스트 추가 |

### 로딩 표시 딜레이 규칙

| 소요 시간 | 즉시 표시 | 딜레이 후 표시 | 이유 |
|:---------:|:---------:|:-------------:|------|
| < 300ms | — | — | 인지 불가. 로딩 표시 불필요 |
| 300ms ~ 1초 | — | 300ms 후 표시 | 빠른 응답에 로딩이 "깜빡"이는 걸 방지 |
| > 1초 | 즉시 표시 | — | 사용자가 기다리고 있음을 인지해야 함 |

**구현**: 로딩 상태 진입 후 300ms 딜레이를 둔 뒤에 스피너/스켈레톤을 표시한다. 300ms 안에 데이터가 도착하면 로딩 UI를 건너뛴다.

```tsx
// 개념적 패턴 (실제 구현은 훅으로 추출)
function useDeferredLoading(isLoading: boolean, delay = 300) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }
    const timer = setTimeout(() => setShowLoading(true), delay)
    return () => clearTimeout(timer)
  }, [isLoading, delay])

  return showLoading
}
```

### Empty State 패턴

#### Empty State 구성 요소

| 요소 | 필수 | 설명 |
|------|:----:|------|
| 일러스트/아이콘 | 선택 | 상황을 시각적으로 전달. 64~128px |
| 제목 | **필수** | 현재 상태를 한 줄로 설명. `typography-18-semibold` |
| 설명 | 선택 | 왜 비어있는지, 무엇을 할 수 있는지. `typography-14-regular` |
| 액션 (CTA) | 권장 | 다음 행동을 유도하는 버튼. primary 또는 secondary |

#### Empty State 유형별 가이드

| 유형 | 제목 예시 | CTA 예시 | 톤 |
|------|----------|---------|:---:|
| **최초 사용** (데이터 없음) | "아직 프로젝트가 없습니다" | "첫 프로젝트 만들기" | 밝고 격려하는 |
| **검색 결과 없음** | "검색 결과가 없습니다" | "필터 초기화" | 중립적 |
| **필터 결과 없음** | "조건에 맞는 항목이 없습니다" | "필터 변경하기" | 중립적 |
| **에러로 인한 빈 상태** | "데이터를 불러오지 못했습니다" | "다시 시도" | 사과 + 해결 제시 |
| **완료된 상태** | "모든 작업을 완료했습니다" | — (또는 "새 작업 추가") | 축하/성취감 |

#### Empty State 배치 원칙

- 콘텐츠가 표시될 영역의 **중앙**에 배치
- 최대 너비 320~400px (너무 넓으면 읽기 어려움)
- 상위 네비게이션, 필터 UI 등은 **유지** (사용자가 다른 경로를 탈 수 있도록)
- Empty state가 페이지 유일한 콘텐츠라면 시선이 자연스럽게 CTA로 향하도록 시각적 계층 설계

---

## E. Progressive Disclosure

### 정보 노출 계층 모델

모든 정보를 한 번에 보여주면 사용자가 압도된다. 3계층으로 나누어 필요할 때 필요한 만큼 노출한다.

| 계층 | 노출 조건 | 적합한 정보 | UI 패턴 |
|------|----------|-----------|---------|
| **Always Visible** | 항상 표시 | 핵심 정보, 주요 액션, 네비게이션 | 레이블, 제목, 주요 버튼 |
| **On-demand** | 사용자 행동으로 노출 | 보조 정보, 상세 설명, 부가 옵션 | 툴팁, 팝오버, 아코디언, "더보기" |
| **Deep Dive** | 의도적 탐색 시 노출 | 전문 설정, 고급 옵션, 전체 데이터 | 별도 페이지, 설정 패널, 상세 모달 |

### 정보 보조 컴포넌트 선택 판단 트리

```
이 보조 정보를 어떤 컴포넌트로 보여줘야 하는가?

1. 정보가 1~2줄의 짧은 텍스트인가?
   → YES: 계속 2번
   → NO (긴 설명, 이미지, 인터랙션 포함): 계속 4번

2. 사용자가 이 정보를 "발견"해야 하는가, 아니면 "항상 필요"한가?
   → 발견 (대부분 안 봐도 됨): Tooltip
   → 항상 필요 (처음 볼 때 중요): 계속 3번

3. 한 번만 알면 되는가, 매번 확인해야 하는가?
   → 한 번: Callout (온보딩) → 닫을 수 있게
   → 매번: Inline help text (필드 아래 힌트 등)

4. 사용자가 정보와 인터랙션해야 하는가? (링크 클릭, 양식 입력 등)
   → YES: Popover 또는 Modal
   → NO: 계속 5번

5. 컨텐츠가 접었다 펼 수 있는 구조인가?
   → YES: Accordion / Collapsible section
   → NO: Inline 표시 (별도 섹션 또는 카드)
```

### 컴포넌트별 사용 가이드

#### Tooltip

| 속성 | 규칙 |
|------|------|
| 용도 | 아이콘 버튼의 레이블, 축약된 텍스트의 전문, 기능의 부가 설명 |
| 트리거 | hover (마우스) + focus (키보드) |
| 등장 딜레이 | 300~500ms (의도적 호버와 스쳐지나감 구분). 모션 토큰과 별도 — UX 딜레이. |
| 최대 길이 | 2줄 이하. 넘어가면 Popover 사용 |
| 인터랙션 | **없음**. 링크/버튼이 필요하면 Popover로 전환 |
| 위치 | 트리거 요소 기준 하단 우선, 공간 없으면 자동 조정 |
| 모바일 | hover 없으므로 long-press 또는 별도 대안 필요 |

#### Callout / Banner

| 속성 | 규칙 |
|------|------|
| 용도 | 온보딩 힌트, 중요 안내, 맥락 정보 |
| 위치 | 관련 콘텐츠 바로 위/아래 (inline) |
| 닫기 | 닫을 수 있음 (dismiss). 닫은 후 다시 안 보이게 (상태 저장) |
| 의미별 스타일 | info / warning / success / error — [C절](#피드백-의미별-토큰-매핑) 토큰 매핑 동일 |

#### Popover

| 속성 | 규칙 |
|------|------|
| 용도 | 인터랙티브 콘텐츠 (링크, 버튼, 작은 양식), 긴 설명 |
| 트리거 | click (명시적 행동) |
| 닫기 | 바깥 클릭, Escape, 명시적 닫기 버튼 |
| 포커스 | 열릴 때 내부로 트래핑, 닫힐 때 트리거로 복원 |
| vs Modal | Popover는 현재 작업 유지 + 가벼운 인터랙션. Modal은 작업 중단 + 중요 결정 |

#### Accordion / Collapsible

| 속성 | 규칙 |
|------|------|
| 용도 | 긴 목록, FAQ, 설정 그룹 |
| 동시 열림 | 단일 (한 번에 하나만) vs 복수 (여러 개 동시) — 맥락에 따라 결정 |
| 기본 상태 | 모두 닫힘이 기본. 핵심 정보가 있으면 첫 번째만 열어둠 |
| 전이 | height 애니메이션, `ease-move`, `duration-normal` |

---

## F. Layout Composition

### 스페이싱 계층 모델

컴포넌트 간 스페이싱은 **요소 간 관계의 밀접도**를 시각적으로 표현한다. 세 가지 계층으로 분류한다.

| 계층 | 의미 | 간격 범위 | Tailwind | 예시 |
|------|------|:---------:|---------|------|
| **요소 간 (Element)** | 같은 그룹 내 형제 요소 | 4~8px | `gap-1` ~ `gap-2` | 아이콘과 텍스트, 라벨과 인풋 |
| **그룹 간 (Group)** | 의미 단위 그룹 사이 | 12~24px | `gap-3` ~ `gap-6` | 폼 필드 사이, 카드 내 섹션 사이 |
| **섹션 간 (Section)** | 큰 콘텐츠 블록 사이 | 32~64px | `gap-8` ~ `gap-16` | 페이지 섹션 사이, 히어로와 콘텐츠 사이 |

#### 스페이싱 판단 트리

```
이 두 요소 사이의 간격은 얼마여야 하는가?

1. 두 요소가 하나의 의미 단위에 속하는가? (예: 아이콘+텍스트, 라벨+인풋)
   → YES: 요소 간 간격 (4~8px)

2. 각각 독립된 의미 단위이지만, 같은 섹션에 속하는가? (예: 폼 필드들)
   → YES: 그룹 간 간격 (12~24px)

3. 서로 다른 주제/맥락의 콘텐츠인가? (예: 히어로 영역과 기능 소개)
   → YES: 섹션 간 간격 (32~64px)
```

### 레이아웃 패턴 유형

| 패턴 | 적용 상황 | Tailwind 기본 구조 |
|------|----------|-------------------|
| **Stack (수직)** | 폼 필드, 카드 내부, 리스트 | `flex flex-col gap-{n}` |
| **Inline (수평)** | 버튼 그룹, 태그 목록, 네비게이션 | `flex flex-row gap-{n} items-center` |
| **Grid** | 카드 그리드, 갤러리, 대시보드 | `grid grid-cols-{n} gap-{n}` |
| **Split** | 사이드바 + 메인, 네비 + 콘텐츠 | `flex` + 고정 너비 사이드 + `flex-1` 메인 |

#### 레이아웃 패턴 선택 판단 트리

```
이 콘텐츠를 어떤 레이아웃으로 배치해야 하는가?

1. 항목이 순서대로 읽히는가? (위→아래)
   → YES: Stack

2. 항목이 동등한 비중으로 나란히 놓이는가?
   → YES (2~3개): Inline
   → YES (4개 이상): Grid

3. 영역이 "고정 + 유동"으로 나뉘는가?
   → YES: Split

4. Inline 항목이 넘치면?
   → 줄바꿈 허용: flex-wrap
   → 스크롤: overflow-x-auto
   → 숨김: overflow-hidden + "더보기"
```

### 컨테이너와 최대 너비

| 콘텐츠 유형 | 최대 너비 | 이유 |
|-----------|:---------:|------|
| 본문 텍스트 | 640~720px (40~45em) | 가독성 최적 줄 길이 (45~75자) |
| 폼 | 480~560px | 입력 필드가 너무 넓으면 불편 |
| 카드 그리드 | 1200~1440px | 그리드가 너무 넓으면 카드 간 거리가 멀어짐 |
| 풀스크린 앱 (대시보드) | 제한 없음 | 공간을 최대 활용 |

### 정렬 원칙

1. **좌측 정렬이 기본** (LTR 언어)
   - 텍스트, 폼 필드, 리스트 항목은 좌측 정렬
   - 중앙 정렬은 짧은 텍스트(제목, 빈 상태 메시지), 모달 콘텐츠에만 사용

2. **수직 리듬 유지**
   - 같은 페이지 내 콘텐츠 좌측 가장자리를 통일 (들쭉날쭉 금지)
   - 네스팅 시 인덴트는 일정한 단위(16~24px)

3. **액션 버튼 정렬**

   | 컨텍스트 | 위치 | 이유 |
   |---------|------|------|
   | 모달/다이얼로그 | 우측 하단 | 시선 흐름의 끝점 |
   | 폼 | 좌측 (인풋과 정렬) 또는 우측 | 인풋과 시선 흐름 연결 |
   | 카드 | 우측 하단 또는 카드 하단 전체 | 콘텐츠 읽은 후 자연스러운 다음 행동 |
   | 툴바 | 우측 | 관행 (OS/브라우저 패턴) |

---

## G. Responsive Strategy

### 브레이크포인트 체계

Tailwind의 mobile-first 브레이크포인트를 기반으로 한다. 모바일이 기본 스타일이고, 큰 화면으로 갈수록 스타일을 추가한다.

| 토큰 | 최소 너비 | 대상 | Tailwind prefix |
|------|:---------:|------|:--------------:|
| `mobile` | 0px | 모바일 (기본) | — (prefix 없음) |
| `sm` | 640px | 큰 모바일 / 작은 태블릿 | `sm:` |
| `md` | 768px | 태블릿 | `md:` |
| `lg` | 1024px | 작은 데스크탑 / 태블릿 가로 | `lg:` |
| `xl` | 1280px | 데스크탑 | `xl:` |
| `2xl` | 1536px | 큰 데스크탑 | `2xl:` |

#### 핵심 전환 지점

실질적으로 가장 중요한 전환은 두 곳이다:

| 전환 | 브레이크포인트 | 변화 |
|------|:------------:|------|
| **모바일 → 태블릿** | `md` (768px) | 단일 컬럼 → 멀티 컬럼, 터치 → 마우스 혼합 |
| **태블릿 → 데스크탑** | `lg` (1024px) | 사이드바 등장, 네비게이션 구조 변화 |

### 반응형 행동 변화 패턴

컴포넌트가 작은 화면에서 어떻게 적응하는지에 대한 5가지 패턴:

| 패턴 | 설명 | 예시 |
|------|------|------|
| **Reflow** | 수평 → 수직으로 재배치 | 버튼 그룹이 inline → stack |
| **Collapse** | 콘텐츠를 접어서 숨김 | 네비게이션 → 햄버거 메뉴 |
| **Adapt** | 다른 컴포넌트로 대체 | 테이블 → 카드 리스트, Popover → 바텀시트 |
| **Truncate** | 콘텐츠를 줄임 | 긴 텍스트 → 말줄임(...), 탭 레이블 → 아이콘만 |
| **Prioritize** | 중요 요소만 남기고 숨김 | 테이블 컬럼 축소, 부가 정보 숨김 |

#### 반응형 패턴 선택 판단 트리

```
이 컴포넌트가 작은 화면에서 넘칠 때 어떻게 처리하는가?

1. 모든 항목이 동등하게 중요한가?
   → YES: Reflow (수직 재배치) 또는 스크롤
   → NO: 계속

2. 일부를 숨겨도 핵심 기능에 문제없는가?
   → YES: Prioritize (중요 요소만 표시) 또는 Collapse (메뉴 안으로)
   → NO: 계속

3. 더 적합한 모바일 UI 패턴이 있는가?
   → YES: Adapt (예: 데스크탑 테이블 → 모바일 카드 리스트)
   → NO: Truncate (말줄임) + "더보기"로 접근 가능하게
```

### 컴포넌트별 반응형 규칙

| 컴포넌트 | 모바일 (< md) | 태블릿 (md~lg) | 데스크탑 (lg+) |
|---------|--------------|---------------|--------------|
| **네비게이션** | 햄버거 메뉴 (Collapse) | 축약 탭바 | 풀 사이드바 또는 탑바 |
| **모달** | 풀스크린 또는 바텀시트 (Adapt) | 중앙 모달 (70% 너비) | 중앙 모달 (고정 너비) |
| **테이블** | 카드 리스트 (Adapt) | 수평 스크롤 | 풀 테이블 |
| **폼 필드** | 전체 너비 (Stack) | 2열 그리드 | 2~3열 그리드 |
| **버튼 그룹** | 전체 너비 Stack | Inline | Inline |
| **탭** | 스크롤 가능 탭바 | 풀 탭바 | 풀 탭바 |
| **사이드바** | 숨김 (오버레이로 열림) | 숨김 또는 축소(아이콘만) | 항상 표시 |
| **토스트** | 전체 너비 (선택한 위치) | 고정 너비 (선택한 위치) | 고정 너비 (선택한 위치) |

### 터치 타겟 규칙

모바일에서 인터랙티브 요소의 최소 터치 영역을 보장한다.

| 규칙 | 값 | 참고 |
|------|:---:|------|
| 최소 터치 타겟 | 44×44px | WCAG 2.5.8 (AAA) 기준. 실제 요소보다 패딩으로 확장 가능 |
| 최소 간격 (터치 요소 간) | 8px | 오탭 방지 |
| 권장 터치 타겟 | 48×48px | Material Design 권장. 여유가 있으면 이 크기 사용 |

```tsx
// 작은 아이콘 버튼에 터치 영역 확장 예시
<button className="relative p-2">  {/* 시각적 크기: 24px 아이콘 */}
  <span className="absolute -inset-2" />  {/* 터치 영역: 24 + 16 = 40px */}
  <Icon className="size-6" />
</button>
```

### 모바일 인터랙션 차이점

데스크탑과 모바일에서 동일한 컴포넌트가 다르게 동작해야 하는 경우:

| 인터랙션 | 데스크탑 | 모바일 | 이유 |
|---------|---------|--------|------|
| Hover 상태 | 있음 | **없음** (`:hover` 미지원) | 터치에는 hover 개념이 없음 |
| Tooltip 트리거 | hover + focus | focus + long-press | hover 없으므로 대안 트리거 필요 |
| 드롭다운/팝오버 | 인라인 표시 | **바텀시트**로 대체 고려 | 작은 화면에서 위치 잡기 어려움 |
| 스크롤 | 마우스 휠 + 스크롤바 | 스와이프 (관성 스크롤) | 스크롤 성능 최적화 중요 |
| 우클릭/컨텍스트 메뉴 | 있음 | long-press | OS 컨텍스트 메뉴와 충돌 주의 |

---

## 패턴 선택 가이드 (요약)

새로운 인터랙션을 설계할 때 아래 순서로 판단한다.

```
1. 이 인터랙션에 모션이 필요한가?
   → 목적 확인 (인과관계/공간안내/상태변화/대기완화) → A절
   → 없으면 모션 제거

2. 상태 전이 모델은?
   → 컴포넌트 유형별 상태 매트릭스 확인 → B절
   → disabled vs loading 구분

3. 사용자에게 피드백을 줘야 하는가?
   → 피드백 유형 선택 (inline/overlay/page-level) → C절
   → 에러라면 validation 타이밍 결정

4. 데이터를 기다려야 하는가?
   → 로딩 패턴 선택 (스피너/스켈레톤/프로그레스) → D절
   → 데이터가 없으면 empty state 구성

5. 정보를 단계적으로 공개해야 하는가?
   → 노출 계층 결정 + 컴포넌트 선택 → E절

6. 레이아웃은?
   → 스페이싱 계층 + 레이아웃 패턴 선택 → F절

7. 반응형 대응은?
   → 브레이크포인트별 행동 변화 패턴 결정 → G절
   → 터치 타겟 검증
```
