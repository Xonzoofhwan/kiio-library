import { useState, useContext } from 'react'
import { FormField } from '@/components/FormField'
import { Textarea, TEXTAREA_SIZES } from '@/components/Textarea'
import type { TextareaSize } from '@/components/Textarea'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, SpecLabel, SpecValue } from './shared'
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
import textareaSpec from '../../specs/textarea.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(textareaSpec)
const propRows = extractProps(textareaSpec)

/* ─── Size spec table data ────────────────────────────────────────────────── */

type SizeSpec = { px: string; py: string; typography: string; lineHeight: string; radius: string }

const sizeSpec: Record<TextareaSize, SizeSpec> = {
  large:  { px: '12px', py: '12px', typography: '16/24', lineHeight: '24px', radius: '12px' },
  xLarge: { px: '16px', py: '14px', typography: '18/26', lineHeight: '26px', radius: '12px' },
}

const SIZE_PROPS: { key: keyof SizeSpec; label: string }[] = [
  { key: 'px',         label: 'Padding-X' },
  { key: 'py',         label: 'Padding-Y' },
  { key: 'typography', label: 'Font / LH' },
  { key: 'lineHeight', label: 'Line Height' },
  { key: 'radius',     label: 'Radius' },
]

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: TEXTAREA_SIZES },
    disabled:    { kind: 'boolean' },
    readOnly:    { kind: 'boolean' },
    error:       { kind: 'boolean' },
    autoResize:  { kind: 'boolean' },
    placeholder: { kind: 'text' },
  },
  defaults: {
    size: 'large',
    disabled: false,
    readOnly: false,
    error: false,
    autoResize: false,
    placeholder: 'Enter your text...',
  },
  render: (props) => (
    <div className="w-full max-w-md">
      <Textarea
        size={props.size as TextareaSize}
        disabled={props.disabled as boolean}
        readOnly={props.readOnly as boolean}
        error={props.error as boolean}
        autoResize={props.autoResize as boolean}
        placeholder={props.placeholder as string}
        minRows={2}
      />
    </div>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Multi-line text input (comments, descriptions, messages)',
    'Long-form content editing with vertical resize',
    'Input paired with FormField for validation',
  ],
  dontUse: [
    { text: 'Single-line text input', alternative: 'textfield', alternativeLabel: 'TextField' },
    { text: 'Rich text or markdown editing' },
    { text: 'Search input', alternative: 'searchfield', alternativeLabel: 'SearchField' },
  ],
  related: [
    { id: 'textfield', label: 'TextField' },
    { id: 'formfield', label: 'FormField' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Textarea placeholder="Enter your text..." minRows={3} />`,
  },
  {
    title: 'With FormField',
    code: `<FormField
  id="bio"
  label="Bio"
  helperText="Tell us about yourself."
  count={value.length}
  maxCount={500}
>
  <Textarea
    value={value}
    onChange={e => setValue(e.target.value)}
    placeholder="Write a short bio..."
  />
</FormField>`,
    description: 'FormField provides label, helper text, error state, and character count.',
  },
  {
    title: 'Auto-resize',
    code: `<Textarea
  autoResize
  minRows={2}
  maxRows={6}
  placeholder="Grows as you type, up to 6 rows..."
/>`,
    description: 'Height auto-adjusts based on content. Bounded by minRows/maxRows.',
  },
  {
    title: 'Read-only',
    code: `<Textarea
  readOnly
  defaultValue="This content cannot be edited by the user."
  minRows={2}
/>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing (Textarea-specific)',
    scope: ':root',
    tokens: [
      { name: '--comp-textarea-px-lg',     value: '12px' },
      { name: '--comp-textarea-py-lg',     value: '12px' },
      { name: '--comp-textarea-radius-lg', value: '12px' },
      { name: '--comp-textarea-px-xl',     value: '16px' },
      { name: '--comp-textarea-py-xl',     value: '14px' },
      { name: '--comp-textarea-radius-xl', value: '12px' },
    ],
  },
  {
    title: 'Color Tokens (reuses --comp-textfield-*)',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-textfield-bg',                      value: 'semantic-neutral-solid-70' },
      { name: '--comp-textfield-bg-focus',                value: 'semantic-neutral-solid-0' },
      { name: '--comp-textfield-bg-error',                value: 'semantic-neutral-solid-70' },
      { name: '--comp-textfield-bg-error-focus',          value: 'semantic-neutral-solid-0' },
      { name: '--comp-textfield-bg-disabled',             value: 'semantic-neutral-solid-100' },
      { name: '--comp-textfield-bg-readonly',             value: 'semantic-neutral-solid-50' },
      { name: '--comp-textfield-border',                  value: 'semantic-neutral-solid-70' },
      { name: '--comp-textfield-border-focus',            value: 'semantic-neutral-solid-400' },
      { name: '--comp-textfield-border-error',            value: 'semantic-error-500' },
      { name: '--comp-textfield-border-disabled',         value: 'semantic-neutral-solid-100' },
      { name: '--comp-textfield-border-readonly',         value: 'semantic-neutral-solid-50' },
      { name: '--comp-textfield-text',                    value: 'semantic-text-on-bright-950' },
      { name: '--comp-textfield-text-placeholder',        value: 'semantic-neutral-solid-400' },
      { name: '--comp-textfield-text-disabled',           value: 'semantic-neutral-solid-400' },
      { name: '--comp-textfield-text-placeholder-disabled', value: 'semantic-neutral-solid-300' },
      { name: '--comp-textfield-caret',                   value: 'semantic-text-on-bright-950' },
      { name: '--comp-textfield-hover-on-bright',         value: 'semantic-state-on-bright-50' },
      { name: '--comp-textfield-active-on-bright',        value: 'semantic-state-on-bright-70' },
      { name: '--comp-textfield-focus-ring',              value: 'semantic-neutral-solid-300' },
      { name: '--comp-textfield-focus-ring-error',        value: 'semantic-error-500' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TEXTAREA_TOC: TocEntry[] = [
  { id: 'component-textarea',     label: 'Textarea',                level: 1 },
  { id: 'textarea-playground',    label: 'Playground'                         },
  { id: 'textarea-anatomy',       label: 'Anatomy'                            },
  { id: 'textarea-states',        label: 'States (with FormField)'            },
  { id: 'textarea-sizes',         label: 'Sizes'                              },
  { id: 'textarea-auto-resize',   label: 'Auto Resize'                        },
  { id: 'textarea-standalone',    label: 'Standalone'                          },
  { id: 'textarea-usage',         label: 'Usage Guidelines'                    },
  { id: 'textarea-props',         label: 'Props'                               },
  { id: 'textarea-code',          label: 'Code Examples'                       },
  { id: 'textarea-tokens',        label: 'Design Tokens'                       },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TextareaShowcase() {
  const navigate = useContext(NavigateContext)
  const [bioValue, setBioValue] = useState('')
  const [autoValue, setAutoValue] = useState('')
  const [limitedValue, setLimitedValue] = useState('')
  const MAX_COUNT = 1000

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-textarea"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="textarea-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="textarea-anatomy"
        title="Anatomy"
        description="Textarea's internal structure with state overlay and auto-resize behavior."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Textarea (container div)
├── state overlay  — sibling <span>, group-hover / group-active
└── <textarea>     — auto-resize via scrollHeight, min/max height from rows`}
        </pre>
      </ShowcaseSection>

      {/* 4. Visual sections (preserved) */}

      {/* 4a. States */}
      <section id="textarea-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States (with FormField)</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField
            id="ta-default"
            label="소개"
            helperText="간략한 자기소개를 작성해 주세요."
            count={bioValue.length}
            maxCount={MAX_COUNT}
          >
            <Textarea
              placeholder="자기소개를 입력하세요"
              value={bioValue}
              onChange={e => setBioValue(e.target.value)}
            />
          </FormField>

          <FormField id="ta-error" label="사유" error errorMessage="필수 입력 항목입니다." count={0} maxCount={MAX_COUNT}>
            <Textarea placeholder="사유를 입력하세요" />
          </FormField>

          <FormField id="ta-positive" label="주소" helperText="주소가 확인되었습니다.">
            <Textarea positive defaultValue="서울특별시 강남구 테헤란로 123" />
          </FormField>

          <FormField id="ta-disabled" label="메모" disabled>
            <Textarea defaultValue="이 필드는 수정할 수 없습니다." />
          </FormField>

          <FormField id="ta-readonly" label="약관 내용" readOnly>
            <Textarea defaultValue="본 약관은 서비스 이용에 관한 기본적인 사항을 규정합니다. 이용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다." />
          </FormField>

          <FormField
            id="ta-count"
            label="상세 설명"
            required
            count={limitedValue.length}
            maxCount={MAX_COUNT}
            error={limitedValue.length > MAX_COUNT}
            errorMessage={limitedValue.length > MAX_COUNT ? `${MAX_COUNT}자를 초과했습니다.` : undefined}
          >
            <Textarea
              value={limitedValue}
              onChange={e => setLimitedValue(e.target.value)}
              placeholder="상세 설명을 입력하세요"
            />
          </FormField>
        </div>
      </section>

      {/* 4b. Sizes */}
      <section id="textarea-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(2,1fr)] gap-x-6 gap-y-2 max-w-2xl items-start">
          <div />
          {TEXTAREA_SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          <SpecLabel>Input</SpecLabel>
          {TEXTAREA_SIZES.map(size => (
            <Textarea key={size} size={size} placeholder={`${size} placeholder`} minRows={2} />
          ))}

          {SIZE_PROPS.map(prop => (
            <>
              <SpecLabel key={`lbl-${prop.key}`}>{prop.label}</SpecLabel>
              {TEXTAREA_SIZES.map(size => (
                <SpecValue key={`${prop.key}-${size}`}>{sizeSpec[size][prop.key]}</SpecValue>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* 4c. Auto Resize */}
      <section id="textarea-auto-resize" className="mb-12 scroll-mt-6">
        <SectionTitle>Auto Resize</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="ta-auto" label="무제한 자동 확장" helperText="minRows=2, maxRows 없음">
            <Textarea
              autoResize
              minRows={2}
              placeholder="입력하면 자동으로 높이가 늘어납니다..."
              value={autoValue}
              onChange={e => setAutoValue(e.target.value)}
            />
          </FormField>

          <FormField id="ta-auto-max" label="최대 행 제한" helperText="minRows=2, maxRows=6 — 초과 시 스크롤">
            <Textarea
              autoResize
              minRows={2}
              maxRows={6}
              placeholder="최대 6행까지 자동 확장됩니다..."
            />
          </FormField>

          <FormField id="ta-auto-xl" label="xLarge + Auto Resize" helperText="size=xLarge, minRows=2, maxRows=4">
            <Textarea
              size="xLarge"
              autoResize
              minRows={2}
              maxRows={4}
              placeholder="xLarge 사이즈 자동 확장..."
            />
          </FormField>
        </div>
      </section>

      {/* 4d. Standalone */}
      <section id="textarea-standalone" className="mb-12 scroll-mt-6">
        <SectionTitle>Standalone (without FormField)</SectionTitle>
        <div className="flex flex-col gap-3 max-w-xs">
          <Textarea placeholder="기본 텍스트 입력" minRows={2} />
          <Textarea placeholder="에러 상태" error minRows={2} />
          <Textarea positive defaultValue="유효한 값" minRows={2} />
          <Textarea disabled defaultValue="비활성 상태" minRows={2} />
          <Textarea readOnly defaultValue="읽기 전용 값" minRows={2} />
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="textarea-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="textarea-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="textarea-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="textarea-tokens"
        title="Design Tokens"
        description="Textarea uses its own size/spacing tokens and reuses TextField color tokens for visual consistency. Color tokens switch by theme, size tokens are theme-agnostic."
      >
        <TokensReference groups={sizeTokenGroups} />
      </ShowcaseSection>
    </>
  )
}
