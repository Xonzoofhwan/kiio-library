import { useState, useRef, useCallback, useEffect, createElement, Suspense } from 'react'
import { Sidebar, TableOfContents } from '@/components/showcase-layout'
import { IconButton } from '@/components/Button'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { useHashRoute } from '@/hooks/useHashRoute'
import { NavigateContext } from '@/showcase/NavigateContext'
import { ShowcaseTocContext } from '@/showcase/ShowcaseTocContext'
import { SHOWCASES, SHOWCASE_IDS, SHOWCASE_PAGES } from '@/showcase/registry'

/* ─── App ─────────────────────────────────────────────────────────────────── */

const EMPTY_TOC: TocEntry[] = []

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  // 좁은 화면(lg 미만)에서만 의미가 있다 — 그 이상에서 사이드바는 늘 보인다.
  const [navOpen, setNavOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const { activeId, navigate } = useHashRoute(mainRef, SHOWCASE_IDS)

  // 해시가 유효하지 않으면 useHashRoute 가 'home' 을 준다 — registry 에 없으므로 첫 페이지로 떨어진다.
  const entry = SHOWCASES.find((item) => item.id === activeId) ?? SHOWCASES[0]


  /* 정적 목차도 페이지 모듈에 있으므로 함께 늦게 온다. import() 는 캐시되니
     lazy 와 따로 부르는 것이 네트워크 요청을 늘리지 않는다.
     도착 전에는 빈 목차 — 목차 열이 잠깐 비는 것이 레이아웃이 튀는 것보다 낫다.

     소유한 페이지 id 를 함께 저장하고 **렌더 중에 파생한다.** effect 안에서 동기적으로
     초기화하면(setStaticToc(EMPTY_TOC)) 페이지를 옮길 때마다 렌더가 한 번 더 돈다 —
     dynamicToc 이 쓰는 것과 같은 패턴이다. */
  const [loadedToc, setLoadedToc] = useState<{ ownerId: string; entries: TocEntry[] } | null>(null)
  useEffect(() => {
    let alive = true
    void entry.load().then((module) => {
      if (alive) setLoadedToc({ ownerId: entry.id, entries: module.toc ?? EMPTY_TOC })
    })
    return () => {
      alive = false
    }
  }, [entry])
  const staticToc = loadedToc?.ownerId === activeId ? loadedToc.entries : EMPTY_TOC

  const closeNav = useCallback(() => setNavOpen(false), [])

  /* Dynamic TOC — 탭이 있는 쇼케이스가 ShowcaseTocContext 로 목차를 갈아끼운다.
     소유한 페이지 id를 함께 저장해 렌더 중에 파생한다. effect로 초기화하면
     자식 effect가 먼저 실행되는 탓에 새 페이지가 방금 올린 목차를 덮어쓴다. */
  const [dynamicToc, setDynamicToc] = useState<{ ownerId: string; entries: TocEntry[] } | null>(null)
  const handleTocChange = useCallback(
    (entries: TocEntry[]) =>
      setDynamicToc(prev =>
        prev?.ownerId === activeId && prev.entries === entries
          ? prev // 같은 목차 재전달은 리렌더를 만들지 않는다
          : { ownerId: activeId, entries },
      ),
    [activeId],
  )
  const toc = dynamicToc?.ownerId === activeId ? dynamicToc.entries : staticToc

  return (
    <div
      data-theme={theme}
      className="flex h-screen overflow-hidden bg-semantic-background-0 font-sans"
    >
      <Sidebar
        active={activeId}
        onSelect={navigate}
        theme={theme}
        onThemeChange={setTheme}
        open={navOpen}
        onClose={closeNav}
      />

      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto lg:ml-[240px]"
      >
        {/* 좁은 화면의 상단 바 — 사이드바가 서랍이 되므로 여는 손잡이가 필요하다.
            sticky 라 긴 페이지에서도 스크롤 위치와 무관하게 닿는다. */}
        <div className="sticky top-0 z-10 flex items-center gap-2 h-14 px-4 border-b border-semantic-divider-solid-100 bg-semantic-background-0 lg:hidden">
          <IconButton
            hierarchy="ghost"
            size="small"
            shape="circular"
            icon={<Icon name="menu" />}
            aria-label="내비게이션 열기"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          />
          <span className="typography-14-semibold text-semantic-text-on-bright-900">{entry.label}</span>
        </div>

        <div className="max-w-[960px] mx-auto px-4 sm:px-8 lg:px-12 flex gap-8">
          <div className="flex-1 min-w-0 pt-10 lg:pt-16 pb-24">
            <ShowcaseTocContext.Provider value={handleTocChange}>
              <NavigateContext.Provider value={navigate}>
                {/* fallback 은 비워 둔다. 스피너를 넣으면 캐시된 페이지를 다시 열 때도
                    한 프레임 깜빡이는데, 그 잡음이 로딩 표시의 값어치보다 크다. */}
                <Suspense fallback={null}>
                  {/* 페이지는 동적으로 받는다 — 초기 번들에 17 페이지가 전부 들어가지 않게.
                      lazy 컴포넌트는 registry 가 모듈 레벨에서 만들어 두므로 여기서는 **조회**뿐이고
                      타입은 앱 수명 동안 고정이다. JSX 대신 createElement 를 쓰는 이유:
                      `const Page = map.get(id)` 뒤 `<Page />` 는 정적 분석이 "렌더 중 컴포넌트 생성"
                      으로 읽어(react-hooks/static-components) 조회와 생성을 구분하지 못한다. */}
                  {createElement(SHOWCASE_PAGES.get(entry.id)!)}
                </Suspense>
              </NavigateContext.Provider>
            </ShowcaseTocContext.Provider>
          </div>
          {toc.length > 0 && (
            <div className="w-[192px] shrink-0 hidden lg:block">
              <div className="sticky top-0 py-16">
                <TableOfContents key={`${activeId}-${toc.length}`} entries={toc} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
