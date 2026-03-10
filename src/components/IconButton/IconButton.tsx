import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import type { ButtonVariant, ButtonIntent, ButtonSize, ButtonShape } from '@/components/Button'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ICON_BUTTON_VARIANTS = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const ICON_BUTTON_INTENTS = ['systemic', 'brand', 'destructive'] as const
export const ICON_BUTTON_SIZES = ['xSmall', 'small', 'medium', 'large', 'xLarge'] as const
export const ICON_BUTTON_SHAPES = ['default', 'pill', 'square'] as const

export type IconButtonVariant = ButtonVariant
export type IconButtonIntent = ButtonIntent
export type IconButtonSize = ButtonSize
export type IconButtonShape = ButtonShape

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const iconButtonVariants = cva(
  'group relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden outline-none transition-colors duration-fast ease-enter',
  {
    variants: {
      variant: {
        primary: '',
        secondary: '',
        outlined: 'border',
        ghost: '',
      },
      intent: {
        systemic: '',
        brand: '',
        destructive: '',
      },
      size: {
        xSmall: 'size-[var(--comp-icon-button-size-xs)]',
        small: 'size-[var(--comp-icon-button-size-sm)]',
        medium: 'size-[var(--comp-icon-button-size-md)]',
        large: 'size-[var(--comp-icon-button-size-lg)]',
        xLarge: 'size-[var(--comp-icon-button-size-xl)]',
      },
      shape: {
        default: '',
        pill: 'rounded-[var(--comp-button-radius-pill)]',
        square: 'rounded-[var(--comp-button-radius-square)]',
      },
    },
    compoundVariants: [
      /* ── Systemic colors (shared with Button tokens) ── */
      { variant: 'primary', intent: 'systemic', className: 'bg-[var(--comp-button-bg-primary)] text-[var(--comp-button-content-primary)]' },
      { variant: 'secondary', intent: 'systemic', className: 'bg-[var(--comp-button-bg-secondary)] text-[var(--comp-button-content-secondary)]' },
      { variant: 'outlined', intent: 'systemic', className: 'bg-[var(--comp-button-bg-outlined)] text-[var(--comp-button-content-outlined)] border-[color:var(--comp-button-border-outlined)]' },
      { variant: 'ghost', intent: 'systemic', className: 'bg-[var(--comp-button-bg-ghost)] text-[var(--comp-button-content-ghost)]' },

      /* ── Brand colors ── */
      { variant: 'primary', intent: 'brand', className: 'bg-[var(--comp-button-bg-primary-brand)] text-[var(--comp-button-content-primary-brand)]' },
      { variant: 'secondary', intent: 'brand', className: 'bg-[var(--comp-button-bg-secondary-brand)] text-[var(--comp-button-content-secondary-brand)]' },
      { variant: 'outlined', intent: 'brand', className: 'bg-[var(--comp-button-bg-outlined-brand)] text-[var(--comp-button-content-outlined-brand)] border-[color:var(--comp-button-border-outlined-brand)]' },
      { variant: 'ghost', intent: 'brand', className: 'bg-[var(--comp-button-bg-ghost-brand)] text-[var(--comp-button-content-ghost-brand)]' },

      /* ── Destructive colors ── */
      { variant: 'primary', intent: 'destructive', className: 'bg-[var(--comp-button-bg-primary-destructive)] text-[var(--comp-button-content-primary-destructive)]' },
      { variant: 'secondary', intent: 'destructive', className: 'bg-[var(--comp-button-bg-secondary-destructive)] text-[var(--comp-button-content-secondary-destructive)]' },
      { variant: 'outlined', intent: 'destructive', className: 'bg-[var(--comp-button-bg-outlined-destructive)] text-[var(--comp-button-content-outlined-destructive)] border-[color:var(--comp-button-border-outlined-destructive)]' },
      { variant: 'ghost', intent: 'destructive', className: 'bg-[var(--comp-button-bg-ghost-destructive)] text-[var(--comp-button-content-ghost-destructive)]' },

      /* ── Default radius per size (shape=default only) ── */
      { shape: 'default', size: 'xSmall', className: 'rounded-[var(--comp-button-radius-xs)]' },
      { shape: 'default', size: 'small', className: 'rounded-[var(--comp-button-radius-sm)]' },
      { shape: 'default', size: 'medium', className: 'rounded-[var(--comp-button-radius-md)]' },
      { shape: 'default', size: 'large', className: 'rounded-[var(--comp-button-radius-lg)]' },
      { shape: 'default', size: 'xLarge', className: 'rounded-[var(--comp-button-radius-xl)]' },
    ],
    defaultVariants: {
      variant: 'primary',
      intent: 'systemic',
      size: 'medium',
      shape: 'default',
    },
  },
)

/* ─── Lookup maps ──────────────────────────────────────────────────────────── */

const iconSizeMap: Record<IconButtonSize, string> = {
  xSmall: 'size-[var(--comp-button-icon-xs)]',
  small: 'size-[var(--comp-button-icon-sm)]',
  medium: 'size-[var(--comp-button-icon-md)]',
  large: 'size-[var(--comp-button-icon-lg)]',
  xLarge: 'size-[var(--comp-button-icon-xl)]',
}

const getOverlayClasses = (variant: IconButtonVariant) =>
  variant === 'primary'
    ? 'group-hover:bg-[var(--comp-button-hover-on-dim)] group-active:bg-[var(--comp-button-active-on-dim)]'
    : 'group-hover:bg-[var(--comp-button-hover-on-bright)] group-active:bg-[var(--comp-button-active-on-bright)]'

/** Static disabled class map — literal strings required for Tailwind JIT scanning */
const disabledClassMap: Record<string, string> = {
  'primary-systemic':      'bg-[var(--comp-button-bg-primary-disabled)] text-[var(--comp-button-content-primary-disabled)]',
  'primary-brand':         'bg-[var(--comp-button-bg-primary-brand-disabled)] text-[var(--comp-button-content-primary-brand-disabled)]',
  'primary-destructive':   'bg-[var(--comp-button-bg-primary-destructive-disabled)] text-[var(--comp-button-content-primary-destructive-disabled)]',
  'secondary-systemic':    'bg-[var(--comp-button-bg-secondary-disabled)] text-[var(--comp-button-content-secondary-disabled)]',
  'secondary-brand':       'bg-[var(--comp-button-bg-secondary-brand-disabled)] text-[var(--comp-button-content-secondary-brand-disabled)]',
  'secondary-destructive': 'bg-[var(--comp-button-bg-secondary-destructive-disabled)] text-[var(--comp-button-content-secondary-destructive-disabled)]',
  'outlined-systemic':     'bg-[var(--comp-button-bg-outlined-disabled)] text-[var(--comp-button-content-outlined-disabled)] border-[color:var(--comp-button-border-outlined-disabled)]',
  'outlined-brand':        'bg-[var(--comp-button-bg-outlined-brand-disabled)] text-[var(--comp-button-content-outlined-brand-disabled)] border-[color:var(--comp-button-border-outlined-brand-disabled)]',
  'outlined-destructive':  'bg-[var(--comp-button-bg-outlined-destructive-disabled)] text-[var(--comp-button-content-outlined-destructive-disabled)] border-[color:var(--comp-button-border-outlined-destructive-disabled)]',
  'ghost-systemic':        'bg-[var(--comp-button-bg-ghost-disabled)] text-[var(--comp-button-content-ghost-disabled)]',
  'ghost-brand':           'bg-[var(--comp-button-bg-ghost-brand-disabled)] text-[var(--comp-button-content-ghost-brand-disabled)]',
  'ghost-destructive':     'bg-[var(--comp-button-bg-ghost-destructive-disabled)] text-[var(--comp-button-content-ghost-destructive-disabled)]',
}

function getDisabledClasses(variant: IconButtonVariant, intent: IconButtonIntent): string {
  return disabledClassMap[`${variant}-${intent}`] ?? ''
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * 아이콘만으로 구성된 정사각형 버튼. Button과 동일한 variant/intent/size 체계를 공유한다.
 */
export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * 표시할 아이콘. 필수.
   */
  icon: React.ReactNode

  /**
   * 접근성 레이블. 아이콘 전용 버튼이므로 반드시 제공해야 한다.
   */
  'aria-label': string

  /**
   * 시각적 variant.
   * @default 'primary'
   * @see ICON_BUTTON_VARIANTS
   */
  variant?: IconButtonVariant

  /**
   * 색상 의도.
   * @default 'systemic'
   * @see ICON_BUTTON_INTENTS
   */
  intent?: IconButtonIntent

  /**
   * 크기 variant. 정사각형 크기와 아이콘 크기를 제어한다.
   * @default 'medium'
   * @see ICON_BUTTON_SIZES
   */
  size?: IconButtonSize

  /**
   * 형태. pill은 원형이 된다.
   * @default 'default'
   * @see ICON_BUTTON_SHAPES
   */
  shape?: IconButtonShape

  /** Radix Slot으로 자식 요소에 스타일을 전달한다. @default false */
  asChild?: boolean

  /** 로딩 상태. @default false */
  loading?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'primary',
      intent = 'systemic',
      size = 'medium',
      shape = 'default',
      asChild = false,
      loading = false,
      disabled = false,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (props.type ?? 'button')}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={isDisabled ? (e: React.MouseEvent) => e.preventDefault() : onClick}
        className={cn(
          iconButtonVariants({ variant, intent, size, shape }),
          isDisabled && 'cursor-not-allowed',
          isDisabled && !loading && getDisabledClasses(variant, intent),
          loading && 'pointer-events-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--comp-button-focus-ring)] focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {/* State overlay */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
            !isDisabled && getOverlayClasses(variant),
          )}
        />

        {/* Loading spinner */}
        {loading && (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <Spinner className={cn(iconSizeMap[size], 'motion-essential')} />
          </span>
        )}

        {/* Icon */}
        <span className={cn('relative flex-shrink-0', iconSizeMap[size], loading && 'invisible')}>
          {icon}
        </span>
      </Comp>
    )
  },
)

IconButton.displayName = 'IconButton'
