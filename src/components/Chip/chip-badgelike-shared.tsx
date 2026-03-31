/* ─── ChipBadgeLike shared types & maps ───────────────────────────────────── */

export const CHIP_BADGELIKE_SIZES = ['large', 'medium', 'small', 'xSmall'] as const
export const CHIP_BADGELIKE_SHAPES = ['basic', 'circular', 'square'] as const
export const CHIP_BADGELIKE_WEIGHTS = ['light', 'heavy'] as const
export const CHIP_BADGELIKE_COLORS = ['purple', 'blue', 'orange'] as const

export type ChipBadgeLikeSize = (typeof CHIP_BADGELIKE_SIZES)[number]
export type ChipBadgeLikeShape = (typeof CHIP_BADGELIKE_SHAPES)[number]
export type ChipBadgeLikeWeight = (typeof CHIP_BADGELIKE_WEIGHTS)[number]
export type ChipBadgeLikeColor = (typeof CHIP_BADGELIKE_COLORS)[number]

/* ─── Size map ────────────────────────────────────────────────────────────── */

export const chipBadgeLikeSizeMap: Record<
  ChipBadgeLikeSize,
  { height: string; px: string; typography: string; icon: string; radius: string }
> = {
  large:  { height: 'h-[var(--comp-chip-badgelike-height-lg)]', px: 'px-[var(--comp-chip-badgelike-px-lg)]', typography: 'typography-15-medium', icon: 'size-[var(--comp-chip-badgelike-icon-lg)]',  radius: 'rounded-[var(--comp-chip-badgelike-radius-lg)]' },
  medium: { height: 'h-[var(--comp-chip-badgelike-height-md)]', px: 'px-[var(--comp-chip-badgelike-px-md)]', typography: 'typography-14-medium', icon: 'size-[var(--comp-chip-badgelike-icon-md)]',  radius: 'rounded-[var(--comp-chip-badgelike-radius-md)]' },
  small:  { height: 'h-[var(--comp-chip-badgelike-height-sm)]', px: 'px-[var(--comp-chip-badgelike-px-sm)]', typography: 'typography-12-medium', icon: 'size-[var(--comp-chip-badgelike-icon-sm)]',  radius: 'rounded-[var(--comp-chip-badgelike-radius-sm)]' },
  xSmall: { height: 'h-[var(--comp-chip-badgelike-height-xs)]', px: 'px-[var(--comp-chip-badgelike-px-xs)]', typography: 'text-[10px] leading-[12px] font-medium', icon: 'size-[var(--comp-chip-badgelike-icon-xs)]', radius: 'rounded-[var(--comp-chip-badgelike-radius-xs)]' },
}

/* ─── Emphasized color map (component tokens) ─────────────────────────────── */

type ColorWeightStyles = { bg: string; content: string }

export const emphasizedColorMap: Record<ChipBadgeLikeColor, Record<ChipBadgeLikeWeight, ColorWeightStyles>> = {
  purple: {
    light: { bg: 'bg-[var(--comp-chip-badgelike-bg-purple-light)]', content: 'text-[var(--comp-chip-badgelike-content-purple-light)]' },
    heavy: { bg: 'bg-[var(--comp-chip-badgelike-bg-purple-heavy)]', content: 'text-[var(--comp-chip-badgelike-content-purple-heavy)]' },
  },
  blue: {
    light: { bg: 'bg-[var(--comp-chip-badgelike-bg-blue-light)]', content: 'text-[var(--comp-chip-badgelike-content-blue-light)]' },
    heavy: { bg: 'bg-[var(--comp-chip-badgelike-bg-blue-heavy)]', content: 'text-[var(--comp-chip-badgelike-content-blue-heavy)]' },
  },
  orange: {
    light: { bg: 'bg-[var(--comp-chip-badgelike-bg-orange-light)]', content: 'text-[var(--comp-chip-badgelike-content-orange-light)]' },
    heavy: { bg: 'bg-[var(--comp-chip-badgelike-bg-orange-heavy)]', content: 'text-[var(--comp-chip-badgelike-content-orange-heavy)]' },
  },
}

/* ─── CloseIcon SVG ───────────────────────────────────────────────────────── */

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
