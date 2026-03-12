import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SEGMENT_SHAPES = ['square', 'circular'] as const
export const SEGMENT_SIZES  = ['large', 'medium', 'small', 'xSmall'] as const
export const SEGMENT_WIDTHS = ['fixed', 'hug'] as const

export type SegmentShape = (typeof SEGMENT_SHAPES)[number]
export type SegmentSize  = (typeof SEGMENT_SIZES)[number]
export type SegmentWidth = (typeof SEGMENT_WIDTHS)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface SegmentBarContextValue {
  value: string
  onChange: (value: string) => void
  shape: SegmentShape
  size: SegmentSize
  width: SegmentWidth
  disabled: boolean
  hoveredValue: string | null
  setHoveredValue: (value: string | null) => void
}

const SegmentBarContext = createContext<SegmentBarContextValue | null>(null)

function useSegmentBarContext(): SegmentBarContextValue {
  const ctx = useContext(SegmentBarContext)
  if (!ctx) throw new Error('SegmentButton must be used inside <SegmentBar>')
  return ctx
}

/* ─── Size abbreviation map ───────────────────────────────────────────────── */

const sizeAbbr: Record<SegmentSize, string> = {
  large: 'lg', medium: 'md', small: 'sm', xSmall: 'xs',
}

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const segmentButtonVariants = cva(
  'group relative inline-flex items-center justify-center select-none outline-none whitespace-nowrap cursor-pointer transition-[background-color,border-color,box-shadow] duration-fast ease-enter',
  {
    variants: {
      size: {
        large:  'h-[var(--comp-segment-btn-height-lg)] px-[var(--comp-segment-btn-px-lg)] gap-[var(--comp-segment-btn-gap-lg)] typography-17-semibold',
        medium: 'h-[var(--comp-segment-btn-height-md)] px-[var(--comp-segment-btn-px-md)] gap-[var(--comp-segment-btn-gap-md)] typography-16-medium',
        small:  'h-[var(--comp-segment-btn-height-sm)] px-[var(--comp-segment-btn-px-sm)] gap-[var(--comp-segment-btn-gap-sm)] typography-14-medium',
        xSmall: 'h-[var(--comp-segment-btn-height-xs)] px-[var(--comp-segment-btn-px-xs)] gap-[var(--comp-segment-btn-gap-xs)] typography-13-medium',
      },
      width: {
        fixed: 'flex-1',
        hug: 'w-fit',
      },
    },
    defaultVariants: { size: 'medium', width: 'fixed' },
  },
)

/* ─── Lookup maps (JIT-safe literal strings) ───────────────────────────────── */

/** Label color keyed by stateKey */
const labelColorMap: Record<string, string> = {
  'default':           'text-[var(--comp-segment-label)]',
  'active':            'text-[var(--comp-segment-label-active)]',
  'disabled':          'text-[var(--comp-segment-label-disabled)]',
  'active-disabled':   'text-[var(--comp-segment-label-disabled)]',
}

/** Icon size per segment size */
const iconSizeMap: Record<SegmentSize, string> = {
  large:  'size-[var(--comp-segment-icon-lg)]',
  medium: 'size-[var(--comp-segment-icon-md)]',
  small:  'size-[var(--comp-segment-icon-sm)]',
  xSmall: 'size-[var(--comp-segment-icon-xs)]',
}

/** Bar radius — square uses tokens, circular uses rounded-full */
const barRadiusMap: Record<SegmentShape, Record<SegmentSize, string>> = {
  square: {
    large:  'rounded-[var(--comp-segment-bar-radius-lg)]',
    medium: 'rounded-[var(--comp-segment-bar-radius-md)]',
    small:  'rounded-[var(--comp-segment-bar-radius-sm)]',
    xSmall: 'rounded-[var(--comp-segment-bar-radius-xs)]',
  },
  circular: {
    large:  'rounded-full',
    medium: 'rounded-full',
    small:  'rounded-full',
    xSmall: 'rounded-full',
  },
}

/** Button radius — square uses tokens, circular uses rounded-full */
const btnRadiusMap: Record<SegmentShape, Record<SegmentSize, string>> = {
  square: {
    large:  'rounded-[var(--comp-segment-btn-radius-lg)]',
    medium: 'rounded-[var(--comp-segment-btn-radius-md)]',
    small:  'rounded-[var(--comp-segment-btn-radius-sm)]',
    xSmall: 'rounded-[var(--comp-segment-btn-radius-xs)]',
  },
  circular: {
    large:  'rounded-full',
    medium: 'rounded-full',
    small:  'rounded-full',
    xSmall: 'rounded-full',
  },
}

/** Bar padding per size */
const barPaddingMap: Record<SegmentSize, string> = {
  large:  'p-[var(--comp-segment-bar-padding-lg)]',
  medium: 'p-[var(--comp-segment-bar-padding-md)]',
  small:  'p-[var(--comp-segment-bar-padding-sm)]',
  xSmall: 'p-[var(--comp-segment-bar-padding-xs)]',
}

function getStateKey(isActive: boolean, isDisabled: boolean): string {
  if (isDisabled && isActive) return 'active-disabled'
  if (isDisabled) return 'disabled'
  if (isActive) return 'active'
  return 'default'
}

function shouldShowDivider(
  dividerIndex: number,
  activeValue: string,
  hoveredValue: string | null,
  itemValues: string[],
): boolean {
  const leftValue = itemValues[dividerIndex - 1]
  const rightValue = itemValues[dividerIndex]
  if (leftValue === activeValue || rightValue === activeValue) return false
  if (hoveredValue && (leftValue === hoveredValue || rightValue === hoveredValue)) return false
  return true
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * SegmentBar — 2~5개의 상호 배타적 옵션을 선택하는 컨트롤.
 * 리세스 배경 위에 선택된 버튼이 떠오르는 구조. 동일 뷰 내 필터/모드 전환에 사용.
 */
export interface SegmentBarProps {
  /**
   * 버튼 형태. square는 표준 라운드, circular는 pill 형태.
   * @default 'square'
   * @see SEGMENT_SHAPES
   */
  shape?: SegmentShape

  /**
   * 크기 variant. 높이, 패딩, 타이포그래피, 아이콘 크기를 제어한다.
   * @default 'medium'
   * @see SEGMENT_SIZES
   */
  size?: SegmentSize

  /**
   * 너비 모드. fixed는 균등 분할, hug는 콘텐츠 맞춤.
   * @default 'fixed'
   * @see SEGMENT_WIDTHS
   */
  width?: SegmentWidth

  /**
   * 현재 선택된 값 (controlled mode).
   */
  value?: string

  /**
   * 초기 선택 값 (uncontrolled mode).
   */
  defaultValue?: string

  /**
   * 선택 변경 콜백.
   */
  onValueChange?: (value: string) => void

  /**
   * 전체 비활성화.
   * @default false
   */
  disabled?: boolean

  /** 접근성 레이블. */
  'aria-label'?: string

  children: React.ReactNode
  className?: string
}

/**
 * SegmentButton — SegmentBar 내부의 개별 선택 항목.
 */
export interface SegmentButtonProps {
  /**
   * 옵션 식별자. SegmentBar의 value와 비교하여 선택 상태를 결정한다.
   */
  value: string

  /**
   * 이 버튼만 개별 비활성화. aria-disabled 방식.
   * @default false
   */
  disabled?: boolean

  /**
   * 레이블 좌측 아이콘. 크기는 size variant에 의해 제어된다.
   */
  icon?: React.ReactNode

  /** 레이블 텍스트. */
  children: React.ReactNode
  className?: string
}

/* ─── SegmentBar ──────────────────────────────────────────────────────────── */

export function SegmentBar({
  shape = 'square',
  size = 'medium',
  width = 'fixed',
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  'aria-label': ariaLabel,
  children,
  className,
}: SegmentBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  const [hoveredValue, setHoveredValue] = useState<string | null>(null)

  const onChange = useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v)
      onValueChange?.(v)
    },
    [isControlled, onValueChange],
  )

  /* Extract child values for divider logic */
  const childArray = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<SegmentButtonProps>[]
  const itemValues = childArray.map((child) => child.props.value)

  /* Keyboard navigation — radiogroup pattern (arrow = focus + select) */
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const radios = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([aria-disabled="true"])'),
    )
    const currentIndex = radios.indexOf(document.activeElement as HTMLButtonElement)
    if (currentIndex === -1) return

    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = (currentIndex + 1) % radios.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = (currentIndex - 1 + radios.length) % radios.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = radios.length - 1
        break
      default:
        return
    }

    if (nextIndex !== currentIndex) {
      radios[nextIndex].focus()
      const val = radios[nextIndex].getAttribute('data-value')
      if (val) onChange(val)
    }
  }

  const sa = sizeAbbr[size]

  return (
    <SegmentBarContext.Provider
      value={{ value, onChange, shape, size, width, disabled, hoveredValue, setHoveredValue }}
    >
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHoveredValue(null)}
        className={cn(
          'relative inline-flex items-center',
          width === 'fixed' ? 'w-full' : 'w-fit',
          barPaddingMap[size],
          barRadiusMap[shape][size],
          'bg-[var(--comp-segment-bar-bg)]',
          className,
        )}
      >
        {/* Buttons with dividers */}
        {childArray.map((child, index) => (
          <React.Fragment key={child.props.value}>
            {/* Divider (skip first, skip when ≤ 2 items) */}
            {index > 0 && itemValues.length > 2 && (
              <span
                aria-hidden
                className={cn(
                  'z-10 flex-shrink-0 self-center transition-opacity duration-fast ease-enter',
                  shouldShowDivider(index, value, hoveredValue, itemValues)
                    ? 'opacity-100'
                    : 'opacity-0',
                )}
                style={{
                  width: '1px',
                  height: `var(--comp-segment-divider-height-${sa})`,
                  backgroundColor: 'var(--comp-segment-divider)',
                }}
              />
            )}
            {child}
          </React.Fragment>
        ))}
      </div>
    </SegmentBarContext.Provider>
  )
}

/* ─── SegmentButton ───────────────────────────────────────────────────────── */

export function SegmentButton({
  value,
  disabled: propDisabled = false,
  icon,
  children,
  className,
}: SegmentButtonProps) {
  const ctx = useSegmentBarContext()
  const isActive = ctx.value === value
  const isDisabled = propDisabled || ctx.disabled
  const stateKey = getStateKey(isActive, isDisabled)

  const sa = sizeAbbr[ctx.size]

  return (
    <button
      role="radio"
      data-value={value}
      aria-checked={isActive}
      aria-disabled={isDisabled || undefined}
      tabIndex={isActive ? 0 : -1}
      onClick={!isDisabled ? () => ctx.onChange(value) : undefined}
      onMouseEnter={!isDisabled ? () => ctx.setHoveredValue(value) : undefined}
      onMouseLeave={!isDisabled ? () => ctx.setHoveredValue(null) : undefined}
      className={cn(
        segmentButtonVariants({ size: ctx.size, width: ctx.width }),
        btnRadiusMap[ctx.shape][ctx.size],
        labelColorMap[stateKey],
        /* Active bg/border — in-place color change */
        isActive && !isDisabled && 'bg-[var(--comp-segment-active-bg)] border border-[color:var(--comp-segment-active-border)]',
        isActive && isDisabled && 'bg-[var(--comp-segment-active-bg-disabled)] border border-transparent',
        !isActive && 'border border-transparent',
        isDisabled && 'cursor-not-allowed',
        'focus-visible:ring-2 focus-visible:ring-[var(--comp-segment-focus-ring)] focus-visible:ring-offset-1',
        className,
      )}
      style={{
        boxShadow: isActive && !isDisabled
          ? `var(--comp-segment-shadow-${sa})`
          : 'none',
      }}
    >
      {/* State overlay — hover/pressed */}
      {!isDisabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter group-hover:bg-[var(--comp-segment-hover)] group-active:bg-[var(--comp-segment-pressed)]"
        />
      )}

      {/* Icon */}
      {icon && (
        <span className={cn('relative flex-shrink-0', iconSizeMap[ctx.size])}>
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="relative">{children}</span>
    </button>
  )
}
