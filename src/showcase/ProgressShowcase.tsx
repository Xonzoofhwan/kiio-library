import { useState, useEffect, useContext } from 'react'
import {
  ProgressBar,
  ProgressCircle,
  PROGRESS_BAR_SIZES,
  PROGRESS_BAR_INTENTS,
  PROGRESS_CIRCLE_SIZES,
} from '@/components/Progress'
import type { ProgressBarSize, ProgressBarIntent, ProgressCircleSize, ProgressCircleIntent } from '@/components/Progress'
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
import progressSpec from '../../specs/progress.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(progressSpec)

/* ─── Animated value hook ─────────────────────────────────────────────────── */

function useAnimatedValue() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => (prev >= 100 ? 0 : prev + 5))
    }, 300)
    return () => clearInterval(interval)
  }, [])
  return value
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    type:      { kind: 'select', options: ['bar', 'circle'] as const },
    size:      { kind: 'select', options: PROGRESS_BAR_SIZES },
    intent:    { kind: 'select', options: PROGRESS_BAR_INTENTS },
    value:     { kind: 'select', options: ['25', '50', '75', '100', 'indeterminate'] as const },
    showValue: { kind: 'select', options: ['false', 'true'] as const },
  },
  defaults: {
    type: 'bar',
    size: 'medium',
    intent: 'brand',
    value: '50',
    showValue: 'false',
  },
  render: (props) => {
    const val = props.value === 'indeterminate' ? undefined : Number(props.value as string)
    const show = props.showValue === 'true'

    if (props.type === 'circle') {
      return (
        <ProgressCircle
          value={val}
          size={props.size as ProgressCircleSize}
          intent={props.intent as ProgressCircleIntent}
          showValue={show}
        />
      )
    }

    return (
      <div className="w-full max-w-sm">
        <ProgressBar
          value={val}
          size={props.size as ProgressBarSize}
          intent={props.intent as ProgressBarIntent}
          label="Loading"
          showValue={show}
        />
      </div>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Showing determinate progress for uploads, downloads, or multi-step processes',
    'Using indeterminate mode when duration is unknown',
    'Matching intent to context — success for completed, error for failed',
  ],
  dontUse: [
    { text: 'Replacing Spinner for quick async operations — Spinner is more appropriate' },
    { text: 'Showing navigation progress (use a loading bar in the app shell instead)' },
  ],
  related: [],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'ProgressBar',
    code: `<ProgressBar value={60} intent="brand" label="Uploading" showValue />
<ProgressBar intent="success" />  {/* indeterminate */}`,
  },
  {
    title: 'ProgressCircle',
    code: `<ProgressCircle value={75} intent="brand" showValue />
<ProgressCircle intent="warning" />  {/* indeterminate spin */}`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'ProgressBar Size',
    scope: ':root',
    tokens: [
      { name: '--comp-progress-bar-height-sm', value: '4px' },
      { name: '--comp-progress-bar-height-md', value: '8px' },
      { name: '--comp-progress-bar-height-lg', value: '12px' },
      { name: '--comp-progress-bar-radius-sm', value: '2px' },
      { name: '--comp-progress-bar-radius-md', value: '4px' },
      { name: '--comp-progress-bar-radius-lg', value: '6px' },
    ],
  },
  {
    title: 'ProgressCircle Size',
    scope: ':root',
    tokens: [
      { name: '--comp-progress-circle-size-sm', value: '32px' },
      { name: '--comp-progress-circle-size-md', value: '48px' },
      { name: '--comp-progress-circle-size-lg', value: '64px' },
      { name: '--comp-progress-circle-stroke-sm', value: '3px' },
      { name: '--comp-progress-circle-stroke-md', value: '4px' },
      { name: '--comp-progress-circle-stroke-lg', value: '5px' },
    ],
  },
  {
    title: 'Intent Colors',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-progress-track-brand', value: 'semantic-primary-100' },
      { name: '--comp-progress-fill-brand', value: 'semantic-primary-500' },
      { name: '--comp-progress-track-success', value: 'semantic-success-100' },
      { name: '--comp-progress-fill-success', value: 'semantic-success-500' },
      { name: '--comp-progress-track-error', value: 'semantic-error-100' },
      { name: '--comp-progress-fill-error', value: 'semantic-error-500' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const PROGRESS_TOC: TocEntry[] = [
  { id: 'component-progress',          label: 'Progress',           level: 1 },
  { id: 'progress-playground',         label: 'Playground'                   },
  { id: 'progress-bar-sizes',          label: 'Bar — Sizes'                  },
  { id: 'progress-bar-intents',        label: 'Bar — Intents'                },
  { id: 'progress-bar-indeterminate',  label: 'Bar — Indeterminate'          },
  { id: 'progress-bar-label',          label: 'Bar — Label & Value'          },
  { id: 'progress-circle-sizes',       label: 'Circle — Sizes'               },
  { id: 'progress-circle-intents',     label: 'Circle — Intents'             },
  { id: 'progress-circle-indeterminate', label: 'Circle — Indeterminate'     },
  { id: 'progress-animated',           label: 'Animated Demo'                },
  { id: 'progress-usage',              label: 'Usage Guidelines'             },
  { id: 'progress-code',               label: 'Code Examples'                },
  { id: 'progress-tokens',             label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function ProgressShowcase() {
  const navigate = useContext(NavigateContext)
  const animValue = useAnimatedValue()

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-progress"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="progress-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* ═══ ProgressBar ═══ */}

      {/* 3. Bar Sizes */}
      <section id="progress-bar-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressBar — Sizes</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          {PROGRESS_BAR_SIZES.map(s => (
            <div key={s}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">{s}</span>
              <ProgressBar value={65} size={s} intent="brand" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bar Intents */}
      <section id="progress-bar-intents" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressBar — Intents</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          {PROGRESS_BAR_INTENTS.map(intent => (
            <div key={intent}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">{intent}</span>
              <ProgressBar value={60} intent={intent} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bar Indeterminate */}
      <section id="progress-bar-indeterminate" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressBar — Indeterminate</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          <ProgressBar intent="brand" />
          <ProgressBar intent="success" size="large" />
        </div>
      </section>

      {/* 6. Bar Label & Value */}
      <section id="progress-bar-label" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressBar — Label & Value</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          <ProgressBar value={72} label="Uploading files..." showValue />
          <ProgressBar value={100} label="Complete" intent="success" showValue />
          <ProgressBar value={35} label="Processing" intent="warning" showValue size="large" />
        </div>
      </section>

      {/* ═══ ProgressCircle ═══ */}

      {/* 7. Circle Sizes */}
      <section id="progress-circle-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressCircle — Sizes</SectionTitle>
        <div className="flex items-end gap-6">
          {PROGRESS_CIRCLE_SIZES.map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <ProgressCircle value={65} size={s} intent="brand" showValue />
              <span className="typography-12-regular text-semantic-text-on-bright-400">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Circle Intents */}
      <section id="progress-circle-intents" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressCircle — Intents</SectionTitle>
        <div className="flex items-center gap-6">
          {PROGRESS_BAR_INTENTS.map(intent => (
            <div key={intent} className="flex flex-col items-center gap-2">
              <ProgressCircle value={70} intent={intent} showValue />
              <span className="typography-12-regular text-semantic-text-on-bright-400">{intent}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Circle Indeterminate */}
      <section id="progress-circle-indeterminate" className="mb-10 scroll-mt-6">
        <SectionTitle>ProgressCircle — Indeterminate</SectionTitle>
        <div className="flex items-center gap-6">
          {PROGRESS_CIRCLE_SIZES.map(s => (
            <ProgressCircle key={s} size={s} intent="brand" />
          ))}
        </div>
      </section>

      {/* 10. Animated Demo */}
      <section id="progress-animated" className="mb-10 scroll-mt-6">
        <SectionTitle>Animated Demo</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <ProgressBar value={animValue} intent="brand" label="Auto-incrementing" showValue />
          <div className="flex items-center gap-6">
            <ProgressCircle value={animValue} intent="brand" showValue />
            <ProgressCircle value={animValue} intent="success" size="large" showValue />
          </div>
        </div>
      </section>

      {/* 11. Usage Guidelines */}
      <ShowcaseSection id="progress-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 12. Code Examples */}
      <ShowcaseSection id="progress-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 13. Design Tokens */}
      <ShowcaseSection
        id="progress-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Intent color tokens switch per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
