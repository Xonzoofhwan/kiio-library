import React, { createContext, useContext, useState, Children, isValidElement, type ReactNode } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BadgeDot } from '@/components/Badge'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const SEGMENT_BAR_SIZES = ['small', 'medium', 'large', 'xLarge'] as const
export const SEGMENT_BAR_SHAPES = ['basic', 'circular', 'square'] as const

export type SegmentBarSize = (typeof SEGMENT_BAR_SIZES)[number]
export type SegmentBarShape = (typeof SEGMENT_BAR_SHAPES)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface SegmentBarContextValue {
  size: SegmentBarSize
  shape: SegmentBarShape
  fullWidth: boolean
}

const SegmentBarContext = createContext<SegmentBarContextValue>({
  size: 'medium',
  shape: 'basic',
  fullWidth: true,
})

/* ─── CVA — Container ─────────────────────────────────────────────────────── */

const segmentBarVariants = cva(
  'inline-flex items-center overflow-clip bg-[var(--comp-segment-bar-bg)]',
  {
    variants: {
      size: {
        small: 'p-[var(--comp-segment-bar-padding-sm)]',
        medium: 'p-[var(--comp-segment-bar-padding-md)]',
        large: 'p-[var(--comp-segment-bar-padding-lg)]',
        xLarge: 'p-[var(--comp-segment-bar-padding-xl)]',
      },
      shape: {
        basic: '',
        circular: 'rounded-full',
        square: 'rounded-none',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    compoundVariants: [
      { shape: 'basic', size: 'small', className: 'rounded-[var(--comp-segment-bar-radius-sm)]' },
      { shape: 'basic', size: 'medium', className: 'rounded-[var(--comp-segment-bar-radius-md)]' },
      { shape: 'basic', size: 'large', className: 'rounded-[var(--comp-segment-bar-radius-lg)]' },
      { shape: 'basic', size: 'xLarge', className: 'rounded-[var(--comp-segment-bar-radius-xl)]' },
    ],
    defaultVariants: {
      size: 'medium',
      shape: 'basic',
      fullWidth: true,
    },
  },
)

/* ─── CVA — Item ──────────────────────────────────────────────────────────── */

const segmentItemVariants = cva(
  [
    'group relative inline-flex items-center justify-center cursor-pointer select-none',
    'outline-none will-change-transform [transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-out)] active:[transition:color_var(--semantic-duration-fast)_var(--semantic-easing-enter),var(--comp-scale-press-transition-in)] active:scale-[var(--comp-segment-item-scale-pressed)]',
    'border border-transparent',
    'text-[var(--comp-segment-item-text-default)]',
    'data-[state=on]:bg-[var(--comp-segment-item-bg-active)]',
    'data-[state=on]:border-[var(--comp-segment-item-border-active)]',
    'data-[state=on]:text-[var(--comp-segment-item-text-active)]',
  ],
  {
    variants: {
      size: {
        small: 'h-[var(--comp-segment-item-height-sm)] typography-12-medium data-[state=on]:shadow-[0px_1px_2px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.08)]',
        medium: 'h-[var(--comp-segment-item-height-md)] typography-14-medium data-[state=on]:shadow-[0px_1px_2px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.08)]',
        large: 'h-[var(--comp-segment-item-height-lg)] typography-16-medium data-[state=on]:shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.08)]',
        xLarge: 'h-[var(--comp-segment-item-height-xl)] typography-18-medium data-[state=on]:shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.08)]',
      },
      shape: {
        basic: '',
        circular: 'rounded-full',
        square: 'rounded-none',
      },
      fullWidth: {
        true: 'flex-1 min-w-0 active:scale-[var(--comp-segment-item-scale-pressed-fill)]',
        false: 'shrink-0',
      },
    },
    compoundVariants: [
      { shape: 'basic', size: 'small', className: 'rounded-[var(--comp-segment-item-radius-sm)]' },
      { shape: 'basic', size: 'medium', className: 'rounded-[var(--comp-segment-item-radius-md)]' },
      { shape: 'basic', size: 'large', className: 'rounded-[var(--comp-segment-item-radius-lg)]' },
      { shape: 'basic', size: 'xLarge', className: 'rounded-[var(--comp-segment-item-radius-xl)]' },
    ],
    defaultVariants: {
      size: 'medium',
      shape: 'basic',
      fullWidth: true,
    },
  },
)

/* ─── Helper maps ─────────────────────────────────────────────────────────── */

const pxFillMap: Record<SegmentBarSize, string> = {
  small: 'px-[var(--comp-segment-item-px-fill-sm)]',
  medium: 'px-[var(--comp-segment-item-px-fill-md)]',
  large: 'px-[var(--comp-segment-item-px-fill-lg)]',
  xLarge: 'px-[var(--comp-segment-item-px-fill-xl)]',
}

const pxHugMap: Record<SegmentBarSize, string> = {
  small: 'px-[var(--comp-segment-item-px-hug-sm)]',
  medium: 'px-[var(--comp-segment-item-px-hug-md)]',
  large: 'px-[var(--comp-segment-item-px-fill-lg)]',
  xLarge: 'px-[var(--comp-segment-item-px-fill-xl)]',
}

const iconSizeMap: Record<string, string> = {
  small: 'size-[var(--comp-segment-item-icon-sm)]',
  medium: 'size-[var(--comp-segment-item-icon-md)]',
}

const iconFontSizeMap: Record<string, React.CSSProperties> = {
  small: { fontSize: 16 },
  medium: { fontSize: 18 },
}

/* Text wrapper inner padding per size */
const textWrapperPxMap: Record<SegmentBarSize, string> = {
  small: 'px-1',
  medium: 'px-1.5',
  large: 'px-3',
  xLarge: 'px-3',
}

/* Badge dot size per segment size (Figma: 4px for sm/md, 8px for lg/xl) */
const badgeDotSizeMap: Record<SegmentBarSize, 4 | 8> = {
  small: 4,
  medium: 4,
  large: 8,
  xLarge: 8,
}

/* Badge dot position per segment size (absolute inside text wrapper) */
const badgePositionMap: Record<SegmentBarSize, string> = {
  small: 'right-0 top-0',
  medium: 'right-0 top-[2px]',
  large: 'right-[4px] top-0',
  xLarge: 'right-[4px] top-[2px]',
}

/* Divider height per size (Figma: 20px for sm, proportional for others) */
const dividerHeightMap: Record<SegmentBarSize, string> = {
  small: 'h-5',
  medium: 'h-6',
  large: 'h-7',
  xLarge: 'h-8',
}

/* ─── SegmentBar (Root) ───────────────────────────────────────────────────── */

export interface SegmentBarProps {
  /** Size variant.
   * @default 'medium'
   * @see {@link SEGMENT_BAR_SIZES} */
  size?: SegmentBarSize
  /** Border-radius shape.
   * @default 'basic'
   * @see {@link SEGMENT_BAR_SHAPES} */
  shape?: SegmentBarShape
  /** Whether items fill container equally. Large/xLarge always true.
   * @default true */
  fullWidth?: boolean
  /** Controlled active item value. */
  value?: string
  /** Default active item for uncontrolled mode. */
  defaultValue?: string
  /** Callback fired when the active item changes. */
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

function SegmentBarRoot({
  size = 'medium',
  shape = 'basic',
  fullWidth: fullWidthProp = true,
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  className,
}: SegmentBarProps) {
  const fullWidth = size === 'large' || size === 'xLarge' ? true : fullWidthProp
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const activeValue = isControlled ? valueProp : internalValue

  const handleValueChange = (v: string) => {
    if (!v) return
    if (!isControlled) setInternalValue(v)
    onValueChange?.(v)
  }

  /* Collect item values from children to determine divider visibility */
  const itemValues: string[] = []
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === SegmentBarItem) {
      itemValues.push((child.props as SegmentBarItemProps).value)
    }
  })
  const activeIndex = itemValues.indexOf(activeValue)

  /* Interleave items with dividers */
  const items: ReactNode[] = []
  let itemIndex = 0
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== SegmentBarItem) {
      items.push(child)
      return
    }

    if (itemIndex > 0) {
      const isAdjacentToActive =
        itemIndex === activeIndex || itemIndex - 1 === activeIndex
      items.push(
        <span
          key={`divider-${itemIndex}`}
          aria-hidden
          className={cn(
            'shrink-0 w-px rounded-[1px] transition-[background-color] duration-fast ease-enter',
            dividerHeightMap[size],
            isAdjacentToActive
              ? 'bg-transparent'
              : 'bg-[var(--comp-segment-bar-bg-divider)]',
          )}
        />,
      )
    }

    items.push(child)
    itemIndex++
  })

  return (
    <SegmentBarContext.Provider value={{ size, shape, fullWidth }}>
      <ToggleGroup.Root
        type="single"
        value={activeValue}
        onValueChange={handleValueChange}
        className={cn(segmentBarVariants({ size, shape, fullWidth }), className)}
      >
        {items}
      </ToggleGroup.Root>
    </SegmentBarContext.Provider>
  )
}

/* ─── SegmentBar.Item ─────────────────────────────────────────────────────── */

export interface SegmentBarItemProps {
  /** Unique value identifying this item. */
  value: string
  /** Leading icon. Only rendered for small/medium sizes.  */
  icon?: ReactNode
  /** Show red BadgeDot indicator. Size 4px (sm/md) or 8px (lg/xl).
   * @default false */
  badge?: boolean
  /** Disable this item.
   * @default false */
  disabled?: boolean
  children: ReactNode
  className?: string
}

function SegmentBarItem({
  value,
  icon,
  badge,
  disabled,
  children,
  className,
}: SegmentBarItemProps) {
  const { size, shape, fullWidth } = useContext(SegmentBarContext)
  const showIcon = (size === 'small' || size === 'medium') && !!icon

  return (
    <ToggleGroup.Item
      value={value}
      disabled={disabled}
      className={cn(
        segmentItemVariants({ size, shape, fullWidth }),
        fullWidth ? pxFillMap[size] : pxHugMap[size],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {/* Focus ring */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute border-2 border-[var(--comp-segment-item-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          'group-focus-visible:opacity-100',
          'inset-0 group-data-[state=on]:inset-[-1px]',
          shape === 'circular' && 'rounded-full',
          shape === 'square' && 'rounded-none',
          shape === 'basic' && [
            size === 'small' && 'rounded-[var(--comp-segment-item-radius-sm)]',
            size === 'medium' && 'rounded-[var(--comp-segment-item-radius-md)]',
            size === 'large' && 'rounded-[var(--comp-segment-item-radius-lg)]',
            size === 'xLarge' && 'rounded-[var(--comp-segment-item-radius-xl)]',
          ],
        )}
      />

      {/* State overlay (inactive only) */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-fast ease-enter',
          'group-data-[state=on]:hidden',
          'group-hover:bg-[var(--comp-segment-item-hover)]',
          'group-active:bg-[var(--comp-segment-item-pressed)]',
        )}
      />

      {/* Content */}
      <span className="relative z-[1] inline-flex items-center justify-center gap-1">
        {showIcon && (
          <span
            className={cn('flex-shrink-0', iconSizeMap[size], '[&>*]:[font-size:inherit]')}
            style={iconFontSizeMap[size]}
          >
            {icon}
          </span>
        )}
        <span className={cn('relative', textWrapperPxMap[size])}>
          {children}
          {badge && (
            <BadgeDot
              size={badgeDotSizeMap[size]}
              color="red"
              className={cn('absolute', badgePositionMap[size])}
            />
          )}
        </span>
      </span>
    </ToggleGroup.Item>
  )
}

/* ─── Compound export ─────────────────────────────────────────────────────── */

export const SegmentBar = Object.assign(SegmentBarRoot, {
  Item: SegmentBarItem,
})
