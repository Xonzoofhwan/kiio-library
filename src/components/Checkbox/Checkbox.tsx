import { useId } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─── */

export const CHECKBOX_SIZES = ['large', 'medium', 'small'] as const

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number]

/* ─── Size maps ─── */

const boxSizeMap = {
  large: 'size-[var(--comp-checkbox-box-lg)]',
  medium: 'size-[var(--comp-checkbox-box-md)]',
  small: 'size-[var(--comp-checkbox-box-sm)]',
} as const

const iconSizeMap = {
  large: 'size-[var(--comp-checkbox-icon-lg)]',
  medium: 'size-[var(--comp-checkbox-icon-md)]',
  small: 'size-[var(--comp-checkbox-icon-sm)]',
} as const

const radiusMap = {
  large: 'rounded-[var(--comp-checkbox-radius-lg)]',
  medium: 'rounded-[var(--comp-checkbox-radius-md)]',
  small: 'rounded-[var(--comp-checkbox-radius-sm)]',
} as const

const gapMap = {
  large: 'gap-[var(--comp-checkbox-gap-lg)]',
  medium: 'gap-[var(--comp-checkbox-gap-md)]',
  small: 'gap-[var(--comp-checkbox-gap-sm)]',
} as const

const labelTypoMap = {
  large: 'typography-16-regular',
  medium: 'typography-14-regular',
  small: 'typography-13-regular',
} as const

/* ─── Check icon ─── */

function CheckIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Dash icon (indeterminate) ─── */

function DashIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.5 6H9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ─── Props ─── */

export interface CheckboxProps {
  /**
   * 크기 variant. 체크박스 크기, 아이콘 크기, 라벨 타이포그래피를 제어한다.
   * @default 'medium'
   * @see CHECKBOX_SIZES
   */
  size?: CheckboxSize

  /**
   * 체크 상태. boolean 또는 'indeterminate'.
   * @default false
   */
  checked?: boolean | 'indeterminate'

  /**
   * 체크 상태 변경 콜백.
   * @default undefined
   */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void

  /**
   * 체크박스 옆에 표시되는 라벨 텍스트.
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

export function Checkbox({
  size = 'medium',
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  required,
  name,
  value = 'on',
  className,
  id: idProp,
}: CheckboxProps) {
  const autoId = useId()
  const checkboxId = idProp ?? autoId

  const isChecked = checked === true || checked === 'indeterminate'

  return (
    <div className={cn('inline-flex items-center', gapMap[size], className)}>
      <CheckboxPrimitive.Root
        id={checkboxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
        className={cn(
          'relative flex items-center justify-center shrink-0 transition-colors duration-fast ease-enter',
          boxSizeMap[size],
          radiusMap[size],
          // Checked/unchecked states
          isChecked
            ? disabled
              ? 'bg-[var(--comp-checkbox-bg-checked-disabled)]'
              : 'bg-[var(--comp-checkbox-bg-checked)]'
            : disabled
              ? 'border-2 border-[var(--comp-checkbox-border-disabled)] bg-transparent'
              : 'border-2 border-[var(--comp-checkbox-border)] bg-transparent hover:border-[var(--comp-checkbox-border-hover)]',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-checkbox-focus-ring)] focus-visible:ring-offset-2',
          // Cursor
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        {/* Hover overlay for checked state */}
        {isChecked && !disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter hover:bg-[var(--comp-checkbox-hover-on-dim)]"
          />
        )}

        <CheckboxPrimitive.Indicator className="flex items-center justify-center" forceMount>
          <span
            className={cn(
              'transition-transform duration-fast ease-enter',
              iconSizeMap[size],
              isChecked ? 'scale-100' : 'scale-0',
              isChecked
                ? disabled
                  ? 'text-[var(--comp-checkbox-icon-checked-disabled)]'
                  : 'text-[var(--comp-checkbox-icon-checked)]'
                : 'text-transparent',
            )}
          >
            {checked === 'indeterminate' ? <DashIcon className="size-full" /> : <CheckIcon className="size-full" />}
          </span>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label
          htmlFor={checkboxId}
          className={cn(
            labelTypoMap[size],
            disabled
              ? 'text-[var(--comp-checkbox-label-disabled)] cursor-not-allowed'
              : 'text-[var(--comp-checkbox-label-color)] cursor-pointer',
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}
