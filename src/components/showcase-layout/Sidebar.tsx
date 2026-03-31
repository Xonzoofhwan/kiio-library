import { cn } from '@/lib/utils'
import { NavVertical } from '@/components/NavVertical'
import logoLight from '@/assets/logo_24_withLettermark_light.svg'
import logoDark from '@/assets/logo_24_withLettermark_dark.svg'

/* ─── Nav config ──────────────────────────────────────────────────────────── */

type NavItem = {
  id: string
  label: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Foundation',
    items: [
      { id: 'tokens', label: 'Tokens' },
      { id: 'block-catalog', label: 'Block Catalog' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'icon-button', label: 'IconButton' },
      { id: 'text-button', label: 'TextButton' },
    ],
  },
  {
    label: 'Indicators',
    items: [
      { id: 'badge', label: 'Badge' },
      { id: 'chip-universal', label: 'Chip.Universal' },
      { id: 'chip-badgelike', label: 'Chip.BadgeLike' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { id: 'tab', label: 'Tab' },
      { id: 'nav-vertical', label: 'NavVertical' },
      { id: 'segment-bar', label: 'SegmentBar' },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'callout', label: 'Callout' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { id: 'skeleton', label: 'Skeleton' },
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
    <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col bg-semantic-background-50 border-r border-semantic-divider-solid-200 z-20">
      {/* Logo */}
      <div className="flex-shrink-0 h-14 px-4 py-4 border-b border-semantic-divider-solid-100">
        <img
          src={theme === 'dark' ? logoDark : logoLight}
          alt="kiio Library"
          className="h-6"
        />
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavVertical value={active} onValueChange={onSelect} size="large" shape="basic">
          {NAV_GROUPS.map((group, i) => (
            <div key={group.label}>
              {i > 0 && (
                <hr className="border-t border-semantic-divider-solid-100 my-2" />
              )}
              <NavVertical.Group label={group.label}>
                {group.items.map((item) => (
                  <NavVertical.Item key={item.id} value={item.id}>
                    {item.label}
                  </NavVertical.Item>
                ))}
              </NavVertical.Group>
            </div>
          ))}
        </NavVertical>
      </div>

      {/* Theme toggle */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-semantic-divider-solid-50">
        <div className="flex items-center justify-between">
          <span className="typography-13-medium text-semantic-text-on-bright-600">Dark mode</span>
          <button
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-fast ease-enter',
              theme === 'dark' ? 'bg-semantic-emphasized-purple-500' : 'bg-semantic-neutral-solid-300',
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
