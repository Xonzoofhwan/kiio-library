import { forwardRef, createContext, useContext, useRef, type RefObject } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { useAncestorTheme } from '@/hooks/useAncestorTheme'
import { useComposedRefs } from '@/lib/composeRefs'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TOOLTIP_VARIANTS = ['black', 'white'] as const
export const TOOLTIP_SIDES = ['top', 'bottom', 'left', 'right'] as const
export const TOOLTIP_ALIGNS = ['start', 'center', 'end'] as const
export const TOOLTIP_SIZES = ['large', 'medium'] as const
export const TOOLTIP_SHAPES = ['basic', 'square'] as const

export type TooltipVariant = (typeof TOOLTIP_VARIANTS)[number]
export type TooltipSide = (typeof TOOLTIP_SIDES)[number]
export type TooltipAlign = (typeof TOOLTIP_ALIGNS)[number]
export type TooltipSize = (typeof TOOLTIP_SIZES)[number]
export type TooltipShape = (typeof TOOLTIP_SHAPES)[number]

/* ─── Variant style maps ──────────────────────────────────────────────────── */

const variantMap: Record<TooltipVariant, string> = {
  black: 'bg-[var(--comp-tooltip-bg-black)] text-[var(--comp-tooltip-text-black)]',
  white: 'bg-[var(--comp-tooltip-bg-white)] text-[var(--comp-tooltip-text-white)]',
}

const typographyMap: Record<TooltipSize, string> = {
  large: 'typography-16-medium',
  medium: 'typography-14-medium',
}

const sizePaddingMap: Record<TooltipSize, string> = {
  large: 'px-[var(--comp-tooltip-px-lg)] py-[var(--comp-tooltip-py-lg)]',
  medium: 'px-[var(--comp-tooltip-px-md)] py-[var(--comp-tooltip-py-md)]',
}

const arrowColorMap: Record<TooltipVariant, string> = {
  black: 'fill-[var(--comp-tooltip-arrow-black)]',
  white: 'fill-[var(--comp-tooltip-arrow-white)]',
}

/* ─── Theme context ───────────────────────────────────────────────────────── */

interface TooltipThemeContextValue {
  triggerRef: React.RefObject<HTMLElement | null>
}

const TooltipThemeContext = createContext<TooltipThemeContextValue>({
  triggerRef: { current: null },
})

/* ─── TooltipProvider ─────────────────────────────────────────────────────── */

export interface TooltipProviderProps {
  /**
   * 툴팁 열림까지의 전역 지연 시간 (ms).
   * @default 700
   */
  delayDuration?: number
  /**
   * 빠르게 연속으로 툴팁을 열 때 적용되는 축약 지연 (ms).
   * @default 300
   */
  skipDelayDuration?: number
  /**
   * true면 Content에 마우스를 올려도 툴팁이 유지되지 않는다.
   * @default false
   */
  disableHoverableContent?: boolean
  children: React.ReactNode
}

export function TooltipProvider({
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  children,
}: TooltipProviderProps) {
  return (
    <RadixTooltip.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </RadixTooltip.Provider>
  )
}

/* ─── Tooltip (Root) ──────────────────────────────────────────────────────── */

export interface TooltipProps {
  /** 열림 상태 (controlled). */
  open?: boolean
  /** 기본 열림 상태 (uncontrolled). */
  defaultOpen?: boolean
  /** 열림/닫힘 콜백. */
  onOpenChange?: (open: boolean) => void
  /**
   * 이 인스턴스의 지연 시간 (ms). Provider 설정을 오버라이드한다.
   */
  delayDuration?: number
  /**
   * true면 Content에 마우스를 올려도 툴팁이 유지되지 않는다.
   */
  disableHoverableContent?: boolean
  children: React.ReactNode
}

function TooltipRoot({
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  children,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <TooltipThemeContext.Provider value={{ triggerRef }}>
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        {children}
      </RadixTooltip.Root>
    </TooltipThemeContext.Provider>
  )
}

/* ─── TooltipTrigger ──────────────────────────────────────────────────────── */

export interface TooltipTriggerProps {
  /**
   * asChild — 자식 요소에 trigger props를 전달한다.
   * @default true
   */
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild = true, children, className, ...props }, ref) => {
    const { triggerRef } = useContext(TooltipThemeContext)
    // 소비자 ref(객체든 함수든)와 컨텍스트의 triggerRef 를 한 callback ref 로 합쳐 **둘 다** 채운다.
    // 이전의 `ref ?? internalRef` 는 둘 중 하나만 채워, 소비자가 callback ref 를 주면 내부 ref 가
    // 비어 포털 콘텐츠가 조상 테마를 읽지 못했다(2026-09-13 실측). effect 없이 커밋 시점에 채워지므로
    // 콘텐츠의 useAncestorTheme 구독이 시작될 때 이미 요소가 있다.
    // triggerRef 는 요소 종류를 열어 둔 HTMLElement 타입이고 Radix Trigger 는 HTMLButtonElement 를
    // 요구한다 — 넓은 쪽을 좁혀 넘기는 캐스트다(asChild 로 다른 요소가 오면 실제로는 그 요소다).
    const composedRef = useComposedRefs<HTMLButtonElement>(
      ref,
      triggerRef as RefObject<HTMLButtonElement | null>,
    )

    return (
      <RadixTooltip.Trigger
        ref={composedRef}
        asChild={asChild}
        className={className}
        {...props}
      >
        {children}
      </RadixTooltip.Trigger>
    )
  },
)
TooltipTrigger.displayName = 'TooltipTrigger'

/* ─── TooltipContent ──────────────────────────────────────────────────────── */

export interface TooltipContentProps {
  /**
   * 시각적 variant. 배경, 텍스트, 화살표 색상을 결정한다.
   * @default 'black'
   * @see TOOLTIP_VARIANTS
   */
  variant?: TooltipVariant
  /**
   * 크기. 타이포그래피를 제어한다.
   * @default 'large'
   * @see TOOLTIP_SIZES
   */
  size?: TooltipSize
  /**
   * 배치 방향.
   * @default 'top'
   * @see TOOLTIP_SIDES
   */
  side?: TooltipSide
  /**
   * 정렬.
   * @default 'center'
   * @see TOOLTIP_ALIGNS
   */
  align?: TooltipAlign
  /**
   * 화살표 표시 여부.
   * @default true
   */
  hasArrow?: boolean
  /**
   * Border-radius shape.
   * @default 'basic'
   * @see TOOLTIP_SHAPES
   */
  shape?: TooltipShape
  /**
   * 그림자 표시 여부.
   * @default false
   */
  showShadow?: boolean
  /**
   * 트리거에서 간격 (px).
   * @default 8
   */
  sideOffset?: number
  /**
   * 뷰포트 가장자리 최소 간격 (px).
   * @default 8
   */
  collisionPadding?: number
  children: React.ReactNode
  className?: string
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      variant = 'black',
      size = 'large',
      shape = 'basic',
      side = 'top',
      align = 'center',
      hasArrow = true,
      showShadow = false,
      sideOffset = 8,
      collisionPadding = 8,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { triggerRef } = useContext(TooltipThemeContext)
    const theme = useAncestorTheme(triggerRef)

    return (
      <RadixTooltip.Portal>
        <div data-theme={theme} className="font-sans">
          <RadixTooltip.Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            className={cn(
              'z-50 max-w-[var(--comp-tooltip-max-width)]',
              sizePaddingMap[size],
              shape === 'basic' && 'rounded-[var(--comp-tooltip-radius)]',
              shape === 'square' && 'rounded-none',
              typographyMap[size],
              variantMap[variant],
              showShadow && '[box-shadow:var(--comp-tooltip-shadow)]',
              'data-[state=delayed-open]:animate-[tooltip-enter_var(--semantic-duration-fast)_var(--semantic-easing-enter)]',
              'data-[state=closed]:animate-[tooltip-exit_var(--semantic-duration-fast)_var(--semantic-easing-exit)_forwards]',
              className,
            )}
            {...props}
          >
            {children}
            {hasArrow && (
              <RadixTooltip.Arrow
                width={16}
                height={8}
                className={arrowColorMap[variant]}
              />
            )}
          </RadixTooltip.Content>
        </div>
      </RadixTooltip.Portal>
    )
  },
)
TooltipContent.displayName = 'TooltipContent'

/* ─── Compound export ─────────────────────────────────────────────────────── */

export const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
})
