# Component Implementation Prompt

> This file is auto-detected by ralph-wiggum. Do not rename or move.
> Human-readable reference: [`docs/ralph-loop.md`](./docs/ralph-loop.md).

---

## Your Task

You are implementing a design system component from a JSON specification.
Read `specs/{component}.json` and produce all required artifacts.

---

## Prerequisites

Before starting, verify these conditions. If any fail, stop immediately.

1. `specs/{component}.json` exists — if not, output:
   `ERROR: specs/{component}.json not found. Cannot proceed.` Then stop.
2. `npm run build` passes (clean starting state).
3. Button component exists as the gold-standard reference implementation.
4. Theme architecture:
   - Two independent axes: `data-theme` (brand1|brand2) for color + `data-shape` (basic|geo) for shape
   - **Basic**: Standard border-radius per spec (default)
   - **geo**: radius 0 (sharp) or 9999px (pill) only — no intermediate radius values
   - Components NEVER reference theme names. Use sub-type tokens:
     `--comp-{name}-radius-{size}` (default) vs `--comp-{name}-radius-icon-{size}` (icon-only)
   - `[data-shape="geo"]` in tokens.css overrides radius tokens per component

---

## Rules

1. **Token-only styling** — Never hardcode colors, spacing, radius, duration, or easing. Always use `var(--comp-{name}-...)` arbitrary values in CVA.
2. **No theme awareness in components** — Components must not import, check, or branch on theme names (basic/geo/brand1/brand2). All theme differences are handled via CSS variable overrides.
3. **CVA + cn pattern** — Use `class-variance-authority` for variants. Use `cn` from `@/lib/utils` for class merging.
4. **Variant metadata** — Export `{COMPONENT}_{PROP}S` as const arrays. Derive types from arrays.
5. **State overlay** — `<span aria-hidden>` with `pointer-events-none absolute inset-0 rounded-[inherit]`.
6. **Focus** — Use `group-focus-visible` (not `group-focus`).
7. **Motion** — Use `transition-colors duration-fast ease-enter` (not `transition-all`, not raw durations).
8. **JSDoc** — Every exported prop must have `@default` and `@see`.
9. **Import paths** — Always use `@/` alias (maps to `src/`).
10. **Never skip features** — If the JSON spec describes it, implement it. If blocked, add `// TODO:` comment.

---

## Steps

### Step 1: Parse Spec

Read `specs/{component}.json` and extract:

- **component**: PascalCase name
- **props**: all properties with types and defaults
- **variants**: variant axes with per-value styling
- **states**: hover, pressed, focused, disabled, loading (if applicable)
- **implementation**: pattern notes, file list, dependencies

Also read `specs/_TEMPLATE.json` if any field is ambiguous.

Identify which conditional branches apply:

| Condition | How to detect | Impact |
|-----------|---------------|--------|
| No icons | `props.iconLeading` absent | Skip icon size map, skip icon showcase controls |
| No loading | `props.loading` absent | Skip Spinner import, skip loading showcase state |
| Input-based | `implementation.pattern` mentions `<input>` | Extend `InputHTMLAttributes` instead of `ButtonHTMLAttributes` |
| Display-only | No `states.hover`/`states.pressed` | Skip state overlay span, skip state overlay map |
| No hierarchy axis | `variants` has no `hierarchy` key | Simpler CVA, simpler disabled/state maps |
| Icon-only sub-type | Component supports icon-only rendering | Add separate radius sub-type tokens for geo |

### Step 2: Design Component Tokens

Append a new section to `src/tokens/tokens.css` before the `[data-shape="geo"]` block.

**Reference**: Button tokens in `src/tokens/tokens.css`.

**Naming convention**: `--comp-{name}-{property}-{variant}[-{state}]`

**Token mapping** (JSON spec → CSS variable):

| JSON spec path | Token pattern | Value reference |
|---------------|---------------|-----------------|
| `variants.{axis}.{v}.background` | `--comp-{name}-bg-{v}` | `var(--semantic-...)` |
| `variants.{axis}.{v}.text` | `--comp-{name}-content-{v}` | `var(--semantic-...)` |
| `variants.{axis}.{v}.border` | `--comp-{name}-border-{v}` | `var(--semantic-...)` |
| `variants.size.{s}.height` | `--comp-{name}-height-{abbr}` | `var(--spacing-...)` |
| `variants.size.{s}.paddingX` | `--comp-{name}-px-{abbr}` | `var(--spacing-...)` |
| `variants.size.{s}.gap` | `--comp-{name}-gap-{abbr}` | `var(--spacing-...)` |
| `variants.size.{s}.radius` | `--comp-{name}-radius-{abbr}` | `var(--radius-...)` |
| `variants.size.{s}.iconSize` | `--comp-{name}-icon-{abbr}` | `var(--spacing-...)` |
| `states.hover` | `--comp-{name}-hover-on-dim` / `hover-on-bright` | `var(--semantic-state-...)` |
| `states.pressed` | `--comp-{name}-active-on-dim` / `active-on-bright` | `var(--semantic-state-...)` |
| `states.focused` | `--comp-{name}-focus-border` | `var(--semantic-primary-300)` |
| `states.disabled.{v}.*` | `--comp-{name}-{prop}-{v}-disabled` | `var(--semantic-...)` |

**Size abbreviations**: xLarge → xl, large → lg, medium → md, small → sm

If the component has an icon-only sub-type, also add:
- `--comp-{name}-radius-icon-{abbr}` tokens in `:root` (same as default in basic)
- Override in `[data-shape="geo"]` block: default → `0px`, icon-only → `9999px`

Also append geo radius overrides to the existing `[data-shape="geo"]` block.

### Step 3: Implement Component

Create `src/components/{Name}/{Name}.tsx` following the exact structure of `src/components/Button/Button.tsx`.

**File structure order**:

```
1. Imports (Slot, cva, VariantProps, cn, Spinner if loading, icons)
2. /* --- Variant metadata --- */
   - as const arrays: {COMPONENT}_{PROP}S
   - Derived types: (typeof ARRAY)[number]
3. /* --- CVA --- */
   - componentVariants = cva('base classes', { variants, defaultVariants })
   - Base: group relative inline-flex items-center justify-center shrink-0 select-none transition-colors duration-fast ease-enter
   - All variant values use arbitrary CSS vars: bg-[var(--comp-{name}-bg-{v})]
   - Radius is NOT in CVA — applied conditionally in component (default vs icon-only sub-type)
4. /* --- Disabled compound --- */ (if has disabled state)
5. /* --- State overlay --- */ (if has hover/active states)
6. /* --- Radius maps --- */
   - radiusMap: default sub-type per size
   - radiusIconOnlyMap: icon-only sub-type per size (if applicable)
7. /* --- Icon size map --- */ (if has icons)
8. /* --- Spinner size map --- */ (if has loading)
9. /* --- Props --- */
   - interface extending React HTML element props + VariantProps + custom props
   - JSDoc on every prop with @default and @see
10. /* --- Component --- */
    - Detect isIconOnly = !children && (iconLeading || iconTrailing)
    - Apply radius: isIconOnly ? radiusIconOnlyMap : radiusMap
    - State overlay <span aria-hidden> with rounded-[inherit]
    - Loading: absolute centered Spinner + invisible content
    - Icon containers with flex-shrink-0 relative
```

Create `src/components/{Name}/index.ts`:
```tsx
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
export { COMPONENT_VARIANTS, COMPONENT_SIZES } from './ComponentName'
export type { ComponentVariant, ComponentSize } from './ComponentName'
```

### Step 4: Showcase Registry

Create `src/showcase/{name}Registry.tsx` following `src/showcase/buttonRegistry.tsx`.

```tsx
import { ComponentName } from '@/components/ComponentName'
import { IconCancel } from '@/components/icons'
import { ComponentNameVariantsShowcase } from './{Name}Showcase'
import type { ShowcaseItem, ControlValues } from './types'

export const {name}Entry: ShowcaseItem = {
  id: '{name}',
  name: '{Name}',
  description: '...',
  category: '{Category}',   // Actions, Form, Layout, Feedback, Navigation
  controls: [ /* select, text, boolean controls */ ],
  component: (values: ControlValues) => { /* render */ },
  showcase: ComponentNameVariantsShowcase,
}
```

**Category mapping**: Phase 1 → `'Form'`, Phase 2 → `'Layout'`, Phase 3 → `'Feedback'`, Phase 4 → `'Navigation'`

### Step 5: Showcase Matrix

Create `src/showcase/{Name}Showcase.tsx` following `src/showcase/ButtonShowcase.tsx`.

Use layout primitives from `ShowcaseLayout`: Block, Row, DimArea, StateCell, StateRow, TokenChip, ColorSwatch.

### Step 6: Register

Modify `src/showcase/index.ts`:
1. Add import: `import { {name}Entry } from './{name}Registry'`
2. Add to array: `{name}Entry,` after the last entry

### Step 7: Build Verify

Run `npm run build` (executes `tsc -b && vite build`).

If build fails:
1. Read the error message
2. Fix the issue (common: missing import, type mismatch, wrong prop name)
3. Re-run `npm run build`
4. Maximum 3 retry attempts

If all 3 retries fail:
1. Append error details to `docs/ralph-errors.md`:
   ```
   ## {Name} — Build Failure
   Date: {ISO date}
   Error: {last error message}
   Files modified: {list}
   ```
2. Output: `<promise>BLOCKED</promise>`
3. Stop immediately.

### Step 8: Commit

Stage only the specific files created or modified:

```bash
git add src/tokens/tokens.css \
        src/components/{Name}/{Name}.tsx \
        src/components/{Name}/index.ts \
        src/showcase/{name}Registry.tsx \
        src/showcase/{Name}Showcase.tsx \
        src/showcase/index.ts
```

Commit message format:
```
feat: add {Name} component with {N} {axis} variants x {M} sizes
```

### Step 9: Completion Signal

After successful commit, output exactly:

```
<promise>COMPLETE</promise>
```

---

## Verification

### Automated (Ralph must pass before commit)
- [ ] `npm run build` exits with code 0
- [ ] No TypeScript errors
- [ ] Every `var(--comp-{name}-*)` in CVA has matching CSS variable in tokens.css
- [ ] All 7 artifacts exist (6 files + commit)

### Pattern Consistency (Ralph should verify)
- [ ] Variant metadata: `{COMPONENT}_{PROP}S` as const arrays exported
- [ ] Types derived from arrays: `(typeof ARRAY)[number]`
- [ ] CVA uses only `var(--comp-{name}-...)` arbitrary values
- [ ] Base classes include `group relative`
- [ ] Motion: `transition-colors duration-fast ease-enter`
- [ ] State overlay: `<span aria-hidden>` with `pointer-events-none absolute inset-0 rounded-[inherit]`
- [ ] Focus: `group-focus-visible`
- [ ] Disabled: `cursor-not-allowed` + variant-specific color overrides
- [ ] Loading: `pointer-events-none` + `aria-disabled` + `aria-busy` + invisible content + absolute Spinner
- [ ] Icon containers: `flex-shrink-0` + `relative`
- [ ] JSDoc on all exported props with `@default` and `@see`
- [ ] Radius tokens include sub-type variants if component has icon-only state
- [ ] `[data-shape="geo"]` block includes radius overrides for this component

### Manual (Human verifies post-loop)
- [ ] Component appears in sidebar under correct category
- [ ] Playground controls work for all props
- [ ] States & Variants matrix displays all combinations
- [ ] Theme switch (brand1 ↔ brand2) changes colors
- [ ] Shape switch (basic ↔ geo) changes radius
- [ ] Hover/active/focus states visible on interaction

---

## Definition of Done

ALL of the following must be true:

1. **Build**: `npm run build` exits with code 0
2. **Artifacts**: All 7 artifacts exist (6 files created/modified + 1 git commit)
3. **Token integrity**: Every `var(--comp-{name}-*)` reference has matching CSS variable
4. **Showcase**: Component appears in sidebar with working playground controls
5. **Showcase matrix**: Renders all variant × size combinations and states
6. **Commit**: Git commit created with `feat:` prefix
7. **Signal**: `<promise>COMPLETE</promise>` output after commit

---

## Execution

### Single Component
```
/ralph-wiggum:ralph-loop "implement Input from specs/input.json" --max-iterations 10 --completion-promise "<promise>COMPLETE</promise>"
```

### Batch (Phase 1)
```
/ralph-wiggum:ralph-loop "implement all Phase 1 components sequentially: Input, Textarea, Checkbox, Radio, Select, Switch" --max-iterations 15 --completion-promise "<promise>COMPLETE</promise>"
```

### Max Iterations Guide

| Scope | Recommended | Why |
|-------|-------------|-----|
| Single simple component | 10 | Parse + tokens + component + showcase + build fix |
| Single complex component | 15 | More variants, states, edge cases |
| Batch (full phase) | 20 | Multiple components sequential |

---

## Error Handling

| Error Type | Action |
|-----------|--------|
| **Build failure (tsc)** | Read error → fix → re-run. Max 3 retries |
| **Build failure (max retries)** | Log to `docs/ralph-errors.md` → output `<promise>BLOCKED</promise>` → stop |
| **CSS variable mismatch** | If CVA references undefined var: add missing token. If unused token: OK |
| **Showcase render error** | Check console. Common: wrong import path, mismatched prop types |
| **Theme token mismatch** | Verify `[data-shape="geo"]` has matching radius overrides |
| **Spec file not found** | Output ERROR message → stop immediately (do not guess or create spec) |
| **JSON spec ambiguity** | Ask user before proceeding. Never guess on design intent |
| **General rule** | Never silently skip a feature. If blocked, add `// TODO:` comment |

---

## Component Queue

| # | Component | Phase | Spec | Tokens | .tsx | Showcase | Build | Commit | Theme Notes | Status |
|---|-----------|-------|------|--------|------|----------|-------|--------|-------------|--------|
| 1 | Button | - | OK | OK | OK | OK | OK | ✓ | icon-only: pill | **DONE** |
| 2 | Input | 1 | - | - | - | - | - | - | | QUEUE |
| 3 | Textarea | 1 | - | - | - | - | - | - | | QUEUE |
| 4 | Checkbox | 1 | - | - | - | - | - | - | | QUEUE |
| 5 | Radio | 1 | - | - | - | - | - | - | | QUEUE |
| 6 | Select | 1 | - | - | - | - | - | - | | QUEUE |
| 7 | Switch | 1 | - | - | - | - | - | - | geo: pill track | QUEUE |
| 8 | Card | 2 | - | - | - | - | - | - | geo: sharp | QUEUE |
| 9 | Badge | 2 | - | - | - | - | - | - | geo: pill | QUEUE |
| 10 | Avatar | 2 | - | - | - | - | - | - | geo: pill | QUEUE |
| 11 | Divider | 2 | - | - | - | - | - | - | | QUEUE |
| 12 | Skeleton | 2 | - | - | - | - | - | - | | QUEUE |
| 13 | Modal | 3 | - | - | - | - | - | - | geo: sharp | QUEUE |
| 14 | Toast | 3 | - | - | - | - | - | - | | QUEUE |
| 15 | Alert | 3 | - | - | - | - | - | - | | QUEUE |
| 16 | Tooltip | 3 | - | - | - | - | - | - | | QUEUE |
| 17 | Progress | 3 | - | - | - | - | - | - | geo: pill track | QUEUE |
| 18 | Tabs | 4 | - | - | - | - | - | - | | QUEUE |
| 19 | Breadcrumb | 4 | - | - | - | - | - | - | | QUEUE |
| 20 | Pagination | 4 | - | - | - | - | - | - | | QUEUE |
| 21 | Menu | 4 | - | - | - | - | - | - | geo: sharp | QUEUE |

---

## Reference File Index

| Purpose | File |
|---------|------|
| Project conventions + token rules | `CLAUDE.md` |
| JSON spec template (schema) | `specs/_TEMPLATE.json` |
| Button spec (gold standard) | `specs/button.json` |
| Component tokens (append here) | `src/tokens/tokens.css` (before `[data-shape="geo"]` block) |
| Geo shape overrides | `src/tokens/tokens.css` (`[data-shape="geo"]` block) |
| Button component (structural reference) | `src/components/Button/Button.tsx` |
| Button barrel export | `src/components/Button/index.ts` |
| Showcase type definitions | `src/showcase/types.ts` |
| Button registry (playground reference) | `src/showcase/buttonRegistry.tsx` |
| Button showcase (matrix reference) | `src/showcase/ButtonShowcase.tsx` |
| Showcase layout primitives | `src/showcase/ShowcaseLayout.tsx` |
| Showcase registry (modify to register) | `src/showcase/index.ts` |
| Utility: cn (clsx + twMerge) | `src/lib/utils.ts` |
| Available icons | `src/components/icons/` |
| Token layer placement rules | `docs/TOKEN_LAYER_RULES.md` |
| Component patterns (code examples) | `docs/COMPONENT_PATTERNS.md` |
| Component checklist | `docs/COMPONENT_CHECKLIST.md` |
| Figma workflow | `docs/FIGMA_TO_CODE.md` |
