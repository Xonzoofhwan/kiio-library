import { createContext, forwardRef, useContext, useMemo } from 'react'
import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'
import { RADIO_UNCHECKED_PATH, RADIO_CHECKED_PATH } from './radioIcons'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const RADIO_SIZES = ['xSmall', 'small', 'medium'] as const

export type RadioSize = (typeof RADIO_SIZES)[number]

/* ─── Class maps ──────────────────────────────────────────────────────────── */

const visualSizeMap: Record<RadioSize, string> = {
  xSmall: 'size-[var(--comp-radio-visual-xs)]',
  small:  'size-[var(--comp-radio-visual-sm)]',
  medium: 'size-[var(--comp-radio-visual-md)]',
}

/* ─── Context ─────────────────────────────────────────────────────────────── */

interface RadioGroupContextValue {
  size: RadioSize
}

const RadioGroupContext = createContext<RadioGroupContextValue>({ size: 'medium' })

/* ─── RadioGroup ──────────────────────────────────────────────────────────── */

type RadixGroupRootProps = React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>

export interface RadioGroupProps extends Omit<RadixGroupRootProps, 'asChild'> {
  /** Visual size propagated to all child Radios via context.
   * Individual <Radio> may override.
   * @default 'medium'
   * @see {@link RADIO_SIZES} */
  size?: RadioSize
}

/**
 * Container for a set of related Radio options. Wraps `@radix-ui/react-radio-group` Root —
 * provides roving tabindex, arrow-key navigation, value/onValueChange, and form integration.
 *
 * @example
 * <RadioGroup defaultValue="monthly" name="plan">
 *   <label className="flex items-center gap-3">
 *     <Radio value="monthly" /> <span>Monthly</span>
 *   </label>
 *   <label className="flex items-center gap-3">
 *     <Radio value="yearly" /> <span>Yearly</span>
 *   </label>
 * </RadioGroup>
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { size = 'medium', orientation = 'vertical', className, children, ...rest },
  ref,
) {
  // Memoize context value so consumers don't re-render on every parent update.
  const ctxValue = useMemo(() => ({ size }), [size])

  return (
    <RadioGroupContext.Provider value={ctxValue}>
      <RadixRadioGroup.Root
        ref={ref}
        orientation={orientation}
        {...rest}
        className={cn(
          'flex gap-3',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className,
        )}
      >
        {children}
      </RadixRadioGroup.Root>
    </RadioGroupContext.Provider>
  )
})

/* ─── Radio ───────────────────────────────────────────────────────────────── */

type RadixItemProps = React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>

export interface RadioProps extends Omit<RadixItemProps, 'asChild'> {
  /** Override the size set by the parent <RadioGroup>.
   * @see {@link RADIO_SIZES} */
  size?: RadioSize
}

/**
 * Single radio option built on `@radix-ui/react-radio-group` Item.
 *
 * **Visual**: a single SVG path (per state) draws the entire shape — outer
 * ring for unchecked, ring + inner dot for checked — and is filled with
 * `currentColor`. The page background shows through hollow regions via the
 * SVG winding rule, so combined with semantic theme tokens (which invert tone
 * in dark mode) this gives automatic light-on-dark and dark-on-light contrast.
 *
 * **Hit area**: the visual circle is small (16/20/24px), so the Item extends an
 * invisible 8px hit-area inset on every side via padding + negative margin
 * (matches Checkbox). The layout footprint stays equal to the visual circle,
 * so Radio aligns with adjacent atoms. **Use `gap-4` (16px) or larger** between
 * adjacent interactive atoms to prevent hit area overlap.
 *
 * Must be rendered inside a `<RadioGroup>`.
 *
 * @example
 * <RadioGroup defaultValue="a">
 *   <Radio value="a" />
 *   <Radio value="b" disabled />
 * </RadioGroup>
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { size: sizeProp, className, ...rest },
  ref,
) {
  const { size: ctxSize } = useContext(RadioGroupContext)
  const size = sizeProp ?? ctxSize

  return (
    <RadixRadioGroup.Item
      ref={ref}
      {...rest}
      className={cn(
        // Hit area: padding extends interaction; negative margin keeps layout footprint = visual size
        'group relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none',
        'p-[var(--comp-radio-inset)] -m-[var(--comp-radio-inset)]',
        'bg-transparent outline-none',
        // Foreground color cascade — SVG inherits via currentColor.
        // Default (unchecked)
        'text-[var(--comp-radio-fg)]',
        'hover:text-[var(--comp-radio-fg-hover)]',
        'active:text-[var(--comp-radio-fg-pressed)]',
        // Checked
        'data-[state=checked]:text-[var(--comp-radio-fg-checked)]',
        'data-[state=checked]:hover:text-[var(--comp-radio-fg-checked-hover)]',
        'data-[state=checked]:active:text-[var(--comp-radio-fg-checked-pressed)]',
        // Disabled
        'data-[disabled]:text-[var(--comp-radio-fg-disabled)]',
        'data-[disabled]:data-[state=checked]:text-[var(--comp-radio-fg-checked-disabled)]',
        'data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        'transition-colors duration-fast ease-enter',
        className,
      )}
    >
      {/* Visual circle — the SVG draws everything; this wrapper just sizes it and anchors the focus ring. */}
      <span aria-hidden className={cn('relative inline-flex items-center justify-center', visualSizeMap[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-full pointer-events-none"
          aria-hidden
        >
          <path
            d={RADIO_UNCHECKED_PATH}
            className="hidden group-data-[state=unchecked]:block"
          />
          <path
            d={RADIO_CHECKED_PATH}
            className="hidden group-data-[state=checked]:block"
          />
        </svg>

        {/* Focus ring — keyboard only; sits just outside the visual circle */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -inset-0.5 rounded-full',
            'border-2 border-[var(--comp-radio-focus-border)]',
            'opacity-0 transition-opacity duration-fast ease-enter',
            'group-focus-visible:opacity-100',
          )}
        />
      </span>
    </RadixRadioGroup.Item>
  )
})
