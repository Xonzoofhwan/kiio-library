import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import {
  iconSizeMap, iconFontSizeVar, spinnerSizeMap,
  gapMap, textMarginMap, radiusMap,
} from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BUTTON_ERR_HIERARCHIES = ['primary', 'secondary', 'tertiary'] as const
export const BUTTON_ERR_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const BUTTON_ERR_SHAPES = ['basic', 'circular', 'square'] as const

export type ButtonErrHierarchy = (typeof BUTTON_ERR_HIERARCHIES)[number]
export type ButtonErrSize = (typeof BUTTON_ERR_SIZES)[number]
export type ButtonErrShape = (typeof BUTTON_ERR_SHAPES)[number]

/* ─── CVA (size/shape — shared tokens with Universal) ──────────────────────── */

const buttonErrVariants = cva(
  'group relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none',
  {
    variants: {
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
      size: 'medium',
      shape: 'basic',
      fullWidth: false,
    },
  },
)

/* ─── Hierarchy style maps ─────────────────────────────────────────────────── */

const hierarchyMap: Record<ButtonErrHierarchy, { base: string; disabled: string }> = {
  primary: {
    base:     'bg-semantic-error-500 text-semantic-neutral-solid-0',
    disabled: 'bg-semantic-error-200 text-semantic-neutral-white-alpha-600',
  },
  secondary: {
    base:     'bg-semantic-error-50 text-semantic-error-600',
    disabled: 'bg-semantic-error-50 text-semantic-error-200',
  },
  tertiary: {
    base:     'bg-transparent text-semantic-error-500',
    disabled: 'bg-transparent text-semantic-error-200',
  },
}

/* ─── State overlay — all hierarchies use on-bright ────────────────────────── */

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ButtonErrorProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonErrVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link BUTTON_ERR_HIERARCHIES} */
  hierarchy?: ButtonErrHierarchy
  /** Size variant.
   * @default 'medium'
   * @see {@link BUTTON_ERR_SIZES} */
  size?: ButtonErrSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BUTTON_ERR_SHAPES} */
  shape?: ButtonErrShape
  /** Stretch to fill parent width.
   * @default false */
  fullWidth?: boolean
  /** Inactive state. Prevents interaction.
   * @default false */
  disabled?: boolean
  /** Shows spinner, hides content, disables interaction.
   * @default false */
  loading?: boolean
  /** Leading icon slot. */
  iconLeading?: ReactNode
  /** Trailing icon slot. */
  iconTrailing?: ReactNode
  /** Radix Slot — renders child element with component styles.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function ButtonError({
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
}: ButtonErrorProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const resolvedRadius = radiusMap[shape][size]
  const styles = hierarchyMap[hierarchy]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonErrVariants({ size, shape, fullWidth }),
        disabled ? styles.disabled : styles.base,
        isInert && 'pointer-events-none',
        className,
      )}
    >
      {/* Focus ring */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          resolvedRadius,
          'group-focus-visible:opacity-100',
        )}
      />

      {/* State overlay */}
      {!isInert && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-colors duration-fast ease-enter',
            resolvedRadius,
            stateOverlay,
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
