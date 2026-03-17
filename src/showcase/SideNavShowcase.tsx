import { useState, useContext } from 'react'
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavDivider,
  SideNavPanel,
  SIDENAV_SIZES,
} from '@/components/SideNav'
import type { SideNavSize } from '@/components/SideNav'
import { BadgeLabel } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, SpecLabel, SpecValue, ColHeader } from './shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  PropsTable,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  TokenChainTable,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
  type TokenChainData,
} from './showcase-blocks'
import { extractHeader, extractSubComponentProps } from './spec-utils'
import sidenavSpec from '../../specs/sidenav.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(sidenavSpec)
const subComponentProps = extractSubComponentProps(sidenavSpec)

/* ─── Size spec ───────────────────────────────────────────────────────────── */

type SizeSpec = {
  height: string
  px: string
  gap: string
  radius: string
  icon: string
  typography: string
}

const SIZE_SPECS: Record<SideNavSize, SizeSpec> = {
  large:  { height: '44px', px: '12px', gap: '8px', radius: '8px', icon: '20px', typography: '15/semibold' },
  medium: { height: '36px', px: '12px', gap: '6px', radius: '6px', icon: '18px', typography: '14/semibold' },
  small:  { height: '32px', px: '10px', gap: '6px', radius: '6px', icon: '16px', typography: '13/semibold' },
}

const SIZE_PROPS: { key: keyof SizeSpec; label: string }[] = [
  { key: 'height',     label: 'Height' },
  { key: 'px',         label: 'Padding-X' },
  { key: 'gap',        label: 'Gap' },
  { key: 'radius',     label: 'Radius' },
  { key: 'icon',       label: 'Icon' },
  { key: 'typography', label: 'Font / Weight' },
]

/* ─── Demo icons ──────────────────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 10l7-7 7 7" />
      <path d="M5 8.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8.5" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="7" cy="7" r="3" />
      <path d="M2 17a5 5 0 0110 0" />
      <circle cx="14" cy="8" r="2.5" />
      <path d="M14.5 13a4 4 0 014 4" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M3.5 5.5l1.4 1.4M15.1 15.1l1.4 1.4M2 10h2M16 10h2M3.5 14.5l1.4-1.4M15.1 4.9l1.4-1.4" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M5 2h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M12 2v4h4" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="10" width="3" height="7" rx="0.5" />
      <rect x="8.5" y="6" width="3" height="11" rx="0.5" />
      <rect x="14" y="3" width="3" height="14" rx="0.5" />
    </svg>
  )
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size: { kind: 'select', options: SIDENAV_SIZES },
  },
  defaults: {
    size: 'medium',
  },
  render: (props) => (
    <div className="w-[240px]">
      <SideNav defaultValue="dashboard" size={props.size as SideNavSize}>
        <SideNavGroup label="General">
          <SideNavItem value="dashboard" icon={<HomeIcon />}>Dashboard</SideNavItem>
          <SideNavItem value="analytics" icon={<ChartIcon />}>Analytics</SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Management">
          <SideNavItem value="team" icon={<UsersIcon />}>Team</SideNavItem>
          <SideNavItem value="documents" icon={<FileIcon />}>Documents</SideNavItem>
          <SideNavItem value="settings" icon={<SettingsIcon />}>Settings</SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Primary navigation in admin panels or settings pages',
    'Hierarchical navigation with collapsible groups',
    'Persistent side menu with grouped sections',
  ],
  dontUse: [
    { text: 'Switching between content tabs', alternative: 'tab', alternativeLabel: 'Tab' },
    { text: 'Few options in a small area', alternative: 'segment-bar', alternativeLabel: 'SegmentBar' },
    { text: 'Temporary overlay navigation', alternative: 'drawer', alternativeLabel: 'Drawer' },
  ],
  related: [
    { id: 'tab', label: 'Tab' },
    { id: 'drawer', label: 'Drawer' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<SideNav defaultValue="overview">
  <SideNavItem value="overview">Overview</SideNavItem>
  <SideNavItem value="analytics">Analytics</SideNavItem>
  <SideNavItem value="settings">Settings</SideNavItem>
</SideNav>`,
  },
  {
    title: 'With collapsible groups',
    code: `<SideNav defaultValue="button">
  <SideNavGroup label="Actions">
    <SideNavItem value="button">Button</SideNavItem>
    <SideNavItem value="icon-button">IconButton</SideNavItem>
  </SideNavGroup>
  <SideNavGroup label="Inputs" defaultExpanded={false}>
    <SideNavItem value="textfield">TextField</SideNavItem>
    <SideNavItem value="select">Select</SideNavItem>
  </SideNavGroup>
</SideNav>`,
    description: 'SideNavGroup supports collapsible sections with smooth CSS grid transition. Set defaultExpanded={false} to start collapsed.',
  },
  {
    title: 'Controlled',
    code: `const [value, setValue] = useState('dashboard')

<SideNav value={value} onValueChange={setValue}>
  <SideNavItem value="dashboard" icon={<HomeIcon />}>
    Dashboard
  </SideNavItem>
  <SideNavItem value="settings" icon={<SettingsIcon />}>
    Settings
  </SideNavItem>
</SideNav>`,
    description: 'Pass value and onValueChange for controlled selection state.',
  },
  {
    title: 'With icons',
    code: `<SideNav defaultValue="home" size="large">
  <SideNavItem value="home" icon={<HomeIcon />}>Home</SideNavItem>
  <SideNavItem value="team" icon={<UsersIcon />}>Team</SideNavItem>
  <SideNavItem value="docs" icon={<FileIcon />}>Documents</SideNavItem>
  <SideNavItem value="stats" icon={<ChartIcon />}>Analytics</SideNavItem>
</SideNav>`,
    description: 'Icons are passed as ReactNode. Size is controlled by the parent SideNav size prop.',
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens',
    rows: [
      { component: '--comp-sidenav-text',          semantic: 'text-on-bright-500',     lightPrimitive: 'gray-500',        lightHex: '#73767d', darkPrimitive: 'gray-500',        darkHex: '#73767d' },
      { component: '--comp-sidenav-text-active',    semantic: 'text-on-bright-900',     lightPrimitive: 'gray-900',        lightHex: '#282a2f', darkPrimitive: 'gray-70',         darkHex: '#e1e2e5' },
      { component: '--comp-sidenav-text-disabled',  semantic: 'text-on-bright-400',     lightPrimitive: 'gray-400',        lightHex: '#9b9ea5', darkPrimitive: 'gray-600',        darkHex: '#54575e' },
      { component: '--comp-sidenav-group-text',     semantic: 'text-on-bright-400',     lightPrimitive: 'gray-400',        lightHex: '#9b9ea5', darkPrimitive: 'gray-600',        darkHex: '#54575e' },
      { component: '--comp-sidenav-bg-active',      semantic: 'state-on-bright-100',    lightPrimitive: 'black-alpha-100', lightHex: 'rgba(0,0,0,0.08)', darkPrimitive: 'black-alpha-100', darkHex: 'rgba(0,0,0,0.08)' },
      { component: '--comp-sidenav-focus-ring',     semantic: 'primary-300',            lightPrimitive: 'purple-300',      lightHex: '#c5afe9', darkPrimitive: 'purple-300',      darkHex: '#c5afe9' },
      { component: '--comp-sidenav-divider',        semantic: 'divider-solid-100',      lightPrimitive: 'gray-100',        lightHex: '#f0f1f3', darkPrimitive: 'gray-900',        darkHex: '#282a2f' },
    ],
  },
  {
    title: 'State Tokens',
    rows: [
      { component: '--comp-sidenav-hover',  semantic: 'state-on-bright-70',  lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)', darkPrimitive: 'black-alpha-70',  darkHex: 'rgba(0,0,0,0.06)' },
      { component: '--comp-sidenav-active', semantic: 'state-on-bright-100', lightPrimitive: 'black-alpha-100', lightHex: 'rgba(0,0,0,0.08)', darkPrimitive: 'black-alpha-100', darkHex: 'rgba(0,0,0,0.08)' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-sidenav-item-height-lg', value: '44px' },
      { name: '--comp-sidenav-item-height-md', value: '36px' },
      { name: '--comp-sidenav-item-height-sm', value: '32px' },
      { name: '--comp-sidenav-item-px-lg',     value: '12px (var(--spacing-3))' },
      { name: '--comp-sidenav-item-px-md',     value: '12px (var(--spacing-3))' },
      { name: '--comp-sidenav-item-px-sm',     value: '10px (var(--spacing-2.5))' },
      { name: '--comp-sidenav-item-gap-lg',    value: '8px (var(--spacing-2))' },
      { name: '--comp-sidenav-item-gap-md',    value: '6px (var(--spacing-1.5))' },
      { name: '--comp-sidenav-item-gap-sm',    value: '6px (var(--spacing-1.5))' },
    ],
  },
  {
    title: 'Border Radius',
    scope: ':root',
    tokens: [
      { name: '--comp-sidenav-item-radius-lg', value: '8px (var(--radius-2))' },
      { name: '--comp-sidenav-item-radius-md', value: '6px (var(--radius-1.5))' },
      { name: '--comp-sidenav-item-radius-sm', value: '6px (var(--radius-1.5))' },
    ],
  },
  {
    title: 'Icon Size',
    scope: ':root',
    tokens: [
      { name: '--comp-sidenav-icon-lg', value: '20px' },
      { name: '--comp-sidenav-icon-md', value: '18px' },
      { name: '--comp-sidenav-icon-sm', value: '16px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SIDENAV_TOC: TocEntry[] = [
  { id: 'component-sidenav',    label: 'SideNav',            level: 1 },
  { id: 'sidenav-playground',   label: 'Playground'                    },
  { id: 'sidenav-anatomy',      label: 'Anatomy'                       },
  { id: 'sidenav-sizes',        label: 'Sizes'                         },
  { id: 'sidenav-groups',       label: 'Groups'                        },
  { id: 'sidenav-icons',        label: 'With Icons'                    },
  { id: 'sidenav-badges',       label: 'With Badges'                   },
  { id: 'sidenav-divider',      label: 'Divider'                       },
  { id: 'sidenav-flat',         label: 'Flat (No Groups)'              },
  { id: 'sidenav-panel',        label: 'Panel (Tab Mode)'              },
  { id: 'sidenav-states',       label: 'States'                        },
  { id: 'sidenav-usage',        label: 'Usage Guidelines'              },
  { id: 'sidenav-props',        label: 'Props'                         },
  { id: 'sidenav-code',         label: 'Code Examples'                 },
  { id: 'sidenav-tokens',       label: 'Design Tokens'                 },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SideNavShowcase() {
  const navigate = useContext(NavigateContext)

  /* Size demos */
  const [sizeValues, setSizeValues] = useState<Record<SideNavSize, string>>({
    large: 'overview', medium: 'overview', small: 'overview',
  })

  /* Group demos (per size) */
  const [groupValues, setGroupValues] = useState<Record<SideNavSize, string>>({
    large: 'button', medium: 'button', small: 'button',
  })

  /* Icon demo */
  const [iconVal, setIconVal] = useState('dashboard')

  /* Badge demo */
  const [badgeVal, setBadgeVal] = useState('inbox')

  /* Divider demo */
  const [dividerVal, setDividerVal] = useState('projects')

  /* Flat demo */
  const [flatVal, setFlatVal] = useState('overview')

  /* Panel demo */
  const [panelVal, setPanelVal] = useState('general')

  /* States demo */
  const [stateVal, setStateVal] = useState('active')

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-sidenav"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="sidenav-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="sidenav-anatomy"
        title="Anatomy"
        description="SideNav's compound component structure with groups, items, dividers, and panels."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`SideNav (root, <nav>)
\u251c\u2500\u2500 SideNavGroup          \u2014 collapsible section
\u2502   \u251c\u2500\u2500 header (button)    \u2014 label + chevron icon
\u2502   \u2514\u2500\u2500 collapsible <ul>   \u2014 grid-rows transition
\u2502       \u2514\u2500\u2500 SideNavItem    \u2014 <li> > <button>
\u2502           \u251c\u2500\u2500 icon         \u2014 ReactNode, flex-shrink-0
\u2502           \u251c\u2500\u2500 label        \u2014 children (text), truncate
\u2502           \u2514\u2500\u2500 badge        \u2014 ReactNode, ml-auto
\u251c\u2500\u2500 SideNavItem (flat)     \u2014 without group wrapper
\u251c\u2500\u2500 SideNavDivider         \u2014 <hr> visual separator
\u2514\u2500\u2500 SideNavPanel           \u2014 role=tabpanel, value-matched`}
        </pre>
      </ShowcaseSection>

      {/* 4a. Sizes */}
      <section id="sidenav-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>

        {/* Size spec table */}
        <div className="grid grid-cols-[100px_repeat(3,1fr)] gap-x-4 gap-y-0 mb-6">
          <div />
          {SIDENAV_SIZES.map(s => (
            <ColHeader key={s}>{s}</ColHeader>
          ))}

          {SIZE_PROPS.map(prop => (
            <>
              <SpecLabel key={`lbl-${prop.key}`}>{prop.label}</SpecLabel>
              {SIDENAV_SIZES.map(s => (
                <SpecValue key={`${prop.key}-${s}`}>{SIZE_SPECS[s][prop.key]}</SpecValue>
              ))}
            </>
          ))}
        </div>

        {/* Size live previews */}
        <div className="flex gap-8">
          {SIDENAV_SIZES.map(s => (
            <div key={s} className="flex-1 min-w-0">
              <div className="mb-3 flex items-baseline gap-2">
                <SpecLabel>{s}</SpecLabel>
                <span className="typography-12-regular text-semantic-text-on-bright-400">
                  {SIZE_SPECS[s].height} / {SIZE_SPECS[s].typography}
                </span>
              </div>
              <div className="border border-semantic-divider-solid-100 rounded-2 p-3">
                <SideNav
                  size={s}
                  value={sizeValues[s]}
                  onValueChange={v => setSizeValues(prev => ({ ...prev, [s]: v }))}
                >
                  <SideNavItem value="overview">Overview</SideNavItem>
                  <SideNavItem value="analytics">Analytics</SideNavItem>
                  <SideNavItem value="reports">Reports</SideNavItem>
                  <SideNavItem value="settings">Settings</SideNavItem>
                </SideNav>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4b. Groups */}
      <section id="sidenav-groups" className="mb-12 scroll-mt-6">
        <SectionTitle>Groups</SectionTitle>
        <div className="flex gap-8">
          {SIDENAV_SIZES.map(s => (
            <div key={s} className="flex-1 min-w-0">
              <div className="mb-3">
                <SpecLabel>{s}</SpecLabel>
              </div>
              <div className="border border-semantic-divider-solid-100 rounded-2 p-3">
                <SideNav
                  size={s}
                  value={groupValues[s]}
                  onValueChange={v => setGroupValues(prev => ({ ...prev, [s]: v }))}
                >
                  <SideNavGroup label="Actions">
                    <SideNavItem value="button">Button</SideNavItem>
                    <SideNavItem value="icon-button">IconButton</SideNavItem>
                  </SideNavGroup>
                  <SideNavGroup label="Inputs">
                    <SideNavItem value="textfield">TextField</SideNavItem>
                    <SideNavItem value="textarea">Textarea</SideNavItem>
                    <SideNavItem value="select">Select</SideNavItem>
                  </SideNavGroup>
                  <SideNavGroup label="Display">
                    <SideNavItem value="badge">Badge</SideNavItem>
                    <SideNavItem value="chip">Chip</SideNavItem>
                  </SideNavGroup>
                </SideNav>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4c. With Icons */}
      <section id="sidenav-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={iconVal} onValueChange={setIconVal} size="large">
            <SideNavItem value="dashboard" icon={<HomeIcon />}>Dashboard</SideNavItem>
            <SideNavItem value="team" icon={<UsersIcon />}>Team</SideNavItem>
            <SideNavItem value="documents" icon={<FileIcon />}>Documents</SideNavItem>
            <SideNavItem value="analytics" icon={<ChartIcon />}>Analytics</SideNavItem>
            <SideNavItem value="settings" icon={<SettingsIcon />}>Settings</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* 4d. With Badges */}
      <section id="sidenav-badges" className="mb-12 scroll-mt-6">
        <SectionTitle>With Badges</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={badgeVal} onValueChange={setBadgeVal}>
            <SideNavItem value="inbox" icon={<HomeIcon />} badge={<BadgeLabel color="indigo" size="small">3</BadgeLabel>}>
              Inbox
            </SideNavItem>
            <SideNavItem value="sent" icon={<FileIcon />}>Sent</SideNavItem>
            <SideNavItem value="drafts" icon={<FileIcon />} badge={<BadgeLabel color="gray" size="small">12</BadgeLabel>}>
              Drafts
            </SideNavItem>
            <SideNavItem value="archive" icon={<FileIcon />}>Archive</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* 4e. Divider */}
      <section id="sidenav-divider" className="mb-12 scroll-mt-6">
        <SectionTitle>Divider</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={dividerVal} onValueChange={setDividerVal}>
            <SideNavGroup label="Workspace">
              <SideNavItem value="projects">Projects</SideNavItem>
              <SideNavItem value="tasks">Tasks</SideNavItem>
            </SideNavGroup>
            <SideNavDivider />
            <SideNavItem value="settings" icon={<SettingsIcon />}>Settings</SideNavItem>
            <SideNavItem value="help">Help & Support</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* 4f. Flat (No Groups) */}
      <section id="sidenav-flat" className="mb-12 scroll-mt-6">
        <SectionTitle>Flat (No Groups)</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={flatVal} onValueChange={setFlatVal} size="small">
            <SideNavItem value="overview">Overview</SideNavItem>
            <SideNavItem value="analytics">Analytics</SideNavItem>
            <SideNavItem value="reports">Reports</SideNavItem>
            <SideNavItem value="exports">Exports</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* 4g. Panel (Tab Mode) */}
      <section id="sidenav-panel" className="mb-12 scroll-mt-6">
        <SectionTitle>Panel (Tab Mode)</SectionTitle>
        <SideNav value={panelVal} onValueChange={setPanelVal} size="small" className="border border-semantic-divider-solid-100 rounded-2 overflow-hidden">
          <div className="flex">
            <div className="w-[200px] shrink-0 p-3 border-r border-semantic-divider-solid-100">
              <SideNavItem value="general">General</SideNavItem>
              <SideNavItem value="appearance">Appearance</SideNavItem>
              <SideNavItem value="notifications">Notifications</SideNavItem>
              <SideNavItem value="security">Security</SideNavItem>
            </div>
            <div className="flex-1 p-6">
              <SideNavPanel value="general">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">General</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  General settings panel content.
                </p>
              </SideNavPanel>
              <SideNavPanel value="appearance">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">Appearance</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  Theme, color, and display settings.
                </p>
              </SideNavPanel>
              <SideNavPanel value="notifications">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">Notifications</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  Manage notification preferences.
                </p>
              </SideNavPanel>
              <SideNavPanel value="security">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">Security</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  Password, 2FA, and security options.
                </p>
              </SideNavPanel>
            </div>
          </div>
        </SideNav>
      </section>

      {/* 4h. States */}
      <section id="sidenav-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <SpecLabel>Individual disabled</SpecLabel>
            <div className="border border-semantic-divider-solid-100 rounded-2 p-3 mt-2">
              <SideNav value={stateVal} onValueChange={setStateVal}>
                <SideNavItem value="active">Active</SideNavItem>
                <SideNavItem value="disabled-item" disabled>Disabled Item</SideNavItem>
                <SideNavItem value="another">Another</SideNavItem>
              </SideNav>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <SpecLabel>Global disabled</SpecLabel>
            <div className="border border-semantic-divider-solid-100 rounded-2 p-3 mt-2">
              <SideNav defaultValue="first" disabled>
                <SideNavItem value="first">First</SideNavItem>
                <SideNavItem value="second">Second</SideNavItem>
                <SideNavItem value="third">Third</SideNavItem>
              </SideNav>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="sidenav-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-component) */}
      <ShowcaseSection id="sidenav-props" title="Props">
        {subComponentProps.map((sub) => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="sidenav-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="sidenav-tokens"
        title="Design Tokens"
        description="Component \u2192 Semantic \u2192 Primitive resolution chain. Color tokens switch by theme, size tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
