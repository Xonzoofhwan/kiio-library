import { useSyncExternalStore } from 'react'
import type { ToastIntent, ToastAction, ToastItem } from './shared'

/* ─── Constants ────────────────────────────────────────────────────────────── */

const TOAST_DURATION = 5000
const SNACKBAR_DURATION = 8000
const MAX_VISIBLE = 3

/* ─── Internal state ───────────────────────────────────────────────────────── */

let items: ToastItem[] = []
let counter = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return items
}

/* ─── Internal helpers ─────────────────────────────────────────────────────── */

function addItem(item: ToastItem) {
  items = [item, ...items].slice(0, MAX_VISIBLE)
  emit()
}

function removeItem(id: string) {
  items = items.filter((t) => t.id !== id)
  emit()
}

/* ─── Options types ────────────────────────────────────────────────────────── */

interface ToastOptions {
  intent?: ToastIntent
  showIcon?: boolean
  duration?: number | null
}

interface SnackbarOptions extends ToastOptions {
  actions?: ToastAction[]
}

/* ─── Public API ───────────────────────────────────────────────────────────── */

function createToast(message: string, options?: ToastOptions): string {
  const id = `toast-${++counter}`
  addItem({
    id,
    type: 'toast',
    message,
    intent: options?.intent ?? 'default',
    showIcon: options?.showIcon ?? true,
    duration: options?.duration === null ? null : (options?.duration ?? TOAST_DURATION),
    actions: [],
    createdAt: Date.now(),
  })
  return id
}

createToast.positive = (message: string, options?: Omit<ToastOptions, 'intent'>) =>
  createToast(message, { ...options, intent: 'positive' })

createToast.warning = (message: string, options?: Omit<ToastOptions, 'intent'>) =>
  createToast(message, { ...options, intent: 'warning' })

createToast.error = (message: string, options?: Omit<ToastOptions, 'intent'>) =>
  createToast(message, { ...options, intent: 'error' })

createToast.snackbar = (message: string, options?: SnackbarOptions): string => {
  const id = `toast-${++counter}`
  addItem({
    id,
    type: 'snackbar',
    message,
    intent: options?.intent ?? 'default',
    showIcon: options?.showIcon ?? true,
    duration: options?.duration === null ? null : (options?.duration ?? SNACKBAR_DURATION),
    actions: options?.actions ?? [],
    createdAt: Date.now(),
  })
  return id
}

createToast.dismiss = (id: string) => removeItem(id)

createToast.dismissAll = () => {
  items = []
  emit()
}

export const toast = createToast

/* ─── React hook ───────────────────────────────────────────────────────────── */

export function useToastStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
