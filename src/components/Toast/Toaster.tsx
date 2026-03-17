import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as RadixToast from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'
import { useToastStore, toast } from './toast-store'
import { ToastBody } from './Toast'
import { SnackbarBody } from './Snackbar'
import type { ToastPosition } from './shared'

/* ─── Theme detection (same pattern as Tooltip/Callout) ────────────────────── */

function useThemeAttributes(probeRef: React.RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<string | undefined>()

  useEffect(() => {
    const el = probeRef.current
    if (!el) return
    const themed = el.closest('[data-theme]')
    if (themed) {
      const t = themed.getAttribute('data-theme') ?? undefined
      setTheme((prev) => (prev === t ? prev : t))
    }
  })

  return { theme }
}

/* ─── Viewport position classes ────────────────────────────────────────────── */

const viewportClassMap: Record<ToastPosition, string> = {
  'bottom-center': 'fixed bottom-[var(--comp-toast-viewport-offset)] left-1/2 -translate-x-1/2 flex flex-col-reverse items-center',
  'top-center':    'fixed top-[var(--comp-toast-viewport-offset)] left-1/2 -translate-x-1/2 flex flex-col items-center',
  'bottom-right':  'fixed bottom-[var(--comp-toast-viewport-offset)] right-[var(--comp-toast-viewport-offset)] flex flex-col-reverse items-end',
  'top-right':     'fixed top-[var(--comp-toast-viewport-offset)] right-[var(--comp-toast-viewport-offset)] flex flex-col items-end',
}

/* ─── Animation classes ────────────────────────────────────────────────────── */

function getAnimationClasses(position: ToastPosition) {
  const isTop = position.startsWith('top')
  return cn(
    isTop
      ? 'data-[state=open]:animate-[toast-enter-top_var(--semantic-duration-normal)_var(--semantic-easing-enter)] data-[state=closed]:animate-[toast-exit-top_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]'
      : 'data-[state=open]:animate-[toast-enter-bottom_var(--semantic-duration-normal)_var(--semantic-easing-enter)] data-[state=closed]:animate-[toast-exit-bottom_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
    'data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]',
    'data-[swipe=cancel]:translate-y-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-fast data-[swipe=cancel]:ease-enter',
    `data-[swipe=end]:animate-[${isTop ? 'toast-exit-top' : 'toast-exit-bottom'}_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]`,
  )
}

/* ─── Container base style ─────────────────────────────────────────────────── */

const containerBase = [
  'rounded-[var(--comp-toast-radius)]',
  'bg-[var(--comp-toast-bg)]',
  'border border-[var(--comp-toast-border)]',
  '[box-shadow:var(--comp-toast-shadow)]',
  '[backdrop-filter:blur(var(--comp-toast-backdrop-blur))]',
  'px-[var(--comp-toast-px)] py-[var(--comp-toast-py)]',
  'overflow-clip',
].join(' ')

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface ToasterProps {
  /**
   * 토스트 표시 위치.
   * @default 'bottom-center'
   * @see TOAST_POSITIONS
   */
  position?: ToastPosition
  /** 커스텀 className */
  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function Toaster({ position = 'bottom-center', className }: ToasterProps) {
  const probeRef = useRef<HTMLDivElement>(null)
  const { theme } = useThemeAttributes(probeRef)
  const items = useToastStore()
  const animClasses = getAnimationClasses(position)
  const swipeDirection = position.startsWith('top') ? 'up' : 'down'

  return (
    <>
      {/* Theme probe — captures data-theme from app tree */}
      <div ref={probeRef} style={{ display: 'none' }} />

      {createPortal(
        <div data-theme={theme} className="font-pretendard">
          <RadixToast.Provider swipeDirection={swipeDirection} duration={5000}>
            {items.map((item) => (
              <RadixToast.Root
                key={item.id}
                duration={item.duration ?? undefined}
                onOpenChange={(open) => {
                  if (!open) toast.dismiss(item.id)
                }}
                className={cn(
                  containerBase,
                  item.type === 'toast'
                    ? 'w-[var(--comp-toast-width)]'
                    : 'w-[var(--comp-snackbar-width)]',
                  animClasses,
                  className,
                )}
              >
                {item.type === 'toast' ? (
                  <ToastBody item={item} />
                ) : (
                  <SnackbarBody item={item} />
                )}
              </RadixToast.Root>
            ))}

            <RadixToast.Viewport
              className={cn(
                viewportClassMap[position],
                'gap-[var(--comp-toast-stack-gap)]',
                'z-[100]',
                'outline-none',
                'p-0 m-0 list-none',
              )}
            />
          </RadixToast.Provider>
        </div>,
        document.body,
      )}
    </>
  )
}
