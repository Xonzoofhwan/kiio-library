import { BadgeLabel, BadgeCounter, BadgeDot, BADGE_COLORS, BADGE_SIZES, BADGE_WEIGHTS, BADGE_SHAPES } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, ColHeader, RowHeader } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const BADGE_TOC: TocEntry[] = [
  { id: 'component-badge',          label: 'Badge',              level: 1 },
  { id: 'badge-label',              label: 'BadgeLabel'                    },
  { id: 'badge-label-size-weight',  label: 'Size × Weight'                },
  { id: 'badge-label-shape',        label: 'Shape'                        },
  { id: 'badge-label-colors',       label: 'Color Palette'                },
  { id: 'badge-counter',            label: 'BadgeCounter'                  },
  { id: 'badge-counter-examples',   label: 'Counter Examples'             },
  { id: 'badge-dot',                label: 'BadgeDot'                      },
  { id: 'badge-dot-colors',         label: 'Dot Colors'                    },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function BadgeShowcase() {
  return (
    <>
      <h1 id="component-badge" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        Badge
      </h1>

      {/* ══════════════════ BadgeLabel ══════════════════ */}
      <h2 id="badge-label" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        BadgeLabel
      </h2>

      {/* ── Size × Weight ── */}
      <section id="badge-label-size-weight" className="mb-10 scroll-mt-6">
        <SectionTitle>Size × Weight</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          {BADGE_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {BADGE_WEIGHTS.map(weight => (
            <>
              <RowHeader key={`rh-${weight}`}>{weight}</RowHeader>
              {BADGE_SIZES.map(size => (
                <div key={`${weight}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <BadgeLabel size={size} weight={weight} color="gray">Label</BadgeLabel>
                </div>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* ── Shape ── */}
      <section id="badge-label-shape" className="mb-10 scroll-mt-6">
        <SectionTitle>Shape</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          {BADGE_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {BADGE_SHAPES.map(shape => (
            <>
              <RowHeader key={`rh-shape-${shape}`}>{shape}</RowHeader>
              {BADGE_SIZES.map(size => (
                <div key={`${shape}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <BadgeLabel size={size} shape={shape} weight="heavy" color="indigo">Label</BadgeLabel>
                </div>
              ))}
            </>
          ))}
        </div>
      </section>

      {/* ── Color Palette ── */}
      <section id="badge-label-colors" className="mb-10 scroll-mt-6">
        <SectionTitle>Color Palette</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(2,1fr)] gap-x-4 gap-y-0">
          <div />
          <ColHeader>light</ColHeader>
          <ColHeader>heavy</ColHeader>

          {BADGE_COLORS.map(color => (
            <>
              <RowHeader key={`rh-color-${color}`}>{color}</RowHeader>
              <div key={`light-${color}`} className="flex justify-center py-2 border-t border-semantic-divider-solid-50">
                <BadgeLabel size="small" weight="light" color={color}>Label</BadgeLabel>
              </div>
              <div key={`heavy-${color}`} className="flex justify-center py-2 border-t border-semantic-divider-solid-50">
                <BadgeLabel size="small" weight="heavy" color={color}>Label</BadgeLabel>
              </div>
            </>
          ))}
        </div>
      </section>

      {/* ══════════════════ BadgeCounter ══════════════════ */}
      <h2 id="badge-counter" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        BadgeCounter
      </h2>

      <section id="badge-counter-examples" className="mb-12 scroll-mt-6">
        <SectionTitle>Counter Examples</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="typography-13-semibold text-semantic-text-on-bright-500 w-16">heavy</span>
            <BadgeCounter color="red-bright">1</BadgeCounter>
            <BadgeCounter color="red-bright">9</BadgeCounter>
            <BadgeCounter color="red-bright">99</BadgeCounter>
            <BadgeCounter color="red-bright">99+</BadgeCounter>
            <BadgeCounter color="indigo">New</BadgeCounter>
            <BadgeCounter color="purple">Beta</BadgeCounter>
          </div>
          <div className="flex items-center gap-3">
            <span className="typography-13-semibold text-semantic-text-on-bright-500 w-16">light</span>
            <BadgeCounter weight="light" color="red-bright">1</BadgeCounter>
            <BadgeCounter weight="light" color="red-bright">9</BadgeCounter>
            <BadgeCounter weight="light" color="red-bright">99</BadgeCounter>
            <BadgeCounter weight="light" color="red-bright">99+</BadgeCounter>
            <BadgeCounter weight="light" color="indigo">New</BadgeCounter>
            <BadgeCounter weight="light" color="purple">Beta</BadgeCounter>
          </div>
        </div>
      </section>

      {/* ══════════════════ BadgeDot ══════════════════ */}
      <h2 id="badge-dot" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        BadgeDot
      </h2>

      <section id="badge-dot-colors" className="mb-10 scroll-mt-6">
        <SectionTitle>Dot Colors</SectionTitle>
        <div className="flex flex-wrap items-center gap-4">
          {BADGE_COLORS.map(color => (
            <div key={`dot-${color}`} className="flex flex-col items-center gap-1.5">
              <BadgeDot color={color} />
              <span className="typography-12-regular text-semantic-text-on-bright-400">{color}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
