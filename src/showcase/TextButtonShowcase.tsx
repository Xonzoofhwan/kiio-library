import { useContext } from 'react'
import { Fragment } from 'react'
import type { TocEntry } from '@/components/showcase-layout'
import type { TextButtonIntent, TextButtonSize } from '@/components/TextButton'
import { TextButton, TEXTBUTTON_INTENTS, TEXTBUTTON_SIZES, TEXTBUTTON_SURFACES } from '@/components/TextButton'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, RowHeader, ColorSwatch, SpecLabel, SpecValue, PlusIcon, HeartIcon } from '@/showcase/shared'
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
import { extractProps, extractHeader } from './spec-utils'
import textbuttonSpec from '../../specs/textbutton.json'

/* ─── Internal icons ──────────────────────────────────────────────────────── */

const ChevronRightIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.5 4.5L13.5 10L7.5 15.5" />
  </svg>
)

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(textbuttonSpec)
const propRows = extractProps(textbuttonSpec)

const INTENTS: TextButtonIntent[] = [...TEXTBUTTON_INTENTS]
const SIZES: TextButtonSize[] = [...TEXTBUTTON_SIZES]

type ColorSpec = { default: string; hover: string; active: string; disabled: string }

const colorSpec: Record<TextButtonIntent, { bright: ColorSpec; dim: ColorSpec }> = {
  systemic: {
    bright: { default: 'text-on-bright-800', hover: 'text-on-bright-600', active: 'text-on-bright-400', disabled: 'text-on-bright-300' },
    dim:    { default: 'text-on-dim-950',    hover: 'text-on-dim-800',    active: 'text-on-dim-600',    disabled: 'text-on-dim-300' },
  },
  brand: {
    bright: { default: 'primary-500', hover: 'primary-600', active: 'primary-700', disabled: 'text-on-bright-300' },
    dim:    { default: 'primary-500', hover: 'primary-400', active: 'primary-300', disabled: 'text-on-dim-300' },
  },
}

type SizeSpec = { height: string; typography: string; icon: string; gap: string }

const sizeSpec: Record<TextButtonSize, SizeSpec> = {
  xLarge: { height: '36px', typography: '20/28 medium', icon: '24px', gap: '4px' },
  large:  { height: '32px', typography: '18/26 medium', icon: '24px', gap: '4px' },
  medium: { height: '28px', typography: '16/24 medium', icon: '20px', gap: '4px' },
  small:  { height: '24px', typography: '14/20 medium', icon: '20px', gap: '4px' },
}

const SIZE_PROPS: { key: keyof SizeSpec; label: string }[] = [
  { key: 'height',     label: 'Height' },
  { key: 'typography', label: 'Typography' },
  { key: 'icon',       label: 'Icon' },
  { key: 'gap',        label: 'Gap' },
]

function contentTokenVar(intent: TextButtonIntent, isDim: boolean, state?: string): string {
  const prefix = isDim ? '--comp-textbutton-dim-content' : '--comp-textbutton-content'
  return state ? `${prefix}-${intent}-${state}` : `${prefix}-${intent}`
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    intent:       { kind: 'select', options: TEXTBUTTON_INTENTS },
    size:         { kind: 'select', options: TEXTBUTTON_SIZES },
    surface:      { kind: 'select', options: TEXTBUTTON_SURFACES },
    disabled:     { kind: 'boolean' },
    loading:      { kind: 'boolean' },
    iconLeading:  { kind: 'slot', options: { none: null, plus: <PlusIcon />, heart: <HeartIcon /> } },
    iconTrailing: { kind: 'slot', options: { none: null, chevron: <ChevronRightIcon /> } },
  },
  defaults: {
    intent: 'systemic',
    size: 'medium',
    surface: 'bright',
    disabled: false,
    loading: false,
    iconLeading: 'none',
    iconTrailing: 'none',
  },
  render: (props) => (
    <TextButton
      intent={props.intent as TextButtonIntent}
      size={props.size as TextButtonSize}
      surface={props.surface as 'bright' | 'dim'}
      disabled={props.disabled as boolean}
      loading={props.loading as boolean}
      iconLeading={props.iconLeading as React.ReactNode}
      iconTrailing={props.iconTrailing as React.ReactNode}
    >
      TextButton
    </TextButton>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Lightweight action within content areas (read more, view details)',
    'Inline action alongside other content (callout actions, form labels)',
    'Navigation-like action that doesn\'t require button prominence',
  ],
  dontUse: [
    { text: 'Primary action in a form or dialog', alternative: 'button', alternativeLabel: 'Button' },
    { text: 'Icon-only action without label', alternative: 'icon-button', alternativeLabel: 'IconButton' },
    { text: 'Toggling a binary state', alternative: 'switch', alternativeLabel: 'Switch' },
  ],
  related: [
    { id: 'button', label: 'Button' },
    { id: 'icon-button', label: 'IconButton' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<TextButton intent="brand">View details</TextButton>`,
  },
  {
    title: 'With icons',
    code: `<TextButton iconLeading={<PlusIcon />}>Add item</TextButton>

<TextButton iconTrailing={<ChevronRightIcon />} intent="brand">
  Learn more
</TextButton>`,
  },
  {
    title: 'On dim surface',
    code: `<TextButton surface="dim" intent="brand" iconTrailing={<ChevronRightIcon />}>
  Learn more
</TextButton>`,
  },
  {
    title: 'Loading state',
    code: `<TextButton loading>Submitting...</TextButton>`,
    description: 'Content becomes invisible while a centered spinner is shown. Interaction is disabled via pointer-events-none.',
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens (on-bright, systemic)',
    rows: [
      { component: '--comp-textbutton-content-systemic',          semantic: 'text-on-bright-800', lightPrimitive: 'gray-800', lightHex: '#33353a', darkPrimitive: 'gray-200', darkHex: '#b1b3b9' },
      { component: '--comp-textbutton-content-systemic-hover',    semantic: 'text-on-bright-600', lightPrimitive: 'gray-600', lightHex: '#555861', darkPrimitive: 'gray-400', darkHex: '#898c95' },
      { component: '--comp-textbutton-content-systemic-active',   semantic: 'text-on-bright-400', lightPrimitive: 'gray-400', lightHex: '#898c95', darkPrimitive: 'gray-600', darkHex: '#555861' },
      { component: '--comp-textbutton-content-systemic-disabled', semantic: 'text-on-bright-300', lightPrimitive: 'gray-300', lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
    ],
  },
  {
    title: 'Color Tokens (on-bright, brand)',
    rows: [
      { component: '--comp-textbutton-content-brand',          semantic: 'primary-500', lightPrimitive: 'purple-500', lightHex: '#8b6cef', darkPrimitive: 'purple-500', darkHex: '#8b6cef' },
      { component: '--comp-textbutton-content-brand-hover',    semantic: 'primary-600', lightPrimitive: 'purple-600', lightHex: '#7253d5', darkPrimitive: 'purple-400', darkHex: '#a38ef3' },
      { component: '--comp-textbutton-content-brand-active',   semantic: 'primary-700', lightPrimitive: 'purple-700', lightHex: '#5c3fba', darkPrimitive: 'purple-300', darkHex: '#c5afe9' },
      { component: '--comp-textbutton-content-brand-disabled', semantic: 'text-on-bright-300', lightPrimitive: 'gray-300', lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
    ],
  },
  {
    title: 'Focus',
    rows: [
      { component: '--comp-textbutton-focus-border', semantic: 'primary-300', lightPrimitive: 'purple-300', lightHex: '#c5afe9', darkPrimitive: 'purple-300', darkHex: '#c5afe9' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-textbutton-height-xl', value: '36px' },
      { name: '--comp-textbutton-height-lg', value: '32px' },
      { name: '--comp-textbutton-height-md', value: '28px' },
      { name: '--comp-textbutton-height-sm', value: '24px' },
      { name: '--comp-textbutton-icon-xl',   value: '24px' },
      { name: '--comp-textbutton-icon-lg',   value: '24px' },
      { name: '--comp-textbutton-icon-md',   value: '20px' },
      { name: '--comp-textbutton-icon-sm',   value: '20px' },
      { name: '--comp-textbutton-gap',       value: '4px' },
    ],
  },
]

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const TEXTBUTTON_TOC: TocEntry[] = [
  { id: 'component-textbutton',    label: 'TextButton',       level: 1 },
  { id: 'textbutton-playground',   label: 'Playground'                 },
  { id: 'textbutton-anatomy',      label: 'Anatomy'                    },
  { id: 'textbutton-intent-size',  label: 'Intent \u00d7 Size'        },
  { id: 'textbutton-icons',        label: 'With Icons'                 },
  { id: 'textbutton-on-dim',       label: 'On Dim'                     },
  { id: 'textbutton-states',       label: 'States'                     },
  { id: 'textbutton-color-spec',   label: 'Color Spec'                 },
  { id: 'textbutton-size-spec',    label: 'Size Spec'                  },
  { id: 'textbutton-usage',        label: 'Usage Guidelines'           },
  { id: 'textbutton-props',        label: 'Props'                      },
  { id: 'textbutton-code',         label: 'Code Examples'              },
  { id: 'textbutton-tokens',       label: 'Design Tokens'              },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TextButtonShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-textbutton"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="textbutton-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="textbutton-anatomy"
        title="Anatomy"
        description="TextButton's internal structure with icon slots, label, and expanded interactable area."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`TextButton (root)
├── iconLeading       — ReactNode, flex-shrink-0
├── label             — children (text)
├── iconTrailing      — ReactNode, flex-shrink-0
├── ::after           — expanded hit area (negative inset)
└── focus ring        — focus-visible only, primary-300`}
        </pre>
      </ShowcaseSection>

      {/* 4. Component-specific visual sections */}

      {/* 4a. Intent × Size */}
      <section id="textbutton-intent-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Intent × Size</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
          <div />
          {SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {INTENTS.map(intent => (
            <Fragment key={intent}>
              <RowHeader>{intent}</RowHeader>
              {SIZES.map(s => (
                <div key={s} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <TextButton intent={intent} size={s}>
                    Label
                  </TextButton>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          호버/클릭하여 색상 변화를 확인하세요. 배경 없이 텍스트 색상만 전환됩니다.
        </p>
      </section>

      {/* 4b. With Icons */}
      <section id="textbutton-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex gap-6 items-center">
            <SpecLabel>Leading</SpecLabel>
            <TextButton iconLeading={<PlusIcon />}>추가하기</TextButton>
            <TextButton intent="brand" iconLeading={<HeartIcon />}>좋아요</TextButton>
          </div>
          <div className="flex gap-6 items-center">
            <SpecLabel>Trailing</SpecLabel>
            <TextButton iconTrailing={<ChevronRightIcon />}>자세히 보기</TextButton>
            <TextButton intent="brand" iconTrailing={<ChevronRightIcon />}>더 알아보기</TextButton>
          </div>
          <div className="flex gap-6 items-center">
            <SpecLabel>Both</SpecLabel>
            <TextButton iconLeading={<PlusIcon />} iconTrailing={<ChevronRightIcon />}>새 항목</TextButton>
            <TextButton intent="brand" iconLeading={<HeartIcon />} iconTrailing={<ChevronRightIcon />}>즐겨찾기</TextButton>
          </div>
        </div>
      </section>

      {/* 4c. On Dim */}
      <section id="textbutton-on-dim" className="mb-12 scroll-mt-6">
        <SectionTitle>On Dim</SectionTitle>
        <div className="bg-semantic-neutral-solid-950 rounded-2 p-6">
          <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
            <div />
            {SIZES.map(s => (
              <div key={s} className="typography-13-semibold text-semantic-text-on-dim-600 pb-2 text-center">{s}</div>
            ))}

            {INTENTS.map(intent => (
              <Fragment key={intent}>
                <div className="typography-13-semibold text-semantic-text-on-dim-600 flex items-start pt-2 capitalize">
                  {intent}
                </div>
                {SIZES.map(s => (
                  <div key={s} className="flex justify-center py-3 border-t border-semantic-neutral-white-alpha-100">
                    <TextButton intent={intent} size={s} surface="dim">
                      Label
                    </TextButton>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
          <div className="flex gap-6 items-center mt-4 pt-4 border-t border-semantic-neutral-white-alpha-100">
            <TextButton intent="systemic" surface="dim" iconLeading={<PlusIcon />}>추가하기</TextButton>
            <TextButton intent="brand" surface="dim" iconTrailing={<ChevronRightIcon />}>자세히 보기</TextButton>
            <TextButton intent="systemic" surface="dim" disabled>Disabled</TextButton>
            <TextButton intent="brand" surface="dim" loading>Loading</TextButton>
          </div>
        </div>
      </section>

      {/* 4d. States */}
      <section id="textbutton-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
          <div />
          <ColHeader>Default</ColHeader>
          <ColHeader>Disabled</ColHeader>
          <ColHeader>Loading</ColHeader>
          <ColHeader>With Icon</ColHeader>

          {INTENTS.map(intent => (
            <Fragment key={intent}>
              <RowHeader>{intent}</RowHeader>
              <div className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                <TextButton intent={intent}>Label</TextButton>
              </div>
              <div className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                <TextButton intent={intent} disabled>Label</TextButton>
              </div>
              <div className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                <TextButton intent={intent} loading>Label</TextButton>
              </div>
              <div className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                <TextButton intent={intent} disabled iconTrailing={<ChevronRightIcon />}>Label</TextButton>
              </div>
            </Fragment>
          ))}
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          hover/active 상태는 마우스 인터랙션으로 확인. disabled는 클릭 불가 + 감소된 텍스트 색상.
        </p>
      </section>

      {/* 4e. Color Spec */}
      <section id="textbutton-color-spec" className="mb-12 scroll-mt-6">
        <SectionTitle>Color Spec</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
          <div />
          <ColHeader>Default</ColHeader>
          <ColHeader>Hover</ColHeader>
          <ColHeader>Active</ColHeader>
          <ColHeader>Disabled</ColHeader>

          {/* On-bright */}
          {INTENTS.map(intent => (
            <Fragment key={`bright-${intent}`}>
              <RowHeader>{intent}</RowHeader>
              {(['default', 'hover', 'active', 'disabled'] as const).map(state => {
                const spec = colorSpec[intent].bright
                const label = spec[state === 'active' ? 'active' : state]
                return (
                  <div key={state} className="py-2 border-t border-semantic-divider-solid-50">
                    <ColorSwatch
                      cssVar={contentTokenVar(intent, false, state === 'default' ? undefined : state)}
                      label={label}
                    />
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>

        <div className="mt-6 bg-semantic-neutral-solid-950 rounded-2 p-4">
          <p className="typography-12-semibold text-semantic-text-on-dim-600 mb-3">On-dim context</p>
          <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
            <div />
            {(['Default', 'Hover', 'Active', 'Disabled'] as const).map(s => (
              <div key={s} className="typography-13-semibold text-semantic-text-on-dim-600 pb-2 text-center">{s}</div>
            ))}

            {INTENTS.map(intent => (
              <Fragment key={`dim-${intent}`}>
                <div className="typography-13-semibold text-semantic-text-on-dim-600 flex items-start pt-2 capitalize">
                  {intent}
                </div>
                {(['default', 'hover', 'active', 'disabled'] as const).map(state => {
                  const spec = colorSpec[intent].dim
                  const label = spec[state === 'active' ? 'active' : state]
                  return (
                    <div key={state} className="py-2 border-t border-semantic-neutral-white-alpha-100">
                      <ColorSwatch
                        cssVar={contentTokenVar(intent, true, state === 'default' ? undefined : state)}
                        label={label}
                      />
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 4f. Size Spec */}
      <section id="textbutton-size-spec" className="mb-12 scroll-mt-6">
        <SectionTitle>Size Spec</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-x-4 gap-y-0">
          <div />
          {SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {SIZE_PROPS.map(prop => (
            <Fragment key={prop.key}>
              <SpecLabel>{prop.label}</SpecLabel>
              {SIZES.map(s => (
                <SpecValue key={s}>{sizeSpec[s][prop.key]}</SpecValue>
              ))}
            </Fragment>
          ))}
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="textbutton-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="textbutton-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="textbutton-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="textbutton-tokens"
        title="Design Tokens"
        description="Component → Semantic → Primitive resolution chain. Color tokens switch by theme, size tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
