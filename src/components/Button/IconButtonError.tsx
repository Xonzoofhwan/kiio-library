import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap, radiusMap } from './shared'
import type { ButtonSize, ButtonShape } from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ICON_BUTTON_ERR_HIERARCHIES = ['primary', 'secondary', 'tertiary'] as const
export const ICON_BUTTON_ERR_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const ICON_BUTTON_ERR_SHAPES = ['basic', 'circular', 'square'] as const

export type IconButtonErrHierarchy = (typeof ICON_BUTTON_ERR_HIERARCHIES)[number]
export type IconButtonErrSize = (typeof ICON_BUTTON_ERR_SIZES)[number]
export type IconButtonErrShape = (typeof ICON_BUTTON_ERR_SHAPES)[number]

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const iconButtonErrVariants = cva(
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

/* ─── Hierarchy style maps ─────────────────────────────────────────────────── */

const hierarchyMap: Record<IconButtonErrHierarchy, { base: string; disabled: string }> = {
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

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface IconButtonErrorProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof iconButtonErrVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link ICON_BUTTON_ERR_HIERARCHIES} */
  hierarchy?: IconButtonErrHierarchy
  /** Size variant. Always square.
   * @default 'medium'
   * @see {@link ICON_BUTTON_ERR_SIZES} */
  size?: IconButtonErrSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link ICON_BUTTON_ERR_SHAPES} */
  shape?: IconButtonErrShape
  /** Inactive state. Sets the native `disabled` attribute, so the button also
   * leaves the tab order.
   * @default false */
  disabled?: boolean
  /** In-flight state. Shows a spinner over the icon and blocks activation, but
   * **keeps focus and the tab order** (`aria-disabled` + `aria-busy`) — a focused button
   * entering loading must not drop the keyboard user to `<body>`.
   * @default false */
  loading?: boolean
  /** Icon to render. */
  icon: ReactNode
  /** Accessible label (required — no visible text). */
  'aria-label': string
  /** Radix Slot — renders the child element with this component's styles.
   * The child (a single element, e.g. an `<a>`) becomes the root: ring, overlay, icon and
   * spinner are placed inside it. Without `asChild` any `children` are ignored — the icon
   * is the only content.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function IconButtonError({
  hierarchy = 'primary',
  size = 'medium',
  shape = 'basic',
  disabled = false,
  loading = false,
  icon,
  asChild = false,
  className,
  children,
  onClick,
  ...rest
}: IconButtonErrorProps) {
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

  const resolvedRadius = radiusMap[shape as ButtonShape][size as ButtonSize]
  const styles = hierarchyMap[hierarchy]

  return (
    <Comp
      {...rest}
      // rest 스프레드보다 뒤에 둬야 소비자 onClick 이 가드를 덮어쓰지 않는다.
      onClick={handleClick}
      // 네이티브 disabled 는 <button> 에만 유효하다. asChild 는 소비자가 어떤 요소를 줄지
      // 모르므로(<a>·<div> 면 무의미한 속성이 붙는다) 대신 tabIndex 로 tab 순서에서 뺀다 —
      // 요소 종류와 무관하게 "건너뛴다"는 결과가 같아진다. 활성화 차단은 onClick 가드가 한다.
      disabled={asChild ? undefined : disabled}
      tabIndex={asChild && disabled ? -1 : undefined}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        iconButtonErrVariants({ size, shape }),
        disabled ? styles.disabled : styles.base,
        isInert && 'pointer-events-none',
        // asChild 경로에서는 소비자 요소가 루트가 된다. isolate 로 스태킹 컨텍스트를 만들고
        // 링·오버레이를 -z-10 으로 내려, 소비자가 자식 안에 넣은 콘텐츠가 오버레이 밑에
        // 깔리지 않게 한다 — 텍스트 노드에는 relative 를 걸 수 없기 때문이다.
        asChild && 'isolate',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          resolvedRadius,
          'group-focus-visible:opacity-100',
          asChild && '-z-10',
        )}
      />

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

      {/* asChild — Slottable 은 Slot 의 최상위 자식이어야 발견된다(Radix 는 children 을
          한 겹만 훑는다). 감싸는 순간 그대로 던지므로 여기에 형제로 둔다. IconButton 은
          보이는 텍스트가 없어 소비자 자식은 요소 하나뿐이다. */}
      {asChild ? <Slottable>{children}</Slottable> : null}

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size as ButtonSize]} />
        </span>
      )}
    </Comp>
  )
}
