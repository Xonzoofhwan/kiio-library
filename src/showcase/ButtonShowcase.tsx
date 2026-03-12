import { Button } from '@/components/Button'
import type { ButtonVariant, ButtonIntent, ButtonSize } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { ColorSwatch, SectionTitle, ColHeader, RowHeader, SpecLabel, SpecValue, PlusIcon, TrashIcon, HeartIcon } from './shared'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'outlined', 'ghost']
const INTENTS: ButtonIntent[] = ['systemic', 'brand', 'destructive']
const SIZES: ButtonSize[] = ['xSmall', 'small', 'medium', 'large', 'xLarge']

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

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const BUTTON_TOC: TocEntry[] = [
  { id: 'component-button',      label: 'Button',          level: 1 },
  { id: 'button-variant-intent', label: 'Variant × Intent'           },
  { id: 'button-size',           label: 'Size'                       },
  { id: 'button-shape',          label: 'Shape'                      },
  { id: 'button-with-icons',     label: 'With Icons'                 },
  { id: 'button-states',         label: 'States'                     },
  { id: 'button-full-width',     label: 'Full Width'                 },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function ButtonShowcase() {
  return (
    <>
      <h1 id="component-button" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        Button
      </h1>

      {/* Variant × Intent color matrix */}
      <section id="button-variant-intent" className="mb-12 scroll-mt-6">
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

      {/* Size spec table */}
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

      {/* Shape */}
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

      {/* With Icons */}
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

      {/* States */}
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

      {/* Full Width */}
      <section id="button-full-width" className="mb-10 max-w-md scroll-mt-6">
        <SectionTitle>Full Width</SectionTitle>
        <Button fullWidth intent="brand">Full Width Brand</Button>
      </section>
    </>
  )
}
