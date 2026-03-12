import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ChipSize } from './ChipTag'

export { CHIP_SIZES } from './ChipTag'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const CHIP_FILTER_INTENTS = ['grayscale', 'brand'] as const
export type ChipFilterIntent = (typeof CHIP_FILTER_INTENTS)[number]

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const chipSizeVariants = cva('', {
  variants: {
    size: {
      small: 'h-[var(--comp-chip-height-sm)] px-[var(--comp-chip-padding-h-sm)] gap-[var(--comp-chip-gap-sm)] typography-12-medium',
      medium: 'h-[var(--comp-chip-height-md)] px-[var(--comp-chip-padding-h-md)] gap-[var(--comp-chip-gap-md)] typography-13-medium',
      large: 'h-[var(--comp-chip-height-lg)] px-[var(--comp-chip-padding-h-lg)] gap-[var(--comp-chip-gap-lg)] typography-15-medium',
    },
  },
  defaultVariants: { size: 'medium' },
})

/* ─── Lookup maps ──────────────────────────────────────────────────────────── */

type FilterColorKey = 'off' | 'on-grayscale' | 'on-brand' | 'off-disabled' | 'on-disabled'

/** Container bg + label color — literal strings required for Tailwind JIT scanning */
const filterColorMap: Record<FilterColorKey, string> = {
  'off':          'bg-[var(--comp-chip-filter-bg-off)] text-[var(--comp-chip-filter-label-off)]',
  'on-grayscale': 'bg-[var(--comp-chip-filter-bg-on)] text-[var(--comp-chip-filter-label-on)]',
  'on-brand':     'bg-[var(--comp-chip-filter-bg-on-brand)] text-[var(--comp-chip-filter-label-on-brand)]',
  'off-disabled': 'bg-[var(--comp-chip-filter-bg-off-disabled)] text-[var(--comp-chip-filter-label-disabled)]',
  'on-disabled':  'bg-[var(--comp-chip-filter-bg-on-disabled)] text-[var(--comp-chip-filter-label-disabled)]',
}

const iconSizeMap: Record<ChipSize, string> = {
  small: 'size-[var(--comp-chip-icon-sm)]',
  medium: 'size-[var(--comp-chip-icon-md)]',
  large: 'size-[var(--comp-chip-icon-lg)]',
}

const labelPadMap: Record<ChipSize, string> = {
  small: 'px-[var(--comp-chip-label-px-sm)]',
  medium: 'px-[var(--comp-chip-label-px-md)]',
  large: 'px-[var(--comp-chip-label-px-lg)]',
}

function getColorKey(selected: boolean, intent: ChipFilterIntent, disabled: boolean): FilterColorKey {
  if (disabled) return selected ? 'on-disabled' : 'off-disabled'
  if (!selected) return 'off'
  return intent === 'brand' ? 'on-brand' : 'on-grayscale'
}

function getOverlayClasses(isOn: boolean): string {
  return isOn
    ? 'group-hover:bg-[var(--comp-chip-state-hover-on-dim)] group-active:bg-[var(--comp-chip-state-pressed-on-dim)]'
    : 'group-hover:bg-[var(--comp-chip-state-hover-on-bright)] group-active:bg-[var(--comp-chip-state-pressed-on-bright)]'
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * Filter chip — toggleable button for filtering lists.
 */
export interface ChipFilterProps
  extends Omit<VariantProps<typeof chipSizeVariants>, 'size'>,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onToggle'> {
  /** 표시할 텍스트 */
  label: string

  /** on/off 상태 */
  selected: boolean

  /** 토글 콜백 */
  onToggle: (next: boolean) => void

  /** leading icon (ReactNode). 없으면 label만 표시. */
  leadingIcon?: React.ReactNode

  /**
   * 크기 variant.
   * @default 'medium'
   * @see CHIP_SIZES
   */
  size?: ChipSize

  /**
   * 색상 의도. on 상태의 container color를 결정한다.
   * @default 'grayscale'
   * @see CHIP_FILTER_INTENTS
   */
  intent?: ChipFilterIntent

  /**
   * 비활성화.
   * @default false
   */
  disabled?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const ChipFilter = forwardRef<HTMLButtonElement, ChipFilterProps>(
  (
    { label, selected, onToggle, leadingIcon, size = 'medium', intent = 'grayscale', disabled = false, className, ...props },
    ref,
  ) => {
    const colorKey = getColorKey(selected, intent, disabled)
    const isOn = selected && !disabled

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (e) => e.preventDefault() : () => onToggle(!selected)}
        className={cn(
          'group relative inline-flex items-center rounded-full select-none outline-none transition-colors duration-fast ease-move',
          chipSizeVariants({ size }),
          filterColorMap[colorKey],
          disabled && 'cursor-not-allowed',
          'focus-visible:ring-2 focus-visible:ring-[var(--comp-chip-focus-ring)] focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {/* State overlay */}
        {!disabled && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter',
              getOverlayClasses(isOn),
            )}
          />
        )}

        {/* Leading icon */}
        {leadingIcon && (
          <span className={cn('relative flex-shrink-0 flex items-center justify-center', iconSizeMap[size])}>
            {leadingIcon}
          </span>
        )}

        {/* Label */}
        <span className={cn('relative', labelPadMap[size])}>{label}</span>
      </button>
    )
  },
)

ChipFilter.displayName = 'ChipFilter'
