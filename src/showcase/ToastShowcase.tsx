import { useContext } from 'react'
import { toast, TOAST_INTENTS, TOAST_POSITIONS } from '@/components/Toast'
import type { ToastIntent } from '@/components/Toast'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
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
  TokenChainTable,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
  type TokenChainData,
} from './showcase-blocks'
import { extractProps, extractHeader } from './spec-utils'
import toastSpec from '../../specs/toast.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(toastSpec)
const propRows = extractProps(toastSpec)

/* ─── Helper button ───────────────────────────────────────────────────────── */

function TriggerButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-2 bg-semantic-neutral-black-alpha-70 typography-14-semibold text-semantic-text-on-bright-900 transition-colors duration-fast ease-enter hover:bg-semantic-neutral-black-alpha-100"
    >
      {children}
    </button>
  )
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    intent:   { kind: 'select', options: TOAST_INTENTS },
    position: { kind: 'select', options: TOAST_POSITIONS },
    showIcon: { kind: 'boolean' },
    mode:     { kind: 'select', options: ['toast', 'snackbar'] as const },
  },
  defaults: {
    intent: 'default',
    position: 'bottom-center',
    showIcon: true,
    mode: 'toast',
  },
  render: (props) => {
    const intent = props.intent as ToastIntent
    const showIcon = props.showIcon as boolean
    const mode = props.mode as string

    return (
      <TriggerButton
        onClick={() => {
          if (mode === 'snackbar') {
            toast.snackbar(`This is a ${intent} snackbar`, {
              intent,
              showIcon,
              actions: [{ label: 'Undo', onClick: () => toast.positive('Undone!') }],
            })
          } else {
            toast(`This is a ${intent} toast`, { intent, showIcon })
          }
        }}
      >
        Show {mode === 'snackbar' ? 'Snackbar' : 'Toast'}
      </TriggerButton>
    )
  },
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Temporary feedback after user actions (saved, copied, sent)',
    'Non-blocking notifications that auto-dismiss',
    'Status updates that don\'t require immediate attention',
  ],
  dontUse: [
    { text: 'Blocking decisions requiring user input', alternative: 'dialog', alternativeLabel: 'Dialog' },
    { text: 'Persistent contextual information', alternative: 'callout', alternativeLabel: 'Callout' },
    { text: 'Critical errors requiring acknowledgment', alternative: 'dialog', alternativeLabel: 'Dialog' },
  ],
  related: [
    { id: 'callout', label: 'Callout' },
    { id: 'dialog', label: 'Dialog' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic toast',
    code: `import { toast } from '@/components/Toast'

toast("Saved successfully")
toast.positive("Item created")
toast.warning("Connection unstable")
toast.error("Upload failed")`,
  },
  {
    title: 'With action (Snackbar)',
    code: `toast.snackbar("Item deleted", {
  intent: "default",
  actions: [
    { label: "Undo", onClick: () => restoreItem() },
  ],
})`,
    description: 'Snackbar mode adds action buttons. Single button defaults to "assist" variant.',
  },
  {
    title: 'Snackbar with two buttons',
    code: `toast.snackbar("Delete this file?", {
  intent: "error",
  actions: [
    { label: "Cancel", onClick: handleCancel, variant: "assist" },
    { label: "Delete", onClick: handleDelete, variant: "main" },
  ],
})`,
    description: 'Two-button layout stacks vertically with right-aligned buttons.',
  },
  {
    title: 'Custom duration',
    code: `// Auto-dismiss after 10 seconds
toast("Long notification", { duration: 10000 })

// Never auto-dismiss (null)
toast.snackbar("Action required", {
  duration: null,
  actions: [{ label: "Dismiss", onClick: () => {} }],
})`,
    description: 'Default: 5s for toast, 8s for snackbar. Pass null to disable auto-dismiss.',
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Container & Text',
    rows: [
      { component: '--comp-toast-bg',     semantic: 'neutral-white-alpha-800', lightPrimitive: 'white-alpha-800', lightHex: 'rgba(255,255,255,0.88)', darkPrimitive: 'solid-100', darkHex: '#f0f1f3' },
      { component: '--comp-toast-border', semantic: 'neutral-black-alpha-50',  lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',       darkPrimitive: 'solid-200', darkHex: '#d9dbe0' },
      { component: '--comp-toast-text',   semantic: 'neutral-black-alpha-600', lightPrimitive: 'black-alpha-600', lightHex: 'rgba(0,0,0,0.56)',       darkPrimitive: 'on-bright-900', darkHex: '#fdfefe' },
    ],
  },
  {
    title: 'Intent Icons',
    rows: [
      { component: '--comp-toast-icon-default',  semantic: 'neutral-black-alpha-400', lightPrimitive: 'black-alpha-400', lightHex: 'rgba(0,0,0,0.24)', darkPrimitive: 'gray-400', darkHex: '#8c8f96' },
      { component: '--comp-toast-icon-positive', semantic: 'success-500',             lightPrimitive: 'green-500',       lightHex: '#22c55e',           darkPrimitive: 'green-500', darkHex: '#22c55e' },
      { component: '--comp-toast-icon-warning',  semantic: 'warning-500',             lightPrimitive: 'amber-500',       lightHex: '#f59e0b',           darkPrimitive: 'amber-500', darkHex: '#f59e0b' },
      { component: '--comp-toast-icon-error',    semantic: 'error-500',               lightPrimitive: 'red-500',         lightHex: '#ef4444',           darkPrimitive: 'red-500',   darkHex: '#ef4444' },
    ],
  },
  {
    title: 'Snackbar Buttons',
    rows: [
      { component: '--comp-snackbar-btn-text-assist', semantic: 'neutral-black-alpha-600', lightPrimitive: 'black-alpha-600', lightHex: 'rgba(0,0,0,0.56)', darkPrimitive: 'gray-300', darkHex: '#c3c5ca' },
      { component: '--comp-snackbar-btn-bg-main',     semantic: 'neutral-black-alpha-70',  lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)', darkPrimitive: 'gray-700', darkHex: '#404349' },
      { component: '--comp-snackbar-btn-text-main',   semantic: 'neutral-solid-950',       lightPrimitive: 'gray-950',        lightHex: '#1d1e22',          darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Toast Container',
    scope: ':root',
    tokens: [
      { name: '--comp-toast-width', value: '384px' },
      { name: '--comp-toast-radius', value: '16px (radius-4)' },
      { name: '--comp-toast-px', value: '14px (spacing-3.5)' },
      { name: '--comp-toast-py', value: '12px' },
      { name: '--comp-toast-gap', value: '6px (spacing-1.5)' },
      { name: '--comp-toast-icon-size', value: '24px' },
      { name: '--comp-toast-text-pl', value: '2px' },
      { name: '--comp-toast-text-py', value: '4px (spacing-1)' },
    ],
  },
  {
    title: 'Visual Effects',
    scope: ':root',
    tokens: [
      { name: '--comp-toast-shadow', value: '0px 1px 2px rgba(0,0,0,0.04), 0px 4px 16px rgba(0,0,0,0.08)' },
      { name: '--comp-toast-backdrop-blur', value: '16px' },
    ],
  },
  {
    title: 'Viewport & Stack',
    scope: ':root',
    tokens: [
      { name: '--comp-toast-viewport-offset', value: '24px' },
      { name: '--comp-toast-stack-gap', value: '8px' },
    ],
  },
  {
    title: 'Snackbar',
    scope: ':root',
    tokens: [
      { name: '--comp-snackbar-width', value: '448px' },
      { name: '--comp-snackbar-button-h', value: '32px' },
      { name: '--comp-snackbar-button-w', value: '112px' },
      { name: '--comp-snackbar-button-radius', value: '8px (radius-2)' },
      { name: '--comp-snackbar-button-row-pl', value: '32px' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TOAST_TOC: TocEntry[] = [
  { id: 'component-toast',         label: 'Toast / Snackbar', level: 1 },
  { id: 'toast-playground',        label: 'Playground'                  },
  { id: 'toast-anatomy',           label: 'Anatomy'                     },
  { id: 'toast-basic',             label: 'Basic Toast'                 },
  { id: 'toast-intents',           label: 'Intents'                     },
  { id: 'snackbar-one-button',     label: 'Snackbar (1 Button)'         },
  { id: 'snackbar-two-buttons',    label: 'Snackbar (2 Buttons)'        },
  { id: 'toast-no-icon',           label: 'Without Icon'                },
  { id: 'toast-usage',             label: 'Usage Guidelines'            },
  { id: 'toast-props',             label: 'Props'                       },
  { id: 'toast-code',              label: 'Code Examples'               },
  { id: 'toast-tokens',            label: 'Design Tokens'               },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function ToastShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-toast"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="toast-playground" title="Playground">
        <PlaygroundNote />
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="toast-anatomy"
        title="Anatomy"
        description="Toast and Snackbar share the same glassmorphism container. Snackbar extends with action buttons."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Toast (container — glassmorphism)
├── icon           — intent-colored, 24px, optional (showIcon)
└── message        — typography-16-regular

Snackbar (container — glassmorphism)
├── icon           — intent-colored, 24px, optional (showIcon)
├── message        — typography-16-regular
└── actions[]      — 1-2 buttons (assist / main variants)
    └── 2-button layout → vertical stack, right-aligned`}
        </pre>
      </ShowcaseSection>

      {/* ── Existing visual sections ── */}

      {/* 4. Basic Toast */}
      <section id="toast-basic" className="mb-10 scroll-mt-6">
        <SectionTitle>Basic Toast</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <TriggerButton onClick={() => toast('Single line toast')}>
            Default Toast
          </TriggerButton>
          <TriggerButton onClick={() => toast('저장이 완료되었습니다.', { intent: 'positive' })}>
            Positive Toast
          </TriggerButton>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`toast("Single line toast")`}
          </code>
        </div>
      </section>

      {/* 5. Intents */}
      <section id="toast-intents" className="mb-10 scroll-mt-6">
        <SectionTitle>Intents</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {TOAST_INTENTS.map((intent) => (
            <TriggerButton
              key={intent}
              onClick={() => toast(`This is a ${intent} toast`, { intent })}
            >
              {intent}
            </TriggerButton>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600">
            {`toast.positive("Success!") · toast.warning("Caution") · toast.error("Failed")`}
          </code>
        </div>
      </section>

      {/* 6. Snackbar: 1 Button */}
      <section id="snackbar-one-button" className="mb-10 scroll-mt-6">
        <SectionTitle>Snackbar (1 Button)</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <TriggerButton
            onClick={() =>
              toast.snackbar('항목이 삭제되었습니다.', {
                intent: 'default',
                actions: [{ label: '되돌리기', onClick: () => toast.positive('되돌렸습니다') }],
              })
            }
          >
            Assist Button
          </TriggerButton>
          <TriggerButton
            onClick={() =>
              toast.snackbar('변경 사항이 있습니다.', {
                intent: 'warning',
                actions: [
                  { label: '닫기', onClick: () => {}, variant: 'main' },
                ],
              })
            }
          >
            Main Button
          </TriggerButton>
        </div>
      </section>

      {/* 7. Snackbar: 2 Buttons */}
      <section id="snackbar-two-buttons" className="mb-10 scroll-mt-6">
        <SectionTitle>Snackbar (2 Buttons)</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <TriggerButton
            onClick={() =>
              toast.snackbar('파일을 삭제하시겠습니까?', {
                intent: 'error',
                actions: [
                  { label: '취소', onClick: () => toast('취소되었습니다'), variant: 'assist' },
                  { label: '삭제', onClick: () => toast.error('삭제되었습니다'), variant: 'main' },
                ],
              })
            }
          >
            Two Buttons
          </TriggerButton>
        </div>
        <div className="mt-3 p-3 rounded-2 bg-semantic-neutral-black-alpha-50">
          <code className="typography-13-regular text-semantic-text-on-bright-600 whitespace-pre-wrap">
            {`toast.snackbar("메시지", {
  actions: [
    { label: "취소", onClick: fn, variant: "assist" },
    { label: "삭제", onClick: fn, variant: "main" },
  ],
})`}
          </code>
        </div>
      </section>

      {/* 8. Without Icon */}
      <section id="toast-no-icon" className="mb-10 scroll-mt-6">
        <SectionTitle>Without Icon</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <TriggerButton
            onClick={() => toast('아이콘 없는 토스트입니다.', { showIcon: false })}
          >
            No Icon Toast
          </TriggerButton>
          <TriggerButton
            onClick={() =>
              toast.snackbar('아이콘 없는 스낵바입니다.', {
                showIcon: false,
                actions: [{ label: '확인', onClick: () => {}, variant: 'main' }],
              })
            }
          >
            No Icon Snackbar
          </TriggerButton>
        </div>
      </section>

      {/* 9. Usage Guidelines */}
      <ShowcaseSection id="toast-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 10. Props Table */}
      <ShowcaseSection id="toast-props" title="Props">
        <PropsTable props={propRows} title="toast() options" />
        <PropsTable
          props={[
            { name: 'actions', type: 'ToastAction[]', default: '[]', description: 'Action buttons for snackbar mode. Each action has label, onClick, and optional variant ("assist" | "main").' },
            { name: 'label', type: 'string', default: '\u2014', description: 'Button text displayed in the action button.' },
            { name: 'onClick', type: '() => void', default: '\u2014', description: 'Click handler for the action button.' },
            { name: 'variant', type: '"assist" | "main"', default: 'assist', description: 'Visual style of the action button. "main" has a filled background.' },
          ]}
          title="toast.snackbar() additional options"
        />
        <PropsTable
          props={[
            { name: 'position', type: 'ToastPosition', default: 'bottom-center', description: 'Viewport position for toast stack. One of: bottom-center, top-center, bottom-right, top-right.' },
            { name: 'className', type: 'string', default: '\u2014', description: 'Custom className applied to each toast container.' },
          ]}
          title="Toaster props"
        />
      </ShowcaseSection>

      {/* 11. Code Examples */}
      <ShowcaseSection id="toast-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 12. Design Tokens */}
      <ShowcaseSection
        id="toast-tokens"
        title="Design Tokens"
        description="Component \u2192 Semantic \u2192 Primitive resolution chain. Color tokens switch by theme, size tokens are theme-agnostic. Glassmorphism effect uses backdrop-blur + white-alpha background."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}

/* ─── Playground note ─────────────────────────────────────────────────────── */

function PlaygroundNote() {
  return (
    <p className="typography-13-regular text-semantic-text-on-bright-400 mb-3">
      Toast uses an imperative API. Configure options below and press the trigger button to see the toast appear.
    </p>
  )
}
