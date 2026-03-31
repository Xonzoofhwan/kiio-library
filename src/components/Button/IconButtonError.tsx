import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap, radiusMap } from './shared'
import type { ButtonSize, ButtonShape } from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ICON_BUTTON_ERR_HIERARCHIES = ['primary', 'secondary', 'tertiary'] as const
export const ICON_BUTTON_ERR_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const ICON_BUTTON_ERR_SHAPES = ['basic', 'circular', 'square'] as const

export type IconButtonErrHierarchy = (typeof ICON_BUTTON_ERR_HIERARCHIES)[number]
export type IconButtonErrSize = (typeof ICON_BUTTON_ERR_SIZES)[number]
export type IconButtonErrShape = (typeof ICON_BUTTON_ERR_SHAPES)[number]

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const iconButtonErrVariants = cva(
  [
    'group relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none',
    'will-change-transform [transition:var(--comp-scale-press-transition-out)] active:[transition:var(--comp-scale-press-transition-in)] active:scale-[var(--comp-button-scale-pressed)]',
  ],
  {
    variants: {
      size: {
        xLarge: 'size-[var(--comp-button-height-xl)]',
        large:  'size-[var(--comp-button-height-lg)]',
        medium: 'size-[var(--comp-button-height-md)]',
        small:  'size-[var(--comp-button-height-sm)]',
      },
      shape: {
        basic:    '',
        circular: 'rounded-full',
        square:   'rounded-none',
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
    },
  },
)

/* ─── Hierarchy style maps ─────────────────────────────────────────────────── */

const hierarchyMap: Record<IconButtonErrHierarchy, { base: string; disabled: string }> = {
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

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface IconButtonErrorProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof iconButtonErrVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link ICON_BUTTON_ERR_HIERARCHIES} */
  hierarchy?: IconButtonErrHierarchy
  /** Size variant. Always square.
   * @default 'medium'
   * @see {@link ICON_BUTTON_ERR_SIZES} */
  size?: IconButtonErrSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link ICON_BUTTON_ERR_SHAPES} */
  shape?: IconButtonErrShape
  /** Inactive state.
   * @default false */
  disabled?: boolean
  /** Shows spinner, hides icon.
   * @default false */
  loading?: boolean
  /** Icon to render. */
  icon: ReactNode
  /** Accessible label (required — no visible text). */
  'aria-label': string
  /** Radix Slot.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function IconButtonError({
  hierarchy = 'primary',
  size = 'medium',
  shape = 'basic',
  disabled = false,
  loading = false,
  icon,
  asChild = false,
  className,
  ...rest
}: IconButtonErrorProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const resolvedRadius = radiusMap[shape as ButtonShape][size as ButtonSize]
  const styles = hierarchyMap[hierarchy]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        iconButtonErrVariants({ size, shape }),
        disabled ? styles.disabled : styles.base,
        isInert && 'pointer-events-none',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          resolvedRadius,
          'group-focus-visible:opacity-100',
        )}
      />

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

      <span
        className={cn(
          'relative flex-shrink-0 flex items-center justify-center',
          iconSizeMap[size as ButtonSize],
          loading && 'invisible',
        )}
        style={{ fontSize: iconFontSizeVar[size as ButtonSize] }}
      >
        {icon}
      </span>

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size as ButtonSize]} />
        </span>
      )}
    </Comp>
  )
}
