import { forwardRef, createContext, useContext, useRef, useEffect, useState } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const DRAWER_SIZES = ['xSmall', 'small', 'medium', 'large'] as const
export type DrawerSize = (typeof DRAWER_SIZES)[number]

/* ─── Size width map ───────────────────────────────────────────────────────── */

const sizeWidthMap: Record<Exclude<DrawerSize, 'large'>, string> = {
  xSmall: 'w-[var(--comp-drawer-width-xs)]',
  small: 'w-[var(--comp-drawer-width-sm)]',
  medium: 'w-[var(--comp-drawer-width-md)]',
}

/* ─── Theme context ────────────────────────────────────────────────────────── */

interface DrawerThemeContextValue {
  triggerRef: React.RefObject<HTMLElement | null>
}

const DrawerThemeContext = createContext<DrawerThemeContextValue>({
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
      setTheme(prev => (prev === t ? prev : t))
    }
  })

  return { theme }
}

/* ─── Drawer context ───────────────────────────────────────────────────────── */

interface DrawerContextValue {
  size: DrawerSize
  hasOverlay: boolean
}

const DrawerContext = createContext<DrawerContextValue>({
  size: 'small',
  hasOverlay: true,
})

/* ─── CloseIcon (inline SVG) ───────────────────────────────────────────────── */

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/* ─── Drawer (Root) ────────────────────────────────────────────────────────── */

export interface DrawerProps {
  /** 열림 상태 (controlled). */
  open?: boolean
  /** 기본 열림 상태 (uncontrolled). */
  defaultOpen?: boolean
  /** 열림/닫힘 콜백. */
  onOpenChange?: (open: boolean) => void
  /**
   * 드로어 너비 사이즈.
   * @default 'small'
   * @see DRAWER_SIZES
   */
  size?: DrawerSize
  /**
   * 배경 오버레이 표시 여부.
   * @default true
   */
  hasOverlay?: boolean
  /**
   * 모달 모드. false면 배경 콘텐츠가 상호작용 가능.
   * @default true
   */
  modal?: boolean
  children: React.ReactNode
}

function DrawerRoot({
  open,
  defaultOpen,
  onOpenChange,
  size = 'small',
  hasOverlay = true,
  modal = true,
  children,
}: DrawerProps) {
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <DrawerThemeContext.Provider value={{ triggerRef }}>
      <DrawerContext.Provider value={{ size, hasOverlay }}>
        <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
          {children}
        </RadixDialog.Root>
      </DrawerContext.Provider>
    </DrawerThemeContext.Provider>
  )
}

/* ─── DrawerTrigger ────────────────────────────────────────────────────────── */

export interface DrawerTriggerProps {
  /**
   * 자식 요소에 trigger props를 전달한다.
   * @default true
   */
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ asChild = true, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(DrawerThemeContext)
    const internalRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      const el = (ref && typeof ref === 'object' ? ref.current : null) ?? internalRef.current
      if (el) triggerRef.current = el
    })

    return (
      <RadixDialog.Trigger ref={ref ?? internalRef} asChild={asChild} className={className} {...props}>
        {children}
      </RadixDialog.Trigger>
    )
  },
)
DrawerTrigger.displayName = 'DrawerTrigger'

/* ─── DrawerContent ────────────────────────────────────────────────────────── */

export interface DrawerContentProps {
  /**
   * large 사이즈의 커스텀 너비 (px). 다른 사이즈에서는 무시됨.
   */
  width?: number
  children: React.ReactNode
  className?: string
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ width, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(DrawerThemeContext)
    const { theme } = useThemeAttributes(triggerRef)
    const { size, hasOverlay } = useContext(DrawerContext)
    const isLarge = size === 'large'

    const widthStyle = isLarge && width ? { width: `${width}px` } : undefined

    return (
      <RadixDialog.Portal>
        <div data-theme={theme} className="font-pretendard">
          {hasOverlay && (
            <RadixDialog.Overlay
              className={cn(
                'fixed inset-0 z-50',
                'bg-[var(--comp-drawer-overlay)]',
                'data-[state=open]:animate-[drawer-overlay-enter_var(--semantic-duration-slow)_var(--semantic-easing-enter)]',
                'data-[state=closed]:animate-[drawer-overlay-exit_var(--semantic-duration-slow)_var(--semantic-easing-exit)_forwards]',
              )}
            />
          )}
          <RadixDialog.Content
            ref={ref}
            className={cn(
              'fixed inset-y-0 right-0 z-50',
              'flex flex-col',
              'bg-[var(--comp-drawer-bg)]',
              'outline-none',
              'max-w-[calc(100vw-var(--comp-drawer-margin))]',
              isLarge ? undefined : sizeWidthMap[size],
              !hasOverlay && 'shadow-[var(--comp-drawer-shadow)]',
              'data-[state=open]:animate-[drawer-content-enter_var(--semantic-duration-slow)_var(--semantic-easing-move)]',
              'data-[state=closed]:animate-[drawer-content-exit_var(--semantic-duration-slow)_var(--semantic-easing-move)_forwards]',
              className,
            )}
            style={widthStyle}
            {...props}
          >
            {children}
          </RadixDialog.Content>
        </div>
      </RadixDialog.Portal>
    )
  },
)
DrawerContent.displayName = 'DrawerContent'

/* ─── DrawerTopBar ─────────────────────────────────────────────────────────── */

export interface DrawerTopBarProps {
  children?: React.ReactNode
  className?: string
}

export const DrawerTopBar = forwardRef<HTMLDivElement, DrawerTopBarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-shrink-0 flex items-center',
          'h-[var(--comp-drawer-topbar-height)]',
          'px-[var(--comp-drawer-topbar-px)]',
          'border-b border-[var(--comp-drawer-topbar-border)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DrawerTopBar.displayName = 'DrawerTopBar'

/* ─── DrawerCloseButton ───────────────────────────────────────────────────── */

export interface DrawerCloseButtonProps {
  className?: string
}

export const DrawerCloseButton = forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixDialog.Close asChild>
        <button
          ref={ref}
          aria-label="Close"
          className={cn(
            'inline-flex items-center justify-center size-[var(--comp-drawer-topbar-btn-size)] rounded-[var(--radius-2)]',
            'text-[var(--comp-drawer-topbar-icon)]',
            'transition-colors duration-fast ease-enter',
            'hover:bg-[var(--semantic-state-on-bright-50)]',
            'active:bg-[var(--semantic-state-on-bright-70)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-primary-300)]',
            className,
          )}
          {...props}
        >
          <CloseIcon className="size-[var(--comp-drawer-topbar-icon-size)]" />
        </button>
      </RadixDialog.Close>
    )
  },
)
DrawerCloseButton.displayName = 'DrawerCloseButton'

/* ─── DrawerBody ───────────────────────────────────────────────────────────── */

export interface DrawerBodyProps {
  children: React.ReactNode
  className?: string
}

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto min-h-0',
          'px-[var(--comp-drawer-px)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DrawerBody.displayName = 'DrawerBody'

/* ─── DrawerFooter ─────────────────────────────────────────────────────────── */

export interface DrawerFooterProps {
  children: React.ReactNode
  className?: string
}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-shrink-0',
          'border-t border-[var(--comp-drawer-footer-border)]',
          'px-[var(--comp-drawer-footer-px)] py-[var(--comp-drawer-footer-py)]',
          'gap-[var(--comp-drawer-footer-gap)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DrawerFooter.displayName = 'DrawerFooter'

/* ─── DrawerClose ──────────────────────────────────────────────────────────── */

export interface DrawerCloseProps {
  /**
   * 자식 요소에 close 동작을 전달한다.
   * @default true
   */
  asChild?: boolean
  children: React.ReactNode
}

export function DrawerClose({ asChild = true, children }: DrawerCloseProps) {
  return (
    <RadixDialog.Close asChild={asChild}>
      {children}
    </RadixDialog.Close>
  )
}
DrawerClose.displayName = 'DrawerClose'

/* ─── Compound export ──────────────────────────────────────────────────────── */

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  TopBar: DrawerTopBar,
  CloseButton: DrawerCloseButton,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
})
