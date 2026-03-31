import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import {
  chipBadgeLikeSizeMap, CloseIcon,
  type ChipBadgeLikeSize, type ChipBadgeLikeShape, type ChipBadgeLikeWeight,
} from './chip-badgelike-shared'

/* ─── Weight classes (error) ──────────────────────────────────────────────── */

const errorWeightClasses: Record<ChipBadgeLikeWeight, string> = {
  light: 'bg-[var(--comp-chip-badgelike-bg-error-light)] text-[var(--comp-chip-badgelike-content-error-light)]',
  heavy: 'bg-[var(--comp-chip-badgelike-bg-error-heavy)] text-[var(--comp-chip-badgelike-content-error-heavy)]',
}

/* ─── Shape radius ────────────────────────────────────────────────────────── */

const shapeRadius: Record<ChipBadgeLikeShape, string | null> = {
  basic: null,
  circular: 'rounded-full',
  square: 'rounded-none',
}

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface ChipBadgeLikeErrorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Size variant.
   * @default 'medium' */
  size?: ChipBadgeLikeSize
  /** Border-radius shape.
   * @default 'basic' */
  shape?: ChipBadgeLikeShape
  /** Color intensity — light (tinted bg) or heavy (solid bg).
   * @default 'light' */
  weight?: ChipBadgeLikeWeight
  /** When provided, shows a close (X) icon. Clicking it calls this handler. */
  onClose?: () => void
  /** Disables interaction and dims appearance.
   * @default false */
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export function ChipBadgeLikeError({
  size = 'medium',
  shape = 'basic',
  weight = 'light',
  onClose,
  disabled = false,
  children,
  className,
  ...props
}: ChipBadgeLikeErrorProps) {
  const s = chipBadgeLikeSizeMap[size]
  const radius = shapeRadius[shape] ?? s.radius

  return (
    <span
      className={cn(
        'group relative inline-flex items-center justify-center shrink-0 select-none',
        'will-change-transform [transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-out)] active:[transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-in)] active:scale-[var(--comp-chip-badgelike-scale-pressed)]',
        s.height, s.px, s.typography,
        radius,
        errorWeightClasses[weight],
        'gap-[var(--comp-chip-badgelike-gap)]',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      style={{ fontFeatureSettings: "'case' 1, 'lnum' 1, 'pnum' 1" }}
      {...props}
    >
      {/* Focus ring */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-chip-badgelike-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          radius,
          'group-focus-within:opacity-100',
        )}
      />

      {/* State overlay */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-colors duration-fast ease-enter',
          radius,
          'group-hover:bg-[var(--comp-chip-badgelike-hover)] group-active:bg-[var(--comp-chip-badgelike-pressed)]',
        )}
      />

      {/* Text */}
      <span className="relative z-[1] whitespace-nowrap">{children}</span>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onClose() }}
          disabled={disabled}
          className={cn(
            'relative z-[1] flex-shrink-0 cursor-pointer outline-none',
            s.icon,
          )}
        >
          <CloseIcon className="size-full" />
        </button>
      )}
    </span>
  )
}
