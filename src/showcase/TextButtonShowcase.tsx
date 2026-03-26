import { TextButton, TEXT_BUTTON_COLORS, TEXT_BUTTON_SIZES } from '@/components/TextButton'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const TEXT_BUTTON_TOC: TocEntry[] = [
  { id: 'tb-color-size', label: 'Color × Size' },
  { id: 'tb-states', label: 'States' },
  { id: 'tb-on-dim', label: 'On-dim Surface' },
  { id: 'tb-icons', label: 'Icons' },
  { id: 'tb-loading', label: 'Loading' },
  { id: 'tb-full-width', label: 'Full Width' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function TextButtonShowcase() {
  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">TextButton</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Background-less text button with color-only state transitions.
        </p>
      </div>

      {/* ─── Color × Size ────────────────────────────────────── */}
      <section id="tb-color-size" className="mb-12">
        <SectionTitle>Color × Size</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {TEXT_BUTTON_COLORS.map((color) => (
            <div key={color} className="contents">
              <RowHeader>{color}</RowHeader>
              <div className="flex flex-wrap gap-4 items-end">
                {TEXT_BUTTON_SIZES.map((size) => (
                  <TextButton key={size} color={color} size={size}>
                    {size}
                  </TextButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── States ──────────────────────────────────────────── */}
      <section id="tb-states" className="mb-12">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {/* Default — interactive */}
          <RowHeader>default</RowHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" size="large">Neutral</TextButton>
            <TextButton color="blue" size="large">Blue</TextButton>
          </div>

          {/* Disabled */}
          <RowHeader>disabled</RowHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" size="large" disabled>Neutral</TextButton>
            <TextButton color="blue" size="large" disabled>Blue</TextButton>
          </div>

          {/* Loading */}
          <RowHeader>loading</RowHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" size="large" loading>Neutral</TextButton>
            <TextButton color="blue" size="large" loading>Blue</TextButton>
          </div>
        </div>
      </section>

      {/* ─── On-dim Surface ──────────────────────────────────── */}
      <section id="tb-on-dim" className="mb-12">
        <SectionTitle>On-dim Surface</SectionTitle>
        <div className="bg-semantic-neutral-solid-950 rounded-3 p-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-end">
            {TEXT_BUTTON_SIZES.map((size) => (
              <TextButton key={size} color="neutral" size={size} onDim>
                {size}
              </TextButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            {TEXT_BUTTON_SIZES.map((size) => (
              <TextButton key={size} color="blue" size={size} onDim>
                {size}
              </TextButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" onDim disabled>Disabled</TextButton>
            <TextButton color="blue" onDim disabled>Disabled</TextButton>
          </div>
        </div>
      </section>

      {/* ─── Icons ───────────────────────────────────────────── */}
      <section id="tb-icons" className="mb-12">
        <SectionTitle>Icons</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          <RowHeader>leading</RowHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" size="large" iconLeading={<Icon name="chevron_left" />}>Back</TextButton>
            <TextButton color="blue" size="large" iconLeading={<Icon name="add" />}>Add item</TextButton>
          </div>

          <RowHeader>trailing</RowHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" size="large" iconTrailing={<Icon name="chevron_right" />}>Next</TextButton>
            <TextButton color="blue" size="large" iconTrailing={<Icon name="favorite" />}>Favorite</TextButton>
          </div>

          <RowHeader>both</RowHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <TextButton color="neutral" size="large" iconLeading={<Icon name="chevron_left" />} iconTrailing={<Icon name="chevron_right" />}>Navigate</TextButton>
            <TextButton color="blue" size="large" iconLeading={<Icon name="add" />} iconTrailing={<Icon name="arrow_forward" />}>Create</TextButton>
          </div>

          <RowHeader>per size</RowHeader>
          <div className="flex flex-wrap gap-4 items-end">
            {TEXT_BUTTON_SIZES.map((size) => (
              <TextButton key={size} color="neutral" size={size} iconLeading={<Icon name="chevron_left" />} iconTrailing={<Icon name="chevron_right" />}>
                Button
              </TextButton>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Loading ─────────────────────────────────────────── */}
      <section id="tb-loading" className="mb-12">
        <SectionTitle>Loading</SectionTitle>
        <div className="flex flex-wrap gap-4 items-end">
          {TEXT_BUTTON_SIZES.map((size) => (
            <TextButton key={size} size={size} loading iconLeading={<Icon name="chevron_left" />} iconTrailing={<Icon name="chevron_right" />}>
              Button
            </TextButton>
          ))}
        </div>
      </section>

      {/* ─── Full Width ──────────────────────────────────────── */}
      <section id="tb-full-width" className="mb-12">
        <SectionTitle>Full Width</SectionTitle>
        <div className="flex flex-col gap-3 w-80">
          <TextButton color="neutral" size="large" fullWidth>Full width neutral</TextButton>
          <TextButton color="blue" size="large" fullWidth>Full width blue</TextButton>
        </div>
      </section>
    </div>
  )
}
