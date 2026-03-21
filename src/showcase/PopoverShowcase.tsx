import { useContext } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  POPOVER_SIDES,
  POPOVER_ALIGNS,
} from '@/components/Popover'
import type { PopoverSide, PopoverAlign } from '@/components/Popover'
import { Button } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from './shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
} from './showcase-blocks'
import { extractHeader } from './spec-utils'
import popoverSpec from '../../specs/popover.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(popoverSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    side:      { kind: 'select', options: POPOVER_SIDES },
    align:     { kind: 'select', options: POPOVER_ALIGNS },
    showArrow: { kind: 'select', options: ['false', 'true'] as const },
  },
  defaults: {
    side: 'bottom',
    align: 'center',
    showArrow: 'false',
  },
  render: (props) => (
    <Popover>
      <PopoverTrigger>
        <Button variant="outlined" size="medium">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent
        side={props.side as PopoverSide}
        align={props.align as PopoverAlign}
        showArrow={props.showArrow === 'true'}
      >
        <div className="flex flex-col gap-2 w-56">
          <span className="typography-14-semibold text-semantic-text-on-bright-900">Popover Title</span>
          <span className="typography-13-regular text-semantic-text-on-bright-600">
            This is a generic popover. You can put any content here — forms, filters, pickers, etc.
          </span>
          <PopoverClose>
            <Button variant="ghost" size="small" className="self-end mt-1">Close</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Rich interactive content anchored to a trigger (date pickers, color pickers, filter panels)',
    'Mini forms or settings panels that don\'t warrant a full Dialog',
    'Supplementary content that should dismiss on click-outside',
  ],
  dontUse: [
    { text: 'Action menus — use DropdownMenu', alternative: 'dropdown-menu', alternativeLabel: 'DropdownMenu' },
    { text: 'Confirmation dialogs — use Dialog', alternative: 'dialog', alternativeLabel: 'Dialog' },
    { text: 'Simple text hints — use Tooltip', alternative: 'tooltip', alternativeLabel: 'Tooltip' },
  ],
  related: [
    { id: 'dropdown-menu', label: 'DropdownMenu' },
    { id: 'dialog', label: 'Dialog' },
    { id: 'tooltip', label: 'Tooltip' },
    { id: 'callout', label: 'Callout' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Popover>
  <PopoverTrigger>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content here</p>
  </PopoverContent>
</Popover>`,
  },
  {
    title: 'With arrow and close',
    code: `<Popover>
  <PopoverTrigger>
    <Button>Settings</Button>
  </PopoverTrigger>
  <PopoverContent showArrow side="bottom" align="start">
    <div className="flex flex-col gap-2">
      <span>Settings panel</span>
      <PopoverClose>
        <Button size="small">Done</Button>
      </PopoverClose>
    </div>
  </PopoverContent>
</Popover>`,
  },
  {
    title: 'Controlled',
    code: `const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger>
    <Button>Toggle</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Controlled popover</p>
  </PopoverContent>
</Popover>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-popover-radius', value: '12px' },
      { name: '--comp-popover-padding-x', value: '16px' },
      { name: '--comp-popover-padding-y', value: '12px' },
      { name: '--comp-popover-arrow-width', value: '16px' },
      { name: '--comp-popover-arrow-height', value: '8px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-popover-bg', value: 'semantic-background-0' },
      { name: '--comp-popover-border', value: 'semantic-divider-solid-100' },
      { name: '--comp-popover-arrow', value: 'semantic-background-0' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const POPOVER_TOC: TocEntry[] = [
  { id: 'component-popover',       label: 'Popover',            level: 1 },
  { id: 'popover-playground',      label: 'Playground'                   },
  { id: 'popover-sides',           label: 'Side Positions'               },
  { id: 'popover-arrow',           label: 'With Arrow'                   },
  { id: 'popover-content',         label: 'Rich Content'                 },
  { id: 'popover-usage',           label: 'Usage Guidelines'             },
  { id: 'popover-code',            label: 'Code Examples'                },
  { id: 'popover-tokens',          label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function PopoverShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-popover"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="popover-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Side Positions */}
      <section id="popover-sides" className="mb-10 scroll-mt-6">
        <SectionTitle>Side Positions</SectionTitle>
        <div className="flex flex-wrap gap-4 justify-center py-16">
          {POPOVER_SIDES.map(side => (
            <Popover key={side}>
              <PopoverTrigger>
                <Button variant="outlined" size="small">{side}</Button>
              </PopoverTrigger>
              <PopoverContent side={side} align="center">
                <span className="typography-13-regular text-semantic-text-on-bright-600 whitespace-nowrap">
                  side="{side}"
                </span>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </section>

      {/* 4. With Arrow */}
      <section id="popover-arrow" className="mb-10 scroll-mt-6">
        <SectionTitle>With Arrow</SectionTitle>
        <div className="flex flex-wrap gap-4 justify-center py-8">
          {(['bottom', 'top', 'right'] as const).map(side => (
            <Popover key={side}>
              <PopoverTrigger>
                <Button variant="outlined" size="small">{side} + arrow</Button>
              </PopoverTrigger>
              <PopoverContent side={side} showArrow>
                <span className="typography-13-regular text-semantic-text-on-bright-600 whitespace-nowrap">
                  Arrow points to trigger
                </span>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </section>

      {/* 5. Rich Content */}
      <section id="popover-content" className="mb-10 scroll-mt-6">
        <SectionTitle>Rich Content</SectionTitle>
        <div className="flex gap-4 justify-center py-8">
          <Popover>
            <PopoverTrigger>
              <Button variant="secondary" size="medium">Filter</Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start">
              <div className="flex flex-col gap-3 w-64">
                <span className="typography-14-semibold text-semantic-text-on-bright-900">Filters</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 typography-13-regular text-semantic-text-on-bright-700">
                    <input type="checkbox" defaultChecked /> Active items
                  </label>
                  <label className="flex items-center gap-2 typography-13-regular text-semantic-text-on-bright-700">
                    <input type="checkbox" /> Archived items
                  </label>
                  <label className="flex items-center gap-2 typography-13-regular text-semantic-text-on-bright-700">
                    <input type="checkbox" /> Draft items
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-semantic-divider-solid-50">
                  <PopoverClose>
                    <Button variant="ghost" size="small">Reset</Button>
                  </PopoverClose>
                  <PopoverClose>
                    <Button variant="primary" size="small">Apply</Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* 6. Usage Guidelines */}
      <ShowcaseSection id="popover-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="popover-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="popover-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Color tokens switch per theme. Reuses DropdownMenu-style container."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
