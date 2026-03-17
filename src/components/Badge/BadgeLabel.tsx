import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const BADGE_COLORS = [
  'gray', 'indigo', 'purple', 'violet', 'pink', 'rose', 'red-bright',
  'orange', 'amber', 'yellow', 'lime', 'edamame', 'forest', 'emerald',
  'cyan', 'sky', 'blue',
] as const

export const BADGE_SIZES = ['small', 'medium'] as const
export const BADGE_WEIGHTS = ['light', 'heavy'] as const
export const BADGE_SHAPES = ['square', 'pill'] as const

export type BadgeColor = (typeof BADGE_COLORS)[number]
export type BadgeSize = (typeof BADGE_SIZES)[number]
export type BadgeWeight = (typeof BADGE_WEIGHTS)[number]
export type BadgeShape = (typeof BADGE_SHAPES)[number]

/* ─── CVA — size + shape axes ──────────────────────────────────────────────── */

const badgeLabelVariants = cva(
  'inline-flex items-center justify-center shrink-0 select-none whitespace-nowrap',
  {
    variants: {
      size: {
        small:  'h-[var(--comp-badge-height-sm)] typography-12-medium',
        medium: 'h-[var(--comp-badge-height-md)] typography-14-medium',
      },
      shape: {
        square: '',
        pill:   'rounded-[var(--comp-badge-radius-pill)]',
      },
    },
    compoundVariants: [
      /* square — size별 radius + px */
      { shape: 'square', size: 'small',  className: 'rounded-[var(--comp-badge-radius-sm)] px-[var(--comp-badge-px-sm)]' },
      { shape: 'square', size: 'medium', className: 'rounded-[var(--comp-badge-radius-md)] px-[var(--comp-badge-px-md)]' },
      /* pill — size별 px (radius는 shape variant에서 이미 적용) */
      { shape: 'pill', size: 'small',  className: 'px-[var(--comp-badge-px-sm-pill)]' },
      { shape: 'pill', size: 'medium', className: 'px-[var(--comp-badge-px-md-pill)]' },
    ],
    defaultVariants: { size: 'small', shape: 'square' },
  },
)

/* ─── Color map — literal strings for Tailwind JIT scanning ────────────────── */

type BadgeColorDef = { light: string; heavy: string }

/** Badge/Counter 공용 컬러 맵. CSS 변수로 테마별 자동 전환. */
export const badgeColorMap: Record<BadgeColor, BadgeColorDef> = {
  'gray':       { light: 'bg-[var(--comp-badge-gray-light-bg)] text-[var(--comp-badge-gray-light-text)]',             heavy: 'bg-[var(--comp-badge-gray-heavy-bg)] text-[var(--comp-badge-gray-heavy-text)]' },
  'indigo':     { light: 'bg-[var(--comp-badge-indigo-light-bg)] text-[var(--comp-badge-indigo-light-text)]',         heavy: 'bg-[var(--comp-badge-indigo-heavy-bg)] text-[var(--comp-badge-indigo-heavy-text)]' },
  'purple':     { light: 'bg-[var(--comp-badge-purple-light-bg)] text-[var(--comp-badge-purple-light-text)]',         heavy: 'bg-[var(--comp-badge-purple-heavy-bg)] text-[var(--comp-badge-purple-heavy-text)]' },
  'violet':     { light: 'bg-[var(--comp-badge-violet-light-bg)] text-[var(--comp-badge-violet-light-text)]',         heavy: 'bg-[var(--comp-badge-violet-heavy-bg)] text-[var(--comp-badge-violet-heavy-text)]' },
  'pink':       { light: 'bg-[var(--comp-badge-pink-light-bg)] text-[var(--comp-badge-pink-light-text)]',             heavy: 'bg-[var(--comp-badge-pink-heavy-bg)] text-[var(--comp-badge-pink-heavy-text)]' },
  'rose':       { light: 'bg-[var(--comp-badge-rose-light-bg)] text-[var(--comp-badge-rose-light-text)]',             heavy: 'bg-[var(--comp-badge-rose-heavy-bg)] text-[var(--comp-badge-rose-heavy-text)]' },
  'red-bright': { light: 'bg-[var(--comp-badge-red-bright-light-bg)] text-[var(--comp-badge-red-bright-light-text)]', heavy: 'bg-[var(--comp-badge-red-bright-heavy-bg)] text-[var(--comp-badge-red-bright-heavy-text)]' },
  'orange':     { light: 'bg-[var(--comp-badge-orange-light-bg)] text-[var(--comp-badge-orange-light-text)]',         heavy: 'bg-[var(--comp-badge-orange-heavy-bg)] text-[var(--comp-badge-orange-heavy-text)]' },
  'amber':      { light: 'bg-[var(--comp-badge-amber-light-bg)] text-[var(--comp-badge-amber-light-text)]',           heavy: 'bg-[var(--comp-badge-amber-heavy-bg)] text-[var(--comp-badge-amber-heavy-text)]' },
  'yellow':     { light: 'bg-[var(--comp-badge-yellow-light-bg)] text-[var(--comp-badge-yellow-light-text)]',         heavy: 'bg-[var(--comp-badge-yellow-heavy-bg)] text-[var(--comp-badge-yellow-heavy-text)]' },
  'lime':       { light: 'bg-[var(--comp-badge-lime-light-bg)] text-[var(--comp-badge-lime-light-text)]',             heavy: 'bg-[var(--comp-badge-lime-heavy-bg)] text-[var(--comp-badge-lime-heavy-text)]' },
  'edamame':    { light: 'bg-[var(--comp-badge-edamame-light-bg)] text-[var(--comp-badge-edamame-light-text)]',       heavy: 'bg-[var(--comp-badge-edamame-heavy-bg)] text-[var(--comp-badge-edamame-heavy-text)]' },
  'forest':     { light: 'bg-[var(--comp-badge-forest-light-bg)] text-[var(--comp-badge-forest-light-text)]',         heavy: 'bg-[var(--comp-badge-forest-heavy-bg)] text-[var(--comp-badge-forest-heavy-text)]' },
  'emerald':    { light: 'bg-[var(--comp-badge-emerald-light-bg)] text-[var(--comp-badge-emerald-light-text)]',       heavy: 'bg-[var(--comp-badge-emerald-heavy-bg)] text-[var(--comp-badge-emerald-heavy-text)]' },
  'cyan':       { light: 'bg-[var(--comp-badge-cyan-light-bg)] text-[var(--comp-badge-cyan-light-text)]',             heavy: 'bg-[var(--comp-badge-cyan-heavy-bg)] text-[var(--comp-badge-cyan-heavy-text)]' },
  'sky':        { light: 'bg-[var(--comp-badge-sky-light-bg)] text-[var(--comp-badge-sky-light-text)]',               heavy: 'bg-[var(--comp-badge-sky-heavy-bg)] text-[var(--comp-badge-sky-heavy-text)]' },
  'blue':       { light: 'bg-[var(--comp-badge-blue-light-bg)] text-[var(--comp-badge-blue-light-text)]',             heavy: 'bg-[var(--comp-badge-blue-heavy-bg)] text-[var(--comp-badge-blue-heavy-text)]' },
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * 텍스트 라벨 뱃지. 데이터 라벨링, 상태 표시 등에 사용.
 * 2 sizes × 2 shapes × 2 weights × 17 decorative colors. 비인터랙티브.
 */
export interface BadgeLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 배지 내부 텍스트. 짧은 레이블.
   */
  children: React.ReactNode

  /**
   * 크기 variant. 높이와 타이포그래피를 제어한다.
   * @default 'small'
   * @see BADGE_SIZES
   */
  size?: BadgeSize

  /**
   * 형태. square=사이즈별 라운드 코너, pill=완전 라운드(패딩 넓음).
   * @default 'square'
   * @see BADGE_SHAPES
   */
  shape?: BadgeShape

  /**
   * 시각적 무게. light=연한 배경+진한 텍스트, heavy=진한 배경+밝은 텍스트.
   * @default 'light'
   * @see BADGE_WEIGHTS
   */
  weight?: BadgeWeight

  /**
   * 장식적 컬러 패밀리. primitive 토큰 이름과 1:1 대응.
   * @default 'gray'
   * @see BADGE_COLORS
   */
  color?: BadgeColor
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const BadgeLabel = forwardRef<HTMLSpanElement, BadgeLabelProps>(
  function BadgeLabel(
    { children, size = 'small', shape = 'square', weight = 'light', color = 'gray', className, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={cn(
          badgeLabelVariants({ size, shape }),
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
