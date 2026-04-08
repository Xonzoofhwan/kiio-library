/**
 * Checkbox SVG path data — 24×24 viewBox, designed to be filled with `currentColor`.
 *
 * Each box variant path draws **both** the outer square and the inner glyph
 * (check / dash) as a single path. The inner glyph is expressed as a hole via
 * the SVG fill-rule, so when the path is filled the glyph appears as the
 * background showing through. Combined with semantic theme tokens (which
 * invert tone in dark mode), this gives automatic light-on-dark and
 * dark-on-light contrast without any extra layers.
 */

/** □ Empty box — outer square outline only. */
export const CHECKBOX_BOX_EMPTY_PATH =
  'M3 21V3H21V21H3ZM5 19H19V5H5V19Z'

/** ☑ Checked box — filled square with checkmark hole. */
export const CHECKBOX_BOX_CHECKED_PATH =
  'M10.6 16.2L17.65 9.15L16.25 7.75L10.6 13.4L7.75 10.55L6.35 11.95L10.6 16.2ZM3 21V3H21V21H3Z'

/** ⊟ Indeterminate box — filled square with horizontal-dash hole. */
export const CHECKBOX_BOX_INDETERMINATE_PATH =
  'M7 13H17V11H7V13ZM3 21V3H21V21H3Z'

/** ✓ Standalone checkmark — used by the `line` variant when checked. */
export const CHECKBOX_LINE_CHECK_PATH =
  'M9.55 18L3.85 12.3L5.275 10.875L9.55 15.15L18.725 5.97498L20.15 7.39998L9.55 18Z'
