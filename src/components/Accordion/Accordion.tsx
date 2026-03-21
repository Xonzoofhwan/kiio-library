import { forwardRef, createContext, useContext, type ReactNode } from 'react'
import * as RadixAccordion from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const ACCORDION_TYPES = ['single', 'multiple'] as const
export const ACCORDION_VARIANTS = ['default', 'outlined', 'separated'] as const
export const ACCORDION_SIZES = ['small', 'medium', 'large'] as const

export type AccordionType = (typeof ACCORDION_TYPES)[number]
export type AccordionVariant = (typeof ACCORDION_VARIANTS)[number]
export type AccordionSize = (typeof ACCORDION_SIZES)[number]

/* ─── Size maps ────────────────────────────────────────────────────────────── */

const sizeAbbr: Record<AccordionSize, string> = { small: 'sm', medium: 'md', large: 'lg' }

const triggerTypography: Record<AccordionSize, string> = {
  small:  'typography-14-medium',
  medium: 'typography-15-medium',
  large:  'typography-16-medium',
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface AccordionContextValue {
  variant: AccordionVariant
  size: AccordionSize
}

const AccordionContext = createContext<AccordionContextValue>({
  variant: 'default',
  size: 'medium',
})

/* ─── Chevron icon ─────────────────────────────────────────────────────────── */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/* ─── Accordion (Root) ─────────────────────────────────────────────────────── */

type AccordionSingleProps = {
  type?: 'single'
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  collapsible?: boolean
}

type AccordionMultipleProps = {
  type: 'multiple'
  value?: string[]
  onValueChange?: (value: string[]) => void
  defaultValue?: string[]
}

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  /** 시각적 스타일. @default 'default' @see {@link ACCORDION_VARIANTS} */
  variant?: AccordionVariant
  /** 크기. @default 'medium' @see {@link ACCORDION_SIZES} */
  size?: AccordionSize
  /** 비활성. @default false */
  disabled?: boolean
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      className,
      ...props
    },
    ref,
  ) => {
    const rootClassName = cn(
      variant === 'outlined' && 'border border-[var(--comp-accordion-border)] rounded-[var(--comp-accordion-radius)] overflow-hidden',
      variant === 'separated' && 'flex flex-col gap-[var(--comp-accordion-separated-gap)]',
      className,
    )

    if (props.type === 'multiple') {
      const { type: _, variant: _v, size: _s, className: _c, ...rest } = props as AccordionMultipleProps & { variant?: AccordionVariant; size?: AccordionSize; className?: string; children: ReactNode; disabled?: boolean }
      return (
        <AccordionContext.Provider value={{ variant, size }}>
          <RadixAccordion.Root ref={ref} type="multiple" className={rootClassName} {...rest}>
            {props.children}
          </RadixAccordion.Root>
        </AccordionContext.Provider>
      )
    }

    const { type: _, variant: _v, size: _s, className: _c, ...rest } = props as AccordionSingleProps & { variant?: AccordionVariant; size?: AccordionSize; className?: string; children: ReactNode; disabled?: boolean }
    return (
      <AccordionContext.Provider value={{ variant, size }}>
        <RadixAccordion.Root ref={ref} type="single" collapsible={(props as AccordionSingleProps).collapsible ?? true} className={rootClassName} {...rest}>
          {props.children}
        </RadixAccordion.Root>
      </AccordionContext.Provider>
    )
  },
)

Accordion.displayName = 'Accordion'

/* ─── AccordionItem ────────────────────────────────────────────────────────── */

export interface AccordionItemProps {
  /** 항목 고유 식별자. 필수. */
  value: string
  /** 비활성. @default false */
  disabled?: boolean
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => {
    const { variant } = useContext(AccordionContext)

    return (
      <RadixAccordion.Item
        ref={ref}
        className={cn(
          /* default & outlined: border-bottom between items */
          (variant === 'default' || variant === 'outlined') &&
            'border-b border-[var(--comp-accordion-border)] last:border-b-0',
          /* separated: individual card */
          variant === 'separated' &&
            'border border-[var(--comp-accordion-border)] rounded-[var(--comp-accordion-radius)] overflow-hidden',
          className,
        )}
        {...props}
      />
    )
  },
)

AccordionItem.displayName = 'AccordionItem'

/* ─── AccordionTrigger ─────────────────────────────────────────────────────── */

export interface AccordionTriggerProps {
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children }, ref) => {
    const { size } = useContext(AccordionContext)
    const abbr = sizeAbbr[size]

    return (
      <RadixAccordion.Header className="flex">
        <RadixAccordion.Trigger
          ref={ref}
          className={cn(
            'group flex flex-1 items-center justify-between',
            'text-left',
            triggerTypography[size],
            'text-[var(--comp-accordion-trigger-text)]',
            `py-[var(--comp-accordion-trigger-py-${abbr})]`,
            `px-[var(--comp-accordion-trigger-px-${abbr})]`,
            'transition-colors duration-fast ease-enter',
            'hover:bg-[var(--comp-accordion-trigger-hover)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--comp-accordion-focus-ring)] focus-visible:ring-inset',
            'disabled:text-[var(--comp-accordion-disabled-text)] disabled:hover:bg-transparent disabled:cursor-not-allowed',
            className,
          )}
        >
          {children}
          <ChevronDown
            className={cn(
              'shrink-0 text-[var(--comp-accordion-chevron)]',
              `w-[var(--comp-accordion-chevron-${abbr})] h-[var(--comp-accordion-chevron-${abbr})]`,
              'transition-transform duration-normal ease-move',
              'group-data-[state=open]:rotate-180',
              'group-disabled:hidden',
            )}
          />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
    )
  },
)

AccordionTrigger.displayName = 'AccordionTrigger'

/* ─── AccordionContent ─────────────────────────────────────────────────────── */

export interface AccordionContentProps {
  /** 추가 CSS 클래스 */
  className?: string
  children: ReactNode
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children }, ref) => {
    const { size } = useContext(AccordionContext)
    const abbr = sizeAbbr[size]

    return (
      <RadixAccordion.Content
        ref={ref}
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-accordion-down',
          'data-[state=closed]:animate-accordion-up',
        )}
      >
        <div
          className={cn(
            `px-[var(--comp-accordion-content-padding-${abbr})]`,
            `pb-[var(--comp-accordion-content-padding-${abbr})]`,
            'text-[var(--comp-accordion-content-text)]',
            className,
          )}
        >
          {children}
        </div>
      </RadixAccordion.Content>
    )
  },
)

AccordionContent.displayName = 'AccordionContent'
