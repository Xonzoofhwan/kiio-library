import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export type TocEntry = {
  id: string
  label: string
  level?: 1 | 2
}

interface TableOfContentsProps {
  entries: TocEntry[]
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-8px 0px -60% 0px', threshold: 0 },
    )

    entries.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [entries])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside>
      <p className="typography-12-semibold text-semantic-text-on-bright-400 uppercase tracking-wider mb-3">
        On this page
      </p>
      <nav>
        <ul className="flex flex-col gap-0.5">
          {entries.map(entry => (
            <li key={entry.id}>
              <button
                onClick={() => handleClick(entry.id)}
                className={cn(
                  'w-full text-left py-1 transition-colors duration-fast ease-enter',
                  entry.level === 1
                    ? 'typography-14-semibold'
                    : 'typography-14-regular pl-2',
                  activeId === entry.id
                    ? 'text-semantic-text-on-bright-900'
                    : 'text-semantic-text-on-bright-400 hover:text-semantic-text-on-bright-700',
                )}
              >
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
