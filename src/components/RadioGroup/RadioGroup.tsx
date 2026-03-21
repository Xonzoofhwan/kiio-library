import { forwardRef, createContext, useContext } from 'react'
import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const RADIO_GROUP_SIZES = ['medium', 'large'] as const
export const RADIO_GROUP_ORIENTATIONS = ['vertical', 'horizontal'] as const

export type RadioGroupSize = (typeof RADIO_GROUP_SIZES)[number]
export type RadioGroupOrientation = (typeof RADIO_GROUP_ORIENTATIONS)[number]

/* ─── Size maps ────────────────────────────────────────────────────────────── */

const sizeAbbr: Record<RadioGroupSize, string> = { medium: 'md', large: 'lg' }

const labelTypography: Record<RadioGroupSize, string> = {
  medium: 'typography-14-medium',
  large:  'typography-16-medium',
}

const descriptionTypography: Record<RadioGroupSize, string> = {
  medium: 'typography-13-regular',
  large:  'typography-14-regular',
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface RadioGroupContextValue {
  size: RadioGroupSize
  disabled: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
  size: 'medium',
  disabled: false,
})

/* ─── RadioGroup (Root) ────────────────────────────────────────────────────── */

export interface RadioGroupProps {
  /** 선택된 항목의 value. */
  value?: string
  /** 값 변경 콜백. */
  onValueChange?: (value: string) => void
  /** 비제어 모드 기본값. */
  defaultValue?: string
  /** 크기. @default 'medium' @see {@link RADIO_GROUP_SIZES} */
  size?: RadioGroupSize
  /** 항목 배치 방향. @default 'vertical' @see {@link RADIO_GROUP_ORIENTATIONS} */
  orientation?: RadioGroupOrientation
  /** 전체 그룹 비활성. @default false */
  disabled?: boolean
  /** 폼 필드 name. */
  name?: string
  /** 추가 CSS 클래스 */
  className?: string
  children: React.ReactNode
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      size = 'medium',
      orientation = 'vertical',
      disabled = false,
      className,
      children,
      ...radixProps
    },
    ref,
  ) => {
    const abbr = sizeAbbr[size]

    return (
      <RadioGroupContext.Provider value={{ size, disabled }}>
        <RadixRadioGroup.Root
          ref={ref}
          orientation={orientation}
          disabled={disabled}
          className={cn(
            'flex',
            orientation === 'vertical'
              ? `flex-col gap-[var(--comp-radio-item-gap-${abbr})]`
              : `flex-row flex-wrap gap-[var(--comp-radio-item-gap-${abbr})]`,
            className,
          )}
          {...radixProps}
        >
          {children}
        </RadixRadioGroup.Root>
      </RadioGroupContext.Provider>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'

/* ─── RadioGroupItem ───────────────────────────────────────────────────────── */

export interface RadioGroupItemProps {
  /** 항목 고유값. 필수. */
  value: string
  /** 라벨 텍스트. */
  label?: string
  /** 보조 설명 텍스트. */
  description?: string
  /** 개별 항목 비활성. @default false */
  disabled?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, label, description, disabled = false, className }, ref) => {
    const { size, disabled: groupDisabled } = useContext(RadioGroupContext)
    const isDisabled = disabled || groupDisabled
    const abbr = sizeAbbr[size]

    return (
      <label
        className={cn(
          'flex items-start cursor-pointer',
          `gap-[var(--comp-radio-gap-${abbr})]`,
          isDisabled && 'cursor-not-allowed',
          className,
        )}
      >
        {/* Radio indicator */}
        <RadixRadioGroup.Item
          ref={ref}
          value={value}
          disabled={isDisabled}
          className={cn(
            'shrink-0 rounded-full border-2 flex items-center justify-center',
            'transition-colors duration-fast ease-enter',
            `w-[var(--comp-radio-size-${abbr})] h-[var(--comp-radio-size-${abbr})]`,
            /* Unchecked */
            'border-[var(--comp-radio-border)] bg-transparent',
            'hover:border-[var(--comp-radio-border-hover)]',
            /* Checked */
            'data-[state=checked]:border-[var(--comp-radio-border-checked)] data-[state=checked]:bg-[var(--comp-radio-bg-checked)]',
            'data-[state=checked]:hover:border-[var(--comp-radio-border-checked-hover)] data-[state=checked]:hover:bg-[var(--comp-radio-border-checked-hover)]',
            /* Focus */
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-radio-focus-ring)] focus-visible:ring-offset-2',
            /* Disabled unchecked */
            'disabled:border-[var(--comp-radio-border-disabled)] disabled:bg-[var(--comp-radio-bg-disabled)] disabled:hover:border-[var(--comp-radio-border-disabled)]',
            /* Disabled checked */
            'disabled:data-[state=checked]:border-[var(--comp-radio-bg-checked-disabled)] disabled:data-[state=checked]:bg-[var(--comp-radio-bg-checked-disabled)]',
          )}
        >
          <RadixRadioGroup.Indicator
            className={cn(
              'block rounded-full bg-[var(--comp-radio-dot)]',
              `w-[var(--comp-radio-dot-${abbr})] h-[var(--comp-radio-dot-${abbr})]`,
            )}
          />
        </RadixRadioGroup.Item>

        {/* Label + description */}
        {(label || description) && (
          <div className="flex flex-col pt-px">
            {label && (
              <span
                className={cn(
                  labelTypography[size],
                  'text-[var(--comp-radio-label)]',
                  isDisabled && 'text-[var(--comp-radio-label-disabled)]',
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cn(
                  descriptionTypography[size],
                  'text-[var(--comp-radio-description)]',
                  isDisabled && 'text-[var(--comp-radio-label-disabled)]',
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    )
  },
)

RadioGroupItem.displayName = 'RadioGroupItem'
