import { cn } from '@/lib/utils'
import type { ToastIntent } from './shared'

/* ─── Icon color map ───────────────────────────────────────────────────────── */

const iconColorMap: Record<ToastIntent, string> = {
  default:  'text-[var(--comp-toast-icon-default)]',
  positive: 'text-[var(--comp-toast-icon-positive)]',
  warning:  'text-[var(--comp-toast-icon-warning)]',
  error:    'text-[var(--comp-toast-icon-error)]',
}

/* ─── SVG icons ────────────────────────────────────────────────────────────── */

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', className)} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 8V12M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', className)} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', className)} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 8V13M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', className)} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Intent → Icon mapping ────────────────────────────────────────────────── */

const iconMap: Record<ToastIntent, React.FC<{ className?: string }>> = {
  default:  InfoIcon,
  positive: CheckIcon,
  warning:  WarningIcon,
  error:    ErrorIcon,
}

/* ─── Public component ─────────────────────────────────────────────────────── */

interface ToastIconProps {
  intent: ToastIntent
  className?: string
}

export function ToastIcon({ intent, className }: ToastIconProps) {
  const Icon = iconMap[intent]
  return (
    <div className={cn('shrink-0 size-[var(--comp-toast-icon-size)]', iconColorMap[intent], className)}>
      <Icon />
    </div>
  )
}
