import { forwardRef, createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react'
import * as RadixPopover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const POPOVER_SIDES = ['top', 'bottom', 'left', 'right'] as const
export const POPOVER_ALIGNS = ['start', 'center', 'end'] as const

export type PopoverSide = (typeof POPOVER_SIDES)[number]
export type PopoverAlign = (typeof POPOVER_ALIGNS)[number]

/* ─── Theme Context (Portal 테마 상속 — DropdownMenu 패턴) ──────────────────── */

interface PopoverThemeContextValue {
  triggerRef: React.RefObject<HTMLElement | null>
}

const PopoverThemeContext = createContext<PopoverThemeContextValue>({
  triggerRef: { current: null },
})

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

/* ─── Popover (Root) ───────────────────────────────────────────────────────── */

export interface PopoverProps {
  /** 제어 모드 열림 상태. */
  open?: boolean
  /** 열림/닫힘 콜백. */
  onOpenChange?: (open: boolean) => void
  /** 비제어 모드 기본 열림. @default false */
  defaultOpen?: boolean
  /** 모달 모드 (backdrop focus trap). @default false */
  modal?: boolean
  children: ReactNode
}

export function Popover({ open, onOpenChange, defaultOpen, modal = false, children }: PopoverProps) {
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <PopoverThemeContext.Provider value={{ triggerRef }}>
      <RadixPopover.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        modal={modal}
      >
        {children}
      </RadixPopover.Root>
    </PopoverThemeContext.Provider>
  )
}

/* ─── PopoverTrigger ───────────────────────────────────────────────────────── */

export interface PopoverTriggerProps {
  /** 자식 요소에 trigger props 전달. @default true */
  asChild?: boolean
  children: ReactNode
  className?: string
}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = true, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(PopoverThemeContext)
    const internalRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      const el = (ref && typeof ref === 'object' ? ref.current : null) ?? internalRef.current
      if (el) triggerRef.current = el
    })

    return (
      <RadixPopover.Trigger
        ref={ref ?? internalRef}
        asChild={asChild}
        className={className}
        {...props}
      >
        {children}
      </RadixPopover.Trigger>
    )
  },
)

PopoverTrigger.displayName = 'PopoverTrigger'

/* ─── PopoverContent ───────────────────────────────────────────────────────── */

export interface PopoverContentProps {
  /** 배치 방향. @default 'bottom' @see {@link POPOVER_SIDES} */
  side?: PopoverSide
  /** 정렬. @default 'center' @see {@link POPOVER_ALIGNS} */
  align?: PopoverAlign
  /** 트리거에서 간격 (px). @default 8 */
  sideOffset?: number
  /** 뷰포트 가장자리에서 최소 간격 (px). @default 8 */
  collisionPadding?: number
  /** 화살표 표시. @default false */
  showArrow?: boolean
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      collisionPadding = 8,
      showArrow = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { triggerRef } = useContext(PopoverThemeContext)
    const { theme } = useThemeAttributes(triggerRef)

    return (
      <RadixPopover.Portal>
        <div data-theme={theme} className="font-pretendard">
          <RadixPopover.Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            className={cn(
              'z-50 flex flex-col overflow-hidden',
              'bg-[var(--comp-popover-bg)]',
              'border border-[var(--comp-popover-border)]',
              'rounded-[var(--comp-popover-radius)]',
              '[box-shadow:var(--comp-popover-shadow)]',
              'px-[var(--comp-popover-padding-x)] py-[var(--comp-popover-padding-y)]',
              'data-[state=open]:animate-[dropdown-enter_var(--semantic-duration-normal)_var(--semantic-easing-enter)]',
              'data-[state=closed]:animate-[dropdown-exit_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
              className,
            )}
            {...props}
          >
            {showArrow && <PopoverArrow />}
            {children}
          </RadixPopover.Content>
        </div>
      </RadixPopover.Portal>
    )
  },
)

PopoverContent.displayName = 'PopoverContent'

/* ─── PopoverArrow ─────────────────────────────────────────────────────────── */

export interface PopoverArrowProps {
  className?: string
}

export const PopoverArrow = forwardRef<SVGSVGElement, PopoverArrowProps>(
  ({ className }, ref) => (
    <RadixPopover.Arrow
      ref={ref}
      width={16}
      height={8}
      className={cn('fill-[var(--comp-popover-arrow)]', className)}
    />
  ),
)

PopoverArrow.displayName = 'PopoverArrow'

/* ─── PopoverClose ─────────────────────────────────────────────────────────── */

export interface PopoverCloseProps {
  /** asChild. @default false */
  asChild?: boolean
  children: ReactNode
  className?: string
}

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ asChild = false, children, className, ...props }, ref) => (
    <RadixPopover.Close
      ref={ref}
      asChild={asChild}
      className={className}
      {...props}
    >
      {children}
    </RadixPopover.Close>
  ),
)

PopoverClose.displayName = 'PopoverClose'
