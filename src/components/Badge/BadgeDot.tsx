import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import {
  BADGE_DOT_SIZES, BADGE_COLORS,
  type BadgeColor, type BadgeDotSize,
  dotColorMap,
} from './shared'

/* ─── Re-export variant metadata ──────────────────────────────────────────── */

export { BADGE_DOT_SIZES, BADGE_COLORS }
export type { BadgeColor, BadgeDotSize }

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface BadgeDotProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'children'> {
  /** Dot diameter in pixels.
   * @default 8
   * @see {@link BADGE_DOT_SIZES} */
  size?: BadgeDotSize
  /** Adds 1px white border for visibility on colored backgrounds.
   * @default false */
  outlined?: boolean
  /** Color theme.
   * @default 'gray'
   * @see {@link BADGE_COLORS} */
  color?: BadgeColor
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function BadgeDot({
  size = 8,
  outlined = false,
  color = 'gray',
  className,
  ...rest
}: BadgeDotProps) {
  return (
    <span
      {...rest}
      aria-hidden
      className={cn(
        'inline-block shrink-0 rounded-full',
        size === 4
          ? 'size-[var(--comp-badge-dot-size-4)]'
          : 'size-[var(--comp-badge-dot-size-8)]',
        dotColorMap[color],
        outlined && 'outline outline-1 outline-primitive-gray-0',
        className,
      )}
    />
  )
}
