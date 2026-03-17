import { useContext } from 'react'
import { Tooltip, TOOLTIP_VARIANTS, TOOLTIP_SIDES, TOOLTIP_SIZES } from '@/components/Tooltip'
import { Button } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from '@/showcase/shared'
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
import tooltipSpec from '../../specs/tooltip.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(tooltipSpec)
const subComponentProps = extractSubComponentProps(tooltipSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant:    { kind: 'select', options: TOOLTIP_VARIANTS },
    side:       { kind: 'select', options: TOOLTIP_SIDES },
    size:       { kind: 'select', options: TOOLTIP_SIZES },
    hasArrow:   { kind: 'boolean' },
    showShadow: { kind: 'boolean' },
  },
  defaults: {
    variant: 'black',
    side: 'top',
    size: 'medium',
    hasArrow: true,
    showShadow: false,
  },
  render: (props) => (
    <Tooltip defaultOpen>
      <Tooltip.Trigger>
        <Button variant="outlined" size="medium">
          Hover me
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        variant={props.variant as 'black' | 'white' | 'brand'}
        side={props.side as 'top' | 'bottom' | 'left' | 'right'}
        size={props.size as 'large' | 'medium'}
        hasArrow={props.hasArrow as boolean}
        showShadow={props.showShadow as boolean}
      >
        Tooltip content
      </Tooltip.Content>
    </Tooltip>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Additional context on hover (icon meaning, truncated text, shortcut hint)',
    'Brief informational text that doesn\'t require interaction',
    'Non-critical supplementary information',
  ],
  dontUse: [
    { text: 'Interactive content that requires clicking', alternative: 'callout', alternativeLabel: 'Callout' },
    { text: 'Long-form content or rich formatting', alternative: 'dialog', alternativeLabel: 'Dialog' },
    { text: 'Permanent informational message' },
  ],
  related: [
    { id: 'callout', label: 'Callout' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<Tooltip.Provider>
  <Tooltip>
    <Tooltip.Trigger>
      <Button>Hover me</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      Tooltip content
    </Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>`,
  },
  {
    title: 'Variants',
    code: `<Tooltip>
  <Tooltip.Trigger>
    <Button>Black</Button>
  </Tooltip.Trigger>
  <Tooltip.Content variant="black">Black tooltip</Tooltip.Content>
</Tooltip>

<Tooltip>
  <Tooltip.Trigger>
    <Button>White</Button>
  </Tooltip.Trigger>
  <Tooltip.Content variant="white">White tooltip</Tooltip.Content>
</Tooltip>

<Tooltip>
  <Tooltip.Trigger>
    <Button>Brand</Button>
  </Tooltip.Trigger>
  <Tooltip.Content variant="brand">Brand tooltip</Tooltip.Content>
</Tooltip>`,
  },
  {
    title: 'With arrow and shadow',
    code: `<Tooltip>
  <Tooltip.Trigger>
    <Button>Hover me</Button>
  </Tooltip.Trigger>
  <Tooltip.Content hasArrow showShadow>
    Arrow + shadow tooltip
  </Tooltip.Content>
</Tooltip>`,
  },
  {
    title: 'Controlled',
    code: `const [open, setOpen] = useState(false)

<Tooltip open={open} onOpenChange={setOpen}>
  <Tooltip.Trigger>
    <Button>Controlled</Button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    Controlled tooltip
  </Tooltip.Content>
</Tooltip>`,
    description: 'Use open and onOpenChange props on the Tooltip root for controlled behavior.',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Layout',
    scope: ':root',
    tokens: [
      { name: '--comp-tooltip-max-w', value: '320px' },
      { name: '--comp-tooltip-px', value: '14px' },
      { name: '--comp-tooltip-py', value: '12px' },
      { name: '--comp-tooltip-radius', value: '8px' },
      { name: '--comp-tooltip-arrow-w', value: '16px' },
      { name: '--comp-tooltip-arrow-h', value: '8px' },
    ],
  },
]

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const TOOLTIP_TOC: TocEntry[] = [
  { id: 'component-tooltip',    label: 'Tooltip',           level: 1 },
  { id: 'tooltip-playground',   label: 'Playground'                   },
  { id: 'tooltip-anatomy',      label: 'Anatomy'                      },
  { id: 'tooltip-variants',     label: 'Variants'                     },
  { id: 'tooltip-sizes',        label: 'Sizes'                        },
  { id: 'tooltip-sides',        label: 'Sides'                        },
  { id: 'tooltip-arrow',        label: 'Arrow & Shadow'               },
  { id: 'tooltip-multiline',    label: 'Multiline'                    },
  { id: 'tooltip-usage',        label: 'Usage Guidelines'             },
  { id: 'tooltip-props',        label: 'Props'                        },
  { id: 'tooltip-code',         label: 'Code Examples'                },
  { id: 'tooltip-tokens',       label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TooltipShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <Tooltip.Provider>
      <>
        {/* 1. Header */}
        <ShowcaseHeader
          id="component-tooltip"
          name={header.name}
          description={header.description}
          classification={header.classification}
        />

        {/* 2. Playground */}
        <ShowcaseSection id="tooltip-playground" title="Playground">
          <Playground config={playgroundConfig} />
        </ShowcaseSection>

        {/* 3. Anatomy */}
        <ShowcaseSection
          id="tooltip-anatomy"
          title="Anatomy"
          description="Tooltip's compound component structure with provider, root, trigger, and content."
        >
          <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Tooltip.Provider          — global delay/hover settings
└── Tooltip (Root)        — open state, theme context
    ├── Tooltip.Trigger   — hover/focus target (asChild)
    └── Tooltip.Content   — Portal-rendered overlay
        ├── children      — tooltip text
        └── Arrow         — optional SVG arrow (hasArrow)`}
          </pre>
        </ShowcaseSection>

        {/* 4. Visual sections */}

        {/* 4a. Variants */}
        <section id="tooltip-variants" className="mb-12 scroll-mt-6">
          <SectionTitle>Variants</SectionTitle>
          <div className="flex gap-6 items-center">
            {TOOLTIP_VARIANTS.map((variant) => (
              <Tooltip key={variant}>
                <Tooltip.Trigger>
                  <Button variant="outlined" size="medium">
                    {variant}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content variant={variant}>
                  {variant} variant tooltip
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
          <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
            호버하여 각 variant의 스타일을 확인하세요.
          </p>
        </section>

        {/* 4b. Sizes */}
        <section id="tooltip-sizes" className="mb-12 scroll-mt-6">
          <SectionTitle>Sizes</SectionTitle>
          <div className="flex gap-6 items-center">
            {TOOLTIP_SIZES.map((size) => (
              <Tooltip key={size} defaultOpen>
                <Tooltip.Trigger>
                  <Button variant="outlined" size="medium">
                    {size}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content size={size}>
                  {size} size tooltip
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
          <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
            large: typography-16, medium: typography-14
          </p>
        </section>

        {/* 4c. Sides */}
        <section id="tooltip-sides" className="mb-12 scroll-mt-6">
          <SectionTitle>Sides</SectionTitle>
          <div className="flex gap-6 items-center justify-center py-12">
            {TOOLTIP_SIDES.map((side) => (
              <Tooltip key={side}>
                <Tooltip.Trigger>
                  <Button variant="outlined" size="small">
                    {side}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content side={side}>
                  {side} 방향 tooltip
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
        </section>

        {/* 4d. Arrow & Shadow */}
        <section id="tooltip-arrow" className="mb-12 scroll-mt-6">
          <SectionTitle>Arrow &amp; Shadow</SectionTitle>
          <div className="flex gap-6 items-center">
            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Arrow (기본)
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content hasArrow>
                화살표 포함
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  No Arrow
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content hasArrow={false}>
                화살표 없음
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Shadow
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content showShadow>
                그림자 효과 적용
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Shadow + No Arrow
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content showShadow hasArrow={false}>
                그림자만 적용
              </Tooltip.Content>
            </Tooltip>
          </div>
        </section>

        {/* 4e. Multiline */}
        <section id="tooltip-multiline" className="mb-12 scroll-mt-6">
          <SectionTitle>Multiline</SectionTitle>
          <div className="flex gap-6 items-center">
            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Short
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                짧은 텍스트
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Long text
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                여러 줄로 표시되는 긴 텍스트입니다. Tooltip의 max-width를 초과하면
                자동으로 줄바꿈됩니다.
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  White long
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content variant="white" showShadow>
                White variant에서도 긴 텍스트는 동일하게 줄바꿈됩니다.
                max-width 토큰으로 제어됩니다.
              </Tooltip.Content>
            </Tooltip>
          </div>
        </section>

        {/* 5. Usage Guidelines */}
        <ShowcaseSection id="tooltip-usage" title="Usage Guidelines">
          <UsageGuidelines data={usageData} onNavigate={navigate} />
        </ShowcaseSection>

        {/* 6. Props Tables (sub-component) */}
        <ShowcaseSection id="tooltip-props" title="Props">
          {subComponentProps.map((sub) => (
            <PropsTable key={sub.name} props={sub.props} title={sub.name} />
          ))}
        </ShowcaseSection>

        {/* 7. Code Examples */}
        <ShowcaseSection id="tooltip-code" title="Code Examples">
          {codeExamples.map((ex) => (
            <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
          ))}
        </ShowcaseSection>

        {/* 8. Design Tokens */}
        <ShowcaseSection
          id="tooltip-tokens"
          title="Design Tokens"
          description="Layout tokens are theme-agnostic. Color tokens are defined under [data-theme] scope and switch by theme."
        >
          <TokensReference groups={tokenGroups} />
        </ShowcaseSection>
      </>
    </Tooltip.Provider>
  )
}
