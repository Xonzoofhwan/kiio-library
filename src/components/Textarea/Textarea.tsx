import { forwardRef, useState, useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─── */

export const TEXTAREA_SIZES = ['xLarge', 'large'] as const
export const TEXTAREA_VALIDATIONS = ['default', 'error', 'success'] as const
export const TEXTAREA_LABEL_TYPES = ['none', 'optional', 'asterisk'] as const
export const TEXTAREA_RESIZES = ['none', 'vertical', 'both'] as const

export type TextareaSize = (typeof TEXTAREA_SIZES)[number]
export type TextareaValidation = (typeof TEXTAREA_VALIDATIONS)[number]
export type TextareaLabelType = (typeof TEXTAREA_LABEL_TYPES)[number]
export type TextareaResize = (typeof TEXTAREA_RESIZES)[number]

/* ─── CVA: field container ─── */

const fieldVariants = cva(
  'group relative flex w-full overflow-hidden transition-colors duration-fast ease-enter',
  {
    variants: {
      size: {
        xLarge:
          'px-[var(--comp-textarea-px-xl)] py-[var(--comp-textarea-py-xl)] gap-[var(--comp-textarea-gap-xl)] rounded-[var(--comp-textarea-radius-xl)] typography-18-regular',
        large:
          'px-[var(--comp-textarea-px-lg)] py-[var(--comp-textarea-py-lg)] gap-[var(--comp-textarea-gap-lg)] rounded-[var(--comp-textarea-radius-lg)] typography-16-regular',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  },
)

/* ─── Icon size map ─── */

const iconSizeMap = {
  xLarge: 'size-[var(--comp-textarea-icon-xl)]',
  large: 'size-[var(--comp-textarea-icon-lg)]',
} as const

/* ─── Focused border color per validation ─── */

const focusBorderMap = {
  default: 'border-[var(--comp-input-border-default)]',
  error: 'border-[var(--comp-input-border-error)]',
  success: 'border-[var(--comp-input-border-success)]',
} as const

/* ─── Resize class map ─── */

const resizeMap = {
  none: 'resize-none',
  vertical: 'resize-y',
  both: 'resize',
} as const

/* ─── Helper text icon component ─── */

function HelperIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4 shrink-0', className)}
      {...props}
    >
      <path
        d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM7.5 5.5C7.5 5.22386 7.72386 5 8 5C8.27614 5 8.5 5.22386 8.5 5.5V8.5C8.5 8.77614 8.27614 9 8 9C7.72386 9 7.5 8.77614 7.5 8.5V5.5ZM8 11C7.58579 11 7.25 10.6642 7.25 10.25C7.25 9.83579 7.58579 9.5 8 9.5C8.41421 9.5 8.75 9.83579 8.75 10.25C8.75 10.6642 8.41421 11 8 11Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ─── Props ─── */

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof fieldVariants> {
  /**
   * 크기 variant. 패딩, 타이포그래피, 아이콘 크기를 제어한다.
   * @default 'large'
   * @see TEXTAREA_SIZES
   */
  size?: TextareaSize

  /**
   * 유효성 검사 상태. 포커스 시 border 색상과 helper text 스타일을 결정한다.
   * @default 'default'
   * @see TEXTAREA_VALIDATIONS
   */
  validation?: TextareaValidation

  /**
   * 텍스트 영역 위에 표시되는 라벨 텍스트.
   * @default undefined
   */
  label?: string

  /**
   * 라벨 접미사 유형. 'optional'은 (Optional)을, 'asterisk'는 빨간 별표를 추가한다.
   * @default 'none'
   * @see TEXTAREA_LABEL_TYPES
   */
  labelType?: TextareaLabelType

  /**
   * 텍스트 영역 아래 도움 텍스트. validation prop에 따라 스타일이 변경된다.
   * @default undefined
   */
  helperText?: string

  /**
   * 문자 수 카운터 표시 여부. maxLength prop과 함께 사용한다.
   * @default false
   */
  counter?: boolean

  /**
   * CSS resize 동작.
   * @default 'vertical'
   * @see TEXTAREA_RESIZES
   */
  resize?: TextareaResize

  /**
   * 텍스트 뒤(trailing)에 표시할 아이콘.
   * @default undefined
   */
  iconTrailing?: React.ReactNode

  /**
   * 너비 모드. false는 hug, true는 fill.
   * @default false
   */
  fullWidth?: boolean
}

/* ─── Component ─── */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    size = 'large',
    validation = 'default',
    label,
    labelType = 'none',
    helperText,
    counter = false,
    resize = 'vertical',
    iconTrailing,
    fullWidth = false,
    disabled,
    readOnly,
    maxLength,
    rows = 3,
    value,
    defaultValue,
    onChange,
    id: idProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const textareaId = idProp ?? autoId
  const helperId = `${textareaId}-helper`

  const [isFocused, setIsFocused] = useState(false)
  const [charCount, setCharCount] = useState(() => {
    const initial = value ?? defaultValue ?? ''
    return String(initial).length
  })

  const resolvedSize = size ?? 'large'

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    onChange?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  const isOverLimit = counter && maxLength != null && charCount > maxLength

  return (
    <div className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-fit', className)}>
      {/* ── Label ── */}
      {label && (
        <label
          htmlFor={textareaId}
          className="flex items-center pb-[var(--spacing-2)] typography-14-semibold text-[var(--comp-input-label-color)]"
        >
          {label}
          {labelType === 'optional' && (
            <span className="ml-1 typography-14-regular text-[var(--comp-input-label-optional)]">
              (Optional)
            </span>
          )}
          {labelType === 'asterisk' && (
            <span className="ml-0.5 typography-14-semibold text-[var(--comp-input-label-asterisk)]">
              *
            </span>
          )}
        </label>
      )}

      {/* ── Field + Helptext ── */}
      <div className="flex flex-col gap-[var(--spacing-1\.5)]">
        {/* ── Field container ── */}
        <div
          className={cn(
            fieldVariants({ size }),
            // Background state
            disabled
              ? 'bg-[var(--comp-input-bg-disabled)] cursor-not-allowed'
              : readOnly
                ? 'bg-[var(--comp-input-bg-readonly)]'
                : isFocused
                  ? 'bg-[var(--comp-input-bg-focused)]'
                  : 'bg-[var(--comp-input-bg-default)]',
          )}
        >
          {/* Focused border layer */}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
              isFocused && !disabled && !readOnly && `border-2 ${focusBorderMap[validation]}`,
            )}
          />

          {/* State overlay (hover/pressed) */}
          {!disabled && !readOnly && !isFocused && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter group-hover:bg-[var(--comp-input-hover-on-bright)] group-active:bg-[var(--comp-input-active-on-bright)]"
            />
          )}

          {/* Native textarea */}
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={validation === 'error' || undefined}
            aria-describedby={helperText ? helperId : undefined}
            className={cn(
              'relative flex-1 min-w-0 bg-transparent outline-none',
              resizeMap[resize],
              'placeholder:text-[var(--comp-input-content-placeholder)]',
              disabled
                ? 'text-[var(--comp-input-content-disabled)] cursor-not-allowed'
                : isFocused
                  ? 'text-[var(--comp-input-content-focused)]'
                  : 'text-[var(--comp-input-content-typed)]',
            )}
            {...props}
          />

          {/* Trailing icon */}
          {iconTrailing && (
            <span
              className={cn(
                'flex-shrink-0 relative self-start',
                iconSizeMap[resolvedSize],
                disabled
                  ? 'text-[var(--comp-input-icon-disabled)]'
                  : validation === 'error'
                    ? 'text-[var(--comp-input-icon-error)]'
                    : validation === 'success'
                      ? 'text-[var(--comp-input-icon-success)]'
                      : 'text-[var(--comp-input-icon-color)]',
              )}
            >
              {iconTrailing}
            </span>
          )}
        </div>

        {/* ── Helper text area ── */}
        {(helperText || counter) && (
          <div className="flex items-start justify-between">
            {/* Helper text */}
            {helperText && (
              <div
                id={helperId}
                className={cn(
                  'flex items-center gap-[var(--spacing-0\\.5)] flex-1',
                  validation === 'error'
                    ? 'text-[var(--comp-input-helper-error-color)]'
                    : validation === 'success'
                      ? 'text-[var(--comp-input-helper-success-color)]'
                      : 'text-[var(--comp-input-helper-color)]',
                )}
              >
                <HelperIcon
                  className={cn(
                    validation === 'error'
                      ? 'text-[var(--comp-input-helper-error-icon)]'
                      : validation === 'success'
                        ? 'text-[var(--comp-input-helper-success-icon)]'
                        : 'text-[var(--comp-input-helper-icon)]',
                  )}
                />
                <span className="typography-13-regular">{helperText}</span>
              </div>
            )}

            {/* Counter */}
            {counter && maxLength != null && (
              <span
                className={cn(
                  'typography-13-regular text-right shrink-0',
                  isOverLimit
                    ? 'text-[var(--comp-input-counter-error)]'
                    : 'text-[var(--comp-input-counter-color)]',
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
