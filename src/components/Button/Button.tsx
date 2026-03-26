import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import {
  iconSizeMap, iconFontSizeVar, spinnerSizeMap,
  gapMap, textMarginMap, radiusMap,
  type ButtonSize, type ButtonShape,
} from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BUTTON_HIERARCHIES = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const BUTTON_SHAPES = ['basic', 'circular', 'square'] as const

export type ButtonHierarchy = (typeof BUTTON_HIERARCHIES)[number]
export type { ButtonSize, ButtonShape }

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center overflow-hidden cursor-pointer',
  {
    variants: {
      hierarchy: {
        primary:   'bg-[var(--comp-button-bg-primary)]   text-[var(--comp-button-content-primary)]',
        secondary: 'bg-[var(--comp-button-bg-secondary)] text-[var(--comp-button-content-secondary)]',
        outlined:  'bg-[var(--comp-button-bg-outlined)]  text-[var(--comp-button-content-outlined)]  border border-[var(--comp-button-border-outlined)]',
        ghost:     'bg-[var(--comp-button-bg-ghost)]     text-[var(--comp-button-content-ghost)]',
      },
      size: {
        xLarge: 'h-[var(--comp-button-height-xl)] px-[var(--comp-button-px-xl)] typography-18-semibold',
        large:  'h-[var(--comp-button-height-lg)] px-[var(--comp-button-px-lg)] typography-16-semibold',
        medium: 'h-[var(--comp-button-height-md)] px-[var(--comp-button-px-md)] typography-14-semibold',
        small:  'h-[var(--comp-button-height-sm)] px-[var(--comp-button-px-sm)] typography-12-semibold',
      },
      shape: {
        basic:    '',
        circular: 'rounded-full',
        square:   'rounded-none',
      },
      fullWidth: {
        true:  'w-full',
        false: 'w-auto',
      },
    },
    compoundVariants: [
      { shape: 'basic', size: 'xLarge', className: 'rounded-[var(--comp-button-radius-xl)]' },
      { shape: 'basic', size: 'large',  className: 'rounded-[var(--comp-button-radius-lg)]' },
      { shape: 'basic', size: 'medium', className: 'rounded-[var(--comp-button-radius-md)]' },
      { shape: 'basic', size: 'small',  className: 'rounded-[var(--comp-button-radius-sm)]' },
    ],
    defaultVariants: {
      hierarchy: 'primary',
      size: 'medium',
      shape: 'basic',
      fullWidth: false,
    },
  },
)

/* ─── State overlay map ────────────────────────────────────────────────────── */

const stateOverlayMap: Record<ButtonHierarchy, string> = {
  primary:   'group-hover:bg-[var(--comp-button-hover-primary)]   group-active:bg-[var(--comp-button-active-primary)]',
  secondary: 'group-hover:bg-[var(--comp-button-hover-secondary)] group-active:bg-[var(--comp-button-active-secondary)]',
  outlined:  'group-hover:bg-[var(--comp-button-hover-outlined)]  group-active:bg-[var(--comp-button-active-outlined)]',
  ghost:     'group-hover:bg-[var(--comp-button-hover-ghost)]     group-active:bg-[var(--comp-button-active-ghost)]',
}

/* ─── Disabled style map ───────────────────────────────────────────────────── */

const disabledMap: Record<ButtonHierarchy, string> = {
  primary:   'bg-[var(--comp-button-bg-primary-disabled)]   text-[var(--comp-button-content-primary-disabled)]',
  secondary: 'bg-[var(--comp-button-bg-secondary-disabled)] text-[var(--comp-button-content-secondary-disabled)]',
  outlined:  'bg-[var(--comp-button-bg-outlined-disabled)]  text-[var(--comp-button-content-outlined-disabled)]  border-[var(--comp-button-border-outlined-disabled)]',
  ghost:     'bg-[var(--comp-button-bg-ghost-disabled)]     text-[var(--comp-button-content-ghost-disabled)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonVariants> {
  /** Visual hierarchy of the button.
   * @default 'primary'
   * @see {@link BUTTON_HIERARCHIES} */
  hierarchy?: ButtonHierarchy
  /** Size variant.
   * @default 'medium'
   * @see {@link BUTTON_SIZES} */
  size?: ButtonSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BUTTON_SHAPES} */
  shape?: ButtonShape
  /** Stretch to fill parent width.
   * @default false */
  fullWidth?: boolean
  /** Inactive state. Prevents interaction.
   * @default false */
  disabled?: boolean
  /** Shows spinner, hides content, disables interaction.
   * @default false */
  loading?: boolean
  /** Leading icon slot. Component handles sizing internally. */
  iconLeading?: ReactNode
  /** Trailing icon slot. */
  iconTrailing?: ReactNode
  /** Radix Slot — renders child element with component styles.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function Button({
  hierarchy = 'primary',
  size = 'medium',
  shape = 'basic',
  fullWidth = false,
  disabled = false,
  loading = false,
  iconLeading,
  iconTrailing,
  asChild = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const resolvedRadius = radiusMap[shape][size]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ hierarchy, size, shape, fullWidth }),
        disabled && disabledMap[hierarchy],
        isInert && 'pointer-events-none',
        className,
      )}
    >
      {/* Focus ring — visible on keyboard focus only */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          resolvedRadius,
          hierarchy === 'outlined' && '-inset-px',
          'group-focus-visible:opacity-100',
        )}
      />

      {/* State overlay — hover/active backgrounds */}
      {!isInert && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-colors duration-fast ease-enter',
            resolvedRadius,
            stateOverlayMap[hierarchy],
          )}
        />
      )}

      {/* Content wrapper */}
      <span className={cn('relative flex items-center', gapMap[size], loading && 'invisible')}>
        {iconLeading && (
          <span
            className={cn('flex-shrink-0 flex items-center justify-center', iconSizeMap[size])}
            style={{ fontSize: iconFontSizeVar[size] }}
          >
            {iconLeading}
          </span>
        )}
        <span className={textMarginMap[size]}>{children}</span>
        {iconTrailing && (
          <span
            className={cn('flex-shrink-0 flex items-center justify-center', iconSizeMap[size])}
            style={{ fontSize: iconFontSizeVar[size] }}
          >
            {iconTrailing}
          </span>
        )}
      </span>

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size]} />
        </span>
      )}
    </Comp>
  )
}
