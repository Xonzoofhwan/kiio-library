import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SKELETON_VARIANTS = ['text', 'circular', 'rectangular'] as const
export const SKELETON_ANIMATIONS = ['pulse', 'wave', 'none'] as const

export type SkeletonVariant = (typeof SKELETON_VARIANTS)[number]
export type SkeletonAnimation = (typeof SKELETON_ANIMATIONS)[number]

/* ─── CVA — variant × animation ────────────────────────────────────────────── */

const skeletonVariants = cva('block shrink-0', {
  variants: {
    variant: {
      text: [
        'w-full',
        'h-[var(--comp-skeleton-height-text)]',
        'rounded-[var(--comp-skeleton-radius-text)]',
      ],
      circular: [
        'rounded-full',
        'w-[var(--comp-skeleton-size-circular)]',
        'h-[var(--comp-skeleton-size-circular)]',
      ],
      rectangular: [
        'w-full',
        'h-[var(--comp-skeleton-height-rect)]',
        'rounded-[var(--comp-skeleton-radius-rect)]',
      ],
    },
    animation: {
      pulse: 'animate-skeleton-pulse bg-[var(--comp-skeleton-bg)]',
      wave: [
        'bg-[length:200%_100%]',
        'animate-skeleton-wave',
      ],
      none: 'bg-[var(--comp-skeleton-bg)]',
    },
  },
  defaultVariants: {
    variant: 'text',
    animation: 'pulse',
  },
})

/* ─── Wave gradient style ──────────────────────────────────────────────────── */

const WAVE_GRADIENT =
  'linear-gradient(90deg, var(--comp-skeleton-bg) 25%, var(--comp-skeleton-highlight) 50%, var(--comp-skeleton-bg) 75%)'

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface SkeletonProps {
  /** 플레이스홀더 형태. @default 'text' @see {@link SKELETON_VARIANTS} */
  variant?: SkeletonVariant
  /** 애니메이션 타입. @default 'pulse' @see {@link SKELETON_ANIMATIONS} */
  animation?: SkeletonAnimation
  /** 커스텀 너비. 숫자=px, 문자열=CSS 단위. */
  width?: string | number
  /** 커스텀 높이. 숫자=px, 문자열=CSS 단위. */
  height?: string | number
  /** text variant 전용 — 여러 줄 렌더링. 마지막 줄은 80% 너비. @default 1 */
  lines?: number
  /** 추가 CSS 클래스 */
  className?: string
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function toCssValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      animation = 'pulse',
      width,
      height,
      lines = 1,
      className,
    },
    ref,
  ) => {
    const isWave = animation === 'wave'

    const customStyle: React.CSSProperties = {
      ...(width != null && { width: toCssValue(width) }),
      ...(height != null && { height: toCssValue(height) }),
      ...(isWave && { backgroundImage: WAVE_GRADIENT }),
    }

    /* ─── Multi-line text ─── */
    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          className={cn('flex flex-col gap-[var(--comp-skeleton-line-gap)]', className)}
          style={width != null ? { width: toCssValue(width) } : undefined}
        >
          {Array.from({ length: lines }, (_, i) => {
            const isLast = i === lines - 1
            const lineStyle: React.CSSProperties = {
              ...(height != null && { height: toCssValue(height) }),
              ...(isLast && { width: '80%' }),
              ...(isWave && { backgroundImage: WAVE_GRADIENT }),
            }

            return (
              <span
                key={i}
                className={cn(skeletonVariants({ variant: 'text', animation }))}
                style={Object.keys(lineStyle).length > 0 ? lineStyle : undefined}
              />
            )
          })}
        </div>
      )
    }

    /* ─── Single element ─── */
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant, animation }), className)}
        style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
      />
    )
  },
)

Skeleton.displayName = 'Skeleton'
