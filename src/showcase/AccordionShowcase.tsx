import { useContext } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ACCORDION_VARIANTS,
  ACCORDION_SIZES,
} from '@/components/Accordion'
import type { AccordionVariant, AccordionSize } from '@/components/Accordion'
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
import accordionSpec from '../../specs/accordion.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(accordionSpec)

/* ─── Sample items helper ─────────────────────────────────────────────────── */

function SampleItems() {
  return (
    <>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is a design system?</AccordionTrigger>
        <AccordionContent>
          A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Why use design tokens?</AccordionTrigger>
        <AccordionContent>
          Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They help maintain consistency across platforms.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How does theming work?</AccordionTrigger>
        <AccordionContent>
          Theming is handled via semantic tokens that map to different primitive values based on the active theme. Switch between light and dark using the data-theme attribute.
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant:     { kind: 'select', options: ACCORDION_VARIANTS },
    size:        { kind: 'select', options: ACCORDION_SIZES },
    type:        { kind: 'select', options: ['single', 'multiple'] as const },
    collapsible: { kind: 'select', options: ['true', 'false'] as const },
  },
  defaults: {
    variant: 'default',
    size: 'medium',
    type: 'single',
    collapsible: 'true',
  },
  render: (props) => {
    const type = props.type as 'single' | 'multiple'
    if (type === 'multiple') {
      return (
        <Accordion
          type="multiple"
          variant={props.variant as AccordionVariant}
          size={props.size as AccordionSize}
          defaultValue={['item-1']}
        >
          <SampleItems />
        </Accordion>
      )
    }
    return (
      <Accordion
        type="single"
        variant={props.variant as AccordionVariant}
        size={props.size as AccordionSize}
        collapsible={props.collapsible === 'true'}
        defaultValue="item-1"
      >
        <SampleItems />
      </Accordion>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'FAQ sections with expand/collapse behavior',
    'Settings panels with grouped options',
    'Long content sections that benefit from progressive disclosure',
  ],
  dontUse: [
    { text: 'Page-level navigation', alternative: 'tab', alternativeLabel: 'Tab' },
    { text: 'Single toggle visibility — use a simple collapsible instead' },
    { text: 'Content that users need to see all at once' },
  ],
  related: [
    { id: 'tab', label: 'Tab' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic single',
    code: `<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  {
    title: 'Multiple + separated',
    code: `<Accordion type="multiple" variant="separated">
  <AccordionItem value="a">
    <AccordionTrigger>Item A</AccordionTrigger>
    <AccordionContent>Details A</AccordionContent>
  </AccordionItem>
  <AccordionItem value="b">
    <AccordionTrigger>Item B</AccordionTrigger>
    <AccordionContent>Details B</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-accordion-trigger-py-sm', value: '10px' },
      { name: '--comp-accordion-trigger-py-md', value: '14px' },
      { name: '--comp-accordion-trigger-py-lg', value: '18px' },
      { name: '--comp-accordion-trigger-px-sm', value: '12px' },
      { name: '--comp-accordion-trigger-px-md', value: '16px' },
      { name: '--comp-accordion-trigger-px-lg', value: '20px' },
      { name: '--comp-accordion-radius', value: '8px' },
      { name: '--comp-accordion-separated-gap', value: '8px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-accordion-border', value: 'semantic-divider-solid-100' },
      { name: '--comp-accordion-trigger-text', value: 'semantic-text-on-bright-900' },
      { name: '--comp-accordion-trigger-hover', value: 'semantic-state-on-bright-50' },
      { name: '--comp-accordion-chevron', value: 'semantic-text-on-bright-500' },
      { name: '--comp-accordion-focus-ring', value: 'semantic-primary-300' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const ACCORDION_TOC: TocEntry[] = [
  { id: 'component-accordion',         label: 'Accordion',          level: 1 },
  { id: 'accordion-playground',        label: 'Playground'                   },
  { id: 'accordion-variants',          label: 'Variants'                     },
  { id: 'accordion-sizes',             label: 'Sizes'                        },
  { id: 'accordion-multiple',          label: 'Multiple'                     },
  { id: 'accordion-disabled',          label: 'Disabled'                     },
  { id: 'accordion-usage',             label: 'Usage Guidelines'             },
  { id: 'accordion-code',              label: 'Code Examples'                },
  { id: 'accordion-tokens',            label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function AccordionShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-accordion"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="accordion-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Variants */}
      <section id="accordion-variants" className="mb-10 scroll-mt-6">
        <SectionTitle>Variants</SectionTitle>
        <div className="flex flex-col gap-6 max-w-lg">
          {ACCORDION_VARIANTS.map(v => (
            <div key={v}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{v}</span>
              <Accordion type="single" collapsible variant={v} defaultValue="v-1">
                <AccordionItem value="v-1">
                  <AccordionTrigger>First section</AccordionTrigger>
                  <AccordionContent>Content for the first section goes here.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="v-2">
                  <AccordionTrigger>Second section</AccordionTrigger>
                  <AccordionContent>Content for the second section goes here.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="v-3">
                  <AccordionTrigger>Third section</AccordionTrigger>
                  <AccordionContent>Content for the third section goes here.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Sizes */}
      <section id="accordion-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-6 max-w-lg">
          {ACCORDION_SIZES.map(s => (
            <div key={s}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{s}</span>
              <Accordion type="single" collapsible variant="outlined" size={s} defaultValue="s-1">
                <AccordionItem value="s-1">
                  <AccordionTrigger>Expandable section</AccordionTrigger>
                  <AccordionContent>This demonstrates the {s} size variant with appropriate padding and typography.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="s-2">
                  <AccordionTrigger>Another section</AccordionTrigger>
                  <AccordionContent>More content here.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Multiple */}
      <section id="accordion-multiple" className="mb-10 scroll-mt-6">
        <SectionTitle>Multiple (open several at once)</SectionTitle>
        <div className="max-w-lg">
          <Accordion type="multiple" variant="separated" defaultValue={['m-1', 'm-2']}>
            <AccordionItem value="m-1">
              <AccordionTrigger>Section A (open)</AccordionTrigger>
              <AccordionContent>Both this and Section B are open by default.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="m-2">
              <AccordionTrigger>Section B (open)</AccordionTrigger>
              <AccordionContent>Multiple items can be expanded simultaneously.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="m-3">
              <AccordionTrigger>Section C (closed)</AccordionTrigger>
              <AccordionContent>Click to expand this one too.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 6. Disabled */}
      <section id="accordion-disabled" className="mb-10 scroll-mt-6">
        <SectionTitle>Disabled</SectionTitle>
        <div className="max-w-lg">
          <Accordion type="single" collapsible variant="outlined">
            <AccordionItem value="d-1">
              <AccordionTrigger>Enabled item</AccordionTrigger>
              <AccordionContent>This item works normally.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="d-2" disabled>
              <AccordionTrigger>Disabled item</AccordionTrigger>
              <AccordionContent>This content is not accessible.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="d-3">
              <AccordionTrigger>Another enabled item</AccordionTrigger>
              <AccordionContent>This also works.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 7. Usage Guidelines */}
      <ShowcaseSection id="accordion-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 8. Code Examples */}
      <ShowcaseSection id="accordion-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 9. Design Tokens */}
      <ShowcaseSection
        id="accordion-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Color tokens switch per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
