import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap } from '@/components/Button/shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TEXT_BUTTON_COLORS = ['neutral', 'blue'] as const
export const TEXT_BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const

export type TextButtonColor = (typeof TEXT_BUTTON_COLORS)[number]
export type TextButtonSize = (typeof TEXT_BUTTON_SIZES)[number]

/* ─── CVA (size only — colors handled via style maps) ──────────────────────── */

const textButtonVariants = cva(
  [
    'group relative inline-flex items-center justify-center cursor-pointer select-none',
    'will-change-transform [transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-out)] active:[transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-in)] active:scale-[var(--comp-text-button-scale-pressed)]',
  ],
  {
    variants: {
      size: {
        xLarge: 'h-[var(--comp-text-button-height-xl)] typography-18-medium',
        large:  'h-[var(--comp-text-button-height-lg)] typography-16-medium',
        medium: 'h-[var(--comp-text-button-height-md)] typography-14-medium',
        small:  'h-[var(--comp-text-button-height-sm)] typography-12-medium',
      },
      fullWidth: {
        true:  'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      size: 'medium',
      fullWidth: false,
    },
  },
)

/* ─── Color × Surface style maps ──────────────────────────────────────────── */

type SurfaceKey = 'onBright' | 'onDim'

type ColorStyles = {
  base: string
  hover: string
  active: string
  disabled: string
}

const colorStyleMap: Record<TextButtonColor, Record<SurfaceKey, ColorStyles>> = {
  neutral: {
    onBright: {
      base:     'text-semantic-text-on-bright-800',
      hover:    'hover:text-semantic-text-on-bright-900',
      active:   'active:text-semantic-text-on-bright-950',
      disabled: 'text-semantic-neutral-black-alpha-300',
    },
    onDim: {
      base:     'text-semantic-text-on-dim-800',
      hover:    'hover:text-semantic-text-on-dim-900',
      active:   'active:text-semantic-text-on-dim-950',
      disabled: 'text-semantic-neutral-white-alpha-300',
    },
  },
  blue: {
    onBright: {
      base:     'text-semantic-emphasized-blue-500',
      hover:    'hover:text-semantic-emphasized-blue-600',
      active:   'active:text-semantic-emphasized-blue-700',
      disabled: 'text-semantic-emphasized-blue-200',
    },
    onDim: {
      base:     'text-semantic-emphasized-blue-500',
      hover:    'hover:text-semantic-emphasized-blue-400',
      active:   'active:text-semantic-emphasized-blue-300',
      disabled: 'text-semantic-emphasized-blue-800',
    },
  },
}

/* ─── Local size-dependent maps ───────────────────────────────────────────── */

const gapMap: Record<TextButtonSize, string> = {
  xLarge: 'gap-[var(--comp-text-button-gap-xl)]',
  large:  'gap-[var(--comp-text-button-gap-lg)]',
  medium: 'gap-0',
  small:  'gap-0',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface TextButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'color'>,
    VariantProps<typeof textButtonVariants> {
  /** Color variant.
   * @default 'neutral'
   * @see {@link TEXT_BUTTON_COLORS} */
  color?: TextButtonColor
  /** Size variant.
   * @default 'medium'
   * @see {@link TEXT_BUTTON_SIZES} */
  size?: TextButtonSize
  /** Use on-dim text colors for dark/contrasting surfaces.
   * @default false */
  onDim?: boolean
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

export function TextButton({
  color = 'neutral',
  size = 'medium',
  onDim = false,
  fullWidth = false,
  disabled = false,
  loading = false,
  iconLeading,
  iconTrailing,
  asChild = false,
  className,
  children,
  ...rest
}: TextButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const surfaceKey: SurfaceKey = onDim ? 'onDim' : 'onBright'
  const styles = colorStyleMap[color][surfaceKey]

  return (
    <Comp
      {...rest}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        textButtonVariants({ size, fullWidth }),
        disabled ? styles.disabled : [styles.base, styles.hover, styles.active],
        isInert && 'pointer-events-none',
        className,
      )}
    >
      {/* Focus ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter group-focus-visible:opacity-100"
      />

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
        <span>{children}</span>
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
