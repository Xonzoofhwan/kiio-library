import { useId, createContext, useContext } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─── */

export const RADIO_SIZES = ['large', 'medium', 'small'] as const
export const RADIO_ORIENTATIONS = ['vertical', 'horizontal'] as const

export type RadioSize = (typeof RADIO_SIZES)[number]
export type RadioOrientation = (typeof RADIO_ORIENTATIONS)[number]

/* ─── Size context ─── */

const RadioSizeContext = createContext<RadioSize>('medium')

/* ─── Size maps ─── */

const outerSizeMap = {
  large: 'size-[var(--comp-radio-outer-lg)]',
  medium: 'size-[var(--comp-radio-outer-md)]',
  small: 'size-[var(--comp-radio-outer-sm)]',
} as const

const dotSizeMap = {
  large: 'size-[var(--comp-radio-dot-lg)]',
  medium: 'size-[var(--comp-radio-dot-md)]',
  small: 'size-[var(--comp-radio-dot-sm)]',
} as const

const itemGapMap = {
  large: 'gap-[var(--comp-radio-gap-lg)]',
  medium: 'gap-[var(--comp-radio-gap-md)]',
  small: 'gap-[var(--comp-radio-gap-sm)]',
} as const

const groupGapMap = {
  large: 'gap-[var(--comp-radio-group-gap-lg)]',
  medium: 'gap-[var(--comp-radio-group-gap-md)]',
  small: 'gap-[var(--comp-radio-group-gap-sm)]',
} as const

const labelTypoMap = {
  large: 'typography-16-regular',
  medium: 'typography-14-regular',
  small: 'typography-13-regular',
} as const

/* ─── RadioGroup Props ─── */

export interface RadioGroupProps {
  /**
   * 크기 variant. 라디오 크기, 도트, 라벨 타이포그래피를 제어한다.
   * @default 'medium'
   * @see RADIO_SIZES
   */
  size?: RadioSize

  /**
   * 제어 모드 선택된 값.
   * @default undefined
   */
  value?: string

  /**
   * 비제어 모드 기본값.
   * @default undefined
   */
  defaultValue?: string

  /**
   * 값 변경 콜백.
   * @default undefined
   */
  onValueChange?: (value: string) => void

  /**
   * 비활성화 상태.
   * @default false
   */
  disabled?: boolean

  /**
   * 필수 여부.
   * @default false
   */
  required?: boolean

  /**
   * name 속성 (폼 제출용).
   * @default undefined
   */
  name?: string

  /**
   * 레이아웃 방향. 화살표 키 내비게이션 방향에도 영향.
   * @default 'vertical'
   * @see RADIO_ORIENTATIONS
   */
  orientation?: RadioOrientation

  /**
   * 추가 className.
   * @default undefined
   */
  className?: string

  /**
   * 자식 RadioItem 요소.
   */
  children: React.ReactNode
}

/* ─── RadioGroup Component ─── */

export function RadioGroup({
  size = 'medium',
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required,
  name,
  orientation = 'vertical',
  className,
  children,
}: RadioGroupProps) {
  return (
    <RadioSizeContext.Provider value={size}>
      <RadioGroupPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
        orientation={orientation}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          groupGapMap[size],
          className,
        )}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </RadioSizeContext.Provider>
  )
}

/* ─── RadioItem Props ─── */

export interface RadioItemProps {
  /**
   * 이 항목의 값 (필수).
   */
  value: string

  /**
   * 라디오 옆에 표시되는 라벨 텍스트.
   * @default undefined
   */
  label?: string

  /**
   * 비활성화 상태.
   * @default false
   */
  disabled?: boolean

  /**
   * 추가 className.
   * @default undefined
   */
  className?: string

  /**
   * 컴포넌트 ID.
   * @default undefined
   */
  id?: string
}

/* ─── RadioItem Component ─── */

export function RadioItem({
  value,
  label,
  disabled = false,
  className,
  id: idProp,
}: RadioItemProps) {
  const autoId = useId()
  const itemId = idProp ?? autoId
  const size = useContext(RadioSizeContext)

  return (
    <div className={cn('inline-flex items-center', itemGapMap[size], className)}>
      <RadioGroupPrimitive.Item
        id={itemId}
        value={value}
        disabled={disabled}
        className={cn(
          'relative flex items-center justify-center shrink-0 rounded-full transition-colors duration-fast ease-enter',
          outerSizeMap[size],
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-radio-focus-ring)] focus-visible:ring-offset-2',
          // Cursor
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          // Unchecked default — border (data-state attribute from Radix)
          'data-[state=unchecked]:border-2',
          disabled
            ? 'data-[state=unchecked]:border-[var(--comp-radio-border-disabled)]'
            : 'data-[state=unchecked]:border-[var(--comp-radio-border)] data-[state=unchecked]:hover:border-[var(--comp-radio-border-hover)]',
          // Checked — filled background
          disabled
            ? 'data-[state=checked]:bg-[var(--comp-radio-bg-checked-disabled)]'
            : 'data-[state=checked]:bg-[var(--comp-radio-bg-checked)]',
        )}
      >
        {/* Hover overlay for checked state */}
        {!disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter data-[state=checked]:hover:bg-[var(--comp-radio-hover-on-dim)]"
          />
        )}

        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span
            className={cn(
              'block rounded-full transition-transform duration-fast ease-enter',
              dotSizeMap[size],
              disabled
                ? 'bg-[var(--comp-radio-dot-disabled)]'
                : 'bg-[var(--comp-radio-dot-color)]',
            )}
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      {label && (
        <label
          htmlFor={itemId}
          className={cn(
            labelTypoMap[size],
            disabled
              ? 'text-[var(--comp-radio-label-disabled)] cursor-not-allowed'
              : 'text-[var(--comp-radio-label-color)] cursor-pointer',
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}
