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
    'transition-colors duration-fast ease-enter outline-none',
  ],
  {
    variants: {
      size: {
        large: 'h-[var(--comp-chip-universal-height-lg)] px-[var(--comp-chip-universal-px)] typography-14-semibold',
        medium: 'h-[var(--comp-chip-universal-height-md)] px-[var(--comp-chip-universal-px)] typography-14-semibold',
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
        <span className="relative z-[1] inline-flex items-center gap-[var(--comp-chip-universal-gap)]">
          <span className="inline-flex items-center gap-[var(--comp-chip-universal-inner-gap)]">
            {iconLeading && (
              <span className="flex-shrink-0 size-[var(--comp-chip-universal-icon)] [&>*]:[font-size:inherit]" style={{ fontSize: 18 }}>
                {iconLeading}
              </span>
            )}
            <span className="px-1">{children}</span>
          </span>
          {iconTrailing && (
            <span className="flex-shrink-0 size-[var(--comp-chip-universal-icon)] [&>*]:[font-size:inherit]" style={{ fontSize: 18 }}>
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
