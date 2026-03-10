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

### Git (Public Repo) Safety Rules
이 저장소는 **public**이다. 커밋/푸시 전 반드시 확인:

**커밋 전 체크리스트**:
- [ ] `npm run build` 성공 확인
- [ ] `.env`, API 키, 시크릿, 개인정보가 스테이징에 포함되지 않았는지 `git diff --cached` 로 확인
- [ ] 대용량 바이너리 파일 (이미지, 폰트, 영상 등)이 포함되지 않았는지 확인
- [ ] `git add -A` 대신 **변경된 파일만 명시적으로** `git add <파일>` 사용 권장

**커밋 메시지 컨벤션**:
- 1줄 요약 (what) + 빈 줄 + 본문 (why, 선택)
- 타입: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- 예: `feat: add Input component with 4 size variants`

**절대 금지**:
- `.env*`, `credentials.*`, `*secret*` 파일 커밋
- `node_modules/`, `dist/` 커밋 (`.gitignore`에 이미 포함)
- `--force` push (작업 손실 위험)
- `--no-verify` (훅 우회 금지)

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
| [COMPONENT_PATTERNS.md](./docs/COMPONENT_PATTERNS.md) | `docs/` | CVA+cn, Icon, Loading, asChild 코드 패턴 |
| [COMPONENT_CHECKLIST.md](./docs/COMPONENT_CHECKLIST.md) | `docs/` | 컴포넌트 개발 체크리스트 (Design, A11y, TS, Quality) |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | `docs/` | 컴포넌트 개발 트러블슈팅 가이드 |
| [ralph-loop.md](./docs/ralph-loop.md) | `docs/` | 컴포넌트 루프 참조 문서 (PROMPT.md 배경 설명) |
| [PROMPT.md](./PROMPT.md) | 루트 | ralph-wiggum 자동 인식 컴포넌트 구현 프롬프트 |

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
2. **`tokens.css`에 CSS 변수 정의** — `--comp-{name}-{property}-{variant}` 패턴.
   - **색상 토큰** (`bg`, `content`, `border`, `state`, `focus`): `[data-theme]` 스코프에 선언 (semantic 토큰 참조)
   - **크기/스페이싱 토큰** (`height`, `px`, `gap`, `icon`, `radius`): `:root`에 선언 (spacing/radius 토큰 참조)
   - ⚠️ `:root`에서 `var(--semantic-*)` 참조 금지 — var() 체인이 끊어져 값이 비어짐
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

| Tailwind | Value | Usage |
|---------|:-----:|-------|
| `duration-instant` | 0ms | Instant changes (color swap) |
| `duration-fast` | 100ms | Hover, focus micro-states |
| `duration-normal` | 200ms | Element enter/exit, dropdown open |
| `duration-slow` | 300ms | Modal, overlay enter/exit |
| `duration-slower` | 500ms | Page transitions, complex layout |
| `ease-enter` | ease-out | Enter: element appearing |
| `ease-exit` | ease-in | Exit: element disappearing |
| `ease-move` | ease-in-out | Move: position/size change |
| `ease-linear` | linear | Loop: spinner, progress bar |

> 전체 모션 토큰 값, CSS 변수, Tailwind config, Reduced motion 설정은 [token-reference.md](./docs/token-reference.md#semantic-motion) 참고.
> 모션 설계 원칙(duration/easing 선택, enter/exit 패턴, 상태 전이 모델)은 [INTERACTION_DESIGN.md §A](./docs/INTERACTION_DESIGN.md#a-motion--timing-원칙) 참고.
---
## Figma to Code Workflow
We use **structured JSON specifications** (`specs/{component-name}.json`) to translate Figma designs into components. JSON spec template: `specs/_TEMPLATE.json`. Completed example: `specs/button.json`.

> 전체 Figma→Code 워크플로(MCP 도구 사용법, 테마 매핑, 토큰 역추적, Auto-layout 변환, Spec 작성, 검증)는 [FIGMA_TO_CODE.md](./docs/FIGMA_TO_CODE.md) 참고.
> 토큰 매핑 전체 테이블(색상, 스페이싱, 타이포그래피, 모션)은 [token-reference.md](./docs/token-reference.md) 참고.
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

Two independent theme axes via data attributes on an ancestor element:

| Axis | Attribute | Values | Controls |
|------|-----------|--------|----------|
| Color | `data-theme` | `brand1`, `brand2` | Primary/success/warning/error color palette |
| Shape | `data-shape` | `basic` (default), `geo` | Border-radius (basic = standard, geo = 0 or pill only) |

**No theme logic in components** — components NEVER reference theme names (basic/geo/brand1/brand2):
```tsx
// Correct: token-only
className="bg-semantic-primary-500 rounded-[var(--comp-button-radius-md)]"

// Wrong: theme branching in component
const radius = theme === 'geo' ? 'rounded-none' : 'rounded-md'
```

**Sub-type tokens for conditional radius** (e.g., icon-only button = pill in geo):
```
--comp-{name}-radius-{size}        // default sub-type
--comp-{name}-radius-icon-{size}   // icon-only sub-type
```
Both resolve to the same value in basic. In geo, default → `0px`, icon-only → `9999px`.

**Usage:**
```tsx
<div data-theme="brand1" data-shape="basic">
  <Button>Rounded purple button</Button>
</div>
<div data-theme="brand2" data-shape="geo">
  <Button>Sharp red-orange button</Button>
</div>
```
---
## Common Component Patterns

| Pattern | Description |
|---------|-------------|
| **CVA + cn Structure** | 모든 multi-variant 컴포넌트의 기본 구조. `cva`로 variant 선언, `cn`으로 className 충돌 해결 |
| **Icon Handling** | `iconLeading`/`iconTrailing` naming (RTL-safe). size별 icon size map, `flex-shrink-0` |
| **Loading State** | Content `invisible` + absolute centered Spinner. `pointer-events-none` + `aria-disabled`/`aria-busy` |
| **Polymorphic (asChild)** | `@radix-ui/react-slot`으로 소비자가 다른 요소를 렌더링하면서 스타일 유지 |

> 코드 예시는 [COMPONENT_PATTERNS.md](./docs/COMPONENT_PATTERNS.md) 참고.
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
Use this checklist for every component to ensure consistency and quality. Categories: Design Fidelity, Implementation, Theme Support, Accessibility, TypeScript, File Organization, Testing, Code Quality.

> 전체 체크리스트는 [COMPONENT_CHECKLIST.md](./docs/COMPONENT_CHECKLIST.md) 참고.
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

> 컴포넌트 개발 트러블슈팅(테마, 타이포그래피, 색상, 아이콘, 타입, 스페이싱, 빌드)은 [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) 참고.
> Figma MCP 관련 트러블슈팅은 [FIGMA_TO_CODE.md §J](./docs/FIGMA_TO_CODE.md#j-트러블슈팅) 참고.
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
