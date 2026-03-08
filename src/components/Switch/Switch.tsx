import { useId } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─── */

export const SWITCH_SIZES = ['large', 'medium', 'small'] as const

export type SwitchSize = (typeof SWITCH_SIZES)[number]

/* ─── Size maps ─── */

const trackSizeMap = {
  large: 'w-[var(--comp-switch-track-w-lg)] h-[var(--comp-switch-track-h-lg)]',
  medium: 'w-[var(--comp-switch-track-w-md)] h-[var(--comp-switch-track-h-md)]',
  small: 'w-[var(--comp-switch-track-w-sm)] h-[var(--comp-switch-track-h-sm)]',
} as const

const thumbSizeMap = {
  large: 'size-[var(--comp-switch-thumb-lg)]',
  medium: 'size-[var(--comp-switch-thumb-md)]',
  small: 'size-[var(--comp-switch-thumb-sm)]',
} as const

const thumbTranslateMap = {
  large: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-lg)]',
  medium: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-md)]',
  small: 'data-[state=checked]:translate-x-[var(--comp-switch-translate-sm)]',
} as const

const gapMap = {
  large: 'gap-[var(--comp-switch-gap-lg)]',
  medium: 'gap-[var(--comp-switch-gap-md)]',
  small: 'gap-[var(--comp-switch-gap-sm)]',
} as const

const labelTypoMap = {
  large: 'typography-16-regular',
  medium: 'typography-14-regular',
  small: 'typography-13-regular',
} as const

/* ─── Props ─── */

export interface SwitchProps {
  /**
   * 크기 variant. 트랙, 썸, 라벨 크기를 제어한다.
   * @default 'medium'
   * @see SWITCH_SIZES
   */
  size?: SwitchSize

  /**
   * 제어 모드 체크 상태.
   * @default undefined
   */
  checked?: boolean

  /**
   * 비제어 모드 기본 체크 상태.
   * @default false
   */
  defaultChecked?: boolean

  /**
   * 체크 상태 변경 콜백.
   * @default undefined
   */
  onCheckedChange?: (checked: boolean) => void

  /**
   * 스위치 옆에 표시되는 라벨 텍스트.
   * @default undefined
   */
  label?: string

  /**
   * 비활성화 상태.
   * @default false
   */
  disabled?: boolean

  /**
   * 필수 여부 (폼 제출용).
   * @default false
   */
  required?: boolean

  /**
   * name 속성 (폼 제출용).
   * @default undefined
   */
  name?: string

  /**
   * value 속성 (폼 제출용).
   * @default 'on'
   */
  value?: string

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

/* ─── Component ─── */

export function Switch({
  size = 'medium',
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  disabled = false,
  required,
  name,
  value = 'on',
  className,
  id: idProp,
}: SwitchProps) {
  const autoId = useId()
  const switchId = idProp ?? autoId

  return (
    <div className={cn('inline-flex items-center', gapMap[size], className)}>
      <SwitchPrimitive.Root
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
        className={cn(
          'group relative inline-flex items-center shrink-0 rounded-full p-0.5 transition-colors duration-fast ease-enter',
          trackSizeMap[size],
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-switch-focus-ring)] focus-visible:ring-offset-2',
          // Cursor
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          // Off state
          disabled
            ? 'data-[state=unchecked]:bg-[var(--comp-switch-track-off-disabled)]'
            : 'data-[state=unchecked]:bg-[var(--comp-switch-track-off)] data-[state=unchecked]:hover:bg-[var(--comp-switch-track-off-hover)]',
          // On state
          disabled
            ? 'data-[state=checked]:bg-[var(--comp-switch-track-on-disabled)]'
            : 'data-[state=checked]:bg-[var(--comp-switch-track-on)]',
        )}
      >
        {/* Hover overlay for on state */}
        {!disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter group-data-[state=checked]:group-hover:bg-[var(--comp-switch-hover-on-dim)]"
          />
        )}

        <SwitchPrimitive.Thumb
          className={cn(
            'block rounded-full transition-transform duration-fast ease-move',
            thumbSizeMap[size],
            thumbTranslateMap[size],
            // Thumb color
            disabled
              ? 'data-[state=checked]:bg-[var(--comp-switch-thumb-on-disabled)] data-[state=unchecked]:bg-[var(--comp-switch-thumb-color)]'
              : 'bg-[var(--comp-switch-thumb-color)]',
          )}
        />
      </SwitchPrimitive.Root>

      {label && (
        <label
          htmlFor={switchId}
          className={cn(
            labelTypoMap[size],
            disabled
              ? 'text-[var(--comp-switch-label-disabled)] cursor-not-allowed'
              : 'text-[var(--comp-switch-label-color)] cursor-pointer',
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}
