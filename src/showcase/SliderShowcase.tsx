import { useState, useContext } from 'react'
import { Slider, SLIDER_SIZES, SLIDER_INTENTS } from '@/components/Slider'
import type { SliderSize, SliderIntent } from '@/components/Slider'
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
import sliderSpec from '../../specs/slider.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(sliderSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: SLIDER_SIZES },
    intent:      { kind: 'select', options: SLIDER_INTENTS },
    mode:        { kind: 'select', options: ['single', 'range'] as const },
    showTooltip: { kind: 'select', options: ['false', 'true', 'always'] as const },
    disabled:    { kind: 'select', options: ['false', 'true'] as const },
  },
  defaults: {
    size: 'medium',
    intent: 'brand',
    mode: 'single',
    showTooltip: 'false',
    disabled: 'false',
  },
  render: (props) => (
    <div className="w-full max-w-sm">
      <Slider
        defaultValue={props.mode === 'range' ? [25, 75] : [50]}
        size={props.size as SliderSize}
        intent={props.intent as SliderIntent}
        showTooltip={props.showTooltip === 'always' ? 'always' : props.showTooltip === 'true'}
        disabled={props.disabled === 'true'}
      />
    </div>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Selecting a value within a numeric range (volume, price, brightness)',
    'Dual thumbs for min/max range filtering (price range, date range)',
    'Adding marks for predefined step values',
  ],
  dontUse: [
    { text: 'Precise numeric input — use TextField type=number instead' },
    { text: 'Binary choices — use Switch', alternative: 'switch', alternativeLabel: 'Switch' },
    { text: 'Selecting from discrete options — use RadioGroup', alternative: 'radio-group', alternativeLabel: 'RadioGroup' },
  ],
  related: [
    { id: 'switch', label: 'Switch' },
    { id: 'radio-group', label: 'RadioGroup' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Slider defaultValue={[50]} />`,
  },
  {
    title: 'Range (dual thumb)',
    code: `<Slider defaultValue={[20, 80]} />`,
  },
  {
    title: 'With marks',
    code: `<Slider
  defaultValue={[50]}
  marks={[
    { value: 0, label: '0%' },
    { value: 50, label: '50%' },
    { value: 100, label: '100%' },
  ]}
/>`,
  },
  {
    title: 'Tooltip always visible',
    code: `<Slider defaultValue={[30]} showTooltip="always" />`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size',
    scope: ':root',
    tokens: [
      { name: '--comp-slider-track-height-sm', value: '4px' },
      { name: '--comp-slider-track-height-md', value: '6px' },
      { name: '--comp-slider-track-height-lg', value: '8px' },
      { name: '--comp-slider-thumb-sm', value: '16px' },
      { name: '--comp-slider-thumb-md', value: '20px' },
      { name: '--comp-slider-thumb-lg', value: '24px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-slider-track', value: 'semantic-neutral-solid-200' },
      { name: '--comp-slider-range-brand', value: 'semantic-primary-500' },
      { name: '--comp-slider-thumb-bg', value: 'semantic-neutral-solid-0' },
      { name: '--comp-slider-thumb-border-brand', value: 'semantic-primary-500' },
      { name: '--comp-slider-focus-ring', value: 'semantic-primary-300' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SLIDER_TOC: TocEntry[] = [
  { id: 'component-slider',        label: 'Slider',             level: 1 },
  { id: 'slider-playground',       label: 'Playground'                   },
  { id: 'slider-sizes',            label: 'Sizes'                        },
  { id: 'slider-intents',          label: 'Intents'                      },
  { id: 'slider-range',            label: 'Range (Dual Thumb)'           },
  { id: 'slider-tooltip',          label: 'Tooltip'                      },
  { id: 'slider-marks',            label: 'Marks'                        },
  { id: 'slider-disabled',         label: 'Disabled'                     },
  { id: 'slider-controlled',       label: 'Controlled'                   },
  { id: 'slider-usage',            label: 'Usage Guidelines'             },
  { id: 'slider-code',             label: 'Code Examples'                },
  { id: 'slider-tokens',           label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SliderShowcase() {
  const navigate = useContext(NavigateContext)
  const [controlled, setControlled] = useState([40])
  const [rangeControlled, setRangeControlled] = useState([20, 70])

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-slider"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="slider-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Sizes */}
      <section id="slider-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-6 max-w-sm">
          {SLIDER_SIZES.map(s => (
            <div key={s}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{s}</span>
              <Slider defaultValue={[50]} size={s} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Intents */}
      <section id="slider-intents" className="mb-10 scroll-mt-6">
        <SectionTitle>Intents</SectionTitle>
        <div className="flex flex-col gap-6 max-w-sm">
          {SLIDER_INTENTS.map(intent => (
            <div key={intent}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{intent}</span>
              <Slider defaultValue={[60]} intent={intent} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Range */}
      <section id="slider-range" className="mb-10 scroll-mt-6">
        <SectionTitle>Range (Dual Thumb)</SectionTitle>
        <div className="max-w-sm">
          <Slider defaultValue={[25, 75]} showTooltip="always" />
        </div>
      </section>

      {/* 6. Tooltip */}
      <section id="slider-tooltip" className="mb-10 scroll-mt-6">
        <SectionTitle>Tooltip</SectionTitle>
        <div className="flex flex-col gap-6 max-w-sm">
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">showTooltip="always"</span>
            <Slider defaultValue={[50]} showTooltip="always" />
          </div>
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">showTooltip={'{true}'} (drag only)</span>
            <Slider defaultValue={[50]} showTooltip />
          </div>
        </div>
      </section>

      {/* 7. Marks */}
      <section id="slider-marks" className="mb-10 scroll-mt-6">
        <SectionTitle>Marks</SectionTitle>
        <div className="max-w-sm pb-6">
          <Slider
            defaultValue={[50]}
            marks={[
              { value: 0, label: '0%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 100, label: '100%' },
            ]}
          />
        </div>
      </section>

      {/* 8. Disabled */}
      <section id="slider-disabled" className="mb-10 scroll-mt-6">
        <SectionTitle>Disabled</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <Slider defaultValue={[40]} disabled />
          <Slider defaultValue={[20, 60]} disabled />
        </div>
      </section>

      {/* 9. Controlled */}
      <section id="slider-controlled" className="mb-10 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex flex-col gap-6 max-w-sm">
          <div>
            <Slider value={controlled} onValueChange={setControlled} showTooltip="always" />
            <span className="typography-13-regular text-semantic-text-on-bright-500 mt-2 block">
              Value: <strong>{controlled[0]}</strong>
            </span>
          </div>
          <div>
            <Slider value={rangeControlled} onValueChange={setRangeControlled} showTooltip="always" />
            <span className="typography-13-regular text-semantic-text-on-bright-500 mt-2 block">
              Range: <strong>{rangeControlled[0]}</strong> – <strong>{rangeControlled[1]}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 10. Usage Guidelines */}
      <ShowcaseSection id="slider-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 11. Code Examples */}
      <ShowcaseSection id="slider-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 12. Design Tokens */}
      <ShowcaseSection
        id="slider-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Color tokens switch per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
