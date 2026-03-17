import { useState, useContext } from 'react'
import { ChipTag, ChipFilter, ChipDropdown } from '@/components/Chip'
import { CHIP_SIZES, CHIP_TAG_INTENTS, CHIP_FILTER_INTENTS, CHIP_DROPDOWN_INTENTS } from '@/components/Chip'
import type { ChipTagIntent, ChipFilterIntent, ChipDropdownIntent, ChipSize } from '@/components/Chip'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, RowHeader, FilterIcon, CategoryIcon } from './shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  PropsTable,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
} from './showcase-blocks'
import { extractHeader, extractSubComponentProps } from './spec-utils'
import chipSpec from '../../specs/chip.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(chipSpec)
const subComponentProps = extractSubComponentProps(chipSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    intent:   { kind: 'select', options: CHIP_FILTER_INTENTS },
    size:     { kind: 'select', options: CHIP_SIZES },
    selected: { kind: 'boolean' },
    disabled: { kind: 'boolean' },
  },
  defaults: {
    intent: 'grayscale',
    size: 'medium',
    selected: false,
    disabled: false,
  },
  render: (props) => (
    <ChipFilter
      label="Filter"
      intent={props.intent as ChipFilterIntent}
      size={props.size as ChipSize}
      selected={props.selected as boolean}
      disabled={props.disabled as boolean}
      onToggle={() => {}}
    />
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Displaying categorical tags or labels (ChipTag)',
    'Multi-select filtering from predefined options (ChipFilter)',
    'Dropdown-triggered filter selection (ChipDropdown)',
  ],
  dontUse: [
    { text: 'Primary action trigger', alternative: 'button', alternativeLabel: 'Button' },
    { text: 'Binary toggle state', alternative: 'switch', alternativeLabel: 'Switch' },
    { text: 'Status indication without interaction', alternative: 'badge', alternativeLabel: 'Badge' },
  ],
  related: [
    { id: 'badge', label: 'Badge' },
    { id: 'switch', label: 'Switch' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'ChipTag usage',
    code: `<ChipTag
  label="React"
  intent="grayscale"
  size="medium"
  onRemove={() => removeTag('React')}
/>

<ChipTag label="Error" intent="error" onRemove={handleRemove} />`,
  },
  {
    title: 'ChipFilter (selected state)',
    code: `const [selected, setSelected] = useState(false)

<ChipFilter
  label="Active"
  intent="brand"
  selected={selected}
  onToggle={setSelected}
/>`,
    description: 'ChipFilter is a controlled toggle button with aria-pressed. Off state uses neutral background, on state uses intent-specific container.',
  },
  {
    title: 'ChipDropdown',
    code: `const [open, setOpen] = useState(false)
const [count, setCount] = useState(0)

<ChipDropdown
  label="Category"
  open={open}
  onOpenChange={setOpen}
  badgeCount={count}
  leadingIcon={<CategoryIcon />}
/>`,
    description: 'ChipDropdown shows a badge counter when badgeCount >= 1. Pair with a Popover or Menu for the dropdown content.',
  },
  {
    title: 'Chip group pattern',
    code: `const [filters, setFilters] = useState<Set<string>>(new Set())

const toggle = (key: string) =>
  setFilters(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

<div className="flex flex-wrap gap-2">
  {['Design', 'Dev', 'QA'].map(label => (
    <ChipFilter
      key={label}
      label={label}
      selected={filters.has(label)}
      onToggle={() => toggle(label)}
    />
  ))}
</div>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-chip-height-sm', value: '24px' },
      { name: '--comp-chip-height-md', value: '32px' },
      { name: '--comp-chip-height-lg', value: '40px' },
      { name: '--comp-chip-padding-h-sm', value: '6px' },
      { name: '--comp-chip-padding-h-md', value: '8px' },
      { name: '--comp-chip-padding-h-lg', value: '10px' },
      { name: '--comp-chip-gap-sm', value: '2px' },
      { name: '--comp-chip-gap-md', value: '2px' },
      { name: '--comp-chip-gap-lg', value: '4px' },
      { name: '--comp-chip-icon-sm', value: '16px' },
      { name: '--comp-chip-icon-md', value: '18px' },
      { name: '--comp-chip-icon-lg', value: '20px' },
      { name: '--comp-chip-label-px-sm', value: '2px' },
      { name: '--comp-chip-label-px-md', value: '4px' },
      { name: '--comp-chip-label-px-lg', value: '4px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const CHIP_TOC: TocEntry[] = [
  { id: 'component-chip',             label: 'Chip',                           level: 1 },
  { id: 'chip-playground',            label: 'Playground'                               },
  { id: 'chip-anatomy',               label: 'Anatomy'                                  },
  { id: 'chip-tag',                   label: 'ChipTag'                                  },
  { id: 'chip-tag-intent-size',       label: 'Intent \u00d7 Size'                       },
  { id: 'chip-tag-interactive',       label: 'Interactive'                               },
  { id: 'chip-filter',                label: 'ChipFilter'                               },
  { id: 'chip-filter-intent-size',    label: 'Intent \u00d7 Size'                       },
  { id: 'chip-filter-leading-icon',   label: 'With Leading Icon'                        },
  { id: 'chip-dropdown',              label: 'ChipDropdown'                             },
  { id: 'chip-dropdown-selection',    label: 'Selection state \u00d7 Intent \u00d7 Size' },
  { id: 'chip-dropdown-interactive',  label: 'Interactive'                               },
  { id: 'chip-usage',                 label: 'Usage Guidelines'                          },
  { id: 'chip-props',                 label: 'Props'                                     },
  { id: 'chip-code',                  label: 'Code Examples'                             },
  { id: 'chip-tokens',                label: 'Design Tokens'                             },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function ChipShowcase() {
  const navigate = useContext(NavigateContext)
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
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-chip"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground (ChipFilter) */}
      <ShowcaseSection id="chip-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="chip-anatomy"
        title="Anatomy"
        description="Chip system has 3 sub-components sharing common size tokens. Each has its own color maps and interaction model."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`ChipTag (div role="group")
\u251c\u2500\u2500 label          \u2014 text content
\u251c\u2500\u2500 removeButton   \u2014 close icon button
\u2514\u2500\u2500 state overlay  \u2014 sibling <span>, group-hover / group-active

ChipFilter (button type="button")
\u251c\u2500\u2500 leadingIcon?   \u2014 ReactNode, sized by chip size
\u251c\u2500\u2500 label          \u2014 text content
\u2514\u2500\u2500 state overlay  \u2014 on-bright (off) / on-dim (on)

ChipDropdown (button type="button")
\u251c\u2500\u2500 leadingIcon?   \u2014 ReactNode, sized by chip size
\u251c\u2500\u2500 label          \u2014 text content
\u251c\u2500\u2500 chevron        \u2014 trailing dropdown indicator
\u251c\u2500\u2500 badgeCounter   \u2014 absolute positioned, shows count
\u2514\u2500\u2500 state overlay  \u2014 on-bright (off) / on-dim (on)`}
        </pre>
      </ShowcaseSection>

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

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="chip-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-component props) */}
      <ShowcaseSection id="chip-props" title="Props">
        {subComponentProps.map(sub => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="chip-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="chip-tokens"
        title="Design Tokens"
        description="Size and spacing tokens are theme-agnostic (:root). Color tokens switch by theme via [data-theme]."
      >
        <TokensReference groups={sizeTokenGroups} />
      </ShowcaseSection>
    </>
  )
}
