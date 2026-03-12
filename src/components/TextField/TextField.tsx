import { forwardRef, useRef, useState } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/FormField'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TEXTFIELD_SIZES = ['xSmall', 'small', 'medium', 'large', 'xLarge'] as const
export type TextFieldSize = (typeof TEXTFIELD_SIZES)[number]

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const containerVariants = cva(
  'group relative flex items-center border overflow-hidden transition-colors duration-fast ease-move',
  {
    variants: {
      size: {
        xSmall: 'h-[var(--comp-textfield-height-xs)] px-[var(--comp-textfield-px-xs)] gap-[var(--comp-textfield-gap-xs)] rounded-[var(--comp-textfield-radius-xs)]',
        small:  'h-[var(--comp-textfield-height-sm)] px-[var(--comp-textfield-px-sm)] gap-[var(--comp-textfield-gap-sm)] rounded-[var(--comp-textfield-radius-sm)]',
        medium: 'h-[var(--comp-textfield-height-md)] px-[var(--comp-textfield-px-md)] gap-[var(--comp-textfield-gap-md)] rounded-[var(--comp-textfield-radius-md)]',
        large:  'h-[var(--comp-textfield-height-lg)] px-[var(--comp-textfield-px-lg)] gap-[var(--comp-textfield-gap-lg)] rounded-[var(--comp-textfield-radius-lg)]',
        xLarge: 'h-[var(--comp-textfield-height-xl)] px-[var(--comp-textfield-px-xl)] gap-[var(--comp-textfield-gap-xl)] rounded-[var(--comp-textfield-radius-xl)]',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit min-w-[200px]',
      },
    },
    defaultVariants: {
      size: 'medium',
      fullWidth: true,
    },
  },
)

/* ─── Lookup maps ──────────────────────────────────────────────────────────── */

const iconSizeMap: Record<TextFieldSize, string> = {
  xSmall: 'size-[var(--comp-textfield-icon-xs)]',
  small:  'size-[var(--comp-textfield-icon-sm)]',
  medium: 'size-[var(--comp-textfield-icon-md)]',
  large:  'size-[var(--comp-textfield-icon-lg)]',
  xLarge: 'size-[var(--comp-textfield-icon-xl)]',
}

const typographyMap: Record<TextFieldSize, string> = {
  xSmall: 'typography-12-regular',
  small:  'typography-13-regular',
  medium: 'typography-14-regular',
  large:  'typography-15-regular',
  xLarge: 'typography-16-regular',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * TextField는 단일 행(single-line) 텍스트 입력 컴포넌트다.
 * 5가지 크기, 다양한 상태(Rest/Hover/Focus/Error/Positive/Disabled/ReadOnly),
 * Prefix/Suffix 슬롯, Clear 버튼, 비밀번호 토글을 지원한다.
 * FormField 안에서 사용하면 Context를 통해 상태가 자동 전파된다.
 */
export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * 고유 ID. FormField Context에서 자동 전달되거나 직접 지정.
   */
  id?: string

  /**
   * 크기 variant. 높이, 패딩, 타이포그래피, 아이콘 크기 제어.
   * @default 'medium'
   * @see TEXTFIELD_SIZES
   */
  size?: TextFieldSize

  /**
   * 오류 상태. FormField Context에서 자동 전달되거나 직접 지정.
   * @default false
   */
  error?: boolean

  /**
   * 성공 상태. 초록 border와 아이콘을 표시한다.
   * @default false
   */
  positive?: boolean

  /**
   * 비활성 상태. FormField Context에서 자동 전달되거나 직접 지정.
   * @default false
   */
  disabled?: boolean

  /**
   * 읽기 전용 상태. FormField Context에서 자동 전달되거나 직접 지정.
   * @default false
   */
  readOnly?: boolean

  /**
   * Clear 버튼 표시 여부. 값이 있을 때만 표시.
   * @default false
   */
  clearable?: boolean

  /**
   * Escape 키로도 값을 초기화할지 여부.
   * @default true
   */
  clearOnEscape?: boolean

  /**
   * 좌측 슬롯. 아이콘(ReactNode) 또는 텍스트(string).
   */
  startEnhancer?: React.ReactNode

  /**
   * 우측 슬롯. 아이콘(ReactNode) 또는 텍스트(string). 비밀번호 토글, Clear 버튼보다 바깥쪽에 위치.
   */
  endEnhancer?: React.ReactNode

  /**
   * 입력 type. 'password'이면 마스크 토글 버튼 자동 삽입.
   * @default 'text'
   */
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'number'

  /**
   * 컨테이너 너비를 100%로 확장.
   * @default true
   */
  fullWidth?: boolean

  /**
   * pill 형태. border-radius를 완전 둥근 끝(9999px)으로 설정한다.
   * @default false
   */
  pill?: boolean

  /**
   * Clear 버튼 클릭 시 콜백.
   */
  onClear?: () => void
}

/* ─── Icons ─────────────────────────────────────────────────────────────────── */

const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 10s3.5-6 8-6 8 6 8 6-3.5 6-8 6-8-6-8-6Z" />
    <circle cx="10" cy="10" r="2.5" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 3l14 14M8.5 8.6A2.5 2.5 0 0013.4 11.5M6.5 6.6C4.7 7.7 3.3 9.1 2 10s6 6 8 6c1.5 0 3-.5 4.2-1.3M10 4c2.5 0 5.2 2 8 6a19 19 0 01-2.1 2.7" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 10l5 5 7-8" />
  </svg>
)

const AlertIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 6.5v4M10 13.5h.01" />
  </svg>
)

/* ─── Component ────────────────────────────────────────────────────────────── */

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id: idProp,
      size = 'medium',
      error: errorProp,
      positive = false,
      disabled: disabledProp,
      readOnly: readOnlyProp,
      clearable = false,
      clearOnEscape = true,
      startEnhancer,
      endEnhancer,
      type = 'text',
      fullWidth = true,
      pill = false,
      onChange,
      onClear,
      onFocus,
      onBlur,
      onKeyDown,
      value,
      defaultValue,
      className,
      ...props
    },
    ref,
  ) => {
    /* Merge FormField context */
    const ctx = useFormField()
    const id = idProp ?? ctx.id ?? undefined
    const error = errorProp ?? ctx.error
    const disabled = disabledProp ?? ctx.disabled
    const readOnly = readOnlyProp ?? ctx.readOnly
    const required = ctx.required

    /* Local state */
    const [focused, setFocused] = useState(false)
    const [keyboardFocused, setKeyboardFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const pointerRef = useRef(false)

    const isPassword = type === 'password'
    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type
    const isDisabled = disabled
    const isReadOnly = readOnly

    /* Value tracking for clearable (controlled & uncontrolled) */
    const hasValue = value != null
      ? String(value).length > 0
      : false
    const showClear = clearable && hasValue && !isDisabled && !isReadOnly

    /* ── Focus handlers ── */
    const handlePointerDown = () => {
      pointerRef.current = true
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      setKeyboardFocused(!pointerRef.current)
      pointerRef.current = false
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      setKeyboardFocused(false)
      onBlur?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (clearOnEscape && e.key === 'Escape' && clearable && hasValue) {
        onClear?.()
      }
      onKeyDown?.(e)
    }

    /* ── Derived container state classes ── */
    const containerBg = isDisabled
      ? 'bg-[var(--comp-textfield-bg-disabled)]'
      : isReadOnly
        ? 'bg-[var(--comp-textfield-bg-readonly)]'
        : error && focused
          ? 'bg-[var(--comp-textfield-bg-error-focus)]'
          : error
            ? 'bg-[var(--comp-textfield-bg-error)]'
            : focused
              ? 'bg-[var(--comp-textfield-bg-focus)]'
              : 'bg-[var(--comp-textfield-bg)]'

    // positive는 아이콘만 표시 — bg/border는 일반 상태와 동일
    const containerBorder = isDisabled
      ? 'border-[color:var(--comp-textfield-border-disabled)]'
      : isReadOnly
        ? 'border-[color:var(--comp-textfield-border-readonly)]'
        : error
          ? 'border-[color:var(--comp-textfield-border-error)]'
          : focused
            ? 'border-[color:var(--comp-textfield-border-focus)]'
            : 'border-[color:var(--comp-textfield-border)]'

    const containerRing = keyboardFocused && !isDisabled
      ? error
        ? 'ring-2 ring-offset-2 ring-[var(--comp-textfield-focus-ring-error)]'
        : 'ring-2 ring-offset-2 ring-[var(--comp-textfield-focus-ring)]'
      : ''

    /* ── Icon slot shared class ── */
    const iconSlotClass = cn('flex-shrink-0 flex items-center', iconSizeMap[size])

    /* ── Suffix icon color ── */
    const validationIconColor = isDisabled
      ? 'text-[color:var(--comp-textfield-icon-disabled)]'
      : error
        ? 'text-[color:var(--comp-textfield-icon-error)]'
        : positive
          ? 'text-[color:var(--comp-textfield-icon-positive)]'
          : 'text-[color:var(--comp-textfield-icon-color)]'

    /* ── aria-describedby ── */
    const describedBy = [
      ctx.id && `${ctx.id}-description`,
      ctx.id && `${ctx.id}-bottom`,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div
        className={cn(
          containerVariants({ size, fullWidth }),
          pill && 'rounded-[9999px]',
          containerBg,
          containerBorder,
          containerRing,
          isDisabled && 'cursor-not-allowed',
          className,
        )}
        onPointerDown={handlePointerDown}
      >
        {/* ── State overlay (hover/active feedback) ── */}
        {!isDisabled && !isReadOnly && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
              'group-hover:bg-[var(--comp-textfield-hover-on-bright)] group-active:bg-[var(--comp-textfield-active-on-bright)]',
            )}
          />
        )}

        {/* ── Prefix (startEnhancer) ── */}
        {startEnhancer != null && (
          typeof startEnhancer === 'string' ? (
            <span
              aria-hidden
              className={cn(
                'relative flex-shrink-0',
                typographyMap[size],
                isDisabled
                  ? 'text-[color:var(--comp-textfield-icon-disabled)]'
                  : 'text-[color:var(--comp-textfield-text-prefix)]',
              )}
            >
              {startEnhancer}
            </span>
          ) : (
            <span
              aria-hidden
              className={cn(
                'relative',
                iconSlotClass,
                isDisabled
                  ? 'text-[color:var(--comp-textfield-icon-disabled)]'
                  : 'text-[color:var(--comp-textfield-icon-color)]',
              )}
            >
              {startEnhancer}
            </span>
          )
        )}

        {/* ── Input ── */}
        <input
          ref={ref}
          id={id}
          type={effectiveType}
          value={value}
          defaultValue={defaultValue}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={error || undefined}
          aria-disabled={isDisabled || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative flex-1 bg-transparent outline-none min-w-0',
            typographyMap[size],
            isDisabled
              ? cn(
                  'cursor-not-allowed',
                  'text-[color:var(--comp-textfield-text-disabled)]',
                  'placeholder:text-[color:var(--comp-textfield-text-placeholder-disabled)]',
                )
              : cn(
                  'text-[color:var(--comp-textfield-text)]',
                  'placeholder:text-[color:var(--comp-textfield-text-placeholder)]',
                  'caret-[color:var(--comp-textfield-caret)]',
                ),
            // Hide browser search clear button
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
          {...props}
        />

        {/* ── Suffix: Validation icon ── */}
        {!isDisabled && (error || positive) && (
          <span className={cn('relative', iconSlotClass, validationIconColor)}>
            {error ? <AlertIcon /> : <CheckIcon />}
          </span>
        )}

        {/* ── Suffix: Password toggle ── */}
        {isPassword && (
          <button
            type="button"
            tabIndex={0}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            disabled={isDisabled}
            onClick={() => setShowPassword(v => !v)}
            className={cn(
              'relative flex-shrink-0 flex items-center',
              iconSizeMap[size],
              isDisabled
                ? 'text-[color:var(--comp-textfield-icon-disabled)] cursor-not-allowed'
                : 'text-[color:var(--comp-textfield-icon-color)] hover:text-[color:var(--comp-textfield-text)] transition-colors duration-fast ease-enter outline-none focus-visible:ring-1 focus-visible:ring-[var(--comp-textfield-focus-ring)] rounded-px',
            )}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}

        {/* ── Suffix: Clear button ── */}
        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="입력 지우기"
            onClick={onClear}
            className={cn(
              'relative flex-shrink-0 flex items-center',
              iconSizeMap[size],
              'text-[color:var(--comp-textfield-icon-color)] hover:text-[color:var(--comp-textfield-text)] transition-colors duration-fast ease-enter outline-none',
            )}
          >
            <XIcon />
          </button>
        )}

        {/* ── Suffix: endEnhancer ── */}
        {endEnhancer != null && (
          typeof endEnhancer === 'string' ? (
            <span
              aria-hidden
              className={cn(
                'relative flex-shrink-0',
                typographyMap[size],
                isDisabled
                  ? 'text-[color:var(--comp-textfield-icon-disabled)]'
                  : 'text-[color:var(--comp-textfield-text-prefix)]',
              )}
            >
              {endEnhancer}
            </span>
          ) : (
            <span
              aria-hidden
              className={cn(
                'relative',
                iconSlotClass,
                isDisabled
                  ? 'text-[color:var(--comp-textfield-icon-disabled)]'
                  : 'text-[color:var(--comp-textfield-icon-color)]',
              )}
            >
              {endEnhancer}
            </span>
          )
        )}
      </div>
    )
  },
)

TextField.displayName = 'TextField'
