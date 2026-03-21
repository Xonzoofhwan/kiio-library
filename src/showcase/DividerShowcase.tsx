import { useContext } from 'react'
import {
  Divider,
  DIVIDER_ORIENTATIONS,
  DIVIDER_SPACINGS,
  DIVIDER_WEIGHTS,
  DIVIDER_VARIANTS,
  DIVIDER_LABEL_POSITIONS,
} from '@/components/Divider'
import type { DividerOrientation, DividerSpacing, DividerWeight, DividerVariant, DividerLabelPosition } from '@/components/Divider'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from './shared'
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
import { extractHeader, extractProps } from './spec-utils'
import dividerSpec from '../../specs/divider.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(dividerSpec)
const propsData = extractProps(dividerSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    orientation:    { kind: 'select', options: DIVIDER_ORIENTATIONS },
    spacing:        { kind: 'select', options: DIVIDER_SPACINGS },
    weight:         { kind: 'select', options: DIVIDER_WEIGHTS },
    variant:        { kind: 'select', options: DIVIDER_VARIANTS },
    label:          { kind: 'text' },
    labelPosition:  { kind: 'select', options: DIVIDER_LABEL_POSITIONS },
  },
  defaults: {
    orientation: 'horizontal',
    spacing: 'default',
    weight: 'thin',
    variant: 'solid',
    label: '',
    labelPosition: 'center',
  },
  render: (props) => {
    const orientation = props.orientation as DividerOrientation
    const label = (props.label as string) || undefined

    if (orientation === 'vertical') {
      return (
        <div className="flex items-stretch h-20 gap-4">
          <span className="typography-14-regular text-semantic-text-on-bright-600">Left</span>
          <Divider
            orientation="vertical"
            spacing={props.spacing as DividerSpacing}
            weight={props.weight as DividerWeight}
            variant={props.variant as DividerVariant}
          />
          <span className="typography-14-regular text-semantic-text-on-bright-600">Right</span>
        </div>
      )
    }

    return (
      <div className="w-full">
        <span className="typography-14-regular text-semantic-text-on-bright-600">Above</span>
        <Divider
          orientation="horizontal"
          spacing={props.spacing as DividerSpacing}
          weight={props.weight as DividerWeight}
          variant={props.variant as DividerVariant}
          label={label}
          labelPosition={props.labelPosition as DividerLabelPosition}
        />
        <span className="typography-14-regular text-semantic-text-on-bright-600">Below</span>
      </div>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Separating content sections within a page or panel',
    'Creating visual grouping in lists, menus, or sidebars',
    'Using the label prop for inline section headers (e.g., "OR", "More options")',
  ],
  dontUse: [
    { text: 'Decorative borders around components', alternative: undefined },
    { text: 'As a spacer without any visual line — use spacing utilities instead' },
    { text: 'Vertical orientation without a flex parent' },
  ],
  related: [],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic horizontal',
    code: `<Divider />
<Divider spacing="spacious" />
<Divider weight="thick" />`,
  },
  {
    title: 'With label',
    code: `<Divider label="OR" />
<Divider label="Section" labelPosition="left" />`,
  },
  {
    title: 'Line styles',
    code: `<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />`,
  },
  {
    title: 'Vertical in flex container',
    code: `<div className="flex items-center gap-4 h-10">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-divider-weight-thin', value: '1px' },
      { name: '--comp-divider-weight-thick', value: '2px' },
      { name: '--comp-divider-spacing-none', value: '0px' },
      { name: '--comp-divider-spacing-compact', value: '4px' },
      { name: '--comp-divider-spacing-default', value: '8px' },
      { name: '--comp-divider-spacing-spacious', value: '16px' },
      { name: '--comp-divider-label-gap', value: '8px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-divider-color', value: 'semantic-divider-solid-100' },
      { name: '--comp-divider-label-color', value: 'semantic-text-on-bright-500' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const DIVIDER_TOC: TocEntry[] = [
  { id: 'component-divider',            label: 'Divider',            level: 1 },
  { id: 'divider-playground',           label: 'Playground'                   },
  { id: 'divider-orientation',          label: 'Orientation'                  },
  { id: 'divider-spacing',             label: 'Spacing'                      },
  { id: 'divider-weight-variant',      label: 'Weight × Variant'            },
  { id: 'divider-label',               label: 'With Label'                   },
  { id: 'divider-usage',               label: 'Usage Guidelines'             },
  { id: 'divider-props',               label: 'Props'                        },
  { id: 'divider-code',                label: 'Code Examples'                },
  { id: 'divider-tokens',              label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function DividerShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-divider"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="divider-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Orientation */}
      <section id="divider-orientation" className="mb-10 scroll-mt-6">
        <SectionTitle>Orientation</SectionTitle>
        <div className="flex flex-col gap-6">
          {/* Horizontal */}
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">horizontal (default)</span>
            <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
              <span className="typography-14-regular text-semantic-text-on-bright-600">Content above</span>
              <Divider />
              <span className="typography-14-regular text-semantic-text-on-bright-600">Content below</span>
            </div>
          </div>
          {/* Vertical */}
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">vertical</span>
            <div className="flex items-center gap-4 p-4 rounded-2 border border-semantic-divider-solid-50 h-16">
              <span className="typography-14-regular text-semantic-text-on-bright-600">Left</span>
              <Divider orientation="vertical" />
              <span className="typography-14-regular text-semantic-text-on-bright-600">Right</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Spacing */}
      <section id="divider-spacing" className="mb-10 scroll-mt-6">
        <SectionTitle>Spacing</SectionTitle>
        <div className="flex flex-col gap-4">
          {DIVIDER_SPACINGS.map(sp => (
            <div key={sp}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-1 block">{sp}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50 bg-semantic-background-0">
                <div className="typography-14-regular text-semantic-text-on-bright-600">Above</div>
                <Divider spacing={sp} />
                <div className="typography-14-regular text-semantic-text-on-bright-600">Below</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Weight × Variant */}
      <section id="divider-weight-variant" className="mb-10 scroll-mt-6">
        <SectionTitle>Weight × Variant</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(3,1fr)] gap-x-4 gap-y-0">
          <div />
          {DIVIDER_VARIANTS.map(v => (
            <div key={v} className="typography-13-semibold text-semantic-text-on-bright-500 text-center py-2">{v}</div>
          ))}

          {DIVIDER_WEIGHTS.map(w => (
            <>
              <div key={`rh-${w}`} className="typography-13-medium text-semantic-text-on-bright-600 flex items-center">{w}</div>
              {DIVIDER_VARIANTS.map(v => (
                <div key={`${w}-${v}`} className="flex items-center justify-center py-6 border-t border-semantic-divider-solid-50">
                  <div className="w-full">
                    <Divider weight={w} variant={v} spacing="none" />
                  </div>
                </div>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* 6. With Label */}
      <section id="divider-label" className="mb-10 scroll-mt-6">
        <SectionTitle>With Label</SectionTitle>
        <div className="flex flex-col gap-4">
          {DIVIDER_LABEL_POSITIONS.map(pos => (
            <div key={pos}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-1 block">labelPosition: {pos}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <Divider label="OR" labelPosition={pos} />
              </div>
            </div>
          ))}
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-1 block">dashed + label</span>
            <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
              <Divider label="Section" variant="dashed" labelPosition="left" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Usage Guidelines */}
      <ShowcaseSection id="divider-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 8. Props Table */}
      <ShowcaseSection id="divider-props" title="Props">
        <PropsTable props={propsData} />
      </ShowcaseSection>

      {/* 9. Code Examples */}
      <ShowcaseSection id="divider-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 10. Design Tokens */}
      <ShowcaseSection
        id="divider-tokens"
        title="Design Tokens"
        description="Size and spacing tokens are theme-agnostic (:root). Color tokens reference semantic tokens and switch automatically in dark mode."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
