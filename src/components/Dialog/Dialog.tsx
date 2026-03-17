import { forwardRef, createContext, useContext, useRef, useEffect, useState } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const DIALOG_SIZES = ['xSmall', 'small', 'medium', 'large'] as const
export const DIALOG_IMAGE_TYPES = ['banner', 'mark'] as const
export const DIALOG_FOOTER_LAYOUTS = ['horizontal-hug', 'horizontal-fill', 'vertical-fill'] as const

export type DialogSize = (typeof DIALOG_SIZES)[number]
export type DialogImageType = (typeof DIALOG_IMAGE_TYPES)[number]
export type DialogFooterLayout = (typeof DIALOG_FOOTER_LAYOUTS)[number]

/* ─── Size width map ───────────────────────────────────────────────────────── */

const sizeWidthMap: Record<Exclude<DialogSize, 'large'>, string> = {
  xSmall: 'w-[var(--comp-dialog-width-xs)]',
  small: 'w-[var(--comp-dialog-width-sm)]',
  medium: 'w-[var(--comp-dialog-width-md)]',
}

const imageHeightMap: Record<Exclude<DialogSize, 'large'>, string> = {
  xSmall: 'h-[var(--comp-dialog-image-height-xs)]',
  small: 'h-[var(--comp-dialog-image-height-sm)]',
  medium: 'h-[var(--comp-dialog-image-height-md)]',
}

/* ─── Theme context ────────────────────────────────────────────────────────── */

interface DialogThemeContextValue {
  triggerRef: React.RefObject<HTMLElement | null>
}

const DialogThemeContext = createContext<DialogThemeContextValue>({
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

/* ─── Dialog context ───────────────────────────────────────────────────────── */

interface DialogContextValue {
  size: DialogSize
}

const DialogContext = createContext<DialogContextValue>({
  size: 'small',
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

/* ─── Dialog (Root) ────────────────────────────────────────────────────────── */

export interface DialogProps {
  /** 열림 상태 (controlled). */
  open?: boolean
  /** 기본 열림 상태 (uncontrolled). */
  defaultOpen?: boolean
  /** 열림/닫힘 콜백. */
  onOpenChange?: (open: boolean) => void
  /**
   * 다이얼로그 너비 사이즈.
   * @default 'small'
   * @see DIALOG_SIZES
   */
  size?: DialogSize
  children: React.ReactNode
}

function DialogRoot({ open, defaultOpen, onOpenChange, size = 'small', children }: DialogProps) {
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <DialogThemeContext.Provider value={{ triggerRef }}>
      <DialogContext.Provider value={{ size }}>
        <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
          {children}
        </RadixDialog.Root>
      </DialogContext.Provider>
    </DialogThemeContext.Provider>
  )
}

/* ─── DialogTrigger ────────────────────────────────────────────────────────── */

export interface DialogTriggerProps {
  /**
   * 자식 요소에 trigger props를 전달한다.
   * @default true
   */
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild = true, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(DialogThemeContext)
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
DialogTrigger.displayName = 'DialogTrigger'

/* ─── DialogContent ────────────────────────────────────────────────────────── */

export interface DialogContentProps {
  /**
   * 블러 배경의 닫기 버튼 표시 여부.
   * @default false
   */
  showCloseButton?: boolean
  /**
   * large 사이즈의 커스텀 너비 (px). 다른 사이즈에서는 무시됨.
   */
  width?: number
  children: React.ReactNode
  className?: string
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ showCloseButton = false, width, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(DialogThemeContext)
    const { theme } = useThemeAttributes(triggerRef)
    const { size } = useContext(DialogContext)
    const isLarge = size === 'large'

    const widthStyle = isLarge && width ? { width: `${width}px`, maxWidth: 'calc(100vw - 80px)' } : undefined

    return (
      <RadixDialog.Portal>
        <div data-theme={theme} className="font-pretendard">
          <RadixDialog.Overlay
            className={cn(
              'fixed inset-0 z-50',
              'bg-[var(--comp-dialog-overlay)]',
              'data-[state=open]:animate-[dialog-overlay-enter_var(--semantic-duration-slow)_var(--semantic-easing-enter)]',
              'data-[state=closed]:animate-[dialog-overlay-exit_var(--semantic-duration-slow)_var(--semantic-easing-exit)_forwards]',
            )}
          />
          <RadixDialog.Content
            ref={ref}
            className={cn(
              'fixed top-1/2 left-1/2 z-50',
              '-translate-x-1/2 -translate-y-1/2',
              'flex flex-col',
              'bg-[var(--comp-dialog-bg)]',
              'rounded-[var(--comp-dialog-radius)]',
              'shadow-[var(--comp-dialog-shadow)]',
              'outline-none',
              'max-h-[calc(100vh-80px)]',
              isLarge ? undefined : sizeWidthMap[size],
              'data-[state=open]:animate-[dialog-content-enter_var(--semantic-duration-slow)_var(--semantic-easing-enter)]',
              'data-[state=closed]:animate-[dialog-content-exit_var(--semantic-duration-slow)_var(--semantic-easing-exit)_forwards]',
              className,
            )}
            style={widthStyle}
            {...props}
          >
            {children}

            {showCloseButton && (
              <RadixDialog.Close asChild>
                <button
                  aria-label="Close"
                  className={cn(
                    'group absolute z-10 inline-flex items-center justify-center',
                    'bg-[var(--comp-dialog-close-bg)] backdrop-blur-[8px]',
                    'rounded-[var(--comp-dialog-close-radius)]',
                    'transition-colors duration-fast ease-enter',
                    'top-[var(--comp-dialog-close-inset)] right-[var(--comp-dialog-close-inset)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-primary-300)] focus-visible:ring-offset-2',
                    isLarge
                      ? 'size-[var(--comp-dialog-close-size-lg)]'
                      : 'size-[var(--comp-dialog-close-size)]',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
                      'group-hover:bg-[var(--comp-dialog-close-hover)]',
                      'group-active:bg-[var(--comp-dialog-close-active)]',
                    )}
                  />
                  <CloseIcon
                    className={cn(
                      'relative text-[var(--comp-dialog-close-icon-color)]',
                      isLarge
                        ? 'size-[var(--comp-dialog-close-icon-lg)]'
                        : 'size-[var(--comp-dialog-close-icon)]',
                    )}
                  />
                </button>
              </RadixDialog.Close>
            )}
          </RadixDialog.Content>
        </div>
      </RadixDialog.Portal>
    )
  },
)
DialogContent.displayName = 'DialogContent'

/* ─── DialogImage ──────────────────────────────────────────────────────────── */

export interface DialogImageProps {
  /**
   * 이미지 레이아웃 타입.
   * @default 'banner'
   * @see DIALOG_IMAGE_TYPES
   */
  type?: DialogImageType
  /** 이미지 소스 URL. */
  src: string
  /** 접근성을 위한 대체 텍스트. */
  alt: string
  className?: string
}

export function DialogImage({ type = 'banner', src, alt, className }: DialogImageProps) {
  const { size } = useContext(DialogContext)

  if (type === 'mark') {
    return (
      <div
        className={cn(
          'flex items-center px-[var(--comp-dialog-px)] h-[var(--comp-dialog-image-mark-height)]',
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          className="min-w-[var(--comp-dialog-image-mark-min)] min-h-[var(--comp-dialog-image-mark-min)] object-cover rounded-[var(--radius-2)]"
        />
      </div>
    )
  }

  // banner type
  const heightClass = size !== 'large' ? imageHeightMap[size] : undefined

  return (
    <div
      className={cn(
        'w-full overflow-hidden flex-shrink-0',
        'rounded-t-[var(--comp-dialog-radius)]',
        heightClass,
        className,
      )}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}
DialogImage.displayName = 'DialogImage'

/* ─── DialogTitle ──────────────────────────────────────────────────────────── */

export interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, className, ...props }, ref) => {
    const { size } = useContext(DialogContext)

    return (
      <RadixDialog.Title
        ref={ref}
        className={cn(
          'flex-shrink-0 sticky top-0 z-10',
          'px-[var(--comp-dialog-px)] pt-[var(--comp-dialog-title-pt)] pb-0',
          'bg-[var(--comp-dialog-bg)]',
          'text-[var(--comp-dialog-title)]',
          size === 'large' ? 'typography-28-semibold' : 'typography-24-semibold',
          className,
        )}
        {...props}
      >
        {children}
      </RadixDialog.Title>
    )
  },
)
DialogTitle.displayName = 'DialogTitle'

/* ─── DialogDescription ────────────────────────────────────────────────────── */

export interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <RadixDialog.Description
        ref={ref}
        className={cn(
          'px-[var(--comp-dialog-px)] pt-0',
          'text-[var(--comp-dialog-desc)]',
          'typography-16-regular',
          className,
        )}
        {...props}
      >
        {children}
      </RadixDialog.Description>
    )
  },
)
DialogDescription.displayName = 'DialogDescription'

/* ─── DialogBody ───────────────────────────────────────────────────────────── */

export interface DialogBodyProps {
  children: React.ReactNode
  className?: string
}

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto min-h-0',
          'px-[var(--comp-dialog-px)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DialogBody.displayName = 'DialogBody'

/* ─── DialogFooter ─────────────────────────────────────────────────────────── */

export interface DialogFooterProps {
  /**
   * 버튼 레이아웃.
   * @default 'horizontal-hug'
   * @see DIALOG_FOOTER_LAYOUTS
   */
  layout?: DialogFooterLayout
  children: React.ReactNode
  className?: string
}

const footerLayoutMap: Record<DialogFooterLayout, string> = {
  'horizontal-hug': 'flex flex-row justify-end',
  'horizontal-fill': 'flex flex-row [&>*]:flex-1',
  'vertical-fill': 'flex flex-col [&>*]:w-full',
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ layout = 'horizontal-hug', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-shrink-0',
          'px-[var(--comp-dialog-footer-px)] py-[var(--comp-dialog-footer-py)]',
          'gap-[var(--comp-dialog-footer-gap)]',
          footerLayoutMap[layout],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DialogFooter.displayName = 'DialogFooter'

/* ─── DialogClose ──────────────────────────────────────────────────────────── */

export interface DialogCloseProps {
  /**
   * 자식 요소에 close 동작을 전달한다.
   * @default true
   */
  asChild?: boolean
  children: React.ReactNode
}

export function DialogClose({ asChild = true, children }: DialogCloseProps) {
  return (
    <RadixDialog.Close asChild={asChild}>
      {children}
    </RadixDialog.Close>
  )
}
DialogClose.displayName = 'DialogClose'

/* ─── Compound export ──────────────────────────────────────────────────────── */

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Image: DialogImage,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
})
