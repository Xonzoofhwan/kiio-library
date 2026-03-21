import { useContext } from 'react'
import {
  Skeleton,
  SKELETON_VARIANTS,
  SKELETON_ANIMATIONS,
} from '@/components/Skeleton'
import type { SkeletonVariant, SkeletonAnimation } from '@/components/Skeleton'
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
import skeletonSpec from '../../specs/skeleton.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(skeletonSpec)
const propsData = extractProps(skeletonSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant:   { kind: 'select', options: SKELETON_VARIANTS },
    animation: { kind: 'select', options: SKELETON_ANIMATIONS },
    lines:     { kind: 'select', options: ['1', '2', '3', '4'] as const },
  },
  defaults: {
    variant: 'text',
    animation: 'pulse',
    lines: '1',
  },
  render: (props) => {
    const variant = props.variant as SkeletonVariant
    const animation = props.animation as SkeletonAnimation
    const lines = Number(props.lines as string)

    return (
      <div className="w-full max-w-sm">
        <Skeleton variant={variant} animation={animation} lines={variant === 'text' ? lines : 1} />
      </div>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Showing placeholders while data is loading to prevent layout shift',
    'Matching the shape and size of actual content (text → text, avatar → circular)',
    'Combining multiple Skeleton elements to preview a full content layout',
  ],
  dontUse: [
    { text: 'Interactive or clickable placeholders' },
    { text: 'Replacing spinners for quick async operations — use Spinner instead' },
    { text: 'As decorative background elements' },
  ],
  related: [],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic variants',
    code: `<Skeleton variant="text" />
<Skeleton variant="circular" />
<Skeleton variant="rectangular" />`,
  },
  {
    title: 'Multi-line text',
    code: `<Skeleton variant="text" lines={3} />`,
    description: 'Last line renders at 80% width for a natural look.',
  },
  {
    title: 'Wave animation',
    code: `<Skeleton animation="wave" />
<Skeleton variant="rectangular" animation="wave" height={120} />`,
  },
  {
    title: 'Card composition',
    code: `<div className="flex gap-4 items-start">
  <Skeleton variant="circular" />
  <div className="flex-1 flex flex-col gap-2">
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
  </div>
</div>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-skeleton-height-text', value: '16px' },
      { name: '--comp-skeleton-size-circular', value: '40px' },
      { name: '--comp-skeleton-height-rect', value: '200px' },
      { name: '--comp-skeleton-radius-text', value: '4px' },
      { name: '--comp-skeleton-radius-rect', value: '8px' },
      { name: '--comp-skeleton-line-gap', value: '8px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-skeleton-bg', value: 'semantic-neutral-solid-100' },
      { name: '--comp-skeleton-highlight', value: 'semantic-neutral-solid-200' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SKELETON_TOC: TocEntry[] = [
  { id: 'component-skeleton',         label: 'Skeleton',           level: 1 },
  { id: 'skeleton-playground',        label: 'Playground'                   },
  { id: 'skeleton-variants',          label: 'Variants'                     },
  { id: 'skeleton-animations',        label: 'Animations'                   },
  { id: 'skeleton-multi-line',        label: 'Multi-line Text'              },
  { id: 'skeleton-custom-size',       label: 'Custom Size'                  },
  { id: 'skeleton-composition',       label: 'Composition'                  },
  { id: 'skeleton-usage',             label: 'Usage Guidelines'             },
  { id: 'skeleton-props',             label: 'Props'                        },
  { id: 'skeleton-code',              label: 'Code Examples'                },
  { id: 'skeleton-tokens',            label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SkeletonShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-skeleton"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="skeleton-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Variants */}
      <section id="skeleton-variants" className="mb-10 scroll-mt-6">
        <SectionTitle>Variants</SectionTitle>
        <div className="flex flex-col gap-6">
          {SKELETON_VARIANTS.map(v => (
            <div key={v}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">{v}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50 max-w-sm">
                <Skeleton
                  variant={v}
                  {...(v === 'rectangular' ? { height: 120 } : {})}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Animations */}
      <section id="skeleton-animations" className="mb-10 scroll-mt-6">
        <SectionTitle>Animations</SectionTitle>
        <div className="grid grid-cols-1 gap-4 max-w-sm">
          {SKELETON_ANIMATIONS.map(anim => (
            <div key={anim}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">{anim}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <Skeleton variant="rectangular" animation={anim} height={80} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Multi-line Text */}
      <section id="skeleton-multi-line" className="mb-10 scroll-mt-6">
        <SectionTitle>Multi-line Text</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          {[1, 2, 3, 4].map(n => (
            <div key={n}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-2 block">lines={n}</span>
              <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
                <Skeleton variant="text" lines={n} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Custom Size */}
      <section id="skeleton-custom-size" className="mb-10 scroll-mt-6">
        <SectionTitle>Custom Size</SectionTitle>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col items-center gap-1">
            <Skeleton variant="circular" width={24} height={24} />
            <span className="typography-12-regular text-semantic-text-on-bright-400">24px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton variant="circular" width={40} height={40} />
            <span className="typography-12-regular text-semantic-text-on-bright-400">40px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton variant="circular" width={64} height={64} />
            <span className="typography-12-regular text-semantic-text-on-bright-400">64px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton variant="rectangular" width={120} height={80} />
            <span className="typography-12-regular text-semantic-text-on-bright-400">120×80</span>
          </div>
        </div>
      </section>

      {/* 7. Composition */}
      <section id="skeleton-composition" className="mb-10 scroll-mt-6">
        <SectionTitle>Composition</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          {/* Card-like skeleton */}
          <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">Card layout</span>
            <div className="flex gap-3 items-start">
              <Skeleton variant="circular" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
            </div>
          </div>
          {/* List-like skeleton */}
          <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">List layout</span>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton variant="circular" width={32} height={32} />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" height={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Usage Guidelines */}
      <ShowcaseSection id="skeleton-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 9. Props Table */}
      <ShowcaseSection id="skeleton-props" title="Props">
        <PropsTable props={propsData} />
      </ShowcaseSection>

      {/* 10. Code Examples */}
      <ShowcaseSection id="skeleton-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 11. Design Tokens */}
      <ShowcaseSection
        id="skeleton-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Color tokens switch automatically per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
