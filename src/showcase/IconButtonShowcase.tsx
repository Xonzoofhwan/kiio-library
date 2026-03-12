import { IconButton } from '@/components/IconButton'
import type { ButtonVariant, ButtonIntent, ButtonSize } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { ColorSwatch, SectionTitle, ColHeader, RowHeader, SpecLabel, SpecValue, PlusIcon, HeartIcon } from './shared'

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

type IconButtonSizeSpec = { size: string; icon: string; radius: string }

const iconButtonSizeSpec: Record<ButtonSize, IconButtonSizeSpec> = {
  xSmall: { size: '24px', icon: '14px', radius: '4px' },
  small:  { size: '32px', icon: '16px', radius: '8px' },
  medium: { size: '40px', icon: '18px', radius: '8px' },
  large:  { size: '48px', icon: '20px', radius: '8px' },
  xLarge: { size: '56px', icon: '22px', radius: '8px' },
}

const ICON_BUTTON_SIZE_PROPS: { key: keyof IconButtonSizeSpec; label: string }[] = [
  { key: 'size',   label: 'Size' },
  { key: 'icon',   label: 'Icon' },
  { key: 'radius', label: 'Radius' },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const ICON_BUTTON_TOC: TocEntry[] = [
  { id: 'component-icon-button',      label: 'IconButton',      level: 1 },
  { id: 'iconbutton-variant-intent',  label: 'Variant × Intent'           },
  { id: 'iconbutton-size',            label: 'Size'                       },
  { id: 'iconbutton-shape',           label: 'Shape'                      },
  { id: 'iconbutton-states',          label: 'States'                     },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function IconButtonShowcase() {
  return (
    <>
      <h1 id="component-icon-button" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        IconButton
      </h1>

      {/* Variant × Intent */}
      <section id="iconbutton-variant-intent" className="mb-12 scroll-mt-6">
        <SectionTitle>Variant × Intent</SectionTitle>
        <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-x-4 gap-y-0">
          <div />
          {INTENTS.map(intent => (
            <ColHeader key={intent}>{intent}</ColHeader>
          ))}

          {VARIANTS.map(variant => (
            <>
              <RowHeader key={`rh-ib-${variant}`}>{variant}</RowHeader>
              {INTENTS.map(intent => {
                const spec = colorSpec[variant][intent]
                return (
                  <div key={`ib-${variant}-${intent}`} className="flex flex-col gap-2 py-3 border-t border-semantic-divider-solid-50">
                    <div className="flex justify-center">
                      <IconButton
                        variant={variant}
                        intent={intent}
                        icon={<PlusIcon />}
                        aria-label={`${variant} ${intent}`}
                      />
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

      {/* Size spec table */}
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

          {ICON_BUTTON_SIZE_PROPS.map(prop => (
            <>
              <SpecLabel key={`lbl-ib-${prop.key}`}>{prop.label}</SpecLabel>
              {SIZES.map(size => (
                <SpecValue key={`ib-${prop.key}-${size}`}>{iconButtonSizeSpec[size][prop.key]}</SpecValue>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* Shape */}
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

      {/* States */}
      <section id="iconbutton-states" className="mb-10 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex items-center gap-3">
          <IconButton icon={<PlusIcon />} aria-label="default" />
          <IconButton icon={<PlusIcon />} aria-label="disabled" disabled />
          <IconButton icon={<PlusIcon />} aria-label="loading" loading />
        </div>
      </section>
    </>
  )
}
