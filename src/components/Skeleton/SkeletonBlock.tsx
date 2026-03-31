import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SKELETON_BLOCK_SHAPES = ['small', 'medium', 'large', 'circular'] as const

export type SkeletonBlockShape = (typeof SKELETON_BLOCK_SHAPES)[number]

/* ─── CVA ──────────────────────────────────────────────────────────────────── */

const skeletonBlockVariants = cva(
  [
    'relative overflow-hidden',
    'bg-[var(--comp-skeleton-bg)]',
  ],
  {
    variants: {
      shape: {
        small:    'rounded-[var(--comp-skeleton-radius-small)]',
        medium:   'rounded-[var(--comp-skeleton-radius-medium)]',
        large:    'rounded-[var(--comp-skeleton-radius-large)]',
        circular: 'rounded-full',
      },
    },
    defaultVariants: {
      shape: 'medium',
    },
  },
)

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface SkeletonBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof skeletonBlockVariants> {
  /** Width of the skeleton block.
   * @default '100%' */
  width?: number | string
  /** Height of the skeleton block.
   * @default 16 */
  height?: number | string
  /** Border-radius shape preset.
   * - `small`: 4px
   * - `medium`: 8px
   * - `large`: 12px
   * - `circular`: rounded-full (avatar)
   * @default 'medium'
   * @see {@link SKELETON_BLOCK_SHAPES} */
  shape?: SkeletonBlockShape
  /** Disable shimmer animation.
   * @default false */
  disableAnimation?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function SkeletonBlock({
  width = '100%',
  height = 16,
  shape = 'medium',
  disableAnimation = false,
  className,
  style,
  ...rest
}: SkeletonBlockProps) {
  const resolvedWidth = typeof width === 'number' ? `${width}px` : width
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(skeletonBlockVariants({ shape }), className)}
      style={{ width: resolvedWidth, height: resolvedHeight, ...style }}
      {...rest}
    >
      {/* Shimmer overlay — GPU-accelerated via transform, diagonal gradient */}
      {!disableAnimation && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite]"
          style={{
            backgroundImage: 'linear-gradient(110deg, transparent 20%, var(--comp-skeleton-shimmer) 60%, transparent 90%)',
          }}
        />
      )}
    </div>
  )
}
