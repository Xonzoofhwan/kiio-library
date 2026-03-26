import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap, radiusMap } from './shared'
import type { ButtonSize, ButtonShape } from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ICON_BUTTON_HIERARCHIES = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const ICON_BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const ICON_BUTTON_SHAPES = ['basic', 'circular', 'square'] as const

export type IconButtonHierarchy = (typeof ICON_BUTTON_HIERARCHIES)[number]
export type IconButtonSize = (typeof ICON_BUTTON_SIZES)[number]
export type IconButtonShape = (typeof ICON_BUTTON_SHAPES)[number]

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const iconButtonVariants = cva(
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
      hierarchy: 'primary',
      size: 'medium',
      shape: 'basic',
    },
  },
)

/* ─── State overlay map ────────────────────────────────────────────────────── */

const stateOverlayMap: Record<IconButtonHierarchy, string> = {
  primary:   'group-hover:bg-[var(--comp-button-hover-primary)]   group-active:bg-[var(--comp-button-active-primary)]',
  secondary: 'group-hover:bg-[var(--comp-button-hover-secondary)] group-active:bg-[var(--comp-button-active-secondary)]',
  outlined:  'group-hover:bg-[var(--comp-button-hover-outlined)]  group-active:bg-[var(--comp-button-active-outlined)]',
  ghost:     'group-hover:bg-[var(--comp-button-hover-ghost)]     group-active:bg-[var(--comp-button-active-ghost)]',
}

/* ─── Disabled style map ───────────────────────────────────────────────────── */

const disabledMap: Record<IconButtonHierarchy, string> = {
  primary:   'bg-[var(--comp-button-bg-primary-disabled)]   text-[var(--comp-button-content-primary-disabled)]',
  secondary: 'bg-[var(--comp-button-bg-secondary-disabled)] text-[var(--comp-button-content-secondary-disabled)]',
  outlined:  'bg-[var(--comp-button-bg-outlined-disabled)]  text-[var(--comp-button-content-outlined-disabled)]  border-[var(--comp-button-border-outlined-disabled)]',
  ghost:     'bg-[var(--comp-button-bg-ghost-disabled)]     text-[var(--comp-button-content-ghost-disabled)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof iconButtonVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link ICON_BUTTON_HIERARCHIES} */
  hierarchy?: IconButtonHierarchy
  /** Size variant. IconButton is always square (width = height).
   * @default 'medium'
   * @see {@link ICON_BUTTON_SIZES} */
  size?: IconButtonSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link ICON_BUTTON_SHAPES} */
  shape?: IconButtonShape
  /** Inactive state. Prevents interaction.
   * @default false */
  disabled?: boolean
  /** Shows spinner, hides icon, disables interaction.
   * @default false */
  loading?: boolean
  /** Icon to render. Component handles sizing internally.
   * @example <IconButton icon={<Icon name="settings" />} /> */
  icon: ReactNode
  /** Accessible label (required since there is no visible text).
   * @example aria-label="Settings" */
  'aria-label': string
  /** Radix Slot — renders child element with component styles.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function IconButton({
  hierarchy = 'primary',
  size = 'medium',
  shape = 'basic',
  disabled = false,
  loading = false,
  icon,
  asChild = false,
  className,
  ...rest
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const resolvedRadius = radiusMap[shape as ButtonShape][size as ButtonSize]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        iconButtonVariants({ hierarchy, size, shape }),
        disabled && disabledMap[hierarchy],
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
          hierarchy === 'outlined' && '-inset-px',
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
            stateOverlayMap[hierarchy],
          )}
        />
      )}

      {/* Icon */}
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

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size as ButtonSize]} />
        </span>
      )}
    </Comp>
  )
}
