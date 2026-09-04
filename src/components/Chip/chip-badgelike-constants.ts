/* ─── ChipBadgeLike shared types & maps ───────────────────────────────────── */

// 컴포넌트와 한 파일에 두면 Fast Refresh 가 전체 새로고침으로 떨어지므로
// variant 메타데이터와 스타일 맵은 컴포넌트 없는 모듈로 분리한다.

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
  xSmall: { height: 'h-[var(--comp-chip-badgelike-height-xs)]', px: 'px-[var(--comp-chip-badgelike-px-xs)]', typography: 'typography-10-medium', icon: 'size-[var(--comp-chip-badgelike-icon-xs)]', radius: 'rounded-[var(--comp-chip-badgelike-radius-xs)]' },
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
