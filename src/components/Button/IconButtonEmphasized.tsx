import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap, radiusMap } from './shared'
import type { ButtonSize, ButtonShape } from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ICON_BUTTON_EMP_HIERARCHIES = ['primary', 'secondary', 'tertiary'] as const
export const ICON_BUTTON_EMP_COLORS = ['purple', 'blue', 'orange'] as const
export const ICON_BUTTON_EMP_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const ICON_BUTTON_EMP_SHAPES = ['basic', 'circular', 'square'] as const

export type IconButtonEmpHierarchy = (typeof ICON_BUTTON_EMP_HIERARCHIES)[number]
export type IconButtonEmpColor = (typeof ICON_BUTTON_EMP_COLORS)[number]
export type IconButtonEmpSize = (typeof ICON_BUTTON_EMP_SIZES)[number]
export type IconButtonEmpShape = (typeof ICON_BUTTON_EMP_SHAPES)[number]

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const iconButtonEmpVariants = cva(
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

/* ─── Color × Hierarchy style maps ─────────────────────────────────────────── */

type HierarchyStyles = { base: string; disabled: string }

const colorHierarchyMap: Record<IconButtonEmpColor, Record<IconButtonEmpHierarchy, HierarchyStyles>> = {
  purple: {
    primary:   { base: 'bg-semantic-emphasized-purple-500 text-semantic-neutral-solid-0',           disabled: 'bg-semantic-emphasized-purple-200 text-semantic-neutral-white-alpha-600' },
    secondary: { base: 'bg-semantic-emphasized-purple-100 text-semantic-emphasized-purple-600',     disabled: 'bg-semantic-emphasized-purple-100 text-semantic-emphasized-purple-200' },
    tertiary:  { base: 'bg-transparent text-semantic-emphasized-purple-500',                        disabled: 'bg-transparent text-semantic-emphasized-purple-200' },
  },
  blue: {
    primary:   { base: 'bg-semantic-emphasized-blue-500 text-semantic-neutral-solid-0',             disabled: 'bg-semantic-emphasized-blue-200 text-semantic-neutral-white-alpha-600' },
    secondary: { base: 'bg-semantic-emphasized-blue-100 text-semantic-emphasized-blue-600',         disabled: 'bg-semantic-emphasized-blue-100 text-semantic-emphasized-blue-200' },
    tertiary:  { base: 'bg-transparent text-semantic-emphasized-blue-500',                          disabled: 'bg-transparent text-semantic-emphasized-blue-200' },
  },
  orange: {
    primary:   { base: 'bg-semantic-emphasized-orange-500 text-semantic-neutral-solid-0',           disabled: 'bg-semantic-emphasized-orange-200 text-semantic-neutral-white-alpha-600' },
    secondary: { base: 'bg-semantic-emphasized-orange-100 text-semantic-emphasized-orange-600',     disabled: 'bg-semantic-emphasized-orange-100 text-semantic-emphasized-orange-200' },
    tertiary:  { base: 'bg-transparent text-semantic-emphasized-orange-500',                        disabled: 'bg-transparent text-semantic-emphasized-orange-200' },
  },
}

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface IconButtonEmphasizedProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'color'>,
    VariantProps<typeof iconButtonEmpVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link ICON_BUTTON_EMP_HIERARCHIES} */
  hierarchy?: IconButtonEmpHierarchy
  /** Emphasized color.
   * @default 'purple'
   * @see {@link ICON_BUTTON_EMP_COLORS} */
  color?: IconButtonEmpColor
  /** Size variant. Always square (width = height).
   * @default 'medium'
   * @see {@link ICON_BUTTON_EMP_SIZES} */
  size?: IconButtonEmpSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link ICON_BUTTON_EMP_SHAPES} */
  shape?: IconButtonEmpShape
  /** Inactive state. Prevents interaction.
   * @default false */
  disabled?: boolean
  /** Shows spinner, hides icon, disables interaction.
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

export function IconButtonEmphasized({
  hierarchy = 'primary',
  color = 'purple',
  size = 'medium',
  shape = 'basic',
  disabled = false,
  loading = false,
  icon,
  asChild = false,
  className,
  ...rest
}: IconButtonEmphasizedProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const resolvedRadius = radiusMap[shape as ButtonShape][size as ButtonSize]
  const styles = colorHierarchyMap[color][hierarchy]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        iconButtonEmpVariants({ size, shape }),
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
