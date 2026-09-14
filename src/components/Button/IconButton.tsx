import { type ComponentPropsWithRef, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap, radiusMap } from './shared'
import { inertRootProps } from './inert'
import type { ButtonSize, ButtonShape } from './shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ICON_BUTTON_HIERARCHIES = ['primary', 'secondary', 'outlined', 'ghost'] as const
export const ICON_BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const ICON_BUTTON_SHAPES = ['basic', 'circular', 'square'] as const

export type IconButtonHierarchy = (typeof ICON_BUTTON_HIERARCHIES)[number]
export type IconButtonSize = (typeof ICON_BUTTON_SIZES)[number]
export type IconButtonShape = (typeof ICON_BUTTON_SHAPES)[number]

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const iconButtonVariants = cva(
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
      hierarchy: 'primary',
      size: 'medium',
      shape: 'basic',
    },
  },
)

/* ─── State overlay map ────────────────────────────────────────────────────── */

const stateOverlayMap: Record<IconButtonHierarchy, string> = {
  primary:   'group-hover:bg-[var(--comp-button-hover-primary)]   group-active:bg-[var(--comp-button-active-primary)]',
  secondary: 'group-hover:bg-[var(--comp-button-hover-secondary)] group-active:bg-[var(--comp-button-active-secondary)]',
  outlined:  'group-hover:bg-[var(--comp-button-hover-outlined)]  group-active:bg-[var(--comp-button-active-outlined)]',
  ghost:     'group-hover:bg-[var(--comp-button-hover-ghost)]     group-active:bg-[var(--comp-button-active-ghost)]',
}

/* ─── Disabled style map ───────────────────────────────────────────────────── */

const disabledMap: Record<IconButtonHierarchy, string> = {
  primary:   'bg-[var(--comp-button-bg-primary-disabled)]   text-[var(--comp-button-content-primary-disabled)]',
  secondary: 'bg-[var(--comp-button-bg-secondary-disabled)] text-[var(--comp-button-content-secondary-disabled)]',
  outlined:  'bg-[var(--comp-button-bg-outlined-disabled)]  text-[var(--comp-button-content-outlined-disabled)]  border-[var(--comp-button-border-outlined-disabled)]',
  ghost:     'bg-[var(--comp-button-bg-ghost-disabled)]     text-[var(--comp-button-content-ghost-disabled)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface IconButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'disabled'>,
    VariantProps<typeof iconButtonVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link ICON_BUTTON_HIERARCHIES} */
  hierarchy?: IconButtonHierarchy
  /** Size variant. IconButton is always square (width = height).
   * @default 'medium'
   * @see {@link ICON_BUTTON_SIZES} */
  size?: IconButtonSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link ICON_BUTTON_SHAPES} */
  shape?: IconButtonShape
  /** Inactive state. Sets the native `disabled` attribute, so the button also
   * leaves the tab order.
   * @default false */
  disabled?: boolean
  /** In-flight state. Shows a spinner over the icon and blocks activation, but
   * **keeps focus and the tab order** (`aria-disabled` + `aria-busy`) — a focused button
   * entering loading must not drop the keyboard user to `<body>`.
   * @default false */
  loading?: boolean
  /** Icon to render. Component handles sizing internally.
   * @example <IconButton icon={<Icon name="settings" />} /> */
  icon: ReactNode
  /** Accessible label (required since there is no visible text).
   * @example aria-label="Settings" */
  'aria-label': string
  /**
   * Native button type. Defaults to `'button'` — HTML's own default is `'submit'`,
   * which turns every button inside a form into a submit button by accident.
   * Not applied when `asChild` is set: the consumer element may not be a `<button>`.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
  /** Radix Slot — renders the child element with this component's styles.
   * The child (a single element, e.g. an `<a>`) becomes the root: ring, overlay, icon and
   * spinner are placed inside it. Without `asChild` any `children` are ignored — the icon
   * is the only content.
   * The `ref` prop then points at that element although its type stays `HTMLButtonElement` —
   * the same trade-off Radix makes.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function IconButton({
  hierarchy = 'primary',
  size = 'medium',
  shape = 'basic',
  disabled = false,
  loading = false,
  icon,
  type = 'button',
  asChild = false,
  className,
  children,
  onClick,
  tabIndex,
  ...rest
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button'
  // 가드·type·disabled·tabIndex·aria 의 규칙은 inert.ts 가 소유한다(버튼 계열 7종 공통).
  const { isInert, rootProps } = inertRootProps({ disabled, loading, asChild, type, onClick, tabIndex })

  const resolvedRadius = radiusMap[shape as ButtonShape][size as ButtonSize]

  return (
    <Comp
      {...rest}
      // rest 스프레드보다 뒤에 둬야 소비자가 가드·상태 속성을 덮어쓰지 못한다. 규칙은 inert.ts 가 소유한다.
      {...rootProps}
      className={cn(
        iconButtonVariants({ hierarchy, size, shape }),
        disabled && disabledMap[hierarchy],
        isInert && 'pointer-events-none',
        // asChild 경로에서는 소비자 요소가 루트가 된다. isolate 로 스태킹 컨텍스트를 만들고
        // 링·오버레이를 -z-10 으로 내려, 소비자가 자식 안에 넣은 콘텐츠가 오버레이 밑에
        // 깔리지 않게 한다 — 텍스트 노드에는 relative 를 걸 수 없기 때문이다.
        asChild && 'isolate',
        className,
      )}
    >
      {/* Focus ring */}
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

      {/* State overlay */}
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

      {/* Icon — loading 이면 opacity-0 으로 감춘다. visibility:hidden 은 콘텐츠를 접근성 트리에서 빼므로
          계열 전체가 opacity-0 을 쓴다(IconButton 은 aria-label 이라 이름엔 무해하지만 규칙을 통일한다). */}
      <span
        className={cn(
          'relative flex-shrink-0 flex items-center justify-center',
          iconSizeMap[size as ButtonSize],
          loading && 'opacity-0',
        )}
        style={{ fontSize: iconFontSizeVar[size as ButtonSize] }}
      >
        {icon}
      </span>

      {/* asChild — Slottable 은 Slot 의 최상위 자식이어야 발견된다(Radix 는 children 을
          한 겹만 훑는다). 감싸는 순간 그대로 던지므로 여기에 형제로 둔다. IconButton 은
          보이는 텍스트가 없어 소비자 자식은 요소 하나뿐이다. */}
      {asChild ? <Slottable>{children}</Slottable> : null}

      {/* Loading spinner */}
      {loading && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size as ButtonSize]} />
        </span>
      )}
    </Comp>
  )
}
