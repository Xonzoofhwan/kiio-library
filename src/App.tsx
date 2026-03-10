import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import type { ButtonVariant, ButtonIntent, ButtonSize } from '@/components/Button'

/* ─── Placeholder icons ───────────────────────────────────────────────────── */

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'outlined', 'ghost']
const INTENTS: ButtonIntent[] = ['systemic', 'brand', 'destructive']
const SIZES: ButtonSize[] = ['xSmall', 'small', 'medium', 'large', 'xLarge']

type ColorSpec = { bg: string; content: string; border?: string }

/** variant → intent → semantic token names for bg, content, border */
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

/** CSS variable name for the component token */
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

/* ─── Helper components ───────────────────────────────────────────────────── */

function ColorSwatch({ cssVar, label }: { cssVar: string; label: string }) {
  const isTransparent = label === 'transparent'
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'w-3 h-3 rounded-full border flex-shrink-0',
          isTransparent ? 'border-dashed border-semantic-neutral-solid-300' : 'border-semantic-divider-solid-100',
        )}
        style={isTransparent ? undefined : { backgroundColor: `var(${cssVar})` }}
      />
      <span className="typography-12-regular text-semantic-text-on-bright-400 whitespace-nowrap">{label}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="typography-16-semibold text-semantic-text-on-bright-800 mb-4">{children}</h2>
}

function ColHeader({ children }: { children: React.ReactNode }) {
  return <div className="typography-13-semibold text-semantic-text-on-bright-500 pb-2 text-center">{children}</div>
}

function RowHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="typography-13-semibold text-semantic-text-on-bright-500 flex items-start pt-2 capitalize">
      {children}
    </div>
  )
}

function SpecLabel({ children }: { children: React.ReactNode }) {
  return <div className="typography-12-medium text-semantic-text-on-bright-400">{children}</div>
}

function SpecValue({ children }: { children: React.ReactNode }) {
  return <div className="typography-12-regular text-semantic-text-on-bright-500 text-center">{children}</div>
}

/* ─── App ─────────────────────────────────────────────────────────────────── */

export default function App() {
  const [shape, setShape] = useState<'basic' | 'geo'>('basic')

  return (
    <div data-theme="brand1" data-shape={shape} className="min-h-screen bg-semantic-background-0 font-pretendard p-8 max-w-5xl mx-auto">
      {/* Shape controls */}
      <div className="flex items-center gap-3 mb-8">
        <span className="typography-12-semibold text-semantic-text-on-bright-400">Shape</span>
        {(['basic', 'geo'] as const).map(s => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className={cn(
              'px-3 py-1 rounded-2 typography-13-medium transition-colors',
              shape === s ? 'bg-semantic-neutral-solid-950 text-white' : 'bg-semantic-neutral-solid-100 text-semantic-text-on-bright-700',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  BUTTON                                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <h1 className="typography-24-bold text-semantic-text-on-bright-900 mb-6">Button</h1>

      {/* ── Variant × Intent color matrix ── */}
      <section className="mb-12">
        <SectionTitle>Variant × Intent</SectionTitle>
        <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-x-4 gap-y-0">
          {/* Column headers */}
          <div /> {/* empty top-left */}
          {INTENTS.map(intent => (
            <ColHeader key={intent}>{intent}</ColHeader>
          ))}

          {/* Rows: one per variant */}
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

      {/* ── Size spec table ── */}
      <section className="mb-12">
        <SectionTitle>Size</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-x-4 gap-y-0">
          {/* Header */}
          <div />
          {SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          {/* Button row */}
          <div />
          {SIZES.map(size => (
            <div key={size} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <Button size={size}>{size}</Button>
            </div>
          ))}

          {/* Spec rows */}
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

      {/* ── Shapes ── */}
      <section className="mb-10">
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

      {/* ── With Icons ── */}
      <section className="mb-10">
        <SectionTitle>With Icons</SectionTitle>
        <div className="flex items-center gap-3">
          <Button iconLeading={<PlusIcon />}>Leading</Button>
          <Button iconTrailing={<PlusIcon />}>Trailing</Button>
          <Button iconLeading={<PlusIcon />} iconTrailing={<PlusIcon />}>Both</Button>
          <Button intent="brand" iconLeading={<HeartIcon />}>Brand</Button>
          <Button intent="destructive" iconLeading={<TrashIcon />}>Delete</Button>
        </div>
      </section>

      {/* ── States ── */}
      <section className="mb-10">
        <SectionTitle>States</SectionTitle>
        <div className="flex items-center gap-3">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="outlined" disabled>Outlined Disabled</Button>
          <Button variant="ghost" loading>Ghost Loading</Button>
        </div>
      </section>

      {/* ── Full Width ── */}
      <section className="mb-10 max-w-md">
        <SectionTitle>Full Width</SectionTitle>
        <Button fullWidth intent="brand">Full Width Brand</Button>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  ICON BUTTON                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <h1 className="typography-24-bold text-semantic-text-on-bright-900 mb-6 mt-16">IconButton</h1>

      {/* ── Variant × Intent color matrix ── */}
      <section className="mb-12">
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

      {/* ── IconButton Size spec table ── */}
      <section className="mb-12">
        <SectionTitle>Size</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-x-4 gap-y-0">
          <div />
          {SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          {/* IconButton row */}
          <div />
          {SIZES.map(size => (
            <div key={size} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <IconButton size={size} icon={<PlusIcon />} aria-label={size} />
            </div>
          ))}

          {/* Spec rows */}
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

      {/* ── IconButton Shapes ── */}
      <section className="mb-10">
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

      {/* ── IconButton States ── */}
      <section className="mb-10">
        <SectionTitle>States</SectionTitle>
        <div className="flex items-center gap-3">
          <IconButton icon={<PlusIcon />} aria-label="default" />
          <IconButton icon={<PlusIcon />} aria-label="disabled" disabled />
          <IconButton icon={<PlusIcon />} aria-label="loading" loading />
        </div>
      </section>
    </div>
  )
}
