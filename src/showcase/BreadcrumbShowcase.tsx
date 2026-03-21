import { useContext } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BREADCRUMB_SIZES,
} from '@/components/Breadcrumb'
import type { BreadcrumbSize } from '@/components/Breadcrumb'
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
import { extractHeader } from './spec-utils'
import breadcrumbSpec from '../../specs/breadcrumb.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(breadcrumbSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:     { kind: 'select', options: BREADCRUMB_SIZES },
    separator: { kind: 'select', options: ['/', '>', '→', '·'] as const },
    maxItems: { kind: 'select', options: ['all', '3', '2'] as const },
  },
  defaults: {
    size: 'medium',
    separator: '/',
    maxItems: 'all',
  },
  render: (props) => (
    <Breadcrumb
      size={props.size as BreadcrumbSize}
      separator={props.separator as string}
      maxItems={props.maxItems === 'all' ? undefined : Number(props.maxItems as string)}
    >
      <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbLink href="#">Category</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbLink href="#">Subcategory</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbPage>Current Page</BreadcrumbPage></BreadcrumbItem>
    </Breadcrumb>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Showing navigation hierarchy in multi-level pages',
    'Providing quick navigation back to parent pages',
    'Using maxItems to collapse long paths in deep hierarchies',
  ],
  dontUse: [
    { text: 'As primary navigation — use Tabs or SideNav instead', alternative: 'tab', alternativeLabel: 'Tab' },
    { text: 'For single-level pages with no hierarchy' },
    { text: 'Displaying more than 5-6 visible items without collapsing' },
  ],
  related: [
    { id: 'tab', label: 'Tab' },
    { id: 'sidenav', label: 'SideNav' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<Breadcrumb>
  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbPage>Components</BreadcrumbPage></BreadcrumbItem>
</Breadcrumb>`,
  },
  {
    title: 'Custom separator',
    code: `<Breadcrumb separator="›">
  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbPage>Page</BreadcrumbPage></BreadcrumbItem>
</Breadcrumb>`,
  },
  {
    title: 'With maxItems',
    code: `<Breadcrumb maxItems={3}>
  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbLink href="/a">A</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbLink href="/b">B</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbLink href="/c">C</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
</Breadcrumb>`,
    description: 'Shows: Home / ··· / C / Current',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-breadcrumb-gap-sm', value: '4px' },
      { name: '--comp-breadcrumb-gap-md', value: '6px' },
      { name: '--comp-breadcrumb-gap-lg', value: '8px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-breadcrumb-link', value: 'semantic-text-on-bright-600' },
      { name: '--comp-breadcrumb-link-hover', value: 'semantic-text-on-bright-900' },
      { name: '--comp-breadcrumb-page', value: 'semantic-text-on-bright-900' },
      { name: '--comp-breadcrumb-separator', value: 'semantic-text-on-bright-400' },
      { name: '--comp-breadcrumb-focus-ring', value: 'semantic-primary-300' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const BREADCRUMB_TOC: TocEntry[] = [
  { id: 'component-breadcrumb',        label: 'Breadcrumb',         level: 1 },
  { id: 'breadcrumb-playground',       label: 'Playground'                   },
  { id: 'breadcrumb-sizes',            label: 'Sizes'                        },
  { id: 'breadcrumb-separators',       label: 'Separators'                   },
  { id: 'breadcrumb-max-items',        label: 'Max Items'                    },
  { id: 'breadcrumb-disabled',         label: 'Disabled Link'                },
  { id: 'breadcrumb-usage',            label: 'Usage Guidelines'             },
  { id: 'breadcrumb-props',            label: 'Props'                        },
  { id: 'breadcrumb-code',             label: 'Code Examples'                },
  { id: 'breadcrumb-tokens',           label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function BreadcrumbShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-breadcrumb"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="breadcrumb-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Sizes */}
      <section id="breadcrumb-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-4">
          {BREADCRUMB_SIZES.map(size => (
            <div key={size}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">{size}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <Breadcrumb size={size}>
                  <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbPage>Detail</BreadcrumbPage></BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Separators */}
      <section id="breadcrumb-separators" className="mb-10 scroll-mt-6">
        <SectionTitle>Separators</SectionTitle>
        <div className="flex flex-col gap-4">
          {['/', '>', '→', '·', '|'].map(sep => (
            <div key={sep}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">"{sep}"</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <Breadcrumb separator={sep}>
                  <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbPage>Page</BreadcrumbPage></BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Max Items */}
      <section id="breadcrumb-max-items" className="mb-10 scroll-mt-6">
        <SectionTitle>Max Items</SectionTitle>
        <div className="flex flex-col gap-4">
          {[undefined, 3, 2].map((max, i) => (
            <div key={i}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">
                maxItems={max ?? 'none'}
              </span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <Breadcrumb maxItems={max}>
                  <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbLink href="#">Category</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbLink href="#">Sub</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Disabled Link */}
      <section id="breadcrumb-disabled" className="mb-10 scroll-mt-6">
        <SectionTitle>Disabled Link</SectionTitle>
        <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
          <Breadcrumb>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbItem><BreadcrumbLink href="#" disabled>Disabled</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
          </Breadcrumb>
        </div>
      </section>

      {/* 7. Usage Guidelines */}
      <ShowcaseSection id="breadcrumb-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 8. Props Table */}
      <ShowcaseSection id="breadcrumb-props" title="Props">
        <PropsTable props={[
          { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Text and separator size' },
          { name: 'separator', type: 'ReactNode', default: "'/'", description: 'Custom separator between items' },
          { name: 'maxItems', type: 'number', default: 'undefined', description: 'Max visible items before collapsing' },
          { name: 'children', type: 'ReactNode', default: '—', description: 'BreadcrumbItem elements' },
        ]} title="Breadcrumb" />
        <PropsTable props={[
          { name: 'href', type: 'string', default: '—', description: 'Link URL' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the link' },
        ]} title="BreadcrumbLink" />
      </ShowcaseSection>

      {/* 9. Code Examples */}
      <ShowcaseSection id="breadcrumb-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 10. Design Tokens */}
      <ShowcaseSection
        id="breadcrumb-tokens"
        title="Design Tokens"
        description="Gap tokens scale with size. Color tokens switch per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
