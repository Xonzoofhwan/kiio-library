import { useState, useEffect, useCallback, useRef, type MutableRefObject } from 'react'

/**
 * @param validIds — SHOWCASE_MAP의 키를 전달받아 유효한 해시 ID를 판별.
 * 새 페이지 등록 시 App.tsx의 SHOWCASE_MAP에만 추가하면 자동으로 라우팅됨.
 */
export function useHashRoute(scrollRef?: MutableRefObject<HTMLElement | null>, validIds?: Set<string>) {
  function parseHash(): string {
    const raw = window.location.hash.replace(/^#\/?/, '')
    return validIds?.has(raw) ? raw : 'home'
  }

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
