import { useState, useEffect, useCallback, useRef, type MutableRefObject } from 'react'

/** 해시에서 라우트 id를 뽑는다. 유효하지 않으면 'home'으로 폴백. */
function parseHash(validIds?: Set<string>): string {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return validIds?.has(raw) ? raw : 'home'
}

/**
 * @param scrollRef — 라우트 전환 시 스크롤을 맨 위로 되돌릴 컨테이너.
 * @param validIds — SHOWCASE_MAP의 키를 전달받아 유효한 해시 ID를 판별.
 * 새 페이지 등록 시 App.tsx의 SHOWCASE_MAP에만 추가하면 자동으로 라우팅됨.
 * effect 의존성에 그대로 들어가므로 안정된 참조(모듈 상수 또는 memo)를 넘길 것 —
 * 렌더마다 새 Set을 만들면 listener가 매 렌더 재등록된다.
 */
export function useHashRoute(scrollRef?: MutableRefObject<HTMLElement | null>, validIds?: Set<string>) {
  const [activeId, setActiveId] = useState(() => parseHash(validIds))
  const isNavigating = useRef(false)

  useEffect(() => {
    const onHashChange = () => {
      setActiveId(parseHash(validIds))
      if (isNavigating.current) {
        isNavigating.current = false
      }
      if (scrollRef?.current) scrollRef.current.scrollTop = 0
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
    // validIds를 의존성에 두어 listener가 항상 최신 유효 ID 집합을 본다.
    // (HMR로 SHOWCASE_MAP이 갱신되면 Set 참조가 바뀌며 listener가 재등록된다)
  }, [scrollRef, validIds])

  const navigate = useCallback(
    (id: string) => {
      isNavigating.current = true
      window.location.hash = `#/${id}`
    },
    [],
  )

  return { activeId, navigate }
}
