import React, { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableHeadSelect,
  TableCellSelect,
  TableEmpty,
} from '@/components/Table'
import type { TableDensity, TableDivider, TableCellAlign, TableCellEmphasize } from '@/components/Table'

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export type ColumnDef<TData> = {
  /** 컬럼 고유 식별자 */
  id: string
  /** 헤더 셀 내용 */
  header: React.ReactNode
  /**
   * 셀 렌더 함수.
   * @param row 행 데이터
   * @param index 행 인덱스 (정렬 후 기준)
   */
  cell: (row: TData, index: number) => React.ReactNode
  /**
   * 정렬 설정.
   * - `true`: 정렬 가능 (String() 기반 기본 비교)
   * - `(a, b) => number`: 커스텀 비교 함수
   * - `undefined`: 정렬 불가 (헤더에 아이콘 없음)
   */
  sortable?: true | ((a: TData, b: TData) => number)
  /** 텍스트 정렬. @default 'left' @see TABLE_CELL_ALIGNS */
  align?: TableCellAlign
  /** 셀 텍스트 강조. @default 'normal' @see TABLE_CELL_EMPHASIZES */
  emphasis?: TableCellEmphasize
  /** position: sticky 고정 컬럼. @default false */
  sticky?: boolean
  /** 컬럼 너비 (CSS 값 또는 px 숫자) */
  width?: string | number
}

export interface DataTableProps<TData> {
  /** 컬럼 정의 배열 */
  columns: ColumnDef<TData>[]
  /** 행 데이터 배열 */
  data: TData[]
  /**
   * 행 ID 추출 함수. 선택(selectable) 기능에 사용.
   * 미지정 시 배열 인덱스를 문자열로 사용.
   */
  getRowId?: (row: TData, index: number) => string
  /** 행 선택 체크박스 컬럼 활성화. @default false */
  selectable?: boolean
  /**
   * 선택 변경 콜백.
   * @param selectedRows 선택된 행 데이터 배열
   * @param selectedIds 선택된 행 ID Set
   */
  onSelectionChange?: (selectedRows: TData[], selectedIds: Set<string>) => void
  /** 행 높이 밀도. @default 'default' @see TABLE_DENSITIES */
  density?: TableDensity
  /** 행 구분 스타일. @default 'border' @see TABLE_DIVIDERS */
  divider?: TableDivider
  /** 헤더 hover 시 해당 컬럼 셀 하이라이트. @default false */
  columnHighlight?: boolean
  /** 데이터 없을 때 표시할 내용. @default 'No data' */
  emptyMessage?: React.ReactNode
  className?: string
}

/* ─── Internal sort state ───────────────────────────────────────────────────── */

type SortState = { colId: string; direction: 'ascending' | 'descending' } | null

function cycleSortState(prev: SortState, colId: string): SortState {
  if (!prev || prev.colId !== colId) return { colId, direction: 'descending' }
  if (prev.direction === 'descending') return { colId, direction: 'ascending' }
  return null
}

/* ─── DataTable ─────────────────────────────────────────────────────────────── */

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  selectable = false,
  onSelectionChange,
  density,
  divider,
  columnHighlight,
  emptyMessage,
  className,
}: DataTableProps<TData>) {
  const [sortState, setSortState] = useState<SortState>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const getRowIdFn = (row: TData, i: number): string =>
    getRowId ? getRowId(row, i) : String(i)

  /* ─── Sorted data ── */

  const sortedData = useMemo<TData[]>(() => {
    if (!sortState) return data
    const col = columns.find(c => c.id === sortState.colId)
    if (!col?.sortable) return data

    const comparator: (a: TData, b: TData) => number =
      typeof col.sortable === 'function'
        ? col.sortable
        : (a, b) => String(col.cell(a, 0)).localeCompare(String(col.cell(b, 0)))

    const sorted = [...data].sort(comparator)
    return sortState.direction === 'ascending' ? sorted : sorted.reverse()
  }, [data, sortState, columns])

  /* ─── Sort handler ── */

  const handleSort = (colId: string) => {
    setSortState(prev => cycleSortState(prev, colId))
  }

  /* ─── Selection handlers ── */

  const triggerSelectionChange = (nextIds: Set<string>) => {
    if (!onSelectionChange) return
    const selectedRows = sortedData.filter((row, i) => nextIds.has(getRowIdFn(row, i)))
    onSelectionChange(selectedRows, nextIds)
  }

  const toggleRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      triggerSelectionChange(next)
      return next
    })
  }

  const toggleAll = () => {
    const allIds = new Set(sortedData.map((row, i) => getRowIdFn(row, i)))
    const nextIds = selectedIds.size === sortedData.length ? new Set<string>() : allIds
    setSelectedIds(nextIds)
    triggerSelectionChange(nextIds)
  }

  const allSelected = sortedData.length > 0 && selectedIds.size === sortedData.length
  const someSelected = selectedIds.size > 0 && !allSelected
  const totalCols = columns.length + (selectable ? 1 : 0)

  /* ─── Render ── */

  return (
    <Table
      density={density}
      divider={divider}
      columnHighlight={columnHighlight}
      className={className}
    >
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHeadSelect
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
            />
          )}
          {columns.map(col => (
            <TableHead
              key={col.id}
              align={col.align}
              sticky={col.sticky}
              style={col.width !== undefined ? { width: col.width } : undefined}
              sortDirection={
                sortState?.colId === col.id
                  ? sortState.direction
                  : col.sortable !== undefined
                    ? false
                    : undefined
              }
              onSort={col.sortable !== undefined ? () => handleSort(col.id) : undefined}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.length === 0 ? (
          <TableEmpty colSpan={totalCols}>{emptyMessage}</TableEmpty>
        ) : (
          sortedData.map((row, i) => {
            const id = getRowIdFn(row, i)
            return (
              <TableRow
                key={id}
                selected={selectable ? selectedIds.has(id) : undefined}
              >
                {selectable && (
                  <TableCellSelect
                    checked={selectedIds.has(id)}
                    onChange={() => toggleRow(id)}
                  />
                )}
                {columns.map(col => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    emphasis={col.emphasis}
                    sticky={col.sticky}
                  >
                    {col.cell(row, i)}
                  </TableCell>
                ))}
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
