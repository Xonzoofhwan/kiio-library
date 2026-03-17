import { useState, useContext } from 'react'
import { FormField } from '@/components/FormField'
import { TagInput, TAG_INPUT_SIZES, TAG_POSITIONS } from '@/components/TagInput'
import type { TagInputSize, TagPosition } from '@/components/TagInput'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, SpecLabel } from './shared'
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
import type { PropRow } from './spec-utils'

/* ─── Manual header (no dedicated JSON spec) ──────────────────────────────── */

const header = {
  name: 'TagInput',
  description:
    'Multi-value text input that converts free-text entries into discrete tags (chips). Supports inline and below tag placement, keyboard entry with configurable separators, duplicate prevention, max tag limits, and custom validation. Integrates with FormField for label, error, and disabled state propagation.',
  classification: 'Composite',
}

/* ─── Manual props (derived from TagInputProps interface) ──────────────────── */

const propRows: PropRow[] = [
  { name: 'id',              type: 'string',                      default: '\u2014', description: 'Unique ID. Auto-provided by FormField Context or set directly.' },
  { name: 'value',           type: 'string[]',                    default: '[]',     description: 'Current tag list (controlled).' },
  { name: 'onChange',        type: '(tags: string[]) => void',    default: '\u2014', description: 'Callback when tag list changes.' },
  { name: 'placeholder',    type: 'string',                      default: '\u2014', description: 'Input placeholder. Shown only when no tags exist.' },
  { name: 'tagsPosition',   type: "'inline' | 'below'",          default: 'inline', description: 'Tag placement: inside the input or below it.' },
  { name: 'separators',     type: 'string[]',                    default: "['Enter', ',']", description: 'Keys that trigger tag creation.' },
  { name: 'maxTags',        type: 'number',                      default: '\u2014', description: 'Maximum number of tags allowed.' },
  { name: 'allowDuplicates', type: 'boolean',                    default: 'false',  description: 'Allow duplicate tag values.' },
  { name: 'validateTag',    type: '(tag: string) => boolean',    default: '\u2014', description: 'Custom validation. Return false to reject a tag.' },
  { name: 'size',           type: 'TagInputSize',                default: 'medium', description: 'Size variant (xSmall\u2013xLarge). Maps to TextField height tokens.' },
  { name: 'error',          type: 'boolean',                     default: 'false',  description: 'Error state. Auto-propagated from FormField.' },
  { name: 'disabled',       type: 'boolean',                     default: 'false',  description: 'Disabled state. Auto-propagated from FormField.' },
  { name: 'readOnly',       type: 'boolean',                     default: 'false',  description: 'Read-only state.' },
  { name: 'fullWidth',      type: 'boolean',                     default: 'true',   description: 'Expand container width to 100%.' },
  { name: 'pill',           type: 'boolean',                     default: 'false',  description: 'Capsule shape (9999px border-radius).' },
  { name: 'className',      type: 'string',                      default: '\u2014', description: 'Additional CSS class names.' },
]

/* ─── Playground config ───────────────────────────────────────────────────── */

function TagInputPlaygroundRenderer(props: Record<string, unknown>) {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])

  return (
    <div className="w-full max-w-md">
      <TagInput
        size={props.size as TagInputSize}
        tagsPosition={props.tagsPosition as TagPosition}
        disabled={props.disabled as boolean}
        placeholder={props.placeholder as string}
        value={tags}
        onChange={setTags}
      />
    </div>
  )
}

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:          { kind: 'select', options: TAG_INPUT_SIZES },
    tagsPosition:  { kind: 'select', options: TAG_POSITIONS },
    disabled:      { kind: 'boolean' },
    placeholder:   { kind: 'text' },
  },
  defaults: {
    size: 'medium',
    tagsPosition: 'inline',
    disabled: false,
    placeholder: 'Enter tag and press Enter\u2026',
  },
  render: (props) => <TagInputPlaygroundRenderer {...{ ...props }} />,
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Multiple value entry as chips/tags (email recipients, labels)',
    'Free-text input that creates discrete tokens on Enter',
    'Editable tag collections with remove capability',
  ],
  dontUse: [
    { text: 'Single value input', alternative: 'textfield', alternativeLabel: 'TextField' },
    { text: 'Predefined option selection', alternative: 'select', alternativeLabel: 'Select' },
    { text: 'Multi-select from fixed list', alternative: 'chip', alternativeLabel: 'Chip' },
  ],
  related: [
    { id: 'textfield', label: 'TextField' },
    { id: 'chip', label: 'Chip' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `const [tags, setTags] = useState<string[]>([])

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add tags\u2026"
/>`,
  },
  {
    title: 'With FormField',
    code: `<FormField id="labels" label="Labels" helperText="Press Enter or comma to add">
  <TagInput
    value={tags}
    onChange={setTags}
    placeholder="Add label\u2026"
  />
</FormField>`,
    description: 'Wrap in FormField for label, helper text, and error message support. State (error, disabled, readOnly) propagates automatically via Context.',
  },
  {
    title: 'Controlled with external state',
    code: `const [recipients, setRecipients] = useState<string[]>(['alice@example.com'])

<TagInput
  tagsPosition="below"
  value={recipients}
  onChange={setRecipients}
  placeholder="Enter email\u2026"
  size="large"
/>

<p>Recipients: {recipients.join(', ')}</p>`,
  },
  {
    title: 'With validation',
    code: `<TagInput
  value={tags}
  onChange={setTags}
  maxTags={5}
  allowDuplicates={false}
  validateTag={(tag) => tag.length >= 2}
  placeholder="Min 2 chars, max 5 tags\u2026"
/>`,
    description: 'Combine maxTags, allowDuplicates, and validateTag for input constraints.',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Background & Border (reuses TextField tokens)',
    rows: [
      { component: '--comp-textfield-bg',             semantic: 'neutral-solid-70',  lightPrimitive: 'gray-70',  lightHex: '#f5f5f7', darkPrimitive: 'gray-70',  darkHex: '#f5f5f7' },
      { component: '--comp-textfield-bg-focus',       semantic: 'neutral-solid-0',   lightPrimitive: 'gray-0',   lightHex: '#fdfefe', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-textfield-bg-error',       semantic: '= bg',              lightPrimitive: 'gray-70',  lightHex: '#f5f5f7', darkPrimitive: 'gray-70',  darkHex: '#f5f5f7' },
      { component: '--comp-textfield-bg-disabled',    semantic: 'neutral-solid-100', lightPrimitive: 'gray-100', lightHex: '#f0f1f3', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-textfield-bg-readonly',    semantic: 'neutral-solid-50',  lightPrimitive: 'gray-50',  lightHex: '#f8f8f9', darkPrimitive: 'gray-950', darkHex: '#1d1e22' },
      { component: '--comp-textfield-border',         semantic: 'neutral-solid-70',  lightPrimitive: 'gray-70',  lightHex: '#f5f5f7', darkPrimitive: 'gray-70',  darkHex: '#f5f5f7' },
      { component: '--comp-textfield-border-focus',   semantic: 'neutral-solid-400', lightPrimitive: 'gray-400', lightHex: '#a9abb2', darkPrimitive: 'gray-600', darkHex: '#4f535a' },
      { component: '--comp-textfield-border-error',   semantic: 'error-500',         lightPrimitive: 'red-500',  lightHex: '#ef4444', darkPrimitive: 'red-400',  darkHex: '#f87171' },
      { component: '--comp-textfield-border-disabled', semantic: 'neutral-solid-100', lightPrimitive: 'gray-100', lightHex: '#f0f1f3', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
    ],
  },
  {
    title: 'Text & State Overlay',
    rows: [
      { component: '--comp-textfield-text',                      semantic: 'text-on-bright-950',     lightPrimitive: 'gray-950', lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-textfield-text-placeholder',          semantic: 'neutral-solid-400',      lightPrimitive: 'gray-400', lightHex: '#a9abb2', darkPrimitive: 'gray-600', darkHex: '#4f535a' },
      { component: '--comp-textfield-text-disabled',             semantic: 'neutral-solid-400',      lightPrimitive: 'gray-400', lightHex: '#a9abb2', darkPrimitive: 'gray-600', darkHex: '#4f535a' },
      { component: '--comp-textfield-hover-on-bright',           semantic: 'state-on-bright-50',     lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',       darkPrimitive: 'black-alpha-50',  darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-textfield-active-on-bright',          semantic: 'state-on-bright-70',     lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)',       darkPrimitive: 'black-alpha-70',  darkHex: 'rgba(0,0,0,0.06)' },
      { component: '--comp-textfield-focus-ring',                semantic: 'neutral-solid-300',      lightPrimitive: 'gray-300', lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
      { component: '--comp-textfield-focus-ring-error',          semantic: 'error-500',              lightPrimitive: 'red-500',  lightHex: '#ef4444', darkPrimitive: 'red-400',  darkHex: '#f87171' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing (reuses TextField tokens)',
    scope: ':root',
    tokens: [
      { name: '--comp-textfield-height-xs', value: '24px' },
      { name: '--comp-textfield-height-sm', value: '32px' },
      { name: '--comp-textfield-height-md', value: '40px' },
      { name: '--comp-textfield-height-lg', value: '48px' },
      { name: '--comp-textfield-height-xl', value: '56px' },
      { name: '--comp-textfield-px-xs',     value: '8px' },
      { name: '--comp-textfield-px-sm',     value: '10px' },
      { name: '--comp-textfield-px-md',     value: '12px' },
      { name: '--comp-textfield-px-lg',     value: '14px' },
      { name: '--comp-textfield-px-xl',     value: '16px' },
      { name: '--comp-textfield-gap-xs',    value: '4px' },
      { name: '--comp-textfield-gap-sm',    value: '6px' },
      { name: '--comp-textfield-gap-md',    value: '8px' },
      { name: '--comp-textfield-gap-lg',    value: '8px' },
      { name: '--comp-textfield-gap-xl',    value: '10px' },
    ],
  },
  {
    title: 'Border Radius (reuses TextField tokens)',
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

export const TAGINPUT_TOC: TocEntry[] = [
  { id: 'component-taginput',      label: 'TagInput',              level: 1 },
  { id: 'taginput-playground',     label: 'Playground'                       },
  { id: 'taginput-anatomy',        label: 'Anatomy'                          },
  { id: 'taginput-inline',         label: 'Inline mode'                      },
  { id: 'taginput-below',          label: 'Below mode'                       },
  { id: 'taginput-states',         label: 'States'                           },
  { id: 'taginput-sizes',          label: 'Sizes'                            },
  { id: 'taginput-validation',     label: 'Max tags & validation'            },
  { id: 'taginput-usage',          label: 'Usage Guidelines'                 },
  { id: 'taginput-props',          label: 'Props'                            },
  { id: 'taginput-code',           label: 'Code Examples'                    },
  { id: 'taginput-tokens',         label: 'Design Tokens'                    },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TagInputShowcase() {
  const navigate = useContext(NavigateContext)

  const [inlineTags, setInlineTags] = useState<string[]>(['React', 'TypeScript'])
  const [belowTags, setBelowTags] = useState<string[]>(['Design', 'System'])
  const [errorTags, setErrorTags] = useState<string[]>(['error-tag'])
  const [disabledTags] = useState<string[]>(['frozen', 'tag'])
  const [readOnlyTags] = useState<string[]>(['read-only', 'tag'])
  const [sizeTags, setSizeTags] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(TAG_INPUT_SIZES.map(s => [s, []]))
  )

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-taginput"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="taginput-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="taginput-anatomy"
        title="Anatomy"
        description="TagInput's internal structure with two placement modes."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Inline mode:
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502 [ChipTag] [ChipTag] [input______] \u2502  \u2190 single container
\u2502 [ChipTag] [ChipTag]               \u2502     wraps to next line
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\u2514\u2500 state overlay (hover/active)

Below mode:
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502 [input_______________________________] \u2502  \u2190 fixed height container
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
[ChipTag] [ChipTag] [ChipTag]              \u2190 tags below`}
        </pre>
      </ShowcaseSection>

      {/* 4. Visual Sections (preserved from original) */}

      {/* 4a. Inline mode */}
      <section id="taginput-inline" className="mb-12 scroll-mt-6">
        <SectionTitle>Inline mode — tags inside the input</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-inline-field" label="Tags (inline)">
            <TagInput
              tagsPosition="inline"
              value={inlineTags}
              onChange={setInlineTags}
              placeholder="Enter tag and press Enter or comma\u2026"
            />
          </FormField>
        </div>
      </section>

      {/* 4b. Below mode */}
      <section id="taginput-below" className="mb-12 scroll-mt-6">
        <SectionTitle>Below mode — tags below the input</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-below-field" label="Tags (below)">
            <TagInput
              tagsPosition="below"
              value={belowTags}
              onChange={setBelowTags}
              placeholder="Enter tag and press Enter or comma\u2026"
            />
          </FormField>
        </div>
      </section>

      {/* 4c. States */}
      <section id="taginput-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-default" label="Default">
            <TagInput value={[]} onChange={() => {}} placeholder="Add tags\u2026" />
          </FormField>

          <FormField id="taginput-error" label="Error" error errorMessage="\ud0dc\uadf8 \uc785\ub825\uc5d0 \uc624\ub958\uac00 \uc788\uc2b5\ub2c8\ub2e4.">
            <TagInput value={errorTags} onChange={setErrorTags} placeholder="Add tags\u2026" />
          </FormField>

          <FormField id="taginput-disabled" label="Disabled" disabled>
            <TagInput value={disabledTags} placeholder="Disabled" />
          </FormField>

          <FormField id="taginput-readonly" label="Read Only" readOnly>
            <TagInput value={readOnlyTags} placeholder="Read Only" />
          </FormField>
        </div>
      </section>

      {/* 4d. Sizes */}
      <section id="taginput-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes (inline mode)</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          {TAG_INPUT_SIZES.map(size => (
            <div key={size}>
              <SpecLabel>{size}</SpecLabel>
              <TagInput
                size={size}
                tagsPosition="inline"
                value={sizeTags[size]}
                onChange={tags => setSizeTags(prev => ({ ...prev, [size]: tags }))}
                placeholder={`${size} \u2014 enter tags\u2026`}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4e. Max tags + validation */}
      <section id="taginput-validation" className="mb-12 scroll-mt-6">
        <SectionTitle>Max tags &amp; validation</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-max" label="Max 3 tags">
            <TagInput
              tagsPosition="inline"
              value={inlineTags.slice(0, 3)}
              onChange={tags => setInlineTags(tags.slice(0, 3))}
              maxTags={3}
              placeholder="Max 3 tags\u2026"
            />
          </FormField>
          <FormField id="taginput-nodup" label="No duplicates (default)">
            <TagInput
              tagsPosition="below"
              value={belowTags}
              onChange={setBelowTags}
              allowDuplicates={false}
              placeholder="Duplicate tags are rejected\u2026"
            />
          </FormField>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="taginput-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="taginput-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="taginput-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="taginput-tokens"
        title="Design Tokens"
        description="TagInput has no dedicated component tokens. It fully reuses TextField (--comp-textfield-*) tokens for sizing, spacing, colors, and states."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
