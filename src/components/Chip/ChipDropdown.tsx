import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BadgeCounter } from '@/components/Badge'
import type { ChipSize } from './ChipTag'

export { CHIP_SIZES } from './ChipTag'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const CHIP_DROPDOWN_INTENTS = ['grayscale', 'brand'] as const
export type ChipDropdownIntent = (typeof CHIP_DROPDOWN_INTENTS)[number]

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

type DropdownColorKey = 'off' | 'on-grayscale' | 'on-brand' | 'off-disabled' | 'on-disabled'

/** Container bg + label/chevron color — literal strings required for Tailwind JIT scanning */
const dropdownColorMap: Record<DropdownColorKey, string> = {
  'off':          'bg-[var(--comp-chip-dropdown-bg-off)] text-[var(--comp-chip-dropdown-label-off)]',
  'on-grayscale': 'bg-[var(--comp-chip-dropdown-bg-on)] text-[var(--comp-chip-dropdown-label-on)]',
  'on-brand':     'bg-[var(--comp-chip-dropdown-bg-on-brand)] text-[var(--comp-chip-dropdown-label-on-brand)]',
  'off-disabled': 'bg-[var(--comp-chip-dropdown-bg-off-disabled)] text-[var(--comp-chip-dropdown-label-disabled)]',
  'on-disabled':  'bg-[var(--comp-chip-dropdown-bg-on-disabled)] text-[var(--comp-chip-dropdown-label-disabled)]',
}

const iconSizeMap: Record<ChipSize, string> = {
  small: 'size-[var(--comp-chip-icon-sm)]',
  medium: 'size-[var(--comp-chip-icon-md)]',
  large: 'size-[var(--comp-chip-icon-lg)]',
}

const matIconSizeMap: Record<ChipSize, string> = {
  small: 'text-[length:var(--comp-chip-icon-sm)]',
  medium: 'text-[length:var(--comp-chip-icon-md)]',
  large: 'text-[length:var(--comp-chip-icon-lg)]',
}

const labelPadMap: Record<ChipSize, string> = {
  small: 'px-[var(--comp-chip-label-px-sm)]',
  medium: 'px-[var(--comp-chip-label-px-md)]',
  large: 'px-[var(--comp-chip-label-px-lg)]',
}

function getColorKey(hasSelection: boolean, intent: ChipDropdownIntent, disabled: boolean): DropdownColorKey {
  if (disabled) return hasSelection ? 'on-disabled' : 'off-disabled'
  if (!hasSelection) return 'off'
  return intent === 'brand' ? 'on-brand' : 'on-grayscale'
}

function getOverlayClasses(isOn: boolean): string {
  return isOn
    ? 'group-hover:bg-[var(--comp-chip-state-hover-on-dim)] group-active:bg-[var(--comp-chip-state-pressed-on-dim)]'
    : 'group-hover:bg-[var(--comp-chip-state-hover-on-bright)] group-active:bg-[var(--comp-chip-state-pressed-on-bright)]'
}

/* ─── Icons ────────────────────────────────────────────────────────────────── */

function MatIcon({ name, size }: { name: string; size: ChipSize }) {
  return (
    <span
      className={cn('material-symbols-outlined select-none leading-none', matIconSizeMap[size])}
      aria-hidden
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}
    >
      {name}
    </span>
  )
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * Dropdown chip — opens a menu/popover when clicked.
 */
export interface ChipDropdownProps
  extends Omit<VariantProps<typeof chipSizeVariants>, 'size'>,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** 표시할 텍스트 */
  label: string

  /** 메뉴 열림 여부 (controlled) */
  open: boolean

  /** 열림/닫힘 콜백 */
  onOpenChange: (next: boolean) => void

  /** leading icon (ReactNode). 없으면 label만 표시. */
  leadingIcon?: React.ReactNode

  /**
   * 선택된 항목 수. 0이면 off 상태(badge 숨김), 1 이상이면 on 상태(badge 표시).
   * @default 0
   */
  badgeCount?: number

  /**
   * 크기 variant.
   * @default 'medium'
   * @see CHIP_SIZES
   */
  size?: ChipSize

  /**
   * 색상 의도. on 상태의 container color를 결정한다.
   * @default 'grayscale'
   * @see CHIP_DROPDOWN_INTENTS
   */
  intent?: ChipDropdownIntent

  /**
   * 비활성화.
   * @default false
   */
  disabled?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const ChipDropdown = forwardRef<HTMLButtonElement, ChipDropdownProps>(
  (
    {
      label,
      open,
      onOpenChange,
      leadingIcon,
      badgeCount = 0,
      size = 'medium',
      intent = 'grayscale',
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const hasSelection = badgeCount > 0
    const colorKey = getColorKey(hasSelection, intent, disabled)
    const isOn = hasSelection && !disabled
    const showBadge = badgeCount > 0 && !disabled

    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (e) => e.preventDefault() : () => onOpenChange(!open)}
        className={cn(
          'group relative inline-flex items-center rounded-full select-none outline-none transition-colors duration-fast ease-move',
          chipSizeVariants({ size }),
          dropdownColorMap[colorKey],
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

        {/* Trailing chevron */}
        <span className={cn('relative flex-shrink-0 flex items-center justify-center', iconSizeMap[size])}>
          <MatIcon name="expand_more" size={size} />
        </span>

        {/* Badge — overflows top-right corner */}
        {showBadge && (
          <BadgeCounter className="absolute -top-1 -right-1 pointer-events-none" aria-hidden>
            {badgeCount > 99 ? '99+' : badgeCount}
          </BadgeCounter>
        )}
      </button>
    )
  },
)

ChipDropdown.displayName = 'ChipDropdown'
