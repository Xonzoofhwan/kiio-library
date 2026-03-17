import { useContext } from 'react'
import { BadgeLabel, BadgeCounter, BadgeDot, BADGE_COLORS, BADGE_SIZES, BADGE_WEIGHTS, BADGE_SHAPES } from '@/components/Badge'
import type { BadgeColor } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, RowHeader } from './shared'
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
import { extractHeader, extractSubComponentProps } from './spec-utils'
import badgeSpec from '../../specs/badge.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(badgeSpec)
const subComponentProps = extractSubComponentProps(badgeSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    color:  { kind: 'select', options: BADGE_COLORS },
    size:   { kind: 'select', options: BADGE_SIZES },
    weight: { kind: 'select', options: BADGE_WEIGHTS },
    shape:  { kind: 'select', options: BADGE_SHAPES },
    text:   { kind: 'text' },
  },
  defaults: {
    color: 'gray',
    size: 'small',
    weight: 'heavy',
    shape: 'square',
    text: 'Badge',
  },
  render: (props) => (
    <BadgeLabel
      color={props.color as BadgeColor}
      size={props.size as 'small' | 'medium'}
      weight={props.weight as 'light' | 'heavy'}
      shape={props.shape as 'square' | 'pill'}
    >
      {props.text as string}
    </BadgeLabel>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Indicating status, category, or metadata (e.g., Active, New, Beta)',
    'Displaying counts or notification numbers',
    'Color-coding items for quick visual identification',
  ],
  dontUse: [
    { text: 'Interactive filtering or selection', alternative: 'chip', alternativeLabel: 'Chip' },
    { text: 'Primary action trigger', alternative: 'button', alternativeLabel: 'Button' },
    { text: 'Displaying long text content' },
  ],
  related: [
    { id: 'chip', label: 'Chip' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'BadgeLabel',
    code: `<BadgeLabel color="indigo" weight="heavy">Active</BadgeLabel>
<BadgeLabel color="red-bright" weight="light" shape="pill">Error</BadgeLabel>`,
  },
  {
    title: 'BadgeCounter',
    code: `<BadgeCounter>3</BadgeCounter>
<BadgeCounter color="indigo">99+</BadgeCounter>`,
  },
  {
    title: 'BadgeDot',
    code: `<BadgeDot color="emerald" />
<BadgeDot color="red-bright" />`,
  },
  {
    title: 'Composition',
    code: `<div className="flex items-center gap-2">
  <BadgeDot color="emerald" />
  <span>Online</span>
  <BadgeCounter color="indigo">5</BadgeCounter>
</div>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'BadgeLabel Size & Shape',
    scope: ':root',
    tokens: [
      { name: '--comp-badge-height-sm', value: '20px' },
      { name: '--comp-badge-height-md', value: '28px' },
      { name: '--comp-badge-px-sm', value: '4px' },
      { name: '--comp-badge-px-md', value: '6px' },
      { name: '--comp-badge-px-sm-pill', value: '6px' },
      { name: '--comp-badge-px-md-pill', value: '8px' },
      { name: '--comp-badge-radius-sm', value: '4px' },
      { name: '--comp-badge-radius-md', value: '6px' },
      { name: '--comp-badge-radius-pill', value: '9999px' },
    ],
  },
  {
    title: 'BadgeCounter & Dot',
    scope: ':root',
    tokens: [
      { name: '--comp-badge-counter-height', value: '16px' },
      { name: '--comp-badge-counter-px', value: '6px' },
      { name: '--comp-badge-counter-min-w', value: '16px' },
      { name: '--comp-badge-dot-size', value: '8px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const BADGE_TOC: TocEntry[] = [
  { id: 'component-badge',          label: 'Badge',              level: 1 },
  { id: 'badge-playground',         label: 'Playground'                    },
  { id: 'badge-label',              label: 'BadgeLabel'                    },
  { id: 'badge-label-size-weight',  label: 'Size \u00d7 Weight'           },
  { id: 'badge-label-shape',        label: 'Shape'                        },
  { id: 'badge-label-colors',       label: 'Color Palette'                },
  { id: 'badge-counter',            label: 'BadgeCounter'                 },
  { id: 'badge-counter-examples',   label: 'Counter Examples'             },
  { id: 'badge-dot',                label: 'BadgeDot'                     },
  { id: 'badge-dot-colors',         label: 'Dot Colors'                   },
  { id: 'badge-usage',              label: 'Usage Guidelines'             },
  { id: 'badge-props',              label: 'Props'                        },
  { id: 'badge-code',               label: 'Code Examples'                },
  { id: 'badge-tokens',             label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function BadgeShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-badge"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="badge-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* ══════════════════ BadgeLabel ══════════════════ */}
      <h2 id="badge-label" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        BadgeLabel
      </h2>

      {/* ── Size × Weight ── */}
      <section id="badge-label-size-weight" className="mb-10 scroll-mt-6">
        <SectionTitle>Size × Weight</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          {BADGE_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {BADGE_WEIGHTS.map(weight => (
            <>
              <RowHeader key={`rh-${weight}`}>{weight}</RowHeader>
              {BADGE_SIZES.map(size => (
                <div key={`${weight}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <BadgeLabel size={size} weight={weight} color="gray">Label</BadgeLabel>
                </div>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* ── Shape ── */}
      <section id="badge-label-shape" className="mb-10 scroll-mt-6">
        <SectionTitle>Shape</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          {BADGE_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {BADGE_SHAPES.map(shape => (
            <>
              <RowHeader key={`rh-shape-${shape}`}>{shape}</RowHeader>
              {BADGE_SIZES.map(size => (
                <div key={`${shape}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <BadgeLabel size={size} shape={shape} weight="heavy" color="indigo">Label</BadgeLabel>
                </div>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* ── Color Palette ── */}
      <section id="badge-label-colors" className="mb-10 scroll-mt-6">
        <SectionTitle>Color Palette</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          <ColHeader>light</ColHeader>
          <ColHeader>heavy</ColHeader>

          {BADGE_COLORS.map(color => (
            <>
              <RowHeader key={`rh-color-${color}`}>{color}</RowHeader>
              <div key={`light-${color}`} className="flex justify-center py-2 border-t border-semantic-divider-solid-50">
                <BadgeLabel size="small" weight="light" color={color}>Label</BadgeLabel>
              </div>
              <div key={`heavy-${color}`} className="flex justify-center py-2 border-t border-semantic-divider-solid-50">
                <BadgeLabel size="small" weight="heavy" color={color}>Label</BadgeLabel>
              </div>
            </>
          ))}
        </div>
      </section>

      {/* ══════════════════ BadgeCounter ══════════════════ */}
      <h2 id="badge-counter" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        BadgeCounter
      </h2>

      <section id="badge-counter-examples" className="mb-12 scroll-mt-6">
        <SectionTitle>Counter Examples</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="typography-13-semibold text-semantic-text-on-bright-500 w-16">heavy</span>
            <BadgeCounter color="red-bright">1</BadgeCounter>
            <BadgeCounter color="red-bright">9</BadgeCounter>
            <BadgeCounter color="red-bright">99</BadgeCounter>
            <BadgeCounter color="red-bright">99+</BadgeCounter>
            <BadgeCounter color="indigo">New</BadgeCounter>
            <BadgeCounter color="purple">Beta</BadgeCounter>
          </div>
          <div className="flex items-center gap-3">
            <span className="typography-13-semibold text-semantic-text-on-bright-500 w-16">light</span>
            <BadgeCounter weight="light" color="red-bright">1</BadgeCounter>
            <BadgeCounter weight="light" color="red-bright">9</BadgeCounter>
            <BadgeCounter weight="light" color="red-bright">99</BadgeCounter>
            <BadgeCounter weight="light" color="red-bright">99+</BadgeCounter>
            <BadgeCounter weight="light" color="indigo">New</BadgeCounter>
            <BadgeCounter weight="light" color="purple">Beta</BadgeCounter>
          </div>
        </div>
      </section>

      {/* ══════════════════ BadgeDot ══════════════════ */}
      <h2 id="badge-dot" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        BadgeDot
      </h2>

      <section id="badge-dot-colors" className="mb-10 scroll-mt-6">
        <SectionTitle>Dot Colors</SectionTitle>
        <div className="flex flex-wrap items-center gap-4">
          {BADGE_COLORS.map(color => (
            <div key={`dot-${color}`} className="flex flex-col items-center gap-1.5">
              <BadgeDot color={color} />
              <span className="typography-12-regular text-semantic-text-on-bright-400">{color}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="badge-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="badge-props" title="Props">
        {subComponentProps.map(sub => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="badge-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="badge-tokens"
        title="Design Tokens"
        description="Size and shape tokens are theme-agnostic. Color tokens use primitive token lookup maps with shade inversion for dark mode."
      >
        <TokensReference groups={sizeTokenGroups} />
      </ShowcaseSection>
    </>
  )
}
