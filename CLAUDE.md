# kiio-library
React 19 + TypeScript design system library. Provides design tokens and styled UI components built with Tailwind CSS 3, CVA, and cn (clsx + tailwind-merge). Font: Pretendard Variable.
---
## Project Vision
**Goal**: Build a production-ready design system that bridges Figma designs and React components through structured JSON specifications.
**What This Project Demonstrates**:
- Design token architecture (Figma → JSON → TypeScript → CSS → Tailwind)
- Multi-theme system (Align & Edutap)
- Type-safe component API design
- Systematic design-to-code workflow
- Scalable component specification system
**Portfolio Story**:
"A comprehensive design system built from Figma specifications using a structured JSON spec system. Implements a scalable token architecture supporting multiple themes while ensuring design consistency and type safety across all components."
---
## Development Commands
```bash
# Development
npm run dev           # Start Vite dev server (http://localhost:5173)
# Build
npm run build         # Compile TypeScript and build for production
npm run preview       # Preview production build locally
# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues (if configured)
npm run typecheck     # Run TypeScript compiler check (if configured)
```
**Quick Start**:
1. `npm install` - Install dependencies
2. `npm run dev` - Start development server
3. Open http://localhost:5173
4. Edit files - changes hot-reload automatically
---
## Architecture
### Project Structure
```
kiio-library/
├── src/
│   ├── components/       # React components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   └── Icon.tsx
│   ├── lib/             # Shared utilities
│   │   └── utils.ts     # cn() class merging utility
│   ├── tokens/          # Design tokens
│   │   ├── primitive.ts       # Primitive tokens
│   │   ├── semantic.ts       # Semantic tokens
│   │   ├── numbers.ts   # Spacing & radius
│   │   ├── typography.ts
│   │   ├── motion.ts    # Duration & easing
│   │   ├── tokens.css   # CSS variables
│   │   └── index.ts
│   ├── index.css        # Global styles
│   └── main.tsx
├── docs/                # Design system documentation
│   ├── ADVANCED_PATTERNS.md   # 복합 컴포넌트 패턴
│   ├── DESIGN_PRINCIPLES.md  # 디자인 철학, API 설계 원칙
│   ├── INTERACTION_DESIGN.md # 인터랙션 설계, 모션 원칙
│   ├── UI_PATTERNS.md        # UI 패턴, 페이지 구성, 컴포넌트 조합
│   └── FIGMA_TO_CODE.md     # Figma→Code 실전 워크플로
├── specs/               # Component specifications (JSON)
│   ├── _TEMPLATE.json
│   ├── button.json
│   ├── input.json
│   └── ...
├── CLAUDE.md           # This file (핵심 규칙, 자동 로드)
└── tailwind.config.js
```

### Documentation

| 문서 | 위치 | 역할 |
|------|------|------|
| [CLAUDE.md](./CLAUDE.md) | 루트 (이 파일) | 핵심 규칙, 토큰 참조, 컴포넌트 컨벤션, 코드 패턴 |
| [ADVANCED_PATTERNS.md](./docs/ADVANCED_PATTERNS.md) | `docs/` | 복합 컴포넌트, Context, 훅, 테스트, Storybook 패턴 |
| [DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md) | `docs/` | 디자인 철학, API 설계 원칙, 접근성 심화, 디자인-코드 일관성 |
| [INTERACTION_DESIGN.md](./docs/INTERACTION_DESIGN.md) | `docs/` | 인터랙션 설계, 모션 원칙, 상태 전이, 피드백 패턴, 반응형 전략 |
| [UI_PATTERNS.md](./docs/UI_PATTERNS.md) | `docs/` | UI 패턴, 네비게이션 구조, 오버레이, 데이터 표시, 폼, 페이지 구성 |
| [FIGMA_TO_CODE.md](./docs/FIGMA_TO_CODE.md) | `docs/` | Figma→Code 실전 워크플로, MCP 도구, 토큰 매핑, 레이아웃 변환 |
| [TOKEN_LAYER_RULES.md](./docs/TOKEN_LAYER_RULES.md) | `docs/` | 토큰 레이어 배치 판단 규칙, 테마 분기 위치 결정 |

**문서 관리 원칙**:
- CLAUDE.md에는 **핵심 규칙과 빠른 참조**만 둔다. 상세 가이드는 `docs/`에 별도 문서로 분리한다.
- 새 규칙/가이드 추가 시: (1) `docs/`에 주제별 문서 생성 → (2) CLAUDE.md의 관련 섹션에 `> ... 참고` 링크 추가 → (3) 위 테이블에 행 추가
- 문서는 **주제/맥락 단위**로 분리한다 (시간순이나 작업순 아님).

### Import Path Alias
- `@/` maps to `src/` (configured in `tsconfig.app.json` + `vite.config.ts`)
- Example: `import { cn } from '@/lib/utils'`
- Use `@/` for all project imports instead of relative paths

---
## Token Architecture
Three-layer token system: **Primitive → Semantic → Component**. All tokens exist as both TypeScript objects (`src/tokens/`) and CSS custom properties (`src/tokens/tokens.css`), and are mapped to Tailwind utilities in `tailwind.config.js`.
### Primitive Tokens
`src/tokens/primitive.ts` — 23 color families × 14 shades (0, 50, 70, 100–1000).
- CSS: `--primitive-{color}-{shade}` (e.g., `--primitive-indigo-500`)
- Tailwind: `bg-primitive-indigo-500`, `text-primitive-gray-800`
- **Do NOT use primitive tokens directly in components** — use semantic tokens instead.
### Semantic Tokens
`src/tokens/semantic.ts` — Theme-aware semantic tokens mapped from primitive tokens. Switched via `data-theme="brand1"` or `data-theme="brand2"` on an ancestor element.
Categories and Tailwind usage:
| Category | Example class | Notes |
|----------|--------------|-------|
| primary | `bg-semantic-primary-500` | Brand color, 50–900 |
| success | `text-semantic-success-700` | 50–900 |
| warning | `border-semantic-warning-400` | 50–900 |
| error | `bg-semantic-error-100` | 50–900 |
| neutral.solid | `bg-semantic-neutral-solid-100` | 0, 50, 70, 100–950 |
| neutral.black-alpha | `bg-semantic-neutral-black-alpha-200` | Transparent black |
| neutral.white-alpha | `bg-semantic-neutral-white-alpha-200` | Transparent white |
| background | `bg-semantic-background-0` | 0, 50, 70 |
| divider.solid | `border-semantic-divider-solid-100` | 50–300 |
| divider.alpha | `border-semantic-divider-alpha-100` | 50–300 |
| text.on-bright | `text-semantic-text-on-bright-900` | For light backgrounds, 400–950 |
| text.on-dim | `text-semantic-text-on-dim-900` | For dark backgrounds, 400–950 |
| state.on-bright | `bg-semantic-state-on-bright-70` | Hover/press states, 50–100 |
| state.on-dim | `bg-semantic-state-on-dim-70` | Hover/press states, 50–100 |
### Component Tokens
Component-level tokens map semantic tokens to specific component roles. Defined in `src/tokens/tokens.css` as CSS custom properties, consumed in CVA via Tailwind arbitrary values.

**Naming convention**: `--comp-{component}-{property}-{variant}[-{state}]`

```
--comp-button-bg-primary              # background for primary hierarchy
--comp-button-content-primary         # text+icon color for primary
--comp-button-height-xl               # height for xLarge size
--comp-button-bg-primary-disabled     # disabled background for primary
```

**Usage in CVA** (Tailwind arbitrary values):
```tsx
hierarchy: {
  primary: 'bg-[var(--comp-button-bg-primary)] text-[var(--comp-button-content-primary)]',
}
size: {
  xLarge: 'h-[var(--comp-button-height-xl)] px-[var(--comp-button-px-xl)] ...',
}
```

**Property names**: `bg`, `content`, `border`, `height`, `px`, `gap`, `radius`, `icon`, `hover-on-dim`, `active-on-dim`, `hover-on-bright`, `active-on-bright`, `focus-border`

> 토큰을 어느 레이어에 배치할지 판단하는 규칙은 [TOKEN_LAYER_RULES.md](./docs/TOKEN_LAYER_RULES.md) 참고.

#### Component Token Workflow (새 컴포넌트 토크나이즈 절차)
1. **CVA variants 분석** — variant 축(hierarchy, size 등)별로 변하는 시각 속성 나열 (bg, content, border, height, px, gap, radius, icon size)
2. **`tokens.css`에 CSS 변수 정의** — `--comp-{name}-{property}-{variant}` 패턴. semantic/spacing/radius 토큰 참조
3. **CVA에서 arbitrary value로 교체** — `{utility}-[var(--comp-{name}-{property}-{variant})]`
4. **상태 토큰 추가** — disabled, hover, active, focus 각각 별도 토큰
5. **빌드 확인 + 시각 검증** — `npm run build`, 브라우저에서 모든 variant/state/theme 확인

### Number Tokens
`src/tokens/numbers.ts`
- **Spacing**: 36 steps (px, 0–96). Tailwind: `p-4` → 16px, `gap-6` → 24px, `m-0.5` → 2px
- **Border radius**: 24 steps (px, 0–24). Tailwind: `rounded-2` → 8px, `rounded-4` → 16px
### Typography Tokens
`src/tokens/typography.ts` — 13 sizes × 4 weights = 52 composite tokens.
- Sizes: 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 32, 40
- Weights: regular (400), medium (500), semibold (600), bold (700)
- Tailwind: `typography-{size}-{weight}` — sets font-size, line-height, letter-spacing, and font-weight in one class
- Examples: `typography-16-semibold`, `typography-14-regular`, `typography-24-bold`
### Motion Tokens
`src/tokens/motion.ts` — Duration (5 steps) + Easing (4 curves), Primitive → Semantic 2-layer like colors.
- **Do NOT use ref motion tokens directly in components** — use semantic tokens instead.
- **Do NOT use Tailwind default `duration-100`, `ease-out` etc** — use semantic tokens like `duration-fast`, `ease-enter`.

**Duration** (Primitive → Semantic → Tailwind):

| Primitive (direct use forbidden) | Semantic | Value | Tailwind | Usage |
|:--------------------------------:|----------|:-----:|---------|-------|
| `primitive-duration-0` | `semantic-duration-instant` | 0ms | `duration-instant` | Instant changes (color swap) |
| `primitive-duration-100` | `semantic-duration-fast` | 100ms | `duration-fast` | Hover, focus micro-states |
| `primitive-duration-200` | `semantic-duration-normal` | 200ms | `duration-normal` | Element enter/exit, dropdown open |
| `primitive-duration-300` | `semantic-duration-slow` | 300ms | `duration-slow` | Modal, overlay enter/exit |
| `primitive-duration-500` | `semantic-duration-slower` | 500ms | `duration-slower` | Page transitions, complex layout |

**Easing** (Primitive → Semantic → Tailwind):

| Primitive (direct use forbidden) | Semantic | CSS Value | Tailwind | Usage |
|:--------------------------------:|----------|-----------|---------|-------|
| `primitive-easing-ease-out` | `semantic-easing-enter` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | `ease-enter` | Enter: element appearing |
| `primitive-easing-ease-in` | `semantic-easing-exit` | `cubic-bezier(0.4, 0.0, 1, 1)` | `ease-exit` | Exit: element disappearing |
| `primitive-easing-ease-in-out` | `semantic-easing-move` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | `ease-move` | Move: position/size change |
| `primitive-easing-linear` | `semantic-easing-linear` | `linear` | `ease-linear` | Loop: spinner, progress bar |

**CSS Variables** (`src/tokens/tokens.css`):
```css
:root {
  /* Primitive: Duration */
  --primitive-duration-0: 0ms;
  --primitive-duration-100: 100ms;
  --primitive-duration-200: 200ms;
  --primitive-duration-300: 300ms;
  --primitive-duration-500: 500ms;
  /* Semantic: Duration */
  --semantic-duration-instant: var(--primitive-duration-0);
  --semantic-duration-fast: var(--primitive-duration-100);
  --semantic-duration-normal: var(--primitive-duration-200);
  --semantic-duration-slow: var(--primitive-duration-300);
  --semantic-duration-slower: var(--primitive-duration-500);
  /* Primitive: Easing */
  --primitive-easing-ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --primitive-easing-ease-in: cubic-bezier(0.4, 0.0, 1, 1);
  --primitive-easing-ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
  --primitive-easing-linear: linear;
  /* Semantic: Easing */
  --semantic-easing-enter: var(--primitive-easing-ease-out);
  --semantic-easing-exit: var(--primitive-easing-ease-in);
  --semantic-easing-move: var(--primitive-easing-ease-in-out);
  --semantic-easing-linear: var(--primitive-easing-linear);
}
```

**Tailwind config** (`tailwind.config.js` extends):
```js
transitionDuration: {
  instant: 'var(--semantic-duration-instant)',
  fast:    'var(--semantic-duration-fast)',
  normal:  'var(--semantic-duration-normal)',
  slow:    'var(--semantic-duration-slow)',
  slower:  'var(--semantic-duration-slower)',
},
transitionTimingFunction: {
  enter:  'var(--semantic-easing-enter)',
  exit:   'var(--semantic-easing-exit)',
  move:   'var(--semantic-easing-move)',
  linear: 'var(--semantic-easing-linear)',
},
animationDuration: {
  instant: 'var(--semantic-duration-instant)',
  fast:    'var(--semantic-duration-fast)',
  normal:  'var(--semantic-duration-normal)',
  slow:    'var(--semantic-duration-slow)',
  slower:  'var(--semantic-duration-slower)',
},
animationTimingFunction: {
  enter:  'var(--semantic-easing-enter)',
  exit:   'var(--semantic-easing-exit)',
  move:   'var(--semantic-easing-move)',
  linear: 'var(--semantic-easing-linear)',
},
```

**Reduced motion** (`src/index.css`):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Essential animations (spinners, progress) — reduce, don't remove */
  .motion-essential {
    animation-duration: var(--semantic-duration-fast) !important;
    transition-duration: var(--semantic-duration-fast) !important;
  }
}
```

> For motion design principles (when to use which duration/easing, enter/exit patterns, state transition model), see [INTERACTION_DESIGN.md §A](./docs/INTERACTION_DESIGN.md#a-motion--timing-원칙).
---
## Figma to Code Workflow
We use **structured JSON specifications** to translate Figma designs into components. This approach provides:
- Machine-readable format
- Complete design documentation
- Token mapping included
- Reusable across projects
### Step 1: Review Figma Design (10-15 min)
Open the component in Figma and document:
**Visual Variants**:
- All hierarchy options (primary, secondary, outlined, ghost, etc.)
- All size options (small, medium, large, xlarge)
- Special variations (icon-only, full-width, etc.)
**For Each Variant, Note**:
- Background color (as semantic token)
- Text color (as semantic token)
- Border (if any)
- Hover state changes
- Active/pressed state changes
**For Each Size, Note**:
- Horizontal padding (in px)
- Vertical padding (in px)
- Typography (font-size and weight)
- Icon size (if applicable)
- Gap between elements (if applicable)
**Interactive States**:
- Focus ring style
- Disabled appearance
- Loading state (if applicable)
**Other Properties**:
- Border radius
- Shadows
- Transitions
- Any special behaviors
### Step 2: Create JSON Spec (10-15 min)
Create `specs/{component-name}.json` following this structure:
**Basic Schema**:
```json
{
  "component": "ComponentName",
  "description": "What this component does",
  "props": { /* prop definitions */ },
  "variants": { /* variant styling */ },
  "states": { /* interactive states */ },
  "implementation": { /* special notes */ }
}
```
### Step 3: Use JSON Spec Template
Use the JSON spec template (`specs/_TEMPLATE.json`) as a starting point. The template includes:
- Complete schema with all fields
- Inline comments explaining each field
- Example values for reference
Copy the template to `specs/{component-name}.json` and fill in your component's specific values.
**Schema Overview**:
- `component`: Component name (PascalCase)
- `description`: Brief description
- `figmaLink`: Link to Figma design (optional)
- `props`: Object defining all component props with types and defaults
- `variants`: Object defining all variant options with their Tailwind classes
- `states`: Object defining interactive states (hover, focus, etc.)
- `implementation`: Object with implementation notes and patterns
See `specs/_TEMPLATE.json` for the complete schema with detailed comments.
### Step 4: Token Mapping Reference
When writing JSON specs, use this reference to map Figma values to tokens:
**Colors**:
| Figma Value | Sys Token | Usage |
|-------------|-----------|-------|
| Brand purple | `semantic-primary-500` | Primary actions |
| Brand red-orange | `semantic-primary-500` | Primary actions (Edutap theme) |
| Success green | `semantic-success-500` | Success states |
| Warning yellow | `semantic-warning-500` | Warning states |
| Error red | `semantic-error-500` | Error states |
| Dark text on light | `semantic-text-on-bright-900` | Body text |
| Light text on dark | `semantic-text-on-dim-50` | Reversed text |
| Light gray bg | `semantic-surface-50` | Surface background |
**Spacing** (Figma → Tailwind):
| Figma px | Tailwind | Actual |
|----------|----------|--------|
| 2px | `0.5` | 2px |
| 4px | `1` | 4px |
| 6px | `1.5` | 6px |
| 8px | `2` | 8px |
| 12px | `3` | 12px |
| 16px | `4` | 16px |
| 20px | `5` | 20px |
| 24px | `6` | 24px |
| 32px | `8` | 32px |
| 40px | `10` | 40px |
**Typography**:
Map Figma font size + weight to composite token:
- 14px Regular → `typography-14-regular`
- 16px Medium → `typography-16-medium`
- 18px Semibold → `typography-18-semibold`
- 20px Bold → `typography-20-bold`
**Border Radius**:
| Figma px | Tailwind | Actual |
|----------|----------|--------|
| 0px | `rounded-none` | 0 |
| 4px | `rounded-1` | 4px |
| 8px | `rounded-2` | 8px |
| 12px | `rounded-3` | 12px |
| 16px | `rounded-4` | 16px |
**Motion Duration** (Figma → Tailwind):
| Figma/Design Intent | Sys Token | Tailwind | Value |
|---------------------|-----------|---------|:-----:|
| Instant (color swap) | `semantic-duration-instant` | `duration-instant` | 0ms |
| Hover / focus | `semantic-duration-fast` | `duration-fast` | 100ms |
| Dropdown open / element enter | `semantic-duration-normal` | `duration-normal` | 200ms |
| Modal / overlay enter | `semantic-duration-slow` | `duration-slow` | 300ms |
| Page transition | `semantic-duration-slower` | `duration-slower` | 500ms |
**Motion Easing** (Figma → Tailwind):
| Figma/Design Intent | Sys Token | Tailwind |
|---------------------|-----------|---------|
| Element entering screen | `semantic-easing-enter` | `ease-enter` |
| Element leaving screen | `semantic-easing-exit` | `ease-exit` |
| Position/size change | `semantic-easing-move` | `ease-move` |
| Spinner / progress loop | `semantic-easing-linear` | `ease-linear` |
### Step 5: Pass Spec to Claude Code
Send the JSON spec to Claude Code with this prompt:
```
Create a [ComponentName] component based on this JSON specification.
[Paste JSON spec]
Follow these requirements:
1. Use CVA (class-variance-authority) for variant management
2. Use cn from @/lib/utils for class merging
3. Extend the appropriate React HTML element props
4. Export both the component and its props interface
5. Create an index.ts file for clean imports
6. Follow all patterns from CLAUDE.md
Generate:
1. src/components/[ComponentName]/[ComponentName].tsx
2. src/components/[ComponentName]/index.ts
3. Show usage examples
```
### Step 6: Validation Checklist
After implementation, verify:
- [ ] All variants from JSON spec are implemented
- [ ] All sizes match Figma padding/typography exactly
- [ ] States (focus, hover, active, disabled) work correctly
- [ ] Both themes (Align & Edutap) render correctly
- [ ] Icons scale properly with size variants
- [ ] TypeScript types are complete and exported
- [ ] No hardcoded values (colors, spacing, fonts, duration, easing)
- [ ] Motion uses semantic tokens only (`duration-fast`, `ease-enter` — not `duration-100`, `ease-out`)
- [ ] `transition-all` not used (specify `transition-colors`, `transition-opacity` etc.)
- [ ] Component follows CVA + cn pattern
---
## Component Conventions
### File Structure
Components live in `src/components/`. Each component gets its own folder:
```
src/components/Button/
├── Button.tsx       # Component implementation
└── index.ts         # Barrel export
```
**Button.tsx**:
```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Props here
}
export function Button({ ... }: ButtonProps) {
  // Implementation
}
```
**index.ts**:
```tsx
export { Button } from './Button'
export type { ButtonProps } from './Button'
```
### Styling Rules
**DO:**
```tsx
// Use semantic tokens for colors
className="bg-semantic-primary-500 text-semantic-text-on-bright-900"
// Use typography tokens (composite)
className="typography-16-medium"
// Use spacing tokens
className="p-4 gap-2 m-6"
// Use border radius tokens
className="rounded-2"
// Use motion tokens (sys only)
className="transition-colors duration-fast ease-enter"
className="duration-normal ease-move"
// Use CVA for variant logic
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      primary: 'bg-semantic-primary-500 hover:bg-semantic-primary-600',
      secondary: 'bg-semantic-secondary-500 hover:bg-semantic-secondary-600'
    }
  }
})
// Use cn for class merging (resolves Tailwind conflicts)
import { cn } from '@/lib/utils'
className={cn(buttonVariants({ variant, size }), className)}

// cn() utility — twMerge(clsx(...)) resolves Tailwind class conflicts
cn('p-4', 'p-2')  // → 'p-2' (last conflicting class wins)
cn('text-red-500', condition && 'text-blue-500')  // conditional classes
```
**DON'T:**
```tsx
// Don't use primitive tokens directly in components
className="bg-primitive-indigo-500"
// Don't hardcode values
className="text-[16px] p-[16px]"
style={{ padding: '16px' }}
// Don't use arbitrary colors
className="bg-[#5B4FFF]"
// Don't use base Tailwind typography
className="text-base font-medium"  // Use typography-16-medium instead
// Don't use base Tailwind motion utilities (ref level)
className="duration-100 ease-out"  // Use duration-fast ease-enter instead
// Don't hardcode motion values
style={{ transitionDuration: '200ms' }}
// Don't use transition-all (unintended properties, perf hit)
className="transition-all duration-fast"  // Use transition-colors, transition-opacity etc.
// Don't skip CVA for multi-variant components
{variant === 'primary' ? 'bg-blue' : 'bg-gray'}
```
### Variant Metadata Export
Every component with CVA variants MUST export its valid values as `as const` arrays. This enables:
- AI 도구가 유효한 variant 값을 프로그래밍적으로 발견
- 타입이 단일 소스(as const 배열)에서 파생 (DRY)
- Showcase controls가 하드코딩 대신 배열을 import하여 사용

**Pattern**:
```tsx
// 1. Export variant value arrays
export const BUTTON_HIERARCHIES = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const

// 2. Derive types from arrays
export type ButtonHierarchy = (typeof BUTTON_HIERARCHIES)[number]
export type ButtonSize = (typeof BUTTON_SIZES)[number]

// 3. Use derived types in props interface
export interface ButtonProps {
  hierarchy?: ButtonHierarchy
  size?: ButtonSize
}

// 4. Export from index.ts
export { BUTTON_HIERARCHIES, BUTTON_SIZES } from './Button'
export type { ButtonHierarchy, ButtonSize } from './Button'
```

**Naming Convention**: `{COMPONENT}_{PROP}S` in SCREAMING_SNAKE_CASE (e.g., `INPUT_VARIANTS`, `BADGE_SIZES`).

### Props Design Principles
> Props 추가 판단 트리, children vs 구조화 props 기준, variant 네이밍 원칙, 컴포넌트 분류 기준 등은 [DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md)의 "A. 컴포넌트 API 설계 원칙" 참고.

### TypeScript Conventions
- Always define and export props interfaces
- Use `type` for unions, `interface` for objects
- Extend appropriate HTML element props
- Document props with JSDoc comments
- Use strict types (no `any`)

**JSDoc Standard Template**:
모든 exported props의 각 필드에 다음을 포함한다:
- 동작 설명 (해당 prop이 무엇을 제어하는지)
- `@default` (기본값이 있을 때)
- `@see` (as const 배열 참조)

```tsx
/**
 * Button component with multiple visual hierarchies and sizes
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 계층. 배경색, 텍스트 색, 상태 오버레이 동작을 결정한다.
   * @default 'primary'
   * @see BUTTON_HIERARCHIES
   */
  hierarchy?: ButtonHierarchy

  /**
   * 크기 variant. 높이, 패딩, 타이포그래피, 아이콘 크기, gap을 제어한다.
   * @default 'medium'
   * @see BUTTON_SIZES
   */
  size?: ButtonSize
}
```
### Theme Support
Components automatically adapt to themes. Semantic token CSS variables change based on the `data-theme` attribute on an ancestor element.
**No theme logic needed in components:**
```tsx
// This automatically works with both themes
<button className="bg-semantic-primary-500">
  Click me
</button>
// Don't add theme logic
const bgColor = theme === 'brand1' ? 'bg-purple-500' : 'bg-orange-500'
```
**Usage:**
```tsx
<div data-theme="brand1">
  <Button>Purple button</Button>
</div>
<div data-theme="brand2">
  <Button>Red-orange button</Button>
</div>
```
---
## Common Component Patterns
### Pattern 1: CVA + cn Structure
```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
const componentVariants = cva(
  // Base styles - always applied
  'inline-flex items-center justify-center transition-colors duration-fast ease-enter',
  {
    variants: {
      variant: {
        primary: 'bg-semantic-primary-500 hover:bg-semantic-primary-600 text-white',
        secondary: 'bg-semantic-neutral-solid-100 hover:bg-semantic-neutral-solid-200',
      },
      size: {
        small: 'p-2 gap-2 typography-14-medium',
        medium: 'p-4 gap-2 typography-16-medium',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
)
interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}
export function Component({
  variant,
  size,
  className,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```
### Pattern 2: Icon Handling

**Naming**: `iconLeading` / `iconTrailing` 사용 (`iconLeft` / `iconRight` 아님). RTL 레이아웃에서도 올바른 방향을 보장한다.

```tsx
interface ButtonProps {
  iconLeading?: React.ReactNode
  iconTrailing?: React.ReactNode
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}
// Icon size mapping from JSON spec
const iconSizes = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
}
export function Button({
  iconLeading,
  iconTrailing,
  children,
  size = 'medium'
}: ButtonProps) {
  // Check if icon-only (no children)
  const isIconOnly = !children && (iconLeading || iconTrailing)

  return (
    <button className={cn(
      'inline-flex items-center',
      isIconOnly ? iconOnlyPadding[size] : regularPadding[size]
    )}>
      {iconLeading && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {iconLeading}
        </span>
      )}
      {children && <span>{children}</span>}
      {iconTrailing && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {iconTrailing}
        </span>
      )}
    </button>
  )
}
```
### Pattern 3: Loading State
```tsx
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/Spinner' // project spinner component

interface ButtonProps {
  loading?: boolean
  iconLeading?: React.ReactNode
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}
const iconSizes = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
}
export function Button({
  loading,
  iconLeading,
  children,
  size = 'medium',
  ...props
}: ButtonProps) {
  const spinner = (
    <Spinner className={cn('animate-spin', iconSizes[size])} />
  )

  return (
    <button
      disabled={loading}
      {...props}
    >
      {loading ? spinner : iconLeading}
      {children}
    </button>
  )
}
```
### Pattern 4: Polymorphic Component (asChild)
```tsx
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function Button({ asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn('...base-classes', className)} {...props} />
}

// Usage:
<Button>Normal button</Button>
<Button asChild><a href="/home">Link styled as button</a></Button>
```
The `asChild` pattern uses `@radix-ui/react-slot` to let consumers render a different element while keeping the component's styling. When `asChild` is true, the component's props and className are merged onto the child element instead of rendering a default HTML element.

> 복합 컴포넌트(Compound Component), Context 분리, 커스텀 훅 추출, 테스트/Storybook 구조 등 고급 패턴은 [ADVANCED_PATTERNS.md](./docs/ADVANCED_PATTERNS.md) 참고.

---
## Icon System
### Icon Source
Icons are SVGs extracted from Figma. The exact extraction and component workflow is TBD. Icons are passed as `ReactNode` props (`iconLeading`, `iconTrailing`, or `icon`).

### Icon Size Guidelines
Based on component size variants from JSON specs:
| Component Size | Icon Class | Actual Size |
|----------------|------------|-------------|
| small | `w-4 h-4` | 16px |
| medium | `w-5 h-5` | 20px |
| large | `w-6 h-6` | 24px |
| xlarge | `w-7 h-7` | 28px |

### Best Practices
- Icons are passed as `ReactNode` props (`iconLeading`, `iconTrailing`)
- Component handles sizing internally based on size variant
- Use `flex-shrink-0` on icon containers to prevent squishing
---
## Component Development Checklist
Use this checklist for every component to ensure consistency and quality:
### Design Fidelity
- [ ] JSON spec created in `specs/` folder
- [ ] All Figma variants documented in spec
- [ ] All sizes match exact Figma padding/typography
- [ ] Token mapping complete (colors, spacing, typography)
- [ ] Border radius and shadows documented
### Implementation
- [ ] Component created in `src/components/{Name}/`
- [ ] CVA used for variant management
- [ ] cn (from @/lib/utils) used for class merging
- [ ] Extends appropriate React HTML element props
- [ ] All variants from JSON spec implemented
- [ ] All states implemented (hover, focus, active, disabled)
- [ ] Icon handling (if applicable) follows patterns
- [ ] Loading state (if applicable) implemented correctly
### Theme Support
- [ ] Uses only semantic tokens for colors (no primitive tokens)
- [ ] Uses only semantic tokens for motion (`duration-fast`, `ease-enter` — no `duration-100`, `ease-out`)
- [ ] Tested with `data-theme="brand1"`
- [ ] Tested with `data-theme="brand2"`
- [ ] No theme-specific logic in component code
### Accessibility
- [ ] **시맨틱 HTML**: 올바른 요소 사용 (`<button>`, `<input>`, `<dialog>` — `<div>` 아님)
- [ ] **Role 부여 판단**: 네이티브 HTML 요소로 해결 가능하면 `role` 추가 금지
- [ ] **Focus 관리**:
  - `focus-visible` 사용 (`focus` 아님) — 키보드 전용 포커스 링
  - 포커스 링 스타일 통일 (전 컴포넌트 동일)
  - 탭 순서 논리적
- [ ] **키보드 내비게이션**:
  - Enter/Space: 버튼·링크 활성화
  - Arrow keys: 그룹 내 이동 (탭, 라디오, 메뉴)
  - Escape: 오버레이 닫기
- [ ] **ARIA 속성**:
  - `aria-disabled`: 로딩 상태 (`disabled` attribute는 탭 순서에서 제거하므로 주의)
  - `aria-busy`: 로딩 상태
  - `aria-invalid` + `aria-describedby`: 폼 에러
  - `aria-expanded`: 펼침/접힘 패턴
  - `aria-label` / `aria-labelledby`: 시각적 레이블 없을 때
- [ ] **색상 대비**: WCAG AA 충족 (일반 텍스트 4.5:1, 큰 텍스트 3:1)
- [ ] **모션**: `prefers-reduced-motion` 대응 (필수 애니메이션은 `.motion-essential` 클래스 사용)
### TypeScript
- [ ] Props interface defined and exported
- [ ] JSDoc comments on all props
- [ ] Proper types (no `any`)
- [ ] Component function exported
### File Organization
- [ ] Component file: `{Name}.tsx`
- [ ] Barrel export: `index.ts`
- [ ] Both interface and component exported from index
### Testing
- [ ] All size combinations tested
- [ ] All variant combinations tested
- [ ] All states tested (hover, focus, disabled, etc.)
- [ ] Icons scale correctly with size (if applicable)
- [ ] Loading state works (if applicable)
- [ ] Works with and without optional props
- [ ] No console errors or warnings
### Code Quality
- [ ] No hardcoded values (colors, spacing, fonts, duration, easing)
- [ ] No inline styles
- [ ] No magic numbers
- [ ] No `transition-all` (use specific transition properties)
- [ ] Follows patterns from CLAUDE.md
- [ ] Consistent with existing components
---
## Project Status
### Completed
- [x] Project setup (Vite + React 19 + TypeScript)
- [x] Token system (ref, sys, numbers, typography)
- [x] Multi-theme CSS variables (Align & Edutap)
- [x] Tailwind configuration
- [x] cn() utility (clsx + tailwind-merge)
- [x] @radix-ui/react-slot for asChild pattern
- [x] JSON spec workflow defined
- [x] Development patterns documented
- [x] Motion tokens (duration, easing, CSS variables, Tailwind, reduced-motion)
### In Progress
- [ ] Button component
  - Hierarchy: primary, secondary, outlined, ghost
  - Sizes: small, medium, large, xlarge
  - States: default, hover, focus, active, disabled, loading
  - Width: fill, hug
  - Icons: left, right, both, icon-only
### Planned Components
**Phase 1: Form Inputs**
- [ ] Input (text, email, password, etc.)
- [ ] Textarea
- [ ] Checkbox
- [ ] Radio
- [ ] Select/Dropdown
- [ ] Switch/Toggle
**Phase 2: Layout & Display**
- [ ] Card
- [ ] Badge
- [ ] Avatar
- [ ] Divider
- [ ] Skeleton
**Phase 3: Feedback & Overlay**
- [ ] Modal/Dialog
- [ ] Toast/Notification
- [ ] Alert
- [ ] Tooltip
- [ ] Progress Bar
**Phase 4: Navigation**
- [ ] Tabs
- [ ] Breadcrumb
- [ ] Pagination
- [ ] Menu/Dropdown
**Phase 5: Documentation**
- [ ] Storybook setup
- [ ] Component documentation
- [ ] Token documentation
- [ ] Theme switching demo
- [ ] Usage examples
**Phase 6: Distribution**
- [ ] npm package configuration
- [ ] Build optimization
- [ ] Type definitions export
- [ ] Comprehensive README
- [ ] GitHub repository setup
---
## Troubleshooting
### Theme Not Switching
**Problem**: Components don't change color when switching themes.
**Solutions**:
- Ensure `data-theme="brand1"` or `data-theme="brand2"` is on an ancestor element
- Verify you're using `semantic-*` tokens, not `primitive-*` tokens
- Check that `src/tokens/tokens.css` is imported in `src/index.css`
- Inspect element in browser DevTools to see if CSS variables are applied
### Typography Not Applying
**Problem**: Text size or weight doesn't match Figma design.
**Solutions**:
- Use composite typography tokens: `typography-16-medium` not `text-base font-medium`
- Check `tailwind.config.js` has typography tokens in extends
- Verify the token exists in `src/tokens/typography.ts`
- Clear Tailwind cache: delete `node_modules/.vite` and restart dev server
### Colors Look Wrong
**Problem**: Colors don't match Figma or look different between themes.
**Solutions**:
- Verify you're using correct semantic token category (e.g., `text-semantic-text-on-bright-900` for dark text on light backgrounds)
- Check if you're in the correct theme context (`data-theme` attribute)
- Inspect computed CSS in DevTools to see actual color values
- Verify token mapping in JSON spec matches Figma design intent
### Icons Too Large/Small
**Problem**: Icon doesn't fit button or component size.
**Solutions**:
- Let component handle icon sizing internally (don't add w-/h- classes when passing icons)
- Check JSON spec for correct icon sizes per component size
- Verify icon container has size classes from spec (e.g., `w-5 h-5` for medium)
- Use `flex-shrink-0` on icon containers to prevent squishing
### Component Not Type-Safe
**Problem**: TypeScript errors or missing autocomplete.
**Solutions**:
- Ensure props interface extends appropriate React HTML props
- Export both interface and component from index.ts
- Use `VariantProps<typeof componentVariants>` for CVA types
- Run `npm run typecheck` to see all type errors
### Spacing Doesn't Match Figma
**Problem**: Padding, margin, or gaps are off.
**Solutions**:
- Double-check Figma values in px
- Use spacing token reference (16px = 4, 24px = 6, etc.)
- Remember Tailwind uses rem: 1 unit = 0.25rem = 4px
- Check if you're using correct spacing scale (p-4 vs px-4 py-4)
### Build Errors
**Problem**: `npm run build` fails.
**Solutions**:
- Run `npm run lint` to catch ESLint errors
- Check for unused imports
- Verify all files are properly exported
- Clear cache: `rm -rf node_modules/.vite && npm run build`
---
## Reference
### Figma Design Values
- **Primary (Align)**: Purple (#5B4FFF area)
- **Primary (Edutap)**: Red-Orange (#FF5B4F area)
- **Font Family**: Pretendard Variable
- **Base Unit**: 4px (Tailwind scale)
### Key Files
- **Tokens**: `src/tokens/`
- **Components**: `src/components/`
- **Utilities**: `src/lib/utils.ts` — `cn()` class merging utility
- **Specs**: `specs/`
- **Config**: `tailwind.config.js`
- **Styles**: `src/index.css`
### External Resources
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/docs)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [Vite Documentation](https://vitejs.dev/)
---
**Remember**: This is a design system. **Consistency and reusability** are more important than quick implementation. Always:
1. Create JSON spec first
2. Map to tokens
3. Follow established patterns
4. Test both themes
5. Complete the checklist
When in doubt, check existing components and this document.
