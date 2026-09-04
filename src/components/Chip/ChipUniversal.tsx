import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BadgeLabel } from '@/components/Badge'
import { CHIP_UNIVERSAL_SIZES, type ChipUniversalSize } from './shared'

export { CHIP_UNIVERSAL_SIZES }
export type { ChipUniversalSize }

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

/**
 * 칩이 무엇으로 쓰이는지. 접근성 속성이 여기서 갈린다 —
 * `toggle` 은 눌린 상태를 알리는 버튼(`aria-pressed`), `trigger` 는 팝업을 여는 버튼(`aria-expanded`),
 * `action` 은 상태가 없는 실행·이동(속성 없음)이다.
 * 같은 시각 상태(`selected`)를 세 의미로 쓰던 것을 이름으로 분리한 것이다.
 *
 * `action` 이 필요한 이유: `asChild` 로 `<a href>` 를 그리면 role 이 link 가 되는데
 * link 는 `aria-pressed` 를 허용하지 않는다 — 기본값 `toggle` 그대로 두면 ARIA 위반이 된다.
 */
export const CHIP_UNIVERSAL_PURPOSES = ['toggle', 'trigger', 'action'] as const
export type ChipUniversalPurpose = (typeof CHIP_UNIVERSAL_PURPOSES)[number]

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

/* ─── Size maps ───────────────────────────────────────────────────────────── */

/**
 * 간격·아이콘 크기는 CVA 밖에 둔다. asChild 경로에서는 콘텐츠 래퍼가 사라져
 * `gap` 을 루트로 올려야 하는데, variant 문자열 안에 섞여 있으면
 * 두 경로가 같은 토큰을 쓰는지 한 자리에서 확인할 수 없다.
 */
const gapMap = {
  large: 'gap-[var(--comp-chip-universal-gap-lg)]',
  medium: 'gap-[var(--comp-chip-universal-gap-md)]',
} as const

const innerGapMap = {
  large: 'gap-[var(--comp-chip-universal-inner-gap-lg)]',
  medium: 'gap-[var(--comp-chip-universal-inner-gap-md)]',
} as const

const iconSizeMap = {
  large: 'size-[var(--comp-chip-universal-icon-lg)]',
  medium: 'size-[var(--comp-chip-universal-icon-md)]',
} as const

/** 인라인 font-size 는 토큰을 그대로 참조한다 — 값을 JS 에 복제하면 토큰이 바뀔 때 갈린다. */
const iconFontSizeVar = {
  large: 'var(--comp-chip-universal-icon-lg)',
  medium: 'var(--comp-chip-universal-icon-md)',
} as const

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface ChipUniversalProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** 시각적 선택 상태. 칠하기만 하고 토글·열림 동작은 소비자가 onClick 으로 정한다.
   * `purpose='toggle'` 이면 `aria-pressed`, `purpose='trigger'` 이면 `aria-expanded` 로 나가고
   * `purpose='action'` 이면 어디에도 실리지 않는다. 즉 trigger 에서는 "팝업이 열려 있다"는 뜻이다 —
   * 선택 표시와 열림 상태가 다른 화면이라면 `aria-expanded` 를 직접 넘겨 덮어라
   * (spread 가 마지막이라 소비자 값이 이긴다).
   * @default false */
  selected?: boolean
  /** 칩의 용도. 접근성 속성을 가른다 — `toggle` 은 `aria-pressed`,
   * `trigger` 는 `aria-expanded` + `aria-haspopup`, `action` 은 아무 상태 속성도 내지 않는다.
   * 링크(`asChild` + `<a href>`)나 한 번 실행되는 동작에는 `action` 을 쓴다.
   * @default 'toggle'
   * @see {@link CHIP_UNIVERSAL_PURPOSES} */
  purpose?: ChipUniversalPurpose
  /** Size variant.
   * @default 'large'
   * @see {@link CHIP_UNIVERSAL_SIZES} */
  size?: ChipUniversalSize
  /** Leading icon slot. 컴포넌트가 크기를 정한다. */
  iconLeading?: ReactNode
  /** Trailing icon slot. 컴포넌트가 크기를 정한다. */
  iconTrailing?: ReactNode
  /** 모서리 배지의 내용. `BadgeLabel size='nano'` 로 그려진다.
   * 내용 없는 점 표시가 필요하면 이 prop 이 아니라 `BadgeDot` 을 쓴다. */
  badgeLabel?: ReactNode
  /** Radix Slot — 자식 요소를 칩 스타일로 렌더한다.
   * children 은 **단일 React 엘리먼트**여야 한다(`<a href="…">Go</a>` 등).
   * 이때 콘텐츠 래퍼가 사라져 간격이 루트의 `gap` 하나로 통일된다.
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
      purpose = 'toggle',
      size = 'large',
      iconLeading,
      iconTrailing,
      badgeLabel,
      asChild = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isTrigger = purpose === 'trigger'
    const isToggle = purpose === 'toggle'

    const renderIcon = (icon: ReactNode) =>
      icon ? (
        <span
          className={cn('flex-shrink-0 [&>*]:[font-size:inherit]', iconSizeMap[size])}
          style={{ fontSize: iconFontSizeVar[size] }}
        >
          {icon}
        </span>
      ) : null

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        // 용도별로 하나만 낸다. 드롭다운 트리거에 aria-pressed 를 붙이면
        // 스크린리더가 "토글 버튼, 눌리지 않음"으로 읽어 열림 여부를 알리지 못하고,
        // link 로 렌더되는 action 에서는 aria-pressed 자체가 허용되지 않는 속성이다.
        aria-pressed={isToggle ? selected : undefined}
        aria-expanded={isTrigger ? selected : undefined}
        // 팝업의 종류(menu/listbox/dialog)는 칩이 알 수 없으므로 기본값은 'true'(=menu 상당)로 둔다.
        // 정확한 종류는 소비자가 aria-haspopup 을 넘겨 덮는다 — spread 가 마지막이라 그 값이 이긴다.
        aria-haspopup={isTrigger || undefined}
        disabled={disabled}
        className={cn(
          chipUniversalVariants({ size, selected }),
          // asChild 에서는 콘텐츠 래퍼를 쓸 수 없다(Slottable 이 Slot 의 최상위 자식이어야 한다).
          // 래퍼가 없으니 간격을 루트로 올린다. inner-gap 과 텍스트 px-1 이 합쳐진 자리를
          // 바깥 gap 하나가 대신하므로, iconLeading↔텍스트 간격은 두 경로가 같고
          // 텍스트↔iconTrailing 만 px-1 만큼 좁아진다.
          asChild && gapMap[size],
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

        {/* Content — asChild 경로는 Slottable 이 최상위 자식이어야 해서 래퍼 없이 형제로 편다.
            Fragment 로 묶으면 Radix 가 한 겹만 훑어 Slottable 을 못 찾고 그대로 던진다.
            래퍼가 없어 z-[1] 도 걸 수 없으므로 hover/press 틴트가 콘텐츠 위에 깔린다 —
            상태 오버레이는 알파 5~8% 라 육안 차이가 없고, 그 대가로 asChild 가 실제로 동작한다. */}
        {asChild ? renderIcon(iconLeading) : null}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className={cn('relative z-[1] inline-flex items-center', gapMap[size])}>
            <span className={cn('inline-flex items-center', innerGapMap[size])}>
              {renderIcon(iconLeading)}
              <span className="px-1">{children}</span>
            </span>
            {renderIcon(iconTrailing)}
          </span>
        )}
        {asChild ? renderIcon(iconTrailing) : null}

        {/* Badge */}
        {badgeLabel && (
          <span className="absolute -top-1 -right-1 z-[2]">
            <BadgeLabel size="nano" shape="circular" weight="heavy" color="red">
              {badgeLabel}
            </BadgeLabel>
          </span>
        )}
      </Comp>
    )
  },
)
ChipUniversal.displayName = 'ChipUniversal'
