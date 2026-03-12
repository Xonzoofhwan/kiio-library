import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react'
import * as RadixPopover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const CALLOUT_VARIANTS = ['black', 'white', 'brand'] as const
export const CALLOUT_SIDES = ['top', 'bottom', 'left', 'right'] as const
export const CALLOUT_ALIGNS = ['start', 'center', 'end'] as const
export const CALLOUT_DISMISS_MODES = ['manual', 'auto', 'none'] as const

export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number]
export type CalloutSide = (typeof CALLOUT_SIDES)[number]
export type CalloutAlign = (typeof CALLOUT_ALIGNS)[number]
export type CalloutDismissMode = (typeof CALLOUT_DISMISS_MODES)[number]

/* ─── Internal icons ──────────────────────────────────────────────────────── */

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn('w-full h-full', className)} xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 5.5L14.5 14.5M5.5 14.5L14.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowForwardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn('w-full h-full', className)} xmlns="http://www.w3.org/2000/svg">
      <path d="M4.167 10H15.833M15.833 10L10.833 5M15.833 10L10.833 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Variant style maps ──────────────────────────────────────────────────── */

const bgMap: Record<CalloutVariant, string> = {
  black: 'bg-[var(--comp-callout-bg-black)]',
  white: 'bg-[var(--comp-callout-bg-white)]',
  brand: 'bg-[var(--comp-callout-bg-brand)]',
}

const textMap: Record<CalloutVariant, string> = {
  black: 'text-[var(--comp-callout-text-black)]',
  white: 'text-[var(--comp-callout-text-white)]',
  brand: 'text-[var(--comp-callout-text-brand)]',
}

const arrowColorMap: Record<CalloutVariant, string> = {
  black: 'fill-[var(--comp-callout-arrow-black)]',
  white: 'fill-[var(--comp-callout-arrow-white)]',
  brand: 'fill-[var(--comp-callout-arrow-brand)]',
}

const closeColorMap: Record<CalloutVariant, string> = {
  black: 'text-[var(--comp-callout-close-black)] hover:bg-[var(--comp-callout-close-hover-black)]',
  white: 'text-[var(--comp-callout-close-white)] hover:bg-[var(--comp-callout-close-hover-white)]',
  brand: 'text-[var(--comp-callout-close-brand)] hover:bg-[var(--comp-callout-close-hover-brand)]',
}

const actionColorMap: Record<CalloutVariant, string> = {
  black: 'text-[var(--comp-callout-action-black)]',
  white: 'text-[var(--comp-callout-action-white)]',
  brand: 'text-[var(--comp-callout-action-brand)]',
}

/* ─── Theme context ───────────────────────────────────────────────────────── */

interface CalloutThemeContextValue {
  anchorRef: React.RefObject<HTMLElement | null>
}

const CalloutThemeContext = createContext<CalloutThemeContextValue>({
  anchorRef: { current: null },
})

function useThemeAttributes(anchorRef: React.RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<string | undefined>()

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const themed = el.closest('[data-theme]')
    if (themed) {
      const t = themed.getAttribute('data-theme') ?? undefined
      setTheme(prev => prev === t ? prev : t)
    }
  })

  return { theme }
}

/* ─── Callout context ─────────────────────────────────────────────────────── */

interface CalloutContextValue {
  variant: CalloutVariant
  dismiss: CalloutDismissMode
  onClose: () => void
}

const CalloutContext = createContext<CalloutContextValue | null>(null)

function useCalloutContext(): CalloutContextValue {
  const ctx = useContext(CalloutContext)
  if (!ctx) throw new Error('Callout sub-components must be used inside <Callout>')
  return ctx
}

/* ─── Callout (Root) ──────────────────────────────────────────────────────── */

export interface CalloutProps {
  /**
   * 시각적 variant. 배경, 텍스트, 화살표, 버튼 색상을 결정한다.
   * @default 'black'
   * @see CALLOUT_VARIANTS
   */
  variant?: CalloutVariant
  /**
   * 닫힘 정책. manual=외부 클릭+Esc+Close, auto=manual+타이머, none=Close 전용.
   * @default 'manual'
   * @see CALLOUT_DISMISS_MODES
   */
  dismiss?: CalloutDismissMode
  /**
   * 자동 닫힘 시간 (ms). dismiss="auto"일 때만 유효하다.
   * @default 5000
   */
  autoDismissDuration?: number
  /** 열림 상태 (controlled). */
  open?: boolean
  /** 기본 열림 상태 (uncontrolled). */
  defaultOpen?: boolean
  /** 열림/닫힘 콜백. */
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function CalloutRoot({
  variant = 'black',
  dismiss = 'manual',
  autoDismissDuration = 5000,
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
}: CalloutProps) {
  const anchorRef = useRef<HTMLElement | null>(null)
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)

  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const onClose = useCallback(() => handleOpenChange(false), [handleOpenChange])

  // Auto-dismiss timer
  useEffect(() => {
    if (dismiss !== 'auto' || !isOpen) return
    const timer = setTimeout(() => handleOpenChange(false), autoDismissDuration)
    return () => clearTimeout(timer)
  }, [dismiss, isOpen, autoDismissDuration, handleOpenChange])

  return (
    <CalloutThemeContext.Provider value={{ anchorRef }}>
      <CalloutContext.Provider value={{ variant, dismiss, onClose }}>
        <RadixPopover.Root
          open={isOpen}
          onOpenChange={handleOpenChange}
        >
          {children}
        </RadixPopover.Root>
      </CalloutContext.Provider>
    </CalloutThemeContext.Provider>
  )
}

/* ─── CalloutAnchor ───────────────────────────────────────────────────────── */

export interface CalloutAnchorProps {
  /**
   * asChild — 자식 요소에 anchor/trigger props를 전달한다.
   * @default true
   */
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export const CalloutAnchor = forwardRef<HTMLButtonElement, CalloutAnchorProps>(
  ({ asChild = true, children, className, ...props }, ref) => {
    const { anchorRef } = useContext(CalloutThemeContext)
    const internalRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      const el = (ref && typeof ref === 'object' ? ref.current : null) ?? internalRef.current
      if (el) anchorRef.current = el
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
CalloutAnchor.displayName = 'CalloutAnchor'

/* ─── CalloutContent ──────────────────────────────────────────────────────── */

export interface CalloutContentProps {
  /**
   * 배치 방향.
   * @default 'bottom'
   * @see CALLOUT_SIDES
   */
  side?: CalloutSide
  /**
   * 정렬.
   * @default 'center'
   * @see CALLOUT_ALIGNS
   */
  align?: CalloutAlign
  /**
   * 그림자 표시 여부.
   * @default false
   */
  showShadow?: boolean
  /**
   * 트리거에서 간격 (px).
   * @default 8
   */
  sideOffset?: number
  /**
   * 뷰포트 가장자리 최소 간격 (px).
   * @default 8
   */
  collisionPadding?: number
  children: React.ReactNode
  className?: string
}

export const CalloutContent = forwardRef<HTMLDivElement, CalloutContentProps>(
  (
    {
      side = 'bottom',
      align = 'center',
      showShadow = false,
      sideOffset = 8,
      collisionPadding = 8,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { anchorRef } = useContext(CalloutThemeContext)
    const { theme } = useThemeAttributes(anchorRef)
    const { variant, dismiss } = useCalloutContext()

    return (
      <RadixPopover.Portal>
        <div data-theme={theme} className="font-pretendard">
          <RadixPopover.Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            onInteractOutside={(e) => {
              if (dismiss === 'none') e.preventDefault()
            }}
            onEscapeKeyDown={(e) => {
              if (dismiss === 'none') e.preventDefault()
            }}
            className={cn(
              'z-50 max-w-[var(--comp-callout-max-width)]',
              'flex flex-col',
              'rounded-[var(--comp-callout-radius)]',
              bgMap[variant],
              textMap[variant],
              showShadow && '[box-shadow:var(--comp-callout-shadow)]',
              'data-[state=open]:animate-[tooltip-enter_var(--semantic-duration-fast)_var(--semantic-easing-enter)]',
              'data-[state=closed]:animate-[tooltip-exit_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
              className,
            )}
            {...props}
          >
            {children}
          </RadixPopover.Content>
        </div>
      </RadixPopover.Portal>
    )
  },
)
CalloutContent.displayName = 'CalloutContent'

/* ─── CalloutArrow ────────────────────────────────────────────────────────── */

export interface CalloutArrowProps {
  className?: string
}

export function CalloutArrow({ className }: CalloutArrowProps) {
  const { variant } = useCalloutContext()

  return (
    <RadixPopover.Arrow
      width={10}
      height={5}
      className={cn(arrowColorMap[variant], className)}
    />
  )
}

/* ─── CalloutText ─────────────────────────────────────────────────────────── */

export interface CalloutTextProps {
  children: React.ReactNode
  className?: string
}

export function CalloutText({ children, className }: CalloutTextProps) {
  return (
    <div
      className={cn(
        'typography-16-medium',
        'px-[var(--comp-callout-px)] py-[var(--comp-callout-py)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ─── CalloutClose ────────────────────────────────────────────────────────── */

export interface CalloutCloseProps {
  /**
   * 접근성 레이블.
   * @default 'Close'
   */
  'aria-label'?: string
  className?: string
}

export function CalloutClose({
  'aria-label': ariaLabel = 'Close',
  className,
}: CalloutCloseProps) {
  const { variant, onClose } = useCalloutContext()

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClose}
      className={cn(
        'absolute top-2 right-2',
        'inline-flex items-center justify-center',
        'size-[var(--comp-callout-close-size)]',
        'rounded-full',
        'transition-colors duration-fast ease-enter',
        closeColorMap[variant],
        className,
      )}
    >
      <span className="size-[var(--comp-callout-close-icon)]">
        <CloseIcon />
      </span>
    </button>
  )
}

/* ─── CalloutAction ───────────────────────────────────────────────────────── */

export interface CalloutActionProps {
  /** 클릭 핸들러. */
  onClick?: (event: React.MouseEvent) => void
  /**
   * true면 클릭 시 Callout을 닫는다.
   * @default false
   */
  closeOnClick?: boolean
  children: React.ReactNode
  className?: string
}

export function CalloutAction({
  onClick,
  closeOnClick = false,
  children,
  className,
}: CalloutActionProps) {
  const { variant, onClose } = useCalloutContext()

  return (
    <div className="flex justify-end px-[var(--comp-callout-px)] pb-[var(--comp-callout-py)]">
      <button
        type="button"
        onClick={(e) => {
          onClick?.(e)
          if (closeOnClick) onClose()
        }}
        className={cn(
          'inline-flex items-center gap-1 typography-14-medium',
          'transition-opacity duration-fast ease-enter hover:opacity-80',
          actionColorMap[variant],
          className,
        )}
      >
        {children}
        <span className="size-[var(--comp-callout-action-icon)]">
          <ArrowForwardIcon />
        </span>
      </button>
    </div>
  )
}

/* ─── Compound export ─────────────────────────────────────────────────────── */

export const Callout = Object.assign(CalloutRoot, {
  Anchor: CalloutAnchor,
  Content: CalloutContent,
  Arrow: CalloutArrow,
  Text: CalloutText,
  Close: CalloutClose,
  Action: CalloutAction,
})
