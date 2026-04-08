import { NavVertical } from '@/components/NavVertical'
import { IconButton } from '@/components/Button'
import { Icon } from '@/components/icons'
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
      { id: 'switch', label: 'Switch' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio', label: 'Radio' },
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
      <div className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-semantic-divider-solid-100">
        <img
          src={theme === 'dark' ? logoDark : logoLight}
          alt="kiio Library"
          className="h-6"
        />
        <IconButton
          hierarchy="ghost"
          size="small"
          shape="circular"
          icon={<Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} />}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
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
    </aside>
  )
}
