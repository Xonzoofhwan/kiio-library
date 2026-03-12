import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SIDENAV_SIZES = ['large', 'medium', 'small'] as const

export type SideNavSize = (typeof SIDENAV_SIZES)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface SideNavContextValue {
  value: string
  onChange: (id: string) => void
  size: SideNavSize
  disabled: boolean
}

const SideNavContext = createContext<SideNavContextValue | null>(null)

function useSideNavContext(): SideNavContextValue {
  const ctx = useContext(SideNavContext)
  if (!ctx) throw new Error('SideNav sub-components must be used inside <SideNav>')
  return ctx
}

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const itemVariants = cva(
  [
    'group relative flex items-center w-full text-left select-none outline-none',
    'transition-colors duration-fast ease-enter',
  ],
  {
    variants: {
      size: {
        large:  'h-[var(--comp-sidenav-item-height-lg)] px-[var(--comp-sidenav-item-px-lg)] gap-[var(--comp-sidenav-item-gap-lg)] rounded-[var(--comp-sidenav-item-radius-lg)]',
        medium: 'h-[var(--comp-sidenav-item-height-md)] px-[var(--comp-sidenav-item-px-md)] gap-[var(--comp-sidenav-item-gap-md)] rounded-[var(--comp-sidenav-item-radius-md)]',
        small:  'h-[var(--comp-sidenav-item-height-sm)] px-[var(--comp-sidenav-item-px-sm)] gap-[var(--comp-sidenav-item-gap-sm)] rounded-[var(--comp-sidenav-item-radius-sm)]',
      },
    },
    defaultVariants: { size: 'medium' },
  },
)

/* ─── Typography maps ──────────────────────────────────────────────────────── */

const typoDefault: Record<SideNavSize, string> = {
  large:  'typography-15-semibold',
  medium: 'typography-14-semibold',
  small:  'typography-13-semibold',
}

const typoActive: Record<SideNavSize, string> = {
  large:  'typography-15-semibold',
  medium: 'typography-14-semibold',
  small:  'typography-13-semibold',
}

const typoGroup: Record<SideNavSize, string> = {
  large:  'typography-10-semibold',
  medium: 'typography-10-semibold',
  small:  'typography-10-semibold',
}

const iconSize: Record<SideNavSize, string> = {
  large:  'size-[var(--comp-sidenav-icon-lg)]',
  medium: 'size-[var(--comp-sidenav-icon-md)]',
  small:  'size-[var(--comp-sidenav-icon-sm)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * SideNav — 수직 네비게이션/탭 컴포넌트의 루트 컨테이너.
 * Context를 통해 자식에게 value, size, disabled를 전파한다.
 */
export interface SideNavProps {
  /**
   * 현재 선택된 아이템의 value. 제공 시 controlled mode.
   */
  value?: string

  /**
   * 비제어 모드의 초기 선택값.
   */
  defaultValue?: string

  /**
   * 선택 변경 콜백.
   */
  onValueChange?: (value: string) => void

  /**
   * 아이템 크기. 높이, 패딩, 타이포그래피, 아이콘 크기를 제어.
   * @default 'medium'
   * @see SIDENAV_SIZES
   */
  size?: SideNavSize

  /**
   * 모든 아이템 비활성화.
   * @default false
   */
  disabled?: boolean

  children: React.ReactNode
  className?: string
}

/**
 * SideNavGroup — 접기/펼치기가 가능한 그룹 섹션.
 */
export interface SideNavGroupProps {
  /**
   * 그룹 헤더에 표시할 레이블.
   */
  label: string

  /**
   * 초기 펼침 상태.
   * @default true
   */
  defaultExpanded?: boolean

  /**
   * 접기 가능 여부. false이면 항상 펼쳐져 있고 chevron 아이콘이 숨겨진다.
   * @default true
   */
  collapsible?: boolean

  children: React.ReactNode
  className?: string
}

/**
 * SideNavItem — 개별 네비게이션 아이템.
 */
export interface SideNavItemProps {
  /**
   * 고유 식별자. SideNav의 value와 매칭된다.
   */
  value: string

  /**
   * 좌측 아이콘. 크기는 size에 의해 제어.
   */
  icon?: React.ReactNode

  /**
   * 우측 뱃지/카운터.
   */
  badge?: React.ReactNode

  /**
   * 개별 비활성화.
   * @default false
   */
  disabled?: boolean

  children: React.ReactNode
  className?: string
}

/**
 * SideNavDivider — 시각적 구분선.
 */
export interface SideNavDividerProps {
  className?: string
}

/**
 * SideNavPanel — SideNavItem에 연결되는 콘텐츠 영역 (vertical tab 용도).
 */
export interface SideNavPanelProps {
  /**
   * 연결된 SideNavItem의 value와 일치.
   */
  value: string

  /**
   * 비활성 패널을 DOM에 유지할지 여부.
   * @default false
   */
  forceMount?: boolean

  children: React.ReactNode
  className?: string
}

/* ─── Chevron icon ─────────────────────────────────────────────────────────── */

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'w-3.5 h-3.5 flex-shrink-0 text-[var(--comp-sidenav-group-text)] transition-transform duration-fast ease-move',
        expanded && 'rotate-90',
      )}
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  )
}

/* ─── SideNav ──────────────────────────────────────────────────────────────── */

export function SideNav({
  value: controlledValue,
  defaultValue,
  onValueChange,
  size = 'medium',
  disabled = false,
  children,
  className,
}: SideNavProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const onChange = useCallback(
    (id: string) => {
      if (!isControlled) setInternalValue(id)
      onValueChange?.(id)
    },
    [isControlled, onValueChange],
  )

  return (
    <SideNavContext.Provider value={{ value, onChange, size, disabled }}>
      <nav className={cn('flex flex-col gap-4', className)}>
        {children}
      </nav>
    </SideNavContext.Provider>
  )
}

/* ─── SideNavGroup ─────────────────────────────────────────────────────────── */

export function SideNavGroup({
  label,
  defaultExpanded = true,
  collapsible = true,
  children,
  className,
}: SideNavGroupProps) {
  const { size } = useSideNavContext()
  const [expanded, setExpanded] = useState(defaultExpanded)

  const toggle = () => {
    if (collapsible) setExpanded(prev => !prev)
  }

  return (
    <div className={className}>
      {/* Group header */}
      <button
        onClick={toggle}
        aria-expanded={collapsible ? expanded : undefined}
        className={cn(
          'w-full flex items-center justify-between px-3 py-1 rounded-[var(--comp-sidenav-item-radius-md)]',
          'text-[var(--comp-sidenav-group-text)] uppercase tracking-wider select-none',
          typoGroup[size],
          collapsible && 'hover:bg-[var(--comp-sidenav-hover)] transition-colors duration-fast ease-enter cursor-pointer',
          !collapsible && 'cursor-default',
        )}
      >
        <span>{label}</span>
        {collapsible && <ChevronIcon expanded={expanded} />}
      </button>

      {/* Collapsible content */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-normal ease-move',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-0.5 pt-1">
            {children}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ─── SideNavItem ──────────────────────────────────────────────────────────── */

export function SideNavItem({
  value,
  icon,
  badge,
  disabled: propDisabled = false,
  children,
  className,
}: SideNavItemProps) {
  const ctx = useSideNavContext()
  const isActive = ctx.value === value
  const isDisabled = propDisabled || ctx.disabled

  return (
    <li className="list-none">
      <button
        data-active={isActive || undefined}
        data-value={value}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={isDisabled || undefined}
        onClick={!isDisabled ? () => ctx.onChange(value) : undefined}
        className={cn(
          itemVariants({ size: ctx.size }),
          isActive
            ? cn('text-[var(--comp-sidenav-text-active)] bg-[var(--comp-sidenav-bg-active)]', typoActive[ctx.size])
            : cn('text-[var(--comp-sidenav-text)]', typoDefault[ctx.size]),
          isDisabled && 'text-[var(--comp-sidenav-text-disabled)] cursor-not-allowed',
          !isDisabled && !isActive && 'hover:bg-[var(--comp-sidenav-hover)] active:bg-[var(--comp-sidenav-active)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--comp-sidenav-focus-ring)] focus-visible:ring-offset-2',
          className,
        )}
      >
        {/* Icon */}
        {icon && (
          <span className={cn('flex-shrink-0', iconSize[ctx.size])}>
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="flex-1 truncate">{children}</span>

        {/* Badge */}
        {badge != null && (
          <span className="flex-shrink-0 ml-auto">{badge}</span>
        )}
      </button>
    </li>
  )
}

/* ─── SideNavDivider ───────────────────────────────────────────────────────── */

export function SideNavDivider({ className }: SideNavDividerProps) {
  return (
    <hr
      className={cn(
        'border-t border-[var(--comp-sidenav-divider)] my-1',
        className,
      )}
    />
  )
}

/* ─── SideNavPanel ─────────────────────────────────────────────────────────── */

export function SideNavPanel({ value, forceMount = false, children, className }: SideNavPanelProps) {
  const { value: selectedValue } = useSideNavContext()
  const isSelected = value === selectedValue

  if (!isSelected && !forceMount) return null

  return (
    <div
      role="tabpanel"
      id={`sidenav-panel-${value}`}
      aria-labelledby={`sidenav-item-${value}`}
      tabIndex={0}
      hidden={!isSelected && forceMount}
      className={cn('outline-none', className)}
    >
      {children}
    </div>
  )
}
