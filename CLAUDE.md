# kiio-library
React 19 + TypeScript design system library. Provides design tokens and styled UI components built with Tailwind CSS 3, CVA, and cn (clsx + tailwind-merge). Font: Pretendard Variable.
---
## Project Vision
**Goal**: Build a production-ready design system that bridges Figma designs and React components through structured JSON specifications.
**What This Project Demonstrates**:
- Design token architecture (Figma → JSON → TypeScript → CSS → Tailwind)
- Multi-theme system
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
| [DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md) | `docs/` | **디자인 판단 기초 원칙(Meta)**, API 설계, 시각적 설계, 접근성, 디자인-코드 일관성 |
| [INTERACTION_DESIGN.md](./docs/INTERACTION_DESIGN.md) | `docs/` | 인터랙션 설계, 모션 원칙, 상태 전이, 피드백 패턴, 반응형 전략 |
| [UI_PATTERNS.md](./docs/UI_PATTERNS.md) | `docs/` | UI 패턴, 네비게이션 구조, 오버레이, 데이터 표시, 폼, 페이지 구성 |
| [FIGMA_TO_CODE.md](./docs/FIGMA_TO_CODE.md) | `docs/` | Figma→Code 실전 워크플로, MCP 도구, 토큰 매핑, 레이아웃 변환 |
| [TOKEN_LAYER_RULES.md](./docs/TOKEN_LAYER_RULES.md) | `docs/` | 토큰 레이어 배치 판단 규칙, 테마 분기 위치 결정 |
| [COMPONENT_PATTERNS.md](./docs/COMPONENT_PATTERNS.md) | `docs/` | CVA+cn, Icon, Loading, asChild 코드 패턴 |
| [COMPONENT_CHECKLIST.md](./docs/COMPONENT_CHECKLIST.md) | `docs/` | 컴포넌트 개발 체크리스트 (Design, A11y, TS, Quality) |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | `docs/` | 컴포넌트 개발 트러블슈팅 가이드 |
| [DEVIATIONS.md](./docs/DEVIATIONS.md) | `docs/` | 시스템 이탈 기록, 반복 이탈 시 수정 트리거 (원칙 8) |
| [token-reference.md](./docs/token-reference.md) | `docs/` | 토큰 전체 값, CSS 변수, Tailwind config 매핑 |
| [ROADMAP.md](./docs/ROADMAP.md) | `docs/` | 컴포넌트 개발 로드맵 (Phase 1–6) |
| [SHOWCASE_TEMPLATE.md](./docs/SHOWCASE_TEMPLATE.md) | `docs/` | 쇼케이스 페이지 작성 가이드 (레이아웃, 탭 구조, 섹션 카탈로그, 티어 시스템) |
| Skill commands | `.claude/skills/` | 4-phase 컴포넌트 개발 워크플로: `/visual-spec` → `/behavior-spec` → `/implement` → `/showcase` + `/verify` |
| Commit skill | `.claude/skills/07-commit/` | 커밋 자동화: 빌드 확인 → 보안 검사 → 작업 분리 → 커밋 생성 |
| Code review skill | `.claude/skills/08-frontend-review/` | 컴포넌트 코드 품질 리뷰: React 성능, 클린 코드, 안티패턴 검사 |

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
`src/tokens/semantic.ts` — Theme-aware semantic tokens mapped from primitive tokens. Switched via `data-theme="light"` or `data-theme="dark"` on an ancestor element.
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
**DON'T:** primitive 토큰 직접 사용, 하드코딩 값(`text-[16px]`, `bg-[#5B4FFF]`, `style={{}}`), 기본 Tailwind 타이포/모션(`text-base`, `duration-100`), `transition-all`, CVA 없이 조건 분기

> 전체 안티패턴 목록은 `/frontend-review` 스킬 참고.
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

### Design Thinking Foundation

8원칙이 모든 규칙의 상위 기준. 규칙 충돌 시 이 원칙으로 판단:
1. 고정점 우선 2. 시스템으로 판단 대체 3. 실증 지향 4. 시각 디테일은 시스템 통제
5. 전체 흐름 > 개별 화면 6. 문제 정의 > 시각물 7. 사용자 자율성 보호 8. 시스템 이탈 = 수정 신호

> 각 원칙의 정의, 적용 예시, A~D절 관계는 [DESIGN_PRINCIPLES.md §F](./docs/DESIGN_PRINCIPLES.md#f-디자인-판단의-기초-원칙-meta) 참고.

### Props Design Principles
> Props 추가 판단 트리, children vs 구조화 props 기준, variant 네이밍 원칙, 컴포넌트 분류 기준 등은 [DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md)의 "A. 컴포넌트 API 설계 원칙" 참고.

### TypeScript Conventions
- Always define and export props interfaces
- Use `type` for unions, `interface` for objects
- Extend appropriate HTML element props
- Use strict types (no `any`)
- JSDoc: 각 exported prop에 동작 설명 + `@default` + `@see {AS_CONST_ARRAY}` 포함

> JSDoc 전체 템플릿 예시는 기존 컴포넌트(`src/components/Button/Button.tsx`) 참고.
### Theme Support

Color theme via `data-theme` attribute on an ancestor element. `light`/`dark` 두 모드 지원. 컴포넌트는 시맨틱 토큰만 사용하며, 테마 이름을 직접 참조하지 않는다.

| Attribute | Values | Controls |
|-----------|--------|----------|
| `data-theme` | `light`, `dark` | Surface colors, text contrast, state overlays |

```tsx
// Correct: token-only
className="bg-semantic-primary-500 rounded-[var(--comp-button-radius-md)]"

// Wrong: theme branching in component
const color = theme === 'foo' ? 'bg-purple-500' : 'bg-red-500'
```

### Per-Component Shape

Shape(border-radius)는 글로벌 테마가 아닌 **컴포넌트별 `shape` prop**으로 제어한다.

| Shape 값 | 적용 조건 | 설명 |
|----------|----------|------|
| `default` | 모든 컴포넌트 기본값 | 사이즈별 고유 radius (토큰 기반) |
| `pill` | **고정 높이** 컨트롤만 (Button, IconButton, TextField, Badge) | 9999px — 캡슐 형태 |
| `square` | 필요한 컴포넌트만 (Button, IconButton) | 0px — 직각 모서리 |
| `circular` | 정사각 요소만 (SegmentBar) | rounded-full — 원형 |

- 가변 높이 요소(Textarea, Card, Tooltip)에는 `pill` 불가 — 높이에 따라 형태가 왜곡됨
- shape prop이 불필요한 컴포넌트(Tooltip, Callout 등)는 항상 default radius 사용
- shape 값은 컴포넌트마다 다름 — 해당 컴포넌트의 `{COMPONENT}_SHAPES` 배열 참고
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
- **아이콘 컨테이너에 `[&>*]:[font-size:inherit]` 필수** — 외부 아이콘 폰트(Material Symbols 등)의 클래스 기반 `font-size: 24px` 선언이 CSS 상속을 덮어쓰는 것을 방지. `style={{ fontSize }}` 와 함께 반드시 적용한다.
- 쇼케이스/데모 코드에서도 raw `<span class="material-symbols-sharp">` 대신 `<Icon name="..." />` 컴포넌트를 사용한다.

> 아이콘 컨테이너 구현 패턴과 코드 예시는 [COMPONENT_PATTERNS.md §Pattern 2](./docs/COMPONENT_PATTERNS.md) 참고.
---
## Component Development Checklist
Use this checklist for every component to ensure consistency and quality. Categories: Design Fidelity, Implementation, Theme Support, Accessibility, TypeScript, File Organization, Testing, Code Quality.

> 전체 체크리스트는 [COMPONENT_CHECKLIST.md](./docs/COMPONENT_CHECKLIST.md) 참고.
---
## Project Status
### Completed
- [x] Project setup (Vite + React 19 + TypeScript)
- [x] Token system (ref, sys, numbers, typography)
- [x] Multi-theme CSS variables
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
> 전체 컴포넌트 로드맵은 [ROADMAP.md](./docs/ROADMAP.md) 참고.
---
## Troubleshooting

> 컴포넌트 개발 트러블슈팅(테마, 타이포그래피, 색상, 아이콘, 타입, 스페이싱, 빌드)은 [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) 참고.
> Figma MCP 관련 트러블슈팅은 [FIGMA_TO_CODE.md §J](./docs/FIGMA_TO_CODE.md#j-트러블슈팅) 참고.
---
## Reference
### Figma Design Values
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
