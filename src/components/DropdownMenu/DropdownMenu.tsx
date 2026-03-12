import { forwardRef, createContext, useContext, useRef, useEffect, useState } from 'react'
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const DROPDOWN_MENU_SIDES = ['top', 'right', 'bottom', 'left'] as const
export const DROPDOWN_MENU_ALIGNS = ['start', 'center', 'end'] as const

export type DropdownMenuSide = (typeof DROPDOWN_MENU_SIDES)[number]
export type DropdownMenuAlign = (typeof DROPDOWN_MENU_ALIGNS)[number]

/* ─── Internal icons ───────────────────────────────────────────────────────── */

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

function RadioCheckedIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="4.5" fill="currentColor" />
    </svg>
  )
}

function RadioUncheckedIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/* ─── Theme context ────────────────────────────────────────────────────────── */

/**
 * Portal에 렌더링되는 Content가 [data-theme]/[data-shape] 스코프를
 * 상속받을 수 있도록, trigger ref를 통해 조상 속성을 전달한다.
 */
interface DropdownThemeContextValue {
  triggerRef: React.RefObject<HTMLElement | null>
}

const DropdownThemeContext = createContext<DropdownThemeContextValue>({
  triggerRef: { current: null },
})

function useThemeAttributes(triggerRef: React.RefObject<HTMLElement | null>) {
  const [attrs, setAttrs] = useState<{ theme?: string; shape?: string }>({})

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const themed = el.closest('[data-theme]')
    if (themed) {
      const t = themed.getAttribute('data-theme') ?? undefined
      const s = themed.getAttribute('data-shape') ?? undefined
      setAttrs(prev => {
        if (prev.theme === t && prev.shape === s) return prev
        return { theme: t, shape: s }
      })
    }
  })

  return attrs
}

/* ─── Shared item classes ──────────────────────────────────────────────────── */

const itemBaseClasses = cn(
  'group relative flex items-center outline-none cursor-pointer select-none',
  'h-[var(--comp-dropdown-item-height)]',
  'px-[var(--comp-dropdown-item-padding-x)]',
  'gap-[var(--comp-dropdown-item-gap)]',
  'rounded-[var(--comp-dropdown-item-radius)]',
  'typography-14-medium',
)

/* ─── DropdownMenu (Root) ──────────────────────────────────────────────────── */

export interface DropdownMenuProps {
  /** 열림 상태 (controlled) */
  open?: boolean
  /** 기본 열림 상태 (uncontrolled) */
  defaultOpen?: boolean
  /** 열림/닫힘 콜백 */
  onOpenChange?: (open: boolean) => void
  /** 모달 모드 */
  modal?: boolean
  children: React.ReactNode
}

export function DropdownMenu({
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
  children,
}: DropdownMenuProps) {
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <DropdownThemeContext.Provider value={{ triggerRef }}>
      <RadixDropdownMenu.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
      >
        {children}
      </RadixDropdownMenu.Root>
    </DropdownThemeContext.Provider>
  )
}

/* ─── DropdownMenuTrigger ──────────────────────────────────────────────────── */

export interface DropdownMenuTriggerProps {
  /** asChild — 자식 요소에 trigger props를 전달한다 */
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild = true, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(DropdownThemeContext)
    const internalRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      const el = (ref && typeof ref === 'object' ? ref.current : null) ?? internalRef.current
      if (el) triggerRef.current = el
    })

    return (
      <RadixDropdownMenu.Trigger
        ref={ref ?? internalRef}
        asChild={asChild}
        className={className}
        {...props}
      >
        {children}
      </RadixDropdownMenu.Trigger>
    )
  },
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

/* ─── DropdownMenuContent ──────────────────────────────────────────────────── */

export interface DropdownMenuContentProps {
  /** 배치 방향 @default 'bottom' */
  side?: DropdownMenuSide
  /** 정렬 @default 'start' */
  align?: DropdownMenuAlign
  /** 트리거에서 간격 (px) @default 4 */
  sideOffset?: number
  /** 뷰포트 가장자리에서 최소 간격 (px) @default 8 */
  collisionPadding?: number
  /** Sticky header 슬롯 (Search Input 등) */
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      collisionPadding = 8,
      header,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { triggerRef } = useContext(DropdownThemeContext)
    const { theme, shape } = useThemeAttributes(triggerRef)

    return (
      <RadixDropdownMenu.Portal>
        <div data-theme={theme} data-shape={shape} className="font-pretendard">
          <RadixDropdownMenu.Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            className={cn(
              'z-50 flex flex-col overflow-hidden',
              'min-w-[var(--comp-dropdown-min-width)]',
              'max-w-[var(--comp-dropdown-max-width)]',
              'max-h-[var(--comp-dropdown-max-height)]',
              'bg-[var(--comp-dropdown-bg)]',
              'border border-[var(--comp-dropdown-border)]',
              'rounded-[var(--comp-dropdown-radius)]',
              '[box-shadow:var(--comp-dropdown-shadow)]',
              /* enter */
              'data-[state=open]:animate-[dropdown-enter_var(--semantic-duration-normal)_var(--semantic-easing-enter)]',
              /* exit */
              'data-[state=closed]:animate-[dropdown-exit_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
              className,
            )}
            {...props}
          >
            {header && (
              <div className="flex-shrink-0 bg-[var(--comp-dropdown-bg)] p-[var(--comp-dropdown-header-padding)] border-b border-[var(--comp-dropdown-header-border)]">
                {header}
              </div>
            )}
            <div className="overflow-y-auto flex-1 py-[var(--comp-dropdown-padding-y)] px-[var(--comp-dropdown-padding-x)]">
              {children}
            </div>
          </RadixDropdownMenu.Content>
        </div>
      </RadixDropdownMenu.Portal>
    )
  },
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

/* ─── DropdownMenuItem ─────────────────────────────────────────────────────── */

export interface DropdownMenuItemProps {
  /** 비활성화 */
  disabled?: boolean
  /** 클릭 핸들러 */
  onSelect?: (event: Event) => void
  /** Leading icon */
  iconLeading?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ disabled, onSelect, iconLeading, children, className, ...props }, ref) => (
    <RadixDropdownMenu.Item
      ref={ref}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        itemBaseClasses,
        disabled
          ? 'cursor-default text-[var(--comp-dropdown-item-label-disabled)]'
          : 'text-[var(--comp-dropdown-item-label)]',
        className,
      )}
      {...props}
    >
      {/* State overlay */}
      {!disabled && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
            'group-data-[highlighted]:bg-[var(--comp-dropdown-item-hover)]',
            'group-active:bg-[var(--comp-dropdown-item-pressed)]',
          )}
        />
      )}

      {iconLeading && (
        <span
          className={cn(
            'relative flex-shrink-0 flex items-center justify-center',
            'size-[var(--comp-dropdown-icon-leading)]',
            disabled
              ? 'text-[var(--comp-dropdown-item-icon-disabled)]'
              : 'text-[var(--comp-dropdown-item-icon)]',
          )}
        >
          {iconLeading}
        </span>
      )}

      <span className="relative flex-1 truncate px-0.5">{children}</span>
    </RadixDropdownMenu.Item>
  ),
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

/* ─── DropdownMenuCheckboxItem ─────────────────────────────────────────────── */

export interface DropdownMenuCheckboxItemProps {
  /** 체크 상태 */
  checked?: boolean
  /** 체크 변경 콜백 */
  onCheckedChange?: (checked: boolean) => void
  /** 비활성화 */
  disabled?: boolean
  /** Leading icon */
  iconLeading?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ checked, onCheckedChange, disabled, iconLeading, children, className, ...props }, ref) => (
    <RadixDropdownMenu.CheckboxItem
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      onSelect={(e) => e.preventDefault()}
      className={cn(
        itemBaseClasses,
        disabled
          ? 'cursor-default text-[var(--comp-dropdown-item-label-disabled)]'
          : 'text-[var(--comp-dropdown-item-label)]',
        className,
      )}
      {...props}
    >
      {/* State overlay */}
      {!disabled && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
            'group-data-[highlighted]:bg-[var(--comp-dropdown-item-hover)]',
            'group-active:bg-[var(--comp-dropdown-item-pressed)]',
          )}
        />
      )}

      {iconLeading && (
        <span
          className={cn(
            'relative flex-shrink-0 flex items-center justify-center',
            'size-[var(--comp-dropdown-icon-leading)]',
            disabled
              ? 'text-[var(--comp-dropdown-item-icon-disabled)]'
              : 'text-[var(--comp-dropdown-item-icon)]',
          )}
        >
          {iconLeading}
        </span>
      )}

      <span className="relative flex-1 truncate px-0.5">{children}</span>

      {/* Check indicator */}
      <span
        className={cn(
          'relative flex-shrink-0 ml-auto flex items-center justify-center',
          'size-[var(--comp-dropdown-icon-check)]',
          checked
            ? disabled
              ? 'text-[var(--comp-dropdown-check-checked-disabled)]'
              : 'text-[var(--comp-dropdown-check-checked)]'
            : disabled
              ? 'text-[var(--comp-dropdown-check-unchecked-disabled)]'
              : 'text-[var(--comp-dropdown-check-unchecked)]',
        )}
      >
        {checked ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />}
      </span>
    </RadixDropdownMenu.CheckboxItem>
  ),
)
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

/* ─── DropdownMenuRadioGroup ───────────────────────────────────────────────── */

export interface DropdownMenuRadioGroupProps {
  /** 현재 선택값 */
  value?: string
  /** 선택 변경 콜백 */
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function DropdownMenuRadioGroup({
  value,
  onValueChange,
  children,
}: DropdownMenuRadioGroupProps) {
  return (
    <RadixDropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
      {children}
    </RadixDropdownMenu.RadioGroup>
  )
}

/* ─── DropdownMenuRadioItem ────────────────────────────────────────────────── */

export interface DropdownMenuRadioItemProps {
  /** 이 아이템의 값 */
  value: string
  /** 비활성화 */
  disabled?: boolean
  /** Leading icon */
  iconLeading?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ value, disabled, iconLeading, children, className, ...props }, ref) => {
    return (
      <RadixDropdownMenu.RadioItem
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          itemBaseClasses,
          disabled
            ? 'cursor-default text-[var(--comp-dropdown-item-label-disabled)]'
            : 'text-[var(--comp-dropdown-item-label)]',
          className,
        )}
        {...props}
      >
        {/* State overlay */}
        {!disabled && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
              'group-data-[highlighted]:bg-[var(--comp-dropdown-item-hover)]',
              'group-active:bg-[var(--comp-dropdown-item-pressed)]',
            )}
          />
        )}

        {iconLeading && (
          <span
            className={cn(
              'relative flex-shrink-0 flex items-center justify-center',
              'size-[var(--comp-dropdown-icon-leading)]',
              disabled
                ? 'text-[var(--comp-dropdown-item-icon-disabled)]'
                : 'text-[var(--comp-dropdown-item-icon)]',
            )}
          >
            {iconLeading}
          </span>
        )}

        <span className="relative flex-1 truncate px-0.5">{children}</span>

        {/* Radio indicator — checked */}
        <span
          className={cn(
            'relative flex-shrink-0 ml-auto items-center justify-center',
            'size-[var(--comp-dropdown-icon-check)]',
            'hidden group-data-[state=checked]:flex',
            disabled
              ? 'text-[var(--comp-dropdown-check-checked-disabled)]'
              : 'text-[var(--comp-dropdown-check-checked)]',
          )}
        >
          <RadioCheckedIcon />
        </span>

        {/* Radio indicator — unchecked */}
        <span
          className={cn(
            'relative flex-shrink-0 ml-auto items-center justify-center',
            'size-[var(--comp-dropdown-icon-check)]',
            'flex group-data-[state=checked]:hidden',
            disabled
              ? 'text-[var(--comp-dropdown-check-unchecked-disabled)]'
              : 'text-[var(--comp-dropdown-check-unchecked)]',
          )}
        >
          <RadioUncheckedIcon />
        </span>
      </RadixDropdownMenu.RadioItem>
    )
  },
)
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

/* ─── DropdownMenuSub ──────────────────────────────────────────────────────── */

export interface DropdownMenuSubProps {
  /** 서브메뉴 열림 상태 (controlled) */
  open?: boolean
  /** 기본 열림 상태 */
  defaultOpen?: boolean
  /** 열림/닫힘 콜백 */
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function DropdownMenuSub({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: DropdownMenuSubProps) {
  return (
    <RadixDropdownMenu.Sub open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixDropdownMenu.Sub>
  )
}

/* ─── DropdownMenuSubTrigger ───────────────────────────────────────────────── */

export interface DropdownMenuSubTriggerProps {
  /** 비활성화 */
  disabled?: boolean
  /** Leading icon */
  iconLeading?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DropdownMenuSubTrigger = forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  ({ disabled, iconLeading, children, className, ...props }, ref) => (
    <RadixDropdownMenu.SubTrigger
      ref={ref}
      disabled={disabled}
      className={cn(
        itemBaseClasses,
        disabled
          ? 'cursor-default text-[var(--comp-dropdown-item-label-disabled)]'
          : 'text-[var(--comp-dropdown-item-label)]',
        className,
      )}
      {...props}
    >
      {/* State overlay */}
      {!disabled && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
            'group-data-[highlighted]:bg-[var(--comp-dropdown-item-hover)]',
            'group-active:bg-[var(--comp-dropdown-item-pressed)]',
          )}
        />
      )}

      {iconLeading && (
        <span
          className={cn(
            'relative flex-shrink-0 flex items-center justify-center',
            'size-[var(--comp-dropdown-icon-leading)]',
            disabled
              ? 'text-[var(--comp-dropdown-item-icon-disabled)]'
              : 'text-[var(--comp-dropdown-item-icon)]',
          )}
        >
          {iconLeading}
        </span>
      )}

      <span className="relative flex-1 truncate px-0.5">{children}</span>

      {/* Trailing chevron */}
      <span
        className={cn(
          'relative flex-shrink-0 ml-auto flex items-center justify-center',
          'size-[var(--comp-dropdown-icon-trailing)]',
          disabled
            ? 'text-[var(--comp-dropdown-item-chevron-disabled)]'
            : 'text-[var(--comp-dropdown-item-chevron)]',
        )}
      >
        <ChevronRightIcon />
      </span>
    </RadixDropdownMenu.SubTrigger>
  ),
)
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

/* ─── DropdownMenuSubContent ───────────────────────────────────────────────── */

export interface DropdownMenuSubContentProps {
  /** 서브메뉴 간격 (px) @default 6 */
  sideOffset?: number
  /** 뷰포트 가장자리에서 최소 간격 (px) @default 8 */
  collisionPadding?: number
  children: React.ReactNode
  className?: string
}

export const DropdownMenuSubContent = forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  ({ sideOffset = 6, collisionPadding = 8, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(DropdownThemeContext)
    const { theme, shape } = useThemeAttributes(triggerRef)

    return (
      <RadixDropdownMenu.Portal>
        <div data-theme={theme} data-shape={shape} className="font-pretendard">
          <RadixDropdownMenu.SubContent
            ref={ref}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            className={cn(
              'z-50 flex flex-col overflow-hidden',
              'min-w-[var(--comp-dropdown-min-width)]',
              'max-w-[var(--comp-dropdown-max-width)]',
              'max-h-[var(--comp-dropdown-max-height)]',
              'bg-[var(--comp-dropdown-bg)]',
              'border border-[var(--comp-dropdown-border)]',
              'rounded-[var(--comp-dropdown-radius)]',
              '[box-shadow:var(--comp-dropdown-shadow)]',
              /* enter — horizontal */
              'data-[state=open]:animate-[dropdown-sub-enter_var(--semantic-duration-normal)_var(--semantic-easing-enter)]',
              /* exit — horizontal */
              'data-[state=closed]:animate-[dropdown-sub-exit_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
              className,
            )}
            {...props}
          >
            <div className="overflow-y-auto flex-1 py-[var(--comp-dropdown-padding-y)] px-[var(--comp-dropdown-padding-x)]">
              {children}
            </div>
          </RadixDropdownMenu.SubContent>
        </div>
      </RadixDropdownMenu.Portal>
    )
  },
)
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'

/* ─── DropdownMenuGroup ────────────────────────────────────────────────────── */

export interface DropdownMenuGroupProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenuGroup({ children, className }: DropdownMenuGroupProps) {
  return (
    <RadixDropdownMenu.Group className={className}>
      {children}
    </RadixDropdownMenu.Group>
  )
}

/* ─── DropdownMenuLabel ────────────────────────────────────────────────────── */

export interface DropdownMenuLabelProps {
  children: React.ReactNode
  className?: string
}

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ children, className, ...props }, ref) => (
    <RadixDropdownMenu.Label
      ref={ref}
      className={cn(
        'sticky top-0 z-[1] flex items-center',
        'h-[var(--comp-dropdown-subtitle-height)]',
        'px-[var(--comp-dropdown-subtitle-padding-x)]',
        'typography-12-medium',
        'text-[var(--comp-dropdown-subtitle)]',
        'bg-[var(--comp-dropdown-bg)]',
        className,
      )}
      {...props}
    >
      {children}
    </RadixDropdownMenu.Label>
  ),
)
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

/* ─── DropdownMenuSeparator ────────────────────────────────────────────────── */

export interface DropdownMenuSeparatorProps {
  className?: string
}

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <RadixDropdownMenu.Separator
      ref={ref}
      className={cn(
        'h-px',
        'my-[var(--comp-dropdown-divider-margin-y)]',
        'mx-[var(--comp-dropdown-divider-margin-x)]',
        'bg-[var(--comp-dropdown-divider)]',
        className,
      )}
      {...props}
    />
  ),
)
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
