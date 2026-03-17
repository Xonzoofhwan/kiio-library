import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TEXTBUTTON_INTENTS = ['systemic', 'brand'] as const
export const TEXTBUTTON_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const TEXTBUTTON_SURFACES = ['bright', 'dim'] as const

export type TextButtonIntent = (typeof TEXTBUTTON_INTENTS)[number]
export type TextButtonSize = (typeof TEXTBUTTON_SIZES)[number]
export type TextButtonSurface = (typeof TEXTBUTTON_SURFACES)[number]

/* ─── CVA ───────────────────────────────────────────────────────────────────── */

const textButtonVariants = cva(
  'group relative inline-flex items-center justify-center shrink-0 select-none outline-none transition-colors duration-fast ease-enter',
  {
    variants: {
      size: {
        xLarge: 'h-[var(--comp-textbutton-height-xl)] gap-[var(--comp-textbutton-gap)] typography-20-medium',
        large:  'h-[var(--comp-textbutton-height-lg)] gap-[var(--comp-textbutton-gap)] typography-18-medium',
        medium: 'h-[var(--comp-textbutton-height-md)] gap-[var(--comp-textbutton-gap)] typography-16-medium',
        small:  'h-[var(--comp-textbutton-height-sm)] gap-[var(--comp-textbutton-gap)] typography-14-medium',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

/* ─── Lookup maps ──────────────────────────────────────────────────────────── */

const iconSizeMap: Record<TextButtonSize, string> = {
  xLarge: 'size-[var(--comp-textbutton-icon-xl)]',
  large:  'size-[var(--comp-textbutton-icon-lg)]',
  medium: 'size-[var(--comp-textbutton-icon-md)]',
  small:  'size-[var(--comp-textbutton-icon-sm)]',
}

/** Color classes for intent × surface — default + hover + active */
const colorClassMap: Record<string, string> = {
  'systemic-bright': 'text-[var(--comp-textbutton-content-systemic)] hover:text-[var(--comp-textbutton-content-systemic-hover)] active:text-[var(--comp-textbutton-content-systemic-active)]',
  'systemic-dim':    'text-[var(--comp-textbutton-dim-content-systemic)] hover:text-[var(--comp-textbutton-dim-content-systemic-hover)] active:text-[var(--comp-textbutton-dim-content-systemic-active)]',
  'brand-bright':    'text-[var(--comp-textbutton-content-brand)] hover:text-[var(--comp-textbutton-content-brand-hover)] active:text-[var(--comp-textbutton-content-brand-active)]',
  'brand-dim':       'text-[var(--comp-textbutton-dim-content-brand)] hover:text-[var(--comp-textbutton-dim-content-brand-hover)] active:text-[var(--comp-textbutton-dim-content-brand-active)]',
}

/** Disabled color override per intent × surface */
const disabledClassMap: Record<string, string> = {
  'systemic-bright': 'text-[var(--comp-textbutton-content-systemic-disabled)]',
  'systemic-dim':    'text-[var(--comp-textbutton-dim-content-systemic-disabled)]',
  'brand-bright':    'text-[var(--comp-textbutton-content-brand-disabled)]',
  'brand-dim':       'text-[var(--comp-textbutton-dim-content-brand-disabled)]',
}

function getColorKey(intent: TextButtonIntent, surface: TextButtonSurface): string {
  return `${intent}-${surface}`
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

/**
 * Background-less text button with optional leading/trailing icons.
 * Used for lightweight actions within content areas, callouts, and inline contexts.
 */
export interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 색상 의도. systemic=중립 텍스트 색상, brand=테마 primary 색상.
   * @default 'systemic'
   * @see TEXTBUTTON_INTENTS
   */
  intent?: TextButtonIntent

  /**
   * 크기 variant. 높이, 타이포그래피, 아이콘 크기를 제어한다.
   * @default 'medium'
   * @see TEXTBUTTON_SIZES
   */
  size?: TextButtonSize

  /**
   * 배치 표면. bright=밝은 배경, dim=어두운 배경. 색상 토큰 세트를 결정한다.
   * @default 'bright'
   * @see TEXTBUTTON_SURFACES
   */
  surface?: TextButtonSurface

  /** 레이블 좌측 아이콘. 크기는 size variant에 의해 제어된다. */
  iconLeading?: React.ReactNode

  /** 레이블 우측 아이콘. 크기는 size variant에 의해 제어된다. */
  iconTrailing?: React.ReactNode

  /** 로딩 상태. 콘텐츠를 숨기고 중앙에 스피너를 표시한다. @default false */
  loading?: boolean

  /** Radix Slot으로 자식 요소에 스타일을 전달한다. @default false */
  asChild?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      intent = 'systemic',
      size = 'medium',
      surface = 'bright',
      iconLeading,
      iconTrailing,
      loading = false,
      disabled = false,
      asChild = false,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading
    const colorKey = getColorKey(intent, surface)

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (props.type ?? 'button')}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={isDisabled ? (e: React.MouseEvent) => e.preventDefault() : onClick}
        className={cn(
          textButtonVariants({ size }),
          /* Expanded interactable area via ::after pseudo-element */
          'after:content-[\'\'] after:absolute after:-inset-1',
          isDisabled && 'cursor-not-allowed',
          colorClassMap[colorKey],
          isDisabled && !loading && disabledClassMap[colorKey],
          loading && 'pointer-events-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--comp-textbutton-focus-border)] focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <Spinner className={cn(iconSizeMap[size], 'motion-essential')} />
          </span>
        )}

        {/* Content */}
        {iconLeading && (
          <span className={cn('relative flex-shrink-0', iconSizeMap[size], loading && 'invisible')}>
            {iconLeading}
          </span>
        )}
        {children != null && (
          <span className={cn('relative', loading && 'invisible')}>
            {children}
          </span>
        )}
        {iconTrailing && (
          <span className={cn('relative flex-shrink-0', iconSizeMap[size], loading && 'invisible')}>
            {iconTrailing}
          </span>
        )}
      </Comp>
    )
  },
)

TextButton.displayName = 'TextButton'
