import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  BADGE_SIZES, BADGE_SHAPES, BADGE_WEIGHTS, BADGE_COLORS,
  type BadgeColor, type BadgeWeight,
  labelColorMap,
} from './shared'

/* ─── Re-export variant metadata ──────────────────────────────────────────── */

export { BADGE_SIZES, BADGE_SHAPES, BADGE_WEIGHTS, BADGE_COLORS }
export type { BadgeColor, BadgeWeight }
export type BadgeLabelSize = (typeof BADGE_SIZES)[number]
export type BadgeLabelShape = (typeof BADGE_SHAPES)[number]

/* ─── CVA (size × shape — colors handled via colorMap) ────────────────────── */

const badgeLabelVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap select-none',
  {
    variants: {
      size: {
        nano:   'h-[var(--comp-badge-height-nano)] px-[var(--comp-badge-px-nano)] min-w-[var(--comp-badge-min-w-nano)] text-[10px] leading-[12px] font-medium text-center',
        xSmall: 'h-[var(--comp-badge-height-xs)] px-[var(--comp-badge-px-xs)] min-w-[var(--comp-badge-min-w-xs)] text-[10px] leading-[12px] font-medium text-center',
        small:  'px-[var(--comp-badge-px-sm)] py-[var(--comp-badge-py)] min-w-[var(--comp-badge-min-w-sm)] typography-12-medium',
        medium: 'px-[var(--comp-badge-px-md)] py-[var(--comp-badge-py)] min-w-[var(--comp-badge-min-w-md)] typography-14-medium',
        large:  'px-[var(--comp-badge-px-lg)] py-[var(--comp-badge-py)] min-w-[var(--comp-badge-min-w-lg)] typography-15-medium',
      },
      shape: {
        basic:    '',
        circular: 'rounded-full',
        square:   'rounded-none',
      },
    },
    compoundVariants: [
      /* basic shape: size-dependent radius */
      { shape: 'basic', size: 'nano',   className: 'rounded-[var(--comp-badge-radius-nano)]' },
      { shape: 'basic', size: 'xSmall', className: 'rounded-[var(--comp-badge-radius-xs)]' },
      { shape: 'basic', size: 'small',  className: 'rounded-[var(--comp-badge-radius-sm)]' },
      { shape: 'basic', size: 'medium', className: 'rounded-[var(--comp-badge-radius-md)]' },
      { shape: 'basic', size: 'large',  className: 'rounded-[var(--comp-badge-radius-lg)]' },

      /* circular shape: larger horizontal padding */
      { shape: 'circular', size: 'nano',   className: 'px-[var(--comp-badge-px-circular-nano)]' },
      { shape: 'circular', size: 'xSmall', className: 'px-[var(--comp-badge-px-circular-xs)]' },
      { shape: 'circular', size: 'small',  className: 'px-[var(--comp-badge-px-circular-sm)]' },
      { shape: 'circular', size: 'medium', className: 'px-[var(--comp-badge-px-circular-md)]' },
      { shape: 'circular', size: 'large',  className: 'px-[var(--comp-badge-px-circular-lg)]' },
    ],
    defaultVariants: {
      size: 'small',
      shape: 'basic',
    },
  },
)

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface BadgeLabelProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeLabelVariants> {
  /** Label text content. */
  children: ReactNode
  /** Size variant. `nano` is counter-only (numbers only).
   * @default 'small'
   * @see {@link BADGE_SIZES} */
  size?: BadgeLabelSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BADGE_SHAPES} */
  shape?: BadgeLabelShape
  /** Color intensity — light (tinted bg) or heavy (solid bg).
   * @default 'light'
   * @see {@link BADGE_WEIGHTS} */
  weight?: BadgeWeight
  /** Color theme.
   * @default 'gray'
   * @see {@link BADGE_COLORS} */
  color?: BadgeColor
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function BadgeLabel({
  size = 'small',
  shape = 'basic',
  weight = 'light',
  color = 'gray',
  className,
  children,
  ...rest
}: BadgeLabelProps) {
  const colorStyles = labelColorMap[color][weight]

  return (
    <span
      {...rest}
      className={cn(
        badgeLabelVariants({ size, shape }),
        colorStyles.bg,
        colorStyles.content,
        className,
      )}
      style={{
        fontFeatureSettings: "'case' 1, 'lnum' 1, 'pnum' 1",
        ...rest.style,
      }}
    >
      {children}
    </span>
  )
}
