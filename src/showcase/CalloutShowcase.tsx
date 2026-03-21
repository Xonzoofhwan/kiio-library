import { useState, useContext } from 'react'
import {
  Callout,
  CALLOUT_VARIANTS,
  CALLOUT_SIDES,
  CALLOUT_DISMISS_MODES,
  CALLOUT_SIZES,
} from '@/components/Callout'
import type { CalloutVariant, CalloutSide, CalloutDismissMode, CalloutSize } from '@/components/Callout'
/* Lightweight trigger button — replaces deleted Button component */
function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) {
  return (
    <button
      className="inline-flex items-center justify-center px-4 py-2 rounded-2 typography-14-medium border border-semantic-divider-solid-200 text-semantic-text-on-bright-900 bg-semantic-background-0 hover:bg-semantic-state-on-bright-70 transition-colors duration-fast ease-enter cursor-pointer"
      {...props}
    >
      {children}
    </button>
  )
}
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
import calloutSpec from '../../specs/callout.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(calloutSpec)
const subComponentProps = extractSubComponentProps(calloutSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant:     { kind: 'select', options: CALLOUT_VARIANTS },
    side:        { kind: 'select', options: CALLOUT_SIDES },
    size:        { kind: 'select', options: CALLOUT_SIZES },
    dismissMode: { kind: 'select', options: CALLOUT_DISMISS_MODES },
  },
  defaults: {
    variant: 'black',
    side: 'top',
    size: 'medium',
    dismissMode: 'manual',
  },
  render: (props) => (
    <Callout
      variant={props.variant as CalloutVariant}
      size={props.size as CalloutSize}
      dismiss={props.dismissMode as CalloutDismissMode}
      defaultOpen
    >
      <Callout.Anchor>
        <Button variant="outlined" size="medium">
          Anchor
        </Button>
      </Callout.Anchor>
      <Callout.Content side={props.side as CalloutSide} sideOffset={8}>
        <Callout.Arrow />
        <Callout.Text>
          Callout content with contextual guidance.
        </Callout.Text>
        <Callout.Close />
      </Callout.Content>
    </Callout>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Contextual guidance anchored to a specific UI element',
    'Onboarding tips or feature discovery popovers',
    'Non-modal notifications with dismiss/action capability',
  ],
  dontUse: [
    { text: 'Brief hover-only information', alternative: 'tooltip', alternativeLabel: 'Tooltip' },
    { text: 'Blocking user flow for confirmation', alternative: 'dialog', alternativeLabel: 'Dialog' },
    { text: 'Global notifications or toasts', alternative: 'toast', alternativeLabel: 'Toast' },
  ],
  related: [
    { id: 'tooltip', label: 'Tooltip' },
    { id: 'dialog', label: 'Dialog' },
    { id: 'toast', label: 'Toast' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Callout>
  <Callout.Anchor>
    <Button variant="outlined">Trigger</Button>
  </Callout.Anchor>
  <Callout.Content>
    <Callout.Arrow />
    <Callout.Text>Contextual guidance here.</Callout.Text>
    <Callout.Close />
  </Callout.Content>
</Callout>`,
  },
  {
    title: 'Auto dismiss',
    code: `<Callout dismissMode="auto" autoCloseDelay={3000}>
  <Callout.Anchor>
    <Button>Trigger</Button>
  </Callout.Anchor>
  <Callout.Content>
    <Callout.Arrow />
    <Callout.Text>Closes automatically after 3 seconds.</Callout.Text>
    <Callout.Close />
  </Callout.Content>
</Callout>`,
    description: 'Auto dismiss mode closes the callout after the specified delay. Manual close is still available.',
  },
  {
    title: 'With action',
    code: `<Callout>
  <Callout.Anchor>
    <Button>Trigger</Button>
  </Callout.Anchor>
  <Callout.Content>
    <Callout.Arrow />
    <Callout.Text>New feature available!</Callout.Text>
    <Callout.Action onClick={() => console.log('clicked')} closeOnClick>
      Learn more
    </Callout.Action>
    <Callout.Close />
  </Callout.Content>
</Callout>`,
    description: 'CalloutAction renders a trailing arrow button. closeOnClick automatically closes the callout after the click handler runs.',
  },
  {
    title: 'Controlled',
    code: `const [open, setOpen] = useState(false)

<Callout open={open} onOpenChange={setOpen}>
  <Callout.Anchor>
    <Button>Trigger</Button>
  </Callout.Anchor>
  <Callout.Content>
    <Callout.Arrow />
    <Callout.Text>Controlled callout.</Callout.Text>
    <Callout.Close />
  </Callout.Content>
</Callout>`,
    description: 'Pass open and onOpenChange for full control over open state.',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Layout',
    scope: ':root',
    tokens: [
      { name: '--comp-callout-max-w', value: '320px' },
      { name: '--comp-callout-px', value: '14px' },
      { name: '--comp-callout-py-md', value: '12px' },
      { name: '--comp-callout-py-lg', value: '14px' },
      { name: '--comp-callout-radius', value: '8px' },
      { name: '--comp-callout-arrow-w', value: '16px' },
      { name: '--comp-callout-arrow-h', value: '8px' },
      { name: '--comp-callout-close-size', value: '32px' },
      { name: '--comp-callout-close-icon', value: '20px' },
      { name: '--comp-callout-action-icon', value: '20px' },
    ],
  },
]

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const CALLOUT_TOC: TocEntry[] = [
  { id: 'component-callout',   label: 'Callout',           level: 1 },
  { id: 'callout-playground',  label: 'Playground'                   },
  { id: 'callout-anatomy',     label: 'Anatomy'                      },
  { id: 'callout-variants',    label: 'Variants'                     },
  { id: 'callout-sizes',       label: 'Sizes'                        },
  { id: 'callout-sides',       label: 'Sides'                        },
  { id: 'callout-dismiss',     label: 'Dismiss Modes'                },
  { id: 'callout-action',      label: 'With Action'                  },
  { id: 'callout-controlled',  label: 'Controlled'                   },
  { id: 'callout-usage',       label: 'Usage Guidelines'             },
  { id: 'callout-props',       label: 'Props'                        },
  { id: 'callout-code',        label: 'Code Examples'                },
  { id: 'callout-tokens',      label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function CalloutShowcase() {
  const navigate = useContext(NavigateContext)
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-callout"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="callout-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="callout-anatomy"
        title="Anatomy"
        description="Callout's compound component structure with anchor, content, arrow, text, close, and action sub-components."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Callout (root)
├── CalloutAnchor     — Radix Popover.Trigger, asChild
└── CalloutContent    — Portal + theme inheritance
    ├── CalloutArrow  — Radix Popover.Arrow, variant fill
    ├── row.upper
    │   ├── CalloutText   — typography + padding
    │   └── CalloutClose  — absolute close button, variant color
    └── CalloutAction     — trailing arrow button, closeOnClick`}
        </pre>
      </ShowcaseSection>

      {/* 4a. Variants */}
      <section id="callout-variants" className="mb-12 scroll-mt-6">
        <SectionTitle>Variants</SectionTitle>
        <div className="flex gap-6 items-center">
          {CALLOUT_VARIANTS.map((variant) => (
            <Callout key={variant} variant={variant} defaultOpen>
              <Callout.Anchor>
                <Button variant="outlined" size="medium">
                  {variant}
                </Button>
              </Callout.Anchor>
              <Callout.Content side="bottom" sideOffset={8}>
                <Callout.Arrow />
                <Callout.Text>
                  {variant} variant 스타일의 Callout입니다.
                </Callout.Text>
                <Callout.Close />
              </Callout.Content>
            </Callout>
          ))}
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          버튼을 클릭하여 Callout을 토글할 수 있습니다.
        </p>
      </section>

      {/* 4b. Sizes */}
      <section id="callout-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex gap-6 items-center">
          {CALLOUT_SIZES.map((size) => (
            <Callout key={size} size={size} defaultOpen>
              <Callout.Anchor>
                <Button variant="outlined" size="medium">
                  {size}
                </Button>
              </Callout.Anchor>
              <Callout.Content side="bottom" sideOffset={8}>
                <Callout.Arrow />
                <Callout.Text>
                  {size} 크기의 Callout입니다.
                </Callout.Text>
                <Callout.Close />
              </Callout.Content>
            </Callout>
          ))}
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          large: typography-16 / medium: typography-14 + 축소된 내부 패딩
        </p>
      </section>

      {/* 4c. Sides */}
      <section id="callout-sides" className="mb-12 scroll-mt-6">
        <SectionTitle>Sides</SectionTitle>
        <div className="flex gap-6 items-center justify-center py-12">
          {CALLOUT_SIDES.map((side) => (
            <Callout key={side}>
              <Callout.Anchor>
                <Button variant="outlined" size="small">
                  {side}
                </Button>
              </Callout.Anchor>
              <Callout.Content side={side} sideOffset={8}>
                <Callout.Arrow />
                <Callout.Text>{side} 방향</Callout.Text>
                <Callout.Close />
              </Callout.Content>
            </Callout>
          ))}
        </div>
      </section>

      {/* 4d. Dismiss Modes */}
      <section id="callout-dismiss" className="mb-12 scroll-mt-6">
        <SectionTitle>Dismiss Modes</SectionTitle>
        <div className="flex gap-6 items-center">
          <Callout dismiss="manual">
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Manual
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                클릭, ESC, 또는 Close 버튼으로 닫힙니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Callout dismiss="auto" autoDismissDuration={3000}>
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Auto (3초)
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                3초 후 자동으로 닫힙니다. 수동으로도 닫을 수 있습니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Callout dismiss="none">
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                None
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                Close 버튼으로만 닫을 수 있습니다. 바깥 클릭과 ESC가 차단됩니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>
        </div>
      </section>

      {/* 4e. With Action */}
      <section id="callout-action" className="mb-12 scroll-mt-6">
        <SectionTitle>With Action</SectionTitle>
        <div className="flex gap-6 items-center">
          <Callout>
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Action 포함
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                새로운 기능이 추가되었습니다.
              </Callout.Text>
              <Callout.Action onClick={() => alert('Action clicked!')}>
                자세히 보기
              </Callout.Action>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Callout variant="brand">
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Action + Close
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                클릭 시 Callout이 자동으로 닫힙니다.
              </Callout.Text>
              <Callout.Action closeOnClick>
                확인
              </Callout.Action>
              <Callout.Close />
            </Callout.Content>
          </Callout>
        </div>
      </section>

      {/* 4f. Controlled */}
      <section id="callout-controlled" className="mb-12 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex gap-4 items-center">
          <Callout open={controlledOpen} onOpenChange={setControlledOpen}>
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Controlled Callout
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                외부 상태로 제어되는 Callout입니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Button
            variant="ghost"
            size="small"
            onClick={() => setControlledOpen(!controlledOpen)}
          >
            {controlledOpen ? 'Close' : 'Open'} externally
          </Button>
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          open: {String(controlledOpen)}
        </p>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="callout-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-component props) */}
      <ShowcaseSection id="callout-props" title="Props">
        {subComponentProps.map((sub) => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="callout-code" title="Code Examples">
        {codeExamples.map((ex) => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="callout-tokens"
        title="Design Tokens"
        description="Layout tokens defined at :root scope. Color tokens are variant-specific and switch by theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
