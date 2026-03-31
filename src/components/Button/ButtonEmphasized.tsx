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

export const BUTTON_EMP_HIERARCHIES = ['primary', 'secondary', 'ghost'] as const
export const BUTTON_EMP_COLORS = ['purple', 'blue', 'orange'] as const
export const BUTTON_EMP_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const BUTTON_EMP_SHAPES = ['basic', 'circular', 'square'] as const

export type ButtonEmpHierarchy = (typeof BUTTON_EMP_HIERARCHIES)[number]
export type ButtonEmpColor = (typeof BUTTON_EMP_COLORS)[number]
export type ButtonEmpSize = (typeof BUTTON_EMP_SIZES)[number]
export type ButtonEmpShape = (typeof BUTTON_EMP_SHAPES)[number]

/* ─── CVA (size/shape only — colors handled via maps) ──────────────────────── */

const buttonEmpVariants = cva(
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

/* ─── Color × Hierarchy style maps ─────────────────────────────────────────── */

type HierarchyStyles = {
  base: string
  disabled: string
}

const colorHierarchyMap: Record<ButtonEmpColor, Record<ButtonEmpHierarchy, HierarchyStyles>> = {
  purple: {
    primary: {
      base:     'bg-semantic-emphasized-purple-500 text-semantic-neutral-solid-0',
      disabled: 'bg-semantic-emphasized-purple-200 text-semantic-neutral-white-alpha-600',
    },
    secondary: {
      base:     'bg-semantic-emphasized-purple-100 text-semantic-emphasized-purple-600',
      disabled: 'bg-semantic-emphasized-purple-100 text-semantic-emphasized-purple-200',
    },
    ghost: {
      base:     'bg-transparent text-semantic-emphasized-purple-500',
      disabled: 'bg-transparent text-semantic-emphasized-purple-200',
    },
  },
  blue: {
    primary: {
      base:     'bg-semantic-emphasized-blue-500 text-semantic-neutral-solid-0',
      disabled: 'bg-semantic-emphasized-blue-200 text-semantic-neutral-white-alpha-600',
    },
    secondary: {
      base:     'bg-semantic-emphasized-blue-100 text-semantic-emphasized-blue-600',
      disabled: 'bg-semantic-emphasized-blue-100 text-semantic-emphasized-blue-200',
    },
    ghost: {
      base:     'bg-transparent text-semantic-emphasized-blue-500',
      disabled: 'bg-transparent text-semantic-emphasized-blue-200',
    },
  },
  orange: {
    primary: {
      base:     'bg-semantic-emphasized-orange-500 text-semantic-neutral-solid-0',
      disabled: 'bg-semantic-emphasized-orange-200 text-semantic-neutral-white-alpha-600',
    },
    secondary: {
      base:     'bg-semantic-emphasized-orange-100 text-semantic-emphasized-orange-600',
      disabled: 'bg-semantic-emphasized-orange-100 text-semantic-emphasized-orange-200',
    },
    ghost: {
      base:     'bg-transparent text-semantic-emphasized-orange-500',
      disabled: 'bg-transparent text-semantic-emphasized-orange-200',
    },
  },
}

/* ─── State overlay — same for all colors, all hierarchies use on-bright ──── */

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ButtonEmphasizedProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'color'>,
    VariantProps<typeof buttonEmpVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link BUTTON_EMP_HIERARCHIES} */
  hierarchy?: ButtonEmpHierarchy
  /** Emphasized color.
   * @default 'purple'
   * @see {@link BUTTON_EMP_COLORS} */
  color?: ButtonEmpColor
  /** Size variant.
   * @default 'medium'
   * @see {@link BUTTON_EMP_SIZES} */
  size?: ButtonEmpSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BUTTON_EMP_SHAPES} */
  shape?: ButtonEmpShape
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

export function ButtonEmphasized({
  hierarchy = 'primary',
  color = 'purple',
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
}: ButtonEmphasizedProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const resolvedRadius = radiusMap[shape][size]
  const styles = colorHierarchyMap[color][hierarchy]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonEmpVariants({ size, shape, fullWidth }),
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
