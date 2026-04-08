import { useState, useRef, useEffect, useCallback } from 'react'
import { Sidebar, TableOfContents } from '@/components/showcase-layout'
import type { TocEntry } from '@/components/showcase-layout'
import { useHashRoute } from '@/hooks/useHashRoute'
import { NavigateContext } from '@/showcase/NavigateContext'
import { ShowcaseTocContext } from '@/showcase/ShowcaseTocContext'
import { TokenShowcase, TOKEN_TOC } from '@/showcase/TokenShowcase'
import { TooltipShowcase, TOOLTIP_TOC } from '@/showcase/TooltipShowcase'
import { CalloutShowcase, CALLOUT_TOC } from '@/showcase/CalloutShowcase'
import { ButtonShowcase, BUTTON_TOC } from '@/showcase/ButtonShowcase'
import { IconButtonShowcase, ICON_BUTTON_TOC } from '@/showcase/IconButtonShowcase'
import { TextButtonShowcase, TEXT_BUTTON_TOC } from '@/showcase/TextButtonShowcase'
import { SwitchShowcase, SWITCH_TOC } from '@/showcase/SwitchShowcase'
import { TabShowcase, TAB_TOC } from '@/showcase/TabShowcase'
import { BadgeShowcase, BADGE_TOC } from '@/showcase/BadgeShowcase'
import { NavVerticalShowcase, NAV_VERTICAL_TOC } from '@/showcase/NavVerticalShowcase'
import { SegmentBarShowcase, SEGMENT_BAR_TOC } from '@/showcase/SegmentBarShowcase'
import { ChipShowcase, CHIP_TOC } from '@/showcase/ChipShowcase'
import { ChipBadgeLikeShowcase, CHIP_BADGELIKE_TOC } from '@/showcase/ChipBadgeLikeShowcase'
import { SkeletonShowcase, SKELETON_TOC } from '@/showcase/SkeletonShowcase'
import { BlockCatalogShowcase, BLOCK_CATALOG_TOC } from '@/showcase/BlockCatalogShowcase'

/* ─── Showcase map ────────────────────────────────────────────────────────── */
// 새 페이지 등록: 여기에만 추가하면 라우팅 + 사이드바 자동 연동.
// (Sidebar NAV_GROUPS에 수동 추가도 필요)

const SHOWCASE_MAP: Record<string, { component: React.ComponentType; toc: TocEntry[] }> = {
  'tokens':      { component: TokenShowcase,     toc: TOKEN_TOC       },
  'button':      { component: ButtonShowcase,    toc: BUTTON_TOC      },
  'icon-button': { component: IconButtonShowcase, toc: ICON_BUTTON_TOC },
  'text-button': { component: TextButtonShowcase, toc: TEXT_BUTTON_TOC },
  'switch':      { component: SwitchShowcase,    toc: SWITCH_TOC      },
  'tooltip':     { component: TooltipShowcase,   toc: TOOLTIP_TOC     },
  'callout':     { component: CalloutShowcase,   toc: CALLOUT_TOC     },
  'tab':         { component: TabShowcase,       toc: TAB_TOC         },
  'badge':       { component: BadgeShowcase,     toc: BADGE_TOC       },
  'nav-vertical': { component: NavVerticalShowcase, toc: NAV_VERTICAL_TOC },
  'segment-bar': { component: SegmentBarShowcase, toc: SEGMENT_BAR_TOC },
  'chip-universal': { component: ChipShowcase,          toc: CHIP_TOC          },
  'chip-badgelike': { component: ChipBadgeLikeShowcase, toc: CHIP_BADGELIKE_TOC },
  'skeleton':       { component: SkeletonShowcase,      toc: SKELETON_TOC      },
  'block-catalog':  { component: BlockCatalogShowcase,  toc: BLOCK_CATALOG_TOC },
}

/** Derived from SHOWCASE_MAP — useHashRoute uses this to validate hash IDs. */
const VALID_SHOWCASE_IDS = new Set(Object.keys(SHOWCASE_MAP))

/* ─── App ─────────────────────────────────────────────────────────────────── */

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const mainRef = useRef<HTMLDivElement>(null)
  const { activeId, navigate } = useHashRoute(mainRef, VALID_SHOWCASE_IDS)

  const entry = SHOWCASE_MAP[activeId] ?? SHOWCASE_MAP['tooltip']
  const { component: ActiveShowcase, toc: defaultToc } = entry

  /* Dynamic TOC — tabbed showcases override via ShowcaseTocContext */
  const [dynamicToc, setDynamicToc] = useState<TocEntry[] | null>(null)
  useEffect(() => { setDynamicToc(null) }, [activeId])
  const handleTocChange = useCallback((entries: TocEntry[]) => setDynamicToc(entries), [])
  const toc = dynamicToc ?? defaultToc

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
        <div className="max-w-[960px] mx-auto px-12 flex gap-8">
          <div className="flex-1 min-w-0 pt-16 pb-24">
            <ShowcaseTocContext.Provider value={handleTocChange}>
              <NavigateContext.Provider value={navigate}>
                <ActiveShowcase />
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
