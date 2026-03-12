import { useState } from 'react'
import { ChipTag, ChipFilter, ChipDropdown } from '@/components/Chip'
import { CHIP_SIZES, CHIP_TAG_INTENTS, CHIP_FILTER_INTENTS, CHIP_DROPDOWN_INTENTS } from '@/components/Chip'
import type { ChipTagIntent, ChipFilterIntent, ChipDropdownIntent } from '@/components/Chip'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, ColHeader, RowHeader, FilterIcon, CategoryIcon } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const CHIP_TOC: TocEntry[] = [
  { id: 'component-chip',             label: 'Chip',                     level: 1 },
  { id: 'chip-tag',                   label: 'ChipTag'                            },
  { id: 'chip-tag-intent-size',       label: 'Intent × Size'                      },
  { id: 'chip-tag-interactive',       label: 'Interactive'                        },
  { id: 'chip-filter',                label: 'ChipFilter'                         },
  { id: 'chip-filter-intent-size',    label: 'Intent × Size'                      },
  { id: 'chip-filter-leading-icon',   label: 'With Leading Icon'                  },
  { id: 'chip-dropdown',              label: 'ChipDropdown'                       },
  { id: 'chip-dropdown-selection',    label: 'Selection state × Intent × Size'    },
  { id: 'chip-dropdown-interactive',  label: 'Interactive'                        },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function ChipShowcase() {
  const [filterStates, setFilterStates] = useState<Record<string, boolean>>({})
  const [ddOpen, setDdOpen] = useState<Record<string, boolean>>({})
  const [ddSelections, setDdSelections] = useState<Record<string, number>>({})
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design System', 'Tailwind'])

  const toggleFilter = (key: string) =>
    setFilterStates(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleDdOpen = (key: string) =>
    setDdOpen(prev => ({ ...prev, [key]: !prev[key] }))
  const addSelection = (key: string) =>
    setDdSelections(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  const removeSelection = (key: string) =>
    setDdSelections(prev => ({ ...prev, [key]: Math.max(0, (prev[key] ?? 0) - 1) }))

  return (
    <>
      <h1 id="component-chip" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        Chip
      </h1>

      {/* ══════════════════ ChipTag ══════════════════ */}
      <h2 id="chip-tag" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        ChipTag
      </h2>

      <section id="chip-tag-intent-size" className="mb-10 scroll-mt-6">
        <SectionTitle>Intent × Size</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(3,1fr)] gap-x-4 gap-y-0">
          <div />
          {CHIP_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {(CHIP_TAG_INTENTS as readonly ChipTagIntent[]).map(intent => (
            <>
              <RowHeader key={`rh-tag-${intent}`}>{intent}</RowHeader>
              {CHIP_SIZES.map(size => (
                <div key={`tag-${intent}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <ChipTag label="Label" onRemove={() => {}} size={size} intent={intent} />
                </div>
              ))}
            </>
          ))}

          <RowHeader>disabled</RowHeader>
          {CHIP_SIZES.map(size => (
            <div key={`tag-disabled-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <ChipTag label="Label" onRemove={() => {}} size={size} disabled />
            </div>
          ))}
        </div>
      </section>

      <section id="chip-tag-interactive" className="mb-12 scroll-mt-6">
        <SectionTitle>Interactive (remove to delete)</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <ChipTag
              key={tag}
              label={tag}
              onRemove={() => setTags(prev => prev.filter(t => t !== tag))}
            />
          ))}
          {tags.length === 0 && (
            <span className="typography-13-regular text-semantic-text-on-bright-400">
              All tags removed. Refresh to reset.
            </span>
          )}
        </div>
      </section>

      {/* ══════════════════ ChipFilter ══════════════════ */}
      <h2 id="chip-filter" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        ChipFilter
      </h2>

      <section id="chip-filter-intent-size" className="mb-10 scroll-mt-6">
        <SectionTitle>Intent × Size (toggle to switch on/off)</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(3,1fr)] gap-x-4 gap-y-0">
          <div />
          {CHIP_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {(CHIP_FILTER_INTENTS as readonly ChipFilterIntent[]).map(intent => (
            <>
              <RowHeader key={`rh-filter-${intent}`}>{intent}</RowHeader>
              {CHIP_SIZES.map(size => {
                const key = `filter-${intent}-${size}`
                return (
                  <div key={key} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                    <ChipFilter
                      label="Filter"
                      selected={!!filterStates[key]}
                      onToggle={() => toggleFilter(key)}
                      size={size}
                      intent={intent}
                    />
                  </div>
                )
              })}
            </>
          ))}

          <RowHeader>dis. off</RowHeader>
          {CHIP_SIZES.map(size => (
            <div key={`filter-dis-off-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <ChipFilter label="Filter" selected={false} onToggle={() => {}} size={size} disabled />
            </div>
          ))}

          <RowHeader>dis. on</RowHeader>
          {CHIP_SIZES.map(size => (
            <div key={`filter-dis-on-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <ChipFilter label="Filter" selected onToggle={() => {}} size={size} disabled />
            </div>
          ))}
        </div>
      </section>

      <section id="chip-filter-leading-icon" className="mb-12 scroll-mt-6">
        <SectionTitle>With Leading Icon</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {(CHIP_FILTER_INTENTS as readonly ChipFilterIntent[]).map(intent => {
            const key = `filter-icon-${intent}`
            return (
              <ChipFilter
                key={key}
                label={intent}
                selected={!!filterStates[key]}
                onToggle={() => toggleFilter(key)}
                intent={intent}
                leadingIcon={<FilterIcon />}
              />
            )
          })}
        </div>
      </section>

      {/* ══════════════════ ChipDropdown ══════════════════ */}
      <h2 id="chip-dropdown" className="typography-20-semibold text-semantic-text-on-bright-800 mb-4 scroll-mt-6">
        ChipDropdown
      </h2>

      <section id="chip-dropdown-selection" className="mb-10 scroll-mt-6">
        <SectionTitle>Selection state × Intent × Size</SectionTitle>
        <div className="grid grid-cols-[100px_repeat(3,1fr)] gap-x-4 gap-y-0">
          <div />
          {CHIP_SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

          {(CHIP_DROPDOWN_INTENTS as readonly ChipDropdownIntent[]).map(intent => (
            <>
              <RowHeader key={`rh-dd-off-${intent}`}>{intent} / off</RowHeader>
              {CHIP_SIZES.map(size => (
                <div key={`dd-off-${intent}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <ChipDropdown label="Category" open={false} onOpenChange={() => {}} size={size} intent={intent} badgeCount={0} />
                </div>
              ))}

              <RowHeader key={`rh-dd-on-${intent}`}>{intent} / on</RowHeader>
              {CHIP_SIZES.map(size => (
                <div key={`dd-on-${intent}-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
                  <ChipDropdown label="Category" open={false} onOpenChange={() => {}} size={size} intent={intent} badgeCount={3} />
                </div>
              ))}
            </>
          ))}

          <RowHeader>dis. off</RowHeader>
          {CHIP_SIZES.map(size => (
            <div key={`dd-dis-off-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <ChipDropdown label="Category" open={false} onOpenChange={() => {}} size={size} badgeCount={0} disabled />
            </div>
          ))}

          <RowHeader>dis. on</RowHeader>
          {CHIP_SIZES.map(size => (
            <div key={`dd-dis-on-${size}`} className="flex justify-center py-3 border-t border-semantic-divider-solid-50">
              <ChipDropdown label="Category" open={false} onOpenChange={() => {}} size={size} badgeCount={3} disabled />
            </div>
          ))}
        </div>
      </section>

      <section id="chip-dropdown-interactive" className="mb-12 scroll-mt-6">
        <SectionTitle>Interactive (+ / − to add/remove selections)</SectionTitle>
        <div className="flex flex-wrap gap-6">
          {(CHIP_DROPDOWN_INTENTS as readonly ChipDropdownIntent[]).map(intent => {
            const key = `dd-interactive-${intent}`
            const count = ddSelections[key] ?? 0
            return (
              <div key={key} className="flex items-center gap-2">
                <ChipDropdown
                  label={intent}
                  open={!!ddOpen[key]}
                  onOpenChange={() => toggleDdOpen(key)}
                  intent={intent}
                  leadingIcon={<CategoryIcon />}
                  badgeCount={count}
                />
                <button
                  type="button"
                  onClick={() => removeSelection(key)}
                  className="w-6 h-6 rounded-full bg-semantic-neutral-solid-100 typography-13-semibold text-semantic-text-on-bright-700 flex items-center justify-center hover:bg-semantic-neutral-solid-200"
                >−</button>
                <button
                  type="button"
                  onClick={() => addSelection(key)}
                  className="w-6 h-6 rounded-full bg-semantic-neutral-solid-100 typography-13-semibold text-semantic-text-on-bright-700 flex items-center justify-center hover:bg-semantic-neutral-solid-200"
                >+</button>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
