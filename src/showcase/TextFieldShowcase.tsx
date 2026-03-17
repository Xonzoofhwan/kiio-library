import { useState, useContext } from 'react'
import { TextField, TEXTFIELD_SIZES, TEXTFIELD_SHAPES } from '@/components/TextField'
import type { TextFieldSize, TextFieldShape } from '@/components/TextField'
import { FormField } from '@/components/FormField'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, SpecLabel, SpecValue, SearchIcon, MailIcon } from './shared'
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
import { extractProps, extractHeader } from './spec-utils'
import textfieldSpec from '../../specs/textfield.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(textfieldSpec)
const propRows = extractProps(textfieldSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: TEXTFIELD_SIZES },
    shape:       { kind: 'select', options: TEXTFIELD_SHAPES },
    disabled:    { kind: 'boolean' },
    clearable:   { kind: 'boolean' },
    placeholder: { kind: 'text' },
  },
  defaults: {
    size: 'medium',
    shape: 'default',
    disabled: false,
    clearable: false,
    placeholder: 'Enter text...',
  },
  render: (props) => (
    <TextField
      size={props.size as TextFieldSize}
      shape={props.shape as TextFieldShape}
      disabled={props.disabled as boolean}
      clearable={props.clearable as boolean}
      placeholder={props.placeholder as string}
    />
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Single-line text input in forms (name, email, search)',
    'Input with prefix/suffix enhancers (currency, URL, units)',
    'Password input with visibility toggle',
  ],
  dontUse: [
    { text: 'Multi-line text input', alternative: 'textarea', alternativeLabel: 'Textarea' },
    { text: 'Search with dedicated layout', alternative: 'searchfield', alternativeLabel: 'SearchField' },
    { text: 'Tag/chip-based multi-value input', alternative: 'taginput', alternativeLabel: 'TagInput' },
  ],
  related: [
    { id: 'textarea', label: 'Textarea' },
    { id: 'searchfield', label: 'SearchField' },
    { id: 'formfield', label: 'FormField' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<TextField placeholder="Enter your name" />`,
  },
  {
    title: 'With FormField',
    code: `<FormField label="Email" required>
  <TextField type="email" placeholder="email@example.com" />
</FormField>`,
  },
  {
    title: 'Password',
    code: `<TextField type="password" placeholder="Password" />`,
  },
  {
    title: 'Clearable',
    code: `<TextField clearable placeholder="Search..." />`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-textfield-px-xs', value: '8px' },
      { name: '--comp-textfield-px-sm', value: '8px' },
      { name: '--comp-textfield-px-md', value: '12px' },
      { name: '--comp-textfield-px-lg', value: '14px' },
      { name: '--comp-textfield-px-xl', value: '16px' },
      { name: '--comp-textfield-gap-xs', value: '4px' },
      { name: '--comp-textfield-gap-sm', value: '4px' },
      { name: '--comp-textfield-gap-md', value: '6px' },
      { name: '--comp-textfield-gap-lg', value: '8px' },
      { name: '--comp-textfield-gap-xl', value: '10px' },
    ],
  },
  {
    title: 'Shared with Button (height, icon, radius)',
    scope: ':root',
    tokens: [
      { name: '--comp-button-height-xs', value: '24px' },
      { name: '--comp-button-height-sm', value: '32px' },
      { name: '--comp-button-height-md', value: '40px' },
      { name: '--comp-button-height-lg', value: '48px' },
      { name: '--comp-button-height-xl', value: '56px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TEXTFIELD_TOC: TocEntry[] = [
  { id: 'component-textfield',    label: 'TextField',              level: 1 },
  { id: 'textfield-playground',   label: 'Playground'                       },
  { id: 'textfield-anatomy',      label: 'Anatomy'                          },
  { id: 'textfield-states',       label: 'States (with FormField)'          },
  { id: 'textfield-sizes',        label: 'Sizes'                            },
  { id: 'textfield-patterns',     label: 'Patterns'                         },
  { id: 'textfield-layout-left',  label: 'Layout: Left'                     },
  { id: 'textfield-pill',         label: 'Pill'                             },
  { id: 'textfield-standalone',   label: 'Standalone'                       },
  { id: 'textfield-usage',        label: 'Usage Guidelines'                 },
  { id: 'textfield-props',        label: 'Props'                            },
  { id: 'textfield-code',         label: 'Code Examples'                    },
  { id: 'textfield-tokens',       label: 'Design Tokens'                    },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TextFieldShowcase() {
  const navigate = useContext(NavigateContext)

  const [nameValue, setNameValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [pwValue, setPwValue] = useState('MyPassword123')
  const [emailValue, setEmailValue] = useState('')
  const [countValue, setCountValue] = useState('안녕하세요')
  const MAX_COUNT = 30

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-textfield"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="textfield-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="textfield-anatomy"
        title="Anatomy"
        description="TextField's internal structure with enhancer slots, validation icons, and state overlay."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`TextField (root container, group)
├── startEnhancer   — ReactNode | string, flex-shrink-0
├── <input>         — native input element
├── validationIcon  — AlertIcon (error) / CheckIcon (positive)
├── passwordToggle  — EyeIcon / EyeOffIcon (type="password")
├── clearButton     — XIcon (clearable && hasValue)
├── endEnhancer     — ReactNode | string, flex-shrink-0
└── state overlay   — sibling <span>, group-hover / group-active`}
        </pre>
      </ShowcaseSection>

      {/* 4. Visual sections */}

      {/* 4a. States */}
      <section id="textfield-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States (with FormField)</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField id="tf-default" label="이름" helperText="실명을 입력해 주세요.">
            <TextField
              placeholder="홍길동"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              clearable
              onClear={() => setNameValue('')}
            />
          </FormField>

          <FormField id="tf-error" label="이메일" error errorMessage="올바른 이메일 형식이 아닙니다.">
            <TextField type="email" defaultValue="invalid-email" placeholder="user@example.com" />
          </FormField>

          <FormField id="tf-positive" label="사용자명" helperText="사용 가능한 아이디입니다.">
            <TextField positive defaultValue="john_doe" placeholder="아이디" />
          </FormField>

          <FormField id="tf-disabled" label="회사명" disabled>
            <TextField defaultValue="Kiio Corp." placeholder="회사명" />
          </FormField>

          <FormField id="tf-readonly" label="가입일" readOnly>
            <TextField defaultValue="2026-03-11" />
          </FormField>

          <FormField id="tf-required" label="전화번호" required helperText="'-' 없이 입력하세요.">
            <TextField type="tel" placeholder="01012345678" />
          </FormField>
        </div>
      </section>

      {/* 4b. Sizes */}
      <section id="textfield-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-x-4 gap-y-2 max-w-4xl items-center">
          <div />
          {TEXTFIELD_SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          <SpecLabel>Input</SpecLabel>
          {TEXTFIELD_SIZES.map(size => (
            <TextField key={size} size={size} placeholder={size} />
          ))}

          <SpecLabel>Height</SpecLabel>
          {(['24px', '32px', '40px', '48px', '56px'] as const).map((h, i) => (
            <SpecValue key={i}>{h}</SpecValue>
          ))}

          <SpecLabel>Font</SpecLabel>
          {(['12px', '13px', '14px', '15px', '16px'] as const).map((f, i) => (
            <SpecValue key={i}>{f}</SpecValue>
          ))}
        </div>
      </section>

      {/* 4c. Patterns */}
      <section id="textfield-patterns" className="mb-12 scroll-mt-6">
        <SectionTitle>Patterns</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField id="tf-search" label="검색">
            <TextField
              type="search"
              placeholder="검색어를 입력하세요"
              startEnhancer={<SearchIcon />}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              clearable
              onClear={() => setSearchValue('')}
            />
          </FormField>

          <FormField id="tf-password" label="비밀번호" required description="영문, 숫자, 특수문자 포함 8자 이상">
            <TextField
              type="password"
              value={pwValue}
              onChange={e => setPwValue(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </FormField>

          <FormField id="tf-email" label="이메일 주소">
            <TextField
              type="email"
              placeholder="user@company.com"
              startEnhancer={<MailIcon />}
              value={emailValue}
              onChange={e => setEmailValue(e.target.value)}
            />
          </FormField>

          <FormField id="tf-url" label="웹사이트">
            <TextField type="text" placeholder="mysite" startEnhancer="https://" endEnhancer=".com" />
          </FormField>

          <FormField id="tf-currency" label="금액">
            <TextField type="text" placeholder="0" startEnhancer="₩" endEnhancer="원" />
          </FormField>

          <FormField
            id="tf-count"
            label="소개"
            count={countValue.length}
            maxCount={MAX_COUNT}
            error={countValue.length > MAX_COUNT}
            errorMessage={countValue.length > MAX_COUNT ? `${MAX_COUNT}자를 초과했습니다.` : undefined}
          >
            <TextField
              value={countValue}
              onChange={e => setCountValue(e.target.value)}
              placeholder="자기소개를 입력하세요"
            />
          </FormField>
        </div>
      </section>

      {/* 4d. Layout: Left */}
      <section id="textfield-layout-left" className="mb-12 scroll-mt-6">
        <SectionTitle>Layout: Left</SectionTitle>
        <div className="flex flex-col gap-3 max-w-lg">
          <FormField id="left-name" label="이름" layout="left">
            <TextField placeholder="홍길동" />
          </FormField>
          <FormField id="left-email" label="이메일" layout="left">
            <TextField type="email" placeholder="user@example.com" />
          </FormField>
          <FormField id="left-pw" label="비밀번호" layout="left" required>
            <TextField type="password" placeholder="비밀번호 입력" />
          </FormField>
        </div>
      </section>

      {/* 4e. Pill */}
      <section id="textfield-pill" className="mb-12 scroll-mt-6">
        <SectionTitle>Pill</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          shape="pill"로 완전 둥근 끝(9999px) 적용.
        </p>
        <div className="flex flex-col gap-3 max-w-md">
          <TextField shape="pill" placeholder="Pill 텍스트 입력" />
          <TextField shape="pill" placeholder="Pill + 검색" startEnhancer={<SearchIcon />} />
          <TextField shape="pill" placeholder="Pill + 에러" error />
          <TextField shape="pill" size="large" placeholder="Pill Large" />
        </div>
      </section>

      {/* 4f. Standalone */}
      <section id="textfield-standalone" className="mb-12 scroll-mt-6">
        <SectionTitle>Standalone (without FormField)</SectionTitle>
        <div className="flex flex-col gap-3 max-w-xs">
          <TextField placeholder="기본 텍스트 입력" />
          <TextField placeholder="에러 상태" error />
          <TextField placeholder="성공 상태" positive defaultValue="유효한 값" />
          <TextField placeholder="비활성 상태" disabled defaultValue="비활성 값" />
          <TextField placeholder="읽기 전용" readOnly defaultValue="읽기 전용 값" />
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="textfield-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="textfield-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="textfield-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="textfield-tokens"
        title="Design Tokens"
        description="TextField-specific size/spacing tokens and shared Button tokens for height, icon size, and border-radius."
      >
        <TokensReference groups={sizeTokenGroups} />
      </ShowcaseSection>
    </>
  )
}
