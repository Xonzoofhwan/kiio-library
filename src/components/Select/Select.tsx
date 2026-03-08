import { useId } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variant metadata ─── */

export const SELECT_SIZES = ['xLarge', 'large', 'medium', 'small'] as const
export const SELECT_VALIDATIONS = ['default', 'error'] as const
export const SELECT_LABEL_TYPES = ['none', 'optional', 'asterisk'] as const

export type SelectSize = (typeof SELECT_SIZES)[number]
export type SelectValidation = (typeof SELECT_VALIDATIONS)[number]
export type SelectLabelType = (typeof SELECT_LABEL_TYPES)[number]

/* ─── CVA: trigger container ─── */

const triggerVariants = cva(
  'group relative flex items-center w-full overflow-hidden transition-colors duration-fast ease-enter cursor-pointer',
  {
    variants: {
      size: {
        xLarge:
          'h-[var(--comp-select-height-xl)] px-[var(--comp-select-px-xl)] gap-[var(--comp-select-gap-xl)] rounded-[var(--comp-select-radius-xl)] typography-18-regular',
        large:
          'h-[var(--comp-select-height-lg)] px-[var(--comp-select-px-lg)] gap-[var(--comp-select-gap-lg)] rounded-[var(--comp-select-radius-lg)] typography-16-regular',
        medium:
          'h-[var(--comp-select-height-md)] px-[var(--comp-select-px-md)] gap-[var(--comp-select-gap-md)] rounded-[var(--comp-select-radius-md)] typography-16-regular',
        small:
          'h-[var(--comp-select-height-sm)] px-[var(--comp-select-px-sm)] gap-[var(--comp-select-gap-sm)] rounded-[var(--comp-select-radius-sm)] typography-14-regular',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

/* ─── Icon size map ─── */

const iconSizeMap = {
  xLarge: 'size-[var(--comp-select-icon-xl)]',
  large: 'size-[var(--comp-select-icon-lg)]',
  medium: 'size-[var(--comp-select-icon-md)]',
  small: 'size-[var(--comp-select-icon-sm)]',
} as const

/* ─── Chevron icon ─── */

function ChevronIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-full', className)}
      {...props}
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Check icon (for selected item) ─── */

function CheckIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <path
        d="M13 4L6 11L3 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Helper text icon ─── */

function HelperIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4 shrink-0', className)}
      {...props}
    >
      <path
        d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM7.5 5.5C7.5 5.22386 7.72386 5 8 5C8.27614 5 8.5 5.22386 8.5 5.5V8.5C8.5 8.77614 8.27614 9 8 9C7.72386 9 7.5 8.77614 7.5 8.5V5.5ZM8 11C7.58579 11 7.25 10.6642 7.25 10.25C7.25 9.83579 7.58579 9.5 8 9.5C8.41421 9.5 8.75 9.83579 8.75 10.25C8.75 10.6642 8.41421 11 8 11Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ─── SelectRoot ─── */

export interface SelectRootProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  name?: string
  children: React.ReactNode
}

export function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  name,
  children,
}: SelectRootProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      {children}
    </SelectPrimitive.Root>
  )
}

/* ─── SelectTrigger ─── */

export interface SelectTriggerProps extends VariantProps<typeof triggerVariants> {
  /**
   * 크기 variant.
   * @default 'medium'
   * @see SELECT_SIZES
   */
  size?: SelectSize

  /**
   * 유효성 검사 상태.
   * @default 'default'
   * @see SELECT_VALIDATIONS
   */
  validation?: SelectValidation

  /**
   * placeholder 텍스트.
   * @default 'Select...'
   */
  placeholder?: string

  /**
   * 트리거 위에 표시되는 라벨.
   * @default undefined
   */
  label?: string

  /**
   * 라벨 접미사 유형.
   * @default 'none'
   * @see SELECT_LABEL_TYPES
   */
  labelType?: SelectLabelType

  /**
   * 도움 텍스트.
   * @default undefined
   */
  helperText?: string

  /**
   * 너비 모드.
   * @default false
   */
  fullWidth?: boolean

  /**
   * 추가 className.
   */
  className?: string

  /**
   * 컴포넌트 ID.
   */
  id?: string
}

export function SelectTrigger({
  size = 'medium',
  validation = 'default',
  placeholder = 'Select...',
  label,
  labelType = 'none',
  helperText,
  fullWidth = false,
  className,
  id: idProp,
}: SelectTriggerProps) {
  const autoId = useId()
  const triggerId = idProp ?? autoId
  const helperId = `${triggerId}-helper`
  const resolvedSize = size ?? 'medium'

  return (
    <div className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-fit', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={triggerId}
          className="flex items-center pb-[var(--spacing-2)] typography-14-semibold text-[var(--comp-input-label-color)]"
        >
          {label}
          {labelType === 'optional' && (
            <span className="ml-1 typography-14-regular text-[var(--comp-input-label-optional)]">
              (Optional)
            </span>
          )}
          {labelType === 'asterisk' && (
            <span className="ml-0.5 typography-14-semibold text-[var(--comp-input-label-asterisk)]">
              *
            </span>
          )}
        </label>
      )}

      {/* Trigger + Helptext */}
      <div className="flex flex-col gap-[var(--spacing-1\.5)]">
        <SelectPrimitive.Trigger
          id={triggerId}
          aria-describedby={helperText ? helperId : undefined}
          className={cn(
            triggerVariants({ size }),
            'outline-none',
            // Background
            'data-[state=open]:bg-[var(--comp-select-bg-open)]',
            'data-[disabled]:bg-[var(--comp-select-bg-disabled)] data-[disabled]:cursor-not-allowed',
            'data-[state=closed]:bg-[var(--comp-select-bg-default)]',
            // Focus ring (closed state only)
            'focus-visible:bg-[var(--comp-select-bg-open)]',
          )}
        >
          {/* Open/focus border layer */}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
              // Open state border
              'group-data-[state=open]:border-2',
              validation === 'error'
                ? 'group-data-[state=open]:border-[var(--comp-select-border-error)]'
                : 'group-data-[state=open]:border-[var(--comp-select-border-open)]',
              // Focus-visible border (when closed)
              'group-focus-visible:border-2',
              validation === 'error'
                ? 'group-focus-visible:border-[var(--comp-select-border-error)]'
                : 'group-focus-visible:border-[var(--comp-select-border-open)]',
            )}
          />

          {/* Hover overlay (closed state only) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter group-data-[state=closed]:group-hover:bg-[var(--comp-select-hover-overlay)]"
          />

          {/* Value / Placeholder */}
          <span className="relative flex-1 min-w-0 text-left truncate">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>

          {/* Chevron */}
          <span
            className={cn(
              'relative flex-shrink-0 transition-transform duration-fast ease-enter',
              iconSizeMap[resolvedSize],
              'group-data-[state=open]:rotate-180',
              'group-data-[disabled]:text-[var(--comp-select-chevron-disabled)]',
              'text-[var(--comp-select-chevron-color)]',
            )}
          >
            <SelectPrimitive.Icon asChild>
              <ChevronIcon />
            </SelectPrimitive.Icon>
          </span>
        </SelectPrimitive.Trigger>

        {/* Helper text */}
        {helperText && (
          <div
            id={helperId}
            className={cn(
              'flex items-center gap-[var(--spacing-0\\.5)]',
              validation === 'error'
                ? 'text-[var(--comp-input-helper-error-color)]'
                : 'text-[var(--comp-input-helper-color)]',
            )}
          >
            <HelperIcon
              className={cn(
                validation === 'error'
                  ? 'text-[var(--comp-input-helper-error-icon)]'
                  : 'text-[var(--comp-input-helper-icon)]',
              )}
            />
            <span className="typography-13-regular">{helperText}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── SelectContent ─── */

export interface SelectContentProps {
  children: React.ReactNode
  className?: string
  position?: 'popper' | 'item-aligned'
  side?: 'top' | 'bottom'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}

export function SelectContent({
  children,
  className,
  position = 'popper',
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'z-50 overflow-hidden p-1.5 max-h-80',
          'bg-[var(--comp-select-content-bg)] border border-[var(--comp-select-content-border)] rounded-[var(--comp-select-content-radius)] shadow-lg',
          // Animation
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          // Match trigger width when using popper
          position === 'popper' && 'w-[var(--radix-select-trigger-width)]',
          className,
        )}
      >
        <SelectPrimitive.Viewport>
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/* ─── SelectItem ─── */

export interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function SelectItem({
  value,
  children,
  disabled,
  className,
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        'relative flex items-center h-10 px-3 pr-8 rounded-[var(--comp-select-item-radius)] typography-14-regular outline-none select-none cursor-pointer',
        'text-[var(--comp-select-item-text)]',
        'data-[highlighted]:bg-[var(--comp-select-item-bg-highlighted)]',
        'data-[state=checked]:bg-[var(--comp-select-item-bg-selected)] data-[state=checked]:text-[var(--comp-select-item-text-selected)]',
        'data-[disabled]:text-[var(--comp-select-item-text-disabled)] data-[disabled]:cursor-not-allowed',
        'transition-colors duration-fast ease-enter',
        className,
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <CheckIcon className="text-[var(--comp-select-item-check-color)]" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

/* ─── SelectSeparator ─── */

export function SelectSeparator({ className }: { className?: string }) {
  return (
    <SelectPrimitive.Separator
      className={cn('h-px my-1 bg-[var(--comp-select-content-border)]', className)}
    />
  )
}

/* ─── Convenience namespace export ─── */

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Separator: SelectSeparator,
}
