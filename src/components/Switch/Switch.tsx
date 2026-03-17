import { forwardRef } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SWITCH_SIZES = ['small', 'medium', 'large', 'xLarge'] as const
export type SwitchSize = (typeof SWITCH_SIZES)[number]

/* ─── CVA: Track (Root) ────────────────────────────────────────────────────── */

const switchVariants = cva(
  'group relative inline-flex shrink-0 items-center rounded-full overflow-hidden outline-none cursor-pointer transition-colors duration-fast ease-enter',
  {
    variants: {
      size: {
        small:  'h-[var(--comp-switch-track-h-sm)] w-[var(--comp-switch-track-w-sm)] p-[var(--comp-switch-padding-sm)]',
        medium: 'h-[var(--comp-switch-track-h-md)] w-[var(--comp-switch-track-w-md)] p-[var(--comp-switch-padding-md)]',
        large:  'h-[var(--comp-switch-track-h-lg)] w-[var(--comp-switch-track-w-lg)] p-[var(--comp-switch-padding-lg)]',
        xLarge: 'h-[var(--comp-switch-track-h-xl)] w-[var(--comp-switch-track-w-xl)] p-[var(--comp-switch-padding-xl)]',
      },
    },
    defaultVariants: { size: 'medium' },
  },
)

/* ─── CVA: Thumb container (fixed size = checked thumb, handles translate) ── */

const thumbVariants = cva(
  'relative flex items-center justify-center transition-transform duration-fast ease-enter',
  {
    variants: {
      size: {
        small:  'size-[var(--comp-switch-thumb-on-sm)] data-[state=checked]:translate-x-[var(--comp-switch-translate-sm)]',
        medium: 'size-[var(--comp-switch-thumb-on-md)] data-[state=checked]:translate-x-[var(--comp-switch-translate-md)]',
        large:  'size-[var(--comp-switch-thumb-on-lg)] data-[state=checked]:translate-x-[var(--comp-switch-translate-lg)]',
        xLarge: 'size-[var(--comp-switch-thumb-on-xl)] data-[state=checked]:translate-x-[var(--comp-switch-translate-xl)]',
      },
    },
    defaultVariants: { size: 'medium' },
  },
)

/* ─── CVA: Thumb circle (visual dot, 3-stage size change) ──────────────────── */

const thumbCircleVariants = cva(
  'block rounded-full shadow-sm transition-[width,height] duration-fast ease-enter',
  {
    variants: {
      size: {
        small:  'group-data-[state=unchecked]:size-[var(--comp-switch-thumb-off-sm)] group-data-[state=checked]:size-[var(--comp-switch-thumb-on-sm)]',
        medium: 'group-data-[state=unchecked]:size-[var(--comp-switch-thumb-off-md)] group-data-[state=checked]:size-[var(--comp-switch-thumb-on-md)]',
        large:  'group-data-[state=unchecked]:size-[var(--comp-switch-thumb-off-lg)] group-data-[state=checked]:size-[var(--comp-switch-thumb-on-lg)]',
        xLarge: 'group-data-[state=unchecked]:size-[var(--comp-switch-thumb-off-xl)] group-data-[state=checked]:size-[var(--comp-switch-thumb-on-xl)]',
      },
    },
    defaultVariants: { size: 'medium' },
  },
)

/* ─── Thumb circle hover (applied only when !disabled) ─────────────────────── */

const thumbCircleHoverMap: Record<SwitchSize, string> = {
  small:  'group-hover:group-data-[state=unchecked]:size-[var(--comp-switch-thumb-hover-sm)]',
  medium: 'group-hover:group-data-[state=unchecked]:size-[var(--comp-switch-thumb-hover-md)]',
  large:  'group-hover:group-data-[state=unchecked]:size-[var(--comp-switch-thumb-hover-lg)]',
  xLarge: 'group-hover:group-data-[state=unchecked]:size-[var(--comp-switch-thumb-hover-xl)]',
}

/* ─── Touch target expansion for small sizes ───────────────────────────────── */

const touchTargetMap: Partial<Record<SwitchSize, string>> = {
  small:  'after:absolute after:inset-[-4px] after:content-[""]',
  medium: 'after:absolute after:inset-[-4px] after:content-[""]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * Toggle control for binary on/off states.
 * Wraps Radix Switch for accessibility (role=switch, aria-checked, keyboard).
 */
export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'children'> {
  /**
   * 사이즈 variant. 트랙 크기와 thumb 사이즈를 제어한다.
   * @default 'medium'
   * @see SWITCH_SIZES
   */
  size?: SwitchSize
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size = 'medium', disabled = false, className, ...props }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        disabled={disabled}
        className={cn(
          switchVariants({ size }),
          /* Track bg — unchecked / checked */
          'data-[state=unchecked]:bg-[var(--comp-switch-bg-off)]',
          'data-[state=checked]:bg-[var(--comp-switch-bg-on)]',
          /* Disabled track bg */
          'data-[disabled]:data-[state=unchecked]:bg-[var(--comp-switch-bg-off-disabled)]',
          'data-[disabled]:data-[state=checked]:bg-[var(--comp-switch-bg-on-disabled)]',
          /* Disabled cursor */
          'data-[disabled]:cursor-not-allowed',
          /* Focus ring (keyboard only) */
          'focus-visible:ring-2 focus-visible:ring-[var(--comp-switch-focus-ring)] focus-visible:ring-offset-2',
          /* Touch target expansion */
          touchTargetMap[size],
          className,
        )}
        {...props}
      >
        {/* State overlay */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
            !disabled && [
              'group-data-[state=unchecked]:group-hover:bg-[var(--comp-switch-hover-on-bright)]',
              'group-data-[state=unchecked]:group-active:bg-[var(--comp-switch-active-on-bright)]',
              'group-data-[state=checked]:group-hover:bg-[var(--comp-switch-hover-on-dim)]',
              'group-data-[state=checked]:group-active:bg-[var(--comp-switch-active-on-dim)]',
            ],
          )}
        />

        {/* Thumb container + visual circle */}
        <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }))}>
          <span
            className={cn(
              thumbCircleVariants({ size }),
              !disabled && thumbCircleHoverMap[size],
              'group-data-[state=unchecked]:bg-[var(--comp-switch-thumb-off)]',
              'group-data-[state=checked]:bg-[var(--comp-switch-thumb)]',
              disabled && 'bg-[var(--comp-switch-thumb-disabled)]',
            )}
          />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    )
  },
)
Switch.displayName = 'Switch'
