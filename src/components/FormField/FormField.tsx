import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const FORMFIELD_LAYOUTS = ['top', 'left'] as const
export type FormFieldLayout = (typeof FORMFIELD_LAYOUTS)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface FormFieldContextValue {
  id: string
  error: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
}

const FormFieldContext = createContext<FormFieldContextValue>({
  id: '',
  error: false,
  disabled: false,
  readOnly: false,
  required: false,
})

export function useFormField(): FormFieldContextValue {
  return useContext(FormFieldContext)
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * FormField는 입력 컴포넌트(TextField, Textarea 등)를 감싸는 구조적 컨테이너다.
 * Label, Description, Helper/Error 메시지, Character Count를 관리하고
 * React Context를 통해 상태를 하위 입력 컴포넌트에 전파한다.
 */
export interface FormFieldProps {
  /**
   * 고유 ID. Label-Input 연결(htmlFor/id), aria-describedby 생성에 사용.
   */
  id: string

  /**
   * Label 텍스트.
   */
  label: string

  /**
   * Label 위치.
   * @default 'top'
   * @see FORMFIELD_LAYOUTS
   */
  layout?: FormFieldLayout

  /**
   * 필수 여부. true이면 Label 뒤에 빨간 asterisk 표시, Input에 aria-required 전파.
   * @default false
   */
  required?: boolean

  /**
   * Description 텍스트 (Input 위 안내 역할).
   */
  description?: string

  /**
   * Helper 텍스트 (Input 아래 보조 힌트). error 시 errorMessage로 교체됨.
   */
  helperText?: string

  /**
   * 유효성 검증 실패 상태.
   * @default false
   */
  error?: boolean

  /**
   * Error 메시지. error=true일 때 helperText를 대체하여 표시.
   */
  errorMessage?: string

  /**
   * 비활성 상태. Input에 전파.
   * @default false
   */
  disabled?: boolean

  /**
   * 읽기 전용 상태. Input에 전파.
   * @default false
   */
  readOnly?: boolean

  /**
   * 현재 글자 수. maxCount와 함께 사용.
   */
  count?: number

  /**
   * 최대 글자 수. count와 함께 사용.
   */
  maxCount?: number

  /** 하위 Input 컴포넌트 */
  children: React.ReactNode
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function FormField({
  id,
  label,
  layout = 'top',
  required = false,
  description,
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  readOnly = false,
  count,
  maxCount,
  children,
}: FormFieldProps) {
  const ctx: FormFieldContextValue = { id, error, disabled, readOnly, required }

  const hasDescription = Boolean(description)
  const hasBottom = Boolean(helperText || (error && errorMessage) || count != null)
  const isCountOver = count != null && maxCount != null && count > maxCount

  const labelClass = cn(
    'typography-14-semibold',
    disabled
      ? 'text-[color:var(--comp-formfield-text-label-disabled)]'
      : 'text-[color:var(--comp-formfield-text-label)]',
  )

  const descriptionClass = cn(
    'typography-13-regular',
    disabled
      ? 'text-[color:var(--comp-formfield-text-description-disabled)]'
      : 'text-[color:var(--comp-formfield-text-description)]',
  )

  const bottomTextClass = cn(
    'typography-13-regular flex-1 min-w-0',
    error
      ? 'text-[color:var(--comp-formfield-text-error)]'
      : disabled
        ? 'text-[color:var(--comp-formfield-text-helper-disabled)]'
        : 'text-[color:var(--comp-formfield-text-helper)]',
  )

  const countClass = cn(
    'typography-13-regular flex-shrink-0',
    disabled
      ? 'text-[color:var(--comp-formfield-text-count-disabled)]'
      : isCountOver
        ? 'text-[color:var(--comp-formfield-text-count-over)]'
        : 'text-[color:var(--comp-formfield-text-count)]',
  )

  /* ── Shared: Label element ── */
  const labelEl = (
    <label
      id={`${id}-label`}
      htmlFor={id}
      className={labelClass}
    >
      {label}
      {required && (
        <span
          aria-hidden
          className="ml-0.5 text-[color:var(--comp-formfield-text-required)]"
        >
          *
        </span>
      )}
    </label>
  )

  /* ── Shared: Content (description + input + bottom) ── */
  const contentEl = (
    <div className="flex flex-col min-w-0">
      {hasDescription && (
        <p
          id={`${id}-description`}
          className={descriptionClass}
          style={{ marginTop: 'var(--comp-formfield-gap-label-description)' }}
        >
          {description}
        </p>
      )}

      <FormFieldContext.Provider value={ctx}>
        <div
          style={{
            marginTop: hasDescription
              ? 'var(--comp-formfield-gap-description-input)'
              : 'var(--comp-formfield-gap-label-input)',
          }}
        >
          {children}
        </div>
      </FormFieldContext.Provider>

      {hasBottom && (
        <div
          className="flex items-start"
          style={{
            marginTop: 'var(--comp-formfield-gap-input-bottom)',
            gap: 'var(--comp-formfield-gap-bottom-text-count)',
          }}
        >
          <p id={`${id}-bottom`} aria-live="polite" className={bottomTextClass}>
            {error && errorMessage ? errorMessage : helperText}
          </p>
          {count != null && maxCount != null && (
            <span className={countClass}>
              {count}/{maxCount}
            </span>
          )}
        </div>
      )}
    </div>
  )

  /* ── Top layout ── */
  if (layout === 'top') {
    return (
      <div role="group" aria-labelledby={`${id}-label`}>
        <div
          className="flex flex-col"
          style={{ gap: 'var(--comp-formfield-gap-label-description)' }}
        >
          {labelEl}
        </div>
        {contentEl}
      </div>
    )
  }

  /* ── Left layout ── */
  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="grid items-start"
      style={{
        gridTemplateColumns: 'auto 1fr',
        gap: `0 var(--comp-formfield-gap-left-label)`,
      }}
    >
      <div className="flex items-start pt-[3px]">
        {labelEl}
      </div>
      {contentEl}
    </div>
  )
}
