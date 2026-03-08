# Ralph Loop — Component First-Pass Implementation

> Automated prompt for building design system components from JSON specs.
> Each iteration takes one `specs/{component}.json` and produces a complete, working component with showcase integration.
>
> **Note**: This is the human-readable reference document.
> The machine-readable prompt consumed by ralph-wiggum lives at [`PROMPT.md`](../PROMPT.md) in the project root.

---

## Prerequisites

Before starting the loop, verify:

1. `specs/{component}.json` exists and follows `specs/_TEMPLATE.json` schema — if not, output:
   `ERROR: specs/{component}.json not found. Cannot proceed.` Then stop immediately.
2. `npm run build` passes (clean starting state)
3. Button component exists as the gold-standard reference implementation
4. Theme architecture reference:
   - Two independent axes: `data-theme` (brand1|brand2) for color + `data-shape` (basic|geo) for shape
   - **Basic**: Standard border-radius per spec (default — no `data-shape` attribute needed)
   - **geo**: radius 0 (sharp) or 9999px (pill) only — no intermediate radius values
   - Components reference sub-type tokens, NOT theme names:
     `--comp-{name}-radius-{size}` (default) vs `--comp-{name}-radius-icon-{size}` (icon-only)
   - `[data-shape="geo"]` in tokens.css overrides radius tokens per component

---

## Work Unit

**Input**: `specs/{component}.json`

**Output**: 7 artifacts per component

| # | Artifact | Action |
|---|----------|--------|
| 1 | `src/tokens/tokens.css` | Append `/* COMPONENT TOKENS — {Name} */` section |
| 2 | `src/components/{Name}/{Name}.tsx` | Create — CVA component |
| 3 | `src/components/{Name}/index.ts` | Create — barrel export |
| 4 | `src/showcase/{name}Registry.tsx` | Create — playground controls |
| 5 | `src/showcase/{Name}Showcase.tsx` | Create — variants/states matrix |
| 6 | `src/showcase/index.ts` | Modify — register entry |
| 7 | Git commit | `feat: add {Name} component with {N} variants` |

---

## Step-by-Step Workflow

### Step 1: Parse Spec

Read `specs/{component}.json` and extract:

- **component**: PascalCase name (e.g., `Input`, `Badge`, `Checkbox`)
- **props**: all properties with types and defaults
- **variants**: variant axes (hierarchy/variant, size, etc.) with per-value styling
- **states**: hover, pressed, focused, disabled, loading (if applicable)
- **implementation**: pattern notes, file list, dependencies

Also read `specs/_TEMPLATE.json` if any field is ambiguous.

**Conditional branches** — identify which apply to this component:

| Condition | How to detect | Impact |
|-----------|---------------|--------|
| No icons | `props.iconLeading` absent | Skip icon size map, skip icon showcase controls |
| No loading | `props.loading` absent | Skip Spinner import, skip loading showcase state |
| Input-based | `implementation.pattern` mentions `<input>` | Extend `InputHTMLAttributes` instead of `ButtonHTMLAttributes` |
| Display-only | No `states.hover`/`states.pressed` | Skip state overlay span, skip state overlay map |
| No hierarchy axis | `variants` has no `hierarchy` key | Simpler CVA, simpler disabled/state maps |

---

### Step 2: Design Component Tokens

Append a new section to `src/tokens/tokens.css` at the end of the file, before the closing comment.

**Reference**: Button tokens at the bottom of `src/tokens/tokens.css` (lines 815-887).

**Naming convention**: `--comp-{name}-{property}-{variant}[-{state}]`

**JSON spec → Token name mapping**:

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
| `states.hover.{v}` | `--comp-{name}-hover-on-dim` / `--comp-{name}-hover-on-bright` | `var(--semantic-state-...)` |
| `states.pressed.{v}` | `--comp-{name}-active-on-dim` / `--comp-{name}-active-on-bright` | `var(--semantic-state-...)` |
| `states.focused` | `--comp-{name}-focus-border` | `var(--semantic-primary-300)` |
| `states.disabled.{v}.background` | `--comp-{name}-bg-{v}-disabled` | `var(--semantic-...)` |
| `states.disabled.{v}.text` | `--comp-{name}-content-{v}-disabled` | `var(--semantic-...)` |
| `states.disabled.{v}.border` | `--comp-{name}-border-{v}-disabled` | `var(--semantic-...)` |

**Size abbreviations**: xLarge → xl, large → lg, medium → md, small → sm

**CSS output format**:
```css
/* ── COMPONENT TOKENS — {Name} ───────────────────────────────── */
:root {
  /* Background */
  --comp-{name}-bg-{variant}: var(--semantic-...);
  /* Content */
  --comp-{name}-content-{variant}: var(--semantic-...);
  /* Radius — default sub-type */
  --comp-{name}-radius-{abbr}: var(--radius-...);
  /* Radius — icon-only sub-type (if applicable) */
  --comp-{name}-radius-icon-{abbr}: var(--radius-...);
  /* ... */
}
```

Also append geo radius overrides to the `[data-shape="geo"]` block in tokens.css:
```css
[data-shape="geo"] {
  /* {Name} — default: sharp */
  --comp-{name}-radius-{abbr}: 0px;
  /* {Name} — icon-only: pill (if applicable) */
  --comp-{name}-radius-icon-{abbr}: 9999px;
}
```

---

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
   - Base classes include: group relative inline-flex items-center justify-center shrink-0 select-none transition-colors duration-fast ease-enter
   - All variant values use arbitrary CSS vars: bg-[var(--comp-{name}-bg-{v})]
4. /* --- Disabled compound --- */ (if component has disabled state)
   - Record<VariantType, string> mapping each variant to disabled class overrides
5. /* --- State overlay --- */ (if component has hover/active states)
   - Record<VariantType, string> mapping each variant to group-hover/group-active classes
6. /* --- Icon size map --- */ (if component has icons)
   - Record<SizeType, string> mapping size to CSS var icon size class
7. /* --- Spinner size map --- */ (if component has loading)
   - Record<SizeType, string> mapping size to spinner size class
8. /* --- Props --- */
   - interface extending React HTML element props + VariantProps + custom props
   - JSDoc on every prop with @default and @see
9. /* --- Component --- */
   - Exported function component
   - const Comp = asChild ? Slot : '{element}' (if asChild supported)
   - State overlay <span aria-hidden> with pointer-events-none absolute inset-0 rounded-[inherit]
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

---

### Step 4: Showcase Registry

Create `src/showcase/{name}Registry.tsx` following `src/showcase/buttonRegistry.tsx`.

**Structure**:
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
  controls: [
    // select controls for each variant axis (use as const arrays for options)
    // text controls for label/children
    // boolean controls for flags (loading, disabled, fullWidth, iconLeading, etc.)
  ],
  component: (values: ControlValues) => {
    // Cast values and render component
  },
  showcase: ComponentNameVariantsShowcase,
}
```

**Category mapping**:
- Phase 1 (Form Inputs): `'Form'`
- Phase 2 (Layout & Display): `'Layout'`
- Phase 3 (Feedback & Overlay): `'Feedback'`
- Phase 4 (Navigation): `'Navigation'`
- Button: `'Actions'`

---

### Step 5: Showcase Matrix

Create `src/showcase/{Name}Showcase.tsx` following `src/showcase/ButtonShowcase.tsx`.

**Structure**:
```tsx
import { ComponentName } from '@/components/ComponentName'
import { IconCancel } from '@/components/icons'
import { Block, Row } from './ShowcaseLayout'

// Available layout primitives from ShowcaseLayout:
// Block — titled group with optional hint
// Row — labeled row (horizontal or vertical)
// DimArea — dark background container
// StateCell — state demo with token badges
// StateRow — row of states (default, hover, active, disabled, loading)
// TokenChip — small token label
// ColorSwatch — colored dot + token name

function VariantSizeMatrix() {
  // Outer loop: primary variant axis
  // Inner loop: sizes
}

function StatesMatrix() {
  // For each variant: Default, With Icons, Disabled, Loading, Full Width
  // Adapt based on which states the component supports
}

export function {Name}VariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="{Variant} × Size" hint="...">
        <VariantSizeMatrix />
      </Block>
      <Block title="States" hint="...">
        <StatesMatrix />
      </Block>
    </div>
  )
}
```

---

### Step 6: Register

Modify `src/showcase/index.ts`:

1. Add import: `import { {name}Entry } from './{name}Registry'`
2. Add to array: `{name}Entry,` after the last entry

---

### Step 7: Build Verify

Run `npm run build` (which executes `tsc -b && vite build`).

If build fails:
1. Read the error message
2. Fix the issue (most common: missing import, type mismatch, wrong prop name)
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

---

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

---

### Step 9: Completion Signal

After successful commit, output exactly:

```
<promise>COMPLETE</promise>
```

This signals to ralph-wiggum that the component loop finished successfully.

---

## Verification Checklist

### Automated (Ralph must pass before commit)
- [ ] `npm run build` exits with code 0
- [ ] No TypeScript errors
- [ ] Every `var(--comp-{name}-*)` in CVA has a matching CSS variable in tokens.css
- [ ] All 7 artifacts exist (6 files + commit)

### Pattern Consistency (Ralph should verify)
- [ ] Variant metadata: `{COMPONENT}_{PROP}S` as const arrays exported
- [ ] Types derived from arrays: `(typeof ARRAY)[number]`
- [ ] CVA uses only `var(--comp-{name}-...)` arbitrary values (no hardcoded colors/spacing)
- [ ] Base classes include `group relative` (for state overlay)
- [ ] Motion uses `transition-colors duration-fast ease-enter` (not `transition-all`, not raw durations)
- [ ] State overlay: `<span aria-hidden>` with `pointer-events-none absolute inset-0 rounded-[inherit]`
- [ ] Focus uses `group-focus-visible` (not `group-focus`)
- [ ] Disabled: `cursor-not-allowed` + variant-specific color overrides
- [ ] Loading: `pointer-events-none` + `aria-disabled` + `aria-busy` + invisible content + absolute Spinner
- [ ] Icon containers: `flex-shrink-0` + `relative`
- [ ] JSDoc on all exported props with `@default` and `@see`
- [ ] Radius tokens include sub-type variants if component has icon-only state
- [ ] `[data-shape="geo"]` block in tokens.css includes radius overrides for this component

### Manual (Human verifies post-loop)
- [ ] `npm run dev` → http://localhost:5173
- [ ] Component appears in sidebar under correct category
- [ ] Playground controls work for all props
- [ ] States & Variants matrix displays all combinations
- [ ] Theme switch (brand1 ↔ brand2) changes colors appropriately
- [ ] Shape switch (basic ↔ geo) changes radius appropriately
- [ ] Hover/active/focus states visible on interaction

---

## Definition of Done

ALL of the following must be true:

1. **Build**: `npm run build` exits with code 0
2. **Artifacts**: All 7 artifacts exist (6 files created/modified + 1 git commit)
3. **Token integrity**: Every `var(--comp-{name}-*)` reference in component code has a matching CSS variable definition in tokens.css
4. **Showcase**: Component appears in sidebar with working playground controls
5. **Showcase matrix**: Renders all variant × size combinations and states
6. **Commit**: Git commit created with `feat:` prefix
7. **Signal**: `<promise>COMPLETE</promise>` output after commit

### Out of first-pass scope
- Storybook stories
- Unit tests
- Advanced accessibility audit (beyond basic ARIA)
- Performance optimization
- Complex interactions (compound components, Context patterns)
- Theme-specific component token overrides in `[data-theme]` blocks

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
| **Build failure (tsc)** | Read error → fix → re-run. Max 3 retries. Common causes: missing import, type mismatch, wrong prop name |
| **CSS variable mismatch** | If CVA references undefined var: add missing token to tokens.css. If tokens.css has unused token: OK for first-pass |
| **Showcase render error** | Check console for runtime errors. Common: wrong import path, mismatched prop types, missing as const |
| **JSON spec ambiguity** | Ask user before proceeding. Never guess on design intent |
| **Build failure (max retries)** | Log to `docs/ralph-errors.md` → output `<promise>BLOCKED</promise>` → stop |
| **Theme token mismatch** | Verify `[data-shape="geo"]` block has matching radius overrides for new component |
| **Spec file not found** | Output ERROR message → stop immediately (do not guess or create spec) |
| **General rule** | Never silently skip a feature described in the JSON spec. If it cannot be implemented, add `// TODO:` comment |

---

## Component Queue

Track progress with this table. Update after each component is completed.

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
| Component tokens (append here) | `src/tokens/tokens.css` (end of file) |
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
