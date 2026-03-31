/* ─── Chip shared types ───────────────────────────────────────────────────── */

export const CHIP_UNIVERSAL_SIZES = ['large', 'medium'] as const

export type ChipUniversalSize = (typeof CHIP_UNIVERSAL_SIZES)[number]
