import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/FormField'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TEXTAREA_SIZES = ['large', 'xLarge'] as const
export type TextareaSize = (typeof TEXTAREA_SIZES)[number]

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const containerVariants = cva(
  'group relative flex border overflow-hidden transition-colors duration-fast ease-move',
  {
    variants: {
      size: {
        large:  'px-[var(--comp-textarea-px-lg)] py-[var(--comp-textarea-py-lg)] rounded-[var(--comp-textarea-radius-lg)]',
        xLarge: 'px-[var(--comp-textarea-px-xl)] py-[var(--comp-textarea-py-xl)] rounded-[var(--comp-textarea-radius-xl)]',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit min-w-[200px]',
      },
    },
    defaultVariants: {
      size: 'large',
      fullWidth: true,
    },
  },
)

/* ─── Lookup maps ──────────────────────────────────────────────────────────── */

const typographyMap: Record<TextareaSize, string> = {
  large:  'typography-16-regular',
  xLarge: 'typography-18-regular',
}

/** Line-height in px per size — from typography.ts */
const lineHeightMap: Record<TextareaSize, number> = {
  large:  24,
  xLarge: 26,
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * Textarea는 멀티라인 텍스트 입력 컴포넌트다.
 * 2가지 크기(large/xLarge), 다양한 상태(Rest/Hover/Focus/Error/Positive/Disabled/ReadOnly),
 * 자동 높이 조절(autoResize), 행 수 제어(minRows/maxRows)를 지원한다.
 * FormField 안에서 사용하면 Context를 통해 상태가 자동 전파된다.
 */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 고유 ID. FormField Context에서 자동 전달되거나 직접 지정.
   */
  id?: string

  /**
   * 크기 variant. 패딩, 타이포그래피, border-radius를 제어한다. 높이는 minRows/maxRows로 별도 결정.
   * @default 'large'
   * @see TEXTAREA_SIZES
   */
  size?: TextareaSize

  /**
   * 최소 행 수. lineHeight 기반으로 min-height를 계산한다.
   * @default 3
   */
  minRows?: number

  /**
   * 최대 행 수. lineHeight 기반으로 max-height를 계산한다. 초과 시 스크롤.
   * @default undefined (무제한)
   */
  maxRows?: number

  /**
   * 내용에 따라 높이를 자동 조절한다.
   * @default false
   */
  autoResize?: boolean

  /**
   * 오류 상태. FormField Context에서 자동 전달되거나 직접 지정.
   * @default false
   */
  error?: boolean

  /**
   * 성공 상태. border 색상을 변경한다.
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
   * 컨테이너 너비를 100%로 확장.
   * @default true
   */
  fullWidth?: boolean

}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: idProp,
      size = 'large',
      minRows = 3,
      maxRows,
      autoResize = false,
      error: errorProp,
      positive = false,
      disabled: disabledProp,
      readOnly: readOnlyProp,
      fullWidth = true,
      onChange,
      onFocus,
      onBlur,
      value,
      defaultValue,
      className,
      style,
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

    const isDisabled = disabled
    const isReadOnly = readOnly

    /* Local state */
    const [focused, setFocused] = useState(false)
    const [keyboardFocused, setKeyboardFocused] = useState(false)
    const pointerRef = useRef(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    /* Merge forwarded ref + internal ref */
    const mergedRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref],
    )

    /* ── Height calculation ── */
    const lineHeight = lineHeightMap[size]
    const minHeightPx = lineHeight * minRows
    const maxHeightPx = maxRows ? lineHeight * maxRows : undefined

    /* ── Auto-resize logic ── */
    const adjustHeight = useCallback(() => {
      const el = textareaRef.current
      if (!el) return
      el.style.height = 'auto'
      let desired = el.scrollHeight
      if (desired < minHeightPx) desired = minHeightPx
      if (maxHeightPx && desired > maxHeightPx) desired = maxHeightPx
      el.style.height = `${desired}px`
    }, [minHeightPx, maxHeightPx])

    // Adjust on mount + when value changes externally (controlled)
    useLayoutEffect(() => {
      if (autoResize) adjustHeight()
    }, [autoResize, adjustHeight, value])

    /* ── Focus handlers ── */
    const handlePointerDown = () => {
      pointerRef.current = true
    }

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true)
      setKeyboardFocused(!pointerRef.current)
      pointerRef.current = false
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false)
      setKeyboardFocused(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      if (autoResize) adjustHeight()
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

    /* ── aria-describedby ── */
    const describedBy = [
      ctx.id && `${ctx.id}-description`,
      ctx.id && `${ctx.id}-bottom`,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div
        className={cn(
          containerVariants({ size, fullWidth }),
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

        {/* ── Textarea element ── */}
        <textarea
          ref={mergedRef}
          id={id}
          value={value}
          defaultValue={defaultValue}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={error || undefined}
          aria-disabled={isDisabled || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            minHeight: `${minHeightPx}px`,
            maxHeight: maxHeightPx ? `${maxHeightPx}px` : undefined,
            resize: 'none',
            ...style,
          }}
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
          )}
          {...props}
        />
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
