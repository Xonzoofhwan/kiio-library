import { useState } from 'react'
import { Button } from '@/components/Button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/DropdownMenu'
import { cn } from '@/lib/utils'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SpecLabel, TrashIcon, MailIcon, PlusIcon } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const DROPDOWN_MENU_TOC: TocEntry[] = [
  { id: 'component-dropdown-menu', label: 'DropdownMenu', level: 1 },
  { id: 'dropdown-playground', label: 'Playground' },
  { id: 'dropdown-basic',     label: 'Basic' },
  { id: 'dropdown-icons',     label: 'With Icons' },
  { id: 'dropdown-checkbox',  label: 'Checkbox Items' },
  { id: 'dropdown-radio',     label: 'Radio Items' },
  { id: 'dropdown-submenu',   label: 'Submenu' },
  { id: 'dropdown-groups',    label: 'Groups & Labels' },
  { id: 'dropdown-disabled',  label: 'Disabled Items' },
  { id: 'dropdown-header',    label: 'With Search Header' },
]

/* ─── Showcase icons (24px viewBox) ───────────────────────────────────────── */

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

/* ─── Trigger button (chevron) ─────────────────────────────────────────────── */

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6L8 10L12 6" />
  </svg>
)

function TriggerButton({ children, ...props }: React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button variant="outlined" intent="systemic" size="medium" iconTrailing={<ChevronDownIcon />} {...props}>
      {children}
    </Button>
  )
}

/* ─── Playground: static panel helpers ─────────────────────────────────── */

const itemCls = cn(
  'group relative flex items-center select-none',
  'h-[var(--comp-dropdown-item-height)]',
  'px-[var(--comp-dropdown-item-padding-x)]',
  'gap-[var(--comp-dropdown-item-gap)]',
  'rounded-[var(--comp-dropdown-item-radius)]',
  'typography-14-medium text-[var(--comp-dropdown-item-label)] cursor-pointer',
)

const hoverOverlay = cn(
  'pointer-events-none absolute inset-0 rounded-[inherit]',
  'transition-colors duration-fast ease-enter',
  'group-hover:bg-[var(--comp-dropdown-item-hover)]',
  'group-active:bg-[var(--comp-dropdown-item-pressed)]',
)

function PanelItem({
  icon,
  children,
  trailing,
  onClick,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  trailing?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div role="button" tabIndex={0} onClick={onClick} className={itemCls}>
      <span aria-hidden className={hoverOverlay} />
      {icon && (
        <span className="relative flex-shrink-0 flex items-center justify-center size-[var(--comp-dropdown-icon-leading)] text-[var(--comp-dropdown-item-icon)]">
          {icon}
        </span>
      )}
      <span className="relative flex-1 truncate px-0.5">{children}</span>
      {trailing && (
        <span className="relative flex-shrink-0 ml-auto flex items-center justify-center">
          {trailing}
        </span>
      )}
    </div>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex items-center',
        'h-[var(--comp-dropdown-subtitle-height)]',
        'px-[var(--comp-dropdown-subtitle-padding-x)]',
        'typography-12-medium text-[var(--comp-dropdown-subtitle)]',
      )}
    >
      {children}
    </div>
  )
}

function PanelSeparator() {
  return (
    <div
      className={cn(
        'h-px',
        'my-[var(--comp-dropdown-divider-margin-y)]',
        'mx-[var(--comp-dropdown-divider-margin-x)]',
        'bg-[var(--comp-dropdown-divider)]',
      )}
    />
  )
}

/* Check/Radio inline SVG icons for playground */
const PgCheckboxChecked = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16" height="16" rx="3" fill="currentColor" />
    <path d="M5 9L8 12L13 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const PgCheckboxUnchecked = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)
const PgRadioChecked = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="9" cy="9" r="4.5" fill="currentColor" />
  </svg>
)
const PgRadioUnchecked = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)
const PgChevronRight = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function ControlCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none typography-13-medium text-semantic-text-on-bright-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="accent-[var(--semantic-primary-500)] w-3.5 h-3.5"
      />
      {children}
    </label>
  )
}

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function DropdownMenuShowcase() {
  /* playground state */
  const [pgBasic, setPgBasic] = useState(true)
  const [pgCheckbox, setPgCheckbox] = useState(true)
  const [pgRadio, setPgRadio] = useState(true)
  const [pgSubmenu, setPgSubmenu] = useState(true)
  const [pgIcons, setPgIcons] = useState(true)
  const [pgLabels, setPgLabels] = useState(true)
  const [pgDividers, setPgDividers] = useState(true)

  const [pgChecked, setPgChecked] = useState<Set<string>>(new Set(['grid', 'panel']))
  const toggleCheck = (key: string) =>
    setPgChecked(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  const [pgRadioVal, setPgRadioVal] = useState('name')

  /* visible section count — for divider logic */
  const pgSections = [pgBasic, pgSubmenu, pgCheckbox, pgRadio]
  const visibleCount = pgSections.filter(Boolean).length

  /* checkbox state */
  const [showGrid, setShowGrid] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPanel, setShowPanel] = useState(true)

  /* radio state */
  const [sortBy, setSortBy] = useState('name')

  /* search filter */
  const [search, setSearch] = useState('')
  const allFruits = ['Apple', 'Banana', 'Cherry', 'Dragon Fruit', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon', 'Mango', 'Nectarine']
  const filtered = allFruits.filter(f => f.toLowerCase().includes(search.toLowerCase()))

  /* playground panel sections */
  const renderPgSections = () => {
    const sections: React.ReactNode[] = []

    if (pgBasic) {
      sections.push(
        <div key="basic">
          {pgLabels && <PanelLabel>Actions</PanelLabel>}
          <PanelItem icon={pgIcons ? <EditIcon /> : undefined}>Edit</PanelItem>
          <PanelItem icon={pgIcons ? <CopyIcon /> : undefined}>Duplicate</PanelItem>
          {pgSubmenu && (
            <PanelItem
              icon={pgIcons ? <ShareIcon /> : undefined}
              trailing={
                <span className="size-[var(--comp-dropdown-icon-trailing)] text-[var(--comp-dropdown-item-chevron)]">
                  <PgChevronRight />
                </span>
              }
            >
              Share
            </PanelItem>
          )}
        </div>,
      )
    } else if (pgSubmenu) {
      sections.push(
        <div key="submenu-only">
          {pgLabels && <PanelLabel>More</PanelLabel>}
          <PanelItem
            icon={pgIcons ? <ShareIcon /> : undefined}
            trailing={
              <span className="size-[var(--comp-dropdown-icon-trailing)] text-[var(--comp-dropdown-item-chevron)]">
                <PgChevronRight />
              </span>
            }
          >
            Share
          </PanelItem>
          <PanelItem
            icon={pgIcons ? <SettingsIcon /> : undefined}
            trailing={
              <span className="size-[var(--comp-dropdown-icon-trailing)] text-[var(--comp-dropdown-item-chevron)]">
                <PgChevronRight />
              </span>
            }
          >
            Preferences
          </PanelItem>
        </div>,
      )
    }

    if (pgCheckbox) {
      sections.push(
        <div key="checkbox">
          {pgLabels && <PanelLabel>Panels</PanelLabel>}
          {(['grid', 'sidebar', 'panel'] as const).map(key => {
            const checked = pgChecked.has(key)
            return (
              <PanelItem
                key={key}
                icon={pgIcons ? key === 'grid' ? <EditIcon /> : key === 'sidebar' ? <CopyIcon /> : <DownloadIcon /> : undefined}
                onClick={() => toggleCheck(key)}
                trailing={
                  <span className={cn('size-[var(--comp-dropdown-icon-check)]', checked ? 'text-[var(--comp-dropdown-check-checked)]' : 'text-[var(--comp-dropdown-check-unchecked)]')}>
                    {checked ? <PgCheckboxChecked /> : <PgCheckboxUnchecked />}
                  </span>
                }
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </PanelItem>
            )
          })}
        </div>,
      )
    }

    if (pgRadio) {
      sections.push(
        <div key="radio">
          {pgLabels && <PanelLabel>Sort By</PanelLabel>}
          {(['name', 'date', 'size'] as const).map(val => {
            const selected = pgRadioVal === val
            return (
              <PanelItem
                key={val}
                onClick={() => setPgRadioVal(val)}
                trailing={
                  <span className={cn('size-[var(--comp-dropdown-icon-check)]', selected ? 'text-[var(--comp-dropdown-check-checked)]' : 'text-[var(--comp-dropdown-check-unchecked)]')}>
                    {selected ? <PgRadioChecked /> : <PgRadioUnchecked />}
                  </span>
                }
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </PanelItem>
            )
          })}
        </div>,
      )
    }

    /* interleave dividers */
    if (!pgDividers || sections.length <= 1) return sections

    const result: React.ReactNode[] = []
    sections.forEach((s, i) => {
      if (i > 0) result.push(<PanelSeparator key={`sep-${i}`} />)
      result.push(s)
    })
    return result
  }

  return (
    <>
      <h1
        id="component-dropdown-menu"
        className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6"
      >
        DropdownMenu
      </h1>

      {/* Playground */}
      <section id="dropdown-playground" className="mb-12 scroll-mt-6">
        <SectionTitle>Playground</SectionTitle>
        <SpecLabel>Interactive preview — toggle sections and options</SpecLabel>

        <div className="mt-4 flex gap-8 items-start">
          {/* Static dropdown panel */}
          <div
            className={cn(
              'inline-flex flex-col overflow-hidden w-[240px] shrink-0',
              'bg-[var(--comp-dropdown-bg)]',
              'border border-[var(--comp-dropdown-border)]',
              'rounded-[var(--comp-dropdown-radius)]',
              '[box-shadow:var(--comp-dropdown-shadow)]',
            )}
          >
            <div className="py-[var(--comp-dropdown-padding-y)] px-[var(--comp-dropdown-padding-x)]">
              {visibleCount > 0 ? (
                renderPgSections()
              ) : (
                <div className="flex items-center justify-center h-20 typography-13-medium text-semantic-neutral-solid-400">
                  No sections visible
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5 pt-1">
            <div className="flex flex-col gap-2">
              <p className="typography-12-semibold text-semantic-text-on-bright-400 uppercase tracking-wider">Sections</p>
              <div className="flex flex-col gap-1.5">
                <ControlCheckbox checked={pgBasic} onChange={setPgBasic}>Basic items</ControlCheckbox>
                <ControlCheckbox checked={pgCheckbox} onChange={setPgCheckbox}>Checkbox group</ControlCheckbox>
                <ControlCheckbox checked={pgRadio} onChange={setPgRadio}>Radio group</ControlCheckbox>
                <ControlCheckbox checked={pgSubmenu} onChange={setPgSubmenu}>Submenu item</ControlCheckbox>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="typography-12-semibold text-semantic-text-on-bright-400 uppercase tracking-wider">Options</p>
              <div className="flex flex-col gap-1.5">
                <ControlCheckbox checked={pgIcons} onChange={setPgIcons}>Show icons</ControlCheckbox>
                <ControlCheckbox checked={pgLabels} onChange={setPgLabels}>Show labels</ControlCheckbox>
                <ControlCheckbox checked={pgDividers} onChange={setPgDividers}>Show dividers</ControlCheckbox>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic */}
      <section id="dropdown-basic" className="mb-12 scroll-mt-6">
        <SectionTitle>Basic</SectionTitle>
        <SpecLabel>Simple action items</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>Actions</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => {}}>New File</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>Open...</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>Save</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => {}}>Close</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* With Icons */}
      <section id="dropdown-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <SpecLabel>Items with leading icons</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>More</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem iconLeading={<EditIcon />}>Edit</DropdownMenuItem>
              <DropdownMenuItem iconLeading={<CopyIcon />}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem iconLeading={<ShareIcon />}>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem iconLeading={<DownloadIcon />}>Download</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem iconLeading={<TrashIcon />}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Checkbox Items */}
      <section id="dropdown-checkbox" className="mb-12 scroll-mt-6">
        <SectionTitle>Checkbox Items</SectionTitle>
        <SpecLabel>Multi-select toggle pattern</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>View</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Panels</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
                Grid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                Sidebar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
                Bottom Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-2 typography-12-regular text-semantic-text-on-bright-400">
            Grid: {showGrid ? 'on' : 'off'} / Sidebar: {showSidebar ? 'on' : 'off'} / Bottom Panel: {showPanel ? 'on' : 'off'}
          </div>
        </div>
      </section>

      {/* Radio Items */}
      <section id="dropdown-radio" className="mb-12 scroll-mt-6">
        <SectionTitle>Radio Items</SectionTitle>
        <SpecLabel>Single-select radio pattern</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>Sort By</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date">Date Modified</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-2 typography-12-regular text-semantic-text-on-bright-400">
            Selected: {sortBy}
          </div>
        </div>
      </section>

      {/* Submenu */}
      <section id="dropdown-submenu" className="mb-12 scroll-mt-6">
        <SectionTitle>Submenu</SectionTitle>
        <SpecLabel>Nested submenu with chevron indicator</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>Options</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem iconLeading={<PlusIcon />}>New File</DropdownMenuItem>
              <DropdownMenuItem iconLeading={<CopyIcon />}>Copy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger iconLeading={<ShareIcon />}>
                  Share
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem iconLeading={<MailIcon />}>Email</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuItem>Copy Link</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger iconLeading={<SettingsIcon />}>
                  Preferences
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem iconLeading={<UserIcon />}>Account</DropdownMenuItem>
                  <DropdownMenuItem>Appearance</DropdownMenuItem>
                  <DropdownMenuItem>Language</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Groups & Labels */}
      <section id="dropdown-groups" className="mb-12 scroll-mt-6">
        <SectionTitle>Groups &amp; Labels</SectionTitle>
        <SpecLabel>Grouped items with subtitle separators</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>Menu</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuItem>New</DropdownMenuItem>
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuItem>Save</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Edit</DropdownMenuLabel>
                <DropdownMenuItem>Undo</DropdownMenuItem>
                <DropdownMenuItem>Redo</DropdownMenuItem>
                <DropdownMenuItem>Cut</DropdownMenuItem>
                <DropdownMenuItem>Copy</DropdownMenuItem>
                <DropdownMenuItem>Paste</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Help</DropdownMenuLabel>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>About</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Disabled Items */}
      <section id="dropdown-disabled" className="mb-12 scroll-mt-6">
        <SectionTitle>Disabled Items</SectionTitle>
        <SpecLabel>Individual disabled items</SpecLabel>
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TriggerButton>Actions</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem iconLeading={<EditIcon />}>Edit</DropdownMenuItem>
              <DropdownMenuItem iconLeading={<CopyIcon />} disabled>Duplicate (disabled)</DropdownMenuItem>
              <DropdownMenuItem iconLeading={<ShareIcon />}>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem iconLeading={<TrashIcon />} disabled>Delete (disabled)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* With Search Header */}
      <section id="dropdown-header" className="mb-12 scroll-mt-6">
        <SectionTitle>With Search Header</SectionTitle>
        <SpecLabel>Header slot with search input — items filter in real time</SpecLabel>
        <div className="mt-3">
          <DropdownMenu onOpenChange={(open) => { if (!open) setSearch('') }}>
            <DropdownMenuTrigger>
              <TriggerButton>Select Fruit</TriggerButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              header={
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                  className="w-full h-9 px-3 rounded-[var(--comp-dropdown-item-radius)] bg-semantic-neutral-solid-50 typography-14-regular text-semantic-text-on-bright-900 placeholder:text-semantic-neutral-solid-400 outline-none focus:ring-2 focus:ring-[var(--comp-dropdown-focus-ring)] transition-shadow duration-fast ease-enter"
                />
              }
            >
              {filtered.length > 0 ? (
                filtered.map(fruit => (
                  <DropdownMenuItem key={fruit} onSelect={() => {}}>
                    {fruit}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex items-center justify-center h-[var(--comp-dropdown-item-height)] typography-14-regular text-semantic-neutral-solid-400">
                  No results
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </>
  )
}
