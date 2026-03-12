import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BadgeDot } from '@/components/Badge'
import { IconButton } from '@/components/IconButton'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TAB_VARIANTS = ['underline', 'pill'] as const
export const TAB_SIZES    = ['large', 'medium'] as const

export type TabVariant = (typeof TAB_VARIANTS)[number]
export type TabSize    = (typeof TAB_SIZES)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface TabContextValue {
  value: string
  onChange: (id: string) => void
  variant: TabVariant
  size: TabSize
  disabled: boolean
  activationMode: 'manual' | 'automatic'
}

const TabContext = createContext<TabContextValue | null>(null)

function useTabContext(): TabContextValue {
  const ctx = useContext(TabContext)
  if (!ctx) throw new Error('Tab sub-components must be used inside <TabGroup>')
  return ctx
}

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const tabItemVariants = cva(
  'group relative inline-flex items-center justify-center shrink-0 select-none outline-none whitespace-nowrap transition-colors duration-normal ease-move',
  {
    variants: {
      variant: {
        underline: 'rounded-none',
        pill: '',
      },
      size: {
        large: '',
        medium: '',
      },
    },
    compoundVariants: [
      // underline: semibold typography
      { variant: 'underline', size: 'large', className: 'h-[var(--comp-tab-height-underline-large)] px-[var(--comp-tab-padding-x-underline-large)] gap-[var(--comp-tab-gap-underline-large)] typography-17-semibold' },
      { variant: 'underline', size: 'medium', className: 'h-[var(--comp-tab-height-underline-medium)] px-[var(--comp-tab-padding-x-underline-medium)] gap-[var(--comp-tab-gap-underline-medium)] typography-13-semibold' },
      // pill: medium typography + radius
      { variant: 'pill', size: 'large', className: 'h-[var(--comp-tab-height-pill-large)] px-[var(--comp-tab-padding-x-pill-large)] gap-[var(--comp-tab-gap-pill-large)] typography-17-medium rounded-[var(--comp-tab-radius-pill-large)]' },
      { variant: 'pill', size: 'medium', className: 'h-[var(--comp-tab-height-pill-medium)] px-[var(--comp-tab-padding-x-pill-medium)] gap-[var(--comp-tab-gap-pill-medium)] typography-13-medium rounded-[var(--comp-tab-radius-pill-medium)]' },
    ],
    defaultVariants: { variant: 'underline', size: 'large' },
  },
)

/* ─── Lookup maps (JIT-safe literal strings) ───────────────────────────────── */

/** Label text color keyed by "{variant}-{stateKey}" */
const tabLabelColorMap: Record<string, string> = {
  'underline-default':           'text-[var(--comp-tab-label-underline)]',
  'underline-selected':          'text-[var(--comp-tab-label-underline-selected)]',
  'underline-disabled':          'text-[var(--comp-tab-label-underline-disabled)]',
  'underline-selected-disabled': 'text-[var(--comp-tab-label-underline-selected-disabled)]',
  'pill-default':                'text-[var(--comp-tab-label-pill)]',
  'pill-selected':               'text-[var(--comp-tab-label-pill-selected)]',
  'pill-disabled':               'text-[var(--comp-tab-label-pill-disabled)]',
  'pill-selected-disabled':      'text-[var(--comp-tab-label-pill-selected-disabled)]',
}

/** Background color for pill variant only */
const tabBgMap: Record<string, string> = {
  'pill-default':           'bg-[var(--comp-tab-bg-pill)]',
  'pill-selected':          'bg-[var(--comp-tab-bg-pill-selected)]',
  'pill-disabled':          'bg-[var(--comp-tab-bg-pill-disabled)]',
  'pill-selected-disabled': 'bg-[var(--comp-tab-bg-pill-selected-disabled)]',
}

/**
 * State overlay classes — surface-aware.
 * pill+selected uses on-dim overlay; everything else uses on-bright.
 * Disabled tabs get no overlay.
 */
const tabOverlayMap: Record<string, string> = {
  'underline-default':  'group-hover:bg-[var(--comp-tab-hover-underline)] group-active:bg-[var(--comp-tab-pressed-underline)]',
  'underline-selected': 'group-hover:bg-[var(--comp-tab-hover-underline)] group-active:bg-[var(--comp-tab-pressed-underline)]',
  'pill-default':       'group-hover:bg-[var(--comp-tab-hover-pill)] group-active:bg-[var(--comp-tab-pressed-pill)]',
  'pill-selected':      'group-hover:bg-[var(--comp-tab-hover-pill-selected)] group-active:bg-[var(--comp-tab-pressed-pill-selected)]',
}

const iconSizeMap: Record<TabVariant, Record<TabSize, string>> = {
  underline: {
    large: 'size-[var(--comp-tab-icon-size-underline-large)]',
    medium: 'size-[var(--comp-tab-icon-size-underline-medium)]',
  },
  pill: {
    large: 'size-[var(--comp-tab-icon-size-pill-large)]',
    medium: 'size-[var(--comp-tab-icon-size-pill-medium)]',
  },
}

function getTabStateKey(variant: TabVariant, isSelected: boolean, isDisabled: boolean): string {
  if (isDisabled && isSelected) return `${variant}-selected-disabled`
  if (isDisabled) return `${variant}-disabled`
  if (isSelected) return `${variant}-selected`
  return `${variant}-default`
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * TabGroup — root compound component that provides shared state and context.
 */
export interface TabGroupProps {
  /**
   * 현재 선택된 탭의 value. 제공 시 controlled mode로 동작한다.
   */
  value?: string

  /**
   * 비제어 모드의 초기 선택값.
   */
  defaultValue?: string

  /**
   * 탭 변경 콜백 (controlled mode에서 value 갱신에 사용).
   */
  onValueChange?: (value: string) => void

  /**
   * 시각적 style variant. underline은 하단 슬라이딩 인디케이터, pill은 TabItem 배경 채우기.
   * @default 'underline'
   * @see TAB_VARIANTS
   */
  variant?: TabVariant

  /**
   * 크기. 높이, 패딩, 타이포그래피, 아이콘 크기, gap을 제어한다.
   * @default 'large'
   * @see TAB_SIZES
   */
  size?: TabSize

  /**
   * 모든 탭을 비활성화한다.
   * @default false
   */
  disabled?: boolean

  /**
   * 탭 활성화 모드. manual=포커스 이동과 선택 분리(Enter/Space로 명시적 선택), automatic=포커스 이동 시 자동 선택.
   * @default 'manual'
   */
  activationMode?: 'manual' | 'automatic'

  children: React.ReactNode
  className?: string
}

/**
 * TabList — scrollable tab button container with indicator and fade gradients.
 */
export interface TabListProps {
  children: React.ReactNode
  className?: string
  /** 접근성 레이블 (role="tablist"에 적용). */
  'aria-label'?: string
  /**
   * 스크롤 가능 시 좌우 chevron 버튼을 표시한다.
   * @default false
   */
  showScrollButtons?: boolean
}

/**
 * TabItem — individual tab button.
 */
export interface TabItemProps {
  /**
   * 탭의 고유 식별자. 연결된 TabPanel의 value와 일치해야 한다.
   */
  value: string

  /**
   * 이 탭만 개별 비활성화. aria-disabled 방식으로 처리되어 포커스는 유지된다.
   * @default false
   */
  disabled?: boolean

  /** 탭 아이콘. 크기는 size variant에 의해 제어된다. */
  icon?: React.ReactNode

  /** 뱃지 카운터. underline=인라인(가로폭 포함), pill=오버레이(텍스트 우상단). */
  badge?: React.ReactNode

  /**
   * 업데이트 인디케이터 dot 표시. badge와 동시 사용 시 badge 우선.
   * @default false
   */
  showIndicator?: boolean

  children: React.ReactNode
  className?: string
}

/**
 * TabPanel — content region connected to a TabItem by value.
 */
export interface TabPanelProps {
  /**
   * 연결된 TabItem의 value와 일치해야 한다.
   */
  value: string

  /**
   * 비활성 패널을 DOM에 유지할지 여부. true이면 hidden 상태로 렌더링된다.
   * @default false
   */
  forceMount?: boolean

  children: React.ReactNode
  className?: string
}

/* ─── TabGroup ─────────────────────────────────────────────────────────────── */

export function TabGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'underline',
  size = 'large',
  disabled = false,
  activationMode = 'manual',
  children,
  className,
}: TabGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const onChange = useCallback(
    (id: string) => {
      if (!isControlled) setInternalValue(id)
      onValueChange?.(id)
    },
    [isControlled, onValueChange],
  )

  return (
    <TabContext.Provider value={{ value, onChange, variant, size, disabled, activationMode }}>
      <div className={className}>{children}</div>
    </TabContext.Provider>
  )
}

/* ─── TabList ──────────────────────────────────────────────────────────────── */

export function TabList({ children, className, 'aria-label': ariaLabel, showScrollButtons = false }: TabListProps) {
  const { value, onChange, variant, size, activationMode } = useTabContext()
  const scrollRef = useRef<HTMLDivElement>(null)

  /* Sliding indicator state (underline only) */
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: string
    width: string
    isDisabled: boolean
  }>({ left: '0px', width: '0px', isDisabled: false })

  /* Scroll fade visibility */
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)

  /* Update indicator position — synchronous before paint to avoid flash */
  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container || variant !== 'underline') return
    const selectedBtn = container.querySelector<HTMLButtonElement>('[aria-selected="true"]')
    if (!selectedBtn) return
    setIndicatorStyle({
      left: `${selectedBtn.offsetLeft}px`,
      width: `${selectedBtn.offsetWidth}px`,
      isDisabled: selectedBtn.getAttribute('aria-disabled') === 'true',
    })
  }, [value, variant])

  /* Scroll selected tab into view when value changes */
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const selectedBtn = container.querySelector<HTMLButtonElement>('[aria-selected="true"]')
    selectedBtn?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [value])

  /* Scroll fade gradient update */
  const updateFades = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 1)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateFades()
    el.addEventListener('scroll', updateFades, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateFades) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', updateFades)
      ro?.disconnect()
    }
  }, [updateFades])

  /* Keyboard navigation */
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const container = e.currentTarget
    const tabs = Array.from(
      container.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([aria-disabled="true"])'),
    )
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (currentIndex === -1) return

    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = (currentIndex + 1) % tabs.length
        break
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = tabs.length - 1
        break
      case 'Enter':
      case ' ':
        if (activationMode === 'manual') {
          e.preventDefault()
          const tabValue = (document.activeElement as HTMLButtonElement)?.getAttribute('data-value')
          if (tabValue) onChange(tabValue)
        }
        return
      default:
        return
    }

    if (nextIndex !== currentIndex) {
      tabs[nextIndex].focus()
      if (activationMode === 'automatic') {
        const tabValue = tabs[nextIndex]?.getAttribute('data-value')
        if (tabValue) onChange(tabValue)
      }
    }
  }

  return (
    <div className={cn(
      'relative',
      variant === 'pill' && 'py-[var(--comp-tab-list-padding-y-pill)] bg-[var(--comp-tab-list-bg-pill)]',
      className,
    )}>
      {/* Scrollable tab container */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex overflow-x-auto pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          variant === 'underline' && 'border-b border-[var(--comp-tab-border-underline)] gap-[var(--comp-tab-list-gap-underline)]',
          variant === 'pill' && 'gap-[var(--comp-tab-list-gap-pill)]',
        )}
      >
        {children}

        {/* Sliding indicator (underline variant only) */}
        {variant === 'underline' && (
          <span
            aria-hidden
            className="absolute bottom-0 pointer-events-none transition-[left,width] duration-normal ease-move"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: `var(--comp-tab-indicator-height-underline-${size})`,
              backgroundColor: indicatorStyle.isDisabled
                ? 'var(--comp-tab-indicator-underline-disabled)'
                : 'var(--comp-tab-indicator-underline)',
            }}
          />
        )}
      </div>

      {/* Left fade gradient */}
      {showLeftFade && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10"
          style={{
            width: 'var(--comp-tab-scroll-fade-width)',
            background: `linear-gradient(to right, var(--semantic-background-0), transparent)`,
          }}
        />
      )}

      {/* Left scroll button */}
      {showScrollButtons && showLeftFade && (
        <IconButton
          variant="outlined"
          intent="systemic"
          size="small"
          shape="pill"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          aria-label="이전 탭으로 스크롤"
          tabIndex={-1}
          onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
        />
      )}

      {/* Right fade gradient */}
      {showRightFade && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10"
          style={{
            width: 'var(--comp-tab-scroll-fade-width)',
            background: `linear-gradient(to left, var(--semantic-background-0), transparent)`,
          }}
        />
      )}

      {/* Right scroll button */}
      {showScrollButtons && showRightFade && (
        <IconButton
          variant="outlined"
          intent="systemic"
          size="small"
          shape="pill"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          aria-label="다음 탭으로 스크롤"
          tabIndex={-1}
          onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
        />
      )}
    </div>
  )
}

/* ─── TabItem ──────────────────────────────────────────────────────────────── */

export function TabItem({
  value,
  disabled: propDisabled = false,
  icon,
  badge,
  showIndicator = false,
  children,
  className,
}: TabItemProps) {
  const ctx = useTabContext()
  const isSelected = ctx.value === value
  const isDisabled = propDisabled || ctx.disabled
  const stateKey = getTabStateKey(ctx.variant, isSelected, isDisabled)
  const overlayKey = isDisabled ? '' : `${ctx.variant}-${isSelected ? 'selected' : 'default'}`

  return (
    <button
      role="tab"
      id={`tab-${value}`}
      data-value={value}
      aria-selected={isSelected}
      aria-controls={`tabpanel-${value}`}
      aria-disabled={isDisabled || undefined}
      tabIndex={isSelected ? 0 : -1}
      onClick={!isDisabled ? () => ctx.onChange(value) : undefined}
      className={cn(
        tabItemVariants({ variant: ctx.variant, size: ctx.size }),
        tabLabelColorMap[stateKey],
        ctx.variant === 'pill' && tabBgMap[stateKey],
        isDisabled && 'cursor-not-allowed',
        'focus-visible:ring-2 focus-visible:ring-[var(--comp-tab-focus-ring)] focus-visible:ring-offset-2',
        className,
      )}
    >
      {/* State overlay — disabled tabs get no overlay */}
      {!isDisabled && overlayKey && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
            tabOverlayMap[overlayKey],
          )}
        />
      )}

      {/* Icon */}
      {icon && (
        <span className={cn('relative flex-shrink-0', iconSizeMap[ctx.variant][ctx.size])}>{icon}</span>
      )}

      {/* Label + overlay badges/indicators */}
      <span className="relative">
        {children}

        {/* Underline + Indicator: 텍스트 우상단 오버레이 */}
        {ctx.variant === 'underline' && showIndicator && !badge && (
          <span className="absolute top-0 -right-[3px] -translate-y-1/2 translate-x-1/2 z-10 pointer-events-none">
            <BadgeDot color="red-bright" />
          </span>
        )}

        {/* Pill + Counter: 텍스트 우상단 오버레이 (기존보다 4px 더 우측) */}
        {ctx.variant === 'pill' && badge != null && (
          <span className="absolute -top-0.5 -right-2 -translate-y-1/2 translate-x-1/2 z-10 pointer-events-none">
            {badge}
          </span>
        )}

        {/* Pill + Indicator: 텍스트 기준 10px↑, left-full */}
        {ctx.variant === 'pill' && showIndicator && !badge && (
          <span className="absolute -top-2.5 left-full z-10 pointer-events-none">
            <BadgeDot color="red-bright" />
          </span>
        )}
      </span>

      {/* Underline + Counter: 인라인 flex child (가로폭에 포함) */}
      {ctx.variant === 'underline' && badge != null && (
        <span className="relative flex-shrink-0 inline-flex items-center">{badge}</span>
      )}
    </button>
  )
}

/* ─── TabPanel ─────────────────────────────────────────────────────────────── */

export function TabPanel({ value, forceMount = false, children, className }: TabPanelProps) {
  const { value: selectedValue } = useTabContext()
  const isSelected = value === selectedValue

  if (!isSelected && !forceMount) return null

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      hidden={!isSelected && forceMount}
      className={cn('outline-none', className)}
    >
      {children}
    </div>
  )
}
