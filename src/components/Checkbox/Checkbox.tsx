import { forwardRef } from 'react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'
import {
  CHECKBOX_BOX_EMPTY_PATH,
  CHECKBOX_BOX_CHECKED_PATH,
  CHECKBOX_BOX_INDETERMINATE_PATH,
  CHECKBOX_LINE_CHECK_PATH,
} from './checkboxIcons'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const CHECKBOX_SIZES = ['xSmall', 'small', 'medium'] as const
export const CHECKBOX_VARIANTS = ['box', 'line'] as const

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number]
export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number]

/* ─── Class maps ──────────────────────────────────────────────────────────── */

const visualSizeMap: Record<CheckboxSize, string> = {
  xSmall: 'size-[var(--comp-checkbox-visual-xs)]',
  small:  'size-[var(--comp-checkbox-visual-sm)]',
  medium: 'size-[var(--comp-checkbox-visual-md)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

type RadixRootProps = React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>

export interface CheckboxProps extends Omit<RadixRootProps, 'asChild'> {
  /** Visual size — the size of the visible square. Layout footprint matches this value;
   * the hit area extends 8px beyond on every side via padding + negative margin.
   * @default 'medium'
   * @see {@link CHECKBOX_SIZES} */
  size?: CheckboxSize
  /** Visual treatment.
   * - `box` — bordered square that fills when checked, with the checkmark drawn as a hole.
   * - `line` — no box, only the standalone check glyph appears when checked.
   *
   * @default 'box'
   * @see {@link CHECKBOX_VARIANTS} */
  variant?: CheckboxVariant
}

/* ─── Component ────────────────────────────────────────────────────────────── */

/**
 * Boolean (or tri-state) selection control built on `@radix-ui/react-checkbox`.
 *
 * **Visual**: a single SVG path draws the entire checkbox shape — outer square
 * outline AND inner check/dash glyph — and is filled with `currentColor`. The
 * inner glyph is rendered as a hole via SVG fill-rule, so the page background
 * shows through it. Combined with semantic tokens that invert tone in dark
 * mode, this gives automatic light-on-dark and dark-on-light contrast.
 *
 * **Hit area**: the visual square is small (16/20/24px), so the Root extends an
 * invisible 8px hit-area inset on every side. The layout footprint stays equal
 * to the visual square (achieved with negative margin compensation), so
 * Checkbox aligns visually with adjacent atoms. When placing Checkbox next to
 * other interactive atoms, **use `gap-4` (16px) or larger** to prevent hit
 * area overlap.
 *
 * **Indeterminate**: pass `checked="indeterminate"` for tri-state (e.g. parent
 * of partial selection).
 *
 * @example
 * <Checkbox defaultChecked />
 * <Checkbox variant="line" size="small" />
 * <Checkbox checked="indeterminate" onCheckedChange={...} />
 *
 * <label htmlFor="agree" className="flex items-center gap-3">
 *   <Checkbox id="agree" />
 *   <span>I agree to the terms</span>
 * </label>
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { size = 'medium', variant = 'box', className, ...rest },
  ref,
) {
  const isBox = variant === 'box'

  return (
    <RadixCheckbox.Root
      ref={ref}
      {...rest}
      className={cn(
        // Hit area: padding extends interaction; negative margin keeps layout footprint = visual size
        'group relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none',
        'p-[var(--comp-checkbox-inset)] -m-[var(--comp-checkbox-inset)]',
        'bg-transparent outline-none',
        // Foreground color cascade — SVG inherits via currentColor.
        // Default (unchecked)
        'text-[var(--comp-checkbox-fg)]',
        'hover:text-[var(--comp-checkbox-fg-hover)]',
        'active:text-[var(--comp-checkbox-fg-pressed)]',
        // Checked / indeterminate
        'data-[state=checked]:text-[var(--comp-checkbox-fg-checked)]',
        'data-[state=indeterminate]:text-[var(--comp-checkbox-fg-checked)]',
        'data-[state=checked]:hover:text-[var(--comp-checkbox-fg-checked-hover)]',
        'data-[state=indeterminate]:hover:text-[var(--comp-checkbox-fg-checked-hover)]',
        'data-[state=checked]:active:text-[var(--comp-checkbox-fg-checked-pressed)]',
        'data-[state=indeterminate]:active:text-[var(--comp-checkbox-fg-checked-pressed)]',
        // Disabled
        'data-[disabled]:text-[var(--comp-checkbox-fg-disabled)]',
        'data-[disabled]:data-[state=checked]:text-[var(--comp-checkbox-fg-checked-disabled)]',
        'data-[disabled]:data-[state=indeterminate]:text-[var(--comp-checkbox-fg-checked-disabled)]',
        'data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        'transition-colors duration-fast ease-enter',
        className,
      )}
    >
      {/* Visual square — the SVG draws everything; this wrapper just sizes it and anchors the focus ring. */}
      <span aria-hidden className={cn('relative inline-flex items-center justify-center', visualSizeMap[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-full pointer-events-none"
          aria-hidden
        >
          {isBox ? (
            <>
              <path
                d={CHECKBOX_BOX_EMPTY_PATH}
                className="hidden group-data-[state=unchecked]:block"
              />
              <path
                d={CHECKBOX_BOX_CHECKED_PATH}
                className="hidden group-data-[state=checked]:block"
              />
              <path
                d={CHECKBOX_BOX_INDETERMINATE_PATH}
                className="hidden group-data-[state=indeterminate]:block"
              />
            </>
          ) : (
            <>
              {/* Line variant has no unchecked glyph; the standalone check appears for both checked and indeterminate */}
              <path
                d={CHECKBOX_LINE_CHECK_PATH}
                className="hidden group-data-[state=checked]:block group-data-[state=indeterminate]:block"
              />
            </>
          )}
        </svg>

        {/* Focus ring — keyboard only; sits just outside the visual square */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -inset-0.5 rounded-[2px]',
            'border-2 border-[var(--comp-checkbox-focus-border)]',
            'opacity-0 transition-opacity duration-fast ease-enter',
            'group-focus-visible:opacity-100',
          )}
        />
      </span>
    </RadixCheckbox.Root>
  )
})
