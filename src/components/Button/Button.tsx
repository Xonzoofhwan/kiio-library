import { type ComponentPropsWithRef, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import {
  iconSizeMap, iconFontSizeVar, spinnerSizeMap,
  gapMap, textMarginMap, radiusMap,
  type ButtonSize, type ButtonShape,
} from './shared'
import { inertRootProps } from './inert'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BUTTON_HIERARCHIES = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const BUTTON_SHAPES = ['basic', 'circular', 'square'] as const

export type ButtonHierarchy = (typeof BUTTON_HIERARCHIES)[number]
export type { ButtonSize, ButtonShape }

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  [
    'group relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none',
    'will-change-transform [transition:var(--comp-scale-press-transition-out)] active:[transition:var(--comp-scale-press-transition-in)] active:scale-[var(--comp-button-scale-pressed)]',
  ],
  {
    variants: {
      hierarchy: {
        primary:   'bg-[var(--comp-button-bg-primary)]   text-[var(--comp-button-content-primary)]',
        secondary: 'bg-[var(--comp-button-bg-secondary)] text-[var(--comp-button-content-secondary)]',
        outlined:  'bg-[var(--comp-button-bg-outlined)]  text-[var(--comp-button-content-outlined)]  border border-[var(--comp-button-border-outlined)]',
        ghost:     'bg-[var(--comp-button-bg-ghost)]     text-[var(--comp-button-content-ghost)]',
      },
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
        true:  'w-full active:scale-[var(--comp-button-scale-pressed-fill)]',
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
      hierarchy: 'primary',
      size: 'medium',
      shape: 'basic',
      fullWidth: false,
    },
  },
)

/* ─── State overlay map ────────────────────────────────────────────────────── */

const stateOverlayMap: Record<ButtonHierarchy, string> = {
  primary:   'group-hover:bg-[var(--comp-button-hover-primary)]   group-active:bg-[var(--comp-button-active-primary)]',
  secondary: 'group-hover:bg-[var(--comp-button-hover-secondary)] group-active:bg-[var(--comp-button-active-secondary)]',
  outlined:  'group-hover:bg-[var(--comp-button-hover-outlined)]  group-active:bg-[var(--comp-button-active-outlined)]',
  ghost:     'group-hover:bg-[var(--comp-button-hover-ghost)]     group-active:bg-[var(--comp-button-active-ghost)]',
}

/* ─── Disabled style map ───────────────────────────────────────────────────── */

const disabledMap: Record<ButtonHierarchy, string> = {
  primary:   'bg-[var(--comp-button-bg-primary-disabled)]   text-[var(--comp-button-content-primary-disabled)]',
  secondary: 'bg-[var(--comp-button-bg-secondary-disabled)] text-[var(--comp-button-content-secondary-disabled)]',
  outlined:  'bg-[var(--comp-button-bg-outlined-disabled)]  text-[var(--comp-button-content-outlined-disabled)]  border-[var(--comp-button-border-outlined-disabled)]',
  ghost:     'bg-[var(--comp-button-bg-ghost-disabled)]     text-[var(--comp-button-content-ghost-disabled)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'disabled'>,
    VariantProps<typeof buttonVariants> {
  /** Visual hierarchy of the button.
   * @default 'primary'
   * @see {@link BUTTON_HIERARCHIES} */
  hierarchy?: ButtonHierarchy
  /** Size variant.
   * @default 'medium'
   * @see {@link BUTTON_SIZES} */
  size?: ButtonSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BUTTON_SHAPES} */
  shape?: ButtonShape
  /** Stretch to fill parent width.
   * @default false */
  fullWidth?: boolean
  /** Inactive state. Sets the native `disabled` attribute, so the button also
   * leaves the tab order.
   * @default false */
  disabled?: boolean
  /** In-flight state. Shows a spinner, hides the content and blocks activation, but
   * **keeps focus and the tab order** (`aria-disabled` + `aria-busy`) — a focused button
   * entering loading must not drop the keyboard user to `<body>`.
   * With `asChild` the child's own content cannot be hidden; see `asChild`.
   * @default false */
  loading?: boolean
  /** Leading icon slot. Component handles sizing internally. */
  iconLeading?: ReactNode
  /** Trailing icon slot. */
  iconTrailing?: ReactNode
  /**
   * Native button type. Defaults to `'button'` — HTML's own default is `'submit'`,
   * which turns every button inside a form into a submit button by accident.
   * Not applied when `asChild` is set: the consumer element may not be a `<button>`.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
  /** Radix Slot — renders the child element with this component's styles.
   * The child (a single element) becomes the root: ring, overlay, icons and spinner are
   * placed inside it. There is no content wrapper on this path, so `loading` hides the
   * icon slots but not the child's own content — hide that yourself.
   * The `ref` prop then points at that element although its type stays `HTMLButtonElement` —
   * the same trade-off Radix makes.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function Button({
  hierarchy = 'primary',
  size = 'medium',
  shape = 'basic',
  fullWidth = false,
  disabled = false,
  loading = false,
  iconLeading,
  iconTrailing,
  type = 'button',
  asChild = false,
  className,
  children,
  onClick,
  tabIndex,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  // 가드·type·disabled·tabIndex·aria 의 규칙은 inert.ts 가 소유한다(버튼 계열 7종 공통).
  const { isInert, rootProps } = inertRootProps({ disabled, loading, asChild, type, onClick, tabIndex })

  const resolvedRadius = radiusMap[shape][size]

  // 아이콘 슬롯. asChild 경로에는 감춰 줄 콘텐츠 래퍼가 없으므로 opacity-0 을 직접 건다.
  const iconSlot = (icon: ReactNode) =>
    icon ? (
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center',
          iconSizeMap[size],
          asChild && loading && 'opacity-0',
        )}
        style={{ fontSize: iconFontSizeVar[size] }}
      >
        {icon}
      </span>
    ) : null

  return (
    <Comp
      {...rest}
      // rest 스프레드보다 뒤에 둬야 소비자가 가드·상태 속성을 덮어쓰지 못한다. 규칙은 inert.ts 가 소유한다.
      {...rootProps}
      className={cn(
        buttonVariants({ hierarchy, size, shape, fullWidth }),
        disabled && disabledMap[hierarchy],
        isInert && 'pointer-events-none',
        // asChild 경로엔 콘텐츠 래퍼가 없다(Slottable 은 Slot 의 최상위 자식이어야 한다).
        // 간격은 루트로 올리고, isolate 로 스태킹 컨텍스트를 만들어 링·오버레이를 -z-10 으로
        // 콘텐츠 뒤에 둔다 — 소비자 텍스트는 텍스트 노드라 relative 를 걸 방법이 없기 때문이다.
        asChild && 'isolate',
        asChild && gapMap[size],
        className,
      )}
    >
      {/* Focus ring — visible on keyboard focus only */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          resolvedRadius,
          hierarchy === 'outlined' && '-inset-px',
          'group-focus-visible:opacity-100',
          asChild && '-z-10',
        )}
      />

      {/* State overlay — hover/active backgrounds */}
      {!isInert && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-colors duration-fast ease-enter',
            resolvedRadius,
            stateOverlayMap[hierarchy],
            asChild && '-z-10',
          )}
        />
      )}

      {/* Content — asChild 여부로 갈린다.
          Radix 는 children 을 한 겹만 훑어 Slottable 을 찾으므로(Children.toArray().find),
          Fragment 나 래퍼 span 안에 넣으면 발견되지 않고 그대로 던진다. 그래서 asChild 경로는
          아이콘과 소비자 자식을 루트 직계 형제로 편다. */}
      {asChild ? iconSlot(iconLeading) : null}
      {asChild ? (
        <Slottable>{children}</Slottable>
      ) : (
        // invisible(visibility:hidden) 이 아니라 opacity-0 — visibility:hidden 은 콘텐츠를 접근성
        // 트리에서 빼 버튼의 이름이 사라진다. 시각만 감추고 이름은 남긴다(buttonFamilyContract 가 잰다).
        <span className={cn('relative flex items-center', gapMap[size], loading && 'opacity-0')}>
          {iconSlot(iconLeading)}
          <span className={textMarginMap[size]}>{children}</span>
          {iconSlot(iconTrailing)}
        </span>
      )}
      {asChild ? iconSlot(iconTrailing) : null}

      {/* Loading spinner */}
      {loading && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size]} />
        </span>
      )}
    </Comp>
  )
}
