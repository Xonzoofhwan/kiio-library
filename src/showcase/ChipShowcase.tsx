import { useState } from 'react'
import {
  ChipUniversal,
  CHIP_UNIVERSAL_SIZES,
  CHIP_UNIVERSAL_PURPOSES,
} from '@/components/Chip'
import type { ChipUniversalProps, ChipUniversalPurpose } from '@/components/Chip'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const CHIP_TOC: TocEntry[] = [
  { id: 'chip-universal', label: 'ChipUniversal' },
  { id: 'chip-universal-selected', label: 'Selected (Interactive)' },
  { id: 'chip-universal-purpose', label: 'Purpose (a11y)' },
  { id: 'chip-universal-aschild', label: 'asChild' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function ChipShowcase() {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(['tag2']))
  const [triggerOpen, setTriggerOpen] = useState(false)

  const toggleTag = (id: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // 용도별 데모. 값 목록의 출처는 언제나 as const 배열이므로, 배열을 돌면서 이 표에서 props 를 꺼낸다.
  const purposeDemo: Record<ChipUniversalPurpose, { note: string; props: ChipUniversalProps }> = {
    toggle: {
      note: 'aria-pressed — 눌린 상태를 알린다',
      props: {
        selected: selectedTags.has('tag1'),
        onClick: () => toggleTag('tag1'),
        iconLeading: <Icon name="tune" />,
        children: 'Filter',
      },
    },
    trigger: {
      note: 'aria-expanded + aria-haspopup — 팝업이 열려 있음을 알린다',
      props: {
        selected: triggerOpen,
        onClick: () => setTriggerOpen((open) => !open),
        iconTrailing: <Icon name="expand_more" />,
        children: 'Category',
      },
    },
    action: {
      note: '상태 속성 없음 — 한 번 실행되는 동작이나 asChild 링크에 쓴다',
      props: { iconLeading: <Icon name="refresh" />, children: 'Reset' },
    },
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Chip.Universal</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Toggle/trigger chip for filters, selections, and dropdown triggers. Supports selected state, icons, and a corner badge label.
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
                <ChipUniversal size={size} badgeLabel="3">Updates</ChipUniversal>
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

      {/* ─── Purpose (a11y) ──────────────────────────────────────── */}
      <section id="chip-universal-purpose" className="mb-12">
        <SectionTitle>Purpose (a11y)</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-6 items-center">
          {CHIP_UNIVERSAL_PURPOSES.map((purpose) => (
            <div key={purpose} className="contents">
              <RowHeader>{purpose}</RowHeader>
              <div className="flex flex-wrap gap-3 items-center">
                <ChipUniversal purpose={purpose} {...purposeDemo[purpose].props} />
                <span className="typography-13-regular text-semantic-text-on-bright-400">
                  {purposeDemo[purpose].note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── asChild ─────────────────────────────────────────────── */}
      <section id="chip-universal-aschild" className="mb-12">
        <SectionTitle>asChild</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          <ChipUniversal asChild purpose="action" iconLeading={<Icon name="link" />}>
            <a href="#chip-universal">Anchor chip</a>
          </ChipUniversal>
          <ChipUniversal asChild purpose="action" selected size="medium" iconTrailing={<Icon name="arrow_outward" />}>
            <a href="#chip-universal-selected">Selected anchor</a>
          </ChipUniversal>
        </div>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mt-3">
          자식은 단일 엘리먼트여야 한다. 이 경로에는 콘텐츠 래퍼가 없어 간격이 루트 gap 하나로 통일되고,
          link 는 aria-pressed 를 허용하지 않으므로 purpose=&quot;action&quot; 을 함께 쓴다.
        </p>
      </section>
    </div>
  )
}
