import { useState, useEffect, useCallback, useRef, type MutableRefObject } from 'react'

const VALID_IDS = new Set([
  'home', 'tokens', 'tooltip', 'callout',
])

function parseHash(): string {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return VALID_IDS.has(raw) ? raw : 'home'
}

export function useHashRoute(scrollRef?: MutableRefObject<HTMLElement | null>) {
  const [activeId, setActiveId] = useState(parseHash)
  const isNavigating = useRef(false)

  useEffect(() => {
    const onHashChange = () => {
      const id = parseHash()
      setActiveId(id)
      if (isNavigating.current) {
        isNavigating.current = false
      }
      if (scrollRef?.current) scrollRef.current.scrollTop = 0
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [scrollRef])

  const navigate = useCallback(
    (id: string) => {
      isNavigating.current = true
      window.location.hash = `#/${id}`
    },
    [],
  )

  return { activeId, navigate }
}
