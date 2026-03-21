import { forwardRef, createContext, useContext, Children, isValidElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BREADCRUMB_SIZES = ['small', 'medium', 'large'] as const

export type BreadcrumbSize = (typeof BREADCRUMB_SIZES)[number]

/* ─── Size maps ────────────────────────────────────────────────────────────── */

const sizeAbbr: Record<BreadcrumbSize, string> = { small: 'sm', medium: 'md', large: 'lg' }

const linkTypography: Record<BreadcrumbSize, string> = {
  small:  'typography-13-regular',
  medium: 'typography-14-regular',
  large:  'typography-16-regular',
}

const pageTypography: Record<BreadcrumbSize, string> = {
  small:  'typography-13-medium',
  medium: 'typography-14-medium',
  large:  'typography-16-medium',
}

const separatorTypography: Record<BreadcrumbSize, string> = {
  small:  'typography-13-regular',
  medium: 'typography-14-regular',
  large:  'typography-16-regular',
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface BreadcrumbContextValue {
  size: BreadcrumbSize
  separator: ReactNode
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  size: 'medium',
  separator: '/',
})

function useBreadcrumbContext() {
  return useContext(BreadcrumbContext)
}

/* ─── Breadcrumb (Root) ────────────────────────────────────────────────────── */

export interface BreadcrumbProps {
  /** 텍스트 + 구분자 크기. @default 'medium' @see {@link BREADCRUMB_SIZES} */
  size?: BreadcrumbSize
  /** 커스텀 구분자. 문자열, 아이콘, 또는 ReactNode. @default '/' */
  separator?: ReactNode
  /** 표시할 최대 항목 수. 초과 시 중간 항목을 ellipsis로 축소. */
  maxItems?: number
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ size = 'medium', separator = '/', maxItems, className, children }, ref) => {
    const abbr = sizeAbbr[size]

    /* ─── Collect BreadcrumbItem children ─── */
    const items = Children.toArray(children).filter(isValidElement)

    /* ─── Apply maxItems collapsing ─── */
    let displayItems: ReactNode[]
    if (maxItems != null && maxItems > 1 && items.length > maxItems) {
      const first = items[0]
      const lastItems = items.slice(-(maxItems - 1))
      displayItems = [first, <BreadcrumbEllipsis key="__ellipsis" />, ...lastItems]
    } else {
      displayItems = items as ReactNode[]
    }

    /* ─── Interleave separators ─── */
    const withSeparators: ReactNode[] = []
    displayItems.forEach((item, i) => {
      withSeparators.push(item)
      if (i < displayItems.length - 1) {
        withSeparators.push(
          <BreadcrumbSeparator key={`sep-${i}`}>{separator}</BreadcrumbSeparator>,
        )
      }
    })

    return (
      <BreadcrumbContext.Provider value={{ size, separator }}>
        <nav ref={ref} aria-label="breadcrumb" className={className}>
          <ol
            className={cn(
              'flex items-center flex-wrap',
              `gap-[var(--comp-breadcrumb-gap-${abbr})]`,
            )}
          >
            {withSeparators}
          </ol>
        </nav>
      </BreadcrumbContext.Provider>
    )
  },
)

Breadcrumb.displayName = 'Breadcrumb'

/* ─── BreadcrumbItem ───────────────────────────────────────────────────────── */

export interface BreadcrumbItemProps {
  className?: string
  children: ReactNode
}

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, children }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center', className)}>
      {children}
    </li>
  ),
)

BreadcrumbItem.displayName = 'BreadcrumbItem'

/* ─── BreadcrumbLink ───────────────────────────────────────────────────────── */

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 비활성 링크 */
  disabled?: boolean
  className?: string
}

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ disabled, className, children, ...props }, ref) => {
    const { size } = useBreadcrumbContext()

    return (
      <a
        ref={ref}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          linkTypography[size],
          'text-[var(--comp-breadcrumb-link)]',
          'transition-colors duration-fast ease-enter',
          'hover:text-[var(--comp-breadcrumb-link-hover)] hover:underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-breadcrumb-focus-ring)] focus-visible:ring-offset-1 rounded-[2px]',
          disabled && 'text-[var(--comp-breadcrumb-disabled)] pointer-events-none no-underline',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    )
  },
)

BreadcrumbLink.displayName = 'BreadcrumbLink'

/* ─── BreadcrumbPage ───────────────────────────────────────────────────────── */

export interface BreadcrumbPageProps {
  className?: string
  children: ReactNode
}

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, children }, ref) => {
    const { size } = useBreadcrumbContext()

    return (
      <span
        ref={ref}
        role="link"
        aria-current="page"
        aria-disabled="true"
        className={cn(
          pageTypography[size],
          'text-[var(--comp-breadcrumb-page)]',
          className,
        )}
      >
        {children}
      </span>
    )
  },
)

BreadcrumbPage.displayName = 'BreadcrumbPage'

/* ─── BreadcrumbSeparator ──────────────────────────────────────────────────── */

export interface BreadcrumbSeparatorProps {
  className?: string
  children?: ReactNode
}

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, children }, ref) => {
    const { size, separator } = useBreadcrumbContext()

    return (
      <li ref={ref} role="presentation" aria-hidden="true" className={cn('inline-flex items-center', className)}>
        <span className={cn(separatorTypography[size], 'text-[var(--comp-breadcrumb-separator)] select-none')}>
          {children ?? separator}
        </span>
      </li>
    )
  },
)

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

/* ─── BreadcrumbEllipsis ───────────────────────────────────────────────────── */

export interface BreadcrumbEllipsisProps {
  className?: string
  onClick?: () => void
}

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, onClick }, ref) => {
    const { size } = useBreadcrumbContext()

    return (
      <li className="inline-flex items-center">
        <span
          ref={ref}
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
          className={cn(
            linkTypography[size],
            'text-[var(--comp-breadcrumb-separator)]',
            'cursor-pointer select-none',
            'transition-colors duration-fast ease-enter',
            'hover:text-[var(--comp-breadcrumb-link-hover)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-breadcrumb-focus-ring)] focus-visible:ring-offset-1 rounded-[2px]',
            className,
          )}
        >
          ···
        </span>
      </li>
    )
  },
)

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'
