import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
  type FocusEvent,
  type ButtonHTMLAttributes,
} from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  BadgeLabel, BadgeDot,
  type BadgeColor, type BadgeWeight, type BadgeDotSize,
} from '@/components/Badge'
import { Icon } from '@/components/icons/Icon'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const NAV_VERTICAL_SIZES = ['large', 'small'] as const
export const NAV_VERTICAL_SHAPES = ['basic', 'circular', 'square'] as const

export type NavVerticalSize = (typeof NAV_VERTICAL_SIZES)[number]
export type NavVerticalShape = (typeof NAV_VERTICAL_SHAPES)[number]

/* ─── Badge config types ──────────────────────────────────────────────────── */

export type BadgeLabelConfig = {
  children: ReactNode
  color?: BadgeColor
  weight?: BadgeWeight
}

export type BadgeDotConfig = {
  color?: BadgeColor
  size?: BadgeDotSize
  outlined?: boolean
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface NavVerticalContextValue {
  size: NavVerticalSize
  shape: NavVerticalShape
  value: string | undefined
  onValueChange: (value: string) => void
}

const NavVerticalContext = createContext<NavVerticalContextValue>({
  size: 'large',
  shape: 'basic',
  value: undefined,
  onValueChange: () => {},
})

/* ─── CVA — NavVerticalItem ────────────────────────────────────────────────── */

const navItemVariants = cva(
  [
    'group relative flex w-full items-center cursor-pointer select-none outline-none',
    'will-change-transform [transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-out)] active:[transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-in)] active:scale-[var(--comp-nav-vertical-scale-pressed)]',
  ],
  {
    variants: {
      size: {
        large: [
          'px-[var(--comp-nav-vertical-item-px-lg)]',
          'py-[var(--comp-nav-vertical-item-py-lg)]',
        ],
        small: [
          'px-[var(--comp-nav-vertical-item-px-sm)]',
          'py-[var(--comp-nav-vertical-item-py-sm)]',
        ],
      },
      shape: {
        basic: 'rounded-[var(--comp-nav-vertical-item-radius-basic)]',
        circular: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      size: 'large',
      shape: 'basic',
    },
  },
)

/* ─── Size-dependent maps ─────────────────────────────────────────────────── */

const iconSizeMap: Record<NavVerticalSize, string> = {
  large: 'size-[var(--comp-nav-vertical-item-icon-lg)]',
  small: 'size-[var(--comp-nav-vertical-item-icon-sm)]',
}

const iconFontSizeVar: Record<NavVerticalSize, string> = {
  large: 'var(--comp-nav-vertical-item-icon-lg)',
  small: 'var(--comp-nav-vertical-item-icon-sm)',
}

const typographyMap: Record<NavVerticalSize, string> = {
  large: 'typography-16-medium',
  small: 'typography-14-medium',
}

const groupTypographyMap: Record<NavVerticalSize, string> = {
  large: 'typography-13-medium',
  small: 'typography-11-medium',
}

const groupRadiusMap: Record<NavVerticalShape, Record<NavVerticalSize, string>> = {
  basic: {
    large: 'rounded-[var(--comp-nav-vertical-group-radius-basic-lg)]',
    small: 'rounded-[var(--comp-nav-vertical-group-radius-basic-sm)]',
  },
  circular: { large: 'rounded-full', small: 'rounded-full' },
  square: { large: 'rounded-none', small: 'rounded-none' },
}

const chevronSizeMap: Record<NavVerticalSize, string> = {
  large: 'size-[var(--comp-nav-vertical-group-chevron-lg)]',
  small: 'size-[var(--comp-nav-vertical-group-chevron-sm)]',
}

const badgeDotOffsetMap: Record<BadgeDotSize, Record<NavVerticalSize, string>> = {
  4: { large: 'right-[8px] top-[8px]', small: 'right-[6px] top-[6px]' },
  8: { large: 'right-[6px] top-[6px]', small: 'right-[4px] top-[4px]' },
}


/* ─── NavVerticalRoot ─────────────────────────────────────────────────────── */

export interface NavVerticalProps {
  /** Controlled active item value. */
  value?: string
  /** Default active value for uncontrolled mode. */
  defaultValue?: string
  /** Callback fired when the active item changes. */
  onValueChange?: (value: string) => void
  /** Size variant.
   * @default 'large'
   * @see {@link NAV_VERTICAL_SIZES} */
  size?: NavVerticalSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link NAV_VERTICAL_SHAPES} */
  shape?: NavVerticalShape
  children: ReactNode
  className?: string
}

function NavVerticalRoot({
  value: controlledValue,
  defaultValue,
  onValueChange,
  size = 'large',
  shape = 'basic',
  children,
  className,
}: NavVerticalProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue
  const navRef = useRef<HTMLElement>(null)

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) setUncontrolledValue(newValue)
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange],
  )

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    const nav = navRef.current
    if (!nav) return

    const items = Array.from(
      nav.querySelectorAll<HTMLButtonElement>('[data-nav-vertical-item]:not([disabled])'),
    )
    const currentIndex = items.findIndex((item) => item === document.activeElement)
    if (currentIndex === -1 && !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return

    let nextIndex: number | undefined

    switch (e.key) {
      case 'ArrowDown':
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case 'ArrowUp':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = items.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    items[nextIndex]?.focus()
  }, [])

  /** 마지막으로 포커스한 항목. tab 스톱이 여기 붙는다. */
  const rovingRef = useRef<HTMLElement | null>(null)

  const listItems = useCallback(() => {
    const nav = navRef.current
    if (!nav) return []
    return Array.from(
      nav.querySelectorAll<HTMLElement>('[data-nav-vertical-item]:not([disabled])'),
    )
  }, [])

  /**
   * **tab 스톱은 마지막으로 포커스한 항목에 둔다** (APG roving tabindex).
   *
   * 선택에 묶어 두면(`tabIndex={isActive ? 0 : -1}`) 방향키로 이동만 하고 Tab 으로
   * 나갔다 돌아왔을 때 사용자가 있던 자리가 아니라 **선택된 항목**으로 돌아간다.
   * 이 위젯은 방향키가 포커스만 옮기고 선택은 Enter/Space 로 하므로 둘이 갈릴 수 있다.
   */
  const handleFocusIn = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[data-nav-vertical-item]')
      if (!item || item.hasAttribute('disabled')) return
      rovingRef.current = item
      for (const el of listItems()) el.tabIndex = el === item ? 0 : -1
    },
    [listItems],
  )

  /**
   * 매 렌더 뒤 tab 스톱을 **정확히 하나**로 정리한다.
   *
   * React 는 렌더마다 `tabIndex` 를 `isActive ? 0 : -1` 로 되돌리므로 이 보정이 항상
   * 그 뒤에 온다. 우선순위는 (1) 마지막 포커스 항목 (2) React 가 0 을 준 항목(=선택)
   * (3) 첫 항목이다. (3) 이 없으면 선택이 없을 때 모든 항목이 -1 이 되어 **위젯 전체가
   * tab 순서 밖**이 된다 — APG 의 "선택이 없으면 첫 항목을 tab 순서에" 규칙이다.
   *
   * 의존성 배열이 없는 이유: 항목이 추가·제거·활성 전환될 때마다 다시 판정해야 하고,
   * 자식이 임의 구조(그룹 중첩)라 Root 가 그 시점을 아는 방법이 없다.
   */
  useEffect(() => {
    const items = listItems()
    if (items.length === 0) return
    const roving = rovingRef.current
    const stop =
      (roving && items.includes(roving) ? roving : null) ??
      items.find((item) => item.tabIndex === 0) ??
      items[0]
    for (const el of items) el.tabIndex = el === stop ? 0 : -1
  })

  return (
    <NavVerticalContext.Provider
      value={{ size, shape, value: currentValue, onValueChange: handleValueChange }}
    >
      {/* <nav> 는 이미 navigation role 을 갖는다 — role 을 다시 적지 않는다. */}
      <nav
        ref={navRef}
        onKeyDown={handleKeyDown}
        // React 의 onFocus 는 focusin 처럼 버블한다 — 항목 각각에 붙이지 않아도 된다.
        onFocus={handleFocusIn}
        className={cn('flex flex-col gap-[var(--comp-nav-vertical-gap)]', className)}
      >
        {children}
      </nav>
    </NavVerticalContext.Provider>
  )
}

/* ─── NavVerticalGroup ────────────────────────────────────────────────────── */

export interface NavVerticalGroupProps {
  /** Group heading text. */
  label: string
  /** Enables accordion chevron and collapse behavior.
   * @default false */
  collapsible?: boolean
  /** Initial open state when collapsible.
   * @default true */
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

function NavVerticalGroup({
  label,
  collapsible = false,
  defaultOpen = true,
  children,
  className,
}: NavVerticalGroupProps) {
  const { size, shape } = useContext(NavVerticalContext)

  const groupTitleClasses = cn(
    'group relative flex w-full items-center cursor-pointer select-none outline-none transition-colors duration-fast ease-enter',
    size === 'large'
      ? 'pl-[var(--comp-nav-vertical-group-pl-lg)]'
      : 'pl-[var(--comp-nav-vertical-group-pl-sm)]',
    'pr-[var(--comp-nav-vertical-group-pr)]',
    'py-[var(--comp-nav-vertical-group-py)]',
    groupRadiusMap[shape][size],
    'text-[var(--comp-nav-vertical-group-text)]',
    groupTypographyMap[size],
  )

  const groupContent = (
    <div className={cn('flex flex-col gap-[var(--comp-nav-vertical-gap)]', className)}>
      {children}
    </div>
  )

  const groupWrapperClasses = 'flex flex-col gap-[var(--comp-nav-vertical-gap)] pt-[var(--comp-nav-vertical-group-gap)] first:pt-0'

  if (!collapsible) {
    return (
      <div className={groupWrapperClasses}>
        <div className={cn(groupTitleClasses, 'cursor-default')}>
          <span className="flex-1 min-w-0 text-left">{label}</span>
        </div>
        {groupContent}
      </div>
    )
  }

  return (
    <Collapsible.Root defaultOpen={defaultOpen} className={groupWrapperClasses}>
      <Collapsible.Trigger className={groupTitleClasses}>
        {/* Focus ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-[var(--comp-nav-vertical-focus-border)] opacity-0 transition-opacity duration-fast ease-enter group-focus-visible:opacity-100"
        />

        {/* State overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter group-hover:bg-[var(--comp-nav-vertical-group-hover)] group-active:bg-[var(--comp-nav-vertical-group-pressed)]"
        />

        <span className="relative z-[1] flex-1 min-w-0 text-left">{label}</span>

        {/* Chevron icon */}
        <span
          aria-hidden
          className={cn(
            'relative z-[1] flex-shrink-0 flex items-center justify-center transition-transform duration-normal ease-move',
            chevronSizeMap[size],
            'group-data-[state=open]:rotate-180',
          )}
          style={{ fontSize: size === 'large' ? 'var(--comp-nav-vertical-group-chevron-lg)' : 'var(--comp-nav-vertical-group-chevron-sm)' }}
        >
          <Icon name="keyboard_arrow_down" filled={false} />
        </span>
      </Collapsible.Trigger>

      <Collapsible.Content className="collapsible-content overflow-hidden">
        {groupContent}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

/* ─── NavVerticalItem ─────────────────────────────────────────────────────── */

export interface NavVerticalItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Unique identifier matched against the root value. */
  value: string
  /** Leading icon slot — 텍스트 앞자리에 고정으로 그려진다. */
  iconLeading?: ReactNode
  /** Badge label — pass string/ReactNode for defaults (gray, light),
   *  or a config object to customize color/weight.
   *  @example badgeLabel="New"
   *  @example badgeLabel={{ children: "Admin", color: "purple", weight: "heavy" }} */
  badgeLabel?: ReactNode | BadgeLabelConfig
  /** Dot indicator — pass `true` for defaults (red, 4px),
   *  or a config object to customize color/size/outlined.
   *  @example badgeDot
   *  @example badgeDot={{ color: "green", size: 8, outlined: true }} */
  badgeDot?: boolean | BadgeDotConfig
  /** Inactive state. Prevents interaction.
   * @default false */
  disabled?: boolean
  children: ReactNode
  className?: string
}

function NavVerticalItem({
  value: itemValue,
  iconLeading,
  badgeLabel,
  badgeDot = false,
  disabled = false,
  children,
  className,
  ...rest
}: NavVerticalItemProps) {
  const { size, shape, value, onValueChange } = useContext(NavVerticalContext)
  const isActive = value === itemValue

  // Parse badge configs
  const isBadgeLabelConfig = (v: unknown): v is BadgeLabelConfig =>
    typeof v === 'object' && v !== null && 'children' in v

  const labelConfig = isBadgeLabelConfig(badgeLabel)
    ? badgeLabel
    : badgeLabel != null
      ? { children: badgeLabel }
      : null

  const dotConfig =
    badgeDot === true
      ? { color: 'red' as BadgeColor, size: 4 as BadgeDotSize, outlined: false }
      : typeof badgeDot === 'object'
        ? badgeDot
        : null

  const dotSize: BadgeDotSize = dotConfig?.size ?? 4

  return (
    <button
      {...rest}
      type="button"
      // role 을 덮지 않는다. ARIA 에서 menuitem 은 **애플리케이션 메뉴**의 항목이라
      // 조상에 menu/menubar/group 을 요구하고, <nav> 안에서는 그 부모가 존재할 수 없다.
      // 스크린리더가 "메뉴, 항목 1/2" 로 읽어 페이지 이동 목록이라는 사실을 감춘다.
      // 네이티브 button role + aria-current="page" 가 사이트 내비게이션의 표준 형태다.
      data-nav-vertical-item=""
      data-active={isActive || undefined}
      disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onValueChange(itemValue)}
      className={cn(
        navItemVariants({ size, shape }),
        typographyMap[size],
        isActive && 'bg-[var(--comp-nav-vertical-item-bg-active)]',
        'text-[var(--comp-nav-vertical-item-text)]',
        isActive && 'text-[var(--comp-nav-vertical-item-text-active)]',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {/* Focus ring — keyboard only */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-[var(--comp-nav-vertical-focus-border)] opacity-0 transition-opacity duration-fast ease-enter group-focus-visible:opacity-100"
      />

      {/* State overlay — hover/active */}
      {!disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter group-hover:bg-[var(--comp-nav-vertical-item-hover)] group-active:bg-[var(--comp-nav-vertical-item-pressed)]"
        />
      )}

      {/* Icon */}
      {iconLeading && (
        <span
          className={cn('relative z-[1] flex-shrink-0 flex items-center justify-center [&>*]:[font-size:inherit]', iconSizeMap[size])}
          style={{ fontSize: iconFontSizeVar[size] }}
        >
          {iconLeading}
        </span>
      )}

      {/* Text */}
      <span className="relative z-[1] flex-1 min-w-0 px-[var(--comp-nav-vertical-item-text-px)] text-left">
        {children}
      </span>

      {/* Badge label */}
      {labelConfig && (
        <BadgeLabel
          size="xSmall"
          shape="basic"
          color={labelConfig.color ?? 'gray'}
          weight={labelConfig.weight ?? 'light'}
          className="relative z-[1] shrink-0"
        >
          {labelConfig.children}
        </BadgeLabel>
      )}

      {/* Badge dot */}
      {dotConfig && (
        <BadgeDot
          size={dotSize}
          color={dotConfig.color ?? 'red'}
          outlined={dotConfig.outlined}
          className={cn('absolute z-[2]', badgeDotOffsetMap[dotSize][size])}
        />
      )}
    </button>
  )
}

/* ─── Compound export ──────────────────────────────────────────────────────── */

export const NavVertical = Object.assign(NavVerticalRoot, {
  Group: NavVerticalGroup,
  Item: NavVerticalItem,
})
