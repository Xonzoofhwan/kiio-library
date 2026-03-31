import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import {
  CHIP_BADGELIKE_SIZES, CHIP_BADGELIKE_SHAPES, CHIP_BADGELIKE_WEIGHTS, CHIP_BADGELIKE_COLORS,
  chipBadgeLikeSizeMap, emphasizedColorMap, CloseIcon,
  type ChipBadgeLikeSize, type ChipBadgeLikeShape, type ChipBadgeLikeWeight, type ChipBadgeLikeColor,
} from './chip-badgelike-shared'

export { CHIP_BADGELIKE_COLORS }
export type { ChipBadgeLikeColor }

/* ─── Shape radius ────────────────────────────────────────────────────────── */

const shapeRadius: Record<ChipBadgeLikeShape, string | null> = {
  basic: null,
  circular: 'rounded-full',
  square: 'rounded-none',
}

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface ChipBadgeLikeEmphasizedProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Size variant.
   * @default 'medium'
   * @see {@link CHIP_BADGELIKE_SIZES} */
  size?: ChipBadgeLikeSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link CHIP_BADGELIKE_SHAPES} */
  shape?: ChipBadgeLikeShape
  /** Color intensity — light (tinted bg) or heavy (solid bg).
   * @default 'light'
   * @see {@link CHIP_BADGELIKE_WEIGHTS} */
  weight?: ChipBadgeLikeWeight
  /** Semantic emphasized color.
   * @default 'blue'
   * @see {@link CHIP_BADGELIKE_COLORS} */
  color?: ChipBadgeLikeColor
  /** When provided, shows a close (X) icon. Clicking it calls this handler. */
  onClose?: () => void
  /** Disables interaction and dims appearance.
   * @default false */
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export function ChipBadgeLikeEmphasized({
  size = 'medium',
  shape = 'basic',
  weight = 'light',
  color = 'blue',
  onClose,
  disabled = false,
  children,
  className,
  ...props
}: ChipBadgeLikeEmphasizedProps) {
  const s = chipBadgeLikeSizeMap[size]
  const radius = shapeRadius[shape] ?? s.radius
  const colorStyles = emphasizedColorMap[color][weight]

  return (
    <span
      className={cn(
        'group relative inline-flex items-center justify-center shrink-0 select-none',
        'transition-colors duration-fast ease-enter',
        s.height, s.px, s.typography,
        radius,
        colorStyles.bg, colorStyles.content,
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
