import { useState, useContext } from 'react'
import { Drawer, DRAWER_SIZES } from '@/components/Drawer'
import { Button } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import type { DrawerSize } from '@/components/Drawer'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from './shared'
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
import drawerSpec from '../../specs/drawer.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(drawerSpec)
const subComponentProps = extractSubComponentProps(drawerSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:       { kind: 'select', options: DRAWER_SIZES },
    hasOverlay: { kind: 'boolean' },
  },
  defaults: {
    size: 'small',
    hasOverlay: true,
  },
  render: (props) => (
    <Drawer size={props.size as DrawerSize} hasOverlay={props.hasOverlay as boolean}>
      <Drawer.Trigger>
        <Button variant="primary" size="medium">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.TopBar>
          <Drawer.CloseButton />
          <span className="flex-1 typography-14-semibold text-semantic-text-on-bright-800 ml-1">
            Playground Drawer
          </span>
        </Drawer.TopBar>
        <Drawer.Body>
          <div className="py-6">
            <h2 className="typography-20-semibold text-semantic-text-on-bright-900 mb-2">
              Drawer Preview
            </h2>
            <p className="typography-14-regular text-semantic-text-on-bright-600">
              Size: {props.size as string} / Overlay: {String(props.hasOverlay)}
            </p>
          </div>
        </Drawer.Body>
        <Drawer.Footer className="flex justify-end">
          <Drawer.Close>
            <Button variant="ghost" size="xLarge">Cancel</Button>
          </Drawer.Close>
          <Drawer.Close>
            <Button variant="primary" size="xLarge">Save</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Side panel for detailed content without losing page context',
    'Settings panels, filters, or navigation menus',
    'Multi-step workflows that supplement main content',
  ],
  dontUse: [
    { text: 'Blocking user for critical decisions', alternative: 'dialog', alternativeLabel: 'Dialog' },
    { text: 'Brief hover information', alternative: 'tooltip', alternativeLabel: 'Tooltip' },
    { text: 'Temporary status messages', alternative: 'toast', alternativeLabel: 'Toast' },
  ],
  related: [
    { id: 'dialog', label: 'Dialog' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Drawer>
  <Drawer.Trigger>
    <Button>Open Drawer</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.TopBar>
      <Drawer.CloseButton />
    </Drawer.TopBar>
    <Drawer.Body>
      <p>Drawer content here.</p>
    </Drawer.Body>
  </Drawer.Content>
</Drawer>`,
  },
  {
    title: 'With size variants',
    code: `<Drawer size="medium">
  <Drawer.Trigger>
    <Button>Medium Drawer</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.TopBar>
      <Drawer.CloseButton />
    </Drawer.TopBar>
    <Drawer.Body>...</Drawer.Body>
    <Drawer.Footer className="flex justify-end">
      <Drawer.Close>
        <Button variant="ghost" size="xLarge">Cancel</Button>
      </Drawer.Close>
      <Drawer.Close>
        <Button variant="primary" size="xLarge">Save</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer>`,
    description: 'Available sizes: xSmall (480px), small (640px), medium (800px), large (custom width).',
  },
  {
    title: 'Without overlay',
    code: `<Drawer hasOverlay={false}>
  <Drawer.Trigger>
    <Button>No Overlay</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.TopBar>
      <Drawer.CloseButton />
    </Drawer.TopBar>
    <Drawer.Body>
      <p>Shadow replaces the overlay for information panels.</p>
    </Drawer.Body>
  </Drawer.Content>
</Drawer>`,
    description: 'When hasOverlay is false, a shadow distinguishes the drawer from the background. Suitable for information viewing.',
  },
  {
    title: 'Controlled',
    code: `const [open, setOpen] = useState(false)

<Drawer open={open} onOpenChange={setOpen} modal={false} hasOverlay={false}>
  <Drawer.Content>
    <Drawer.TopBar>
      <Drawer.CloseButton />
      <span>Non-Modal Drawer</span>
    </Drawer.TopBar>
    <Drawer.Body>
      <p>Background content remains interactive.</p>
    </Drawer.Body>
  </Drawer.Content>
</Drawer>`,
    description: 'Use open and onOpenChange for controlled state. Combine with modal={false} to allow background interaction.',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-drawer-width-xs', value: '480px' },
      { name: '--comp-drawer-width-sm', value: '640px' },
      { name: '--comp-drawer-width-md', value: '800px' },
      { name: '--comp-drawer-margin', value: '40px' },
      { name: '--comp-drawer-topbar-height', value: '44px' },
      { name: '--comp-drawer-topbar-px', value: '16px' },
      { name: '--comp-drawer-px', value: '24px' },
      { name: '--comp-drawer-footer-px', value: '24px' },
      { name: '--comp-drawer-footer-py', value: '16px' },
      { name: '--comp-drawer-footer-gap', value: '8px' },
      { name: '--comp-drawer-topbar-btn-size', value: '40px' },
      { name: '--comp-drawer-topbar-icon-size', value: '24px' },
    ],
  },
  {
    title: 'Shadow',
    scope: ':root',
    tokens: [
      { name: '--comp-drawer-shadow', value: '-4px 0px 20px rgba(0,0,0,0.08), -1px 0px 3px rgba(0,0,0,0.04)' },
    ],
  },
  {
    title: 'Color Tokens',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-drawer-bg', value: 'semantic-neutral-solid-0' },
      { name: '--comp-drawer-overlay', value: 'semantic-neutral-black-alpha-400' },
      { name: '--comp-drawer-topbar-border', value: 'semantic-neutral-solid-100' },
      { name: '--comp-drawer-topbar-icon', value: 'semantic-neutral-black-alpha-800' },
      { name: '--comp-drawer-footer-border', value: 'semantic-divider-solid-100' },
    ],
  },
]

/* ─── Size demo ───────────────────────────────────────────────────────────── */

function SizeDemo({ size }: { size: DrawerSize }) {
  return (
    <Drawer size={size}>
      <Drawer.Trigger>
        <Button variant="outlined" size="medium">{size}</Button>
      </Drawer.Trigger>
      <Drawer.Content width={size === 'large' ? 1000 : undefined}>
        <Drawer.TopBar>
          <Drawer.CloseButton />
        </Drawer.TopBar>
        <Drawer.Body>
          <div className="py-6">
            <h2 className="typography-20-semibold text-semantic-text-on-bright-900 mb-2">
              Drawer — {size}
            </h2>
            <p className="typography-14-regular text-semantic-text-on-bright-600">
              {size === 'large'
                ? 'Custom width 1000px for the large size.'
                : `${size} size drawer.`}
            </p>
          </div>
        </Drawer.Body>
        <Drawer.Footer className="flex justify-end">
          <Drawer.Close>
            <Button variant="ghost" size="xLarge">Cancel</Button>
          </Drawer.Close>
          <Drawer.Close>
            <Button variant="primary" size="xLarge">Save</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const DRAWER_TOC: TocEntry[] = [
  { id: 'component-drawer',        label: 'Drawer',            level: 1 },
  { id: 'drawer-playground',       label: 'Playground'                   },
  { id: 'drawer-anatomy',          label: 'Anatomy'                      },
  { id: 'drawer-sizes',            label: 'Sizes'                        },
  { id: 'drawer-overlay',          label: 'Overlay'                      },
  { id: 'drawer-footer',           label: 'Footer'                       },
  { id: 'drawer-scrollable',       label: 'Scrollable Body'              },
  { id: 'drawer-topbar-actions',   label: 'TopBar Actions'               },
  { id: 'drawer-non-modal',        label: 'Non-Modal'                    },
  { id: 'drawer-theme',            label: 'Theme'                        },
  { id: 'drawer-usage',            label: 'Usage Guidelines'             },
  { id: 'drawer-props',            label: 'Props'                        },
  { id: 'drawer-code',             label: 'Code Examples'                },
  { id: 'drawer-tokens',           label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function DrawerShowcase() {
  const navigate = useContext(NavigateContext)
  const [nonModalOpen, setNonModalOpen] = useState(false)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-drawer"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="drawer-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="drawer-anatomy"
        title="Anatomy"
        description="Drawer's compound component structure with TopBar, Body, and Footer slots."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Drawer (root)
├── DrawerTrigger      — Radix Dialog.Trigger, asChild
└── DrawerContent      — Portal + optional Overlay + right-side panel
    ├── DrawerTopBar   — 44px fixed bar, bottom border
    │   ├── CloseButton — leading close icon
    │   └── actions     — trailing custom actions
    ├── DrawerBody     — flex-1, overflow-y-auto, scrollable
    └── DrawerFooter   — optional bottom bar, top border`}
        </pre>
      </ShowcaseSection>

      {/* ── Sizes ── */}
      <section id="drawer-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {DRAWER_SIZES.filter(s => s !== 'large').map(size => (
            <SizeDemo key={size} size={size} />
          ))}
          <SizeDemo size="large" />
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Drawer size="small"> · xSmall(480) · small(640) · medium(800) · large(custom)`}
          </code>
        </div>
      </section>

      {/* ── Overlay ── */}
      <section id="drawer-overlay" className="mb-12 scroll-mt-6">
        <SectionTitle>Overlay</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Drawer size="small" hasOverlay>
            <Drawer.Trigger>
              <Button variant="outlined" size="medium">With Overlay (default)</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.TopBar>
                <Drawer.CloseButton />
              </Drawer.TopBar>
              <Drawer.Body>
                <div className="py-6">
                  <h2 className="typography-20-semibold text-semantic-text-on-bright-900 mb-2">
                    With Overlay
                  </h2>
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    Suitable for decision-making content. Background is dimmed.
                  </p>
                </div>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          <Drawer size="small" hasOverlay={false}>
            <Drawer.Trigger>
              <Button variant="outlined" size="medium">Without Overlay</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.TopBar>
                <Drawer.CloseButton />
              </Drawer.TopBar>
              <Drawer.Body>
                <div className="py-6">
                  <h2 className="typography-20-semibold text-semantic-text-on-bright-900 mb-2">
                    Without Overlay
                  </h2>
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    Suitable for information viewing. Shadow distinguishes the drawer.
                  </p>
                </div>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Drawer hasOverlay={false}> — shadow replaces overlay`}
          </code>
        </div>
      </section>

      {/* ── Footer ── */}
      <section id="drawer-footer" className="mb-12 scroll-mt-6">
        <SectionTitle>Footer</SectionTitle>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-4">
          Footer is a pure slot. Use className to freely compose the layout.
        </p>
        <div className="flex flex-wrap gap-3">
          <Drawer size="xSmall">
            <Drawer.Trigger>
              <Button variant="outlined" size="medium">Horizontal</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.TopBar>
                <Drawer.CloseButton />
              </Drawer.TopBar>
              <Drawer.Body>
                <div className="py-6">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    Horizontal footer layout example.
                  </p>
                </div>
              </Drawer.Body>
              <Drawer.Footer className="flex justify-end">
                <Drawer.Close>
                  <Button variant="ghost" size="xLarge">Cancel</Button>
                </Drawer.Close>
                <Drawer.Close>
                  <Button variant="primary" size="xLarge">Confirm</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
          <Drawer size="xSmall">
            <Drawer.Trigger>
              <Button variant="outlined" size="medium">Vertical</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.TopBar>
                <Drawer.CloseButton />
              </Drawer.TopBar>
              <Drawer.Body>
                <div className="py-6">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    Vertical footer layout example.
                  </p>
                </div>
              </Drawer.Body>
              <Drawer.Footer className="flex flex-col">
                <Drawer.Close>
                  <Button variant="primary" size="xLarge">Confirm</Button>
                </Drawer.Close>
                <Drawer.Close>
                  <Button variant="ghost" size="xLarge">Cancel</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600 whitespace-pre-wrap">
            {`<Drawer.Footer className="flex justify-end">  // horizontal
<Drawer.Footer className="flex flex-col">    // vertical`}
          </code>
        </div>
      </section>

      {/* ── Scrollable Body ── */}
      <section id="drawer-scrollable" className="mb-12 scroll-mt-6">
        <SectionTitle>Scrollable Body</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Drawer size="small">
            <Drawer.Trigger>
              <Button variant="outlined" size="medium">Long Content</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.TopBar>
                <Drawer.CloseButton />
              </Drawer.TopBar>
              <Drawer.Body>
                <div className="py-6 space-y-4">
                  {Array.from({ length: 30 }, (_, i) => (
                    <p key={i} className="typography-14-regular text-semantic-text-on-bright-600">
                      Content item {i + 1} — Long body text for scroll testing. Only the Body area scrolls while TopBar and Footer remain fixed.
                    </p>
                  ))}
                </div>
              </Drawer.Body>
              <Drawer.Footer className="flex justify-end">
                <Drawer.Close>
                  <Button variant="ghost" size="xLarge">Cancel</Button>
                </Drawer.Close>
                <Drawer.Close>
                  <Button variant="primary" size="xLarge">Save</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </div>
      </section>

      {/* ── TopBar Actions ── */}
      <section id="drawer-topbar-actions" className="mb-12 scroll-mt-6">
        <SectionTitle>TopBar Actions</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Drawer size="small">
            <Drawer.Trigger>
              <Button variant="outlined" size="medium">Custom TopBar</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.TopBar>
                <Drawer.CloseButton />
                <span className="flex-1 typography-14-semibold text-semantic-text-on-bright-800 ml-1">
                  Detail Info
                </span>
                <Button variant="ghost" size="small">
                  Settings
                </Button>
              </Drawer.TopBar>
              <Drawer.Body>
                <div className="py-6">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    TopBar is a pure slot. You can freely compose CloseButton, title, and action buttons.
                  </p>
                </div>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600 whitespace-pre-wrap">
            {`<Drawer.TopBar>
  <Drawer.CloseButton />
  <span className="flex-1">Title</span>
  <Button>Action</Button>
</Drawer.TopBar>`}
          </code>
        </div>
      </section>

      {/* ── Non-Modal ── */}
      <section id="drawer-non-modal" className="mb-12 scroll-mt-6">
        <SectionTitle>Non-Modal</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="outlined" size="medium" onClick={() => setNonModalOpen(true)}>
            Open Non-Modal Drawer
          </Button>
          <span className="typography-13-regular text-semantic-text-on-bright-400">
            Background content remains interactive
          </span>
        </div>
        <Drawer size="xSmall" modal={false} hasOverlay={false} open={nonModalOpen} onOpenChange={setNonModalOpen}>
          <Drawer.Content>
            <Drawer.TopBar>
              <Drawer.CloseButton />
              <span className="typography-14-semibold text-semantic-text-on-bright-800 ml-1">
                Non-Modal
              </span>
            </Drawer.TopBar>
            <Drawer.Body>
              <div className="py-6">
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  With modal=false, background content is interactive. Close with ESC or the close button.
                </p>
              </div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Drawer modal={false} hasOverlay={false}>`}
          </code>
        </div>
      </section>

      {/* ── Theme ── */}
      <section id="drawer-theme" className="mb-12 scroll-mt-6">
        <SectionTitle>Theme Comparison</SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          <div
            data-theme="light"
            className="p-6 rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-0"
          >
            <p className="typography-13-semibold text-semantic-text-on-bright-500 mb-4">
              Light
            </p>
            <Drawer size="xSmall">
              <Drawer.Trigger>
                <Button variant="outlined" size="medium">Open Drawer</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.TopBar>
                  <Drawer.CloseButton />
                </Drawer.TopBar>
                <Drawer.Body>
                  <div className="py-6">
                    <p className="typography-14-regular text-semantic-text-on-bright-600">
                      Drawer with Light theme applied.
                    </p>
                  </div>
                </Drawer.Body>
                <Drawer.Footer className="flex justify-end">
                  <Drawer.Close>
                    <Button variant="primary" size="xLarge">Confirm</Button>
                  </Drawer.Close>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </div>
          <div
            data-theme="dark"
            className="p-6 rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-0"
          >
            <p className="typography-13-semibold text-semantic-text-on-bright-500 mb-4">
              Dark
            </p>
            <Drawer size="xSmall">
              <Drawer.Trigger>
                <Button variant="outlined" size="medium">Open Drawer</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.TopBar>
                  <Drawer.CloseButton />
                </Drawer.TopBar>
                <Drawer.Body>
                  <div className="py-6">
                    <p className="typography-14-regular text-semantic-text-on-bright-600">
                      Drawer with Dark theme applied.
                    </p>
                  </div>
                </Drawer.Body>
                <Drawer.Footer className="flex justify-end">
                  <Drawer.Close>
                    <Button variant="primary" size="xLarge">Confirm</Button>
                  </Drawer.Close>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </div>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="drawer-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-component props) */}
      <ShowcaseSection id="drawer-props" title="Props">
        {subComponentProps.map((sub) => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="drawer-code" title="Code Examples">
        {codeExamples.map((ex) => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="drawer-tokens"
        title="Design Tokens"
        description="Size and spacing tokens at :root scope. Color tokens switch by theme via [data-theme]."
      >
        <TokensReference groups={sizeTokenGroups} />
      </ShowcaseSection>
    </>
  )
}
