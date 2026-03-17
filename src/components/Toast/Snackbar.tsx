import * as RadixToast from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'
import { ToastIcon } from './toast-icons'
import type { ToastItem } from './shared'

/* ─── Props ────────────────────────────────────────────────────────────────── */

interface SnackbarBodyProps {
  item: ToastItem
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function SnackbarBody({ item }: SnackbarBodyProps) {
  const isTwoButtons = item.actions.length >= 2

  return (
    <div
      className={cn(
        'flex gap-2',
        isTwoButtons ? 'flex-col items-start justify-center' : 'items-center',
      )}
    >
      {/* Text row */}
      <div
        className={cn(
          'flex items-start gap-[var(--comp-toast-gap)]',
          'overflow-clip py-[var(--comp-toast-text-py)]',
          isTwoButtons ? 'w-full shrink-0' : 'flex-1 min-h-px min-w-px',
        )}
      >
        {item.showIcon && <ToastIcon intent={item.intent} />}

        <div className="flex flex-1 items-center min-h-px min-w-px pl-[var(--comp-toast-text-pl)]">
          <p className="typography-16-regular text-[var(--comp-toast-text)] flex-1">
            {item.message}
          </p>
        </div>
      </div>

      {/* Button(s) */}
      {item.actions.length > 0 && (
        <div
          className={cn(
            'flex items-center gap-2 shrink-0',
            isTwoButtons && 'w-full justify-end pl-[var(--comp-snackbar-button-row-pl)]',
          )}
        >
          {item.actions.map((action, i) => {
            const variant = action.variant ?? (item.actions.length === 1 ? 'assist' : i === 0 ? 'assist' : 'main')
            const isMain = variant === 'main'

            return (
              <RadixToast.Close key={i} asChild>
                <button
                  onClick={() => {
                    action.onClick()
                  }}
                  className={cn(
                    'h-[var(--comp-snackbar-button-h)] w-[var(--comp-snackbar-button-w)]',
                    'rounded-[var(--comp-snackbar-button-radius)]',
                    'flex items-center justify-center',
                    'typography-14-semibold',
                    'transition-opacity duration-fast ease-enter hover:opacity-80',
                    isMain
                      ? 'bg-[var(--comp-snackbar-btn-bg-main)] text-[var(--comp-snackbar-btn-text-main)]'
                      : 'bg-transparent text-[var(--comp-snackbar-btn-text-assist)]',
                  )}
                >
                  {action.label}
                </button>
              </RadixToast.Close>
            )
          })}
        </div>
      )}
    </div>
  )
}
