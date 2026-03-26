import { useState, useRef } from 'react'
import { Sidebar, TableOfContents } from '@/components/showcase-layout'
import type { TocEntry } from '@/components/showcase-layout'
import { useHashRoute } from '@/hooks/useHashRoute'
import { NavigateContext } from '@/showcase/NavigateContext'
import { TokenShowcase, TOKEN_TOC } from '@/showcase/TokenShowcase'
import { TooltipShowcase, TOOLTIP_TOC } from '@/showcase/TooltipShowcase'
import { CalloutShowcase, CALLOUT_TOC } from '@/showcase/CalloutShowcase'
import { ButtonShowcase, BUTTON_TOC } from '@/showcase/ButtonShowcase'
import { IconButtonShowcase, ICON_BUTTON_TOC } from '@/showcase/IconButtonShowcase'
import { TextButtonShowcase, TEXT_BUTTON_TOC } from '@/showcase/TextButtonShowcase'

/* ─── Showcase map ────────────────────────────────────────────────────────── */
// 새 페이지 등록: 여기에만 추가하면 라우팅 + 사이드바 자동 연동.
// (Sidebar NAV_GROUPS에 수동 추가도 필요)

const SHOWCASE_MAP: Record<string, { component: React.ComponentType; toc: TocEntry[] }> = {
  'tokens':      { component: TokenShowcase,     toc: TOKEN_TOC       },
  'button':      { component: ButtonShowcase,    toc: BUTTON_TOC      },
  'icon-button': { component: IconButtonShowcase, toc: ICON_BUTTON_TOC },
  'text-button': { component: TextButtonShowcase, toc: TEXT_BUTTON_TOC },
  'tooltip':     { component: TooltipShowcase,   toc: TOOLTIP_TOC     },
  'callout':     { component: CalloutShowcase,   toc: CALLOUT_TOC     },
}

/** Derived from SHOWCASE_MAP — useHashRoute uses this to validate hash IDs. */
const VALID_SHOWCASE_IDS = new Set(Object.keys(SHOWCASE_MAP))

/* ─── App ─────────────────────────────────────────────────────────────────── */

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const mainRef = useRef<HTMLDivElement>(null)
  const { activeId, navigate } = useHashRoute(mainRef, VALID_SHOWCASE_IDS)

  const entry = SHOWCASE_MAP[activeId] ?? SHOWCASE_MAP['tooltip']
  const { component: ActiveShowcase, toc } = entry

  return (
    <div
      data-theme={theme}
      className="flex h-screen overflow-hidden bg-semantic-background-0 font-geist"
    >
      <Sidebar
        active={activeId}
        onSelect={navigate}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto ml-[240px]"
      >
        <div className="max-w-[1120px] mx-auto px-10 py-10 flex gap-10">
          <div className="flex-1 min-w-0">
            <NavigateContext.Provider value={navigate}>
              <ActiveShowcase />
            </NavigateContext.Provider>
          </div>
          {toc.length > 0 && (
            <div className="w-[180px] shrink-0 hidden lg:block">
              <div className="sticky top-10">
                <TableOfContents key={activeId} entries={toc} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
