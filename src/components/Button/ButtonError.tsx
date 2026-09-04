import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import {
  iconSizeMap, iconFontSizeVar, spinnerSizeMap,
  gapMap, textMarginMap, radiusMap,
} from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BUTTON_ERR_HIERARCHIES = ['primary', 'secondary', 'tertiary'] as const
export const BUTTON_ERR_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const BUTTON_ERR_SHAPES = ['basic', 'circular', 'square'] as const

export type ButtonErrHierarchy = (typeof BUTTON_ERR_HIERARCHIES)[number]
export type ButtonErrSize = (typeof BUTTON_ERR_SIZES)[number]
export type ButtonErrShape = (typeof BUTTON_ERR_SHAPES)[number]

/* ─── CVA (size/shape — shared tokens with Universal) ──────────────────────── */

const buttonErrVariants = cva(
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

/* ─── Hierarchy style maps ─────────────────────────────────────────────────── */

const hierarchyMap: Record<ButtonErrHierarchy, { base: string; disabled: string }> = {
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

/* ─── State overlay — all hierarchies use on-bright ────────────────────────── */

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ButtonErrorProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonErrVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link BUTTON_ERR_HIERARCHIES} */
  hierarchy?: ButtonErrHierarchy
  /** Size variant.
   * @default 'medium'
   * @see {@link BUTTON_ERR_SIZES} */
  size?: ButtonErrSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BUTTON_ERR_SHAPES} */
  shape?: ButtonErrShape
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
  /** Leading icon slot. */
  iconLeading?: ReactNode
  /** Trailing icon slot. */
  iconTrailing?: ReactNode
  /** Radix Slot — renders the child element with this component's styles.
   * The child (a single element) becomes the root: ring, overlay, icons and spinner are
   * placed inside it. There is no content wrapper on this path, so `loading` hides the
   * icon slots but not the child's own content — hide that yourself.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function ButtonError({
  hierarchy = 'primary',
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
  onClick,
  ...rest
}: ButtonErrorProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  // aria-disabled 는 상태를 알릴 뿐 활성화를 막지 못하고, pointer-events-none 은 CSS 라
  // 키보드 Enter/Space 에 무력하다. 브라우저가 Enter/Space 를 click 으로 바꿔 주므로
  // 여기 한 곳에서 막으면 포인터와 키보드가 함께 덮인다.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isInert) {
      // type 을 지정하지 않아 form 안에서는 기본값이 submit 이다 — click 의 기본 동작을
      // 막는 것이 곧 제출을 막는 것이다. 네이티브 disabled 는 click 을 아예 발생시키지
      // 않으므로, 조상이 대신 반응하지 않도록 전파까지 끊어 그 동작에 맞춘다.
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  const resolvedRadius = radiusMap[shape][size]
  const styles = hierarchyMap[hierarchy]

  // 아이콘 슬롯. asChild 경로에는 감춰 줄 콘텐츠 래퍼가 없으므로 invisible 을 직접 건다.
  const iconSlot = (icon: ReactNode) =>
    icon ? (
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center',
          iconSizeMap[size],
          asChild && loading && 'invisible',
        )}
        style={{ fontSize: iconFontSizeVar[size] }}
      >
        {icon}
      </span>
    ) : null

  return (
    <Comp
      {...rest}
      // rest 스프레드보다 뒤에 둬야 소비자 onClick 이 가드를 덮어쓰지 않는다.
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonErrVariants({ size, shape, fullWidth }),
        disabled ? styles.disabled : styles.base,
        isInert && 'pointer-events-none',
        // asChild 경로엔 콘텐츠 래퍼가 없다(Slottable 은 Slot 의 최상위 자식이어야 한다).
        // 간격은 루트로 올리고, isolate 로 스태킹 컨텍스트를 만들어 링·오버레이를 -z-10 으로
        // 콘텐츠 뒤에 둔다 — 소비자 텍스트는 텍스트 노드라 relative 를 걸 방법이 없기 때문이다.
        asChild && 'isolate',
        asChild && gapMap[size],
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
          asChild && '-z-10',
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
        <span className={cn('relative flex items-center', gapMap[size], loading && 'invisible')}>
          {iconSlot(iconLeading)}
          <span className={textMarginMap[size]}>{children}</span>
          {iconSlot(iconTrailing)}
        </span>
      )}
      {asChild ? iconSlot(iconTrailing) : null}

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size]} />
        </span>
      )}
    </Comp>
  )
}
