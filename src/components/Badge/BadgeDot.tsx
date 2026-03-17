import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { BadgeColor } from './BadgeLabel'

/* ─── Color map — literal strings for Tailwind JIT scanning ────────────────── */

const dotColorMap: Record<BadgeColor, string> = {
  'gray':       'bg-[var(--comp-badge-dot-gray)]',
  'indigo':     'bg-[var(--comp-badge-dot-indigo)]',
  'purple':     'bg-[var(--comp-badge-dot-purple)]',
  'violet':     'bg-[var(--comp-badge-dot-violet)]',
  'pink':       'bg-[var(--comp-badge-dot-pink)]',
  'rose':       'bg-[var(--comp-badge-dot-rose)]',
  'red-bright': 'bg-[var(--comp-badge-dot-red-bright)]',
  'orange':     'bg-[var(--comp-badge-dot-orange)]',
  'amber':      'bg-[var(--comp-badge-dot-amber)]',
  'yellow':     'bg-[var(--comp-badge-dot-yellow)]',
  'lime':       'bg-[var(--comp-badge-dot-lime)]',
  'edamame':    'bg-[var(--comp-badge-dot-edamame)]',
  'forest':     'bg-[var(--comp-badge-dot-forest)]',
  'emerald':    'bg-[var(--comp-badge-dot-emerald)]',
  'cyan':       'bg-[var(--comp-badge-dot-cyan)]',
  'sky':        'bg-[var(--comp-badge-dot-sky)]',
  'blue':       'bg-[var(--comp-badge-dot-blue)]',
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * 원형 도트 인디케이터. 상태 표시나 알림 카운터 옆 장식에 사용.
 * 8px 고정 크기, 1px 흰색 내부 테두리. 비인터랙티브.
 */
export interface BadgeDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 장식적 컬러 패밀리. primitive 토큰 이름과 1:1 대응.
   * @default 'gray'
   * @see BADGE_COLORS
   */
  color?: BadgeColor
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const BadgeDot = forwardRef<HTMLSpanElement, BadgeDotProps>(
  function BadgeDot({ color = 'gray', className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-block shrink-0 rounded-full size-[var(--comp-badge-dot-size)]',
          'shadow-[inset_0_0_0_1px_var(--comp-badge-dot-border)]',
          dotColorMap[color],
          className,
        )}
        {...rest}
      />
    )
  },
)
