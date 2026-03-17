import { useState, useContext } from 'react'
import { Switch, SWITCH_SIZES } from '@/components/Switch'
import type { SwitchSize } from '@/components/Switch'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, RowHeader, SpecLabel, SpecValue } from './shared'
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
import { extractProps, extractHeader } from './spec-utils'
import switchSpec from '../../specs/switch.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(switchSpec)
const propRows = extractProps(switchSpec)

/* ─── Size spec data ──────────────────────────────────────────────────────── */

const sizeSpec: Record<SwitchSize, Record<string, string>> = {
  small:  { 'Track H': '16px', 'Track W': '28px', 'Thumb (off)': '8px', 'Thumb (hover)': '10px', 'Thumb (on)': '12px', 'Padding': '2px', 'Translate': '12px', 'Touch inset': '-4px' },
  medium: { 'Track H': '24px', 'Track W': '44px', 'Thumb (off)': '14px', 'Thumb (hover)': '16px', 'Thumb (on)': '20px', 'Padding': '2px', 'Translate': '20px', 'Touch inset': '-4px' },
  large:  { 'Track H': '32px', 'Track W': '56px', 'Thumb (off)': '18px', 'Thumb (hover)': '22px', 'Thumb (on)': '26px', 'Padding': '3px', 'Translate': '24px', 'Touch inset': '0' },
  xLarge: { 'Track H': '40px', 'Track W': '72px', 'Thumb (off)': '24px', 'Thumb (hover)': '28px', 'Thumb (on)': '34px', 'Padding': '3px', 'Translate': '32px', 'Touch inset': '0' },
}

const specKeys = Object.keys(sizeSpec.small)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:           { kind: 'select', options: SWITCH_SIZES },
    disabled:       { kind: 'boolean' },
    defaultChecked: { kind: 'boolean' },
  },
  defaults: {
    size: 'medium',
    disabled: false,
    defaultChecked: false,
  },
  render: (props) => (
    <Switch
      size={props.size as SwitchSize}
      disabled={props.disabled as boolean}
      defaultChecked={props.defaultChecked as boolean}
    />
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Toggling a binary setting on/off (dark mode, notifications, feature flags)',
    'Immediate-effect settings that don\'t require form submission',
    'Preference toggles in settings panels',
  ],
  dontUse: [
    { text: 'Triggering an action (submit, save)', alternative: 'button', alternativeLabel: 'Button' },
    { text: 'Selecting from multiple options', alternative: 'chip', alternativeLabel: 'Chip' },
    { text: 'Binary choice that requires form submission', alternative: 'chip', alternativeLabel: 'Chip' },
  ],
  related: [
    { id: 'chip', label: 'Chip' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<Switch />
<Switch defaultChecked />`,
  },
  {
    title: 'Controlled',
    code: `const [on, setOn] = useState(false)
<Switch checked={on} onCheckedChange={setOn} />`,
  },
  {
    title: 'With label',
    code: `<label className="flex items-center gap-3">
  <Switch size="medium" />
  <span>Enable notifications</span>
</label>`,
  },
  {
    title: 'In form',
    code: `<Switch name="darkMode" value="on" required />`,
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Track & Thumb Colors',
    rows: [
      { component: '--comp-switch-bg-off',      semantic: 'neutral-solid-200',       lightPrimitive: 'gray-200',  lightHex: '#d7d8dc', darkPrimitive: 'gray-800',  darkHex: '#33353a' },
      { component: '--comp-switch-bg-on',       semantic: 'primary-500',             lightPrimitive: 'purple-500', lightHex: '#8b6cef', darkPrimitive: 'purple-500', darkHex: '#8b6cef' },
      { component: '--comp-switch-thumb',        semantic: 'neutral-solid-0',         lightPrimitive: 'gray-0',    lightHex: '#fdfefe', darkPrimitive: 'gray-800',  darkHex: '#33353a' },
      { component: '--comp-switch-thumb-off',    semantic: 'neutral-white-alpha-800', lightPrimitive: 'white-alpha-800', lightHex: 'rgba(255,255,255,0.8)', darkPrimitive: 'gray-600', darkHex: '#555861' },
    ],
  },
  {
    title: 'Disabled & Focus',
    rows: [
      { component: '--comp-switch-bg-off-disabled',  semantic: 'neutral-solid-100', lightPrimitive: 'gray-100',   lightHex: '#f0f1f3', darkPrimitive: 'gray-900',   darkHex: '#282a2f' },
      { component: '--comp-switch-bg-on-disabled',   semantic: 'primary-200',       lightPrimitive: 'purple-200', lightHex: '#ddd3f7', darkPrimitive: 'purple-800', darkHex: '#47309e' },
      { component: '--comp-switch-thumb-disabled',   semantic: 'neutral-solid-50',  lightPrimitive: 'gray-50',    lightHex: '#f7f7f8', darkPrimitive: 'gray-500',   darkHex: '#6c6f79' },
      { component: '--comp-switch-focus-ring',       semantic: 'primary-300',       lightPrimitive: 'purple-300', lightHex: '#c5afe9', darkPrimitive: 'purple-300', darkHex: '#c5afe9' },
    ],
  },
  {
    title: 'State Overlays',
    rows: [
      { component: '--comp-switch-hover-on-bright',  semantic: 'state-on-bright-50', lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',       darkPrimitive: 'black-alpha-50',  darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-switch-active-on-bright', semantic: 'state-on-bright-70', lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)',       darkPrimitive: 'black-alpha-70',  darkHex: 'rgba(0,0,0,0.06)' },
      { component: '--comp-switch-hover-on-dim',     semantic: 'state-on-dim-50',    lightPrimitive: 'white-alpha-50',  lightHex: 'rgba(255,255,255,0.08)', darkPrimitive: 'white-alpha-50',  darkHex: 'rgba(255,255,255,0.08)' },
      { component: '--comp-switch-active-on-dim',    semantic: 'state-on-dim-70',    lightPrimitive: 'white-alpha-70',  lightHex: 'rgba(255,255,255,0.12)', darkPrimitive: 'white-alpha-70',  darkHex: 'rgba(255,255,255,0.12)' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Track Dimensions',
    scope: ':root',
    tokens: [
      { name: '--comp-switch-track-h-sm', value: '16px' },
      { name: '--comp-switch-track-h-md', value: '24px' },
      { name: '--comp-switch-track-h-lg', value: '32px' },
      { name: '--comp-switch-track-h-xl', value: '40px' },
      { name: '--comp-switch-track-w-sm', value: '28px' },
      { name: '--comp-switch-track-w-md', value: '44px' },
      { name: '--comp-switch-track-w-lg', value: '56px' },
      { name: '--comp-switch-track-w-xl', value: '72px' },
    ],
  },
  {
    title: 'Thumb Sizes',
    scope: ':root',
    tokens: [
      { name: '--comp-switch-thumb-off-sm', value: '8px' },
      { name: '--comp-switch-thumb-off-md', value: '14px' },
      { name: '--comp-switch-thumb-off-lg', value: '18px' },
      { name: '--comp-switch-thumb-off-xl', value: '24px' },
      { name: '--comp-switch-thumb-hover-sm', value: '10px' },
      { name: '--comp-switch-thumb-hover-md', value: '16px' },
      { name: '--comp-switch-thumb-hover-lg', value: '22px' },
      { name: '--comp-switch-thumb-hover-xl', value: '28px' },
      { name: '--comp-switch-thumb-on-sm', value: '12px' },
      { name: '--comp-switch-thumb-on-md', value: '20px' },
      { name: '--comp-switch-thumb-on-lg', value: '26px' },
      { name: '--comp-switch-thumb-on-xl', value: '34px' },
    ],
  },
  {
    title: 'Padding & Translate',
    scope: ':root',
    tokens: [
      { name: '--comp-switch-padding-sm', value: '2px' },
      { name: '--comp-switch-padding-md', value: '2px' },
      { name: '--comp-switch-padding-lg', value: '3px' },
      { name: '--comp-switch-padding-xl', value: '3px' },
      { name: '--comp-switch-translate-sm', value: '12px' },
      { name: '--comp-switch-translate-md', value: '20px' },
      { name: '--comp-switch-translate-lg', value: '24px' },
      { name: '--comp-switch-translate-xl', value: '32px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SWITCH_TOC: TocEntry[] = [
  { id: 'component-switch',     label: 'Switch',            level: 1 },
  { id: 'switch-playground',    label: 'Playground'                   },
  { id: 'switch-anatomy',       label: 'Anatomy'                     },
  { id: 'switch-sizes',         label: 'Sizes'                       },
  { id: 'switch-states',        label: 'States'                      },
  { id: 'switch-controlled',    label: 'Controlled'                  },
  { id: 'switch-spec',          label: 'Size Spec'                   },
  { id: 'switch-theme',         label: 'Theme'                       },
  { id: 'switch-usage',         label: 'Usage Guidelines'            },
  { id: 'switch-props',         label: 'Props'                       },
  { id: 'switch-code',          label: 'Code Examples'               },
  { id: 'switch-tokens',        label: 'Design Tokens'               },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SwitchShowcase() {
  const navigate = useContext(NavigateContext)
  const [controlled, setControlled] = useState(false)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-switch"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="switch-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="switch-anatomy"
        title="Anatomy"
        description="Switch internal structure with track, thumb, state overlay, and touch target."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Switch (root — Radix Switch.Root)
├── track            — rounded pill, bg toggles off/on color
│   └── state overlay — absolute <span>, group-hover / group-active
├── thumb            — Radix Switch.Thumb, animated size + translate
│   └── size varies  — unchecked < hover < checked
└── touch target     — ::after pseudo on small/medium (inset: -4px)`}
        </pre>
      </ShowcaseSection>

      {/* 4. Visual sections */}

      {/* 4a. Sizes */}
      <section id="switch-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(4,1fr)] gap-x-4 gap-y-0">
          <div />
          {SWITCH_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {/* Unchecked */}
          <RowHeader>off</RowHeader>
          {SWITCH_SIZES.map(size => (
            <div key={`off-${size}`} className="flex justify-center items-center py-4 border-t border-semantic-divider-solid-50">
              <Switch size={size} />
            </div>
          ))}

          {/* Checked */}
          <RowHeader>on</RowHeader>
          {SWITCH_SIZES.map(size => (
            <div key={`on-${size}`} className="flex justify-center items-center py-4 border-t border-semantic-divider-solid-50">
              <Switch size={size} defaultChecked />
            </div>
          ))}
        </div>
      </section>

      {/* 4b. States */}
      <section id="switch-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-[120px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          <ColHeader>off</ColHeader>
          <ColHeader>on</ColHeader>

          {/* Default */}
          <RowHeader>default</RowHeader>
          <div className="flex justify-center items-center py-4 border-t border-semantic-divider-solid-50">
            <Switch />
          </div>
          <div className="flex justify-center items-center py-4 border-t border-semantic-divider-solid-50">
            <Switch defaultChecked />
          </div>

          {/* Disabled */}
          <RowHeader>disabled</RowHeader>
          <div className="flex justify-center items-center py-4 border-t border-semantic-divider-solid-50">
            <Switch disabled />
          </div>
          <div className="flex justify-center items-center py-4 border-t border-semantic-divider-solid-50">
            <Switch defaultChecked disabled />
          </div>
        </div>

        <p className="typography-13-regular text-semantic-text-on-bright-400 mt-3">
          Hover over switches to see thumb grow. Tab to see focus ring.
        </p>
      </section>

      {/* 4c. Controlled */}
      <section id="switch-controlled" className="mb-12 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex items-center gap-4">
          <Switch
            size="large"
            checked={controlled}
            onCheckedChange={setControlled}
          />
          <span className="typography-14-medium text-semantic-text-on-bright-800">
            {controlled ? 'On' : 'Off'}
          </span>
        </div>
      </section>

      {/* 4d. Size Spec Table */}
      <section id="switch-spec" className="mb-12 scroll-mt-6">
        <SectionTitle>Size Spec</SectionTitle>
        <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-x-4 gap-y-0">
          <div />
          {SWITCH_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {specKeys.map(key => (
            <>
              <div key={`label-${key}`} className="flex items-center py-1.5 border-t border-semantic-divider-solid-50">
                <SpecLabel>{key}</SpecLabel>
              </div>
              {SWITCH_SIZES.map(size => (
                <div key={`${key}-${size}`} className="flex justify-center items-center py-1.5 border-t border-semantic-divider-solid-50">
                  <SpecValue>{sizeSpec[size][key]}</SpecValue>
                </div>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* 4e. Theme Comparison */}
      <section id="switch-theme" className="mb-12 scroll-mt-6">
        <SectionTitle>Theme Comparison</SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          <div data-theme="light" className="p-6 rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-0">
            <p className="typography-13-semibold text-semantic-text-on-bright-500 mb-4">Light</p>
            <div className="flex items-center gap-4">
              <Switch size="large" />
              <Switch size="large" defaultChecked />
            </div>
          </div>
          <div data-theme="dark" className="p-6 rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-0">
            <p className="typography-13-semibold text-semantic-text-on-bright-500 mb-4">Dark</p>
            <div className="flex items-center gap-4">
              <Switch size="large" />
              <Switch size="large" defaultChecked />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="switch-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="switch-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="switch-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="switch-tokens"
        title="Design Tokens"
        description="Component → Semantic → Primitive resolution chain. Color tokens switch by theme, size tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
