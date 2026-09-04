import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import {
  iconSizeMap, iconFontSizeVar, spinnerSizeMap,
  gapMap, textMarginMap, radiusMap,
  type ButtonSize, type ButtonShape,
} from './shared'

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
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
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
  ...rest
}: ButtonProps) {
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
      // asChild 면 소비자 요소가 <button> 이 아닐 수 있어 붙이지 않는다.
      type={asChild ? undefined : type}
      // 네이티브 disabled 는 <button> 에만 유효하다. asChild 는 소비자가 어떤 요소를 줄지
      // 모르므로(<a>·<div> 면 무의미한 속성이 붙는다) 대신 tabIndex 로 tab 순서에서 뺀다 —
      // 요소 종류와 무관하게 "건너뛴다"는 결과가 같아진다. 활성화 차단은 onClick 가드가 한다.
      disabled={asChild ? undefined : disabled}
      tabIndex={asChild && disabled ? -1 : undefined}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
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
