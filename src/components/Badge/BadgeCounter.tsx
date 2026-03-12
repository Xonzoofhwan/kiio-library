import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { BadgeColor, BadgeWeight } from './BadgeLabel'
import { badgeColorMap } from './BadgeLabel'

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * 카운터/태그 뱃지. 읽지 않은 메시지 수, 필터 카운트, New/Beta 태그 등에 사용.
 * 고정 크기(h16), 항상 pill 형태, min-w 16px. 비인터랙티브.
 */
export interface BadgeCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 카운터 내부 텍스트. 숫자 또는 짧은 레이블 ("99+", "New").
   */
  children: React.ReactNode

  /**
   * 시각적 무게. light=연한 배경+진한 텍스트, heavy=진한 배경+밝은 텍스트.
   * @default 'heavy'
   * @see BADGE_WEIGHTS
   */
  weight?: BadgeWeight

  /**
   * 장식적 컬러 패밀리. primitive 토큰 이름과 1:1 대응.
   * @default 'red-bright'
   * @see BADGE_COLORS
   */
  color?: BadgeColor
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const BadgeCounter = forwardRef<HTMLSpanElement, BadgeCounterProps>(
  function BadgeCounter(
    { children, weight = 'heavy', color = 'red-bright', className, ...rest },
    ref,
  ) {
    const text = typeof children === 'number' ? String(children) : children
    const isSingleChar = typeof text === 'string' && text.length === 1

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center shrink-0 select-none whitespace-nowrap text-center',
          'h-[var(--comp-badge-counter-height)] rounded-[var(--comp-badge-radius-pill)] typography-12-medium',
          isSingleChar
            ? 'w-[var(--comp-badge-counter-height)]'
            : 'min-w-[var(--comp-badge-counter-min-w)] px-[var(--comp-badge-counter-px)]',
          badgeColorMap[color][weight],
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    )
  },
)
