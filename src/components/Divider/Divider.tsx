import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const DIVIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const
export const DIVIDER_SPACINGS = ['none', 'compact', 'default', 'spacious'] as const
export const DIVIDER_WEIGHTS = ['thin', 'thick'] as const
export const DIVIDER_VARIANTS = ['solid', 'dashed', 'dotted'] as const
export const DIVIDER_LABEL_POSITIONS = ['left', 'center', 'right'] as const

export type DividerOrientation = (typeof DIVIDER_ORIENTATIONS)[number]
export type DividerSpacing = (typeof DIVIDER_SPACINGS)[number]
export type DividerWeight = (typeof DIVIDER_WEIGHTS)[number]
export type DividerVariant = (typeof DIVIDER_VARIANTS)[number]
export type DividerLabelPosition = (typeof DIVIDER_LABEL_POSITIONS)[number]

/* ─── CVA — orientation × spacing × weight ─────────────────────────────────── */

const dividerLineVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical:   'self-stretch',
    },
    spacing: {
      none:     '',
      compact:  '',
      default:  '',
      spacious: '',
    },
    weight: {
      thin:  '',
      thick: '',
    },
  },
  compoundVariants: [
    /* ─── Horizontal spacing ─── */
    { orientation: 'horizontal', spacing: 'none',     className: 'my-[var(--comp-divider-spacing-none)]' },
    { orientation: 'horizontal', spacing: 'compact',  className: 'my-[var(--comp-divider-spacing-compact)]' },
    { orientation: 'horizontal', spacing: 'default',  className: 'my-[var(--comp-divider-spacing-default)]' },
    { orientation: 'horizontal', spacing: 'spacious', className: 'my-[var(--comp-divider-spacing-spacious)]' },
    /* ─── Vertical spacing ─── */
    { orientation: 'vertical', spacing: 'none',     className: 'mx-[var(--comp-divider-spacing-none)]' },
    { orientation: 'vertical', spacing: 'compact',  className: 'mx-[var(--comp-divider-spacing-compact)]' },
    { orientation: 'vertical', spacing: 'default',  className: 'mx-[var(--comp-divider-spacing-default)]' },
    { orientation: 'vertical', spacing: 'spacious', className: 'mx-[var(--comp-divider-spacing-spacious)]' },
    /* ─── Horizontal weight ─── */
    { orientation: 'horizontal', weight: 'thin',  className: 'h-[var(--comp-divider-weight-thin)]' },
    { orientation: 'horizontal', weight: 'thick', className: 'h-[var(--comp-divider-weight-thick)]' },
    /* ─── Vertical weight ─── */
    { orientation: 'vertical', weight: 'thin',  className: 'w-[var(--comp-divider-weight-thin)]' },
    { orientation: 'vertical', weight: 'thick', className: 'w-[var(--comp-divider-weight-thick)]' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'default',
    weight: 'thin',
  },
})

/* ─── Variant style map ──────────────────────────────────────────────────── */

/** solid uses background, dashed/dotted use border */
const variantStyleMap: Record<DividerVariant, { horizontal: string; vertical: string }> = {
  solid: {
    horizontal: 'bg-[var(--comp-divider-color)]',
    vertical:   'bg-[var(--comp-divider-color)]',
  },
  dashed: {
    horizontal: 'border-t border-dashed border-[var(--comp-divider-color)] h-0',
    vertical:   'border-l border-dashed border-[var(--comp-divider-color)] w-0',
  },
  dotted: {
    horizontal: 'border-t border-dotted border-[var(--comp-divider-color)] h-0',
    vertical:   'border-l border-dotted border-[var(--comp-divider-color)] w-0',
  },
}

/** For dashed/dotted with thick weight, upgrade border-width */
const thickBorderOverride: Record<string, { horizontal: string; vertical: string }> = {
  dashed: {
    horizontal: 'border-t-2',
    vertical:   'border-l-2',
  },
  dotted: {
    horizontal: 'border-t-2',
    vertical:   'border-l-2',
  },
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

export interface DividerProps {
  /** 구분선 방향. @default 'horizontal' @see {@link DIVIDER_ORIENTATIONS} */
  orientation?: DividerOrientation
  /** 양쪽 여백 프리셋. horizontal→margin-y, vertical→margin-x. @default 'default' @see {@link DIVIDER_SPACINGS} */
  spacing?: DividerSpacing
  /** 선 두께. @default 'thin' @see {@link DIVIDER_WEIGHTS} */
  weight?: DividerWeight
  /** 선 스타일. @default 'solid' @see {@link DIVIDER_VARIANTS} */
  variant?: DividerVariant
  /** 선 위에 표시할 텍스트. horizontal에서만 동작. */
  label?: string
  /** 라벨 위치. label이 있을 때만 유효. @default 'center' @see {@link DIVIDER_LABEL_POSITIONS} */
  labelPosition?: DividerLabelPosition
  /** 추가 CSS 클래스 */
  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      spacing = 'default',
      weight = 'thin',
      variant = 'solid',
      label,
      labelPosition = 'center',
      className,
    },
    ref,
  ) => {
    const hasLabel = orientation === 'horizontal' && label != null && label !== ''

    /* ─── With label: flex container + two lines ─── */
    if (hasLabel) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          className={cn(
            'flex items-center gap-[var(--comp-divider-label-gap)]',
            /* spacing on wrapper */
            spacing === 'none'     && 'my-[var(--comp-divider-spacing-none)]',
            spacing === 'compact'  && 'my-[var(--comp-divider-spacing-compact)]',
            spacing === 'default'  && 'my-[var(--comp-divider-spacing-default)]',
            spacing === 'spacious' && 'my-[var(--comp-divider-spacing-spacious)]',
            className,
          )}
        >
          {/* Left line */}
          <span
            className={cn(
              labelPosition === 'right' ? 'flex-1' : labelPosition === 'center' ? 'flex-1' : 'w-4',
              getLineClasses('horizontal', variant, weight),
            )}
          />
          {/* Label text */}
          <span className="shrink-0 typography-13-regular text-[var(--comp-divider-label-color)] select-none">
            {label}
          </span>
          {/* Right line */}
          <span
            className={cn(
              labelPosition === 'left' ? 'flex-1' : labelPosition === 'center' ? 'flex-1' : 'w-4',
              getLineClasses('horizontal', variant, weight),
            )}
          />
        </div>
      )
    }

    /* ─── Without label: single line ─── */
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          dividerLineVariants({ orientation, spacing, weight }),
          variantStyleMap[variant][orientation],
          /* thick border override for dashed/dotted */
          weight === 'thick' && variant !== 'solid' && thickBorderOverride[variant]?.[orientation],
          className,
        )}
      />
    )
  },
)

Divider.displayName = 'Divider'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function getLineClasses(
  orientation: DividerOrientation,
  variant: DividerVariant,
  weight: DividerWeight,
): string {
  const base = variantStyleMap[variant][orientation]

  /* height/width for the line segment */
  const sizeClass =
    variant === 'solid'
      ? orientation === 'horizontal'
        ? `h-[var(--comp-divider-weight-${weight})]`
        : `w-[var(--comp-divider-weight-${weight})]`
      : '' /* dashed/dotted already set h-0/w-0 via border */

  const thickOverride =
    weight === 'thick' && variant !== 'solid'
      ? thickBorderOverride[variant]?.[orientation] ?? ''
      : ''

  return cn(base, sizeClass, thickOverride)
}
