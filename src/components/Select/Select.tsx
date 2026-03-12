import { forwardRef, useRef, useState, useEffect, useCallback } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/FormField'
import { IconButton } from '@/components/IconButton'
import type { IconButtonSize } from '@/components/IconButton'
import { useSelect, type SelectOption, type SelectGroup, type SelectMode } from './useSelect'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SELECT_SIZES = ['xSmall', 'small', 'medium', 'large', 'xLarge'] as const
export const SELECT_MODES = ['select', 'combobox'] as const

export type SelectSize = (typeof SELECT_SIZES)[number]
export type { SelectOption, SelectGroup, SelectMode }

/* ─── CVA — Trigger container (reuses textfield tokens) ────────────────────── */

const triggerVariants = cva(
  'group relative flex items-center border overflow-hidden transition-colors duration-fast ease-move cursor-pointer',
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

const iconSizeMap: Record<SelectSize, string> = {
  xSmall: 'size-[var(--comp-textfield-icon-xs)]',
  small:  'size-[var(--comp-textfield-icon-sm)]',
  medium: 'size-[var(--comp-textfield-icon-md)]',
  large:  'size-[var(--comp-textfield-icon-lg)]',
  xLarge: 'size-[var(--comp-textfield-icon-xl)]',
}

const chevronSizeMap: Record<SelectSize, string> = {
  xSmall: 'size-[var(--comp-select-chevron-xs)]',
  small:  'size-[var(--comp-select-chevron-sm)]',
  medium: 'size-[var(--comp-select-chevron-md)]',
  large:  'size-[var(--comp-select-chevron-lg)]',
  xLarge: 'size-[var(--comp-select-chevron-xl)]',
}

const typographyMap: Record<SelectSize, string> = {
  xSmall: 'typography-12-regular',
  small:  'typography-13-regular',
  medium: 'typography-14-regular',
  large:  'typography-15-regular',
  xLarge: 'typography-16-regular',
}

const dropdownTypographyMap: Record<SelectSize, string> = {
  xSmall: 'typography-13-medium',
  small:  'typography-13-medium',
  medium: 'typography-14-medium',
  large:  'typography-14-medium',
  xLarge: 'typography-15-medium',
}

/** Clear IconButton size — one step down so it fits inside the trigger */
const clearButtonSizeMap: Record<SelectSize, IconButtonSize> = {
  xSmall: 'xSmall',
  small:  'xSmall',
  medium: 'xSmall',
  large:  'small',
  xLarge: 'small',
}

/* ─── Icons ─────────────────────────────────────────────────────────────────── */

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full" aria-hidden>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden>
      <path d="M4 10l5 5 7-8" />
    </svg>
  )
}

/* ─── Theme propagation (same pattern as DropdownMenu) ─────────────────────── */

function useThemeAttributes(triggerRef: React.RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<string | undefined>()

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const themed = el.closest('[data-theme]')
    if (themed) {
      const t = themed.getAttribute('data-theme') ?? undefined
      setTheme(prev => prev === t ? prev : t)
    }
  })

  return { theme }
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * Select/Combobox 컴포넌트. TextField의 외형과 DropdownMenu의 드롭다운을 결합한다.
 * `mode="select"`은 클릭으로 옵션 선택, `mode="combobox"`는 타이핑으로 필터링 후 선택.
 */
export interface SelectProps {
  /**
   * 현재 선택된 값 (controlled).
   */
  value?: string

  /**
   * 초기 선택 값 (uncontrolled).
   * @default ''
   */
  defaultValue?: string

  /**
   * 값 변경 콜백.
   */
  onValueChange?: (value: string) => void

  /**
   * 옵션 목록. 단일 옵션 또는 그룹화된 옵션.
   * @see SelectOption
   * @see SelectGroup
   */
  options: (SelectOption | SelectGroup)[]

  /**
   * 동작 모드. 'select'는 클릭 선택, 'combobox'는 타이핑 필터링.
   * @default 'select'
   * @see SELECT_MODES
   */
  mode?: SelectMode

  /**
   * 크기 variant. TextField와 동일한 5단계.
   * @default 'medium'
   * @see SELECT_SIZES
   */
  size?: SelectSize

  /**
   * 플레이스홀더 텍스트.
   */
  placeholder?: string

  /**
   * 값이 선택되었을 때 Clear 버튼 표시.
   * @default false
   */
  clearable?: boolean

  /**
   * 커스텀 필터 함수 (combobox 모드).
   */
  filterFn?: (option: SelectOption, query: string) => boolean

  /**
   * 드롭다운 내 옵션 커스텀 렌더 함수.
   */
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode

  /**
   * 트리거에 표시되는 선택된 값의 커스텀 렌더 함수.
   */
  renderValue?: (option: SelectOption) => React.ReactNode

  /**
   * 필터 결과가 없을 때 표시할 콘텐츠.
   * @default '결과 없음'
   */
  emptyContent?: React.ReactNode

  /**
   * 좌측 슬롯 (아이콘 등).
   */
  startEnhancer?: React.ReactNode

  /**
   * 오류 상태. FormField Context에서 자동 전달 또는 직접 지정.
   * @default false
   */
  error?: boolean

  /**
   * 비활성 상태.
   * @default false
   */
  disabled?: boolean

  /**
   * 읽기 전용 상태.
   * @default false
   */
  readOnly?: boolean

  /**
   * 너비 100% 확장.
   * @default true
   */
  fullWidth?: boolean

  /**
   * 고유 ID. FormField Context에서 자동 전달 또는 직접 지정.
   */
  id?: string

  /**
   * 숨겨진 input의 name (폼 제출용).
   */
  name?: string

  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      options,
      mode = 'select',
      size = 'medium',
      placeholder,
      clearable = false,
      filterFn,
      renderOption,
      renderValue,
      emptyContent = '결과 없음',
      startEnhancer,
      error: errorProp,
      disabled: disabledProp,
      readOnly: readOnlyProp,
      fullWidth = true,
      id: idProp,
      name,
      className,
    },
    ref,
  ) => {
    /* ── FormField context merge ── */
    const ctx = useFormField()
    const id = idProp ?? ctx.id ?? undefined
    const error = errorProp ?? ctx.error
    const isDisabled = disabledProp ?? ctx.disabled
    const isReadOnly = readOnlyProp ?? ctx.readOnly
    const required = ctx.required

    /* ── useSelect hook ── */
    const select = useSelect({
      value,
      defaultValue,
      onValueChange,
      options,
      mode,
      filterFn,
      disabled: isDisabled,
      readOnly: isReadOnly,
    })

    /* ── Focus state ── */
    const [focused, setFocused] = useState(false)
    const [keyboardFocused, setKeyboardFocused] = useState(false)
    const pointerRef = useRef(false)
    const triggerRef = useRef<HTMLElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    /* ── Theme propagation ── */
    const { theme } = useThemeAttributes(triggerRef)

    /* ── Focus handlers ── */
    const handlePointerDown = () => {
      pointerRef.current = true
    }

    const handleFocus = () => {
      setFocused(true)
      setKeyboardFocused(!pointerRef.current)
      pointerRef.current = false
    }

    const handleBlur = () => {
      setFocused(false)
      setKeyboardFocused(false)
    }

    /* ── Combobox input change ── */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value
        select.setSearchQuery(q)
        if (!select.isOpen) select.open()
        select.setActiveIndex(0)
      },
      [select],
    )

    /* ── Handle clear ── */
    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        select.clearValue()
        if (mode === 'combobox') {
          select.setSearchQuery('')
        }
      },
      [select, mode],
    )

    /* ── Popover open change ── */
    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (open) {
          select.open()
        } else {
          select.close()
          // Focus trigger after close
          if (mode === 'combobox') {
            inputRef.current?.focus()
          }
        }
      },
      [select, mode],
    )

    /* ── Derived container state classes (same as TextField) ── */
    const containerBg = isDisabled
      ? 'bg-[var(--comp-textfield-bg-disabled)]'
      : isReadOnly
        ? 'bg-[var(--comp-textfield-bg-readonly)]'
        : error && focused
          ? 'bg-[var(--comp-textfield-bg-error-focus)]'
          : error
            ? 'bg-[var(--comp-textfield-bg-error)]'
            : focused || select.isOpen
              ? 'bg-[var(--comp-textfield-bg-focus)]'
              : 'bg-[var(--comp-textfield-bg)]'

    const containerBorder = isDisabled
      ? 'border-[color:var(--comp-textfield-border-disabled)]'
      : isReadOnly
        ? 'border-[color:var(--comp-textfield-border-readonly)]'
        : error
          ? 'border-[color:var(--comp-textfield-border-error)]'
          : focused || select.isOpen
            ? 'border-[color:var(--comp-textfield-border-focus)]'
            : 'border-[color:var(--comp-textfield-border)]'

    const containerRing = keyboardFocused && !isDisabled
      ? error
        ? 'ring-2 ring-offset-2 ring-[var(--comp-textfield-focus-ring-error)]'
        : 'ring-2 ring-offset-2 ring-[var(--comp-textfield-focus-ring)]'
      : ''

    /* ── Icon slot class ── */
    const iconSlotClass = cn('flex-shrink-0 flex items-center', iconSizeMap[size])

    /* ── Clearable ── */
    const showClear = clearable && !!select.selectedValue && !isDisabled && !isReadOnly

    /* ── aria-describedby ── */
    const describedBy = [
      ctx.id && `${ctx.id}-description`,
      ctx.id && `${ctx.id}-bottom`,
    ].filter(Boolean).join(' ') || undefined

    /* ── Render option content ── */
    const renderOptionContent = (option: SelectOption, isSelected: boolean) => {
      if (renderOption) return renderOption(option, isSelected)
      return (
        <>
          {option.icon && (
            <span
              aria-hidden
              className={cn(
                'relative flex-shrink-0 flex items-center',
                'size-[var(--comp-dropdown-icon-leading)]',
                option.disabled
                  ? 'text-[color:var(--comp-dropdown-item-icon-disabled)]'
                  : 'text-[color:var(--comp-dropdown-item-icon)]',
              )}
            >
              {option.icon}
            </span>
          )}
          <span className="relative flex-1 truncate px-0.5">{option.label}</span>
          {isSelected && (
            <span
              aria-hidden
              className={cn(
                'relative flex-shrink-0 flex items-center',
                'size-[var(--comp-dropdown-icon-check)]',
                'text-[color:var(--comp-select-check-color)]',
              )}
            >
              <CheckIcon />
            </span>
          )}
        </>
      )
    }

    /* ── Render option item ── */
    const renderItem = (option: SelectOption, flatIndex: number) => {
      const isSelected = option.value === select.selectedValue
      const isActive = flatIndex === select.activeIndex

      return (
        <div
          key={option.value}
          id={select.getOptionId(flatIndex)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={option.disabled || undefined}
          data-highlighted={isActive || undefined}
          className={cn(
            'group/item relative flex items-center outline-none select-none',
            'h-[var(--comp-dropdown-item-height)]',
            'px-[var(--comp-dropdown-item-padding-x)]',
            'gap-[var(--comp-dropdown-item-gap)]',
            'rounded-[var(--comp-dropdown-item-radius)]',
            dropdownTypographyMap[size],
            option.disabled
              ? 'cursor-default text-[color:var(--comp-dropdown-item-label-disabled)]'
              : 'cursor-pointer text-[color:var(--comp-dropdown-item-label)]',
          )}
          onPointerMove={() => {
            if (!option.disabled) select.setActiveIndex(flatIndex)
          }}
          onPointerDown={(e) => {
            // Prevent input blur in combobox mode
            e.preventDefault()
          }}
          onClick={() => select.handleOptionSelect(option)}
        >
          {/* State overlay */}
          {!option.disabled && (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
                'group-active/item:bg-[var(--comp-dropdown-item-pressed)]',
                isActive && 'bg-[var(--comp-dropdown-item-hover)]',
              )}
            />
          )}
          {renderOptionContent(option, isSelected)}
        </div>
      )
    }

    /* ── Build flat index counter for rendering ── */
    let flatIndexCounter = 0

    const renderItems = () => {
      flatIndexCounter = 0
      const items = select.filteredItems

      if (items.length === 0) {
        return (
          <div className={cn(
            'flex items-center justify-center py-6 text-[color:var(--comp-dropdown-subtitle)]',
            typographyMap[size],
          )}>
            {emptyContent}
          </div>
        )
      }

      return items.map((item, groupIdx) => {
        if (select.isGroup(item)) {
          const group = item as SelectGroup
          const groupItems = group.options.map((opt) => {
            const idx = flatIndexCounter++
            return renderItem(opt, idx)
          })

          return (
            <div key={`group-${groupIdx}`} role="group" aria-label={group.label}>
              <div
                className={cn(
                  'flex items-center sticky top-0 z-10',
                  'h-[var(--comp-dropdown-subtitle-height)]',
                  'px-[var(--comp-dropdown-subtitle-padding-x)]',
                  'typography-12-medium',
                  'text-[color:var(--comp-dropdown-subtitle)]',
                  'bg-[var(--comp-dropdown-bg)]',
                )}
              >
                {group.label}
              </div>
              {groupItems}
            </div>
          )
        } else {
          const idx = flatIndexCounter++
          return renderItem(item as SelectOption, idx)
        }
      })
    }

    /* ── Render trigger content ── */
    const triggerContent = () => {
      if (mode === 'combobox') {
        return (
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            id={id}
            aria-expanded={select.isOpen}
            aria-haspopup="listbox"
            aria-controls={select.listboxId}
            aria-activedescendant={
              select.isOpen && select.activeIndex >= 0
                ? select.getOptionId(select.activeIndex)
                : undefined
            }
            aria-invalid={error || undefined}
            aria-disabled={isDisabled || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            aria-autocomplete="list"
            autoComplete="off"
            value={select.isOpen ? select.searchQuery : (select.selectedOption?.label ?? '')}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            onChange={handleInputChange}
            onKeyDown={select.handleInputKeyDown}
            onFocus={(e) => {
              handleFocus()
              // When focusing combobox, select all text for easy replacement
              if (!select.isOpen && select.selectedOption) {
                e.target.select()
              }
            }}
            onBlur={handleBlur}
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
                    'cursor-text',
                    'text-[color:var(--comp-textfield-text)]',
                    'placeholder:text-[color:var(--comp-textfield-text-placeholder)]',
                    'caret-[color:var(--comp-textfield-caret)]',
                  ),
            )}
          />
        )
      }

      // Select mode — display-only
      const hasSelection = !!select.selectedOption
      return (
        <span
          className={cn(
            'relative flex-1 min-w-0 truncate text-left',
            typographyMap[size],
            isDisabled
              ? 'text-[color:var(--comp-textfield-text-disabled)]'
              : hasSelection
                ? 'text-[color:var(--comp-textfield-text)]'
                : 'text-[color:var(--comp-textfield-text-placeholder)]',
          )}
        >
          {hasSelection
            ? renderValue
              ? renderValue(select.selectedOption!)
              : select.selectedOption!.label
            : placeholder
          }
        </span>
      )
    }

    return (
      <Popover.Root
        open={select.isOpen}
        onOpenChange={handleOpenChange}
      >
        <Popover.Trigger asChild disabled={isDisabled}>
          <div
            ref={(node) => {
              // Merge refs
              triggerRef.current = node
              if (typeof ref === 'function') ref(node as unknown as HTMLButtonElement)
              else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node as unknown as HTMLButtonElement
            }}
            role={mode === 'select' ? 'combobox' : undefined}
            aria-expanded={mode === 'select' ? select.isOpen : undefined}
            aria-haspopup={mode === 'select' ? 'listbox' : undefined}
            aria-controls={mode === 'select' ? select.listboxId : undefined}
            aria-activedescendant={
              mode === 'select' && select.isOpen && select.activeIndex >= 0
                ? select.getOptionId(select.activeIndex)
                : undefined
            }
            aria-invalid={mode === 'select' ? (error || undefined) : undefined}
            aria-disabled={isDisabled || undefined}
            aria-required={mode === 'select' ? (required || undefined) : undefined}
            aria-describedby={mode === 'select' ? describedBy : undefined}
            id={mode === 'select' ? id : undefined}
            tabIndex={isDisabled ? -1 : mode === 'select' ? 0 : undefined}
            onPointerDown={handlePointerDown}
            onFocus={mode === 'select' ? handleFocus : undefined}
            onBlur={mode === 'select' ? handleBlur : undefined}
            onKeyDown={mode === 'select' ? select.handleTriggerKeyDown : undefined}
            className={cn(
              triggerVariants({ size, fullWidth }),
              containerBg,
              containerBorder,
              containerRing,
              isDisabled && 'cursor-not-allowed',
              !isDisabled && !isReadOnly && 'cursor-pointer',
              mode === 'select' && 'outline-none',
              className,
            )}
          >
            {/* State overlay */}
            {!isDisabled && !isReadOnly && (
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
                  'group-hover:bg-[var(--comp-textfield-hover-on-bright)] group-active:bg-[var(--comp-textfield-active-on-bright)]',
                )}
              />
            )}

            {/* Start enhancer */}
            {startEnhancer != null && (
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
            )}

            {/* Trigger content */}
            {triggerContent()}

            {/* Clear button — IconButton ghost pill */}
            {showClear && (
              <IconButton
                icon={<XIcon />}
                aria-label="선택 지우기"
                variant="ghost"
                intent="systemic"
                size={clearButtonSizeMap[size]}
                shape="pill"
                tabIndex={-1}
                onClick={handleClear}
                className="relative"
              />
            )}

            {/* Chevron */}
            <span
              aria-hidden
              className={cn(
                'relative flex-shrink-0 flex items-center transition-transform duration-fast ease-move',
                chevronSizeMap[size],
                select.isOpen && 'rotate-180',
                isDisabled
                  ? 'text-[color:var(--comp-select-chevron-color-disabled)]'
                  : select.isOpen
                    ? 'text-[color:var(--comp-select-chevron-color-open)]'
                    : 'text-[color:var(--comp-select-chevron-color)]',
              )}
            >
              <ChevronDownIcon />
            </span>

            {/* Hidden input for form submission */}
            {name && (
              <input
                type="hidden"
                name={name}
                value={select.selectedValue}
              />
            )}
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <div data-theme={theme} className="font-pretendard">
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              collisionPadding={8}
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                // Focus input in combobox mode
                if (mode === 'combobox') {
                  inputRef.current?.focus()
                }
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault()
              }}
              style={{ width: 'var(--radix-popover-trigger-width)' }}
              className={cn(
                'z-50 flex flex-col overflow-hidden',
                'max-h-[var(--comp-dropdown-max-height)]',
                'bg-[var(--comp-dropdown-bg)]',
                'border border-[var(--comp-dropdown-border)]',
                'rounded-[var(--comp-dropdown-radius)]',
                '[box-shadow:var(--comp-dropdown-shadow)]',
                'data-[state=open]:animate-[dropdown-enter_var(--semantic-duration-normal)_var(--semantic-easing-enter)]',
                'data-[state=closed]:animate-[dropdown-exit_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
              )}
            >
              {/* Listbox */}
              <div
                ref={select.listboxRef}
                role="listbox"
                id={select.listboxId}
                aria-label={placeholder}
                className={cn(
                  'overflow-y-auto overscroll-contain',
                  'py-[var(--comp-dropdown-padding-y)]',
                  'px-[var(--comp-dropdown-padding-x)]',
                )}
              >
                {renderItems()}
              </div>
            </Popover.Content>
          </div>
        </Popover.Portal>
      </Popover.Root>
    )
  },
)

Select.displayName = 'Select'
