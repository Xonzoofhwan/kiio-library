import { Button, BUTTON_HIERARCHIES, BUTTON_SIZES, BUTTON_SHAPES } from '@/components/Button'
import { ButtonEmphasized, BUTTON_EMP_HIERARCHIES, BUTTON_EMP_COLORS } from '@/components/Button'
import { ButtonError, BUTTON_ERR_HIERARCHIES } from '@/components/Button'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const BUTTON_TOC: TocEntry[] = [
  { id: 'button-hierarchy', label: 'Hierarchy' },
  { id: 'button-sizes', label: 'Sizes' },
  { id: 'button-shapes', label: 'Shapes' },
  { id: 'button-states', label: 'States' },
  { id: 'button-width', label: 'Width' },
  { id: 'button-icons', label: 'Icons' },
  { id: 'button-emphasized', label: 'Emphasized' },
  { id: 'button-emp-colors', label: 'Emp. Colors' },
  { id: 'button-emp-states', label: 'Emp. States' },
  { id: 'button-error', label: 'Error' },
  { id: 'button-err-states', label: 'Err. States' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function ButtonShowcase() {
  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Button</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Universal and Emphasized intent buttons.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════
         UNIVERSAL
         ════════════════════════════════════════════════════════════ */}

      <div>
        <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Universal</h2>

        {/* ─── Hierarchy ──────────────────────────────────────────── */}
        <section id="button-hierarchy" className="mb-12">
          <SectionTitle>Hierarchy</SectionTitle>
          <div className="flex flex-wrap gap-3 items-center">
            {BUTTON_HIERARCHIES.map((h) => (
              <Button key={h} hierarchy={h} size="large">{h}</Button>
            ))}
          </div>
        </section>

        {/* ─── Sizes ──────────────────────────────────────────────── */}
        <section id="button-sizes" className="mb-12">
          <SectionTitle>Sizes</SectionTitle>
          <div className="flex flex-wrap gap-3 items-end">
            {BUTTON_SIZES.map((s) => (
              <Button key={s} size={s}>{s}</Button>
            ))}
          </div>
        </section>

        {/* ─── Shapes ─────────────────────────────────────────────── */}
        <section id="button-shapes" className="mb-12">
          <SectionTitle>Shapes</SectionTitle>
          <div className="flex flex-wrap gap-6">
            {BUTTON_SHAPES.map((shape) => (
              <div key={shape} className="flex flex-col items-center gap-2">
                <ColHeader>{shape}</ColHeader>
                <Button shape={shape} size="large">Button</Button>
              </div>
            ))}
          </div>
        </section>

        {/* ─── States ─────────────────────────────────────────────── */}
        <section id="button-states" className="mb-12">
          <SectionTitle>States</SectionTitle>
          <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
            <RowHeader>Default</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_HIERARCHIES.map((h) => (
                <Button key={h} hierarchy={h}>{h}</Button>
              ))}
            </div>
            <RowHeader>Disabled</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_HIERARCHIES.map((h) => (
                <Button key={h} hierarchy={h} disabled>{h}</Button>
              ))}
            </div>
            <RowHeader>Loading</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_HIERARCHIES.map((h) => (
                <Button key={h} hierarchy={h} loading>{h}</Button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Width ──────────────────────────────────────────────── */}
        <section id="button-width" className="mb-12">
          <SectionTitle>Width</SectionTitle>
          <div className="flex flex-col gap-3 max-w-[400px]">
            <Button>Hug (default)</Button>
            <Button fullWidth>Fill (fullWidth)</Button>
          </div>
        </section>

        {/* ─── Icons ──────────────────────────────────────────────── */}
        <section id="button-icons" className="mb-12">
          <SectionTitle>Icons</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Button iconLeading={<Icon name="search" />}>Search</Button>
              <Button iconTrailing={<Icon name="arrow_forward" />}>Next</Button>
              <Button iconLeading={<Icon name="add" />} iconTrailing={<Icon name="arrow_drop_down" />}>Create</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-end">
              {BUTTON_SIZES.map((s) => (
                <Button key={s} size={s} iconLeading={<Icon name="settings" />}>{s}</Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button hierarchy="primary" iconLeading={<Icon name="download" />}>Download</Button>
              <Button hierarchy="secondary" iconLeading={<Icon name="share" />}>Share</Button>
              <Button hierarchy="outlined" iconLeading={<Icon name="edit" />}>Edit</Button>
              <Button hierarchy="ghost" iconLeading={<Icon name="delete" />}>Delete</Button>
            </div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════
         EMPHASIZED
         ════════════════════════════════════════════════════════════ */}

      <div>
        <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Emphasized</h2>

        {/* ─── Hierarchy ──────────────────────────────────────────── */}
        <section id="button-emphasized" className="mb-12">
          <SectionTitle>Hierarchy</SectionTitle>
          <div className="flex flex-wrap gap-3 items-center">
            {BUTTON_EMP_HIERARCHIES.map((h) => (
              <ButtonEmphasized key={h} hierarchy={h} size="large">{h}</ButtonEmphasized>
            ))}
          </div>
        </section>

        {/* ─── Colors ─────────────────────────────────────────────── */}
        <section id="button-emp-colors" className="mb-12">
          <SectionTitle>Colors</SectionTitle>
          <div className="flex flex-col gap-4">
            {BUTTON_EMP_COLORS.map((color) => (
              <div key={color} className="flex flex-wrap gap-3 items-center">
                <ColHeader>{color}</ColHeader>
                {BUTTON_EMP_HIERARCHIES.map((h) => (
                  <ButtonEmphasized key={h} hierarchy={h} color={color}>{h}</ButtonEmphasized>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ─── States ─────────────────────────────────────────────── */}
        <section id="button-emp-states" className="mb-12">
          <SectionTitle>States</SectionTitle>
          <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
            <RowHeader>Default</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_EMP_HIERARCHIES.map((h) => (
                <ButtonEmphasized key={h} hierarchy={h}>{h}</ButtonEmphasized>
              ))}
            </div>
            <RowHeader>Disabled</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_EMP_HIERARCHIES.map((h) => (
                <ButtonEmphasized key={h} hierarchy={h} disabled>{h}</ButtonEmphasized>
              ))}
            </div>
            <RowHeader>Loading</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_EMP_HIERARCHIES.map((h) => (
                <ButtonEmphasized key={h} hierarchy={h} loading>{h}</ButtonEmphasized>
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

        {/* ─── Hierarchy ──────────────────────────────────────────── */}
        <section id="button-error" className="mb-12">
          <SectionTitle>Hierarchy</SectionTitle>
          <div className="flex flex-wrap gap-3 items-center">
            {BUTTON_ERR_HIERARCHIES.map((h) => (
              <ButtonError key={h} hierarchy={h} size="large">{h}</ButtonError>
            ))}
          </div>
        </section>

        {/* ─── States ─────────────────────────────────────────────── */}
        <section id="button-err-states" className="mb-12">
          <SectionTitle>States</SectionTitle>
          <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
            <RowHeader>Default</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_ERR_HIERARCHIES.map((h) => (
                <ButtonError key={h} hierarchy={h}>{h}</ButtonError>
              ))}
            </div>
            <RowHeader>Disabled</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_ERR_HIERARCHIES.map((h) => (
                <ButtonError key={h} hierarchy={h} disabled>{h}</ButtonError>
              ))}
            </div>
            <RowHeader>Loading</RowHeader>
            <div className="flex gap-3 flex-wrap">
              {BUTTON_ERR_HIERARCHIES.map((h) => (
                <ButtonError key={h} hierarchy={h} loading>{h}</ButtonError>
              ))}
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}
