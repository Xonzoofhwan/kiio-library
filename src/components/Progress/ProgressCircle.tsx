import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const PROGRESS_CIRCLE_SIZES = ['small', 'medium', 'large'] as const
export const PROGRESS_CIRCLE_INTENTS = ['systemic', 'brand', 'success', 'warning', 'error'] as const

export type ProgressCircleSize = (typeof PROGRESS_CIRCLE_SIZES)[number]
export type ProgressCircleIntent = (typeof PROGRESS_CIRCLE_INTENTS)[number]

/* ─── Size config ──────────────────────────────────────────────────────────── */

const sizeAbbr: Record<ProgressCircleSize, string> = { small: 'sm', medium: 'md', large: 'lg' }

interface CircleSizeConfig {
  diameter: number
  strokeWidth: number
  valueTypography: string
}

/** JS-side numeric values for SVG geometry math (circumference, dashoffset). */
const sizeConfig: Record<ProgressCircleSize, CircleSizeConfig> = {
  small:  { diameter: 32, strokeWidth: 3, valueTypography: 'typography-12-semibold' },
  medium: { diameter: 48, strokeWidth: 4, valueTypography: 'typography-13-semibold' },
  large:  { diameter: 64, strokeWidth: 5, valueTypography: 'typography-16-semibold' },
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ProgressCircleProps {
  /** 0-100 진행률. undefined = indeterminate 회전. */
  value?: number
  /** 원 크기. @default 'medium' @see {@link PROGRESS_CIRCLE_SIZES} */
  size?: ProgressCircleSize
  /** 색상 계열. @default 'brand' @see {@link PROGRESS_CIRCLE_INTENTS} */
  intent?: ProgressCircleIntent
  /** 중앙 퍼센트 텍스트. @default false */
  showValue?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  (
    {
      value,
      size = 'medium',
      intent = 'brand',
      showValue = false,
      className,
    },
    ref,
  ) => {
    const isIndeterminate = value == null
    const clampedValue = isIndeterminate ? 0 : Math.min(100, Math.max(0, value))

    const abbr = sizeAbbr[size]
    const { diameter, strokeWidth, valueTypography } = sizeConfig[size]
    const radius = (diameter - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = isIndeterminate
      ? circumference * 0.25 /* 75% visible arc for spinning */
      : circumference * (1 - clampedValue / 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0',
          `w-[var(--comp-progress-circle-size-${abbr})] h-[var(--comp-progress-circle-size-${abbr})]`,
          className,
        )}
      >
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          className={cn(
            '-rotate-90',
            isIndeterminate && 'animate-progress-spin',
          )}
        >
          {/* Track circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={`stroke-[var(--comp-progress-track-${intent})]`}
          />
          {/* Fill circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              `stroke-[var(--comp-progress-fill-${intent})]`,
              !isIndeterminate && 'transition-[stroke-dashoffset] duration-normal ease-move',
            )}
          />
        </svg>

        {/* Value text */}
        {showValue && !isIndeterminate && (
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              valueTypography,
              'text-[var(--comp-progress-value)]',
            )}
          >
            {clampedValue}
          </span>
        )}
      </div>
    )
  },
)

ProgressCircle.displayName = 'ProgressCircle'
