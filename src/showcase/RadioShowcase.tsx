import { useState } from 'react'
import { Radio, RadioGroup, RADIO_SIZES } from '@/components/Radio'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const RADIO_TOC: TocEntry[] = [
  { id: 'radio-sizes', label: 'Sizes' },
  { id: 'radio-states', label: 'States' },
  { id: 'radio-controlled', label: 'Controlled' },
  { id: 'radio-hit-area', label: 'Hit Area' },
  { id: 'radio-form', label: 'Form Integration' },
  { id: 'radio-with-label', label: 'With Label' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function RadioShowcase() {
  const [controlled, setControlled] = useState('monthly')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSubmitted(JSON.stringify(Object.fromEntries(fd.entries())))
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Radio</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Single-select option control built on Radix RadioGroup. The visual circle is small
          (16/20/24px), so each Radio extends an invisible 8px hit-area inset on every side
          while keeping the layout footprint equal to the visual size — matching Checkbox.
          Always rendered inside a <code>&lt;RadioGroup&gt;</code>.
        </p>
      </div>

      {/* ─── Sizes ──────────────────────────────────────────────── */}
      <section id="radio-sizes" className="mb-12">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-4">
          {RADIO_SIZES.map((size) => (
            <div key={size} className="flex items-center gap-8">
              <RowHeader>{size}</RowHeader>
              <RadioGroup size={size} defaultValue="on" orientation="horizontal" className="flex flex-row items-center gap-8">
                <Radio value="off" />
                <Radio value="on" />
              </RadioGroup>
            </div>
          ))}
        </div>
      </section>

      {/* ─── States ─────────────────────────────────────────────── */}
      <section id="radio-states" className="mb-12">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <RowHeader>Default</RowHeader>
            <RadioGroup defaultValue="on" orientation="horizontal" className="flex flex-row items-center gap-8">
              <Radio value="off" />
              <Radio value="on" />
            </RadioGroup>
          </div>
          <div className="flex items-center gap-8">
            <RowHeader>Disabled</RowHeader>
            <RadioGroup defaultValue="on" disabled orientation="horizontal" className="flex flex-row items-center gap-8">
              <Radio value="off" />
              <Radio value="on" />
            </RadioGroup>
          </div>
        </div>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mt-4">
          Hover, press, and focus states are interactive — try them with mouse and keyboard
          (Tab + arrow keys to navigate, Space to select).
        </p>
      </section>

      {/* ─── Controlled ─────────────────────────────────────────── */}
      <section id="radio-controlled" className="mb-12">
        <SectionTitle>Controlled</SectionTitle>
        <RadioGroup value={controlled} onValueChange={setControlled}>
          <label className="flex items-center gap-3 cursor-pointer">
            <Radio value="monthly" />
            <span className="typography-14-regular text-semantic-text-on-bright-800">Monthly</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Radio value="yearly" />
            <span className="typography-14-regular text-semantic-text-on-bright-800">Yearly</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Radio value="lifetime" />
            <span className="typography-14-regular text-semantic-text-on-bright-800">Lifetime</span>
          </label>
        </RadioGroup>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mt-4">
          Selected: <strong>{controlled}</strong>
        </p>
      </section>

      {/* ─── Hit Area Demo ──────────────────────────────────────── */}
      <section id="radio-hit-area" className="mb-12">
        <SectionTitle>Hit Area — Invisible Inset</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mb-4">
          The visual circle is 16/20/24px depending on size, but every radio has an additional
          <strong> 8px invisible padding</strong> on all sides for easier touch/click targets. The
          layout footprint stays equal to the visual size (negative margin compensates), so radios
          align cleanly with adjacent atoms. The dotted box below visualizes the actual hit area.
        </p>
        <RadioGroup defaultValue="hit-md" orientation="horizontal" className="flex flex-row items-center gap-12">
          {RADIO_SIZES.map((size) => {
            const visual = size === 'xSmall' ? 16 : size === 'small' ? 20 : 24
            const hit = visual + 16
            return (
              <div key={size} className="flex flex-col items-center gap-3">
                <div
                  className="relative grid place-items-center"
                  style={{ width: hit, height: hit }}
                >
                  <div
                    className="absolute inset-0 border border-dashed border-semantic-neutral-black-alpha-300 rounded-full"
                    aria-hidden
                  />
                  <Radio size={size} value={`hit-${size === 'xSmall' ? 'xs' : size === 'small' ? 'sm' : 'md'}`} />
                </div>
                <span className="typography-12-regular text-semantic-text-on-bright-500">
                  {size} · visual {visual} · hit {hit}
                </span>
              </div>
            )
          })}
        </RadioGroup>
        <p className="typography-12-regular text-semantic-text-on-bright-400 mt-4">
          When placing Radio next to other interactive atoms, use <code>gap-4</code> (16px) or
          larger to prevent hit area overlap.
        </p>
      </section>

      {/* ─── Form Integration ───────────────────────────────────── */}
      <section id="radio-form" className="mb-12">
        <SectionTitle>Form Integration</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <RadioGroup name="plan" defaultValue="monthly" required>
            <label className="flex items-center gap-3 cursor-pointer">
              <Radio value="monthly" />
              <span className="typography-14-regular text-semantic-text-on-bright-800">Monthly · $9</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Radio value="yearly" />
              <span className="typography-14-regular text-semantic-text-on-bright-800">Yearly · $90</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Radio value="lifetime" />
              <span className="typography-14-regular text-semantic-text-on-bright-800">Lifetime · $299</span>
            </label>
          </RadioGroup>
          <button
            type="submit"
            className="self-start typography-14-medium px-3 py-2 rounded-2 bg-semantic-neutral-solid-950 text-semantic-neutral-solid-0"
          >
            Submit
          </button>
          {submitted && (
            <pre className="typography-12-regular text-semantic-text-on-bright-600 bg-semantic-neutral-solid-50 rounded-2 p-3 overflow-x-auto">
              {submitted}
            </pre>
          )}
        </form>
      </section>

      {/* ─── With Label ─────────────────────────────────────────── */}
      <section id="radio-with-label" className="mb-12">
        <SectionTitle>With Label</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mb-4">
          Radio is an atom — labels are composed externally via <code>&lt;label&gt;</code> wrapping.
          Clicking the label selects the radio. Use <code>gap-4</code> minimum between adjacent
          radios to prevent hit area overlap.
        </p>
        <RadioGroup defaultValue="email" className="max-w-md">
          <label className="flex items-start gap-3 cursor-pointer">
            <Radio value="email" />
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">Email</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                Get notifications via email
              </span>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <Radio value="push" />
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">Push</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                Get notifications on your device
              </span>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <Radio value="none" />
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">None</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                No notifications
              </span>
            </div>
          </label>
        </RadioGroup>
      </section>
    </div>
  )
}
