import { useContext } from 'react'
import { Button, BUTTON_VARIANTS, BUTTON_INTENTS, BUTTON_SIZES, BUTTON_SHAPES } from '@/components/Button'
import type { ButtonVariant, ButtonIntent, ButtonSize } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { ColorSwatch, SectionTitle, ColHeader, RowHeader, SpecLabel, SpecValue, PlusIcon, TrashIcon, HeartIcon } from './shared'
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
import buttonSpec from '../../specs/button.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(buttonSpec)
const propRows = extractProps(buttonSpec)

const VARIANTS: ButtonVariant[] = [...BUTTON_VARIANTS]
const INTENTS: ButtonIntent[] = [...BUTTON_INTENTS]
const SIZES: ButtonSize[] = [...BUTTON_SIZES]

type ColorSpec = { bg: string; content: string; border?: string }

const colorSpec: Record<ButtonVariant, Record<ButtonIntent, ColorSpec>> = {
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

function compVar(variant: ButtonVariant, intent: ButtonIntent, prop: 'bg' | 'content' | 'border'): string {
  const intentSuffix = intent === 'systemic' ? '' : `-${intent}`
  return `--comp-button-${prop}-${variant}${intentSuffix}`
}

type SizeSpec = { height: string; px: string; gap: string; typography: string; radius: string; icon: string; labelPx: string }

const sizeSpec: Record<ButtonSize, SizeSpec> = {
  xSmall: { height: '24px', px: '6px',  gap: '2px', typography: '12/16', radius: '4px', icon: '14px', labelPx: '2px' },
  small:  { height: '32px', px: '8px',  gap: '4px', typography: '13/18', radius: '8px', icon: '16px', labelPx: '4px' },
  medium: { height: '40px', px: '12px', gap: '4px', typography: '14/20', radius: '8px', icon: '18px', labelPx: '4px' },
  large:  { height: '48px', px: '16px', gap: '4px', typography: '15/22', radius: '8px', icon: '20px', labelPx: '4px' },
  xLarge: { height: '56px', px: '20px', gap: '6px', typography: '16/24', radius: '8px', icon: '22px', labelPx: '4px' },
}

const SIZE_PROPS: { key: keyof SizeSpec; label: string }[] = [
  { key: 'height',     label: 'Height' },
  { key: 'px',         label: 'Padding-X' },
  { key: 'gap',        label: 'Gap' },
  { key: 'typography', label: 'Font / LH' },
  { key: 'radius',     label: 'Radius' },
  { key: 'icon',       label: 'Icon' },
  { key: 'labelPx',    label: 'Label Pad' },
]

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    variant:      { kind: 'select', options: BUTTON_VARIANTS },
    intent:       { kind: 'select', options: BUTTON_INTENTS },
    size:         { kind: 'select', options: BUTTON_SIZES },
    shape:        { kind: 'select', options: BUTTON_SHAPES },
    disabled:     { kind: 'boolean' },
    loading:      { kind: 'boolean' },
    fullWidth:    { kind: 'boolean' },
    iconLeading:  { kind: 'slot', options: { none: null, plus: <PlusIcon />, heart: <HeartIcon />, trash: <TrashIcon /> } },
    iconTrailing: { kind: 'slot', options: { none: null, plus: <PlusIcon />, heart: <HeartIcon /> } },
  },
  defaults: {
    variant: 'primary',
    intent: 'systemic',
    size: 'medium',
    shape: 'default',
    disabled: false,
    loading: false,
    fullWidth: false,
    iconLeading: 'none',
    iconTrailing: 'none',
  },
  render: (props) => (
    <Button
      variant={props.variant as ButtonVariant}
      intent={props.intent as ButtonIntent}
      size={props.size as ButtonSize}
      shape={props.shape as 'default' | 'pill' | 'square'}
      disabled={props.disabled as boolean}
      loading={props.loading as boolean}
      fullWidth={props.fullWidth as boolean}
      iconLeading={props.iconLeading as React.ReactNode}
      iconTrailing={props.iconTrailing as React.ReactNode}
    >
      Button
    </Button>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'User needs to trigger an action (submit, confirm, save, delete)',
    'Needs visual hierarchy among multiple actions (primary/secondary/ghost)',
    'Needs a clickable element with loading feedback',
  ],
  dontUse: [
    { text: 'Navigating to another page or external URL', alternative: 'text-button', alternativeLabel: 'TextButton' },
    { text: 'Toggling a binary state on/off', alternative: 'switch', alternativeLabel: 'Switch' },
    { text: 'Selecting among multiple options', alternative: 'chip', alternativeLabel: 'Chip' },
    { text: 'Icon-only action without label', alternative: 'icon-button', alternativeLabel: 'IconButton' },
  ],
  related: [
    { id: 'icon-button', label: 'IconButton' },
    { id: 'text-button', label: 'TextButton' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `<Button variant="primary" intent="systemic" size="medium">
  Save
</Button>`,
  },
  {
    title: 'With icons',
    code: `<Button iconLeading={<PlusIcon />} intent="brand">
  Add item
</Button>

<Button iconTrailing={<ArrowRightIcon />} variant="outlined">
  Next step
</Button>`,
  },
  {
    title: 'Loading state',
    code: `<Button loading disabled={false}>
  Submitting...
</Button>`,
    description: 'Content becomes invisible while a centered spinner is shown. Interaction is disabled via pointer-events-none.',
  },
  {
    title: 'Full width in form',
    code: `<form>
  {/* form fields */}
  <Button fullWidth intent="brand" size="large">
    Sign up
  </Button>
</form>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Color Tokens (variant \u00d7 intent: systemic)',
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
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-button-height-xs', value: '24px' },
      { name: '--comp-button-height-sm', value: '32px' },
      { name: '--comp-button-height-md', value: '40px' },
      { name: '--comp-button-height-lg', value: '48px' },
      { name: '--comp-button-height-xl', value: '56px' },
      { name: '--comp-button-px-md', value: '12px' },
      { name: '--comp-button-gap-md', value: '4px' },
      { name: '--comp-button-icon-md', value: '18px' },
    ],
  },
  {
    title: 'Shape (border-radius)',
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

export const BUTTON_TOC: TocEntry[] = [
  { id: 'component-button',      label: 'Button',              level: 1 },
  { id: 'button-playground',     label: 'Playground'                     },
  { id: 'button-anatomy',        label: 'Anatomy'                        },
  { id: 'button-variant-intent', label: 'Variant \u00d7 Intent'          },
  { id: 'button-size',           label: 'Size'                           },
  { id: 'button-shape',          label: 'Shape'                          },
  { id: 'button-with-icons',     label: 'With Icons'                     },
  { id: 'button-states',         label: 'States'                         },
  { id: 'button-full-width',     label: 'Full Width'                     },
  { id: 'button-usage',          label: 'Usage Guidelines'               },
  { id: 'button-props',          label: 'Props'                          },
  { id: 'button-code',           label: 'Code Examples'                  },
  { id: 'button-tokens',         label: 'Design Tokens'                  },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function ButtonShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-button"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="button-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="button-anatomy"
        title="Anatomy"
        description="Button's internal structure with icon slots, label, and state overlay."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Button (root)
├── iconLeading    — ReactNode, flex-shrink-0
├── label          — children (text)
├── iconTrailing   — ReactNode, flex-shrink-0
└── state overlay  — sibling <span>, group-hover / group-active`}
        </pre>
      </ShowcaseSection>

      {/* 4. Variations */}

      {/* 4a. Variant × Intent color matrix */}
      <section id="button-variant-intent" className="mb-12 scroll-mt-6">
        <SectionTitle>Variant \u00d7 Intent</SectionTitle>
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
                    <Button variant={variant} intent={intent} size="medium">
                      {variant}
                    </Button>
                    <div className="flex flex-col gap-1 mt-1">
                      <ColorSwatch cssVar={compVar(variant, intent, 'bg')} label={`bg: ${spec.bg}`} />
                      <ColorSwatch cssVar={compVar(variant, intent, 'content')} label={`text: ${spec.content}`} />
                      {spec.border && (
                        <ColorSwatch cssVar={compVar(variant, intent, 'border')} label={`border: ${spec.border}`} />
                      )}
                      {!spec.border && variant !== 'outlined' && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3" />
                          <span className="typography-12-regular text-semantic-text-on-bright-300">border: none</span>
                        </div>
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
      <section id="button-size" className="mb-12 scroll-mt-6">
        <SectionTitle>Size</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-x-4 gap-y-0">
          <div />
          {SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          <div />
          {SIZES.map(size => (
            <div key={size} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <Button size={size}>{size}</Button>
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
      <section id="button-shape" className="mb-10 scroll-mt-6">
        <SectionTitle>Shape</SectionTitle>
        <div className="flex items-center gap-4">
          {(['default', 'pill', 'square'] as const).map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Button shape={s}>Button</Button>
              <span className="typography-12-regular text-semantic-text-on-bright-400">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4d. With Icons */}
      <section id="button-with-icons" className="mb-10 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="flex items-center gap-3">
          <Button iconLeading={<PlusIcon />}>Leading</Button>
          <Button iconTrailing={<PlusIcon />}>Trailing</Button>
          <Button iconLeading={<PlusIcon />} iconTrailing={<PlusIcon />}>Both</Button>
          <Button intent="brand" iconLeading={<HeartIcon />}>Brand</Button>
          <Button intent="destructive" iconLeading={<TrashIcon />}>Delete</Button>
        </div>
      </section>

      {/* 4e. States */}
      <section id="button-states" className="mb-10 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex items-center gap-3">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="outlined" disabled>Outlined Disabled</Button>
          <Button variant="ghost" loading>Ghost Loading</Button>
        </div>
      </section>

      {/* 4f. Full Width */}
      <section id="button-full-width" className="mb-10 max-w-md scroll-mt-6">
        <SectionTitle>Full Width</SectionTitle>
        <Button fullWidth intent="brand">Full Width Brand</Button>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="button-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table */}
      <ShowcaseSection id="button-props" title="Props">
        <PropsTable props={propRows} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="button-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="button-tokens"
        title="Design Tokens"
        description="Component \u2192 Semantic \u2192 Primitive resolution chain. Color tokens switch by theme, size/shape tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
