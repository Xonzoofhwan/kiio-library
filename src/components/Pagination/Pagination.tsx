import React from 'react'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ──────────────────────────────────────────────────────── */

export const PAGINATION_TYPES    = ['numbered', 'overflow', 'legacyMethod', 'minimal'] as const
export const PAGINATION_ALIGNS   = ['right', 'center'] as const
export const PAGINATION_COMPACTS = ['compact', 'full'] as const

export type PaginationType    = (typeof PAGINATION_TYPES)[number]
export type PaginationAlign   = (typeof PAGINATION_ALIGNS)[number]
export type PaginationCompact = (typeof PAGINATION_COMPACTS)[number]

/* ─── Props ─────────────────────────────────────────────────────────────────── */

export interface PaginationProps {
  /** 현재 페이지 (1-indexed). */
  page: number
  /** 총 페이지 수. */
  totalPages: number
  /** 페이지 변경 콜백. */
  onPageChange: (page: number) => void

  /**
   * 레이아웃 타입.
   * - `numbered`: 번호 버튼 + ellipsis
   * - `overflow`: 드롭다운 page selector
   * - `legacyMethod`: 단순 prev/next + "X of N"
   * - `minimal`: 점 인디케이터 (캐러셀용)
   * @default 'numbered'
   * @see PAGINATION_TYPES
   */
  type?: PaginationType

  /**
   * 가로 정렬.
   * @default 'right'
   * @see PAGINATION_ALIGNS
   */
  align?: PaginationAlign

  /**
   * `numbered` 타입에서 활성 페이지 주변 표시 범위.
   * - `compact`: 좌우 1개 (7 pages 표시)
   * - `full`: 좌우 3개 (11 pages 표시)
   * @default 'compact'
   * @see PAGINATION_COMPACTS
   */
  compact?: PaginationCompact

  /** `«»` 점프 버튼 표시 여부 (numbered 타입에만 적용). @default false */
  showJumpButtons?: boolean

  /** per-page 셀렉터 표시 여부 (numbered/overflow 타입에만 적용). @default false */
  showPerPage?: boolean
  /** 현재 페이지 크기. */
  pageSize?: number
  /** 페이지 크기 옵션. @default [10, 20, 50, 100] */
  pageSizeOptions?: number[]
  /** 페이지 크기 변경 콜백. */
  onPageSizeChange?: (size: number) => void

  /** 총 아이템 수. legacyMethod 타입의 "X of N" 표시에 사용. */
  totalItems?: number

  /** `minimal` 타입: 배경 pill 표시 여부. @default false */
  background?: boolean

  className?: string
}

/* ─── Ellipsis algorithm ────────────────────────────────────────────────────── */

type PageItem = number | 'ellipsis'

function buildPageItems(page: number, totalPages: number, compact: PaginationCompact): PageItem[] {
  if (totalPages <= 1) return [1]

  const siblings = compact === 'compact' ? 1 : 3
  const windowStart = Math.max(2, page - siblings)
  const windowEnd   = Math.min(totalPages - 1, page + siblings)

  const items: PageItem[] = [1]

  if (windowStart > 2) items.push('ellipsis')
  for (let i = windowStart; i <= windowEnd; i++) items.push(i)
  if (windowEnd < totalPages - 1) items.push('ellipsis')

  items.push(totalPages)
  return items
}

/* ─── Internal SVG icons ────────────────────────────────────────────────────── */

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" aria-hidden>
      <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" aria-hidden>
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronsLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" aria-hidden>
      <path d="M10.5 5L5.5 10L10.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 5L10.5 10L15.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronsRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" aria-hidden>
      <path d="M4.5 5L9.5 10L4.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 5L14.5 10L9.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" aria-hidden>
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Internal sub-components ───────────────────────────────────────────────── */

function PageButton({
  page,
  isActive,
  onClick,
}: {
  page: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Page ${page}`}
      className={cn(
        'relative inline-flex items-center justify-center',
        'h-[var(--comp-pagination-btn-size)] min-w-[var(--comp-pagination-btn-size)] px-1',
        'rounded-[var(--comp-pagination-btn-radius)]',
        'typography-14-medium',
        'transition-colors duration-fast ease-enter',
        'outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary-400 focus-visible:ring-offset-1',
        'cursor-pointer select-none',
        isActive
          ? 'bg-[var(--comp-pagination-page-active-bg)] text-[var(--comp-pagination-page-active-text)] hover:bg-[var(--comp-pagination-page-active-bg-hover)]'
          : 'text-[var(--comp-pagination-page-text)] hover:bg-semantic-state-on-bright-50',
      )}
    >
      {page}
    </button>
  )
}

function PageEllipsis() {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex items-center justify-center',
        'h-[var(--comp-pagination-btn-size)] w-[var(--comp-pagination-btn-size)]',
        'typography-14-medium text-[var(--comp-pagination-ellipsis-text)]',
        'select-none',
      )}
    >
      …
    </span>
  )
}

function NavButton({
  children,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  'aria-label': string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center',
        'size-[var(--comp-pagination-btn-size)] rounded-full',
        'transition-colors duration-fast ease-enter',
        'outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary-400 focus-visible:ring-offset-1',
        'select-none',
        disabled
          ? 'text-[var(--comp-pagination-nav-disabled)] cursor-not-allowed'
          : 'text-[var(--comp-pagination-nav-text)] hover:bg-semantic-state-on-bright-50 cursor-pointer',
      )}
    >
      <span className="size-[var(--comp-pagination-icon-size)]">
        {children}
      </span>
    </button>
  )
}

function PerPageControl({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: {
  pageSize: number
  pageSizeOptions: number[]
  onPageSizeChange: (size: number) => void
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="relative">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={cn(
            'h-[var(--comp-pagination-btn-size)] pl-2 pr-6',
            'rounded-2 border-none outline-none cursor-pointer',
            'bg-[var(--comp-pagination-select-bg)]',
            'text-[var(--comp-pagination-label-text)] typography-14-regular',
            'appearance-none',
          )}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none size-3.5 text-[var(--comp-pagination-label-text)]">
          <ChevronDownIcon />
        </span>
      </div>
      <span className="typography-14-regular text-[var(--comp-pagination-label-text)] whitespace-nowrap">
        per page
      </span>
    </div>
  )
}

/* ─── Type-specific renderers ───────────────────────────────────────────────── */

function NumberedPagination({
  page,
  totalPages,
  onPageChange,
  compact,
  showJumpButtons,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  compact: PaginationCompact
  showJumpButtons: boolean
}) {
  const items = buildPageItems(page, totalPages, compact)
  const jumpSize = compact === 'compact' ? 5 : 10

  return (
    <div className="flex items-center gap-[var(--comp-pagination-gap)]">
      {showJumpButtons && (
        <NavButton
          onClick={() => onPageChange(Math.max(1, page - jumpSize))}
          disabled={page <= 1}
          aria-label={`Back ${jumpSize} pages`}
        >
          <ChevronsLeftIcon />
        </NavButton>
      )}

      <NavButton
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </NavButton>

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <PageEllipsis key={`ellipsis-${idx}`} />
        ) : (
          <PageButton
            key={item}
            page={item}
            isActive={item === page}
            onClick={() => onPageChange(item)}
          />
        )
      )}

      <NavButton
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </NavButton>

      {showJumpButtons && (
        <NavButton
          onClick={() => onPageChange(Math.min(totalPages, page + jumpSize))}
          disabled={page >= totalPages}
          aria-label={`Forward ${jumpSize} pages`}
        >
          <ChevronsRightIcon />
        </NavButton>
      )}
    </div>
  )
}

function OverflowPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  return (
    <div className="flex items-center gap-4">
      <NavButton
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </NavButton>

      <div className="flex items-center gap-1.5">
        <div className="relative">
          <select
            value={page}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className={cn(
              'h-[var(--comp-pagination-btn-size)] pl-2 pr-6',
              'rounded-2 border-none outline-none cursor-pointer',
              'bg-[var(--comp-pagination-select-bg)]',
              'text-[var(--comp-pagination-label-text)] typography-14-regular',
              'appearance-none w-[72px]',
            )}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none size-3.5 text-[var(--comp-pagination-label-text)]">
            <ChevronDownIcon />
          </span>
        </div>
        <span className="typography-16-medium text-[var(--comp-pagination-label-text)] whitespace-nowrap">
          of {totalPages}
        </span>
      </div>

      <NavButton
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </NavButton>
    </div>
  )
}

function LegacyMethodPagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  totalItems?: number
}) {
  const label = totalItems != null
    ? `${page} of ${totalItems}`
    : `${page} of ${totalPages}`

  return (
    <div className="flex items-center gap-4">
      <NavButton
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </NavButton>

      <span className="typography-16-medium text-[var(--comp-pagination-label-text)] whitespace-nowrap select-none">
        {label}
      </span>

      <NavButton
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </NavButton>
    </div>
  )
}

function MinimalPagination({
  page,
  totalPages,
  onPageChange,
  background,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  background: boolean
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3',
        'h-[var(--comp-pagination-btn-size)] rounded-full',
        background && 'bg-[var(--comp-pagination-dot-bg)] backdrop-blur-[8px]',
      )}
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'rounded-full transition-all duration-fast ease-enter cursor-pointer',
            'outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary-400 focus-visible:ring-offset-1',
            p === page
              ? 'size-2 bg-[var(--comp-pagination-dot-active)]'
              : 'size-1.5 bg-[var(--comp-pagination-dot-inactive)] hover:bg-[var(--comp-pagination-dot-active)]',
          )}
        />
      ))}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────────── */

/**
 * 테이블/리스트/캐러셀 하단에 배치하는 페이지네이션 컴포넌트.
 * 4가지 타입(numbered, overflow, legacyMethod, minimal)을 지원하는 controlled 컴포넌트.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  type = 'numbered',
  align = 'right',
  compact = 'compact',
  showJumpButtons = false,
  showPerPage = false,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  totalItems,
  background = false,
  className,
}: PaginationProps) {
  const clampedPage = Math.max(1, Math.min(page, Math.max(1, totalPages)))

  const canShowPerPage = showPerPage && onPageSizeChange && type !== 'minimal' && type !== 'legacyMethod'

  // minimal: always centered, ignores align/showPerPage
  if (type === 'minimal') {
    return (
      <div className={cn('flex justify-center w-full', className)}>
        <MinimalPagination
          page={clampedPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          background={background}
        />
      </div>
    )
  }

  const paginationContent = (
    <>
      {type === 'numbered' && (
        <NumberedPagination
          page={clampedPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          compact={compact}
          showJumpButtons={showJumpButtons}
        />
      )}
      {type === 'overflow' && (
        <OverflowPagination
          page={clampedPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      {type === 'legacyMethod' && (
        <LegacyMethodPagination
          page={clampedPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
        />
      )}
    </>
  )

  if (canShowPerPage) {
    return (
      <div className={cn('flex items-center justify-between w-full', className)}>
        <PerPageControl
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange!}
        />
        {paginationContent}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center w-full',
        align === 'center' ? 'justify-center' : 'justify-end',
        className,
      )}
    >
      {paginationContent}
    </div>
  )
}
