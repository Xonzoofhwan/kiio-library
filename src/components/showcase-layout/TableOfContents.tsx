import { useState, useEffect, useCallback } from 'react'
import { NavVertical } from '@/components/NavVertical'

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

  const handleValueChange = useCallback((value: string) => {
    const el = document.getElementById(value)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <aside>
      <NavVertical
        value={activeId}
        onValueChange={handleValueChange}
        size="small"
        shape="basic"
      >
        <NavVertical.Group label="On this page">
          {entries.map(entry => (
            <NavVertical.Item key={entry.id} value={entry.id}>
              {entry.label}
            </NavVertical.Item>
          ))}
        </NavVertical.Group>
      </NavVertical>
    </aside>
  )
}
