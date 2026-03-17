# Figma to Code 워크플로 가이드

> 이 문서는 Figma 컴포넌트를 kiio-library React 컴포넌트로 변환하는 **실전 절차**를 다룬다.
> 토큰 매핑 전체 테이블은 [CLAUDE.md](../CLAUDE.md) §Token Architecture,
> 설계 철학은 [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md),
> 코드 패턴은 [CLAUDE.md](../CLAUDE.md) §Common Component Patterns,
> 인터랙션 원칙은 [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) 참고.
>
> **Figma 파일 키**: `z6xEkVn88mi5Ai3IHgMrBZ`

---

## 목차

- [A. 워크플로 전체 지도](#a-워크플로-전체-지도)
- [B. MCP 도구 사용법](#b-mcp-도구-사용법)
- [C. Figma Mode → 프로젝트 테마 매핑](#c-figma-mode--프로젝트-테마-매핑)
- [D. 토큰 매핑 실전](#d-토큰-매핑-실전)
- [E. Auto-layout → Tailwind 레이아웃 변환](#e-auto-layout--tailwind-레이아웃-변환)
- [F. JSON Spec 작성](#f-json-spec-작성)
- [G. Figma 속성 → React Props 설계](#g-figma-속성--react-props-설계)
- [H. 구현 패턴: Spec → CVA 코드](#h-구현-패턴-spec--cva-코드)
- [I. 검증 체크리스트](#i-검증-체크리스트)
- [J. 트러블슈팅](#j-트러블슈팅)

---

## A. 워크플로 전체 지도

```
Figma 컴포넌트
      │
      ▼
[B] MCP 도구로 추출 ─── get_design_context
      │
      ▼
[C] 테마 매핑 확인 ──── Figma mode → data-theme
      │
      ▼
[D] 토큰 매핑 ────────── hex→ref→sys→Tailwind 역추적
      │
      ▼
[E] 레이아웃 분석 ────── Auto-layout → flex/grid
      │
      ▼
[F] JSON Spec 작성 ──── specs/{name}.json
      │
      ▼
[G] Props 설계 ────────── Figma property → React prop
      │
      ▼
[H] CVA 구현 ──────────── src/components/{Name}/
      │
      ▼
[I] 검증 ──────────────── 양 테마, 접근성, 타입
```

### 빠른 참조 링크

| 찾는 것 | 참고 위치 |
|---------|----------|
| 색상·스페이싱·타이포그래피 토큰 전체 테이블 | [CLAUDE.md](../CLAUDE.md) §Token Architecture |
| CVA + cn 코드 패턴 | [CLAUDE.md](../CLAUDE.md) §Common Component Patterns |
| Props 추가 판단 트리 | [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) §A |
| 모션 토큰 사용 원칙 | [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) §A |
| 복합 컴포넌트 패턴 | [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md) |
| JSON spec 구조 템플릿 | [specs/_TEMPLATE.json](../specs/_TEMPLATE.json) |

---

## B. MCP 도구 사용법

Figma MCP 도구를 사용하여 디자인 데이터를 프로그래밍적으로 추출한다.

### B-1. 도구별 역할

| 도구 | 언제 사용하는가 | 반환 내용 |
|------|----------------|-----------|
| `get_design_context` | **항상 먼저 사용.** 컴포넌트 추출의 기본 | reference code + screenshot + token metadata |
| `get_screenshot` | 특정 variant/state를 시각적으로 확인 | PNG 이미지 |
| `get_metadata` | 전체 컴포넌트 구조 파악, node ID 탐색 | XML 계층 (type, name, position, size) |

### B-2. Node ID 찾는 방법

**방법 1 — Figma URL에서 추출:**
```
https://figma.com/design/z6xEkVn88mi5Ai3IHgMrBZ/...?node-id=6648-14947
                                                              ↑
                                      URL의 "-"를 ":"로 변환 → 6648:14947
```

**방법 2 — `get_metadata`로 탐색:**
페이지 root node ID(예: `0:1`)에서 시작하여 children을 내려가며 이름으로 탐색한다.

### B-3. `get_design_context` 결과 해석

MCP가 반환하는 세 가지 결과물:

| 결과물 | 활용 방법 |
|--------|----------|
| **screenshot** | 가장 먼저 분석. 전체 variants/states의 시각적 구조 파악 |
| **reference code** | **참고용**. 이 프로젝트의 토큰/CVA 패턴과 다르므로 복사-붙여넣기 금지 |
| **asset URLs** | 이미지, 아이콘 등 외부 에셋 다운로드 링크 |

### B-4. Reference code에서 추출할 것 / 무시할 것

**추출 대상** — 수치와 구조:

| reference code 속성 | 변환 대상 |
|---------------------|----------|
| `width`, `height` | Tailwind spacing (`h-10`, `w-full`) |
| `padding` | Tailwind padding (`px-2.5`, `py-3`) |
| `gap` | Tailwind gap (`gap-2`) |
| `border-radius` | Tailwind rounded (`rounded-3`) |
| `font-size` + `font-weight` | typography 복합 토큰 (`typography-16-semibold`) |
| 색상 hex값 | sys 토큰으로 역추적 (→ §D 참고) |
| `display: flex`, `flex-direction` | Tailwind flex (`flex flex-row`) |

**무시 대상** — Figma 자동 생성물:

- Figma의 CSS 변수 이름 (우리 토큰 네임스페이스와 다름)
- `position: absolute` 레이아웃 (Auto-layout으로 재해석)
- 인라인 `style={}` 값 (모두 토큰 클래스로 변환)
- Figma 특유의 `clip-path`, `effect` 등

### B-5. 컴포넌트 variants 전체 추출 전략

1. 컴포넌트 세트의 root node ID를 `get_metadata`로 조회
2. children에서 각 variant node ID 목록 파악
3. 대표 variant(기본값)를 `get_design_context`로 상세 추출
4. 시각적 차이가 있는 variant는 `get_screenshot`으로 추가 확인
5. hover/focus/disabled 등 interactive state는 Figma에서 별도 프레임일 수 있음

---

## C. 테마 매핑

### 테마 메커니즘

- 조상 요소의 `data-theme` attribute로 색상 테마 전환
- Semantic 토큰이 `[data-theme]` 스코프에서 자동 전환됨
- **컴포넌트 코드에 테마 분기 로직을 넣지 않는다**

### Figma Mode 매핑

Figma MCP output의 mode 이름을 프로젝트의 `data-theme` 값으로 변환한다. JSON spec과 코드에서 Figma mode 이름을 직접 사용하지 않는다.

---

## D. 토큰 매핑 실전

> 전체 매핑 테이블은 [CLAUDE.md](../CLAUDE.md) §Token Mapping Reference 참고.
> 이 섹션은 **역추적 방법**을 다룬다.

### D-1. 색상 역추적: hex → ref → sys → Tailwind

MCP reference code에서 hex 색상이 나왔을 때:

```
Step 1: tokens.css :root 블록에서 hex가 어느 ref 토큰인지 찾는다
        #7B5CF0 → --ref-purple-500

Step 2: tokens.css [data-theme] 블록에서 ref 토큰이 어느 sys 토큰에 매핑됐는지 찾는다
        --sys-primary-500: var(--ref-purple-500)

Step 3: tailwind.config.js에서 Tailwind 클래스명을 확인한다
        sys.primary.500 → bg-sys-primary-500, text-sys-primary-500

결과: hex #7B5CF0 → bg-sys-primary-500
```

**역추적이 실패하는 경우**: hex가 ref 팔레트에 없을 때 → sys 토큰으로 의미를 추정하여 가장 가까운 것 선택하고, JSON spec에 이유를 기록한다.

### D-2. 스페이싱 변환

변환 공식: **`Tailwind 값 = px ÷ 4`**

```
Figma 8px  → 8 ÷ 4 = 2  → p-2, gap-2, m-2
Figma 10px → 10 ÷ 4 = 2.5 → px-2.5
Figma 12px → 12 ÷ 4 = 3  → px-3, gap-3
Figma 16px → 16 ÷ 4 = 4  → p-4, gap-4
```

### D-3. 타이포그래피 매핑

Figma에서 추출되는 정보: font-size + font-weight → 이 프로젝트의 복합 토큰으로 변환.

```
Figma: font-size 16px, font-weight 600
→ typography-16-semibold
```

**주의사항**:
- `typography-` 클래스이지 `text-` prefix가 아니다
- `text-` prefix는 색상 전용 (예: `text-sys-neutral-solid-0`)
- `tailwind.config.js`의 `plugins[].addUtilities`에서 생성됨

```tsx
// DON'T — Tailwind 기본 text 유틸리티
className="text-base font-medium"

// DO — typography 복합 토큰
className="typography-16-medium"
```

### D-4. 모션 토큰 매핑

Figma에서 transition 값이 나올 때 sys 토큰으로 변환한다.

| Figma duration | sys 토큰 | Tailwind 클래스 |
|---------------|----------|----------------|
| 0ms | instant | `duration-instant` |
| 100ms | fast | `duration-fast` |
| 200ms | normal | `duration-normal` |
| 300ms | slow | `duration-slow` |
| 500ms | slower | `duration-slower` |

| Figma easing | sys 토큰 | Tailwind 클래스 |
|-------------|----------|----------------|
| ease-out (진입) | enter | `ease-enter` |
| ease-in (퇴장) | exit | `ease-exit` |
| ease-in-out (이동) | move | `ease-move` |
| linear | linear | `ease-linear` |

> **`transition-all` 사용 금지.** 변하는 property를 명시해야 한다: `transition-colors`, `transition-opacity` 등.
> → [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) 참고

---

## E. Auto-layout → Tailwind 레이아웃 변환

### E-1. 핵심 속성 매핑

| Figma Auto-layout | Tailwind | 비고 |
|---|---|---|
| Direction: Horizontal | `flex flex-row` | 기본값이므로 `flex`만으로 충분 |
| Direction: Vertical | `flex flex-col` | |
| Align items: Center | `items-center` | |
| Align items: Start | `items-start` | |
| Align items: End | `items-end` | |
| Justify: Space between | `justify-between` | |
| Justify: Center | `justify-center` | |
| Gap: 8px | `gap-2` | px ÷ 4 |
| Padding: 16px (all) | `p-4` | |
| Padding: 12px 16px (v h) | `py-3 px-4` | |

### E-2. Sizing 속성 매핑

| Figma | Tailwind | 설명 |
|---|---|---|
| Fixed width/height | `w-{n}` / `h-{n}` | 고정 크기 |
| Hug contents | `w-fit` / `h-fit` | 내용에 맞게 줄어듦 |
| Fill container | `w-full` / `h-full` | 부모를 채움 |
| Min width | `min-w-{n}` | 최소 크기 |

### E-3. Absolute positioning 판단 기준

Figma에서 절대 배치가 있을 때:

```
1. 이 요소가 "overlay" 역할인가? (상태 오버레이, 로딩 스피너, 뱃지 카운터)
   → YES: relative 컨테이너 + absolute child 패턴 사용
          className="absolute inset-0 ..."

2. 이 요소가 실제 레이아웃 흐름에 포함되어야 하는가?
   → YES: flex/grid 레이아웃으로 재구성
   → Figma의 절대 배치는 시각적 편의일 수 있음
```

**Button 실제 예시:**

```tsx
// State overlay: absolute로 button 전체를 덮음
<span className="absolute inset-0 rounded-[inherit] transition-colors ..." />

// Loading spinner: absolute로 중앙 배치
<span className="absolute inset-0 flex items-center justify-center">
  <Spinner />
</span>
```

### E-4. 중첩 Auto-layout 처리

- 각 Auto-layout 레이어를 별도 `div`/`span`으로 매핑
- 가장 바깥 컨테이너부터 안쪽 순서로 번역
- 불필요한 중첩은 제거 (한 레벨로 단순화 가능한 경우)

---

## F. JSON Spec 작성

### F-1. 시작점

`specs/_TEMPLATE.json`을 `specs/{component-name}.json`으로 복사하여 시작한다.
완성된 실제 예시는 `specs/button.json` 참고.

### F-2. MCP output에서 spec 채우는 순서

1. `get_design_context` 실행 → **screenshot을 먼저 분석**하여 전체 variants 파악
2. `props` 섹션: Figma property panel의 variant 목록 → JSON props로 변환
3. `variants.size` 섹션: 각 크기별 height, padding, typography, gap, iconSize, radius 수치
4. `variants.{hierarchy}` 섹션: 각 variant별 background, text, border (sys 토큰으로)
5. `states` 섹션: hover, pressed, focused, disabled, loading 각각의 변화
6. `implementation` 섹션: 패턴 선택, 특수 동작, 파일 목록, 의존성

### F-3. 필수 필드 설명

```json
{
  "component": "ComponentName",        // PascalCase
  "description": "역할 한 줄 설명",
  "figmaNode": "6648:14947",           // Figma node ID (URL의 node-id, "-"→":")
  "props": { ... },                    // 모든 component props
  "variants": {
    "size": { ... },                   // 크기별 수치 (height, padding, typography 등)
    "{variantName}": { ... }           // 시각 variant별 색상 (sys 토큰)
  },
  "states": {
    "hover": { ... },                  // state overlay 토큰
    "pressed": { ... },
    "focused": { ... },
    "disabled": { ... },               // hierarchy별 비활성 색상
    "loading": { ... }
  },
  "implementation": {
    "pattern": "CVA + cn + ...",       // 사용할 패턴
    "stateOverlay": "...",             // state 처리 방식
    "files": ["..."],                  // 생성할 파일 목록
    "dependencies": ["..."]            // 의존하는 컴포넌트/유틸리티
  }
}
```

---

## G. Figma 속성 → React Props 설계

> Props 추가 판단 트리는 [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) §A 참고.

### G-1. Figma property type → React prop type

| Figma property type | React prop 패턴 | 예시 |
|---|---|---|
| Variant (열거형) | `as const` 배열 + union 타입 | `hierarchy: 'primary' \| 'secondary'` |
| Boolean (토글) | `boolean` prop | `loading`, `disabled`, `fullWidth` |
| Instance swap | `React.ReactNode` prop | `iconLeading`, `iconTrailing` |
| Text | `React.ReactNode` children | `children` |

### G-2. 이름 변환 규칙

Figma property 이름을 camelCase로 변환하되, **의미를 변경하거나 축약하지 않는다** ([DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) §D).

```
Figma: "Hierarchy"     → prop: hierarchy
Figma: "Icon Leading"  → prop: iconLeading
Figma: "Full Width"    → prop: fullWidth
```

### G-3. `as const` variant 메타데이터 export

Figma variant의 모든 값을 `as const` 배열로 export한다:

```tsx
export const BADGE_VARIANTS = ['info', 'success', 'warning', 'error'] as const
export const BADGE_SIZES = ['large', 'medium', 'small'] as const

export type BadgeVariant = (typeof BADGE_VARIANTS)[number]
export type BadgeSize = (typeof BADGE_SIZES)[number]
```

네이밍: `{COMPONENT}_{PROP}S` in SCREAMING_SNAKE_CASE.

### G-4. 컴포넌트 분류 판단

| Figma 특징 | 코드 패턴 | 예시 |
|---|---|---|
| 단일 컴포넌트, variant 기반 | CVA + cn | Button, Badge, Avatar |
| 중첩 컴포넌트, props로 구조 제어 | Composite (props 전달) | FormField + Input |
| 복잡한 nested 구조, 사용자가 구조 제어 | Compound (Context) | Modal, Tabs, Select |

> 복합 컴포넌트 패턴은 [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md) 참고.

---

## H. 구현 패턴: Spec → CVA 코드

> 코드 패턴 전문은 [CLAUDE.md](../CLAUDE.md) §Common Component Patterns 참고.
> 이 섹션은 spec에서 코드로의 **변환 대응**을 다룬다.

### H-1. JSON spec → CVA 구조 대응

```
spec variants.size.medium.height → CVA size.medium: 'h-10 ...'
spec variants.size.medium.paddingX → CVA size.medium: '... px-2.5 ...'
spec variants.size.medium.typography → CVA size.medium: '... typography-16-semibold'
spec variants.hierarchy.primary.background → CVA hierarchy.primary: 'bg-sys-neutral-solid-950 ...'
```

실제 Button CVA 예시:
```tsx
const buttonVariants = cva(
  'group relative inline-flex items-center justify-center shrink-0 select-none transition-colors duration-fast ease-enter',
  {
    variants: {
      hierarchy: {
        primary: 'bg-sys-neutral-solid-950 text-sys-neutral-solid-0',
        // ...
      },
      size: {
        medium: 'h-10 px-2.5 gap-1.5 rounded-3 typography-16-semibold',
        // ...
      },
    },
  },
)
```

### H-2. State overlay 구현

spec의 `states.hover`/`states.pressed` → state overlay span 패턴:

```tsx
// hierarchy별 overlay Record
const stateOverlayVariants: Record<Hierarchy, string> = {
  primary: 'group-hover:bg-sys-state-on-dim-50 group-active:bg-sys-state-on-dim-100',
  secondary: 'group-hover:bg-sys-state-on-bright-50 group-active:bg-sys-state-on-bright-70',
}

// 컴포넌트 내부: absolute span
<span
  aria-hidden
  className={cn(
    'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
    'group-focus-visible:border-2 group-focus-visible:border-sys-primary-300',
    !disabled && !loading && stateOverlayVariants[hierarchy],
  )}
/>
```

컴포넌트 root에 `group relative` 필수.

### H-3. Disabled 처리

spec의 `states.disabled` → hierarchy별 별도 Record:

```tsx
const disabledVariants: Record<Hierarchy, string> = {
  primary: 'disabled:bg-sys-neutral-solid-300 disabled:text-sys-neutral-white-alpha-400',
  ghost: 'disabled:bg-transparent disabled:text-sys-neutral-black-alpha-200',
}
```

CVA compoundVariants 대신 별도 Record를 사용하는 이유: hierarchy × disabled 조합이 많고, defaultVariants와 충돌 가능성 회피.

### H-4. Icon/Loading 처리

```tsx
// Icon size: size별 Record
const iconSizeMap = {
  xLarge: 'size-6', large: 'size-6', medium: 'size-5', small: 'size-5',
} as const

// Loading: 콘텐츠 invisible + 스피너 absolute center
{loading && (
  <span className="absolute inset-0 flex items-center justify-center">
    <Spinner className={spinnerSizeMap[size]} />
  </span>
)}
{children && (
  <span className={cn('relative', loading && 'invisible')}>{children}</span>
)}
```

### H-5. 파일 구조

```
src/components/{ComponentName}/
├── {ComponentName}.tsx   # variant metadata + CVA + interface + 컴포넌트
└── index.ts              # barrel export
```

`index.ts` 필수 export:
- 컴포넌트 함수
- Props interface (`type` 키워드)
- `as const` 배열들
- Union 타입들

---

## I. 검증 체크리스트

### I-1. MCP 출력 대비 검증

- [ ] `get_screenshot` 결과와 브라우저 렌더링을 시각적으로 비교
- [ ] Figma의 모든 variant가 JSON spec에 기록됨
- [ ] JSON spec의 모든 variant가 코드에 구현됨
- [ ] 각 size의 height, padding, gap, typography가 spec과 일치
- [ ] 색상이 모두 sys 토큰으로 변환됨 (hex 하드코딩 없음)

### I-2. 테마 검증

- [ ] 모든 `data-theme` 값에서 의도한 색상 확인
- [ ] 텍스트 대비 WCAG AA 충족 (일반 텍스트 4.5:1, 큰 텍스트 3:1)

### I-3. 타입 검증

- [ ] `npm run typecheck` 에러 없음
- [ ] `as const` 배열이 index.ts에서 export됨
- [ ] JSDoc `@default`, `@see` 주석이 모든 props에 있음

### I-4. 접근성 검증

- [ ] 시맨틱 HTML 요소 사용 (`<button>`, `<input>`, 등)
- [ ] `focus-visible` 포커스 링 표시
- [ ] `disabled` 상태의 `aria-disabled` 처리
- [ ] `loading` 상태의 `aria-busy`, `aria-disabled` 처리
- [ ] 키보드 탭 이동 논리적 순서

### I-5. 모션 검증

- [ ] sys 토큰만 사용 (`duration-fast`, `ease-enter` 등)
- [ ] `transition-all` 사용 없음
- [ ] `prefers-reduced-motion`에서 애니메이션 억제 확인

---

## J. 트러블슈팅

### MCP 도구 관련

**문제**: `get_design_context` 인증 오류
- **해결**: Figma MCP 플러그인 재인증. 세션마다 재인증이 필요할 수 있음.

**문제**: node ID를 찾을 수 없음
- **해결**: `get_metadata`로 페이지 구조를 탐색하거나, Figma URL에서 `node-id=` 파라미터 확인. `-`를 `:`로 변환.

**문제**: reference code가 너무 복잡함
- **해결**: screenshot을 우선 분석. reference code는 치수 확인용으로만 활용.

### 토큰 매핑 관련

**문제**: Figma 색상이 어느 ref 토큰인지 모르겠음
- **해결**: `tokens.css`에서 hex 값 검색. 없으면 가장 유사한 sys 토큰으로 매핑하고 spec에 이유 기록.

**문제**: `typography-` 클래스가 적용되지 않음
- **해결**: 이 클래스는 `tailwind.config.js`의 `plugins[].addUtilities`에서 생성됨. Vite 캐시 삭제 후 재시작: `rm -rf node_modules/.vite`

### 테마 관련

**문제**: 테마가 전환되지 않음
- **해결**: `data-theme` 속성이 컴포넌트의 조상 요소에 있는지 확인. 유효한 `data-theme` 값을 사용하고 있는지 검증.

**문제**: 양 테마에서 색상이 동일하게 나옴
- **해결**: `sys-primary-*` 토큰이 아닌 `sys-neutral-*` 토큰을 사용했을 가능성. Neutral은 테마에 따라 변하지 않음.
