import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { SideNav, SideNavGroup, SideNavItem, SideNavDivider } from '@/components/SideNav'
import { Switch } from '@/components/Switch'

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
      { id: 'text-button', label: 'TextButton' },
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
      { id: 'formfield', label: 'FormField' },
      { id: 'slider',    label: 'Slider' },
    ],
  },
  {
    label: 'Selection',
    items: [
      { id: 'chip', label: 'Chip' },
      { id: 'segment-bar', label: 'SegmentBar' },
      { id: 'switch', label: 'Switch' },
      { id: 'radio-group', label: 'RadioGroup' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { id: 'tab', label: 'Tab' },
      { id: 'sidenav', label: 'SideNav' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { id: 'dropdown-menu', label: 'DropdownMenu' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'callout', label: 'Callout' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'drawer', label: 'Drawer' },
      { id: 'popover', label: 'Popover' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { id: 'toast', label: 'Toast / Snackbar' },
      { id: 'progress', label: 'Progress' },
      { id: 'stepper',  label: 'Stepper' },
    ],
  },
  {
    label: 'Layout',
    items: [
      { id: 'divider',     label: 'Divider'    },
      { id: 'skeleton',    label: 'Skeleton'   },
      { id: 'accordion',   label: 'Accordion'  },
    ],
  },
  {
    label: 'Display',
    items: [
      { id: 'badge',       label: 'Badge'      },
      { id: 'table',       label: 'Table'      },
      { id: 'data-table',  label: 'DataTable'  },
      { id: 'pagination',  label: 'Pagination' },
    ],
  },
]

/* ─── Component ───────────────────────────────────────────────────────────── */

interface SidebarProps {
  active: string
  onSelect: (id: string) => void
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
}

export function Sidebar({ active, onSelect, theme, onThemeChange }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col bg-semantic-background-0 border-r border-semantic-divider-solid-50 z-20">
      {/* Logo — click to go home */}
      <button
        onClick={() => onSelect('home')}
        className={cn(
          'flex-shrink-0 w-full text-left px-4 pt-5 pb-4 transition-colors duration-fast ease-enter',
          active === 'home'
            ? 'bg-semantic-state-on-bright-100'
            : 'hover:bg-semantic-state-on-bright-70',
        )}
      >
        <span className="typography-16-bold text-semantic-text-on-bright-900">kiio</span>
        <span className="typography-12-regular text-semantic-text-on-bright-400 ml-1">components</span>
      </button>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
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

      {/* Theme toggle */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-semantic-divider-solid-50">
        <div className="flex items-center justify-between">
          <span className="typography-13-medium text-semantic-text-on-bright-600">Dark mode</span>
          <Switch
            size="small"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
          />
        </div>
      </div>
    </aside>
  )
}
