import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const PROGRESS_BAR_SIZES = ['small', 'medium', 'large'] as const
export const PROGRESS_BAR_INTENTS = ['systemic', 'brand', 'success', 'warning', 'error'] as const

export type ProgressBarSize = (typeof PROGRESS_BAR_SIZES)[number]
export type ProgressBarIntent = (typeof PROGRESS_BAR_INTENTS)[number]

/* ─── Size abbreviation ────────────────────────────────────────────────────── */

const sizeAbbr: Record<ProgressBarSize, string> = { small: 'sm', medium: 'md', large: 'lg' }

const labelTypography: Record<ProgressBarSize, string> = {
  small:  'typography-12-regular',
  medium: 'typography-13-regular',
  large:  'typography-14-regular',
}

/* ─── CVA — track ──────────────────────────────────────────────────────────── */

const trackVariants = cva('relative w-full overflow-hidden', {
  variants: {
    size: {
      small:  'h-[var(--comp-progress-bar-height-sm)] rounded-[var(--comp-progress-bar-radius-sm)]',
      medium: 'h-[var(--comp-progress-bar-height-md)] rounded-[var(--comp-progress-bar-radius-md)]',
      large:  'h-[var(--comp-progress-bar-height-lg)] rounded-[var(--comp-progress-bar-radius-lg)]',
    },
  },
  defaultVariants: { size: 'medium' },
})

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ProgressBarProps {
  /** 0-100 진행률. undefined = indeterminate. */
  value?: number
  /** 바 높이. @default 'medium' @see {@link PROGRESS_BAR_SIZES} */
  size?: ProgressBarSize
  /** 색상 계열. @default 'brand' @see {@link PROGRESS_BAR_INTENTS} */
  intent?: ProgressBarIntent
  /** 상단 라벨 텍스트. */
  label?: string
  /** 퍼센트 값 표시. @default false */
  showValue?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      size = 'medium',
      intent = 'brand',
      label,
      showValue = false,
      className,
    },
    ref,
  ) => {
    const isIndeterminate = value == null
    const clampedValue = isIndeterminate ? undefined : Math.min(100, Math.max(0, value))
    const abbr = sizeAbbr[size]

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {/* Label + value row */}
        {(label || showValue) && (
          <div className={cn('flex justify-between items-center mb-1.5', labelTypography[size])}>
            {label && (
              <span className="text-[var(--comp-progress-label)]">{label}</span>
            )}
            {showValue && !isIndeterminate && (
              <span className="text-[var(--comp-progress-value)] ml-auto">{clampedValue}%</span>
            )}
          </div>
        )}

        {/* Track */}
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || undefined}
          className={cn(
            trackVariants({ size }),
            `bg-[var(--comp-progress-track-${intent})]`,
          )}
        >
          {/* Fill */}
          {isIndeterminate ? (
            <div
              className={cn(
                'absolute inset-y-0 w-[40%]',
                `rounded-[var(--comp-progress-bar-radius-${abbr})]`,
                `bg-[var(--comp-progress-fill-${intent})]`,
                'animate-progress-indeterminate',
              )}
            />
          ) : (
            <div
              className={cn(
                'h-full transition-[width] duration-normal ease-move',
                `rounded-[var(--comp-progress-bar-radius-${abbr})]`,
                `bg-[var(--comp-progress-fill-${intent})]`,
              )}
              style={{ width: `${clampedValue}%` }}
            />
          )}
        </div>
      </div>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
