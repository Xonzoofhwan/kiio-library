import { useState } from 'react'
import { TabGroup, TabList, TabItem, TabPanel, TAB_VARIANTS, TAB_SIZES } from '@/components/Tab'
import type { TabVariant, TabSize } from '@/components/Tab'
import { BadgeCounter } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SpecLabel, BookIcon, StarIcon, GridIcon } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TAB_TOC: TocEntry[] = [
  { id: 'component-tab',         label: 'Tab',                              level: 1 },
  { id: 'tab-underline-size',    label: 'Underline × Size'                           },
  { id: 'tab-filled-size',       label: 'Pill × Size'                                },
  { id: 'tab-states',            label: 'States'                                     },
  { id: 'tab-icons-badge',       label: 'With Icons & Badge'                         },
  { id: 'tab-scrollable',        label: 'Scrollable'                                 },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

type TabState = Record<TabVariant, Record<TabSize, string>>

export function TabShowcase() {
  const [tabStates, setTabStates] = useState<TabState>(() => {
    const initial = {} as TabState
    for (const v of TAB_VARIANTS) {
      initial[v] = {} as Record<TabSize, string>
      for (const s of TAB_SIZES) {
        initial[v][s] = 'overview'
      }
    }
    return initial
  })

  const [statesTab, setStatesTab] = useState('tab1')
  const [iconsTab, setIconsTab] = useState('home')
  const [scrollTab, setScrollTab] = useState('tab1')

  function setTab(variant: TabVariant, size: TabSize, value: string) {
    setTabStates(prev => ({
      ...prev,
      [variant]: { ...prev[variant], [size]: value },
    }))
  }

  const scrollTabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8', 'Tab 9', 'Tab 10']

  return (
    <>
      <h1 id="component-tab" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        Tab
      </h1>

      {/* Underline × Size */}
      <section id="tab-underline-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Underline × Size</SectionTitle>
        <div className="flex flex-col gap-8">
          {TAB_SIZES.map(size => (
            <div key={size}>
              <SpecLabel>{size}</SpecLabel>
              <div className="mt-2">
                <TabGroup
                  variant="underline"
                  size={size}
                  value={tabStates['underline'][size]}
                  onValueChange={v => setTab('underline', size, v)}
                >
                  <TabList>
                    <TabItem value="overview">Overview</TabItem>
                    <TabItem value="details">Details</TabItem>
                    <TabItem value="disabled" disabled>Disabled</TabItem>
                    <TabItem value="settings">Settings</TabItem>
                  </TabList>
                  <TabPanel value="overview">
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Overview content — 선택된 탭 패널.</div>
                  </TabPanel>
                  <TabPanel value="details">
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Details content.</div>
                  </TabPanel>
                  <TabPanel value="settings">
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Settings content.</div>
                  </TabPanel>
                </TabGroup>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pill × Size */}
      <section id="tab-filled-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Pill × Size</SectionTitle>
        <div className="flex flex-col gap-8">
          {TAB_SIZES.map(size => (
            <div key={size}>
              <SpecLabel>{size}</SpecLabel>
              <div className="mt-2">
                <TabGroup
                  variant="pill"
                  size={size}
                  value={tabStates['pill'][size]}
                  onValueChange={v => setTab('pill', size, v)}
                >
                  <TabList>
                    <TabItem value="overview">Overview</TabItem>
                    <TabItem value="details">Details</TabItem>
                    <TabItem value="disabled" disabled>Disabled</TabItem>
                    <TabItem value="settings">Settings</TabItem>
                  </TabList>
                  <TabPanel value="overview">
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Overview content — 선택된 탭 패널.</div>
                  </TabPanel>
                  <TabPanel value="details">
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Details content.</div>
                  </TabPanel>
                  <TabPanel value="settings">
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Settings content.</div>
                  </TabPanel>
                </TabGroup>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* States */}
      <section id="tab-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>

        <SpecLabel>Individual disabled tab</SpecLabel>
        <div className="mt-2 mb-6">
          <TabGroup variant="underline" value={statesTab} onValueChange={setStatesTab}>
            <TabList>
              <TabItem value="tab1">Active</TabItem>
              <TabItem value="tab2" disabled>Disabled</TabItem>
              <TabItem value="tab3">Selected + Disabled (see below)</TabItem>
              <TabItem value="tab4">Normal</TabItem>
            </TabList>
            <TabPanel value="tab1"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Tab 1 content</div></TabPanel>
            <TabPanel value="tab3"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Tab 3 content</div></TabPanel>
            <TabPanel value="tab4"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Tab 4 content</div></TabPanel>
          </TabGroup>
        </div>

        <SpecLabel>Global disabled</SpecLabel>
        <div className="mt-2 mb-6">
          <TabGroup variant="underline" defaultValue="tab1" disabled>
            <TabList>
              <TabItem value="tab1">Tab 1</TabItem>
              <TabItem value="tab2">Tab 2</TabItem>
              <TabItem value="tab3">Tab 3</TabItem>
            </TabList>
          </TabGroup>
        </div>

        <SpecLabel>Pill — individual disabled tab</SpecLabel>
        <div className="mt-2">
          <TabGroup variant="pill" defaultValue="tab1">
            <TabList>
              <TabItem value="tab1">Active</TabItem>
              <TabItem value="tab2" disabled>Disabled</TabItem>
              <TabItem value="tab3">Normal</TabItem>
            </TabList>
          </TabGroup>
        </div>
      </section>

      {/* With Icons & Badge */}
      <section id="tab-icons-badge" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons &amp; Badge</SectionTitle>

        <SpecLabel>Underline — icons &amp; badge</SpecLabel>
        <div className="mt-2 mb-6">
          <TabGroup variant="underline" value={iconsTab} onValueChange={setIconsTab}>
            <TabList>
              <TabItem value="home" icon={<GridIcon />}>홈</TabItem>
              <TabItem value="favorites" icon={<StarIcon />} badge={<BadgeCounter>{5}</BadgeCounter>}>즐겨찾기</TabItem>
              <TabItem value="library" icon={<BookIcon />}>라이브러리</TabItem>
              <TabItem value="settings" badge={<BadgeCounter>{2}</BadgeCounter>}>설정</TabItem>
            </TabList>
            <TabPanel value="home"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">홈 콘텐츠</div></TabPanel>
            <TabPanel value="favorites"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">즐겨찾기 5개</div></TabPanel>
            <TabPanel value="library"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">라이브러리 콘텐츠</div></TabPanel>
            <TabPanel value="settings"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">설정 콘텐츠</div></TabPanel>
          </TabGroup>
        </div>

        <SpecLabel>Pill — icons &amp; badge</SpecLabel>
        <div className="mt-2">
          <TabGroup variant="pill" defaultValue="home">
            <TabList>
              <TabItem value="home" icon={<GridIcon />}>홈</TabItem>
              <TabItem value="favorites" icon={<StarIcon />} badge={<BadgeCounter>{3}</BadgeCounter>}>즐겨찾기</TabItem>
              <TabItem value="library" icon={<BookIcon />}>라이브러리</TabItem>
            </TabList>
          </TabGroup>
        </div>
      </section>

      {/* Scrollable */}
      <section id="tab-scrollable" className="mb-12 scroll-mt-6">
        <SectionTitle>Scrollable (overflow + fade gradients)</SectionTitle>

        <SpecLabel>Underline — 10 tabs (narrow container)</SpecLabel>
        <div className="mt-2 mb-6 max-w-sm">
          <TabGroup variant="underline" value={scrollTab} onValueChange={setScrollTab}>
            <TabList>
              {scrollTabs.map((label, i) => (
                <TabItem key={label} value={`tab${i + 1}`}>{label}</TabItem>
              ))}
            </TabList>
            {scrollTabs.map((label, i) => (
              <TabPanel key={label} value={`tab${i + 1}`}>
                <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">{label} content</div>
              </TabPanel>
            ))}
          </TabGroup>
        </div>

        <SpecLabel>Pill — 8 tabs (narrow container)</SpecLabel>
        <div className="mt-2 max-w-xs">
          <TabGroup variant="pill" defaultValue="tab1">
            <TabList>
              {scrollTabs.slice(0, 8).map((label, i) => (
                <TabItem key={label} value={`tab${i + 1}`}>{label}</TabItem>
              ))}
            </TabList>
          </TabGroup>
        </div>
      </section>
    </>
  )
}
