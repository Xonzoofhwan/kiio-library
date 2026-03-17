/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TOAST_INTENTS = ['default', 'positive', 'warning', 'error'] as const
export const TOAST_POSITIONS = ['bottom-center', 'top-center', 'bottom-right', 'top-right'] as const

export type ToastIntent = (typeof TOAST_INTENTS)[number]
export type ToastPosition = (typeof TOAST_POSITIONS)[number]

/* ─── Action type ──────────────────────────────────────────────────────────── */

export interface ToastAction {
  /** 버튼 텍스트 */
  label: string
  /** 클릭 핸들러 */
  onClick: () => void
  /**
   * 버튼 시각 유형.
   * @default 'assist'
   */
  variant?: 'assist' | 'main'
}

/* ─── Store item ───────────────────────────────────────────────────────────── */

export interface ToastItem {
  id: string
  type: 'toast' | 'snackbar'
  message: string
  intent: ToastIntent
  showIcon: boolean
  duration: number | null
  actions: ToastAction[]
  createdAt: number
}
