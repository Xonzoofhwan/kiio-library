import { useState, useContext } from 'react'
import { TabGroup, TabList, TabItem, TabPanel, TAB_VARIANTS, TAB_SIZES } from '@/components/Tab'
import type { TabVariant, TabSize } from '@/components/Tab'
import { BadgeCounter } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, SpecLabel, BookIcon, StarIcon, GridIcon } from './shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  PropsTable,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
} from './showcase-blocks'
import { extractHeader, extractSubComponentProps } from './spec-utils'
import tabSpec from '../../specs/tab.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(tabSpec)
const subComponentProps = extractSubComponentProps(tabSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant: { kind: 'select', options: TAB_VARIANTS },
    size:    { kind: 'select', options: TAB_SIZES },
  },
  defaults: {
    variant: 'underline',
    size: 'large',
  },
  render: (props) => (
    <TabGroup
      variant={props.variant as TabVariant}
      size={props.size as TabSize}
      defaultValue="tab1"
    >
      <TabList>
        <TabItem value="tab1">Overview</TabItem>
        <TabItem value="tab2">Details</TabItem>
        <TabItem value="tab3">Settings</TabItem>
      </TabList>
      <TabPanel value="tab1">
        <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Overview content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Details content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Settings content</div>
      </TabPanel>
    </TabGroup>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Organizing content into mutually exclusive views',
    'Top-level navigation within a section',
    'Switching between related data views',
  ],
  dontUse: [
    { text: 'Side navigation with hierarchy', alternative: 'sidenav', alternativeLabel: 'SideNav' },
    { text: 'Filtering content (multi-select)', alternative: 'chip', alternativeLabel: 'Chip' },
    { text: 'Toggling a single setting', alternative: 'switch', alternativeLabel: 'Switch' },
  ],
  related: [
    { id: 'sidenav', label: 'SideNav' },
    { id: 'segment-bar', label: 'SegmentBar' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<TabGroup defaultValue="tab1">
  <TabList>
    <TabItem value="tab1">Overview</TabItem>
    <TabItem value="tab2">Details</TabItem>
    <TabItem value="tab3">Settings</TabItem>
  </TabList>
  <TabPanel value="tab1">Overview content</TabPanel>
  <TabPanel value="tab2">Details content</TabPanel>
  <TabPanel value="tab3">Settings content</TabPanel>
</TabGroup>`,
  },
  {
    title: 'With icons',
    code: `<TabGroup defaultValue="home">
  <TabList>
    <TabItem value="home" icon={<GridIcon />}>Home</TabItem>
    <TabItem value="favorites" icon={<StarIcon />}>Favorites</TabItem>
    <TabItem value="library" icon={<BookIcon />}>Library</TabItem>
  </TabList>
</TabGroup>`,
  },
  {
    title: 'Controlled',
    code: `const [tab, setTab] = useState('overview')

<TabGroup value={tab} onValueChange={setTab}>
  <TabList>
    <TabItem value="overview">Overview</TabItem>
    <TabItem value="details">Details</TabItem>
  </TabList>
  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="details">Details content</TabPanel>
</TabGroup>`,
    description: 'Pass value and onValueChange for full control over the selected tab.',
  },
  {
    title: 'Scrollable',
    code: `<div style={{ maxWidth: 320 }}>
  <TabGroup defaultValue="tab1">
    <TabList showScrollButtons>
      {Array.from({ length: 10 }, (_, i) => (
        <TabItem key={i} value={\`tab\${i + 1}\`}>
          Tab {i + 1}
        </TabItem>
      ))}
    </TabList>
  </TabGroup>
</div>`,
    description: 'When tabs overflow, fade gradients appear. Use showScrollButtons on TabList for chevron navigation.',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Underline Size',
    scope: ':root',
    tokens: [
      { name: '--comp-tab-height-underline-large', value: '40px' },
      { name: '--comp-tab-height-underline-medium', value: '32px' },
      { name: '--comp-tab-padding-x-underline-large', value: '0px' },
      { name: '--comp-tab-padding-x-underline-medium', value: '0px' },
      { name: '--comp-tab-gap-underline-large', value: '6px' },
      { name: '--comp-tab-gap-underline-medium', value: '4px' },
      { name: '--comp-tab-icon-size-underline-large', value: '18px' },
      { name: '--comp-tab-icon-size-underline-medium', value: '14px' },
      { name: '--comp-tab-indicator-height-underline-large', value: '2px' },
      { name: '--comp-tab-indicator-height-underline-medium', value: '2px' },
    ],
  },
  {
    title: 'Pill Size',
    scope: ':root',
    tokens: [
      { name: '--comp-tab-height-pill-large', value: '40px' },
      { name: '--comp-tab-height-pill-medium', value: '32px' },
      { name: '--comp-tab-padding-x-pill-large', value: '16px' },
      { name: '--comp-tab-padding-x-pill-medium', value: '12px' },
      { name: '--comp-tab-gap-pill-large', value: '6px' },
      { name: '--comp-tab-gap-pill-medium', value: '4px' },
      { name: '--comp-tab-icon-size-pill-large', value: '18px' },
      { name: '--comp-tab-icon-size-pill-medium', value: '14px' },
      { name: '--comp-tab-radius-pill-large', value: '20px' },
      { name: '--comp-tab-radius-pill-medium', value: '16px' },
    ],
  },
  {
    title: 'List Layout',
    scope: ':root',
    tokens: [
      { name: '--comp-tab-list-gap-underline', value: '16px' },
      { name: '--comp-tab-list-gap-pill', value: '8px' },
      { name: '--comp-tab-list-padding-y-pill', value: '8px' },
      { name: '--comp-tab-scroll-fade-width', value: '24px' },
    ],
  },
  {
    title: 'Color Tokens (underline)',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-tab-label-underline', value: 'neutral-solid-500' },
      { name: '--comp-tab-label-underline-selected', value: 'neutral-solid-950' },
      { name: '--comp-tab-label-underline-disabled', value: 'neutral-solid-400' },
      { name: '--comp-tab-label-underline-selected-disabled', value: 'neutral-solid-400' },
      { name: '--comp-tab-indicator-underline', value: 'neutral-solid-950' },
      { name: '--comp-tab-indicator-underline-disabled', value: 'neutral-solid-200' },
      { name: '--comp-tab-border-underline', value: 'neutral-solid-200' },
      { name: '--comp-tab-hover-underline', value: 'state-on-bright-50' },
      { name: '--comp-tab-pressed-underline', value: 'state-on-bright-70' },
    ],
  },
  {
    title: 'Color Tokens (pill)',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-tab-label-pill', value: 'neutral-solid-500' },
      { name: '--comp-tab-label-pill-selected', value: 'neutral-solid-0' },
      { name: '--comp-tab-label-pill-disabled', value: 'neutral-solid-400' },
      { name: '--comp-tab-label-pill-selected-disabled', value: 'neutral-solid-400' },
      { name: '--comp-tab-bg-pill', value: 'neutral-solid-70' },
      { name: '--comp-tab-bg-pill-selected', value: 'neutral-solid-950' },
      { name: '--comp-tab-bg-pill-disabled', value: 'neutral-solid-70' },
      { name: '--comp-tab-bg-pill-selected-disabled', value: 'neutral-solid-200' },
      { name: '--comp-tab-hover-pill', value: 'state-on-bright-50' },
      { name: '--comp-tab-pressed-pill', value: 'state-on-bright-70' },
      { name: '--comp-tab-hover-pill-selected', value: 'state-on-dim-50' },
      { name: '--comp-tab-pressed-pill-selected', value: 'state-on-dim-70' },
    ],
  },
  {
    title: 'Shared Color Tokens',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-tab-list-bg-pill', value: 'background-0' },
      { name: '--comp-tab-focus-ring', value: 'primary-300' },
    ],
  },
]

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const TAB_TOC: TocEntry[] = [
  { id: 'component-tab',         label: 'Tab',                              level: 1 },
  { id: 'tab-playground',        label: 'Playground'                                  },
  { id: 'tab-anatomy',           label: 'Anatomy'                                     },
  { id: 'tab-underline-size',    label: 'Underline \u00d7 Size'                       },
  { id: 'tab-filled-size',       label: 'Pill \u00d7 Size'                            },
  { id: 'tab-states',            label: 'States'                                      },
  { id: 'tab-icons-badge',       label: 'With Icons, Badge & Indicator'               },
  { id: 'tab-scrollable',        label: 'Scrollable'                                  },
  { id: 'tab-scroll-buttons',    label: 'Scrollable + Chevron Buttons'                },
  { id: 'tab-usage',             label: 'Usage Guidelines'                            },
  { id: 'tab-props',             label: 'Props'                                       },
  { id: 'tab-code',              label: 'Code Examples'                               },
  { id: 'tab-tokens',            label: 'Design Tokens'                               },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

type TabState = Record<TabVariant, Record<TabSize, string>>

export function TabShowcase() {
  const navigate = useContext(NavigateContext)

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
  const [scrollBtnTab, setScrollBtnTab] = useState('tab1')

  function setTab(variant: TabVariant, size: TabSize, value: string) {
    setTabStates(prev => ({
      ...prev,
      [variant]: { ...prev[variant], [size]: value },
    }))
  }

  const scrollTabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8', 'Tab 9', 'Tab 10']

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-tab"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="tab-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="tab-anatomy"
        title="Anatomy"
        description="Tab's compound component structure with context-driven variant/size propagation and sliding indicator."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`TabGroup (root, context provider)
\u251c\u2500\u2500 TabList              \u2014 role=tablist, scroll container
\u2502   \u251c\u2500\u2500 TabItem          \u2014 role=tab, icon + label + badge/indicator
\u2502   \u2502   \u2514\u2500\u2500 state overlay \u2014 sibling <span>, group-hover / group-active
\u2502   \u251c\u2500\u2500 TabItem          \u2014 ...
\u2502   \u2514\u2500\u2500 sliding indicator \u2014 underline: absolute bar, offsetLeft-based
\u2514\u2500\u2500 TabPanel             \u2014 role=tabpanel, conditional render by value`}
        </pre>
      </ShowcaseSection>

      {/* 4a. Underline x Size */}
      <section id="tab-underline-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Underline &times; Size</SectionTitle>
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
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Overview content</div>
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

      {/* 4b. Pill x Size */}
      <section id="tab-filled-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Pill &times; Size</SectionTitle>
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
                    <div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Overview content</div>
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

      {/* 4c. States */}
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

      {/* 4d. With Icons, Badge & Indicator */}
      <section id="tab-icons-badge" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons, Badge &amp; Indicator</SectionTitle>

        <SpecLabel>Underline — counter badge (inline)</SpecLabel>
        <div className="mt-2 mb-6">
          <TabGroup variant="underline" value={iconsTab} onValueChange={setIconsTab}>
            <TabList>
              <TabItem value="home" icon={<GridIcon />}>Home</TabItem>
              <TabItem value="favorites" icon={<StarIcon />} badge={<BadgeCounter>{5}</BadgeCounter>}>Favorites</TabItem>
              <TabItem value="library" icon={<BookIcon />}>Library</TabItem>
              <TabItem value="settings" badge={<BadgeCounter>{2}</BadgeCounter>}>Settings</TabItem>
            </TabList>
            <TabPanel value="home"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Home content</div></TabPanel>
            <TabPanel value="favorites"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Favorites (5)</div></TabPanel>
            <TabPanel value="library"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Library content</div></TabPanel>
            <TabPanel value="settings"><div className="pt-4 typography-14-regular text-semantic-text-on-bright-700">Settings content</div></TabPanel>
          </TabGroup>
        </div>

        <SpecLabel>Underline — indicator dot (overlay)</SpecLabel>
        <div className="mt-2 mb-6">
          <TabGroup variant="underline" defaultValue="home">
            <TabList>
              <TabItem value="home" icon={<GridIcon />}>Home</TabItem>
              <TabItem value="favorites" icon={<StarIcon />} showIndicator>Favorites</TabItem>
              <TabItem value="library" icon={<BookIcon />}>Library</TabItem>
              <TabItem value="settings" showIndicator>Settings</TabItem>
            </TabList>
          </TabGroup>
        </div>

        <SpecLabel>Pill — counter badge (overlay)</SpecLabel>
        <div className="mt-2 mb-6">
          <TabGroup variant="pill" defaultValue="home">
            <TabList>
              <TabItem value="home" icon={<GridIcon />}>Home</TabItem>
              <TabItem value="favorites" icon={<StarIcon />} badge={<BadgeCounter>{3}</BadgeCounter>}>Favorites</TabItem>
              <TabItem value="library" icon={<BookIcon />}>Library</TabItem>
            </TabList>
          </TabGroup>
        </div>

        <SpecLabel>Pill — indicator dot (inline)</SpecLabel>
        <div className="mt-2">
          <TabGroup variant="pill" defaultValue="home">
            <TabList>
              <TabItem value="home" icon={<GridIcon />}>Home</TabItem>
              <TabItem value="favorites" icon={<StarIcon />} showIndicator>Favorites</TabItem>
              <TabItem value="library" icon={<BookIcon />}>Library</TabItem>
              <TabItem value="settings" showIndicator>Settings</TabItem>
            </TabList>
          </TabGroup>
        </div>
      </section>

      {/* 4e. Scrollable */}
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

      {/* 4f. Scrollable + Chevron Buttons */}
      <section id="tab-scroll-buttons" className="mb-12 scroll-mt-6">
        <SectionTitle>Scrollable + Chevron Buttons</SectionTitle>

        <SpecLabel>Underline — showScrollButtons</SpecLabel>
        <div className="mt-2 mb-6 max-w-sm">
          <TabGroup variant="underline" value={scrollBtnTab} onValueChange={setScrollBtnTab}>
            <TabList showScrollButtons>
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

        <SpecLabel>Pill — showScrollButtons</SpecLabel>
        <div className="mt-2 max-w-xs">
          <TabGroup variant="pill" defaultValue="tab1">
            <TabList showScrollButtons>
              {scrollTabs.slice(0, 8).map((label, i) => (
                <TabItem key={label} value={`tab${i + 1}`}>{label}</TabItem>
              ))}
            </TabList>
          </TabGroup>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="tab-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-component props) */}
      <ShowcaseSection id="tab-props" title="Props">
        {subComponentProps.map((sub) => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="tab-code" title="Code Examples">
        {codeExamples.map((ex) => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="tab-tokens"
        title="Design Tokens"
        description="Size tokens defined at :root scope. Color tokens switch by theme via [data-theme] scope."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
