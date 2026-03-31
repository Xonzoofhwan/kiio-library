import { useContext, useEffect, useState } from 'react'
import { Tooltip, TOOLTIP_VARIANTS, TOOLTIP_SIDES, TOOLTIP_SIZES } from '@/components/Tooltip'
import { Tab } from '@/components/Tab'
import type { TocEntry } from '@/components/showcase-layout'
import { NAV_GROUPS } from '@/components/showcase-layout'
import { NavigateContext } from '@/showcase/NavigateContext'
import { ShowcaseTocContext } from '@/showcase/ShowcaseTocContext'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  PropsTable,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  TokenChainTable,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
  type TokenChainData,
} from './showcase-blocks'
import { extractHeader, extractSubComponentProps } from './spec-utils'
import tooltipSpec from '../../specs/tooltip.json'

/* ─── Lightweight trigger button ─────────────────────────────────────────── */

function DemoButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="inline-flex items-center justify-center px-4 py-2 rounded-2 typography-14-medium border border-semantic-divider-solid-200 text-semantic-text-on-bright-900 bg-semantic-background-0 hover:bg-semantic-state-on-bright-70 transition-colors duration-fast ease-enter cursor-pointer"
      {...props}
    >
      {children}
    </button>
  )
}

/* ─── Spec data ──────────────────────────────────────────────────────────── */

const header = extractHeader(tooltipSpec)
const subComponentProps = extractSubComponentProps(tooltipSpec)
const groupName = NAV_GROUPS.find(g => g.items.some(i => i.id === 'tooltip'))?.label ?? ''

/* ─── Tab definitions ────────────────────────────────────────────────────── */

const TABS = ['spec', 'visual', 'recipes'] as const
type ShowcaseTab = (typeof TABS)[number]

const TAB_LABELS: Record<ShowcaseTab, string> = {
  spec: 'Spec',
  visual: 'Visual',
  recipes: 'Recipes',
}

/* ─── TOC per tab ────────────────────────────────────────────────────────── */

const SPEC_TOC: TocEntry[] = [
  { id: 'tooltip-playground',    label: 'Playground'    },
  { id: 'tooltip-all-variants',  label: 'All Variants'  },
  { id: 'tooltip-props',         label: 'Props'         },
  { id: 'tooltip-tokens',        label: 'Design Tokens' },
]

const VISUAL_TOC: TocEntry[] = [
  { id: 'tooltip-anatomy',    label: 'Anatomy'        },
  { id: 'tooltip-variants',   label: 'Variants'       },
  { id: 'tooltip-sizes',      label: 'Sizes'          },
  { id: 'tooltip-sides',      label: 'Sides'          },
  { id: 'tooltip-arrow',      label: 'Arrow & Shadow' },
  { id: 'tooltip-multiline',  label: 'Multiline'      },
  { id: 'tooltip-token-chain', label: 'Token Chain'    },
]

const RECIPES_TOC: TocEntry[] = [
  { id: 'tooltip-usage', label: 'Usage Guidelines' },
  { id: 'tooltip-code',  label: 'Code Recipes'     },
  { id: 'tooltip-a11y',  label: 'Accessibility'    },
]

const TOC_MAP: Record<ShowcaseTab, TocEntry[]> = {
  spec: SPEC_TOC,
  visual: VISUAL_TOC,
  recipes: RECIPES_TOC,
}

/** Default TOC (used by App.tsx SHOWCASE_MAP before tab state kicks in) */
export const TOOLTIP_TOC: TocEntry[] = SPEC_TOC

/* ─── Playground config ──────────────────────────────────────────────────── */

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
        <DemoButton>Hover me</DemoButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        variant={props.variant as 'black' | 'white'}
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

/* ─── Usage guidelines ───────────────────────────────────────────────────── */

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

/* ─── Code examples ──────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `import { Tooltip } from '@/components/Tooltip'

<Tooltip.Provider>
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
    description: 'Black (default) and white variants for different backgrounds.',
    code: `<Tooltip.Content variant="black">Dark tooltip</Tooltip.Content>
<Tooltip.Content variant="white">Light tooltip</Tooltip.Content>`,
  },
  {
    title: 'With arrow and shadow',
    code: `<Tooltip.Content hasArrow showShadow>
  Arrow + shadow tooltip
</Tooltip.Content>`,
  },
  {
    title: 'Controlled open state',
    description: 'Use open and onOpenChange for programmatic control.',
    code: `const [open, setOpen] = useState(false)

<Tooltip open={open} onOpenChange={setOpen}>
  <Tooltip.Trigger>
    <Button>Controlled</Button>
  </Tooltip.Trigger>
  <Tooltip.Content>Controlled tooltip</Tooltip.Content>
</Tooltip>`,
  },
]

/* ─── Token data ─────────────────────────────────────────────────────────── */

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

const tokenChains: TokenChainData[] = [
  {
    title: 'Color — Black variant',
    rows: [
      { component: '--comp-tooltip-bg-black', semantic: '--semantic-neutral-solid-950', lightPrimitive: 'gray-950', lightHex: '#1a1a1e', darkPrimitive: 'gray-950', darkHex: '#1a1a1e' },
      { component: '--comp-tooltip-text-black', semantic: '--semantic-text-on-dim-900', lightPrimitive: 'white-alpha-900', lightHex: 'rgba(255,255,255,0.92)', darkPrimitive: 'white-alpha-900', darkHex: 'rgba(255,255,255,0.92)' },
    ],
  },
  {
    title: 'Color — White variant',
    rows: [
      { component: '--comp-tooltip-bg-white', semantic: '--semantic-background-0', lightPrimitive: 'gray-0', lightHex: '#fdfefe', darkPrimitive: 'gray-950', darkHex: '#1a1a1e' },
      { component: '--comp-tooltip-text-white', semantic: '--semantic-text-on-bright-900', lightPrimitive: 'black-alpha-900', lightHex: 'rgba(16,19,19,0.92)', darkPrimitive: 'white-alpha-900', darkHex: 'rgba(255,255,255,0.92)' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
   Tab Content Components
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Spec Tab ───────────────────────────────────────────────────────────── */

function SpecTab() {
  return (
    <>
      {/* Playground */}
      <ShowcaseSection id="tooltip-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* All Variants Grid */}
      <ShowcaseSection
        id="tooltip-all-variants"
        title="All Variants"
        description="모든 variant × size 조합의 매트릭스."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th />
                {TOOLTIP_SIZES.map(size => (
                  <th key={size} className="px-4 pb-3">
                    <ColHeader>{size}</ColHeader>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOOLTIP_VARIANTS.map(variant => (
                <tr key={variant}>
                  <td className="pr-6 py-4">
                    <RowHeader>{variant}</RowHeader>
                  </td>
                  {TOOLTIP_SIZES.map(size => (
                    <td key={size} className="px-4 py-4">
                      <Tooltip defaultOpen>
                        <Tooltip.Trigger>
                          <DemoButton>{variant}/{size}</DemoButton>
                        </Tooltip.Trigger>
                        <Tooltip.Content variant={variant} size={size}>
                          {variant} · {size}
                        </Tooltip.Content>
                      </Tooltip>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* Props Tables */}
      <ShowcaseSection id="tooltip-props" title="Props">
        {subComponentProps.map((sub) => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* Design Tokens */}
      <ShowcaseSection
        id="tooltip-tokens"
        title="Design Tokens"
        description="Layout tokens are theme-agnostic (:root). Color tokens are in [data-theme] scope."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}

/* ─── Visual Tab ─────────────────────────────────────────────────────────── */

function VisualTab() {
  return (
    <>
      {/* Anatomy */}
      <ShowcaseSection
        id="tooltip-anatomy"
        title="Anatomy"
        description="Compound component 구조. Provider → Root → Trigger + Content."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed bg-semantic-neutral-solid-50 rounded-3 p-5">
{`Tooltip.Provider          — 전역 delay/hover 설정
└── Tooltip (Root)        — open state, theme context
    ├── Tooltip.Trigger   — hover/focus 대상 (asChild)
    └── Tooltip.Content   — Portal 렌더링 오버레이
        ├── children      — 툴팁 텍스트
        └── Arrow         — 선택적 SVG 화살표 (hasArrow)`}
        </pre>
      </ShowcaseSection>

      {/* Variants */}
      <section id="tooltip-variants" className="mb-12 scroll-mt-6">
        <SectionTitle>Variants</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          배경색과 텍스트 색상이 다른 두 가지 variant. 배경에 따라 선택.
        </p>
        <div className="flex gap-6 items-center">
          {TOOLTIP_VARIANTS.map((variant) => (
            <Tooltip key={variant}>
              <Tooltip.Trigger>
                <DemoButton>{variant}</DemoButton>
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

      {/* Sizes */}
      <section id="tooltip-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          medium (typography-14)과 large (typography-16). 정보량에 따라 선택.
        </p>
        <div className="flex gap-6 items-center">
          {TOOLTIP_SIZES.map((size) => (
            <Tooltip key={size} defaultOpen>
              <Tooltip.Trigger>
                <DemoButton>{size}</DemoButton>
              </Tooltip.Trigger>
              <Tooltip.Content size={size}>
                {size} size tooltip
              </Tooltip.Content>
            </Tooltip>
          ))}
        </div>
      </section>

      {/* Sides */}
      <section id="tooltip-sides" className="mb-12 scroll-mt-6">
        <SectionTitle>Sides</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          트리거 기준 4방향 배치. 공간이 부족하면 자동으로 반대편으로 이동.
        </p>
        <div className="flex gap-6 items-center justify-center py-12">
          {TOOLTIP_SIDES.map((side) => (
            <Tooltip key={side}>
              <Tooltip.Trigger>
                <DemoButton>{side}</DemoButton>
              </Tooltip.Trigger>
              <Tooltip.Content side={side}>
                {side} 방향
              </Tooltip.Content>
            </Tooltip>
          ))}
        </div>
      </section>

      {/* Arrow & Shadow */}
      <section id="tooltip-arrow" className="mb-12 scroll-mt-6">
        <SectionTitle>Arrow &amp; Shadow</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          화살표(hasArrow)와 그림자(showShadow)는 독립적으로 제어.
        </p>
        <div className="flex gap-6 items-center flex-wrap">
          <Tooltip>
            <Tooltip.Trigger>
              <DemoButton>Arrow (기본)</DemoButton>
            </Tooltip.Trigger>
            <Tooltip.Content hasArrow>화살표 포함</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger>
              <DemoButton>No Arrow</DemoButton>
            </Tooltip.Trigger>
            <Tooltip.Content hasArrow={false}>화살표 없음</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger>
              <DemoButton>Shadow</DemoButton>
            </Tooltip.Trigger>
            <Tooltip.Content showShadow>그림자 효과</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger>
              <DemoButton>Shadow + No Arrow</DemoButton>
            </Tooltip.Trigger>
            <Tooltip.Content showShadow hasArrow={false}>그림자만 적용</Tooltip.Content>
          </Tooltip>
        </div>
      </section>

      {/* Multiline */}
      <section id="tooltip-multiline" className="mb-12 scroll-mt-6">
        <SectionTitle>Multiline</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          max-width(320px) 초과 시 자동 줄바꿈. 토큰으로 제어.
        </p>
        <div className="flex gap-6 items-center">
          <Tooltip>
            <Tooltip.Trigger><DemoButton>Short</DemoButton></Tooltip.Trigger>
            <Tooltip.Content>짧은 텍스트</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger><DemoButton>Long text</DemoButton></Tooltip.Trigger>
            <Tooltip.Content>
              여러 줄로 표시되는 긴 텍스트입니다. Tooltip의 max-width를 초과하면
              자동으로 줄바꿈됩니다.
            </Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger><DemoButton>White long</DemoButton></Tooltip.Trigger>
            <Tooltip.Content variant="white" showShadow>
              White variant에서도 긴 텍스트는 동일하게 줄바꿈됩니다.
              max-width 토큰으로 제어됩니다.
            </Tooltip.Content>
          </Tooltip>
        </div>
      </section>

      {/* Token Chain */}
      <ShowcaseSection
        id="tooltip-token-chain"
        title="Token Chain"
        description="컴포넌트 → 시맨틱 → 프리미티브 3레이어 색상 토큰 체인. Light/Dark 비교."
      >
        <TokenChainTable chains={tokenChains} />
      </ShowcaseSection>
    </>
  )
}

/* ─── Recipes Tab ────────────────────────────────────────────────────────── */

function RecipesTab() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* Usage Guidelines */}
      <ShowcaseSection id="tooltip-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* Code Recipes */}
      <ShowcaseSection id="tooltip-code" title="Code Recipes">
        {codeExamples.map((ex) => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* Accessibility */}
      <ShowcaseSection id="tooltip-a11y" title="Accessibility">
        <div className="space-y-4">
          <div>
            <h3 className="typography-14-semibold text-semantic-text-on-bright-700 mb-2">Keyboard</h3>
            <div className="border border-semantic-divider-solid-100 rounded-2 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-semantic-divider-solid-200 bg-semantic-neutral-solid-50">
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2">Key</th>
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Tab', 'Trigger에 포커스 → 툴팁 표시'],
                    ['Escape', '열린 툴팁 닫기'],
                    ['Tab (away)', 'Trigger에서 포커스 이동 → 툴팁 닫기'],
                  ].map(([key, action]) => (
                    <tr key={key} className="border-b border-semantic-divider-solid-50">
                      <td className="typography-13-medium text-semantic-text-on-bright-700 font-mono px-4 py-2">{key}</td>
                      <td className="typography-13-regular text-semantic-text-on-bright-600 px-4 py-2">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="typography-14-semibold text-semantic-text-on-bright-700 mb-2">ARIA</h3>
            <ul className="space-y-1.5 ml-4">
              <li className="typography-13-regular text-semantic-text-on-bright-600 list-disc">
                Trigger에 <code className="font-mono text-semantic-emphasized-purple-500">aria-describedby</code> 자동 설정 → 스크린 리더가 툴팁 내용 읽음
              </li>
              <li className="typography-13-regular text-semantic-text-on-bright-600 list-disc">
                Content에 <code className="font-mono text-semantic-emphasized-purple-500">role=&quot;tooltip&quot;</code> 자동 적용
              </li>
              <li className="typography-13-regular text-semantic-text-on-bright-600 list-disc">
                Hover와 Focus 모두에서 표시되어 키보드 사용자도 접근 가능
              </li>
            </ul>
          </div>
        </div>
      </ShowcaseSection>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Showcase
   ═══════════════════════════════════════════════════════════════════════════ */

export function TooltipShowcase() {
  const setToc = useContext(ShowcaseTocContext)
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('spec')

  useEffect(() => {
    setToc(TOC_MAP[activeTab])
  }, [activeTab, setToc])

  const handleTabChange = (value: string) => {
    setActiveTab(value as ShowcaseTab)
  }

  return (
    <Tooltip.Provider>
      {/* Header — always visible */}
      <ShowcaseHeader
        id="component-tooltip"
        name={header.name}
        description={header.description}
        classification={header.classification}
        groupName={groupName}
      />

      {/* Tab bar — sticky */}
      <div className="sticky top-0 z-10 bg-semantic-background-0 pt-2 mb-8">
        <Tab variant="underlined" value={activeTab} onValueChange={handleTabChange}>
          <Tab.List>
            {TABS.map(tab => (
              <Tab.Item key={tab} value={tab}>{TAB_LABELS[tab]}</Tab.Item>
            ))}
          </Tab.List>
        </Tab>
      </div>

      {/* Tab content */}
      {activeTab === 'spec' && <SpecTab />}
      {activeTab === 'visual' && <VisualTab />}
      {activeTab === 'recipes' && <RecipesTab />}
    </Tooltip.Provider>
  )
}
