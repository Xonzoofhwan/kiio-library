import { forwardRef, createContext, useContext, Children, isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const STEPPER_SIZES = ['small', 'medium', 'large'] as const
export const STEPPER_ORIENTATIONS = ['horizontal', 'vertical'] as const
export const STEPPER_VARIANTS = ['numbered', 'dot'] as const

export type StepperSize = (typeof STEPPER_SIZES)[number]
export type StepperOrientation = (typeof STEPPER_ORIENTATIONS)[number]
export type StepperVariant = (typeof STEPPER_VARIANTS)[number]

type StepStatus = 'completed' | 'current' | 'upcoming' | 'error'

/* ─── Size maps ────────────────────────────────────────────────────────────── */

const sizeAbbr: Record<StepperSize, string> = { small: 'sm', medium: 'md', large: 'lg' }

const labelTypography: Record<StepperSize, string> = {
  small:  'typography-13-medium',
  medium: 'typography-14-medium',
  large:  'typography-16-medium',
}

const descriptionTypography: Record<StepperSize, string> = {
  small:  'typography-12-regular',
  medium: 'typography-13-regular',
  large:  'typography-14-regular',
}

const indicatorTypography: Record<StepperSize, string> = {
  small:  'typography-12-semibold',
  medium: 'typography-13-semibold',
  large:  'typography-14-semibold',
}

/* ─── Icons ────────────────────────────────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface StepperContextValue {
  currentStep: number
  size: StepperSize
  orientation: StepperOrientation
  variant: StepperVariant
  navigable: boolean
  onStepClick?: (index: number) => void
  totalSteps: number
}

const StepperContext = createContext<StepperContextValue>({
  currentStep: 0,
  size: 'medium',
  orientation: 'horizontal',
  variant: 'numbered',
  navigable: false,
  totalSteps: 0,
})

/* ─── Stepper (Root) ───────────────────────────────────────────────────────── */

export interface StepperProps {
  /** 0-based 현재 스텝 인덱스. */
  currentStep: number
  /** 크기. @default 'medium' @see {@link STEPPER_SIZES} */
  size?: StepperSize
  /** 배치 방향. @default 'horizontal' @see {@link STEPPER_ORIENTATIONS} */
  orientation?: StepperOrientation
  /** 인디케이터 형태. @default 'numbered' @see {@link STEPPER_VARIANTS} */
  variant?: StepperVariant
  /** 완료 스텝 클릭 이동 on/off. @default false */
  navigable?: boolean
  /** navigable 시 스텝 클릭 콜백. */
  onStepClick?: (index: number) => void
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      currentStep,
      size = 'medium',
      orientation = 'horizontal',
      variant = 'numbered',
      navigable = false,
      onStepClick,
      className,
      children,
    },
    ref,
  ) => {
    const items = Children.toArray(children).filter(isValidElement)
    const totalSteps = items.length

    return (
      <StepperContext.Provider
        value={{ currentStep, size, orientation, variant, navigable, onStepClick, totalSteps }}
      >
        <div
          ref={ref}
          role="list"
          aria-label="Progress"
          className={cn(
            'flex',
            orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col',
            className,
          )}
        >
          {items.map((child, index) => {
            if (!isValidElement(child)) return child
            return cloneElement(child as ReactElement<StepItemProps>, {
              key: child.key ?? index,
              __index: index,
            })
          })}
        </div>
      </StepperContext.Provider>
    )
  },
)

Stepper.displayName = 'Stepper'

/* ─── StepItem ─────────────────────────────────────────────────────────────── */

export interface StepItemProps {
  /** 스텝 라벨. */
  label: string
  /** 보조 설명. */
  description?: string
  /** 수동 상태 override. null이면 currentStep 기준 자동. */
  status?: StepStatus
  /** 커스텀 아이콘. */
  icon?: ReactNode
  /** 추가 CSS 클래스 */
  className?: string
  /** @internal — injected by Stepper */
  __index?: number
}

export const StepItem = forwardRef<HTMLDivElement, StepItemProps>(
  ({ label, description, status: statusProp, icon, className, __index = 0 }, ref) => {
    const { currentStep, size, orientation, variant, navigable, onStepClick, totalSteps } = useContext(StepperContext)
    const abbr = sizeAbbr[size]
    const isLast = __index === totalSteps - 1

    /* Auto status */
    const status: StepStatus =
      statusProp ??
      (__index < currentStep ? 'completed' : __index === currentStep ? 'current' : 'upcoming')

    const isClickable = navigable && status === 'completed'

    /* ─── Indicator content ─── */
    const iconSize = size === 'small' ? 'w-3 h-3' : size === 'medium' ? 'w-3.5 h-3.5' : 'w-4 h-4'

    let indicatorContent: ReactNode
    if (icon) {
      indicatorContent = icon
    } else if (status === 'completed') {
      indicatorContent = <CheckIcon className={iconSize} />
    } else if (status === 'error') {
      indicatorContent = <XIcon className={iconSize} />
    } else if (variant === 'dot') {
      indicatorContent = (
        <div className={cn('rounded-full', `w-[var(--comp-stepper-dot-${abbr})] h-[var(--comp-stepper-dot-${abbr})]`, status === 'current' ? 'bg-[var(--comp-stepper-current-content)]' : 'bg-[var(--comp-stepper-upcoming-content)]')} />
      )
    } else {
      /* numbered */
      indicatorContent = <span className={indicatorTypography[size]}>{__index + 1}</span>
    }

    /* ─── Indicator circle classes ─── */
    const indicatorClasses = cn(
      'shrink-0 rounded-full flex items-center justify-center',
      `w-[var(--comp-stepper-indicator-${abbr})] h-[var(--comp-stepper-indicator-${abbr})]`,
      'transition-colors duration-fast ease-enter',
      status === 'completed' && 'bg-[var(--comp-stepper-completed-bg)] text-[var(--comp-stepper-completed-content)]',
      status === 'current' && 'border-2 border-[var(--comp-stepper-current-border)] bg-transparent text-[var(--comp-stepper-current-content)]',
      status === 'upcoming' && 'bg-[var(--comp-stepper-upcoming-bg)] text-[var(--comp-stepper-upcoming-content)]',
      status === 'error' && 'bg-[var(--comp-stepper-error-bg)] text-[var(--comp-stepper-error-content)]',
      isClickable && 'cursor-pointer hover:opacity-80',
      isClickable && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-stepper-focus-ring)] focus-visible:ring-offset-2',
    )

    const handleClick = () => {
      if (isClickable) onStepClick?.(__index)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onStepClick?.(__index)
      }
    }

    /* ─── Connector ─── */
    const connector = !isLast && (
      <div
        className={cn(
          orientation === 'horizontal'
            ? `flex-1 h-[var(--comp-stepper-connector-width)] mx-[var(--comp-stepper-connector-gap)] self-center`
            : `w-[var(--comp-stepper-connector-width)] flex-1 my-[var(--comp-stepper-connector-gap)]`,
          status === 'completed'
            ? 'bg-[var(--comp-stepper-connector-active)]'
            : 'bg-[var(--comp-stepper-connector-inactive)]',
        )}
      />
    )

    /* ─── Horizontal layout ─── */
    if (orientation === 'horizontal') {
      return (
        <div
          ref={ref}
          role="listitem"
          className={cn(
            'flex items-center',
            !isLast && 'flex-1',
            className,
          )}
        >
          {/* Step: indicator + label column */}
          <div className="flex flex-col items-center">
            <div
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className={indicatorClasses}
            >
              {indicatorContent}
            </div>
            {/* Label + description below */}
            <div className={cn('flex flex-col items-center text-center', `mt-[var(--comp-stepper-gap-${abbr})]`)}>
              <span className={cn(
                labelTypography[size],
                (status === 'upcoming') ? 'text-[var(--comp-stepper-label-upcoming)]' : 'text-[var(--comp-stepper-label)]',
              )}>
                {label}
              </span>
              {description && (
                <span className={cn(
                  descriptionTypography[size],
                  (status === 'upcoming') ? 'text-[var(--comp-stepper-label-upcoming)]' : 'text-[var(--comp-stepper-description)]',
                )}>
                  {description}
                </span>
              )}
            </div>
          </div>
          {/* Connector */}
          {connector}
        </div>
      )
    }

    /* ─── Vertical layout ─── */
    return (
      <div
        ref={ref}
        role="listitem"
        className={cn('flex', className)}
      >
        {/* Left: indicator + connector column */}
        <div className="flex flex-col items-center">
          <div
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={indicatorClasses}
          >
            {indicatorContent}
          </div>
          {!isLast && (
            <div
              className={cn(
                'w-[var(--comp-stepper-connector-width)] flex-1 my-[var(--comp-stepper-connector-gap)]',
                'min-h-[var(--comp-stepper-connector-min-h)]',
                status === 'completed'
                  ? 'bg-[var(--comp-stepper-connector-active)]'
                  : 'bg-[var(--comp-stepper-connector-inactive)]',
              )}
            />
          )}
        </div>
        {/* Right: label + description */}
        <div className={cn('flex flex-col', `ml-[var(--comp-stepper-gap-${abbr})]`, 'pt-px')}>
          <span className={cn(
            labelTypography[size],
            (status === 'upcoming') ? 'text-[var(--comp-stepper-label-upcoming)]' : 'text-[var(--comp-stepper-label)]',
          )}>
            {label}
          </span>
          {description && (
            <span className={cn(
              descriptionTypography[size],
              (status === 'upcoming') ? 'text-[var(--comp-stepper-label-upcoming)]' : 'text-[var(--comp-stepper-description)]',
              'mb-2',
            )}>
              {description}
            </span>
          )}
        </div>
      </div>
    )
  },
)

StepItem.displayName = 'StepItem'
