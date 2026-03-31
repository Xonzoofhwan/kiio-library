import { createContext, useContext, type ReactNode } from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { BadgeDot } from '@/components/Badge'

/* ─── Variant metadata ─────────────────────────────────────────────────────── */

export const TAB_VARIANTS = ['circular', 'underlined'] as const
export const TAB_SIZES = ['large', 'small'] as const

export type TabVariant = (typeof TAB_VARIANTS)[number]
export type TabSize = (typeof TAB_SIZES)[number]

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface TabContextValue {
  variant: TabVariant
  size: TabSize
}

const TabContext = createContext<TabContextValue>({
  variant: 'circular',
  size: 'large',
})

/* ─── CVA — TabItem ────────────────────────────────────────────────────────── */

const tabItemVariants = cva(
  'group relative inline-flex items-center justify-center cursor-pointer select-none transition-colors duration-fast ease-enter',
  {
    variants: {
      variant: {
        circular: [
          'overflow-hidden rounded-full',
          'bg-[var(--comp-tab-bg-circular)] text-[var(--comp-tab-text-circular)]',
          'data-[state=active]:bg-[var(--comp-tab-bg-circular-active)] data-[state=active]:text-[var(--comp-tab-text-circular-active)]',
        ],
        underlined: [
          'flex-col',
          'text-[var(--comp-tab-text-underlined)]',
          'data-[state=active]:text-[var(--comp-tab-text-underlined-active)]',
        ],
      },
      size: {
        large: '',
        small: '',
      },
    },
    compoundVariants: [
      { variant: 'circular', size: 'large', className: 'h-[var(--comp-tab-height-lg)] px-[var(--comp-tab-px-lg)] typography-16-semibold' },
      { variant: 'circular', size: 'small', className: 'h-[var(--comp-tab-height-sm)] px-[var(--comp-tab-px-sm)] typography-14-semibold' },
      { variant: 'underlined', size: 'large', className: 'typography-17-semibold' },
      { variant: 'underlined', size: 'small', className: 'typography-17-semibold' },
    ],
    defaultVariants: {
      variant: 'circular',
      size: 'large',
    },
  },
)

/* ─── TabGroup (Root) ──────────────────────────────────────────────────────── */

export interface TabGroupProps {
  /** Style variant of the tab bar.
   * @default 'circular'
   * @see {@link TAB_VARIANTS} */
  variant?: TabVariant
  /** Size variant (only affects circular).
   * @default 'large'
   * @see {@link TAB_SIZES} */
  size?: TabSize
  /** Controlled active tab value. */
  value?: string
  /** Default active tab for uncontrolled mode. */
  defaultValue?: string
  /** Callback fired when the active tab changes. */
  onValueChange?: (value: string) => void
  /** How tabs are activated.
   * @default 'automatic' */
  activationMode?: 'automatic' | 'manual'
  children: ReactNode
  className?: string
}

function TabGroup({
  variant = 'circular',
  size = 'large',
  value,
  defaultValue,
  onValueChange,
  activationMode = 'automatic',
  children,
  className,
}: TabGroupProps) {
  return (
    <TabContext.Provider value={{ variant, size }}>
      <RadixTabs.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        activationMode={activationMode}
        className={className}
      >
        {children}
      </RadixTabs.Root>
    </TabContext.Provider>
  )
}

/* ─── TabList ──────────────────────────────────────────────────────────────── */

export interface TabListProps {
  children: ReactNode
  className?: string
}

function TabList({ children, className }: TabListProps) {
  const { variant } = useContext(TabContext)

  return (
    <RadixTabs.List
      className={cn(
        'flex items-center',
        variant === 'circular' && 'gap-[var(--comp-tab-list-gap-circular)]',
        variant === 'underlined' && 'gap-[var(--comp-tab-list-gap-underlined)] border-b border-[var(--comp-tab-list-border-underlined)]',
        className,
      )}
    >
      {children}
    </RadixTabs.List>
  )
}

/* ─── TabItem ──────────────────────────────────────────────────────────────── */

/* ─── Badge offset map ─────────────────────────────────────────────────────── */

const badgeOffsetMap: Record<TabSize, string> = {
  large: 'top-[var(--comp-tab-badge-offset-lg)] right-[var(--comp-tab-badge-offset-lg)]',
  small: 'top-[var(--comp-tab-badge-offset-sm)] right-[var(--comp-tab-badge-offset-sm)]',
}

/* ─── TabItem ──────────────────────────────────────────────────────────────── */

export interface TabItemProps {
  /** Unique value identifying this tab. Must match a TabPanel value. */
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
  /** Show badge dot indicator.
   * @default false */
  badge?: boolean
}

function TabItem({ value, children, className, disabled, badge }: TabItemProps) {
  const { variant, size } = useContext(TabContext)

  return (
    <RadixTabs.Trigger
      value={value}
      disabled={disabled}
      className={cn(
        tabItemVariants({ variant, size }),
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {/* Focus ring */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 border-2 border-[var(--comp-tab-focus-border)] opacity-0 transition-opacity duration-fast ease-enter',
          variant === 'circular' && 'rounded-full',
          'group-focus-visible:opacity-100',
        )}
      />

      {/* State overlay — circular inactive */}
      {variant === 'circular' && (
        <>
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter',
              'group-data-[state=active]:hidden',
              'group-hover:bg-[var(--comp-tab-hover-circular)]',
              'group-active:bg-[var(--comp-tab-pressed-circular)]',
            )}
          />
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full transition-colors duration-fast ease-enter',
              'hidden group-data-[state=active]:block',
              'group-hover:group-data-[state=active]:bg-[var(--comp-tab-hover-circular-active)]',
              'group-active:group-data-[state=active]:bg-[var(--comp-tab-pressed-circular-active)]',
            )}
          />
        </>
      )}

      {/* State overlay — underlined */}
      {variant === 'underlined' && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-colors duration-fast ease-enter',
            'group-hover:bg-[var(--comp-tab-hover-underlined)]',
            'group-active:bg-[var(--comp-tab-pressed-underlined)]',
          )}
        />
      )}

      {/* Content */}
      {variant === 'circular' && (
        <>
          <span className="relative z-[1]">{children}</span>
          {badge && (
            <BadgeDot
              size={8}
              color="red"
              className={cn('absolute z-[2]', badgeOffsetMap[size])}
            />
          )}
        </>
      )}

      {variant === 'underlined' && (
        <>
          <span className="relative z-[1] pt-[var(--comp-tab-underline-pt)] pb-[var(--comp-tab-underline-gap)]">
            {children}
            {badge && (
              <BadgeDot
                size={8}
                color="red"
                className="absolute z-[2] top-[var(--comp-tab-badge-top-underlined)] right-[var(--comp-tab-badge-right-underlined)]"
              />
            )}
          </span>
          {/* Bottom border indicator */}
          <span
            aria-hidden
            className={cn(
              'absolute bottom-0 left-0 right-0 h-[var(--comp-tab-underline-border)] transition-colors duration-fast ease-enter',
              'bg-[var(--comp-tab-border-underlined)]',
              'group-data-[state=active]:bg-[var(--comp-tab-border-underlined-active)]',
            )}
          />
        </>
      )}
    </RadixTabs.Trigger>
  )
}

/* ─── TabPanel ─────────────────────────────────────────────────────────────── */

export interface TabPanelProps {
  /** Value matching a TabItem. */
  value: string
  children: ReactNode
  className?: string
  /** Keep panel mounted when inactive. */
  forceMount?: true
}

function TabPanel({ value, children, className, forceMount }: TabPanelProps) {
  return (
    <RadixTabs.Content
      value={value}
      forceMount={forceMount}
      className={cn('outline-none', className)}
    >
      {children}
    </RadixTabs.Content>
  )
}

/* ─── Compound export ──────────────────────────────────────────────────────── */

export const Tab = Object.assign(TabGroup, {
  List: TabList,
  Item: TabItem,
  Panel: TabPanel,
})
