import { useState, useContext } from 'react'
import {
  SegmentBar,
  SegmentButton,
  SEGMENT_SIZES,
  SEGMENT_SHAPES,
  SEGMENT_WIDTHS,
} from '@/components/SegmentBar'
import type { SegmentSize, SegmentShape } from '@/components/SegmentBar'
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
import { extractSubComponentProps, extractHeader } from './spec-utils'
import segmentBarSpec from '../../specs/segment-bar.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(segmentBarSpec)
const subComponentProps = extractSubComponentProps(segmentBarSpec)

/* ─── Size spec ───────────────────────────────────────────────────────────── */

const SIZE_SPECS: Record<SegmentSize, { height: string; font: string; px: string; gap: string; radius: string; icon: string }> = {
  large:  { height: '48px', font: '17 SB', px: '16px', gap: '6px', radius: '12px', icon: '18px' },
  medium: { height: '36px', font: '16 M',  px: '12px', gap: '6px', radius: '10px', icon: '18px' },
  small:  { height: '28px', font: '14 M',  px: '10px', gap: '4px', radius: '8px',  icon: '16px' },
  xSmall: { height: '20px', font: '13 M',  px: '6px',  gap: '4px', radius: '6px',  icon: '16px' },
}

const SIZE_PROP_KEYS: { key: keyof typeof SIZE_SPECS.large; label: string }[] = [
  { key: 'height', label: 'Height' },
  { key: 'px',     label: 'Padding-X' },
  { key: 'gap',    label: 'Gap' },
  { key: 'font',   label: 'Font / LH' },
  { key: 'radius', label: 'Btn Radius' },
  { key: 'icon',   label: 'Icon' },
]

/* ─── Demo icons (inline SVG) ─────────────────────────────────────────────── */

function GridIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="6" height="6" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
      <path d="M6 4h9M6 9h9M6 14h9M3 4h0M3 9h0M3 14h0" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="8" width="4" height="8" rx="0.5" />
      <rect x="7" y="4" width="4" height="12" rx="0.5" />
      <rect x="12" y="2" width="4" height="14" rx="0.5" />
    </svg>
  )
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:     { kind: 'select', options: SEGMENT_SIZES },
    shape:    { kind: 'select', options: SEGMENT_SHAPES },
    width:    { kind: 'select', options: SEGMENT_WIDTHS },
    disabled: { kind: 'boolean' },
  },
  defaults: {
    size: 'medium',
    shape: 'square',
    width: 'fixed',
    disabled: false,
  },
  render: (props) => {
    return (
      <SegmentBar
        size={props.size as SegmentSize}
        shape={props.shape as SegmentShape}
        width={props.width as 'fixed' | 'hug'}
        disabled={props.disabled as boolean}
        defaultValue="tab1"
        aria-label="Playground segment"
        className="max-w-sm"
      >
        <SegmentButton value="tab1">Tab 1</SegmentButton>
        <SegmentButton value="tab2">Tab 2</SegmentButton>
        <SegmentButton value="tab3">Tab 3</SegmentButton>
      </SegmentBar>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Switching between 2-5 mutually exclusive views',
    'Compact alternative to tabs for fewer options',
    'Filter toggles within a confined space',
  ],
  dontUse: [
    { text: 'Many navigation items', alternative: 'tab', alternativeLabel: 'Tab' },
    { text: 'Multi-select filtering', alternative: 'chip', alternativeLabel: 'Chip' },
    { text: 'Binary on/off toggle', alternative: 'switch', alternativeLabel: 'Switch' },
  ],
  related: [
    { id: 'tab', label: 'Tab' },
    { id: 'chip', label: 'Chip' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<SegmentBar defaultValue="all" aria-label="Filter">
  <SegmentButton value="all">All</SegmentButton>
  <SegmentButton value="active">Active</SegmentButton>
  <SegmentButton value="done">Done</SegmentButton>
</SegmentBar>`,
  },
  {
    title: 'Controlled',
    code: `const [value, setValue] = useState('overview')

<SegmentBar value={value} onValueChange={setValue} aria-label="Page">
  <SegmentButton value="overview">Overview</SegmentButton>
  <SegmentButton value="analytics">Analytics</SegmentButton>
  <SegmentButton value="settings">Settings</SegmentButton>
</SegmentBar>

<p>Selected: {value}</p>`,
  },
  {
    title: 'With icons',
    code: `<SegmentBar defaultValue="grid" aria-label="View mode">
  <SegmentButton value="grid" icon={<GridIcon />}>Grid</SegmentButton>
  <SegmentButton value="list" icon={<ListIcon />}>List</SegmentButton>
  <SegmentButton value="chart" icon={<ChartIcon />}>Chart</SegmentButton>
</SegmentBar>`,
  },
  {
    title: 'Different sizes',
    code: `<SegmentBar size="large" defaultValue="a" aria-label="Large">
  <SegmentButton value="a">Large</SegmentButton>
  <SegmentButton value="b">Buttons</SegmentButton>
</SegmentBar>

<SegmentBar size="small" defaultValue="a" aria-label="Small">
  <SegmentButton value="a">Small</SegmentButton>
  <SegmentButton value="b">Buttons</SegmentButton>
</SegmentBar>`,
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens',
    rows: [
      { component: '--comp-segment-bar-bg',            semantic: 'state-on-bright-50',      lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',       darkPrimitive: 'black-alpha-50',  darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-segment-label',             semantic: 'neutral-black-alpha-400',  lightPrimitive: 'black-alpha-400', lightHex: 'rgba(0,0,0,0.36)',       darkPrimitive: 'black-alpha-400', darkHex: 'rgba(0,0,0,0.36)' },
      { component: '--comp-segment-label-active',      semantic: 'neutral-black-alpha-800',  lightPrimitive: 'black-alpha-800', lightHex: 'rgba(0,0,0,0.70)',       darkPrimitive: 'black-alpha-800', darkHex: 'rgba(0,0,0,0.70)' },
      { component: '--comp-segment-label-disabled',    semantic: 'neutral-solid-400',        lightPrimitive: 'gray-400',        lightHex: '#a9abb1',                darkPrimitive: 'gray-600',        darkHex: '#55585f' },
      { component: '--comp-segment-active-bg',         semantic: 'neutral-solid-0',          lightPrimitive: 'gray-0',          lightHex: '#fdfefe',                darkPrimitive: 'gray-950',        darkHex: '#1d1e22' },
      { component: '--comp-segment-active-border',     semantic: 'neutral-black-alpha-600',  lightPrimitive: 'black-alpha-600', lightHex: 'rgba(0,0,0,0.48)',       darkPrimitive: 'black-alpha-600', darkHex: 'rgba(0,0,0,0.48)' },
      { component: '--comp-segment-active-bg-disabled',semantic: 'neutral-solid-100',        lightPrimitive: 'gray-100',        lightHex: '#f0f1f3',                darkPrimitive: 'gray-900',        darkHex: '#282a2f' },
      { component: '--comp-segment-divider',           semantic: 'neutral-solid-200',        lightPrimitive: 'gray-200',        lightHex: '#dcdee1',                darkPrimitive: 'gray-800',        darkHex: '#35373d' },
      { component: '--comp-segment-focus-ring',        semantic: 'primary-300',              lightPrimitive: 'purple-300',      lightHex: '#c5afe9',                darkPrimitive: 'purple-300',      darkHex: '#c5afe9' },
    ],
  },
  {
    title: 'State Overlay',
    rows: [
      { component: '--comp-segment-hover',   semantic: 'state-on-bright-50', lightPrimitive: 'black-alpha-50', lightHex: 'rgba(0,0,0,0.04)', darkPrimitive: 'black-alpha-50', darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-segment-pressed', semantic: 'state-on-bright-70', lightPrimitive: 'black-alpha-70', lightHex: 'rgba(0,0,0,0.06)', darkPrimitive: 'black-alpha-70', darkHex: 'rgba(0,0,0,0.06)' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Button Height',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-btn-height-lg', value: '48px' },
      { name: '--comp-segment-btn-height-md', value: '36px' },
      { name: '--comp-segment-btn-height-sm', value: '28px' },
      { name: '--comp-segment-btn-height-xs', value: '20px' },
    ],
  },
  {
    title: 'Button Padding & Gap',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-btn-px-lg', value: '16px' },
      { name: '--comp-segment-btn-px-md', value: '12px' },
      { name: '--comp-segment-btn-px-sm', value: '10px' },
      { name: '--comp-segment-btn-px-xs', value: '6px' },
      { name: '--comp-segment-btn-gap-lg', value: '6px' },
      { name: '--comp-segment-btn-gap-md', value: '6px' },
      { name: '--comp-segment-btn-gap-sm', value: '4px' },
      { name: '--comp-segment-btn-gap-xs', value: '4px' },
    ],
  },
  {
    title: 'Button Radius',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-btn-radius-lg', value: '12px' },
      { name: '--comp-segment-btn-radius-md', value: '10px' },
      { name: '--comp-segment-btn-radius-sm', value: '8px' },
      { name: '--comp-segment-btn-radius-xs', value: '6px' },
    ],
  },
  {
    title: 'Icon Size',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-icon-lg', value: '18px' },
      { name: '--comp-segment-icon-md', value: '18px' },
      { name: '--comp-segment-icon-sm', value: '16px' },
      { name: '--comp-segment-icon-xs', value: '16px' },
    ],
  },
  {
    title: 'Bar Padding & Radius',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-bar-padding-lg', value: '4px' },
      { name: '--comp-segment-bar-padding-md', value: '4px' },
      { name: '--comp-segment-bar-padding-sm', value: '4px' },
      { name: '--comp-segment-bar-padding-xs', value: '3px' },
      { name: '--comp-segment-bar-radius-lg', value: '16px' },
      { name: '--comp-segment-bar-radius-md', value: '14px' },
      { name: '--comp-segment-bar-radius-sm', value: '12px' },
      { name: '--comp-segment-bar-radius-xs', value: '9px' },
    ],
  },
  {
    title: 'Divider Height',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-divider-height-lg', value: '24px' },
      { name: '--comp-segment-divider-height-md', value: '20px' },
      { name: '--comp-segment-divider-height-sm', value: '20px' },
      { name: '--comp-segment-divider-height-xs', value: '16px' },
    ],
  },
  {
    title: 'Active Shadow',
    scope: ':root',
    tokens: [
      { name: '--comp-segment-shadow-lg', value: '0px 1px 3px rgba(0,0,0,0.04), 0px 2px 6px rgba(0,0,0,0.08)' },
      { name: '--comp-segment-shadow-md', value: '0px 1px 4px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.04)' },
      { name: '--comp-segment-shadow-sm', value: '0px 1px 3px rgba(0,0,0,0.06), 0px 0px 1px rgba(0,0,0,0.04)' },
      { name: '--comp-segment-shadow-xs', value: '0px 1px 2px rgba(0,0,0,0.06), 0px 0px 1px rgba(0,0,0,0.04)' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SEGMENTBAR_TOC: TocEntry[] = [
  { id: 'component-segmentbar',     label: 'SegmentBar',         level: 1 },
  { id: 'segment-playground',       label: 'Playground'                    },
  { id: 'segment-anatomy',          label: 'Anatomy'                       },
  { id: 'segment-sizes',            label: 'Sizes'                         },
  { id: 'segment-shape',            label: 'Shape'                         },
  { id: 'segment-width',            label: 'Width Mode'                    },
  { id: 'segment-icons',            label: 'With Icons'                    },
  { id: 'segment-states',           label: 'States'                        },
  { id: 'segment-controlled',       label: 'Controlled'                    },
  { id: 'segment-usage',            label: 'Usage Guidelines'              },
  { id: 'segment-props',            label: 'Props'                         },
  { id: 'segment-code',             label: 'Code Examples'                 },
  { id: 'segment-tokens',           label: 'Design Tokens'                 },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SegmentBarShowcase() {
  const navigate = useContext(NavigateContext)

  const [sizeValues, setSizeValues] = useState<Record<SegmentSize, string>>({
    large: 'all', medium: 'all', small: 'all', xSmall: 'all',
  })
  const [shapeSquare, setShapeSquare] = useState('tab1')
  const [shapeCircular, setShapeCircular] = useState('tab1')
  const [widthFixed, setWidthFixed] = useState('day')
  const [widthHug, setWidthHug] = useState('day')
  const [iconVal, setIconVal] = useState('grid')
  const [disabledVal, setDisabledVal] = useState('opt1')
  const [controlledVal, setControlledVal] = useState('overview')

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-segmentbar"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="segment-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="segment-anatomy"
        title="Anatomy"
        description="Compound component with a recessed bar containing segment buttons, dividers, and state overlays."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`SegmentBar (root, role=radiogroup)
├── SegmentButton (role=radio)
│   ├── state overlay  — sibling <span>, group-hover / group-active
│   ├── icon           — ReactNode, flex-shrink-0
│   └── label          — children (text)
├── Divider            — 1px vertical, animated opacity
├── SegmentButton
│   └── ...
└── SegmentButton
    └── ...`}
        </pre>
      </ShowcaseSection>

      {/* 4. Variations — preserved original sections */}

      {/* 4a. Sizes */}
      <section id="segment-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-6 max-w-lg">
          {SEGMENT_SIZES.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-20 flex flex-col items-end gap-0.5 shrink-0">
                <SpecLabel>{s}</SpecLabel>
                <span className="typography-12-regular text-semantic-text-on-bright-400">
                  {SIZE_SPECS[s].height} / {SIZE_SPECS[s].font}
                </span>
              </div>
              <SegmentBar
                size={s}
                value={sizeValues[s]}
                onValueChange={(v) => setSizeValues((prev) => ({ ...prev, [s]: v }))}
                aria-label={`Size ${s}`}
              >
                <SegmentButton value="all">전체</SegmentButton>
                <SegmentButton value="active">활성</SegmentButton>
                <SegmentButton value="done">완료</SegmentButton>
              </SegmentBar>
            </div>
          ))}
        </div>

        {/* Size spec table */}
        <div className="mt-8 overflow-x-auto">
          <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
            <div />
            {SEGMENT_SIZES.map(size => (
              <ColHeader key={size}>{size}</ColHeader>
            ))}

            {SIZE_PROP_KEYS.map(prop => (
              <>
                <SpecLabel key={`lbl-${prop.key}`}>{prop.label}</SpecLabel>
                {SEGMENT_SIZES.map(size => (
                  <SpecValue key={`${prop.key}-${size}`}>{SIZE_SPECS[size][prop.key]}</SpecValue>
                ))}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* 4b. Shape */}
      <section id="segment-shape" className="mb-12 scroll-mt-6">
        <SectionTitle>Shape</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <div>
            <SpecLabel>Square (default)</SpecLabel>
            <div className="mt-2">
              <SegmentBar shape="square" value={shapeSquare} onValueChange={setShapeSquare} aria-label="Shape square">
                <SegmentButton value="tab1">Tab 1</SegmentButton>
                <SegmentButton value="tab2">Tab 2</SegmentButton>
                <SegmentButton value="tab3">Tab 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>Circular</SpecLabel>
            <div className="mt-2">
              <SegmentBar shape="circular" value={shapeCircular} onValueChange={setShapeCircular} aria-label="Shape circular">
                <SegmentButton value="tab1">Tab 1</SegmentButton>
                <SegmentButton value="tab2">Tab 2</SegmentButton>
                <SegmentButton value="tab3">Tab 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
        </div>
      </section>

      {/* 4c. Width Mode */}
      <section id="segment-width" className="mb-12 scroll-mt-6">
        <SectionTitle>Width Mode</SectionTitle>
        <div className="flex flex-col gap-6 max-w-lg">
          <div>
            <SpecLabel>Fixed (균등 분할)</SpecLabel>
            <div className="mt-2">
              <SegmentBar width="fixed" value={widthFixed} onValueChange={setWidthFixed} aria-label="Width fixed">
                <SegmentButton value="day">일간</SegmentButton>
                <SegmentButton value="week">주간</SegmentButton>
                <SegmentButton value="month">월간</SegmentButton>
                <SegmentButton value="year">연간</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>Hug (콘텐츠 맞춤)</SpecLabel>
            <div className="mt-2">
              <SegmentBar width="hug" value={widthHug} onValueChange={setWidthHug} aria-label="Width hug">
                <SegmentButton value="day">일간</SegmentButton>
                <SegmentButton value="week">주간</SegmentButton>
                <SegmentButton value="month">월간</SegmentButton>
                <SegmentButton value="year">연간</SegmentButton>
              </SegmentBar>
            </div>
          </div>
        </div>
      </section>

      {/* 4d. With Icons */}
      <section id="segment-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <SegmentBar value={iconVal} onValueChange={setIconVal} aria-label="View mode">
            <SegmentButton value="grid" icon={<GridIcon />}>그리드</SegmentButton>
            <SegmentButton value="list" icon={<ListIcon />}>리스트</SegmentButton>
            <SegmentButton value="chart" icon={<ChartIcon />}>차트</SegmentButton>
          </SegmentBar>
          <SegmentBar size="small" shape="circular" value={iconVal} onValueChange={setIconVal} aria-label="View mode small">
            <SegmentButton value="grid" icon={<GridIcon />}>그리드</SegmentButton>
            <SegmentButton value="list" icon={<ListIcon />}>리스트</SegmentButton>
            <SegmentButton value="chart" icon={<ChartIcon />}>차트</SegmentButton>
          </SegmentBar>
        </div>
      </section>

      {/* 4e. States */}
      <section id="segment-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <div>
            <SpecLabel>Global disabled</SpecLabel>
            <div className="mt-2">
              <SegmentBar disabled defaultValue="opt1" aria-label="Disabled">
                <SegmentButton value="opt1">옵션 1</SegmentButton>
                <SegmentButton value="opt2">옵션 2</SegmentButton>
                <SegmentButton value="opt3">옵션 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>Individual disabled (옵션 3)</SpecLabel>
            <div className="mt-2">
              <SegmentBar value={disabledVal} onValueChange={setDisabledVal} aria-label="Partial disabled">
                <SegmentButton value="opt1">옵션 1</SegmentButton>
                <SegmentButton value="opt2">옵션 2</SegmentButton>
                <SegmentButton value="opt3" disabled>옵션 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>2개 항목 (divider 없음)</SpecLabel>
            <div className="mt-2">
              <SegmentBar defaultValue="on" aria-label="Toggle">
                <SegmentButton value="on">켜기</SegmentButton>
                <SegmentButton value="off">끄기</SegmentButton>
              </SegmentBar>
            </div>
          </div>
        </div>
      </section>

      {/* 4f. Controlled */}
      <section id="segment-controlled" className="mb-12 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          <SegmentBar value={controlledVal} onValueChange={setControlledVal} aria-label="Page">
            <SegmentButton value="overview">Overview</SegmentButton>
            <SegmentButton value="analytics">Analytics</SegmentButton>
            <SegmentButton value="settings">Settings</SegmentButton>
          </SegmentBar>
          <p className="typography-13-regular text-semantic-text-on-bright-500">
            선택됨: <strong className="typography-13-semibold">{controlledVal}</strong>
          </p>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="segment-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-components) */}
      <ShowcaseSection id="segment-props" title="Props">
        {subComponentProps.map(sub => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="segment-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="segment-tokens"
        title="Design Tokens"
        description="Component -> Semantic -> Primitive resolution chain. Color tokens switch by theme, size/shape tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
