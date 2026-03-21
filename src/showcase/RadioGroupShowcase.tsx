import { useState, useContext } from 'react'
import {
  RadioGroup,
  RadioGroupItem,
  RADIO_GROUP_SIZES,
  RADIO_GROUP_ORIENTATIONS,
} from '@/components/RadioGroup'
import type { RadioGroupSize, RadioGroupOrientation } from '@/components/RadioGroup'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from './shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
} from './showcase-blocks'
import { extractHeader } from './spec-utils'
import radioGroupSpec from '../../specs/radio-group.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(radioGroupSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: RADIO_GROUP_SIZES },
    orientation: { kind: 'select', options: RADIO_GROUP_ORIENTATIONS },
    disabled:    { kind: 'select', options: ['false', 'true'] as const },
  },
  defaults: {
    size: 'medium',
    orientation: 'vertical',
    disabled: 'false',
  },
  render: (props) => (
    <RadioGroup
      defaultValue="option-1"
      size={props.size as RadioGroupSize}
      orientation={props.orientation as RadioGroupOrientation}
      disabled={props.disabled === 'true'}
    >
      <RadioGroupItem value="option-1" label="Option 1" description="First option description" />
      <RadioGroupItem value="option-2" label="Option 2" description="Second option description" />
      <RadioGroupItem value="option-3" label="Option 3" description="Third option description" />
    </RadioGroup>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Mutually exclusive choices in forms (settings, surveys, configuration)',
    'Options that need labels and descriptions for clarity',
    'When the number of options is between 2-6',
  ],
  dontUse: [
    { text: 'Immediate toggle actions', alternative: 'segment-bar', alternativeLabel: 'SegmentBar' },
    { text: 'Binary on/off choices', alternative: 'switch', alternativeLabel: 'Switch' },
    { text: 'Large option sets (7+) — use Select instead', alternative: 'select', alternativeLabel: 'Select' },
  ],
  related: [
    { id: 'segment-bar', label: 'SegmentBar' },
    { id: 'switch', label: 'Switch' },
    { id: 'select', label: 'Select' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<RadioGroup defaultValue="email">
  <RadioGroupItem value="email" label="Email" />
  <RadioGroupItem value="sms" label="SMS" />
  <RadioGroupItem value="push" label="Push notification" />
</RadioGroup>`,
  },
  {
    title: 'With descriptions',
    code: `<RadioGroup defaultValue="standard">
  <RadioGroupItem
    value="standard"
    label="Standard"
    description="4-10 business days"
  />
  <RadioGroupItem
    value="express"
    label="Express"
    description="2-5 business days"
  />
</RadioGroup>`,
  },
  {
    title: 'Controlled',
    code: `const [value, setValue] = useState('plan-1')

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="plan-1" label="Free" />
  <RadioGroupItem value="plan-2" label="Pro" />
</RadioGroup>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-radio-size-md', value: '20px' },
      { name: '--comp-radio-size-lg', value: '24px' },
      { name: '--comp-radio-dot-md', value: '8px' },
      { name: '--comp-radio-dot-lg', value: '10px' },
      { name: '--comp-radio-gap-md', value: '8px' },
      { name: '--comp-radio-gap-lg', value: '10px' },
      { name: '--comp-radio-item-gap-md', value: '12px' },
      { name: '--comp-radio-item-gap-lg', value: '16px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-radio-border', value: 'semantic-neutral-solid-300' },
      { name: '--comp-radio-border-checked', value: 'semantic-primary-500' },
      { name: '--comp-radio-bg-checked', value: 'semantic-primary-500' },
      { name: '--comp-radio-dot', value: 'semantic-neutral-solid-0' },
      { name: '--comp-radio-focus-ring', value: 'semantic-primary-300' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const RADIOGROUP_TOC: TocEntry[] = [
  { id: 'component-radio-group',       label: 'RadioGroup',         level: 1 },
  { id: 'radio-group-playground',      label: 'Playground'                   },
  { id: 'radio-group-sizes',           label: 'Sizes'                        },
  { id: 'radio-group-orientation',     label: 'Orientation'                  },
  { id: 'radio-group-descriptions',    label: 'With Descriptions'            },
  { id: 'radio-group-disabled',        label: 'Disabled'                     },
  { id: 'radio-group-controlled',      label: 'Controlled'                   },
  { id: 'radio-group-usage',           label: 'Usage Guidelines'             },
  { id: 'radio-group-code',            label: 'Code Examples'                },
  { id: 'radio-group-tokens',          label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function RadioGroupShowcase() {
  const navigate = useContext(NavigateContext)
  const [controlled, setControlled] = useState('plan-1')

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-radio-group"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="radio-group-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Sizes */}
      <section id="radio-group-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-6">
          {RADIO_GROUP_SIZES.map(size => (
            <div key={size}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{size}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <RadioGroup defaultValue="a" size={size}>
                  <RadioGroupItem value="a" label="Option A" />
                  <RadioGroupItem value="b" label="Option B" />
                  <RadioGroupItem value="c" label="Option C" />
                </RadioGroup>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Orientation */}
      <section id="radio-group-orientation" className="mb-10 scroll-mt-6">
        <SectionTitle>Orientation</SectionTitle>
        <div className="flex flex-col gap-6">
          {RADIO_GROUP_ORIENTATIONS.map(orient => (
            <div key={orient}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{orient}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <RadioGroup defaultValue="x" orientation={orient}>
                  <RadioGroupItem value="x" label="Choice X" />
                  <RadioGroupItem value="y" label="Choice Y" />
                  <RadioGroupItem value="z" label="Choice Z" />
                </RadioGroup>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. With Descriptions */}
      <section id="radio-group-descriptions" className="mb-10 scroll-mt-6">
        <SectionTitle>With Descriptions</SectionTitle>
        <div className="p-4 rounded-2 border border-semantic-divider-solid-50 max-w-md">
          <RadioGroup defaultValue="standard" size="large">
            <RadioGroupItem value="standard" label="Standard" description="4-10 business days. Free for orders over $50." />
            <RadioGroupItem value="express" label="Express" description="2-5 business days. $9.99 flat rate." />
            <RadioGroupItem value="overnight" label="Overnight" description="Next business day. $24.99 flat rate." />
          </RadioGroup>
        </div>
      </section>

      {/* 6. Disabled */}
      <section id="radio-group-disabled" className="mb-10 scroll-mt-6">
        <SectionTitle>Disabled</SectionTitle>
        <div className="flex flex-col gap-6">
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">Group disabled</span>
            <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
              <RadioGroup defaultValue="a" disabled>
                <RadioGroupItem value="a" label="Selected & disabled" />
                <RadioGroupItem value="b" label="Unselected & disabled" />
              </RadioGroup>
            </div>
          </div>
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">Individual disabled</span>
            <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
              <RadioGroup defaultValue="a">
                <RadioGroupItem value="a" label="Available" />
                <RadioGroupItem value="b" label="Unavailable (disabled)" disabled />
                <RadioGroupItem value="c" label="Available" />
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Controlled */}
      <section id="radio-group-controlled" className="mb-10 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="p-4 rounded-2 border border-semantic-divider-solid-50 max-w-sm">
          <RadioGroup value={controlled} onValueChange={setControlled}>
            <RadioGroupItem value="plan-1" label="Free" description="Basic features" />
            <RadioGroupItem value="plan-2" label="Pro" description="Advanced features" />
            <RadioGroupItem value="plan-3" label="Enterprise" description="Custom solutions" />
          </RadioGroup>
          <div className="mt-4 pt-4 border-t border-semantic-divider-solid-50">
            <span className="typography-13-regular text-semantic-text-on-bright-500">
              Selected: <strong>{controlled}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 8. Usage Guidelines */}
      <ShowcaseSection id="radio-group-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 9. Code Examples */}
      <ShowcaseSection id="radio-group-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 10. Design Tokens */}
      <ShowcaseSection
        id="radio-group-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Color tokens switch per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
