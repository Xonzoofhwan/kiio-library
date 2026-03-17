import React, { createContext, useContext, useState, useRef, useCallback } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TABLE_CELL_ALIGNS = ['left', 'center', 'right'] as const
export const TABLE_CELL_EMPHASIZES = ['strong', 'normal', 'weak'] as const
export const TABLE_SORT_DIRECTIONS = ['ascending', 'descending'] as const
export const TABLE_DENSITIES = ['compact', 'default', 'comfortable'] as const
export const TABLE_DIVIDERS = ['border', 'zebra'] as const
export const TABLE_CELL_BUTTON_THEMES = ['system', 'brand', 'error'] as const

export type TableCellAlign = (typeof TABLE_CELL_ALIGNS)[number]
export type TableCellEmphasize = (typeof TABLE_CELL_EMPHASIZES)[number]
export type TableSortDirection = (typeof TABLE_SORT_DIRECTIONS)[number]
export type TableDensity = (typeof TABLE_DENSITIES)[number]
export type TableDivider = (typeof TABLE_DIVIDERS)[number]
export type TableCellButtonTheme = (typeof TABLE_CELL_BUTTON_THEMES)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface TableContextValue {
  columnHighlight: boolean
  highlightedColumn: number | null
  setHighlightedColumn: (index: number | null) => void
  density: TableDensity
}

const TableContext = createContext<TableContextValue>({
  columnHighlight: false,
  highlightedColumn: null,
  setHighlightedColumn: () => {},
  density: 'default',
})

function useTableContext() {
  return useContext(TableContext)
}

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const tableCellVariants = cva(
  'h-[var(--comp-table-row-height)] px-[var(--comp-table-cell-px)] py-[var(--comp-table-cell-py)]',
  {
    variants: {
      align: {
        left:   'text-left',
        center: 'text-center',
        right:  'text-right',
      },
    },
    defaultVariants: {
      align: 'left',
    },
  },
)

const tableHeadVariants = cva(
  'h-[var(--comp-table-row-height)] px-[var(--comp-table-cell-px)] py-[var(--comp-table-cell-py)]',
  {
    variants: {
      align: {
        left:   'text-left',
        center: 'text-center',
        right:  'text-right',
      },
    },
    defaultVariants: {
      align: 'left',
    },
  },
)

/* ─── Density typography maps ───────────────────────────────────────────────── */

const cellTypographyMap: Record<TableDensity, Record<TableCellEmphasize, string>> = {
  compact: {
    strong: 'typography-14-semibold text-[var(--comp-table-text-strong)]',
    normal: 'typography-14-regular text-[var(--comp-table-text-normal)]',
    weak:   'typography-14-regular text-[var(--comp-table-text-weak)]',
  },
  default: {
    strong: 'typography-16-semibold text-[var(--comp-table-text-strong)]',
    normal: 'typography-16-regular text-[var(--comp-table-text-normal)]',
    weak:   'typography-16-regular text-[var(--comp-table-text-weak)]',
  },
  comfortable: {
    strong: 'typography-16-semibold text-[var(--comp-table-text-strong)]',
    normal: 'typography-16-regular text-[var(--comp-table-text-normal)]',
    weak:   'typography-16-regular text-[var(--comp-table-text-weak)]',
  },
}

const headTypographyMap: Record<TableDensity, string> = {
  compact:     'typography-13-medium text-[var(--comp-table-header-text)]',
  default:     'typography-14-medium text-[var(--comp-table-header-text)]',
  comfortable: 'typography-14-medium text-[var(--comp-table-header-text)]',
}

/* ─── Density style map ────────────────────────────────────────────────────── */

const densityStyleMap: Record<TableDensity, React.CSSProperties> = {
  compact: {
    '--comp-table-row-height': 'var(--comp-table-row-height-compact)',
    '--comp-table-cell-py': 'var(--comp-table-cell-py-compact)',
  } as React.CSSProperties,
  default: {},
  comfortable: {
    '--comp-table-row-height': 'var(--comp-table-row-height-comfortable)',
    '--comp-table-cell-py': 'var(--comp-table-cell-py-comfortable)',
  } as React.CSSProperties,
}

/* ─── SortIcon (internal) ──────────────────────────────────────────────────── */

function SortIcon({ direction }: { direction: 'ascending' | 'descending' | false }) {
  const size = 'var(--comp-table-sort-icon)'
  const activeColor = 'var(--comp-table-sort-icon-color-active)'
  const inactiveColor = 'var(--comp-table-sort-icon-color)'

  if (direction === 'ascending') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M8 4L12 9H4L8 4Z" fill={activeColor} />
      </svg>
    )
  }

  if (direction === 'descending') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M8 12L4 7H12L8 12Z" fill={activeColor} />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
      <path d="M8 4L11 7H5L8 4Z" fill={inactiveColor} />
      <path d="M8 12L5 9H11L8 12Z" fill={inactiveColor} />
    </svg>
  )
}

/* ─── Checkbox Icons (internal) ────────────────────────────────────────────── */

function CheckboxCheckedIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="16" height="16" rx="3" fill="currentColor" />
      <path d="M5 9L8 12L13 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckboxUncheckedIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CheckboxIndeterminateIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="16" height="16" rx="3" fill="currentColor" />
      <path d="M5 9H13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/* ─── useColumnHighlight (internal hook) ───────────────────────────────────── */

function useColumnHighlight(
  ref: React.RefObject<HTMLTableCellElement | null>,
  ctx: TableContextValue,
) {
  const handleMouseEnter = useCallback(() => {
    if (!ctx.columnHighlight || !ref.current) return
    ctx.setHighlightedColumn(ref.current.cellIndex)
  }, [ctx, ref])

  const handleMouseLeave = useCallback(() => {
    if (!ctx.columnHighlight) return
    ctx.setHighlightedColumn(null)
  }, [ctx])

  const isHighlighted = ctx.columnHighlight
    && ctx.highlightedColumn !== null
    && ref.current?.cellIndex === ctx.highlightedColumn

  return { handleMouseEnter, handleMouseLeave, isHighlighted }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Table
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Row divider style. @default 'border' @see TABLE_DIVIDERS */
  divider?: TableDivider
  /** Row height density. @default 'default' @see TABLE_DENSITIES */
  density?: TableDensity
  /** Enable column highlight on header hover. */
  columnHighlight?: boolean
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, divider = 'border', density = 'default', columnHighlight = false, children, style, ...props }, ref) => {
    const [highlightedColumn, setHighlightedColumn] = useState<number | null>(null)

    const ctxValue: TableContextValue = {
      columnHighlight,
      highlightedColumn,
      setHighlightedColumn,
      density,
    }

    return (
      <TableContext.Provider value={ctxValue}>
        <div className="relative w-full overflow-x-auto">
          <table
            ref={ref}
            className={cn(
              'w-full border-collapse text-left',
              '[&_thead_th]:border-t [&_thead_th]:border-t-[var(--comp-table-border-row)]',
              '[&_tbody>tr:not([aria-selected])]:hover:bg-[var(--comp-table-row-hover)] [&_tbody>tr:not([aria-selected])]:active:bg-[var(--comp-table-row-active)]',
              '[&_th:not(:last-child)]:border-r [&_th:not(:last-child)]:border-r-[var(--comp-table-border-side)] [&_td:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r-[var(--comp-table-border-side)]',
              divider === 'border'
                ? '[&_th]:border-b [&_th]:border-b-[var(--comp-table-border-row)] [&_td]:border-b [&_td]:border-b-[var(--comp-table-border-row)]'
                : '[&_thead_th]:border-b [&_thead_th]:border-b-[var(--comp-table-border-row)] [&_tbody>tr:nth-child(even)]:bg-[var(--comp-table-row-bg-striped)]',
              className,
            )}
            style={{ ...densityStyleMap[density], ...style }}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    )
  },
)
Table.displayName = 'Table'

/* ═══════════════════════════════════════════════════════════════════════════
   TableHeader
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-[var(--comp-table-header-bg)]', className)}
      {...props}
    >
      {children}
    </thead>
  ),
)
TableHeader.displayName = 'TableHeader'

/* ═══════════════════════════════════════════════════════════════════════════
   TableBody
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(className)}
      {...props}
    >
      {children}
    </tbody>
  ),
)
TableBody.displayName = 'TableBody'

/* ═══════════════════════════════════════════════════════════════════════════
   TableFooter
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, children, ...props }, ref) => (
    <tfoot ref={ref} className={cn(className)} {...props}>
      {children}
    </tfoot>
  ),
)
TableFooter.displayName = 'TableFooter'

/* ═══════════════════════════════════════════════════════════════════════════
   TableRow
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Selected row background (primary tint). Sets aria-selected. */
  selected?: boolean
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, children, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(
        'group bg-[var(--comp-table-row-bg)] transition-colors duration-fast ease-enter',
        selected && 'bg-[var(--comp-table-row-bg-selected)]',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  ),
)
TableRow.displayName = 'TableRow'

/* ═══════════════════════════════════════════════════════════════════════════
   TableHead
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Text alignment. @default 'left' @see TABLE_CELL_ALIGNS */
  align?: TableCellAlign
  /** Sort state. `undefined` = non-sortable, `false` = sortable unsorted, 'ascending'/'descending' = active. */
  sortDirection?: TableSortDirection | false
  /** Sort toggle handler. */
  onSort?: () => void
  /** Fixed column via CSS `position: sticky`. */
  sticky?: boolean
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align = 'left', sortDirection, onSort, sticky = false, children, ...props }, ref) => {
    const internalRef = useRef<HTMLTableCellElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLTableCellElement>) || internalRef
    const ctx = useTableContext()
    const { handleMouseEnter, handleMouseLeave, isHighlighted } = useColumnHighlight(
      resolvedRef as React.RefObject<HTMLTableCellElement | null>,
      ctx,
    )

    const isSortable = sortDirection !== undefined
    const isSorted = sortDirection === 'ascending' || sortDirection === 'descending'

    const ariaSort = isSortable
      ? isSorted ? sortDirection : ('none' as const)
      : undefined

    return (
      <th
        ref={resolvedRef}
        scope="col"
        aria-sort={ariaSort}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          tableHeadVariants({ align }),
          headTypographyMap[ctx.density],
          'group/head relative',
          'hover:bg-[var(--comp-table-header-hover)] transition-colors duration-fast ease-enter',
          isHighlighted && 'bg-[var(--comp-table-col-highlight)]',
          sticky && 'sticky left-0 z-10 bg-[var(--comp-table-header-bg)] border-r border-r-[var(--comp-table-border-sticky)]',
          className,
        )}
        {...props}
      >
        {isSortable ? (
          <button
            type="button"
            onClick={onSort}
            className={cn(
              'inline-flex items-center w-full cursor-pointer bg-transparent border-none p-0 m-0 font-inherit text-inherit outline-none',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end',
            )}
          >
            <span className={cn('truncate', isSorted && 'text-[var(--comp-table-header-text-sorted)]')}>
              {children}
            </span>
          </button>
        ) : (
          children
        )}

        {/* Sort indicator — hover reveal with gradient text fade */}
        {isSortable && (
          <span
            className={cn(
              'absolute right-[var(--comp-table-cell-px)] top-1/2 -translate-y-1/2 flex items-center pointer-events-none',
              'before:content-[""] before:absolute before:right-full before:top-0 before:h-full before:w-8',
              'before:bg-gradient-to-r before:from-transparent before:to-[var(--comp-table-header-bg)]',
              'group-hover/head:before:to-[var(--comp-table-header-hover)]',
              'transition-opacity duration-fast ease-enter',
              isSorted
                ? ''
                : 'opacity-0 group-hover/head:opacity-100',
            )}
          >
            <SortIcon direction={sortDirection} />
          </span>
        )}
      </th>
    )
  },
)
TableHead.displayName = 'TableHead'

/* ═══════════════════════════════════════════════════════════════════════════
   TableCell
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Text emphasis. @default 'normal' @see TABLE_CELL_EMPHASIZES */
  emphasis?: TableCellEmphasize
  /** Text alignment. @default 'left' @see TABLE_CELL_ALIGNS */
  align?: TableCellAlign
  /** Fixed column via CSS `position: sticky`. */
  sticky?: boolean
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, emphasis = 'normal', align = 'left', sticky = false, children, ...props }, ref) => {
    const internalRef = useRef<HTMLTableCellElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLTableCellElement>) || internalRef
    const ctx = useTableContext()

    const isHighlighted = ctx.columnHighlight
      && ctx.highlightedColumn !== null
      && (resolvedRef as React.RefObject<HTMLTableCellElement | null>).current?.cellIndex === ctx.highlightedColumn

    return (
      <td
        ref={resolvedRef}
        className={cn(
          tableCellVariants({ align }),
          cellTypographyMap[ctx.density][emphasis],
          isHighlighted && 'bg-[var(--comp-table-col-highlight)]',
          sticky && 'sticky left-0 z-10 bg-[var(--comp-table-row-bg)] group-hover:bg-[var(--comp-table-row-hover-opaque)] group-aria-selected:bg-[var(--comp-table-row-bg-selected)] border-r border-r-[var(--comp-table-border-sticky)]',
          className,
        )}
        {...props}
      >
        {children}
      </td>
    )
  },
)
TableCell.displayName = 'TableCell'

/* ═══════════════════════════════════════════════════════════════════════════
   TableHeadSelect — 전체선택 체크박스 헤더 셀
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableHeadSelectProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'onChange'> {
  /** All rows selected. */
  checked?: boolean
  /** Some rows selected (partial). */
  indeterminate?: boolean
  /** Toggle handler. */
  onChange?: () => void
}

export const TableHeadSelect = React.forwardRef<HTMLTableCellElement, TableHeadSelectProps>(
  ({ className, checked = false, indeterminate = false, onChange, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn(
        'h-[var(--comp-table-row-height)] w-[var(--comp-table-select-width)] px-[var(--comp-table-cell-px)] py-[var(--comp-table-cell-py)] text-center',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked ? true : indeterminate ? 'mixed' : false}
        aria-label={checked ? 'Deselect all rows' : 'Select all rows'}
        onClick={onChange}
        className={cn(
          'inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0 m-0 outline-none size-[var(--comp-table-select-size)] transition-colors duration-fast ease-enter',
          checked || indeterminate ? 'text-semantic-primary-500' : 'text-semantic-neutral-solid-400',
        )}
      >
        {checked ? <CheckboxCheckedIcon /> : indeterminate ? <CheckboxIndeterminateIcon /> : <CheckboxUncheckedIcon />}
      </button>
    </th>
  ),
)
TableHeadSelect.displayName = 'TableHeadSelect'

/* ═══════════════════════════════════════════════════════════════════════════
   TableCellSelect — 행 선택 체크박스 셀
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableCellSelectProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'onChange'> {
  /** Row selected. */
  checked?: boolean
  /** Toggle handler. */
  onChange?: () => void
}

export const TableCellSelect = React.forwardRef<HTMLTableCellElement, TableCellSelectProps>(
  ({ className, checked = false, onChange, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'h-[var(--comp-table-row-height)] w-[var(--comp-table-select-width)] px-[var(--comp-table-cell-px)] py-[var(--comp-table-cell-py)] text-center',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={checked ? 'Deselect row' : 'Select row'}
        onClick={onChange}
        className={cn(
          'inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0 m-0 outline-none size-[var(--comp-table-select-size)] transition-colors duration-fast ease-enter',
          checked ? 'text-semantic-primary-500' : 'text-semantic-neutral-solid-400',
        )}
      >
        {checked ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />}
      </button>
    </td>
  ),
)
TableCellSelect.displayName = 'TableCellSelect'

/* ═══════════════════════════════════════════════════════════════════════════
   TableCellButton — 액션 버튼 셀
   ═══════════════════════════════════════════════════════════════════════════ */

const cellButtonThemeMap: Record<TableCellButtonTheme, string> = {
  system: 'text-[var(--comp-table-btn-system)] hover:bg-[var(--comp-table-btn-system-hover)]',
  brand:  'text-[var(--comp-table-btn-brand)] hover:bg-[var(--comp-table-btn-brand-hover)]',
  error:  'text-[var(--comp-table-btn-error)] hover:bg-[var(--comp-table-btn-error-hover)]',
}

export interface TableCellButtonProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'onClick'> {
  /** Button color theme. @default 'system' @see TABLE_CELL_BUTTON_THEMES */
  theme?: TableCellButtonTheme
  /** Click handler. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Button icon (renders icon-only button when no children). */
  icon?: React.ReactNode
}

export const TableCellButton = React.forwardRef<HTMLTableCellElement, TableCellButtonProps>(
  ({ className, theme = 'system', onClick, icon, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'h-[var(--comp-table-row-height)] px-[var(--comp-table-cell-px)] py-[var(--comp-table-cell-py)]',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-2 typography-14-medium cursor-pointer bg-transparent border-none transition-colors duration-fast ease-enter outline-none',
          cellButtonThemeMap[theme],
        )}
      >
        {icon && <span className="shrink-0 size-4">{icon}</span>}
        {children}
      </button>
    </td>
  ),
)
TableCellButton.displayName = 'TableCellButton'

/* ═══════════════════════════════════════════════════════════════════════════
   TableEmpty — 빈 상태
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableEmptyProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableEmpty = React.forwardRef<HTMLTableCellElement, TableEmptyProps>(
  ({ className, children, ...props }, ref) => (
    <tr>
      <td
        ref={ref}
        className={cn(
          'h-[120px] text-center typography-14-regular text-[var(--comp-table-text-weak)] align-middle',
          className,
        )}
        {...props}
      >
        {children || 'No data'}
      </td>
    </tr>
  ),
)
TableEmpty.displayName = 'TableEmpty'

/* ═══════════════════════════════════════════════════════════════════════════
   TableRowActions — 행 hover 시 표시되는 액션 영역
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TableRowActionsProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableRowActions = React.forwardRef<HTMLTableCellElement, TableRowActionsProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'h-[var(--comp-table-row-height)] px-[var(--comp-table-cell-px)] py-[var(--comp-table-cell-py)]',
        'sticky right-0 bg-inherit',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-fast ease-enter',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-[var(--comp-table-row-actions-gap)]">
        {children}
      </div>
    </td>
  ),
)
TableRowActions.displayName = 'TableRowActions'
