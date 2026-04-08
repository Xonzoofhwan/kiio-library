import { forwardRef } from 'react'
import * as RadixSwitch from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SWITCH_SIZES = ['xSmall', 'small', 'medium', 'large'] as const
export const SWITCH_SHAPES = ['circular', 'square'] as const

export type SwitchSize = (typeof SWITCH_SIZES)[number]
export type SwitchShape = (typeof SWITCH_SHAPES)[number]

/* ─── Class maps ──────────────────────────────────────────────────────────── */

const trackSizeMap: Record<SwitchSize, string> = {
  xSmall: 'w-[var(--comp-switch-track-w-xs)] h-[var(--comp-switch-track-h-xs)]',
  small:  'w-[var(--comp-switch-track-w-sm)] h-[var(--comp-switch-track-h-sm)]',
  medium: 'w-[var(--comp-switch-track-w-md)] h-[var(--comp-switch-track-h-md)]',
  large:  'w-[var(--comp-switch-track-w-lg)] h-[var(--comp-switch-track-h-lg)]',
}

const trackPaddingMap: Record<SwitchShape, Record<SwitchSize, string>> = {
  circular: {
    xSmall: 'p-[var(--comp-switch-track-padding-circular-xs)]',
    small:  'p-[var(--comp-switch-track-padding-circular-sm)]',
    medium: 'p-[var(--comp-switch-track-padding-circular-md)]',
    large:  'p-[var(--comp-switch-track-padding-circular-lg)]',
  },
  square: {
    xSmall: 'p-[var(--comp-switch-track-padding-square-xs)]',
    small:  'p-[var(--comp-switch-track-padding-square-sm)]',
    medium: 'p-[var(--comp-switch-track-padding-square-md)]',
    large:  'p-[var(--comp-switch-track-padding-square-lg)]',
  },
}

const trackRadiusMap: Record<SwitchShape, string> = {
  circular: 'rounded-[var(--comp-switch-track-radius-circular)]',
  square:   'rounded-[var(--comp-switch-track-radius-square)]',
}

const placerSizeMap: Record<SwitchShape, Record<SwitchSize, string>> = {
  circular: {
    xSmall: 'size-[var(--comp-switch-placer-circular-xs)]',
    small:  'size-[var(--comp-switch-placer-circular-sm)]',
    medium: 'size-[var(--comp-switch-placer-circular-md)]',
    large:  'size-[var(--comp-switch-placer-circular-lg)]',
  },
  square: {
    xSmall: 'size-[var(--comp-switch-placer-square-xs)]',
    small:  'size-[var(--comp-switch-placer-square-sm)]',
    medium: 'size-[var(--comp-switch-placer-square-md)]',
    large:  'size-[var(--comp-switch-placer-square-lg)]',
  },
}

const placerTranslateMap: Record<SwitchShape, Record<SwitchSize, string>> = {
  circular: {
    xSmall: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-circular-xs)]',
    small:  'data-[state=checked]:translate-x-[var(--comp-switch-translate-circular-sm)]',
    medium: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-circular-md)]',
    large:  'data-[state=checked]:translate-x-[var(--comp-switch-translate-circular-lg)]',
  },
  square: {
    xSmall: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-square-xs)]',
    small:  'data-[state=checked]:translate-x-[var(--comp-switch-translate-square-sm)]',
    medium: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-square-md)]',
    large:  'data-[state=checked]:translate-x-[var(--comp-switch-translate-square-lg)]',
  },
}

/**
 * Circular knob — 3-tier size model.
 *
 * Size depends on (state, interaction) combination:
 *   - OFF + idle           → compact   (smallest)
 *   - ON  + idle           → expanded  (largest)
 *   - any + hover/active   → pressed   (intermediate, both directions converge)
 *
 * Implementation: base = compact (= OFF resting), then explicit overrides for
 * the two non-default cases:
 *   1. ON-idle → expanded (uses :not(:hover):not(:active) to exclude interaction)
 *   2. Any hover/active → pressed (simple group-hover/active applies regardless of state)
 *
 * Specificity: when ON+hover, both rule (1) and rule (2) match, but rule (1)'s
 * :not() clause excludes the hover state, so only rule (2) takes effect.
 */
const circularKnobSizeMap: Record<SwitchSize, string> = {
  xSmall: cn(
    'size-[var(--comp-switch-knob-circular-xs-compact)]',
    'group-[[data-state=checked]:not(:hover):not(:active)]:size-[var(--comp-switch-knob-circular-xs-expanded)]',
    'group-hover:size-[var(--comp-switch-knob-circular-xs-pressed)]',
    'group-active:size-[var(--comp-switch-knob-circular-xs-pressed)]',
  ),
  small: cn(
    'size-[var(--comp-switch-knob-circular-sm-compact)]',
    'group-[[data-state=checked]:not(:hover):not(:active)]:size-[var(--comp-switch-knob-circular-sm-expanded)]',
    'group-hover:size-[var(--comp-switch-knob-circular-sm-pressed)]',
    'group-active:size-[var(--comp-switch-knob-circular-sm-pressed)]',
  ),
  medium: cn(
    'size-[var(--comp-switch-knob-circular-md-compact)]',
    'group-[[data-state=checked]:not(:hover):not(:active)]:size-[var(--comp-switch-knob-circular-md-expanded)]',
    'group-hover:size-[var(--comp-switch-knob-circular-md-pressed)]',
    'group-active:size-[var(--comp-switch-knob-circular-md-pressed)]',
  ),
  large: cn(
    'size-[var(--comp-switch-knob-circular-lg-compact)]',
    'group-[[data-state=checked]:not(:hover):not(:active)]:size-[var(--comp-switch-knob-circular-lg-expanded)]',
    'group-hover:size-[var(--comp-switch-knob-circular-lg-pressed)]',
    'group-active:size-[var(--comp-switch-knob-circular-lg-pressed)]',
  ),
}

/**
 * Square knob — 2-tier size model (w = h, square aspect).
 *
 * Same squeeze metaphor as circular but simpler:
 *   - any state + idle           → default  (= placer fill)
 *   - any state + hover/active   → pressed  (−4 squeeze)
 *
 * Unlike circular, ON/OFF states share the same idle size — there is no
 * "expanded vs compact" distinction. The interaction is purely a press
 * micro-state, applied uniformly regardless of toggle state.
 */
const squareKnobSizeMap: Record<SwitchSize, string> = {
  xSmall: cn(
    'size-[var(--comp-switch-knob-square-xs-default)]',
    'group-hover:size-[var(--comp-switch-knob-square-xs-pressed)]',
    'group-active:size-[var(--comp-switch-knob-square-xs-pressed)]',
  ),
  small: cn(
    'size-[var(--comp-switch-knob-square-sm-default)]',
    'group-hover:size-[var(--comp-switch-knob-square-sm-pressed)]',
    'group-active:size-[var(--comp-switch-knob-square-sm-pressed)]',
  ),
  medium: cn(
    'size-[var(--comp-switch-knob-square-md-default)]',
    'group-hover:size-[var(--comp-switch-knob-square-md-pressed)]',
    'group-active:size-[var(--comp-switch-knob-square-md-pressed)]',
  ),
  large: cn(
    'size-[var(--comp-switch-knob-square-lg-default)]',
    'group-hover:size-[var(--comp-switch-knob-square-lg-pressed)]',
    'group-active:size-[var(--comp-switch-knob-square-lg-pressed)]',
  ),
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

type RadixRootProps = React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>

export interface SwitchProps extends Omit<RadixRootProps, 'asChild'> {
  /** Visual size.
   * @default 'medium'
   * @see {@link SWITCH_SIZES} */
  size?: SwitchSize
  /** Track and knob shape.
   * @default 'circular'
   * @see {@link SWITCH_SHAPES} */
  shape?: SwitchShape
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { size = 'medium', shape = 'circular', className, ...rest },
  ref,
) {
  const isCircular = shape === 'circular'

  return (
    <RadixSwitch.Root
      ref={ref}
      {...rest}
      className={cn(
        'group relative inline-flex items-center shrink-0 cursor-pointer select-none',
        // Track bg transition: matches thumb slide for synchronized ON/OFF feel
        'transition-colors duration-normal ease-comp-switch-toggle',
        // Track bg per state
        'data-[state=checked]:bg-[var(--comp-switch-track-on)]',
        'data-[state=unchecked]:bg-[var(--comp-switch-track-off)]',
        // Disabled
        'data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        'data-[disabled]:data-[state=checked]:bg-[var(--comp-switch-track-on-disabled)]',
        'data-[disabled]:data-[state=unchecked]:bg-[var(--comp-switch-track-off-disabled)]',
        // Strip default focus ring (we render our own)
        'outline-none',
        // Track size, padding, radius
        trackSizeMap[size],
        trackPaddingMap[shape][size],
        trackRadiusMap[shape],
        className,
      )}
    >
      {/* State overlay — hover/press tint over the track */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-colors duration-fast ease-enter',
          trackRadiusMap[shape],
          // ON: dim overlays
          'group-[[data-state=checked]:hover]:bg-[var(--comp-switch-overlay-on-hover)]',
          'group-[[data-state=checked]:active]:bg-[var(--comp-switch-overlay-on-pressed)]',
          // OFF: bright overlays
          'group-[[data-state=unchecked]:hover]:bg-[var(--comp-switch-overlay-off-hover)]',
          'group-[[data-state=unchecked]:active]:bg-[var(--comp-switch-overlay-off-pressed)]',
          // Hide overlay when disabled
          'group-data-[disabled]:hidden',
        )}
      />

      {/* Focus ring — visible on keyboard focus only */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-switch-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          trackRadiusMap[shape],
          'group-focus-visible:opacity-100',
        )}
      />

      {/* Thumb (placer) — slides Off → On via Radix data-state */}
      <RadixSwitch.Thumb
        className={cn(
          // Both shapes center the knob inside the placer (square no longer slides inset)
          'relative flex items-center justify-center',
          // Slide easing matches track bg for unified ON/OFF transition
          'transition-transform duration-normal ease-comp-switch-toggle',
          placerSizeMap[shape][size],
          placerTranslateMap[shape][size],
        )}
      >
        {/* Knob — visual layer */}
        <span
          aria-hidden
          className={cn(
            // Shape & shadow per ON/OFF
            { 'rounded-full': isCircular, 'rounded-none': !isCircular },
            'bg-[var(--comp-switch-knob)]',
            // Knob color: ON state changes hue on hover/press; OFF state stays white always.
            //   ON default → solid-0 · ON hover → solid-50 · ON press → solid-70
            //   OFF (any)  → solid-0 (no color change — only size + shadow respond)
            'group-[[data-state=checked]:hover]:bg-[var(--comp-switch-knob-hover)]',
            'group-[[data-state=checked]:active]:bg-[var(--comp-switch-knob-pressed)]',
            // Knob shadow: 3 tiers
            //   ON (any)        → 0.12 alpha (constant)
            //   OFF default     → 0.08 alpha (subtle)
            //   OFF hover/press → 0.16 alpha (emphasized — knob "lifts" as it expands)
            // Named box-shadow utilities (defined in tailwind.config.js → boxShadow extend);
            // Tailwind's `shadow-[var(...)]` mis-parses CSS-var values as shadow color,
            // so we use named entries to force correct box-shadow output.
            'shadow-comp-switch-knob-off',
            'group-[[data-state=checked]]:shadow-comp-switch-knob-on',
            'group-[[data-state=unchecked]:hover]:shadow-comp-switch-knob-off-emphasized',
            'group-[[data-state=unchecked]:active]:shadow-comp-switch-knob-off-emphasized',
            // Disabled knob: muted color, no shadow
            'group-data-[disabled]:bg-[var(--comp-switch-knob-disabled)]',
            'group-data-[disabled]:shadow-none',
            // Size per shape
            // Knob micro-states (size + color + shadow) match hover speed: 100ms / ease-out
            // Both shapes use the same squeeze metaphor; only the size map differs.
            isCircular ? circularKnobSizeMap[size] : squareKnobSizeMap[size],
            'transition-[width,height,background-color,box-shadow] duration-fast ease-enter',
          )}
        />
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  )
})
