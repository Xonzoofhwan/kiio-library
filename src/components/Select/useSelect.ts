import { useState, useCallback, useMemo, useRef, useId, useEffect } from 'react'

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface SelectOption {
  /** 고유 값 */
  value: string
  /** 표시 레이블. combobox 모드에서 검색 매칭에 사용. */
  label: string
  /** 비활성 여부 */
  disabled?: boolean
  /** 옵션 앞에 표시할 아이콘 */
  icon?: React.ReactNode
}

export interface SelectGroup {
  /** 그룹 라벨 */
  label: string
  /** 그룹 내 옵션 */
  options: SelectOption[]
}

export type SelectMode = 'select' | 'combobox'

export interface UseSelectConfig {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: (SelectOption | SelectGroup)[]
  mode: SelectMode
  filterFn?: (option: SelectOption, query: string) => boolean
  disabled?: boolean
  readOnly?: boolean
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function isGroup(item: SelectOption | SelectGroup): item is SelectGroup {
  return 'options' in item && Array.isArray(item.options)
}

function flattenOptions(items: (SelectOption | SelectGroup)[]): SelectOption[] {
  const result: SelectOption[] = []
  for (const item of items) {
    if (isGroup(item)) {
      result.push(...item.options)
    } else {
      result.push(item)
    }
  }
  return result
}

function defaultFilter(option: SelectOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase())
}

/* ─── Hook ────────────────────────────────────────────────────────────────── */

export function useSelect(config: UseSelectConfig) {
  const {
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    options,
    mode,
    filterFn,
    disabled,
    readOnly,
  } = config

  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = isControlled ? controlledValue : internalValue

  /* Open state */
  const [isOpen, setIsOpen] = useState(false)

  /* Search query (combobox mode) */
  const [searchQuery, setSearchQuery] = useState('')

  /* Active descendant index (-1 = none) */
  const [activeIndex, setActiveIndex] = useState(-1)

  /* Type-ahead buffer (select mode) */
  const typeAheadRef = useRef('')
  const typeAheadTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  /* ARIA IDs */
  const autoId = useId()
  const listboxId = `${autoId}-listbox`
  const getOptionId = useCallback(
    (index: number) => `${autoId}-option-${index}`,
    [autoId],
  )

  /* Ref for the listbox container (scroll into view) */
  const listboxRef = useRef<HTMLDivElement>(null)

  /* ── Flat + filtered options ── */
  const allFlat = useMemo(() => flattenOptions(options), [options])

  const filter = filterFn ?? defaultFilter

  const filteredItems = useMemo(() => {
    if (mode !== 'combobox' || !searchQuery) return options

    return options
      .map((item) => {
        if (isGroup(item)) {
          const filtered = item.options.filter((o) => filter(o, searchQuery))
          return filtered.length > 0 ? { ...item, options: filtered } : null
        }
        return filter(item, searchQuery) ? item : null
      })
      .filter(Boolean) as (SelectOption | SelectGroup)[]
  }, [options, mode, searchQuery, filter])

  const filteredFlat = useMemo(
    () => flattenOptions(filteredItems),
    [filteredItems],
  )

  /** Navigable options (exclude disabled) */
  const navigableIndices = useMemo(
    () => filteredFlat.map((o, i) => (!o.disabled ? i : -1)).filter((i) => i >= 0),
    [filteredFlat],
  )

  /* ── Value management ── */
  const selectedOption = useMemo(
    () => allFlat.find((o) => o.value === selectedValue),
    [allFlat, selectedValue],
  )

  const selectOption = useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val)
      onValueChange?.(val)
    },
    [isControlled, onValueChange],
  )

  const clearValue = useCallback(() => {
    if (!isControlled) setInternalValue('')
    onValueChange?.('')
  }, [isControlled, onValueChange])

  /* ── Open/Close ── */
  const open = useCallback(() => {
    if (disabled || readOnly) return
    setIsOpen(true)
    setSearchQuery('')
    // Set initial active index to selected item or first navigable
    const selectedIdx = filteredFlat.findIndex((o) => o.value === selectedValue)
    setActiveIndex(
      selectedIdx >= 0
        ? selectedIdx
        : navigableIndices.length > 0
          ? navigableIndices[0]
          : -1,
    )
  }, [disabled, readOnly, filteredFlat, selectedValue, navigableIndices])

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
    setSearchQuery('')
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) close()
    else open()
  }, [isOpen, open, close])

  /* ── Active index helpers ── */
  const moveActiveIndex = useCallback(
    (direction: 1 | -1) => {
      if (navigableIndices.length === 0) return

      setActiveIndex((prev) => {
        const currentNavIdx = navigableIndices.indexOf(prev)
        if (currentNavIdx === -1) {
          return direction === 1 ? navigableIndices[0] : navigableIndices[navigableIndices.length - 1]
        }
        const nextNavIdx = currentNavIdx + direction
        if (nextNavIdx < 0) return navigableIndices[navigableIndices.length - 1]
        if (nextNavIdx >= navigableIndices.length) return navigableIndices[0]
        return navigableIndices[nextNavIdx]
      })
    },
    [navigableIndices],
  )

  /* ── Scroll active option into view ── */
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return
    const optionEl = document.getElementById(getOptionId(activeIndex))
    optionEl?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex, getOptionId])

  /* ── Select mode: type-ahead ── */
  const handleTypeAhead = useCallback(
    (char: string) => {
      if (mode !== 'select') return

      clearTimeout(typeAheadTimerRef.current)
      typeAheadRef.current += char.toLowerCase()
      typeAheadTimerRef.current = setTimeout(() => {
        typeAheadRef.current = ''
      }, 500)

      const match = filteredFlat.findIndex(
        (o) => !o.disabled && o.label.toLowerCase().startsWith(typeAheadRef.current),
      )
      if (match >= 0) setActiveIndex(match)
    },
    [mode, filteredFlat],
  )

  /* ── Keyboard: Select mode trigger ── */
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || readOnly) return

      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen) {
            open()
          } else if (e.key === 'Enter' || e.key === ' ') {
            // Select current active
            if (activeIndex >= 0 && filteredFlat[activeIndex]) {
              selectOption(filteredFlat[activeIndex].value)
              close()
            }
          } else if (e.key === 'ArrowDown') {
            moveActiveIndex(1)
          } else {
            moveActiveIndex(-1)
          }
          break

        case 'Home':
          if (isOpen && navigableIndices.length > 0) {
            e.preventDefault()
            setActiveIndex(navigableIndices[0])
          }
          break

        case 'End':
          if (isOpen && navigableIndices.length > 0) {
            e.preventDefault()
            setActiveIndex(navigableIndices[navigableIndices.length - 1])
          }
          break

        case 'Escape':
          if (isOpen) {
            e.preventDefault()
            close()
          }
          break

        case 'Tab':
          if (isOpen) close()
          break

        default:
          // Type-ahead for printable characters
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!isOpen) open()
            handleTypeAhead(e.key)
          }
          break
      }
    },
    [disabled, readOnly, isOpen, open, close, activeIndex, filteredFlat, navigableIndices, selectOption, moveActiveIndex, handleTypeAhead],
  )

  /* ── Keyboard: Combobox mode input ── */
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || readOnly) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            open()
          } else {
            moveActiveIndex(1)
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen) {
            open()
          } else {
            moveActiveIndex(-1)
          }
          break

        case 'Enter':
          if (isOpen && activeIndex >= 0 && filteredFlat[activeIndex]) {
            e.preventDefault()
            selectOption(filteredFlat[activeIndex].value)
            close()
          }
          break

        case 'Escape':
          e.preventDefault()
          if (searchQuery) {
            setSearchQuery('')
          } else if (isOpen) {
            close()
          }
          break

        case 'Tab':
          if (isOpen) {
            if (activeIndex >= 0 && filteredFlat[activeIndex]) {
              selectOption(filteredFlat[activeIndex].value)
            }
            close()
          }
          break

        case 'Home':
        case 'End':
          // Let cursor move in input
          break

        default:
          break
      }
    },
    [disabled, readOnly, isOpen, open, close, activeIndex, filteredFlat, searchQuery, selectOption, moveActiveIndex],
  )

  /* ── Option select handler ── */
  const handleOptionSelect = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return
      selectOption(option.value)
      close()
    },
    [selectOption, close],
  )

  return {
    // Open state
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,

    // Value
    selectedValue,
    selectedOption,
    selectOption,
    clearValue,

    // Search
    searchQuery,
    setSearchQuery,
    filteredItems,
    filteredFlat,

    // Active descendant
    activeIndex,
    setActiveIndex,

    // ARIA
    listboxId,
    getOptionId,
    listboxRef,

    // Keyboard
    handleTriggerKeyDown,
    handleInputKeyDown,
    handleOptionSelect,

    // Helpers
    isGroup,
  }
}
