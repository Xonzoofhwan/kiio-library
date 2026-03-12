import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const CHIP_SIZES = ['small', 'medium', 'large'] as const
export const CHIP_TAG_INTENTS = ['grayscale', 'error'] as const

export type ChipSize = (typeof CHIP_SIZES)[number]
export type ChipTagIntent = (typeof CHIP_TAG_INTENTS)[number]

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

/** Container bg + label color — literal strings required for Tailwind JIT scanning */
const tagColorMap: Record<'grayscale' | 'error' | 'disabled', string> = {
  grayscale: 'bg-[var(--comp-chip-tag-bg)] text-[var(--comp-chip-tag-label)]',
  error:     'bg-[var(--comp-chip-tag-bg-error)] text-[var(--comp-chip-tag-label-error)]',
  disabled:  'bg-[var(--comp-chip-tag-bg-disabled)] text-[var(--comp-chip-tag-label-disabled)]',
}

const tagRemoveColorMap: Record<'grayscale' | 'error' | 'disabled', string> = {
  grayscale: 'text-[var(--comp-chip-tag-remove)]',
  error:     'text-[var(--comp-chip-tag-remove-error)]',
  disabled:  'text-[var(--comp-chip-tag-remove-disabled)]',
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
 * Tag chip — displays a value with a remove button.
 */
export interface ChipTagProps
  extends Omit<VariantProps<typeof chipSizeVariants>, 'size'>,
    React.HTMLAttributes<HTMLDivElement> {
  /** 표시할 텍스트 */
  label: string

  /**
   * 제거 콜백. 호출 시 chip이 사라진다.
   */
  onRemove: () => void

  /**
   * 크기 variant. 높이, 패딩, gap, 타이포그래피, 아이콘 크기를 제어한다.
   * @default 'medium'
   * @see CHIP_SIZES
   */
  size?: ChipSize

  /**
   * 색상 의도.
   * @default 'grayscale'
   * @see CHIP_TAG_INTENTS
   */
  intent?: ChipTagIntent

  /**
   * 비활성화. remove 클릭을 차단한다.
   * @default false
   */
  disabled?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const ChipTag = forwardRef<HTMLDivElement, ChipTagProps>(
  ({ label, onRemove, size = 'medium', intent = 'grayscale', disabled = false, className, ...props }, ref) => {
    const colorKey = disabled ? 'disabled' : intent

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'group relative inline-flex items-center rounded-full select-none transition-colors duration-fast ease-move',
          chipSizeVariants({ size }),
          tagColorMap[colorKey],
          disabled && 'cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {/* State overlay — always on-bright (Tag has no "on" state) */}
        {!disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter group-hover:bg-[var(--comp-chip-state-hover-on-bright)] group-active:bg-[var(--comp-chip-state-pressed-on-bright)]"
          />
        )}

        {/* Label */}
        <span className={cn('relative', labelPadMap[size])}>{label}</span>

        {/* Remove button */}
        <button
          type="button"
          aria-label={`${label} 제거`}
          aria-disabled={disabled || undefined}
          onClick={disabled ? (e) => e.preventDefault() : onRemove}
          className={cn(
            'relative flex-shrink-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-chip-focus-ring)] focus-visible:ring-offset-1 rounded-full',
            iconSizeMap[size],
            tagRemoveColorMap[colorKey],
            disabled && 'cursor-not-allowed pointer-events-none',
          )}
          tabIndex={disabled ? -1 : undefined}
        >
          <MatIcon name="close" size={size} />
        </button>
      </div>
    )
  },
)

ChipTag.displayName = 'ChipTag'
