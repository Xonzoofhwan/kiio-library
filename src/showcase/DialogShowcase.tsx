import { useState, useContext } from 'react'
import { Dialog, DIALOG_SIZES, DIALOG_FOOTER_LAYOUTS } from '@/components/Dialog'
import { Button } from '@/components/Button'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import type { DialogSize, DialogFooterLayout } from '@/components/Dialog'
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
import dialogSpec from '../../specs/dialog.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(dialogSpec)
const subComponentProps = extractSubComponentProps(dialogSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

function PlaygroundDialog({
  size,
  footerLayout,
  showClose,
}: {
  size: DialogSize
  footerLayout: DialogFooterLayout
  showClose: boolean
}) {
  return (
    <Dialog size={size}>
      <Dialog.Trigger>
        <Button variant="primary" size="medium">Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content showCloseButton={showClose}>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>
          This is a {size} dialog with {footerLayout} footer layout.
        </Dialog.Description>
        <Dialog.Body>
          <div className="py-4">
            <p className="typography-14-regular text-semantic-text-on-bright-600">
              Dialog body content area. You can place any content here.
            </p>
          </div>
        </Dialog.Body>
        <Dialog.Footer layout={footerLayout}>
          <Dialog.Close>
            <Button variant="ghost" size="large">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button variant="primary" size="large">Confirm</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:         { kind: 'select', options: DIALOG_SIZES },
    footerLayout: { kind: 'select', options: DIALOG_FOOTER_LAYOUTS },
    showClose:    { kind: 'boolean' },
  },
  defaults: {
    size: 'small',
    footerLayout: 'horizontal-hug',
    showClose: false,
  },
  render: (props) => (
    <PlaygroundDialog
      key={`${props.size}-${props.footerLayout}-${props.showClose}`}
      size={props.size as DialogSize}
      footerLayout={props.footerLayout as DialogFooterLayout}
      showClose={props.showClose as boolean}
    />
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Confirming destructive or irreversible actions',
    'Collecting focused input that interrupts workflow',
    'Important decisions requiring user attention',
  ],
  dontUse: [
    { text: 'Non-critical contextual information', alternative: 'callout', alternativeLabel: 'Callout' },
    { text: 'Temporary feedback messages', alternative: 'toast', alternativeLabel: 'Toast' },
    { text: 'Side panel with navigation context', alternative: 'drawer', alternativeLabel: 'Drawer' },
  ],
  related: [
    { id: 'drawer', label: 'Drawer' },
    { id: 'callout', label: 'Callout' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic confirm dialog',
    code: `<Dialog size="small">
  <Dialog.Trigger>
    <Button variant="primary">Delete Item</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Delete this item?</Dialog.Title>
    <Dialog.Description>
      This action cannot be undone.
    </Dialog.Description>
    <Dialog.Footer>
      <Dialog.Close>
        <Button variant="ghost" size="large">Cancel</Button>
      </Dialog.Close>
      <Dialog.Close>
        <Button variant="primary" intent="destructive" size="large">
          Delete
        </Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
  },
  {
    title: 'With image',
    code: `<Dialog size="small">
  <Dialog.Trigger>
    <Button variant="outlined">Show Banner</Button>
  </Dialog.Trigger>
  <Dialog.Content showCloseButton>
    <Dialog.Image
      type="banner"
      src="/images/hero.jpg"
      alt="Hero banner"
    />
    <Dialog.Title>Welcome</Dialog.Title>
    <Dialog.Description>
      Get started with our new features.
    </Dialog.Description>
    <Dialog.Footer>
      <Dialog.Close>
        <Button variant="primary" size="large">Get Started</Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
  },
  {
    title: 'Form dialog',
    code: `<Dialog size="medium">
  <Dialog.Trigger>
    <Button>Edit Profile</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Edit Profile</Dialog.Title>
    <Dialog.Body>
      <form className="space-y-4 py-4">
        {/* form fields */}
      </form>
    </Dialog.Body>
    <Dialog.Footer layout="horizontal-fill">
      <Dialog.Close>
        <Button variant="ghost" size="large">Cancel</Button>
      </Dialog.Close>
      <Button variant="primary" size="large" type="submit">
        Save Changes
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
    description: 'Use Dialog.Body for scrollable form content. The submit button intentionally omits Dialog.Close to allow validation before closing.',
  },
  {
    title: 'Controlled',
    code: `const [open, setOpen] = useState(false)

<Dialog size="small" open={open} onOpenChange={setOpen}>
  <Dialog.Content>
    <Dialog.Title>Controlled Dialog</Dialog.Title>
    <Dialog.Description>
      Manage open state externally.
    </Dialog.Description>
    <Dialog.Footer>
      <Button variant="ghost" size="large"
        onClick={() => setOpen(false)}>
        Close
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
    description: 'Use open and onOpenChange props to control the dialog externally. Useful for programmatic open/close.',
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Layout',
    scope: ':root',
    tokens: [
      { name: '--comp-dialog-width-xs', value: '480px' },
      { name: '--comp-dialog-width-sm', value: '640px' },
      { name: '--comp-dialog-width-md', value: '800px' },
      { name: '--comp-dialog-radius', value: '24px' },
      { name: '--comp-dialog-px', value: '24px' },
      { name: '--comp-dialog-title-pt', value: '24px' },
      { name: '--comp-dialog-footer-px', value: '24px' },
      { name: '--comp-dialog-footer-py', value: '16px' },
      { name: '--comp-dialog-footer-gap', value: '8px' },
      { name: '--comp-dialog-close-size', value: '32px' },
      { name: '--comp-dialog-close-size-lg', value: '48px' },
      { name: '--comp-dialog-close-icon', value: '20px' },
      { name: '--comp-dialog-close-icon-lg', value: '24px' },
      { name: '--comp-dialog-close-inset', value: '16px' },
      { name: '--comp-dialog-close-radius', value: '9999px' },
      { name: '--comp-dialog-image-height-xs', value: '160px' },
      { name: '--comp-dialog-image-height-sm', value: '200px' },
      { name: '--comp-dialog-image-height-md', value: '256px' },
      { name: '--comp-dialog-image-mark-height', value: '120px' },
      { name: '--comp-dialog-image-mark-min', value: '96px' },
      { name: '--comp-dialog-shadow', value: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)' },
    ],
  },
]

/* ─── Size demo dialog ────────────────────────────────────────────────────── */

function SizeDemo({ size }: { size: DialogSize }) {
  return (
    <Dialog size={size}>
      <Dialog.Trigger>
        <Button variant="outlined" size="medium">{size}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Dialog — {size}</Dialog.Title>
        <Dialog.Description>
          {size === 'large'
            ? '커스텀 너비를 지정할 수 있는 large 사이즈입니다.'
            : `${size} 사이즈 다이얼로그입니다.`}
        </Dialog.Description>
        <Dialog.Body>
          <div className="py-4">
            <p className="typography-14-regular text-semantic-text-on-bright-600">
              다이얼로그 본문 콘텐츠 영역입니다.
            </p>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="ghost" size="large">취소</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button variant="primary" size="large">확인</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}

/* ─── Footer layout demo ──────────────────────────────────────────────────── */

function FooterLayoutDemo({ layout }: { layout: DialogFooterLayout }) {
  return (
    <Dialog size="xSmall">
      <Dialog.Trigger>
        <Button variant="outlined" size="medium">{layout}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Footer: {layout}</Dialog.Title>
        <Dialog.Description>
          Footer 레이아웃이 {layout}으로 설정됩니다.
        </Dialog.Description>
        <Dialog.Body>
          <div className="py-4">
            <p className="typography-14-regular text-semantic-text-on-bright-600">
              하단 버튼 레이아웃을 확인하세요.
            </p>
          </div>
        </Dialog.Body>
        <Dialog.Footer layout={layout}>
          <Dialog.Close>
            <Button variant="ghost" size="large">취소</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button variant="primary" size="large">확인</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const DIALOG_TOC: TocEntry[] = [
  { id: 'component-dialog',       label: 'Dialog',              level: 1 },
  { id: 'dialog-playground',      label: 'Playground'                     },
  { id: 'dialog-anatomy',         label: 'Anatomy'                        },
  { id: 'dialog-sizes',           label: 'Sizes'                          },
  { id: 'dialog-image-banner',    label: 'Image (Banner)'                 },
  { id: 'dialog-image-mark',      label: 'Image (Mark)'                   },
  { id: 'dialog-close-button',    label: 'Close Button'                   },
  { id: 'dialog-footer-layouts',  label: 'Footer Layouts'                 },
  { id: 'dialog-scrollable',      label: 'Scrollable Body'                },
  { id: 'dialog-theme',           label: 'Theme'                          },
  { id: 'dialog-usage',           label: 'Usage Guidelines'               },
  { id: 'dialog-props',           label: 'Props'                          },
  { id: 'dialog-code',            label: 'Code Examples'                  },
  { id: 'dialog-tokens',          label: 'Design Tokens'                  },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function DialogShowcase() {
  const navigate = useContext(NavigateContext)
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-dialog"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="dialog-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="dialog-anatomy"
        title="Anatomy"
        description="Dialog's compound component structure with image dock, sticky title, scrollable body, and configurable footer."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Dialog (root — context provider: size, theme)
├── Dialog.Trigger   — Radix trigger, asChild
└── Dialog.Content   — Portal + Overlay + centered panel
    ├── Dialog.Image       — optional: banner (full-width) or mark (left-aligned)
    ├── Dialog.Title       — required, sticky on scroll, aria-labelledby
    ├── Dialog.Description — optional, aria-describedby
    ├── Dialog.Body        — optional, scrollable content area
    ├── Dialog.Footer      — button area, 3 layouts
    │   └── Dialog.Close   — Radix close wrapper (asChild)
    └── [CloseButton]      — optional absolute-positioned X button`}
        </pre>
      </ShowcaseSection>

      {/* ── Sizes ── */}
      <section id="dialog-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {DIALOG_SIZES.filter(s => s !== 'large').map(size => (
            <SizeDemo key={size} size={size} />
          ))}
          <Dialog size="large">
            <Dialog.Trigger>
              <Button variant="outlined" size="medium">large (900px)</Button>
            </Dialog.Trigger>
            <Dialog.Content width={900}>
              <Dialog.Title>Dialog — large</Dialog.Title>
              <Dialog.Description>커스텀 너비 900px로 지정된 large 사이즈입니다.</Dialog.Description>
              <Dialog.Body>
                <div className="py-4">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    large 사이즈는 800px 초과의 커스텀 너비를 지정할 수 있습니다.
                  </p>
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="ghost" size="large">닫기</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Dialog size="small"> · xSmall(480) · small(640) · medium(800) · large(custom)`}
          </code>
        </div>
      </section>

      {/* ── Image: Banner ── */}
      <section id="dialog-image-banner" className="mb-12 scroll-mt-6">
        <SectionTitle>Image (Banner)</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Dialog size="small">
            <Dialog.Trigger>
              <Button variant="outlined" size="medium">Banner Image</Button>
            </Dialog.Trigger>
            <Dialog.Content showCloseButton>
              <Dialog.Image
                type="banner"
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=200&fit=crop"
                alt="Banner image"
              />
              <Dialog.Title>배너 이미지 다이얼로그</Dialog.Title>
              <Dialog.Description>
                상단에 배너 이미지가 표시됩니다. 닫기 버튼과 함께 사용할 수 있습니다.
              </Dialog.Description>
              <Dialog.Body>
                <div className="py-4">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    이미지는 너비에 맞춰 object-cover로 표시됩니다.
                  </p>
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="primary" size="large">확인</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Dialog.Image type="banner" src="..." alt="..." />`}
          </code>
        </div>
      </section>

      {/* ── Image: Mark ── */}
      <section id="dialog-image-mark" className="mb-12 scroll-mt-6">
        <SectionTitle>Image (Mark)</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Dialog size="xSmall">
            <Dialog.Trigger>
              <Button variant="outlined" size="medium">Mark Image</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Image
                type="mark"
                src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=96&h=96&fit=crop"
                alt="Mark image"
              />
              <Dialog.Title>마크 이미지</Dialog.Title>
              <Dialog.Description>
                좌측 정렬된 작은 마크 이미지입니다.
              </Dialog.Description>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="primary" size="large">확인</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Dialog.Image type="mark" src="..." alt="..." />`}
          </code>
        </div>
      </section>

      {/* ── Close Button ── */}
      <section id="dialog-close-button" className="mb-12 scroll-mt-6">
        <SectionTitle>Close Button</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Dialog size="small">
            <Dialog.Trigger>
              <Button variant="outlined" size="medium">With Close Button</Button>
            </Dialog.Trigger>
            <Dialog.Content showCloseButton>
              <Dialog.Title>닫기 버튼</Dialog.Title>
              <Dialog.Description>
                우측 상단에 블러 배경의 닫기 버튼이 표시됩니다.
              </Dialog.Description>
              <Dialog.Body>
                <div className="py-4">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    showCloseButton prop으로 제어합니다.
                  </p>
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="primary" size="large">확인</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
          <Dialog size="large">
            <Dialog.Trigger>
              <Button variant="outlined" size="medium">Large + Close</Button>
            </Dialog.Trigger>
            <Dialog.Content showCloseButton width={900}>
              <Dialog.Title>Large 사이즈 닫기 버튼</Dialog.Title>
              <Dialog.Description>
                large 사이즈에서는 닫기 버튼이 48px로 커집니다.
              </Dialog.Description>
              <Dialog.Body>
                <div className="py-4">
                  <p className="typography-14-regular text-semantic-text-on-bright-600">
                    아이콘도 24px로 확대됩니다.
                  </p>
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="primary" size="large">확인</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Dialog.Content showCloseButton>`}
          </code>
        </div>
      </section>

      {/* ── Footer Layouts ── */}
      <section id="dialog-footer-layouts" className="mb-12 scroll-mt-6">
        <SectionTitle>Footer Layouts</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {DIALOG_FOOTER_LAYOUTS.map(layout => (
            <FooterLayoutDemo key={layout} layout={layout} />
          ))}
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`<Dialog.Footer layout="horizontal-hug|horizontal-fill|vertical-fill">`}
          </code>
        </div>
      </section>

      {/* ── Scrollable Body ── */}
      <section id="dialog-scrollable" className="mb-12 scroll-mt-6">
        <SectionTitle>Scrollable Body</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Dialog size="small">
            <Dialog.Trigger>
              <Button variant="outlined" size="medium">Long Content</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>스크롤 가능한 본문</Dialog.Title>
              <Dialog.Description>
                본문이 길면 자동으로 스크롤됩니다. Title은 sticky로 고정됩니다.
              </Dialog.Description>
              <Dialog.Body>
                <div className="py-4 space-y-4">
                  {Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="typography-14-regular text-semantic-text-on-bright-600">
                      콘텐츠 항목 {i + 1} — 스크롤 테스트를 위한 긴 본문입니다. 다이얼로그 본문이 화면 높이를 초과하면 Body 영역만 스크롤됩니다.
                    </p>
                  ))}
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button variant="ghost" size="large">취소</Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button variant="primary" size="large">확인</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
      </section>

      {/* ── Controlled ── */}
      <section className="mb-12 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="outlined" size="medium" onClick={() => setControlledOpen(true)}>
            Open (Controlled)
          </Button>
          <span className="typography-13-regular text-semantic-text-on-bright-400">
            open: {String(controlledOpen)}
          </span>
        </div>
        <Dialog size="small" open={controlledOpen} onOpenChange={setControlledOpen}>
          <Dialog.Content>
            <Dialog.Title>Controlled Dialog</Dialog.Title>
            <Dialog.Description>
              open / onOpenChange prop으로 상태를 직접 제어합니다.
            </Dialog.Description>
            <Dialog.Footer>
              <Button variant="ghost" size="large" onClick={() => setControlledOpen(false)}>
                닫기
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </section>

      {/* ── Theme ── */}
      <section id="dialog-theme" className="mb-12 scroll-mt-6">
        <SectionTitle>Theme Comparison</SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          <div
            data-theme="light"
            className="p-6 rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-0"
          >
            <p className="typography-13-semibold text-semantic-text-on-bright-500 mb-4">
              Light
            </p>
            <Dialog size="xSmall">
              <Dialog.Trigger>
                <Button variant="outlined" size="medium">Open Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Light 테마</Dialog.Title>
                <Dialog.Description>
                  Light 테마가 적용된 다이얼로그입니다.
                </Dialog.Description>
                <Dialog.Footer>
                  <Dialog.Close>
                    <Button variant="primary" size="large">확인</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </div>
          <div
            data-theme="dark"
            className="p-6 rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-0"
          >
            <p className="typography-13-semibold text-semantic-text-on-bright-500 mb-4">
              Dark
            </p>
            <Dialog size="xSmall">
              <Dialog.Trigger>
                <Button variant="outlined" size="medium">Open Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Dark 테마</Dialog.Title>
                <Dialog.Description>
                  Dark 테마가 적용된 다이얼로그입니다.
                </Dialog.Description>
                <Dialog.Footer>
                  <Dialog.Close>
                    <Button variant="primary" size="large">확인</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </div>
        </div>
      </section>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="dialog-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (sub-component props) */}
      <ShowcaseSection id="dialog-props" title="Props">
        {subComponentProps.map(sub => (
          <PropsTable key={sub.name} props={sub.props} title={sub.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="dialog-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="dialog-tokens"
        title="Design Tokens"
        description="Component-level CSS custom properties for Dialog sizing, spacing, and layout. Color tokens switch by theme via [data-theme] scope."
      >
        <TokensReference groups={sizeTokenGroups} />
      </ShowcaseSection>
    </>
  )
}
