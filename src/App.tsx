import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { showcaseRegistry } from './showcase'
import type { ShowcaseItem } from './showcase/types'
import { Playground } from './showcase/Playground'

// ─── Group showcases by category ─────────────────────────────────────────────
function groupByCategory(items: ShowcaseItem[]) {
  return items.reduce<Record<string, ShowcaseItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})
}

// ─── Header ───────────────────────────────────────────────────────────────────
interface HeaderProps {
  theme: 'brand1' | 'brand2'
  onThemeChange: (t: 'brand1' | 'brand2') => void
}

function Header({ theme, onThemeChange }: HeaderProps) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center px-6 gap-4 bg-semantic-background-0 border-b border-semantic-divider-solid-100 z-10">
      <div className="flex items-center gap-2">
        <span className="typography-16-semibold text-semantic-text-on-bright-900">kiio</span>
        <span className="typography-16-regular text-semantic-text-on-bright-400">Design System</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="typography-12-regular text-semantic-text-on-bright-400 mr-1">Theme</span>
        <button
          className={cn(
            'px-3 py-1.5 rounded-2 typography-14-medium transition-colors',
            theme === 'brand1'
              ? 'bg-semantic-primary-500 text-white'
              : 'bg-semantic-neutral-solid-100 text-semantic-text-on-bright-700',
          )}
          onClick={() => onThemeChange('brand1')}
        >
          Brand 1
        </button>
        <button
          className={cn(
            'px-3 py-1.5 rounded-2 typography-14-medium transition-colors',
            theme === 'brand2'
              ? 'bg-semantic-primary-500 text-white'
              : 'bg-semantic-neutral-solid-100 text-semantic-text-on-bright-700',
          )}
          onClick={() => onThemeChange('brand2')}
        >
          Brand 2
        </button>
      </div>
    </header>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
interface SidebarProps {
  activeId: string
  onSelect: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

function Sidebar({ activeId, onSelect, searchQuery, onSearchChange }: SidebarProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return showcaseRegistry
    const q = searchQuery.toLowerCase()
    return showcaseRegistry.filter(
      item => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const grouped = groupByCategory(filtered)

  return (
    <aside className="w-52 flex-shrink-0 bg-semantic-background-50 border-r border-semantic-divider-solid-100 flex flex-col">
      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-semantic-text-on-bright-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-2 border border-semantic-divider-solid-100 bg-semantic-background-0 typography-13-regular text-semantic-text-on-bright-900 placeholder:text-semantic-text-on-bright-400 outline-none focus:border-semantic-primary-400 transition-colors"
          />
        </div>
      </div>

      {/* Component list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-3 px-3">
            <p className="typography-12-semibold text-semantic-text-on-bright-400 uppercase tracking-wide px-2 mb-1">
              {category}
            </p>
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'block w-full text-left px-2 py-1.5 rounded-2 typography-14-medium transition-colors',
                  activeId === item.id
                    ? 'bg-semantic-primary-50 text-semantic-primary-600'
                    : 'text-semantic-text-on-bright-600 hover:bg-semantic-state-on-bright-50',
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

// ─── Component View ──────────────────────────────────────────────────────────
function ComponentView({ item }: { item: ShowcaseItem }) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-12 pb-16">
      {/* Header */}
      <div>
        <h1 className="typography-24-bold text-semantic-text-on-bright-900">{item.name}</h1>
        <p className="typography-14-regular text-semantic-text-on-bright-600 mt-1">{item.description}</p>
      </div>

      {/* Playground */}
      <section>
        <div className="flex items-baseline gap-2 mb-5 pb-3 border-b border-semantic-divider-solid-100">
          <h2 className="typography-16-semibold text-semantic-text-on-bright-800">Playground</h2>
          <span className="typography-12-regular text-semantic-text-on-bright-400">
            모든 prop을 직접 조작해보세요
          </span>
        </div>
        <Playground key={item.id} item={item} />
      </section>

      {/* States & Variants */}
      {item.showcase && (
        <section>
          <div className="flex items-baseline gap-2 mb-5 pb-3 border-b border-semantic-divider-solid-100">
            <h2 className="typography-16-semibold text-semantic-text-on-bright-800">States & Variants</h2>
          </div>
          <item.showcase />
        </section>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<'brand1' | 'brand2'>('brand1')
  const [activeId, setActiveId] = useState(showcaseRegistry[0]?.id ?? '')
  const [searchQuery, setSearchQuery] = useState('')

  const activeItem = showcaseRegistry.find(item => item.id === activeId)

  return (
    <div data-theme={theme} className="h-screen flex flex-col overflow-hidden font-pretendard">
      <Header theme={theme} onThemeChange={setTheme} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeId={activeId}
          onSelect={setActiveId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto bg-semantic-background-0 px-10 py-8">
          {activeItem ? (
            <ComponentView item={activeItem} />
          ) : (
            <div className="flex items-center justify-center h-full typography-14-regular text-semantic-text-on-bright-400">
              Select a component from the sidebar
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
