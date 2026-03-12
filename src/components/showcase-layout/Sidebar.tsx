import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { SegmentBar, SegmentButton } from '@/components/SegmentBar'
import { SideNav, SideNavGroup, SideNavItem, SideNavDivider } from '@/components/SideNav'

/* ─── Nav config ──────────────────────────────────────────────────────────── */

type NavItem = {
  id: string
  label: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Actions',
    items: [
      { id: 'button',      label: 'Button' },
      { id: 'icon-button', label: 'IconButton' },
    ],
  },
  {
    label: 'Inputs',
    items: [
      { id: 'textfield', label: 'TextField' },
      { id: 'textarea',  label: 'Textarea' },
      { id: 'taginput',     label: 'TagInput' },
      { id: 'searchfield', label: 'SearchField' },
      { id: 'select', label: 'Select' },
    ],
  },
  {
    label: 'Selection',
    items: [
      { id: 'chip', label: 'Chip' },
      { id: 'segment-bar', label: 'SegmentBar' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { id: 'tab', label: 'Tab' },
      { id: 'sidenav', label: 'SideNav' },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { id: 'dropdown-menu', label: 'DropdownMenu' },
    ],
  },
  {
    label: 'Display',
    items: [
      { id: 'badge', label: 'Badge' },
    ],
  },
]

/* ─── Component ───────────────────────────────────────────────────────────── */

interface SidebarProps {
  active: string
  onSelect: (id: string) => void
  shape: 'basic' | 'geo'
  onShapeChange: (s: 'basic' | 'geo') => void
}

export function Sidebar({ active, onSelect, shape, onShapeChange }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col bg-semantic-background-0 border-r border-semantic-divider-solid-50 overflow-y-auto z-20">
      {/* Logo — click to go home */}
      <button
        onClick={() => onSelect('home')}
        className={cn(
          'w-full text-left px-4 pt-5 pb-4 transition-colors duration-fast ease-enter',
          active === 'home'
            ? 'bg-semantic-state-on-bright-100'
            : 'hover:bg-semantic-state-on-bright-70',
        )}
      >
        <span className="typography-16-bold text-semantic-text-on-bright-900">kiio</span>
        <span className="typography-12-regular text-semantic-text-on-bright-400 ml-1">components</span>
      </button>

      {/* Shape switcher */}
      <div className="px-4 pt-4 pb-2">
        <SegmentBar value={shape} onValueChange={v => onShapeChange(v as 'basic' | 'geo')} size="small" shape="square">
          <SegmentButton value="basic">Basic</SegmentButton>
          <SegmentButton value="geo">Geo</SegmentButton>
        </SegmentBar>
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-4 py-4">
        <SideNav value={active} onValueChange={onSelect} size="large">
          {NAV_GROUPS.map((group, index) => (
            <Fragment key={group.label}>
              <SideNavGroup label={group.label} collapsible={false}>
                {group.items.map(item => (
                  <SideNavItem key={item.id} value={item.id}>
                    {item.label}
                  </SideNavItem>
                ))}
              </SideNavGroup>
              {index < NAV_GROUPS.length - 1 && <SideNavDivider />}
            </Fragment>
          ))}
        </SideNav>
      </div>
    </aside>
  )
}
