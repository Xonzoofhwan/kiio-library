import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { BadgeColor } from './BadgeLabel'

/* ─── Color map — literal strings for Tailwind JIT scanning ────────────────── */

const dotColorMap: Record<BadgeColor, string> = {
  'gray':       'bg-primitive-gray-300',
  'indigo':     'bg-primitive-indigo-500',
  'purple':     'bg-primitive-purple-500',
  'violet':     'bg-primitive-violet-500',
  'pink':       'bg-primitive-pink-500',
  'rose':       'bg-primitive-rose-500',
  'red-bright': 'bg-primitive-red-bright-500',
  'orange':     'bg-primitive-orange-500',
  'amber':      'bg-primitive-amber-500',
  'yellow':     'bg-primitive-yellow-500',
  'lime':       'bg-primitive-lime-500',
  'edamame':    'bg-primitive-edamame-500',
  'forest':     'bg-primitive-forest-500',
  'emerald':    'bg-primitive-emerald-500',
  'cyan':       'bg-primitive-cyan-500',
  'sky':        'bg-primitive-sky-500',
  'blue':       'bg-primitive-blue-500',
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
          'shadow-[inset_0_0_0_1px_var(--primitive-gray-0)]',
          dotColorMap[color],
          className,
        )}
        {...rest}
      />
    )
  },
)
