import { useContext } from 'react'
import { IconButton, ICON_BUTTON_VARIANTS, ICON_BUTTON_INTENTS, ICON_BUTTON_SIZES, ICON_BUTTON_SHAPES } from '@/components/IconButton'
import type { IconButtonVariant, IconButtonIntent, IconButtonSize } from '@/components/IconButton'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { ColorSwatch, SectionTitle, ColHeader, RowHeader, SpecLabel, SpecValue, PlusIcon, HeartIcon, TrashIcon } from './shared'
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
import iconButtonSpec from '../../specs/icon-button.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(iconButtonSpec)
const propRows = extractProps(iconButtonSpec)

const VARIANTS: IconButtonVariant[] = [...ICON_BUTTON_VARIANTS]
const INTENTS: IconButtonIntent[] = [...ICON_BUTTON_INTENTS]
const SIZES: IconButtonSize[] = [...ICON_BUTTON_SIZES]

type ColorSpec = { bg: string; content: string; border?: string }

const colorSpec: Record<IconButtonVariant, Record<IconButtonIntent, ColorSpec>> = {
  primary: {
    systemic:    { bg: 'neutral-solid-950', content: 'neutral-solid-0' },
    brand:       { bg: 'primary-500',       content: 'neutral-solid-0' },
    destructive: { bg: 'error-500',         content: 'neutral-solid-0' },
  },
  secondary: {
    systemic:    { bg: 'neutral-solid-100', content: 'neutral-solid-950' },
    brand:       { bg: 'primary-50',        content: 'primary-500' },
    destructive: { bg: 'error-50',          content: 'error-500' },
  },
  outlined: {
    systemic:    { bg: 'transparent',       content: 'neutral-solid-900', border: 'neutral-solid-300' },
    brand:       { bg: 'transparent',       content: 'primary-500',       border: 'primary-500' },
    destructive: { bg: 'transparent',       content: 'error-500',         border: 'error-500' },
  },
  ghost: {
    systemic:    { bg: 'transparent',       content: 'neutral-solid-700' },
    brand:       { bg: 'transparent',       content: 'primary-500' },
    destructive: { bg: 'transparent',       content: 'error-500' },
  },
}

function compVar(variant: IconButtonVariant, intent: IconButtonIntent, prop: 'bg' | 'content' | 'border'): string {
  const intentSuffix = intent === 'systemic' ? '' : `-${intent}`
  return `--comp-button-${prop}-${variant}${intentSuffix}`
}

type SizeSpec = { size: string; icon: string; radius: string }

const sizeSpec: Record<IconButtonSize, SizeSpec> = {
  xSmall: { size: '24px', icon: '14px', radius: '4px' },
  small:  { size: '32px', icon: '16px', radius: '8px' },
  medium: { size: '40px', icon: '18px', radius: '8px' },
  large:  { size: '48px', icon: '20px', radius: '8px' },
  xLarge: { size: '56px', icon: '22px', radius: '8px' },
}

const SIZE_PROPS: { key: keyof SizeSpec; label: string }[] = [
  { key: 'size',   label: 'Size' },
  { key: 'icon',   label: 'Icon' },
  { key: 'radius', label: 'Radius' },
]

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant:  { kind: 'select', options: ICON_BUTTON_VARIANTS },
    intent:   { kind: 'select', options: ICON_BUTTON_INTENTS },
    size:     { kind: 'select', options: ICON_BUTTON_SIZES },
    shape:    { kind: 'select', options: ICON_BUTTON_SHAPES },
    disabled: { kind: 'boolean' },
    loading:  { kind: 'boolean' },
    icon:     { kind: 'slot', options: { plus: <PlusIcon />, heart: <HeartIcon />, trash: <TrashIcon /> } },
  },
  defaults: {
    variant: 'primary',
    intent: 'systemic',
    size: 'medium',
    shape: 'default',
    disabled: false,
    loading: false,
    icon: 'plus',
  },
  render: (props) => (
    <IconButton
      variant={props.variant as IconButtonVariant}
      intent={props.intent as IconButtonIntent}
      size={props.size as IconButtonSize}
      shape={props.shape as 'default' | 'pill' | 'square'}
      disabled={props.disabled as boolean}
      loading={props.loading as boolean}
      icon={props.icon as React.ReactNode}
      aria-label="preview"
    />
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Icon-only action where the icon meaning is universally understood (close, delete, settings)',
    'Compact action areas where label text would add too much width (toolbars, table rows)',
    'Supplementary actions alongside labeled buttons (e.g., copy, share)',
  ],
  dontUse: [
    { text: 'Action that requires a text label for clarity', alternative: 'button', alternativeLabel: 'Button' },
    { text: 'Navigating to another page or URL', alternative: 'text-button', alternativeLabel: 'TextButton' },
    { text: 'Toggling a binary state on/off', alternative: 'switch', alternativeLabel: 'Switch' },
  ],
  related: [
    { id: 'button', label: 'Button' },
    { id: 'text-button', label: 'TextButton' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<IconButton icon={<PlusIcon />} aria-label="Add item" />`,
  },
  {
    title: 'Variant × Intent',
    code: `<IconButton variant="outlined" intent="brand" icon={<HeartIcon />} aria-label="Like" />
<IconButton variant="ghost" intent="destructive" icon={<TrashIcon />} aria-label="Delete" />`,
  },
  {
    title: 'Loading state',
    code: `<IconButton loading icon={<PlusIcon />} aria-label="Adding..." />`,
    description: 'Icon becomes invisible while a centered spinner is shown. Interaction is disabled via pointer-events-none.',
  },
  {
    title: 'Circle shape (pill)',
    code: `<IconButton shape="pill" icon={<HeartIcon />} aria-label="Like" intent="brand" />`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens (shared with Button, systemic intent)',
    rows: [
      { component: '--comp-button-bg-primary',       semantic: 'neutral-solid-950', lightPrimitive: 'gray-950', lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-button-content-primary',   semantic: 'neutral-solid-0',   lightPrimitive: 'gray-0',   lightHex: '#fdfefe', darkPrimitive: 'gray-950', darkHex: '#1d1e22' },
      { component: '--comp-button-bg-secondary',      semantic: 'neutral-solid-100', lightPrimitive: 'gray-100', lightHex: '#f0f1f3', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-button-content-secondary',  semantic: 'neutral-solid-950', lightPrimitive: 'gray-950', lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-button-bg-outlined',        semantic: 'transparent',       lightPrimitive: '\u2014',    lightHex: 'transparent', darkPrimitive: '\u2014', darkHex: 'transparent' },
      { component: '--comp-button-content-outlined',   semantic: 'neutral-solid-900', lightPrimitive: 'gray-900', lightHex: '#282a2f', darkPrimitive: 'gray-70',  darkHex: '#e1e2e5' },
      { component: '--comp-button-border-outlined',    semantic: 'neutral-solid-300', lightPrimitive: 'gray-300', lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
      { component: '--comp-button-bg-ghost',           semantic: 'transparent',       lightPrimitive: '\u2014',    lightHex: 'transparent', darkPrimitive: '\u2014', darkHex: 'transparent' },
      { component: '--comp-button-content-ghost',      semantic: 'neutral-solid-700', lightPrimitive: 'gray-700', lightHex: '#404349', darkPrimitive: 'gray-300', darkHex: '#c3c5ca' },
    ],
  },
  {
    title: 'State Overlay & Focus',
    rows: [
      { component: '--comp-button-hover-on-dim',     semantic: 'state-on-dim-50',     lightPrimitive: 'white-alpha-50',  lightHex: 'rgba(255,255,255,0.08)', darkPrimitive: 'white-alpha-50',  darkHex: 'rgba(255,255,255,0.08)' },
      { component: '--comp-button-hover-on-bright',  semantic: 'state-on-bright-50',  lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',       darkPrimitive: 'black-alpha-50',  darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-button-active-on-dim',    semantic: 'state-on-dim-70',     lightPrimitive: 'white-alpha-70',  lightHex: 'rgba(255,255,255,0.12)', darkPrimitive: 'white-alpha-70',  darkHex: 'rgba(255,255,255,0.12)' },
      { component: '--comp-button-active-on-bright', semantic: 'state-on-bright-70',  lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)',       darkPrimitive: 'black-alpha-70',  darkHex: 'rgba(0,0,0,0.06)' },
      { component: '--comp-button-focus-ring',       semantic: 'primary-300',         lightPrimitive: 'purple-300',      lightHex: '#c5afe9',                darkPrimitive: 'purple-300',      darkHex: '#c5afe9' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Container Size (IconButton-specific)',
    scope: ':root',
    tokens: [
      { name: '--comp-icon-button-size-xs', value: '24px' },
      { name: '--comp-icon-button-size-sm', value: '32px' },
      { name: '--comp-icon-button-size-md', value: '40px' },
      { name: '--comp-icon-button-size-lg', value: '48px' },
      { name: '--comp-icon-button-size-xl', value: '56px' },
    ],
  },
  {
    title: 'Shape (shared with Button)',
    scope: ':root',
    tokens: [
      { name: '--comp-button-radius-xs', value: '4px' },
      { name: '--comp-button-radius-sm', value: '8px' },
      { name: '--comp-button-radius-md', value: '8px' },
      { name: '--comp-button-radius-lg', value: '8px' },
      { name: '--comp-button-radius-xl', value: '8px' },
      { name: '--comp-button-radius-pill', value: '9999px' },
      { name: '--comp-button-radius-square', value: '0px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const ICON_BUTTON_TOC: TocEntry[] = [
  { id: 'component-icon-button',      label: 'IconButton',      level: 1 },
  { id: 'iconbutton-playground',      label: 'Playground'                 },
  { id: 'iconbutton-anatomy',         label: 'Anatomy'                    },
  { id: 'iconbutton-variant-intent',  label: 'Variant \u00d7 Intent'     },
  { id: 'iconbutton-size',            label: 'Size'                       },
  { id: 'iconbutton-shape',           label: 'Shape'                      },
  { id: 'iconbutton-states',          label: 'States'                     },
  { id: 'iconbutton-usage',           label: 'Usage Guidelines'           },
  { id: 'iconbutton-props',           label: 'Props'                      },
  { id: 'iconbutton-code',            label: 'Code Examples'              },
  { id: 'iconbutton-tokens',          label: 'Design Tokens'              },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function IconButtonShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-icon-button"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="iconbutton-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="iconbutton-anatomy"
        title="Anatomy"
        description="IconButton shares Button's internal structure but renders only a single icon."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`IconButton (root)
├── state overlay  — sibling <span>, group-hover / group-active
├── spinner        — absolute centered (loading only)
└── icon           — ReactNode, flex-shrink-0, sized by size variant`}
        </pre>
      </ShowcaseSection>

      {/* 4a. Variant × Intent color matrix */}
      <section id="iconbutton-variant-intent" className="mb-12 scroll-mt-6">
        <SectionTitle>Variant × Intent</SectionTitle>
        <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-x-4 gap-y-0">
          <div />
          {INTENTS.map(intent => (
            <ColHeader key={intent}>{intent}</ColHeader>
          ))}

          {VARIANTS.map(variant => (
            <>
              <RowHeader key={`rh-${variant}`}>{variant}</RowHeader>
              {INTENTS.map(intent => {
                const spec = colorSpec[variant][intent]
                return (
                  <div key={`${variant}-${intent}`} className="flex flex-col gap-2 py-3 border-t border-semantic-divider-solid-50">
                    <div className="flex justify-center">
                      <IconButton variant={variant} intent={intent} icon={<PlusIcon />} aria-label={`${variant} ${intent}`} />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <ColorSwatch cssVar={compVar(variant, intent, 'bg')} label={`bg: ${spec.bg}`} />
                      <ColorSwatch cssVar={compVar(variant, intent, 'content')} label={`text: ${spec.content}`} />
                      {spec.border && (
                        <ColorSwatch cssVar={compVar(variant, intent, 'border')} label={`border: ${spec.border}`} />
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </section>

      {/* 4b. Size spec table */}
      <section id="iconbutton-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Size</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-x-4 gap-y-0">
          <div />
          {SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          <div />
          {SIZES.map(size => (
            <div key={size} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <IconButton size={size} icon={<PlusIcon />} aria-label={size} />
            </div>
          ))}

          {SIZE_PROPS.map(prop => (
            <>
              <SpecLabel key={`lbl-${prop.key}`}>{prop.label}</SpecLabel>
              {SIZES.map(size => (
                <SpecValue key={`${prop.key}-${size}`}>{sizeSpec[size][prop.key]}</SpecValue>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* 4c. Shape */}
      <section id="iconbutton-shape" className="mb-10 scroll-mt-6">
        <SectionTitle>Shape</SectionTitle>
        <div className="flex items-center gap-4">
          {(['default', 'pill', 'square'] as const).map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <IconButton shape={s} icon={<HeartIcon />} aria-label={s} intent="brand" />
              <span className="typography-12-regular text-semantic-text-on-bright-400">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4d. States */}
      <section id="iconbutton-states" className="mb-10 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <IconButton icon={<PlusIcon />} aria-label="default" />
            <span className="typography-12-regular text-semantic-text-on-bright-400">Default</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <IconButton icon={<PlusIcon />} aria-label="disabled" disabled />
            <span className="typography-12-regular text-semantic-text-on-bright-400">Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <IconButton icon={<PlusIcon />} aria-label="loading" loading />
            <span className="typography-12-regular text-semantic-text-on-bright-400">Loading</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <IconButton variant="outlined" icon={<PlusIcon />} aria-label="outlined disabled" disabled />
            <span className="typography-12-regular text-semantic-text-on-bright-400">Outlined Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <IconButton variant="ghost" icon={<PlusIcon />} aria-label="ghost loading" loading />
            <span className="typography-12-regular text-semantic-text-on-bright-400">Ghost Loading</span>
          </div>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="iconbutton-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="iconbutton-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="iconbutton-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="iconbutton-tokens"
        title="Design Tokens"
        description="IconButton reuses all Button color tokens. Only container size tokens are unique."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
