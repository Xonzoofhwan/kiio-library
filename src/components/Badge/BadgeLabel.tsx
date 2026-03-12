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

/** Badge/Counter 공용 컬러 맵. primitive 토큰 Tailwind 클래스 리터럴. */
export const badgeColorMap: Record<BadgeColor, BadgeColorDef> = {
  'gray':       { light: 'bg-primitive-gray-100 text-primitive-gray-700',             heavy: 'bg-primitive-gray-800 text-primitive-gray-0' },
  'indigo':     { light: 'bg-primitive-indigo-100 text-primitive-indigo-700',         heavy: 'bg-primitive-indigo-500 text-primitive-gray-0' },
  'purple':     { light: 'bg-primitive-purple-100 text-primitive-purple-700',         heavy: 'bg-primitive-purple-500 text-primitive-gray-0' },
  'violet':     { light: 'bg-primitive-violet-100 text-primitive-violet-700',         heavy: 'bg-primitive-violet-500 text-primitive-gray-0' },
  'pink':       { light: 'bg-primitive-pink-100 text-primitive-pink-700',             heavy: 'bg-primitive-pink-500 text-primitive-gray-0' },
  'rose':       { light: 'bg-primitive-rose-100 text-primitive-rose-700',             heavy: 'bg-primitive-rose-500 text-primitive-gray-0' },
  'red-bright': { light: 'bg-primitive-red-bright-100 text-primitive-red-bright-600', heavy: 'bg-primitive-red-bright-500 text-primitive-gray-0' },
  'orange':     { light: 'bg-primitive-orange-100 text-primitive-orange-600',         heavy: 'bg-primitive-orange-500 text-primitive-gray-0' },
  'amber':      { light: 'bg-primitive-amber-100 text-primitive-amber-600',           heavy: 'bg-primitive-amber-500 text-primitive-gray-0' },
  'yellow':     { light: 'bg-primitive-yellow-100 text-primitive-yellow-700',         heavy: 'bg-primitive-yellow-400 text-primitive-yellow-950' },
  'lime':       { light: 'bg-primitive-lime-200 text-primitive-lime-800',             heavy: 'bg-primitive-lime-500 text-primitive-gray-0' },
  'edamame':    { light: 'bg-primitive-edamame-100 text-primitive-edamame-700',       heavy: 'bg-primitive-edamame-500 text-primitive-gray-0' },
  'forest':     { light: 'bg-primitive-forest-100 text-primitive-forest-600',         heavy: 'bg-primitive-forest-500 text-primitive-gray-0' },
  'emerald':    { light: 'bg-primitive-emerald-100 text-primitive-emerald-600',       heavy: 'bg-primitive-emerald-500 text-primitive-gray-0' },
  'cyan':       { light: 'bg-primitive-cyan-100 text-primitive-cyan-700',             heavy: 'bg-primitive-cyan-500 text-primitive-gray-0' },
  'sky':        { light: 'bg-primitive-sky-100 text-primitive-sky-700',               heavy: 'bg-primitive-sky-500 text-primitive-gray-0' },
  'blue':       { light: 'bg-primitive-blue-100 text-primitive-blue-700',             heavy: 'bg-primitive-blue-500 text-primitive-gray-0' },
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
