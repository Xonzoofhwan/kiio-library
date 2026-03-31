import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BadgeLabel } from '@/components/Badge'
import { CHIP_UNIVERSAL_SIZES, type ChipUniversalSize } from './shared'

export { CHIP_UNIVERSAL_SIZES }
export type { ChipUniversalSize }

/* ─── CVA ─────────────────────────────────────────────────────────────────── */

const chipUniversalVariants = cva(
  [
    'group relative inline-flex items-center justify-center cursor-pointer select-none rounded-full',
    'outline-none will-change-transform [transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-out)] active:[transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-in)] active:scale-[var(--comp-chip-universal-scale-pressed)]',
  ],
  {
    variants: {
      size: {
        large: 'h-[var(--comp-chip-universal-height-lg)] px-[var(--comp-chip-universal-px-lg)] typography-14-semibold',
        medium: 'h-[var(--comp-chip-universal-height-md)] px-[var(--comp-chip-universal-px-md)] typography-12-semibold',
      },
      selected: {
        false: 'bg-[var(--comp-chip-universal-bg)] text-[var(--comp-chip-universal-content)]',
        true: 'bg-[var(--comp-chip-universal-bg-selected)] text-[var(--comp-chip-universal-content-selected)]',
      },
    },
    defaultVariants: {
      size: 'large',
      selected: false,
    },
  },
)

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface ChipUniversalProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** 시각적 선택 상태. 토글/드롭다운 트리거 등 동작은 소비자가 onClick으로 결정.
   * @default false */
  selected?: boolean
  /** Size variant.
   * @default 'large'
   * @see {@link CHIP_UNIVERSAL_SIZES} */
  size?: ChipUniversalSize
  /** Leading icon.  */
  iconLeading?: ReactNode
  /** Trailing icon.  */
  iconTrailing?: ReactNode
  /** Badge content (renders as BadgeLabel nano red). */
  badge?: ReactNode
  /** Radix Slot — renders child element with component styles.
   * @default false */
  asChild?: boolean
  children: ReactNode
  className?: string
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export const ChipUniversal = forwardRef<HTMLButtonElement, ChipUniversalProps>(
  (
    {
      selected = false,
      size = 'large',
      iconLeading,
      iconTrailing,
      badge,
      asChild = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        aria-pressed={selected}
        disabled={disabled}
        className={cn(
          chipUniversalVariants({ size, selected }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        {/* Focus ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-[var(--comp-chip-universal-focus-border)] opacity-0 transition-opacity duration-fast ease-enter group-focus-visible:opacity-100"
        />

        {/* State overlay */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter',
            selected
              ? 'group-hover:bg-[var(--comp-chip-universal-hover-selected)] group-active:bg-[var(--comp-chip-universal-pressed-selected)]'
              : 'group-hover:bg-[var(--comp-chip-universal-hover)] group-active:bg-[var(--comp-chip-universal-pressed)]',
          )}
        />

        {/* Content */}
        <span className={cn(
          'relative z-[1] inline-flex items-center',
          size === 'large' ? 'gap-[var(--comp-chip-universal-gap-lg)]' : 'gap-[var(--comp-chip-universal-gap-md)]',
        )}>
          <span className={cn(
            'inline-flex items-center',
            size === 'large' ? 'gap-[var(--comp-chip-universal-inner-gap-lg)]' : 'gap-[var(--comp-chip-universal-inner-gap-md)]',
          )}>
            {iconLeading && (
              <span
                className={cn(
                  'flex-shrink-0 [&>*]:[font-size:inherit]',
                  size === 'large' ? 'size-[var(--comp-chip-universal-icon-lg)]' : 'size-[var(--comp-chip-universal-icon-md)]',
                )}
                style={{ fontSize: size === 'large' ? 18 : 16 }}
              >
                {iconLeading}
              </span>
            )}
            <span className="px-1">{children}</span>
          </span>
          {iconTrailing && (
            <span
              className={cn(
                'flex-shrink-0 [&>*]:[font-size:inherit]',
                size === 'large' ? 'size-[var(--comp-chip-universal-icon-lg)]' : 'size-[var(--comp-chip-universal-icon-md)]',
              )}
              style={{ fontSize: size === 'large' ? 18 : 16 }}
            >
              {iconTrailing}
            </span>
          )}
        </span>

        {/* Badge */}
        {badge && (
          <span className="absolute -top-1 -right-1 z-[2]">
            <BadgeLabel size="nano" shape="circular" weight="heavy" color="red">
              {badge}
            </BadgeLabel>
          </span>
        )}
      </Comp>
    )
  },
)
ChipUniversal.displayName = 'ChipUniversal'
