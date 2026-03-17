import { useState, useContext } from 'react'
import { Select, SELECT_SIZES } from '@/components/Select'
import type { SelectOption, SelectGroup, SelectSize } from '@/components/Select'
import { FormField } from '@/components/FormField'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, SearchIcon, StarIcon, MailIcon, BookIcon } from './shared'
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
import selectSpec from '../../specs/select.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(selectSpec)
const propRows = extractProps(selectSpec)

/* ─── Sample data ──────────────────────────────────────────────────────────── */

const FRUIT_OPTIONS: SelectOption[] = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'grape', label: '포도' },
  { value: 'mango', label: '망고' },
  { value: 'orange', label: '오렌지' },
  { value: 'peach', label: '복숭아' },
  { value: 'strawberry', label: '딸기' },
]

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: 'kr', label: '한국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'gb', label: '영국' },
  { value: 'de', label: '독일' },
  { value: 'fr', label: '프랑스' },
  { value: 'it', label: '이탈리아' },
  { value: 'au', label: '호주' },
  { value: 'ca', label: '캐나다' },
]

const GROUPED_OPTIONS: (SelectOption | SelectGroup)[] = [
  {
    label: '과일',
    options: [
      { value: 'apple', label: '사과' },
      { value: 'banana', label: '바나나' },
      { value: 'cherry', label: '체리' },
    ],
  },
  {
    label: '채소',
    options: [
      { value: 'carrot', label: '당근' },
      { value: 'broccoli', label: '브로콜리' },
      { value: 'spinach', label: '시금치' },
    ],
  },
  {
    label: '곡물',
    options: [
      { value: 'rice', label: '쌀' },
      { value: 'wheat', label: '밀' },
    ],
  },
]

const ICON_OPTIONS: SelectOption[] = [
  { value: 'search', label: '검색', icon: <SearchIcon /> },
  { value: 'star', label: '즐겨찾기', icon: <StarIcon /> },
  { value: 'mail', label: '메일', icon: <MailIcon /> },
  { value: 'book', label: '도서', icon: <BookIcon /> },
]

const DISABLED_OPTIONS: SelectOption[] = [
  { value: 'option1', label: '선택 가능 A' },
  { value: 'option2', label: '비활성 옵션', disabled: true },
  { value: 'option3', label: '선택 가능 B' },
  { value: 'option4', label: '비활성 옵션 2', disabled: true },
  { value: 'option5', label: '선택 가능 C' },
]

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: SELECT_SIZES },
    disabled:    { kind: 'boolean' },
    placeholder: { kind: 'text' },
  },
  defaults: {
    size: 'medium',
    disabled: false,
    placeholder: '과일을 선택하세요',
  },
  render: (props) => (
    <div className="w-full max-w-sm">
      <Select
        options={FRUIT_OPTIONS}
        size={props.size as SelectSize}
        disabled={props.disabled as boolean}
        placeholder={props.placeholder as string}
      />
    </div>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Selecting one option from a predefined list',
    'Form fields requiring single-choice selection',
    'When the number of options exceeds inline display (>5)',
  ],
  dontUse: [
    { text: 'Multi-select', alternative: 'chip', alternativeLabel: 'Chip' },
    { text: 'Few options that fit inline', alternative: 'segment-bar', alternativeLabel: 'SegmentBar' },
    { text: 'Free-text input with suggestions', alternative: 'textfield', alternativeLabel: 'TextField' },
  ],
  related: [
    { id: 'chip', label: 'Chip' },
    { id: 'segment-bar', label: 'SegmentBar' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Select
  options={[
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
  ]}
  placeholder="과일을 선택하세요"
  value={value}
  onValueChange={setValue}
/>`,
  },
  {
    title: 'With FormField',
    code: `<FormField id="fruit" label="과일 선택" description="좋아하는 과일을 선택하세요.">
  <Select
    options={fruitOptions}
    placeholder="선택..."
    value={value}
    onValueChange={setValue}
  />
</FormField>`,
    description: 'FormField provides id, error, disabled, readOnly context automatically.',
  },
  {
    title: 'Controlled',
    code: `const [value, setValue] = useState('')

<Select
  options={options}
  value={value}
  onValueChange={setValue}
  clearable
/>
<p>Selected: {value || '(none)'}</p>`,
    description: 'Use value + onValueChange for controlled mode. clearable adds a clear button.',
  },
  {
    title: 'Grouped options',
    code: `const groupedOptions = [
  {
    label: '과일',
    options: [
      { value: 'apple', label: '사과' },
      { value: 'banana', label: '바나나' },
    ],
  },
  {
    label: '채소',
    options: [
      { value: 'carrot', label: '당근' },
    ],
  },
]

<Select options={groupedOptions} placeholder="카테고리별 선택" />`,
    description: 'Pass SelectGroup objects in the options array to render grouped sections.',
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Chevron & Check Colors',
    rows: [
      { component: '--comp-select-chevron-color',          semantic: 'textfield-icon-color',      lightPrimitive: 'gray-400',  lightHex: '#9a9da3', darkPrimitive: 'gray-500', darkHex: '#6e717a' },
      { component: '--comp-select-chevron-color-open',     semantic: 'text-on-bright-950',        lightPrimitive: 'gray-950',  lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-select-chevron-color-disabled', semantic: 'textfield-icon-disabled',   lightPrimitive: 'gray-300',  lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
      { component: '--comp-select-check-color',            semantic: 'dropdown-check-checked',    lightPrimitive: 'purple-500', lightHex: '#8058d0', darkPrimitive: 'purple-400', darkHex: '#a88ce0' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Chevron Icon Size',
    scope: ':root',
    tokens: [
      { name: '--comp-select-chevron-xs', value: '14px' },
      { name: '--comp-select-chevron-sm', value: '16px' },
      { name: '--comp-select-chevron-md', value: '18px' },
      { name: '--comp-select-chevron-lg', value: '20px' },
      { name: '--comp-select-chevron-xl', value: '20px' },
    ],
  },
  {
    title: 'Reused from TextField (trigger)',
    scope: ':root',
    tokens: [
      { name: '--comp-textfield-height-xs', value: '24px' },
      { name: '--comp-textfield-height-sm', value: '32px' },
      { name: '--comp-textfield-height-md', value: '40px' },
      { name: '--comp-textfield-height-lg', value: '48px' },
      { name: '--comp-textfield-height-xl', value: '56px' },
      { name: '--comp-textfield-px-md', value: '12px' },
      { name: '--comp-textfield-gap-md', value: '4px' },
      { name: '--comp-textfield-radius-md', value: '8px' },
      { name: '--comp-textfield-icon-md', value: '18px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SELECT_TOC: TocEntry[] = [
  { id: 'component-select',   label: 'Select',            level: 1 },
  { id: 'select-playground',  label: 'Playground'                   },
  { id: 'select-anatomy',     label: 'Anatomy'                     },
  { id: 'select-basic',       label: 'Basic Select'                },
  { id: 'select-combobox',    label: 'Combobox'                    },
  { id: 'select-sizes',       label: 'Sizes'                       },
  { id: 'select-states',      label: 'States'                      },
  { id: 'select-clearable',   label: 'Clearable'                   },
  { id: 'select-groups',      label: 'Grouped Options'             },
  { id: 'select-icons',       label: 'With Icons'                  },
  { id: 'select-formfield',   label: 'With FormField'              },
  { id: 'select-usage',       label: 'Usage Guidelines'            },
  { id: 'select-props',       label: 'Props'                       },
  { id: 'select-code',        label: 'Code Examples'               },
  { id: 'select-tokens',      label: 'Design Tokens'               },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function SelectShowcase() {
  const navigate = useContext(NavigateContext)

  const [basicValue, setBasicValue] = useState('')
  const [comboValue, setComboValue] = useState('')
  const [clearableValue, setClearableValue] = useState('apple')
  const [formValue, setFormValue] = useState('')
  const [iconValue, setIconValue] = useState('')

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-select"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="select-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="select-anatomy"
        title="Anatomy"
        description="Select trigger structure with optional start enhancer, value display, clear button, and chevron. Dropdown uses Radix Popover for positioning."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Select (Popover.Root)
├── Trigger (div[role=combobox] or input[role=combobox])
│   ├── startEnhancer  — ReactNode, flex-shrink-0
│   ├── value / input  — selected label or combobox input
│   ├── clear button   — IconButton (ghost), shown when clearable
│   ├── chevron        — rotate-180 when open
│   └── state overlay  — sibling <span>, group-hover / group-active
├── Hidden input       — name prop for form submission
└── Dropdown (Popover.Content, portal)
    └── Listbox [role=listbox]
        ├── Group label  — optional section headers
        └── Option [role=option]
            ├── icon     — optional per-option icon
            ├── label    — option text
            └── check    — selected indicator`}
        </pre>
      </ShowcaseSection>

      {/* ── Visual Sections (preserved) ── */}

      {/* 4a. Basic Select */}
      <section id="select-basic" className="mb-12 scroll-mt-6">
        <SectionTitle>Basic Select</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={FRUIT_OPTIONS}
            placeholder="과일을 선택하세요"
            value={basicValue}
            onValueChange={setBasicValue}
          />
          <p className="typography-13-regular text-semantic-text-on-bright-500">
            선택된 값: {basicValue || '(없음)'}
          </p>
        </div>
      </section>

      {/* 4b. Combobox */}
      <section id="select-combobox" className="mb-12 scroll-mt-6">
        <SectionTitle>Combobox</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            mode="combobox"
            options={COUNTRY_OPTIONS}
            placeholder="국가 검색..."
            value={comboValue}
            onValueChange={setComboValue}
          />
          <p className="typography-13-regular text-semantic-text-on-bright-500">
            선택된 값: {comboValue || '(없음)'}
          </p>
        </div>
      </section>

      {/* 4c. Sizes */}
      <section id="select-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="max-w-sm space-y-3">
          {SELECT_SIZES.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="typography-13-medium text-semantic-text-on-bright-500 w-16 flex-shrink-0">
                {s}
              </span>
              <Select
                size={s}
                options={FRUIT_OPTIONS}
                placeholder={`${s} size`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4d. States */}
      <section id="select-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="max-w-sm space-y-3">
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Default</span>
            <Select options={FRUIT_OPTIONS} placeholder="기본" />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Error</span>
            <Select options={FRUIT_OPTIONS} placeholder="에러 상태" error />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Disabled</span>
            <Select options={FRUIT_OPTIONS} placeholder="비활성" disabled />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Disabled with value</span>
            <Select options={FRUIT_OPTIONS} value="apple" disabled />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">ReadOnly</span>
            <Select options={FRUIT_OPTIONS} value="banana" readOnly />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Disabled options</span>
            <Select options={DISABLED_OPTIONS} placeholder="일부 비활성 옵션" />
          </div>
        </div>
      </section>

      {/* 4e. Clearable */}
      <section id="select-clearable" className="mb-12 scroll-mt-6">
        <SectionTitle>Clearable</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={FRUIT_OPTIONS}
            placeholder="지우기 가능"
            value={clearableValue}
            onValueChange={setClearableValue}
            clearable
          />
          <Select
            mode="combobox"
            options={COUNTRY_OPTIONS}
            placeholder="Combobox + Clearable"
            clearable
          />
        </div>
      </section>

      {/* 4f. Grouped Options */}
      <section id="select-groups" className="mb-12 scroll-mt-6">
        <SectionTitle>Grouped Options</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={GROUPED_OPTIONS}
            placeholder="카테고리별 선택"
          />
          <Select
            mode="combobox"
            options={GROUPED_OPTIONS}
            placeholder="카테고리별 검색..."
          />
        </div>
      </section>

      {/* 4g. With Icons */}
      <section id="select-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={ICON_OPTIONS}
            placeholder="아이콘 옵션"
            value={iconValue}
            onValueChange={setIconValue}
          />
          <Select
            options={ICON_OPTIONS}
            placeholder="아이콘 검색..."
            mode="combobox"
            startEnhancer={<SearchIcon />}
          />
        </div>
      </section>

      {/* 4h. With FormField */}
      <section id="select-formfield" className="mb-12 scroll-mt-6">
        <SectionTitle>With FormField</SectionTitle>
        <div className="max-w-sm space-y-4">
          <FormField id="fruit-field" label="과일 선택" description="좋아하는 과일을 선택하세요.">
            <Select
              options={FRUIT_OPTIONS}
              placeholder="선택..."
              value={formValue}
              onValueChange={setFormValue}
            />
          </FormField>

          <FormField id="country-field" label="국가" error errorMessage="국가를 선택해 주세요.">
            <Select
              mode="combobox"
              options={COUNTRY_OPTIONS}
              placeholder="국가 검색..."
            />
          </FormField>

          <FormField id="disabled-field" label="비활성 필드" disabled>
            <Select options={FRUIT_OPTIONS} placeholder="비활성" />
          </FormField>

          <FormField id="readonly-field" label="읽기 전용" readOnly>
            <Select options={FRUIT_OPTIONS} value="cherry" />
          </FormField>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="select-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="select-props" title="Props">
        <PropsTable props={propRows} title="Select" />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="select-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="select-tokens"
        title="Design Tokens"
        description="Select owns chevron and check color tokens. Trigger reuses --comp-textfield-* tokens for size/spacing/color. Dropdown reuses --comp-dropdown-* tokens."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
