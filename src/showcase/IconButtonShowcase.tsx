import { IconButton, ICON_BUTTON_HIERARCHIES, ICON_BUTTON_SIZES, ICON_BUTTON_SHAPES } from '@/components/Button'
import { IconButtonEmphasized, ICON_BUTTON_EMP_HIERARCHIES, ICON_BUTTON_EMP_COLORS } from '@/components/Button'
import { IconButtonError, ICON_BUTTON_ERR_HIERARCHIES } from '@/components/Button'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const ICON_BUTTON_TOC: TocEntry[] = [
  { id: 'ib-hierarchy', label: 'Hierarchy' },
  { id: 'ib-sizes', label: 'Sizes & Shapes' },
  { id: 'ib-states', label: 'States' },
  { id: 'ib-emp', label: 'Emphasized' },
  { id: 'ib-emp-colors', label: 'Emp. Colors' },
  { id: 'ib-emp-states', label: 'Emp. States' },
  { id: 'ib-error', label: 'Error' },
  { id: 'ib-err-states', label: 'Err. States' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function IconButtonShowcase() {
  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">IconButton</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Square icon-only buttons. Always width = height with centered icon.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════
         UNIVERSAL
         ════════════════════════════════════════════════════════════ */}

      <div>
        <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Universal</h2>

        <section id="ib-hierarchy" className="mb-12">
          <SectionTitle>Hierarchy</SectionTitle>
          <div className="flex flex-wrap gap-3 items-center">
            {ICON_BUTTON_HIERARCHIES.map((h) => (
              <IconButton key={h} hierarchy={h} size="large" icon={<Icon name="settings" />} aria-label={h} />
            ))}
          </div>
        </section>

        <section id="ib-sizes" className="mb-12">
          <SectionTitle>Sizes &amp; Shapes</SectionTitle>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3 items-end">
              {ICON_BUTTON_SIZES.map((s) => (
                <IconButton key={s} size={s} icon={<Icon name="favorite" />} aria-label={s} />
              ))}
            </div>
            <div className="flex flex-wrap gap-6">
              {ICON_BUTTON_SHAPES.map((shape) => (
                <div key={shape} className="flex flex-col items-center gap-2">
                  <ColHeader>{shape}</ColHeader>
                  <IconButton shape={shape} size="large" icon={<Icon name="add" />} aria-label={shape} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ib-states" className="mb-12">
          <SectionTitle>States</SectionTitle>
          <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
            <RowHeader>Default</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_HIERARCHIES.map((h) => (
                <IconButton key={h} hierarchy={h} icon={<Icon name="edit" />} aria-label={`${h} default`} />
              ))}
            </div>
            <RowHeader>Disabled</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_HIERARCHIES.map((h) => (
                <IconButton key={h} hierarchy={h} disabled icon={<Icon name="edit" />} aria-label={`${h} disabled`} />
              ))}
            </div>
            <RowHeader>Loading</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_HIERARCHIES.map((h) => (
                <IconButton key={h} hierarchy={h} loading icon={<Icon name="edit" />} aria-label={`${h} loading`} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════
         EMPHASIZED
         ════════════════════════════════════════════════════════════ */}

      <div>
        <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Emphasized</h2>

        <section id="ib-emp" className="mb-12">
          <SectionTitle>Hierarchy</SectionTitle>
          <div className="flex flex-wrap gap-3 items-center">
            {ICON_BUTTON_EMP_HIERARCHIES.map((h) => (
              <IconButtonEmphasized key={h} hierarchy={h} size="large" icon={<Icon name="star" />} aria-label={h} />
            ))}
          </div>
        </section>

        <section id="ib-emp-colors" className="mb-12">
          <SectionTitle>Colors</SectionTitle>
          <div className="flex flex-col gap-4">
            {ICON_BUTTON_EMP_COLORS.map((color) => (
              <div key={color} className="flex flex-wrap gap-3 items-center">
                <ColHeader>{color}</ColHeader>
                {ICON_BUTTON_EMP_HIERARCHIES.map((h) => (
                  <IconButtonEmphasized key={h} hierarchy={h} color={color} icon={<Icon name="star" />} aria-label={`${color} ${h}`} />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="ib-emp-states" className="mb-12">
          <SectionTitle>States</SectionTitle>
          <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
            <RowHeader>Default</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_EMP_HIERARCHIES.map((h) => (
                <IconButtonEmphasized key={h} hierarchy={h} icon={<Icon name="star" />} aria-label={`${h} default`} />
              ))}
            </div>
            <RowHeader>Disabled</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_EMP_HIERARCHIES.map((h) => (
                <IconButtonEmphasized key={h} hierarchy={h} disabled icon={<Icon name="star" />} aria-label={`${h} disabled`} />
              ))}
            </div>
            <RowHeader>Loading</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_EMP_HIERARCHIES.map((h) => (
                <IconButtonEmphasized key={h} hierarchy={h} loading icon={<Icon name="star" />} aria-label={`${h} loading`} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════
         ERROR
         ════════════════════════════════════════════════════════════ */}

      <div>
        <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Error</h2>

        <section id="ib-error" className="mb-12">
          <SectionTitle>Hierarchy</SectionTitle>
          <div className="flex flex-wrap gap-3 items-center">
            {ICON_BUTTON_ERR_HIERARCHIES.map((h) => (
              <IconButtonError key={h} hierarchy={h} size="large" icon={<Icon name="delete" />} aria-label={h} />
            ))}
          </div>
        </section>

        <section id="ib-err-states" className="mb-12">
          <SectionTitle>States</SectionTitle>
          <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
            <RowHeader>Default</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_ERR_HIERARCHIES.map((h) => (
                <IconButtonError key={h} hierarchy={h} icon={<Icon name="delete" />} aria-label={`${h} default`} />
              ))}
            </div>
            <RowHeader>Disabled</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_ERR_HIERARCHIES.map((h) => (
                <IconButtonError key={h} hierarchy={h} disabled icon={<Icon name="delete" />} aria-label={`${h} disabled`} />
              ))}
            </div>
            <RowHeader>Loading</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {ICON_BUTTON_ERR_HIERARCHIES.map((h) => (
                <IconButtonError key={h} hierarchy={h} loading icon={<Icon name="delete" />} aria-label={`${h} loading`} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
