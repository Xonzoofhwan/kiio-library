import { useContext, useState } from 'react'
import { FormField, FORMFIELD_LAYOUTS } from '@/components/FormField'
import type { FormFieldLayout } from '@/components/FormField'
import { TextField } from '@/components/TextField'
import { Textarea } from '@/components/Textarea'
import { Select } from '@/components/Select'
import type { TocEntry } from '@/components/showcase-layout'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from '@/showcase/shared'
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
import { extractHeader, extractProps } from './spec-utils'
import formfieldSpec from '../../specs/formfield.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(formfieldSpec)
const propRows = extractProps(formfieldSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    layout:     { kind: 'select', options: FORMFIELD_LAYOUTS },
    required:   { kind: 'boolean' },
    error:      { kind: 'text' },
    helperText: { kind: 'text' },
  },
  defaults: {
    layout: 'top',
    required: false,
    error: '',
    helperText: 'Helper text goes here.',
  },
  render: (props) => {
    const errorText = props.error as string
    const hasError = errorText.length > 0

    return (
      <div className="w-full max-w-sm">
        <FormField
          id="playground-ff"
          label="Label"
          layout={props.layout as FormFieldLayout}
          required={props.required as boolean}
          error={hasError}
          errorMessage={hasError ? errorText : undefined}
          helperText={props.helperText as string || undefined}
        >
          <TextField placeholder="Placeholder text" />
        </FormField>
      </div>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Wrapping form inputs with label, helper text, and error display',
    'Consistent form layout with top or left label positioning',
    'Automatic id/error/disabled context propagation to child inputs',
  ],
  dontUse: [
    { text: 'Standalone input without label', alternative: 'textfield', alternativeLabel: 'TextField' },
    { text: 'Non-form display content' },
    { text: 'Complex multi-field form groups' },
  ],
  related: [
    { id: 'textfield', label: 'TextField' },
    { id: 'textarea', label: 'Textarea' },
    { id: 'select', label: 'Select' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<FormField id="name" label="Name" helperText="Enter your full name.">
  <TextField placeholder="Hong Gildong" />
</FormField>`,
  },
  {
    title: 'With error',
    code: `<FormField
  id="email"
  label="Email"
  required
  error
  errorMessage="Invalid email address."
>
  <TextField value="not-an-email" />
</FormField>`,
    description: 'When error is true, errorMessage replaces helperText and the error state propagates to child input via Context.',
  },
  {
    title: 'Left layout',
    code: `<FormField
  id="phone"
  label="Phone"
  layout="left"
  helperText="Include country code."
>
  <TextField placeholder="+82-10-0000-0000" />
</FormField>`,
    description: 'Left layout uses CSS Grid (auto 1fr) with label aligned to the left.',
  },
  {
    title: 'Required with helper',
    code: `<FormField
  id="bio"
  label="Bio"
  required
  description="Tell us about yourself."
  helperText="Max 100 characters."
>
  <Textarea placeholder="Write something..." size="large" />
</FormField>`,
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens (text)',
    rows: [
      { component: '--comp-formfield-text-label',              semantic: 'text-on-bright-950',  lightPrimitive: 'gray-950', lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-formfield-text-label-disabled',     semantic: 'neutral-solid-400',   lightPrimitive: 'gray-400', lightHex: '#a8abb2', darkPrimitive: 'gray-600', darkHex: '#51545b' },
      { component: '--comp-formfield-text-required',           semantic: 'error-500',           lightPrimitive: 'red-500',  lightHex: '#ef4444', darkPrimitive: 'red-500',  darkHex: '#ef4444' },
      { component: '--comp-formfield-text-description',        semantic: 'text-on-bright-600',  lightPrimitive: 'gray-600', lightHex: '#51545b', darkPrimitive: 'gray-400', darkHex: '#a8abb2' },
      { component: '--comp-formfield-text-description-disabled', semantic: 'neutral-solid-400', lightPrimitive: 'gray-400', lightHex: '#a8abb2', darkPrimitive: 'gray-600', darkHex: '#51545b' },
      { component: '--comp-formfield-text-helper',             semantic: 'text-on-bright-600',  lightPrimitive: 'gray-600', lightHex: '#51545b', darkPrimitive: 'gray-400', darkHex: '#a8abb2' },
      { component: '--comp-formfield-text-helper-disabled',    semantic: 'neutral-solid-400',   lightPrimitive: 'gray-400', lightHex: '#a8abb2', darkPrimitive: 'gray-600', darkHex: '#51545b' },
      { component: '--comp-formfield-text-error',              semantic: 'error-500',           lightPrimitive: 'red-500',  lightHex: '#ef4444', darkPrimitive: 'red-500',  darkHex: '#ef4444' },
      { component: '--comp-formfield-text-count',              semantic: 'text-on-bright-600',  lightPrimitive: 'gray-600', lightHex: '#51545b', darkPrimitive: 'gray-400', darkHex: '#a8abb2' },
      { component: '--comp-formfield-text-count-over',         semantic: 'error-500',           lightPrimitive: 'red-500',  lightHex: '#ef4444', darkPrimitive: 'red-500',  darkHex: '#ef4444' },
      { component: '--comp-formfield-text-count-disabled',     semantic: 'neutral-solid-400',   lightPrimitive: 'gray-400', lightHex: '#a8abb2', darkPrimitive: 'gray-600', darkHex: '#51545b' },
    ],
  },
]

const spacingTokenGroups: TokenGroupData[] = [
  {
    title: 'Layout & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-formfield-gap-label-description', value: '2px' },
      { name: '--comp-formfield-gap-label-input', value: '6px' },
      { name: '--comp-formfield-gap-description-input', value: '6px' },
      { name: '--comp-formfield-gap-input-bottom', value: '4px' },
      { name: '--comp-formfield-gap-left-label', value: '12px' },
      { name: '--comp-formfield-gap-bottom-text-count', value: '8px' },
    ],
  },
]

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const FORMFIELD_TOC: TocEntry[] = [
  { id: 'component-formfield',        label: 'FormField',          level: 1 },
  { id: 'formfield-playground',       label: 'Playground'                    },
  { id: 'formfield-anatomy',          label: 'Anatomy'                       },
  { id: 'formfield-top-layout',       label: 'Top Layout'                    },
  { id: 'formfield-left-layout',      label: 'Left Layout'                   },
  { id: 'formfield-states',           label: 'States'                        },
  { id: 'formfield-character-count',  label: 'Character Count'               },
  { id: 'formfield-with-inputs',      label: 'With Various Inputs'           },
  { id: 'formfield-usage',            label: 'Usage Guidelines'              },
  { id: 'formfield-props',            label: 'Props'                         },
  { id: 'formfield-code',             label: 'Code Examples'                 },
  { id: 'formfield-tokens',           label: 'Design Tokens'                 },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function FormFieldShowcase() {
  const navigate = useContext(NavigateContext)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [errorName, setErrorName] = useState('홍길동')

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-formfield"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="formfield-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="formfield-anatomy"
        title="Anatomy"
        description="FormField's structural layout with label, description, input slot, and bottom row."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`FormField (root: role="group", aria-labelledby)
├── Label          — typography-14-semibold, htmlFor → input id
│   └── Required * — aria-hidden, semantic-error-500
├── Description    — typography-13-regular (optional)
├── [children]     — Input slot (TextField, Textarea, etc.)
│                    Receives state via FormFieldContext
└── Bottom Row     — flex row
    ├── Helper / Error text — typography-13-regular, aria-live="polite"
    └── Character Count     — {count}/{maxCount}`}
        </pre>
      </ShowcaseSection>

      {/* ── Top Layout ── */}
      <section id="formfield-top-layout" className="mb-12 scroll-mt-6">
        <SectionTitle>Top Layout</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField
            id="ff-top-basic"
            label="이름"
            helperText="실명을 입력해주세요."
          >
            <TextField placeholder="홍길동" />
          </FormField>

          <FormField
            id="ff-top-desc"
            label="이메일"
            required
            description="알림을 받을 이메일 주소입니다."
            helperText="개인 이메일을 권장합니다."
          >
            <TextField placeholder="user@example.com" />
          </FormField>

          <FormField
            id="ff-top-optional"
            label="닉네임"
            description="다른 사용자에게 표시됩니다."
          >
            <TextField placeholder="nickname" />
          </FormField>
        </div>
      </section>

      {/* ── Left Layout ── */}
      <section id="formfield-left-layout" className="mb-12 scroll-mt-6">
        <SectionTitle>Left Layout</SectionTitle>
        <div className="flex flex-col gap-3 max-w-lg">
          <FormField
            id="ff-left-name"
            label="이름"
            layout="left"
            required
          >
            <TextField placeholder="홍길동" />
          </FormField>

          <FormField
            id="ff-left-email"
            label="이메일"
            layout="left"
            required
            helperText="알림을 받을 이메일입니다."
          >
            <TextField placeholder="user@example.com" />
          </FormField>

          <FormField
            id="ff-left-phone"
            label="전화번호"
            layout="left"
            description="선택 항목입니다."
          >
            <TextField placeholder="010-0000-0000" />
          </FormField>
        </div>
      </section>

      {/* ── States ── */}
      <section id="formfield-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          {/* Default */}
          <FormField
            id="ff-state-default"
            label="Default"
            helperText="기본 상태입니다."
          >
            <TextField placeholder="입력해주세요" />
          </FormField>

          {/* Required */}
          <FormField
            id="ff-state-required"
            label="Required"
            required
            helperText="필수 입력 항목입니다."
          >
            <TextField placeholder="입력해주세요" />
          </FormField>

          {/* Error */}
          <FormField
            id="ff-state-error"
            label="Error"
            error
            errorMessage="이름은 2자 이상이어야 합니다."
          >
            <TextField
              value={errorName}
              onChange={(e) => setErrorName(e.target.value)}
            />
          </FormField>

          {/* Disabled */}
          <FormField
            id="ff-state-disabled"
            label="Disabled"
            disabled
            helperText="비활성화된 필드입니다."
          >
            <TextField value="비활성화" />
          </FormField>

          {/* ReadOnly */}
          <FormField
            id="ff-state-readonly"
            label="Read Only"
            readOnly
            helperText="읽기 전용 필드입니다."
          >
            <TextField value="수정 불가" />
          </FormField>

          {/* Error + Required */}
          <FormField
            id="ff-state-error-required"
            label="Error + Required"
            required
            error
            errorMessage="필수 항목을 입력해주세요."
          >
            <TextField placeholder="입력해주세요" />
          </FormField>
        </div>
      </section>

      {/* ── Character Count ── */}
      <section id="formfield-character-count" className="mb-12 scroll-mt-6">
        <SectionTitle>Character Count</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField
            id="ff-count-normal"
            label="이름"
            count={name.length}
            maxCount={20}
            helperText="최대 20자까지 입력 가능합니다."
          >
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
            />
          </FormField>

          <FormField
            id="ff-count-over"
            label="자기소개"
            count={bio.length}
            maxCount={100}
            error={bio.length > 100}
            errorMessage="100자를 초과했습니다."
            helperText="간단한 자기소개를 작성해주세요."
          >
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요"
              size="large"
            />
          </FormField>
        </div>
      </section>

      {/* ── With Various Inputs ── */}
      <section id="formfield-with-inputs" className="mb-12 scroll-mt-6">
        <SectionTitle>With Various Inputs</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField
            id="ff-input-textfield"
            label="TextField"
            required
            helperText="기본 텍스트 입력"
          >
            <TextField placeholder="텍스트 입력" />
          </FormField>

          <FormField
            id="ff-input-textarea"
            label="Textarea"
            description="긴 텍스트를 입력할 수 있습니다."
          >
            <Textarea placeholder="내용을 입력해주세요" size="large" />
          </FormField>

          <FormField
            id="ff-input-select"
            label="Select"
            required
            helperText="옵션을 선택해주세요."
          >
            <Select
              placeholder="선택해주세요"
              options={[
                { value: 'option1', label: '옵션 1' },
                { value: 'option2', label: '옵션 2' },
                { value: 'option3', label: '옵션 3' },
              ]}
            />
          </FormField>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="formfield-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="formfield-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="formfield-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="formfield-tokens"
        title="Design Tokens"
        description="Component -> Semantic -> Primitive resolution chain. Color tokens switch by theme, spacing tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={spacingTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
