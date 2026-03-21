import { cn } from '@/lib/utils'

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
    label: 'Overlay',
    items: [
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'callout', label: 'Callout' },
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
      {/* Logo */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4">
        <span className="typography-16-bold text-semantic-text-on-bright-900">kiio</span>
        <span className="typography-12-regular text-semantic-text-on-bright-400 ml-1">components</span>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="typography-12-semibold text-semantic-text-on-bright-400 uppercase tracking-wider px-3 mb-1">
              {group.label}
            </div>
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-2 typography-14-medium transition-colors duration-fast ease-enter',
                  active === item.id
                    ? 'bg-semantic-state-on-bright-100 text-semantic-text-on-bright-900'
                    : 'text-semantic-text-on-bright-600 hover:bg-semantic-state-on-bright-70 hover:text-semantic-text-on-bright-900',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-semantic-divider-solid-50">
        <div className="flex items-center justify-between">
          <span className="typography-13-medium text-semantic-text-on-bright-600">Dark mode</span>
          <button
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-fast ease-enter',
              theme === 'dark' ? 'bg-semantic-primary-500' : 'bg-semantic-neutral-solid-300',
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white transition-transform duration-fast ease-enter',
                theme === 'dark' ? 'translate-x-[18px]' : 'translate-x-[2px]',
              )}
            />
          </button>
        </div>
      </div>
    </aside>
  )
}
