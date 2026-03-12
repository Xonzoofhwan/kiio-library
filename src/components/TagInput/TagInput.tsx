import { useRef, useState } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/FormField'
import { ChipTag } from '@/components/Chip'
import type { ChipSize } from '@/components/Chip'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TAG_INPUT_SIZES = ['xSmall', 'small', 'medium', 'large', 'xLarge'] as const
export const TAG_POSITIONS = ['inline', 'below'] as const

export type TagInputSize = (typeof TAG_INPUT_SIZES)[number]
export type TagPosition = (typeof TAG_POSITIONS)[number]

/* ─── Size lookup maps ─────────────────────────────────────────────────────── */

/** Chip size matching TagInput size */
const chipSizeMap: Record<TagInputSize, ChipSize> = {
  xSmall: 'small',
  small:  'small',
  medium: 'small',
  large:  'medium',
  xLarge: 'medium',
}

/** Input typography class per size */
const typographyMap: Record<TagInputSize, string> = {
  xSmall: 'typography-12-regular',
  small:  'typography-13-regular',
  medium: 'typography-14-regular',
  large:  'typography-15-regular',
  xLarge: 'typography-16-regular',
}

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

/**
 * inline 모드: 태그가 컨테이너 내부에 배치.
 * 고정 높이 대신 min-h + py를 사용해 태그가 늘어나면 컨테이너도 확장됨.
 */
const inlineContainerVariants = cva(
  'group relative flex flex-wrap items-center border transition-colors duration-fast ease-move',
  {
    variants: {
      size: {
        xSmall: 'min-h-[var(--comp-textfield-height-xs)] px-[var(--comp-textfield-px-xs)] py-0 gap-1 rounded-[var(--comp-textfield-radius-xs)]',
        small:  'min-h-[var(--comp-textfield-height-sm)] px-[var(--comp-textfield-px-sm)] py-1 gap-1 rounded-[var(--comp-textfield-radius-sm)]',
        medium: 'min-h-[var(--comp-textfield-height-md)] px-[var(--comp-textfield-px-md)] py-2 gap-1 rounded-[var(--comp-textfield-radius-md)]',
        large:  'min-h-[var(--comp-textfield-height-lg)] px-[var(--comp-textfield-px-lg)] py-2.5 gap-1 rounded-[var(--comp-textfield-radius-lg)]',
        xLarge: 'min-h-[var(--comp-textfield-height-xl)] px-[var(--comp-textfield-px-xl)] py-3.5 gap-1 rounded-[var(--comp-textfield-radius-xl)]',
      },
      fullWidth: {
        true:  'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: { size: 'medium', fullWidth: true },
  },
)

/**
 * below 모드: 입력창은 고정 높이, 태그는 아래에 별도 배치.
 * TextField와 동일한 컨테이너 스타일 사용.
 */
const belowContainerVariants = cva(
  'group relative flex items-center border transition-colors duration-fast ease-move',
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
        true:  'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: { size: 'medium', fullWidth: true },
  },
)

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * TagInput은 여러 값을 태그(Chip) 형태로 입력받는 컴포넌트다.
 *
 * - **inline**: 태그가 입력창 내부에 배치됨 (기본). 태그가 늘어나면 컨테이너 높이가 확장됨.
 * - **below**: 태그가 입력창 아래에 배치됨. 입력창은 고정 높이를 유지함.
 *
 * FormField 안에서 사용하면 Context를 통해 상태가 자동 전파됨.
 */
export interface TagInputProps {
  /**
   * 고유 ID. FormField Context에서 자동 전달되거나 직접 지정.
   */
  id?: string

  /**
   * 현재 태그 목록 (controlled).
   */
  value?: string[]

  /**
   * 태그 변경 콜백.
   */
  onChange?: (tags: string[]) => void

  /**
   * 입력창 placeholder. 태그가 없을 때만 표시.
   */
  placeholder?: string

  /**
   * 태그 배치 방식.
   * - `inline`: 입력창 내부에 태그 배치 (기본)
   * - `below`: 입력창 아래에 태그 배치
   * @default 'inline'
   * @see TAG_POSITIONS
   */
  tagsPosition?: TagPosition

  /**
   * 태그 구분자 키. 기본값은 Enter와 쉼표.
   * @default ['Enter', ',']
   */
  separators?: string[]

  /**
   * 최대 태그 수.
   */
  maxTags?: number

  /**
   * 중복 태그 허용 여부.
   * @default false
   */
  allowDuplicates?: boolean

  /**
   * 태그 유효성 검사. false를 반환하면 태그를 추가하지 않음.
   */
  validateTag?: (tag: string) => boolean

  /**
   * 크기 variant.
   * @default 'medium'
   * @see TAG_INPUT_SIZES
   */
  size?: TagInputSize

  /**
   * 오류 상태. FormField Context에서 자동 전달되거나 직접 지정.
   * @default false
   */
  error?: boolean

  /**
   * 비활성 상태. FormField Context에서 자동 전달되거나 직접 지정.
   * @default false
   */
  disabled?: boolean

  /**
   * 읽기 전용 상태.
   * @default false
   */
  readOnly?: boolean

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

  /** 추가 className */
  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function TagInput({
  id: idProp,
  value = [],
  onChange,
  placeholder,
  tagsPosition = 'inline',
  separators = ['Enter', ','],
  maxTags,
  allowDuplicates = false,
  validateTag,
  size = 'medium',
  error: errorProp,
  disabled: disabledProp,
  readOnly: readOnlyProp = false,
  fullWidth = true,
  pill = false,
  className,
}: TagInputProps) {
  /* Merge FormField context */
  const ctx = useFormField()
  const id = idProp ?? ctx.id ?? undefined
  const error = errorProp ?? ctx.error
  const disabled = disabledProp ?? ctx.disabled
  const readOnly = readOnlyProp ?? ctx.readOnly

  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [keyboardFocused, setKeyboardFocused] = useState(false)
  const pointerRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isDisabled = disabled
  const isReadOnly = readOnly
  const chipSize = chipSizeMap[size]

  const canAddMore = maxTags == null || value.length < maxTags

  /* ── Add tag ── */
  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag) return
    if (!canAddMore) return
    if (!allowDuplicates && value.includes(tag)) return
    if (validateTag && !validateTag(tag)) return
    onChange?.([...value, tag])
    setInputValue('')
  }

  /* ── Remove tag ── */
  const removeTag = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index))
  }

  /* ── Keyboard ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) {
      e.preventDefault()
      addTag(inputValue)
      return
    }
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  /* ── Focus tracking ── */
  const handlePointerDown = () => {
    pointerRef.current = true
  }

  const handleFocus = () => {
    setFocused(true)
    setKeyboardFocused(!pointerRef.current)
    pointerRef.current = false
  }

  const handleBlur = () => {
    // 입력 중인 값 있으면 자동 태그 추가
    if (inputValue.trim()) addTag(inputValue)
    setFocused(false)
    setKeyboardFocused(false)
  }

  /* ── State classes ── */
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

  /* ── Shared: input element ── */
  const inputEl = (
    <input
      ref={inputRef}
      id={id}
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={isDisabled}
      readOnly={isReadOnly}
      placeholder={value.length === 0 ? placeholder : undefined}
      aria-disabled={isDisabled || undefined}
      aria-describedby={ctx.id ? `${ctx.id}-description ${ctx.id}-bottom` : undefined}
      className={cn(
        'flex-1 min-w-[80px] bg-transparent outline-none',
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
    />
  )

  /* ── Shared: tag list ── */
  const tagListEl = value.map((tag, i) => (
    <ChipTag
      key={`${tag}-${i}`}
      label={tag}
      size={chipSize}
      disabled={isDisabled}
      onRemove={!isDisabled && !isReadOnly ? () => removeTag(i) : () => {}}
    />
  ))

  /* ── aria-describedby ── */
  const describedBy = ctx.id
    ? [ctx.id && `${ctx.id}-description`, ctx.id && `${ctx.id}-bottom`].filter(Boolean).join(' ')
    : undefined

  /* ─── Inline mode ─── */
  if (tagsPosition === 'inline') {
    return (
      <div
        className={cn(
          inlineContainerVariants({ size, fullWidth }),
          pill && 'rounded-[9999px]',
          containerBg,
          containerBorder,
          containerRing,
          isDisabled && 'cursor-not-allowed',
          className,
        )}
        onPointerDown={e => {
          handlePointerDown()
          // 컨테이너 클릭 시 input으로 포커스 이동
          if (e.target !== inputRef.current) {
            e.preventDefault()
            inputRef.current?.focus()
          }
        }}
        aria-describedby={describedBy}
      >
        {/* State overlay */}
        {!isDisabled && !isReadOnly && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter
              group-hover:bg-[var(--comp-textfield-hover-on-bright)] group-active:bg-[var(--comp-textfield-active-on-bright)]"
          />
        )}

        {/* Tags + Input (inline) */}
        {tagListEl}
        {(!maxTags || value.length < maxTags) && inputEl}
      </div>
    )
  }

  /* ─── Below mode ─── */
  return (
    <div className={cn('flex flex-col gap-2', fullWidth && 'w-full', className)}>
      {/* Input container */}
      <div
        className={cn(
          belowContainerVariants({ size, fullWidth }),
          pill && 'rounded-[9999px]',
          containerBg,
          containerBorder,
          containerRing,
          isDisabled && 'cursor-not-allowed',
        )}
        onPointerDown={handlePointerDown}
        aria-describedby={describedBy}
      >
        {/* State overlay */}
        {!isDisabled && !isReadOnly && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter
              group-hover:bg-[var(--comp-textfield-hover-on-bright)] group-active:bg-[var(--comp-textfield-active-on-bright)]"
          />
        )}

        {inputEl}
      </div>

      {/* Tags (below) */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tagListEl}
        </div>
      )}
    </div>
  )
}
