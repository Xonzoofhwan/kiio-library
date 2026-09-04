import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { iconSizeMap, iconFontSizeVar, spinnerSizeMap } from '@/components/Button/shared'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TEXT_BUTTON_COLORS = ['neutral', 'blue'] as const
export const TEXT_BUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const

export type TextButtonColor = (typeof TEXT_BUTTON_COLORS)[number]
export type TextButtonSize = (typeof TEXT_BUTTON_SIZES)[number]

/* ─── CVA (size only — colors handled via style maps) ──────────────────────── */

const textButtonVariants = cva(
  [
    'group relative inline-flex items-center justify-center cursor-pointer select-none',
    'will-change-transform [transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-out)] active:[transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-in)] active:scale-[var(--comp-text-button-scale-pressed)]',
  ],
  {
    variants: {
      size: {
        xLarge: 'h-[var(--comp-text-button-height-xl)] typography-18-medium',
        large:  'h-[var(--comp-text-button-height-lg)] typography-16-medium',
        medium: 'h-[var(--comp-text-button-height-md)] typography-14-medium',
        small:  'h-[var(--comp-text-button-height-sm)] typography-12-medium',
      },
      fullWidth: {
        true:  'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      size: 'medium',
      fullWidth: false,
    },
  },
)

/* ─── Color × Surface style maps ──────────────────────────────────────────── */

type SurfaceKey = 'onBright' | 'onDim'

type ColorStyles = {
  base: string
  hover: string
  active: string
  disabled: string
}

const colorStyleMap: Record<TextButtonColor, Record<SurfaceKey, ColorStyles>> = {
  neutral: {
    onBright: {
      base:     'text-semantic-text-on-bright-800',
      hover:    'hover:text-semantic-text-on-bright-900',
      active:   'active:text-semantic-text-on-bright-950',
      disabled: 'text-semantic-neutral-black-alpha-300',
    },
    onDim: {
      base:     'text-semantic-text-on-dim-800',
      hover:    'hover:text-semantic-text-on-dim-900',
      active:   'active:text-semantic-text-on-dim-950',
      disabled: 'text-semantic-neutral-white-alpha-300',
    },
  },
  blue: {
    onBright: {
      base:     'text-semantic-emphasized-blue-500',
      hover:    'hover:text-semantic-emphasized-blue-600',
      active:   'active:text-semantic-emphasized-blue-700',
      disabled: 'text-semantic-emphasized-blue-200',
    },
    onDim: {
      base:     'text-semantic-emphasized-blue-500',
      hover:    'hover:text-semantic-emphasized-blue-400',
      active:   'active:text-semantic-emphasized-blue-300',
      disabled: 'text-semantic-emphasized-blue-800',
    },
  },
}

/* ─── Local size-dependent maps ───────────────────────────────────────────── */

const gapMap: Record<TextButtonSize, string> = {
  xLarge: 'gap-[var(--comp-text-button-gap-xl)]',
  large:  'gap-[var(--comp-text-button-gap-lg)]',
  medium: 'gap-0',
  small:  'gap-0',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface TextButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'color'>,
    VariantProps<typeof textButtonVariants> {
  /** Color variant.
   * @default 'neutral'
   * @see {@link TEXT_BUTTON_COLORS} */
  color?: TextButtonColor
  /** Size variant.
   * @default 'medium'
   * @see {@link TEXT_BUTTON_SIZES} */
  size?: TextButtonSize
  /** Use on-dim text colors for dark/contrasting surfaces.
   * @default false */
  onDim?: boolean
  /** Stretch to fill parent width.
   * @default false */
  fullWidth?: boolean
  /** Inactive state. Native `disabled` — removed from tab order, not submitted.
   * @default false */
  disabled?: boolean
  /** In-flight state. Shows spinner, hides content, blocks activation —
   * but **keeps focus and tab order** (`aria-disabled` + `aria-busy`, not native `disabled`).
   * Combined with `asChild` the spinner is not rendered; see implementation note.
   * @default false */
  loading?: boolean
  /** Leading icon slot. */
  iconLeading?: ReactNode
  /** Trailing icon slot. */
  iconTrailing?: ReactNode
  /** Radix Slot — renders the single child element with this component's styles.
   * Consumer children are wrapped in `Slottable`, so the ring/icon layers become
   * children of that element instead of throwing.
   * @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function TextButton({
  color = 'neutral',
  size = 'medium',
  onDim = false,
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
}: TextButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isInert = disabled || loading

  const surfaceKey: SurfaceKey = onDim ? 'onDim' : 'onBright'
  const styles = colorStyleMap[color][surfaceKey]

  // loading 은 "요청이 끝나면 다시 쓸 수 있다"는 뜻이라 포커스를 유지해야 한다.
  // native disabled 를 켜면 누르는 순간 포커스가 <body> 로 떨어져 키보드 사용자가 자리를 잃고,
  // 스크린리더는 aria-busy 를 읽을 대상 자체를 잃는다. 그래서 native disabled 는 진짜 disabled 에만 건다.
  // 대신 aria-disabled 는 시맨틱일 뿐 동작을 막지 않고 pointer-events-none 은 CSS 라 키보드에 무력하므로,
  // click 을 여기서 소비한다. Enter/Space 는 브라우저가 click 으로 바꿔 주므로 이 가드 하나로 둘 다 덮인다.
  // preventDefault 는 form 의 기본 submit 까지 막는다 — 이 컴포넌트는 type 을 지정하지 않아
  // form 안에서 기본값이 submit 이고, 그 제출은 소비자 onClick 이 아니라 브라우저 기본 동작이기 때문이다.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isInert) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  // 아이콘 슬롯. asChild 경로에서는 콘텐츠 래퍼가 없어 루트의 직계 자식이 되므로 함수로 뽑는다.
  const renderIcon = (icon: ReactNode) =>
    icon ? (
      <span
        className={cn('flex-shrink-0 flex items-center justify-center', iconSizeMap[size])}
        style={{ fontSize: iconFontSizeVar[size] }}
      >
        {icon}
      </span>
    ) : null

  return (
    <Comp
      {...rest}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      className={cn(
        textButtonVariants({ size, fullWidth }),
        // asChild 는 콘텐츠 래퍼를 쓸 수 없으므로(아래 주석) 아이콘 간격을 루트로 올린다.
        asChild && gapMap[size],
        disabled ? styles.disabled : [styles.base, styles.hover, styles.active],
        isInert && 'pointer-events-none',
        className,
      )}
    >
      {/* Focus ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border-2 border-[var(--comp-button-focus-border)] opacity-0 transition-opacity duration-fast ease-enter group-focus-visible:opacity-100"
      />

      {/* Content — asChild 여부로 트리가 갈린다.
          Radix 는 React.Children.toArray(children).find(isSlottable) 로 **한 겹만** 훑는다.
          그래서 Slottable 은 Slot 의 최상위 자식이어야 하고, Fragment 나 래퍼 span 안에 넣으면
          발견되지 않아 SlotClone 이 React.Children.only(null) 로 던진다.
          아래 세 표현식을 묶지 마라 — 묶는 순간 asChild 가 다시 깨진다. */}
      {asChild ? renderIcon(iconLeading) : null}
      {asChild ? (
        <Slottable>{children}</Slottable>
      ) : (
        <span className={cn('relative flex items-center', gapMap[size], loading && 'invisible')}>
          {renderIcon(iconLeading)}
          <span>{children}</span>
          {renderIcon(iconTrailing)}
        </span>
      )}
      {asChild ? renderIcon(iconTrailing) : null}

      {/* Loading spinner.
          asChild 에서는 그리지 않는다: 콘텐츠를 숨기는 invisible 은 래퍼에 걸리는데 그 래퍼가 없고,
          소비자 자식은 Radix 가 cloneElement 로 되살리는 요소라 우리가 클래스를 얹을 자리가 없다.
          텍스트를 숨기지 못한 채 스피너만 겹쳐 그리면 둘 다 못 읽으므로, 이 조합에서는
          시각 표시를 포기하고 의미(aria-busy·aria-disabled)와 활성화 차단만 유지한다. */}
      {loading && !asChild && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={spinnerSizeMap[size]} />
        </span>
      )}
    </Comp>
  )
}
