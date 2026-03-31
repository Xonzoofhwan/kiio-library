import { useState } from 'react'
import {
  ChipUniversal,
  CHIP_UNIVERSAL_SIZES,
} from '@/components/Chip'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const CHIP_TOC: TocEntry[] = [
  { id: 'chip-universal', label: 'ChipUniversal' },
  { id: 'chip-universal-selected', label: 'Selected (Interactive)' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function ChipShowcase() {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(['tag2']))

  const toggleTag = (id: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Chip.Universal</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Toggle/trigger chip for filters, selections, and dropdown triggers. Supports selected state, icons, and badge.
        </p>
      </div>

      {/* ─── ChipUniversal ──────────────────────────────────────── */}
      <section id="chip-universal" className="mb-12">
        <SectionTitle>ChipUniversal</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-6 items-center">
          {CHIP_UNIVERSAL_SIZES.map((size) => (
            <div key={size} className="contents">
              <RowHeader>{size}</RowHeader>
              <div className="flex flex-wrap gap-3 items-center">
                <ChipUniversal size={size} iconLeading={<Icon name="tune" />}>Filter</ChipUniversal>
                <ChipUniversal size={size} iconTrailing={<Icon name="expand_more" />}>Category</ChipUniversal>
                <ChipUniversal size={size} iconLeading={<Icon name="tune" />} iconTrailing={<Icon name="expand_more" />}>Options</ChipUniversal>
                <ChipUniversal size={size} badge="3">Updates</ChipUniversal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ChipUniversal Selected ───────────────────────────── */}
      <section id="chip-universal-selected" className="mb-12">
        <SectionTitle>Selected (Interactive)</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          {['tag1', 'tag2', 'tag3', 'tag4'].map((id, i) => (
            <ChipUniversal
              key={id}
              selected={selectedTags.has(id)}
              onClick={() => toggleTag(id)}
              iconLeading={<Icon name={['tune', 'filter_list', 'sort', 'star'][i]} />}
            >
              {['Filter', 'Sort', 'Order', 'Favorites'][i]}
            </ChipUniversal>
          ))}
        </div>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mt-3">
          Selected: {Array.from(selectedTags).join(', ') || 'none'}
        </p>
      </section>
    </div>
  )
}
