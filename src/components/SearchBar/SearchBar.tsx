import { forwardRef, useState, useId, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─── */

export const SEARCHBAR_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const SEARCHBAR_SHAPES = ['rectangle', 'circular'] as const

export type SearchBarSize = (typeof SEARCHBAR_SIZES)[number]
export type SearchBarShape = (typeof SEARCHBAR_SHAPES)[number]

/* ─── CVA: field container ─── */

const fieldVariants = cva(
  'group relative flex items-center w-full overflow-hidden transition-colors duration-fast ease-enter',
  {
    variants: {
      size: {
        xLarge:
          'h-[var(--comp-searchbar-height-xl)] px-[var(--comp-searchbar-px-xl)] gap-[var(--comp-searchbar-gap-xl)] typography-18-regular',
        large:
          'h-[var(--comp-searchbar-height-lg)] px-[var(--comp-searchbar-px-lg)] gap-[var(--comp-searchbar-gap-lg)] typography-16-regular',
        medium:
          'h-[var(--comp-searchbar-height-md)] px-[var(--comp-searchbar-px-md)] gap-[var(--comp-searchbar-gap-md)] typography-16-regular',
        small:
          'h-[var(--comp-searchbar-height-sm)] px-[var(--comp-searchbar-px-sm)] gap-[var(--comp-searchbar-gap-sm)] typography-14-regular',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

/* ─── Icon size map ─── */

const iconSizeMap = {
  xLarge: 'size-[var(--comp-searchbar-icon-xl)]',
  large: 'size-[var(--comp-searchbar-icon-lg)]',
  medium: 'size-[var(--comp-searchbar-icon-md)]',
  small: 'size-[var(--comp-searchbar-icon-sm)]',
} as const

/* ─── Radius map — per shape × size ─── */

const radiusMap = {
  rectangle: {
    xLarge: 'rounded-[var(--comp-searchbar-radius-xl)]',
    large: 'rounded-[var(--comp-searchbar-radius-lg)]',
    medium: 'rounded-[var(--comp-searchbar-radius-md)]',
    small: 'rounded-[var(--comp-searchbar-radius-sm)]',
  },
  circular: {
    xLarge: 'rounded-[var(--comp-searchbar-radius-circular-xl)]',
    large: 'rounded-[var(--comp-searchbar-radius-circular-lg)]',
    medium: 'rounded-[var(--comp-searchbar-radius-circular-md)]',
    small: 'rounded-[var(--comp-searchbar-radius-circular-sm)]',
  },
} as const

/* ─── Built-in icons ─── */

function SearchIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-full', className)}
      {...props}
    >
      <path
        d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ClearIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-full', className)}
      {...props}
    >
      <path
        d="M12 13.4L14.9 16.3C15.0833 16.4833 15.3167 16.575 15.6 16.575C15.8833 16.575 16.1167 16.4833 16.3 16.3C16.4833 16.1167 16.575 15.8833 16.575 15.6C16.575 15.3167 16.4833 15.0833 16.3 14.9L13.4 12L16.3 9.1C16.4833 8.91667 16.575 8.68333 16.575 8.4C16.575 8.11667 16.4833 7.88333 16.3 7.7C16.1167 7.51667 15.8833 7.425 15.6 7.425C15.3167 7.425 15.0833 7.51667 14.9 7.7L12 10.6L9.1 7.7C8.91667 7.51667 8.68333 7.425 8.4 7.425C8.11667 7.425 7.88333 7.51667 7.7 7.7C7.51667 7.88333 7.425 8.11667 7.425 8.4C7.425 8.68333 7.51667 8.91667 7.7 9.1L10.6 12L7.7 14.9C7.51667 15.0833 7.425 15.3167 7.425 15.6C7.425 15.8833 7.51667 16.1167 7.7 16.3C7.88333 16.4833 8.11667 16.575 8.4 16.575C8.68333 16.575 8.91667 16.4833 9.1 16.3L12 13.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ─── Props ─── */

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>,
    VariantProps<typeof fieldVariants> {
  /**
   * 크기 variant. 높이, 패딩, 타이포그래피, 아이콘 크기를 제어한다.
   * @default 'medium'
   * @see SEARCHBAR_SIZES
   */
  size?: SearchBarSize

  /**
   * 형태 variant. rectangle은 표준 radius, circular는 pill radius.
   * @default 'rectangle'
   * @see SEARCHBAR_SHAPES
   */
  shape?: SearchBarShape

  /**
   * Clear 버튼 표시 여부. 값이 있을 때만 보인다.
   * @default true
   */
  clearButton?: boolean

  /**
   * 검색 버튼 표시 여부.
   * @default false
   */
  searchButton?: boolean

  /**
   * 너비 모드. false는 hug, true는 fill.
   * @default false
   */
  fullWidth?: boolean

  /**
   * 제어 모드 값.
   * @default undefined
   */
  value?: string

  /**
   * 값 변경 콜백.
   * @default undefined
   */
  onValueChange?: (value: string) => void

  /**
   * 검색 트리거 콜백 (Enter 키 또는 검색 버튼 클릭).
   * @default undefined
   */
  onSearch?: (value: string) => void

  /**
   * Clear 버튼 클릭 콜백.
   * @default undefined
   */
  onClear?: () => void
}

/* ─── Component ─── */

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    className,
    size = 'medium',
    shape = 'rectangle',
    clearButton = true,
    searchButton = false,
    fullWidth = false,
    disabled,
    value: controlledValue,
    onValueChange,
    onSearch,
    onClear,
    placeholder = 'Search...',
    id: idProp,
    onKeyDown,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = idProp ?? autoId

  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState('')

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue
  const hasValue = currentValue.length > 0

  const resolvedSize = size ?? 'medium'
  const resolvedShape = shape ?? 'rectangle'

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (!isControlled) setInternalValue(newValue)
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange],
  )

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue('')
    onValueChange?.('')
    onClear?.()
  }, [isControlled, onValueChange, onClear])

  const handleSearch = useCallback(() => {
    onSearch?.(currentValue)
  }, [onSearch, currentValue])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(currentValue)
      }
      onKeyDown?.(e)
    },
    [onSearch, currentValue, onKeyDown],
  )

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  return (
    <div className={cn('flex', fullWidth ? 'w-full' : 'w-fit', className)}>
      <div
        className={cn(
          fieldVariants({ size }),
          radiusMap[resolvedShape][resolvedSize],
          // Background state
          disabled
            ? 'bg-[var(--comp-input-bg-disabled)] cursor-not-allowed'
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
            isFocused && !disabled && 'border-2 border-[var(--comp-input-border-default)]',
          )}
        />

        {/* State overlay (hover/pressed) */}
        {!disabled && !isFocused && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter group-hover:bg-[var(--comp-input-hover-on-bright)] group-active:bg-[var(--comp-input-active-on-bright)]"
          />
        )}

        {/* Leading search icon */}
        <span
          className={cn(
            'flex-shrink-0 relative',
            iconSizeMap[resolvedSize],
            disabled
              ? 'text-[var(--comp-input-icon-disabled)]'
              : 'text-[var(--comp-input-icon-color)]',
          )}
        >
          <SearchIcon />
        </span>

        {/* Native input */}
        <input
          ref={ref}
          id={inputId}
          type="search"
          disabled={disabled}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'relative flex-1 min-w-0 bg-transparent outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
            'placeholder:text-[var(--comp-input-content-placeholder)]',
            disabled
              ? 'text-[var(--comp-input-content-disabled)] cursor-not-allowed'
              : isFocused
                ? 'text-[var(--comp-input-content-focused)]'
                : 'text-[var(--comp-input-content-typed)]',
          )}
          {...props}
        />

        {/* Clear button */}
        {clearButton && hasValue && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              'flex-shrink-0 relative rounded-full p-0.5 transition-colors duration-fast ease-enter',
              'text-[var(--comp-input-icon-color)] hover:bg-[var(--comp-input-hover-on-bright)] active:bg-[var(--comp-input-active-on-bright)]',
              iconSizeMap[resolvedSize],
            )}
          >
            <ClearIcon />
          </button>
        )}

        {/* Search button */}
        {searchButton && (
          <button
            type="button"
            onClick={handleSearch}
            disabled={disabled}
            aria-label="Search"
            className={cn(
              'flex-shrink-0 relative rounded-full p-0.5 transition-colors duration-fast ease-enter',
              disabled
                ? 'text-[var(--comp-input-icon-disabled)] cursor-not-allowed'
                : 'text-[var(--comp-input-icon-color)] hover:bg-[var(--comp-input-hover-on-bright)] active:bg-[var(--comp-input-active-on-bright)]',
              iconSizeMap[resolvedSize],
            )}
          >
            <SearchIcon />
          </button>
        )}
      </div>
    </div>
  )
})
