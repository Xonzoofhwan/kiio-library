/**
 * Shared size-dependent maps for all Button intent components.
 * All 3 intents (Universal, Emphasized, Error) share identical size tokens.
 */

/* ─── Shared types ─────────────────────────────────────────────────────────── */

export type ButtonSize = 'xLarge' | 'large' | 'medium' | 'small'
export type ButtonShape = 'basic' | 'circular' | 'square'

/* ─── Size-dependent maps ──────────────────────────────────────────────────── */

/** Icon wrapper: sets width/height for layout box. */
export const iconSizeMap: Record<ButtonSize, string> = {
  xLarge: 'size-[var(--comp-button-icon-xl)]',
  large:  'size-[var(--comp-button-icon-lg)]',
  medium: 'size-[var(--comp-button-icon-md)]',
  small:  'size-[var(--comp-button-icon-sm)]',
}

/** CSS variable for icon font-size (font-based icons like Material Symbols). */
export const iconFontSizeVar: Record<ButtonSize, string> = {
  xLarge: 'var(--comp-button-icon-xl)',
  large:  'var(--comp-button-icon-lg)',
  medium: 'var(--comp-button-icon-md)',
  small:  'var(--comp-button-icon-sm)',
}

/** Spinner size — from Figma: xL/L=24px, M/S=20px. */
export const spinnerSizeMap: Record<ButtonSize, string> = {
  xLarge: 'size-6',
  large:  'size-6',
  medium: 'size-5',
  small:  'size-5',
}

export const gapMap: Record<ButtonSize, string> = {
  xLarge: 'gap-[var(--comp-button-gap-xl)]',
  large:  'gap-[var(--comp-button-gap-lg)]',
  medium: 'gap-[var(--comp-button-gap-md)]',
  small:  'gap-[var(--comp-button-gap-sm)]',
}

export const textMarginMap: Record<ButtonSize, string> = {
  xLarge: 'px-[var(--comp-button-text-mx-xl)]',
  large:  'px-[var(--comp-button-text-mx-lg)]',
  medium: 'px-[var(--comp-button-text-mx-md)]',
  small:  'px-[var(--comp-button-text-mx-sm)]',
}

/** Radius map for inner layers (state overlay / focus ring). */
export const radiusMap: Record<ButtonShape, Record<ButtonSize, string>> = {
  basic: {
    xLarge: 'rounded-[var(--comp-button-radius-xl)]',
    large:  'rounded-[var(--comp-button-radius-lg)]',
    medium: 'rounded-[var(--comp-button-radius-md)]',
    small:  'rounded-[var(--comp-button-radius-sm)]',
  },
  circular: { xLarge: 'rounded-full', large: 'rounded-full', medium: 'rounded-full', small: 'rounded-full' },
  square:   { xLarge: 'rounded-none', large: 'rounded-none', medium: 'rounded-none', small: 'rounded-none' },
}
