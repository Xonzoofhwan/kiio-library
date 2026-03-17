import { cn } from '@/lib/utils'
import { ToastIcon } from './toast-icons'
import type { ToastItem } from './shared'

/* ─── Props ────────────────────────────────────────────────────────────────── */

interface ToastBodyProps {
  item: ToastItem
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function ToastBody({ item }: ToastBodyProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-[var(--comp-toast-gap)]',
        'overflow-clip py-[var(--comp-toast-text-py)]',
        'min-h-px min-w-px flex-1',
      )}
    >
      {item.showIcon && <ToastIcon intent={item.intent} />}

      <div className="flex flex-1 items-center min-h-px min-w-px pl-[var(--comp-toast-text-pl)]">
        <p className="typography-16-regular text-[var(--comp-toast-text)] flex-1">
          {item.message}
        </p>
      </div>
    </div>
  )
}
