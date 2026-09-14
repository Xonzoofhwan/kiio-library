import { type ComponentPropsWithRef, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import {
  iconSizeMap, iconFontSizeVar, spinnerSizeMap,
  gapMap, textMarginMap, radiusMap,
} from './shared'
import { inertRootProps } from './inert'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BUTTON_EMP_HIERARCHIES = ['primary', 'secondary', 'ghost'] as const
export const BUTTON_EMP_COLORS = ['purple', 'blue', 'orange'] as const
export const BUTTON_EMP_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const BUTTON_EMP_SHAPES = ['basic', 'circular', 'square'] as const

export type ButtonEmpHierarchy = (typeof BUTTON_EMP_HIERARCHIES)[number]
export type ButtonEmpColor = (typeof BUTTON_EMP_COLORS)[number]
export type ButtonEmpSize = (typeof BUTTON_EMP_SIZES)[number]
export type ButtonEmpShape = (typeof BUTTON_EMP_SHAPES)[number]

/* ─── CVA (size/shape only — colors handled via maps) ──────────────────────── */

const buttonEmpVariants = cva(
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

/* ─── Color × Hierarchy style maps ─────────────────────────────────────────── */

type HierarchyStyles = {
  base: string
  disabled: string
}

const colorHierarchyMap: Record<ButtonEmpColor, Record<ButtonEmpHierarchy, HierarchyStyles>> = {
  purple: {
    primary: {
      base:     'bg-semantic-emphasized-purple-500 text-semantic-neutral-solid-0',
      disabled: 'bg-semantic-emphasized-purple-200 text-semantic-neutral-white-alpha-600',
    },
    secondary: {
      base:     'bg-semantic-emphasized-purple-100 text-semantic-emphasized-purple-600',
      disabled: 'bg-semantic-emphasized-purple-100 text-semantic-emphasized-purple-200',
    },
    ghost: {
      base:     'bg-transparent text-semantic-emphasized-purple-500',
      disabled: 'bg-transparent text-semantic-emphasized-purple-200',
    },
  },
  blue: {
    primary: {
      base:     'bg-semantic-emphasized-blue-500 text-semantic-neutral-solid-0',
      disabled: 'bg-semantic-emphasized-blue-200 text-semantic-neutral-white-alpha-600',
    },
    secondary: {
      base:     'bg-semantic-emphasized-blue-100 text-semantic-emphasized-blue-600',
      disabled: 'bg-semantic-emphasized-blue-100 text-semantic-emphasized-blue-200',
    },
    ghost: {
      base:     'bg-transparent text-semantic-emphasized-blue-500',
      disabled: 'bg-transparent text-semantic-emphasized-blue-200',
    },
  },
  orange: {
    primary: {
      base:     'bg-semantic-emphasized-orange-500 text-semantic-neutral-solid-0',
      disabled: 'bg-semantic-emphasized-orange-200 text-semantic-neutral-white-alpha-600',
    },
    secondary: {
      base:     'bg-semantic-emphasized-orange-100 text-semantic-emphasized-orange-600',
      disabled: 'bg-semantic-emphasized-orange-100 text-semantic-emphasized-orange-200',
    },
    ghost: {
      base:     'bg-transparent text-semantic-emphasized-orange-500',
      disabled: 'bg-transparent text-semantic-emphasized-orange-200',
    },
  },
}

/* ─── State overlay — same for all colors, all hierarchies use on-bright ──── */

const stateOverlay = 'group-hover:bg-semantic-state-on-bright-50 group-active:bg-semantic-state-on-bright-70'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ButtonEmphasizedProps
  extends Omit<ComponentPropsWithRef<'button'>, 'disabled' | 'color'>,
    VariantProps<typeof buttonEmpVariants> {
  /** Visual hierarchy.
   * @default 'primary'
   * @see {@link BUTTON_EMP_HIERARCHIES} */
  hierarchy?: ButtonEmpHierarchy
  /** Emphasized color.
   * @default 'purple'
   * @see {@link BUTTON_EMP_COLORS} */
  color?: ButtonEmpColor
  /** Size variant.
   * @default 'medium'
   * @see {@link BUTTON_EMP_SIZES} */
  size?: ButtonEmpSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link BUTTON_EMP_SHAPES} */
  shape?: ButtonEmpShape
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

export function ButtonEmphasized({
  hierarchy = 'primary',
  color = 'purple',
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
}: ButtonEmphasizedProps) {
  const Comp = asChild ? Slot : 'button'
  // 가드·type·disabled·tabIndex·aria 의 규칙은 inert.ts 가 소유한다(버튼 계열 7종 공통).
  const { isInert, rootProps } = inertRootProps({ disabled, loading, asChild, type, onClick, tabIndex })

  const resolvedRadius = radiusMap[shape][size]
  const styles = colorHierarchyMap[color][hierarchy]

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
        buttonEmpVariants({ size, shape, fullWidth }),
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
