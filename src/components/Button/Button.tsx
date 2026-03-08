import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'

/* ─── Variant metadata ─── */

export const BUTTON_HIERARCHIES = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const

export type ButtonHierarchy = (typeof BUTTON_HIERARCHIES)[number]
export type ButtonSize = (typeof BUTTON_SIZES)[number]

/* ─── CVA: hierarchy × size ─── */

const buttonVariants = cva(
  // Base
  'group relative inline-flex items-center justify-center shrink-0 select-none transition-colors duration-fast ease-enter',
  {
    variants: {
      hierarchy: {
        primary:
          'bg-[var(--comp-button-bg-primary)] text-[var(--comp-button-content-primary)]',
        secondary:
          'bg-[var(--comp-button-bg-secondary)] text-[var(--comp-button-content-secondary)]',
        outlined:
          'bg-[var(--comp-button-bg-outlined)] text-[var(--comp-button-content-outlined)] border border-[var(--comp-button-border-outlined)]',
        ghost:
          'bg-[var(--comp-button-bg-ghost)] text-[var(--comp-button-content-ghost)]',
      },
      size: {
        xLarge: 'h-[var(--comp-button-height-xl)] px-[var(--comp-button-px-xl)] gap-[var(--comp-button-gap-xl)] typography-20-semibold',
        large:  'h-[var(--comp-button-height-lg)] px-[var(--comp-button-px-lg)] gap-[var(--comp-button-gap-lg)] typography-18-semibold',
        medium: 'h-[var(--comp-button-height-md)] px-[var(--comp-button-px-md)] gap-[var(--comp-button-gap-md)] typography-16-semibold',
        small:  'h-[var(--comp-button-height-sm)] px-[var(--comp-button-px-sm)] gap-[var(--comp-button-gap-sm)] typography-14-semibold',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: {
      hierarchy: 'primary',
      size: 'medium',
      fullWidth: false,
    },
  },
)

/* ─── Disabled (Inactive) compound: hierarchy별 색상 오버라이드 ─── */

const disabledVariants: Record<
  NonNullable<VariantProps<typeof buttonVariants>['hierarchy']>,
  string
> = {
  primary:
    'disabled:bg-[var(--comp-button-bg-primary-disabled)] disabled:text-[var(--comp-button-content-primary-disabled)]',
  secondary:
    'disabled:bg-[var(--comp-button-bg-secondary-disabled)] disabled:text-[var(--comp-button-content-secondary-disabled)]',
  outlined:
    'disabled:bg-[var(--comp-button-bg-outlined-disabled)] disabled:text-[var(--comp-button-content-outlined-disabled)] disabled:border-[var(--comp-button-border-outlined-disabled)]',
  ghost:
    'disabled:bg-[var(--comp-button-bg-ghost-disabled)] disabled:text-[var(--comp-button-content-ghost-disabled)]',
}

/* ─── State overlay: hierarchy에 따라 on-dim / on-bright 분기 ─── */

const stateOverlayVariants: Record<
  NonNullable<VariantProps<typeof buttonVariants>['hierarchy']>,
  string
> = {
  primary:
    'group-hover:bg-[var(--comp-button-hover-on-dim)] group-active:bg-[var(--comp-button-active-on-dim)]',
  secondary:
    'group-hover:bg-[var(--comp-button-hover-on-bright)] group-active:bg-[var(--comp-button-active-on-bright)]',
  outlined:
    'group-hover:bg-[var(--comp-button-hover-on-bright)] group-active:bg-[var(--comp-button-active-on-bright)]',
  ghost:
    'group-hover:bg-[var(--comp-button-hover-on-bright)] group-active:bg-[var(--comp-button-active-on-bright)]',
}

/* ─── Radius per button size — default sub-type ─── */

const radiusMap = {
  xLarge: 'rounded-[var(--comp-button-radius-xl)]',
  large: 'rounded-[var(--comp-button-radius-lg)]',
  medium: 'rounded-[var(--comp-button-radius-md)]',
  small: 'rounded-[var(--comp-button-radius-sm)]',
} as const

/* ─── Radius per button size — icon-only sub-type ─── */

const radiusIconOnlyMap = {
  xLarge: 'rounded-[var(--comp-button-radius-icon-xl)]',
  large: 'rounded-[var(--comp-button-radius-icon-lg)]',
  medium: 'rounded-[var(--comp-button-radius-icon-md)]',
  small: 'rounded-[var(--comp-button-radius-icon-sm)]',
} as const

/* ─── Icon size per button size ─── */

const iconSizeMap = {
  xLarge: 'size-[var(--comp-button-icon-xl)]',
  large: 'size-[var(--comp-button-icon-lg)]',
  medium: 'size-[var(--comp-button-icon-md)]',
  small: 'size-[var(--comp-button-icon-sm)]',
} as const

/* ─── Spinner size per button size ─── */

const spinnerSizeMap = {
  xLarge: 'size-[var(--comp-button-icon-xl)]',
  large: 'size-[var(--comp-button-icon-lg)]',
  medium: 'size-[var(--comp-button-icon-md)]',
  small: 'size-[var(--comp-button-icon-sm)]',
} as const

/* ─── Props ─── */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * 다른 엘리먼트로 렌더링. children의 첫 번째 자식 엘리먼트에 Button의 props와 스타일을 병합한다.
   * @default false
   */
  asChild?: boolean
  /**
   * 텍스트 앞(leading)에 표시할 아이콘. 크기는 size variant에 따라 자동 결정된다.
   * @see BUTTON_SIZES
   */
  iconLeading?: React.ReactNode
  /**
   * 텍스트 뒤(trailing)에 표시할 아이콘. 크기는 size variant에 따라 자동 결정된다.
   * @see BUTTON_SIZES
   */
  iconTrailing?: React.ReactNode
  /**
   * 로딩 상태. 스피너를 중앙에 표시하고 클릭을 비활성화한다.
   * 콘텐츠는 invisible로 처리되어 버튼 크기가 유지된다.
   * @default false
   */
  loading?: boolean
}

/* ─── Component ─── */

export function Button({
  className,
  hierarchy = 'primary',
  size = 'medium',
  fullWidth = false,
  asChild = false,
  iconLeading,
  iconTrailing,
  loading = false,
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const resolvedSize = size ?? 'medium'
  const resolvedHierarchy = hierarchy ?? 'primary'
  const isIconOnly = !children && (iconLeading || iconTrailing)

  return (
    <Comp
      className={cn(
        buttonVariants({ hierarchy, size, fullWidth }),
        // Radius — icon-only uses separate sub-type token for geo shape theme
        isIconOnly ? radiusIconOnlyMap[resolvedSize] : radiusMap[resolvedSize],
        // disabled 색상은 실제 disabled일 때만 적용 (loading 제외)
        disabled && disabledVariants[resolvedHierarchy],
        disabled && 'cursor-not-allowed',
        // loading은 원래 색상 유지, 인터랙션만 차단
        loading && 'pointer-events-none',
        className,
      )}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...props}
    >
      {/* State overlay */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
          'group-focus-visible:border-2 group-focus-visible:border-[var(--comp-button-focus-border)]',
          !disabled && !loading && stateOverlayVariants[resolvedHierarchy],
        )}
      />

      {/* Loading spinner — absolute center, content stays for layout */}
      {loading && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <Spinner className={spinnerSizeMap[resolvedSize]} />
        </span>
      )}

      {/* Content — invisible when loading to keep button size */}
      {iconLeading && (
        <span
          className={cn(
            'flex-shrink-0 relative',
            iconSizeMap[resolvedSize],
            loading && 'invisible',
          )}
        >
          {iconLeading}
        </span>
      )}
      {children && (
        <span className={cn('relative', loading && 'invisible')}>
          {children}
        </span>
      )}
      {iconTrailing && (
        <span
          className={cn(
            'flex-shrink-0 relative',
            iconSizeMap[resolvedSize],
            loading && 'invisible',
          )}
        >
          {iconTrailing}
        </span>
      )}
    </Comp>
  )
}
