import { forwardRef, useState, useCallback } from 'react'
import * as RadixSlider from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SLIDER_SIZES = ['small', 'medium', 'large'] as const
export const SLIDER_INTENTS = ['systemic', 'brand'] as const

export type SliderSize = (typeof SLIDER_SIZES)[number]
export type SliderIntent = (typeof SLIDER_INTENTS)[number]

/* ─── Size maps ────────────────────────────────────────────────────────────── */

const sizeAbbr: Record<SliderSize, string> = { small: 'sm', medium: 'md', large: 'lg' }

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface SliderMark {
  value: number
  label?: string
}

export interface SliderProps {
  /** 현재 값. [50]=단일, [20,80]=범위. */
  value?: number[]
  /** 값 변경 콜백. */
  onValueChange?: (value: number[]) => void
  /** 비제어 모드 기본값. @default [0] */
  defaultValue?: number[]
  /** 최솟값. @default 0 */
  min?: number
  /** 최댓값. @default 100 */
  max?: number
  /** 단위 간격. @default 1 */
  step?: number
  /** 트랙/썸 크기. @default 'medium' @see {@link SLIDER_SIZES} */
  size?: SliderSize
  /** 색상 계열. @default 'brand' @see {@link SLIDER_INTENTS} */
  intent?: SliderIntent
  /** 비활성. @default false */
  disabled?: boolean
  /** 썸 위 값 표시. false=없음, true=드래그 시, 'always'=항상. @default false */
  showTooltip?: boolean | 'always'
  /** 트랙 위 눈금 표시. */
  marks?: SliderMark[]
  /** 추가 CSS 클래스 */
  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(
  (
    {
      value,
      onValueChange,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      size = 'medium',
      intent = 'brand',
      disabled = false,
      showTooltip = false,
      marks,
      className,
    },
    ref,
  ) => {
    const abbr = sizeAbbr[size]
    const [isDragging, setIsDragging] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue)

    const currentValue = value ?? internalValue

    const handleValueChange = useCallback(
      (val: number[]) => {
        setInternalValue(val)
        onValueChange?.(val)
      },
      [onValueChange],
    )

    const tooltipVisible = showTooltip === 'always' || (showTooltip === true && isDragging)

    return (
      <div className={cn('relative w-full', className)}>
        <RadixSlider.Root
          ref={ref}
          value={value}
          onValueChange={handleValueChange}
          defaultValue={value ? undefined : defaultValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className={cn(
            'relative flex items-center w-full select-none touch-none',
            `h-[var(--comp-slider-thumb-${abbr})]`,
            disabled && 'opacity-100',
          )}
        >
          {/* Track */}
          <RadixSlider.Track
            className={cn(
              'relative grow rounded-full',
              `h-[var(--comp-slider-track-height-${abbr})]`,
              disabled
                ? 'bg-[var(--comp-slider-track-disabled)]'
                : 'bg-[var(--comp-slider-track)]',
            )}
          >
            {/* Range (filled part) */}
            <RadixSlider.Range
              className={cn(
                'absolute h-full rounded-full',
                disabled
                  ? 'bg-[var(--comp-slider-range-disabled)]'
                  : `bg-[var(--comp-slider-range-${intent})]`,
              )}
            />

            {/* Marks */}
            {marks && marks.map((mark) => {
              const pct = ((mark.value - min) / (max - min)) * 100
              return (
                <div
                  key={mark.value}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  <div
                    className={cn(
                      'rounded-full',
                      'w-[var(--comp-slider-mark-size)] h-[var(--comp-slider-mark-size)]',
                      'bg-[var(--comp-slider-mark)]',
                    )}
                  />
                  {mark.label && (
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap typography-12-regular text-[var(--comp-slider-mark-label)]">
                      {mark.label}
                    </span>
                  )}
                </div>
              )
            })}
          </RadixSlider.Track>

          {/* Thumbs */}
          {currentValue.map((val, i) => (
            <RadixSlider.Thumb
              key={i}
              className={cn(
                'block rounded-full border-2',
                'transition-transform duration-fast ease-enter',
                `w-[var(--comp-slider-thumb-${abbr})] h-[var(--comp-slider-thumb-${abbr})]`,
                disabled
                  ? 'bg-[var(--comp-slider-thumb-disabled)] border-[var(--comp-slider-thumb-border-disabled)] cursor-not-allowed'
                  : [
                      'bg-[var(--comp-slider-thumb-bg)]',
                      `border-[var(--comp-slider-thumb-border-${intent})]`,
                      'shadow-[var(--comp-slider-thumb-shadow)]',
                      'hover:scale-110 active:scale-95',
                      'cursor-grab active:cursor-grabbing',
                    ],
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-slider-focus-ring)] focus-visible:ring-offset-2',
              )}
            >
              {/* Tooltip */}
              {tooltipVisible && !disabled && (
                <span
                  className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                    'px-2 py-1 rounded-1',
                    'typography-12-semibold',
                    'bg-semantic-neutral-solid-900 text-semantic-neutral-solid-0',
                    'whitespace-nowrap pointer-events-none',
                  )}
                >
                  {val}
                </span>
              )}
            </RadixSlider.Thumb>
          ))}
        </RadixSlider.Root>
      </div>
    )
  },
)

Slider.displayName = 'Slider'
