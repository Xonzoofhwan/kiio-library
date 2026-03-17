import { useState, useContext } from 'react'
import { FormField } from '@/components/FormField'
import { SearchField, SEARCHFIELD_SIZES } from '@/components/SearchField'
import type { SearchFieldSize } from '@/components/SearchField'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, SpecLabel, SpecValue } from './shared'
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
import searchfieldSpec from '../../specs/searchfield.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(searchfieldSpec)
const propRows = extractProps(searchfieldSpec)

/* ─── Size spec ───────────────────────────────────────────────────────────── */

const SIZE_SPECS: Record<string, { height: string; font: string }> = {
  xSmall: { height: '24px', font: '12' },
  small:  { height: '32px', font: '13' },
  medium: { height: '40px', font: '14' },
  large:  { height: '48px', font: '15' },
  xLarge: { height: '56px', font: '16' },
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: SEARCHFIELD_SIZES },
    disabled:    { kind: 'boolean' },
    placeholder: { kind: 'text' },
  },
  defaults: {
    size: 'medium',
    disabled: false,
    placeholder: '검색',
  },
  render: (props) => (
    <SearchField
      size={props.size as SearchFieldSize}
      disabled={props.disabled as boolean}
      placeholder={props.placeholder as string}
    />
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Dedicated search input with search icon and clear button',
    'Filtering content in tables, lists, or grids',
    'Quick-find functionality in navigation or command palettes',
  ],
  dontUse: [
    { text: 'Generic text input', alternative: 'textfield', alternativeLabel: 'TextField' },
    { text: 'Multi-line search', alternative: 'textarea', alternativeLabel: 'Textarea' },
    { text: 'Tag-based search with chips', alternative: 'taginput', alternativeLabel: 'TagInput' },
  ],
  related: [
    { id: 'textfield', label: 'TextField' },
    { id: 'taginput', label: 'TagInput' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<SearchField
  placeholder="검색어를 입력하세요"
  onSearch={(value) => console.log('Search:', value)}
  onClear={() => console.log('Cleared')}
/>`,
  },
  {
    title: 'With FormField',
    code: `<FormField id="search" label="검색" helperText="이름, 이메일 등으로 검색하세요.">
  <SearchField
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onClear={() => setQuery('')}
  />
</FormField>`,
  },
  {
    title: 'Controlled',
    code: `const [value, setValue] = useState('')
const [result, setResult] = useState<string | null>(null)

<SearchField
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onSearch={(v) => setResult(v)}
  onClear={() => { setValue(''); setResult(null) }}
/>`,
    description: 'Use value + onChange for controlled input. onSearch fires on Enter key.',
  },
  {
    title: 'Clear on escape',
    code: `<SearchField
  clearOnEscape
  onClear={() => console.log('Cleared via Escape')}
/>`,
    description: 'Inherited from TextField. Pressing Escape clears the input and fires onClear.',
  },
]

/* ─── Token data: 3-layer chain (reuses TextField tokens) ─────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens (reuses --comp-textfield-*)',
    rows: [
      { component: '--comp-textfield-bg',              semantic: 'neutral-solid-70',       lightPrimitive: 'gray-70',  lightHex: '#f6f7f8', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-textfield-bg-focus',        semantic: 'neutral-solid-0',        lightPrimitive: 'gray-0',   lightHex: '#fdfefe', darkPrimitive: 'gray-100', darkHex: '#f0f1f3' },
      { component: '--comp-textfield-bg-disabled',     semantic: 'neutral-solid-100',      lightPrimitive: 'gray-100', lightHex: '#f0f1f3', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-textfield-border',          semantic: 'neutral-solid-70',       lightPrimitive: 'gray-70',  lightHex: '#f6f7f8', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-textfield-border-focus',    semantic: 'neutral-solid-400',      lightPrimitive: 'gray-400', lightHex: '#a3a6ad', darkPrimitive: 'gray-600', darkHex: '#53565e' },
      { component: '--comp-textfield-border-error',    semantic: 'error-500',              lightPrimitive: 'red-500',  lightHex: '#ef4444', darkPrimitive: 'red-400', darkHex: '#f87171' },
      { component: '--comp-textfield-text',            semantic: 'text-on-bright-950',     lightPrimitive: 'gray-950', lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-textfield-text-placeholder', semantic: 'neutral-solid-400',     lightPrimitive: 'gray-400', lightHex: '#a3a6ad', darkPrimitive: 'gray-600', darkHex: '#53565e' },
      { component: '--comp-textfield-icon-color',      semantic: 'neutral-solid-600',      lightPrimitive: 'gray-600', lightHex: '#53565e', darkPrimitive: 'gray-400', darkHex: '#a3a6ad' },
      { component: '--comp-textfield-icon-disabled',   semantic: 'neutral-solid-300',      lightPrimitive: 'gray-300', lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
    ],
  },
  {
    title: 'State Overlay & Focus',
    rows: [
      { component: '--comp-textfield-hover-on-bright',  semantic: 'state-on-bright-50',  lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',       darkPrimitive: 'black-alpha-50',  darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-textfield-active-on-bright', semantic: 'state-on-bright-70',  lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)',       darkPrimitive: 'black-alpha-70',  darkHex: 'rgba(0,0,0,0.06)' },
      { component: '--comp-textfield-focus-ring',       semantic: 'neutral-solid-300',   lightPrimitive: 'gray-300',        lightHex: '#c3c5ca',                darkPrimitive: 'gray-700',        darkHex: '#404349' },
      { component: '--comp-textfield-focus-ring-error', semantic: 'error-500',           lightPrimitive: 'red-500',         lightHex: '#ef4444',                darkPrimitive: 'red-400',         darkHex: '#f87171' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing (reuses --comp-textfield-*)',
    scope: ':root',
    tokens: [
      { name: '--comp-textfield-height-xs', value: '24px' },
      { name: '--comp-textfield-height-sm', value: '32px' },
      { name: '--comp-textfield-height-md', value: '40px' },
      { name: '--comp-textfield-height-lg', value: '48px' },
      { name: '--comp-textfield-height-xl', value: '56px' },
      { name: '--comp-textfield-px-xs', value: '8px' },
      { name: '--comp-textfield-px-sm', value: '10px' },
      { name: '--comp-textfield-px-md', value: '12px' },
      { name: '--comp-textfield-px-lg', value: '14px' },
      { name: '--comp-textfield-px-xl', value: '16px' },
      { name: '--comp-textfield-gap-xs', value: '4px' },
      { name: '--comp-textfield-gap-sm', value: '6px' },
      { name: '--comp-textfield-gap-md', value: '8px' },
      { name: '--comp-textfield-gap-lg', value: '8px' },
      { name: '--comp-textfield-gap-xl', value: '10px' },
    ],
  },
  {
    title: 'Icon Size (reuses --comp-textfield-icon-*)',
    scope: ':root',
    tokens: [
      { name: '--comp-textfield-icon-xs', value: '14px' },
      { name: '--comp-textfield-icon-sm', value: '16px' },
      { name: '--comp-textfield-icon-md', value: '18px' },
      { name: '--comp-textfield-icon-lg', value: '20px' },
      { name: '--comp-textfield-icon-xl', value: '22px' },
    ],
  },
  {
    title: 'Border Radius (reuses --comp-textfield-radius-*)',
    scope: ':root',
    tokens: [
      { name: '--comp-textfield-radius-xs', value: '4px' },
      { name: '--comp-textfield-radius-sm', value: '8px' },
      { name: '--comp-textfield-radius-md', value: '8px' },
      { name: '--comp-textfield-radius-lg', value: '8px' },
      { name: '--comp-textfield-radius-xl', value: '8px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SEARCHFIELD_TOC: TocEntry[] = [
  { id: 'component-searchfield',      label: 'SearchField',            level: 1 },
  { id: 'searchfield-playground',     label: 'Playground'                       },
  { id: 'searchfield-anatomy',        label: 'Anatomy'                          },
  { id: 'searchfield-basic',          label: 'Basic'                            },
  { id: 'searchfield-sizes',          label: 'Sizes'                            },
  { id: 'searchfield-loading',        label: 'Loading'                          },
  { id: 'searchfield-with-formfield', label: 'With FormField'                   },
  { id: 'searchfield-states',         label: 'States'                           },
  { id: 'searchfield-usage',          label: 'Usage Guidelines'                 },
  { id: 'searchfield-props',          label: 'Props'                            },
  { id: 'searchfield-code',           label: 'Code Examples'                    },
  { id: 'searchfield-tokens',         label: 'Design Tokens'                    },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SearchFieldShowcase() {
  const navigate = useContext(NavigateContext)
  const [basicValue, setBasicValue] = useState('')
  const [formValue, setFormValue] = useState('')
  const [lastSearched, setLastSearched] = useState<string | null>(null)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-searchfield"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="searchfield-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="searchfield-anatomy"
        title="Anatomy"
        description="SearchField wraps TextField with a role='search' landmark. The search icon and clear button are provided automatically."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`SearchField (root)
├── <div role="search">     — a11y search landmark
│   └── TextField
│       ├── startEnhancer   — SearchIcon (or Spinner when loading)
│       ├── <input>         — type="search", clearOnEscape
│       └── clearButton     — auto-shown when value is non-empty
└── onSearch               — fires on Enter key`}
        </pre>
      </ShowcaseSection>

      {/* 4. Variations */}

      {/* 4a. Basic */}
      <section id="searchfield-basic" className="mb-12 scroll-mt-6">
        <SectionTitle>Basic</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <SearchField
            value={basicValue}
            onChange={(e) => setBasicValue(e.target.value)}
            onSearch={(v) => setLastSearched(v)}
            onClear={() => { setBasicValue(''); setLastSearched(null) }}
          />
          {lastSearched !== null && (
            <p className="typography-13-regular text-semantic-text-on-bright-500">
              검색어: &ldquo;{lastSearched}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* 4b. Sizes */}
      <section id="searchfield-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-4 max-w-lg">
          {SEARCHFIELD_SIZES.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-16 flex flex-col items-end gap-0.5">
                <SpecLabel>{s}</SpecLabel>
                <SpecValue>{SIZE_SPECS[s].height} / {SIZE_SPECS[s].font}px</SpecValue>
              </div>
              <div className="flex-1">
                <SearchField size={s} placeholder={`Size: ${s}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4c. Loading */}
      <section id="searchfield-loading" className="mb-12 scroll-mt-6">
        <SectionTitle>Loading</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <SearchField loading placeholder="검색 중..." />
        </div>
      </section>

      {/* 4d. With FormField */}
      <section id="searchfield-with-formfield" className="mb-12 scroll-mt-6">
        <SectionTitle>With FormField</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField id="sf-default" label="검색" helperText="이름, 이메일 등으로 검색하세요.">
            <SearchField
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              onClear={() => setFormValue('')}
            />
          </FormField>
          <FormField id="sf-error" label="검색" error errorMessage="검색어를 입력해 주세요.">
            <SearchField />
          </FormField>
        </div>
      </section>

      {/* 4e. States */}
      <section id="searchfield-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <SearchField disabled placeholder="Disabled" />
          <SearchField readOnly value="읽기 전용 검색어" />
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="searchfield-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="searchfield-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="searchfield-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="searchfield-tokens"
        title="Design Tokens"
        description="SearchField has no dedicated tokens. It fully reuses --comp-textfield-* tokens. Color tokens switch by theme, size/shape tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
