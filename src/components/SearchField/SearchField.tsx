import { forwardRef } from 'react'
import { TextField, TEXTFIELD_SIZES } from '@/components/TextField'
import type { TextFieldProps, TextFieldSize } from '@/components/TextField'
import { Spinner } from '@/components/icons'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SEARCHFIELD_SIZES = TEXTFIELD_SIZES
export type SearchFieldSize = TextFieldSize

/* ─── Inline icon ──────────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="M16.5 16.5l-3.5-3.5" />
    </svg>
  )
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * SearchField는 TextField를 감싸는 검색 전용 입력 컴포넌트다.
 * 검색 아이콘, clear 버튼, Enter 제출을 기본 제공하며 loading 상태를 지원한다.
 * FormField 안에서 사용하면 Context를 통해 상태가 자동 전파된다.
 */
export interface SearchFieldProps
  extends Omit<TextFieldProps, 'type' | 'startEnhancer'> {
  /**
   * Enter 키 제출 시 호출되는 콜백. 현재 입력값을 인자로 전달한다.
   */
  onSearch?: (value: string) => void

  /**
   * 검색 아이콘을 커스텀 ReactNode로 교체한다.
   * @default 내장 돋보기 아이콘
   */
  searchIcon?: React.ReactNode

  /**
   * 검색 진행 중 상태. 검색 아이콘을 Spinner로 교체한다.
   * @default false
   */
  loading?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      onSearch,
      searchIcon,
      loading = false,
      clearable = true,
      placeholder = '검색',
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        e.preventDefault()
        onSearch((e.target as HTMLInputElement).value)
      }
      onKeyDown?.(e)
    }

    const icon = loading ? (
      <Spinner className="w-full h-full motion-essential" />
    ) : (
      (searchIcon ?? <SearchIcon />)
    )

    return (
      <div role="search" aria-busy={loading || undefined}>
        <TextField
          ref={ref}
          type="search"
          startEnhancer={icon}
          clearable={clearable}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </div>
    )
  },
)

SearchField.displayName = 'SearchField'
