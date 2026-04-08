import { useState } from 'react'
import { Checkbox, CHECKBOX_SIZES, CHECKBOX_VARIANTS } from '@/components/Checkbox'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const CHECKBOX_TOC: TocEntry[] = [
  { id: 'checkbox-variants', label: 'Variants' },
  { id: 'checkbox-sizes', label: 'Sizes' },
  { id: 'checkbox-states', label: 'States' },
  { id: 'checkbox-indeterminate', label: 'Indeterminate' },
  { id: 'checkbox-controlled', label: 'Controlled' },
  { id: 'checkbox-hit-area', label: 'Hit Area' },
  { id: 'checkbox-form', label: 'Form Integration' },
  { id: 'checkbox-with-label', label: 'With Label' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function CheckboxShowcase() {
  const [controlled, setControlled] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)

  // Indeterminate demo: parent checkbox reflects children state
  const [child1, setChild1] = useState(true)
  const [child2, setChild2] = useState(false)
  const [child3, setChild3] = useState(false)
  const childCount = [child1, child2, child3].filter(Boolean).length
  const parentChecked: boolean | 'indeterminate' =
    childCount === 0 ? false : childCount === 3 ? true : 'indeterminate'
  const onParentChange = (next: boolean) => {
    setChild1(next)
    setChild2(next)
    setChild3(next)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSubmitted(JSON.stringify(Object.fromEntries(fd.entries())))
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Checkbox</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Boolean (or tri-state) selection control built on Radix Checkbox. Two visual variants —
          <strong> box </strong>(filled square + check) and <strong>line</strong> (check glyph only).
          The visual square is small, so the Root extends an invisible 8px hit-area inset on every side
          while keeping the layout footprint equal to the visual size.
        </p>
      </div>

      {/* ─── Variants ───────────────────────────────────────────── */}
      <section id="checkbox-variants" className="mb-12">
        <SectionTitle>Variants</SectionTitle>
        <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-y-4 gap-x-8 items-center max-w-fit">
          <div />
          <ColHeader>Off</ColHeader>
          <ColHeader>On</ColHeader>
          <ColHeader>Indeterminate</ColHeader>
          {CHECKBOX_VARIANTS.map((variant) => (
            <div key={variant} className="contents">
              <RowHeader>{variant}</RowHeader>
              <Checkbox variant={variant} size="medium" />
              <Checkbox variant={variant} size="medium" defaultChecked />
              <Checkbox variant={variant} size="medium" checked="indeterminate" onCheckedChange={() => {}} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Sizes ──────────────────────────────────────────────── */}
      <section id="checkbox-sizes" className="mb-12">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-8">
          {CHECKBOX_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col gap-3">
              <ColHeader>{variant}</ColHeader>
              <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-y-4 gap-x-8 items-center max-w-fit">
                <div />
                <ColHeader>Off</ColHeader>
                <ColHeader>On</ColHeader>
                <ColHeader>Indeterminate</ColHeader>
                {CHECKBOX_SIZES.map((size) => (
                  <div key={size} className="contents">
                    <RowHeader>{size}</RowHeader>
                    <Checkbox variant={variant} size={size} />
                    <Checkbox variant={variant} size={size} defaultChecked />
                    <Checkbox variant={variant} size={size} checked="indeterminate" onCheckedChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── States ─────────────────────────────────────────────── */}
      <section id="checkbox-states" className="mb-12">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-y-4 gap-x-8 items-center max-w-fit">
          <div />
          <ColHeader>Box</ColHeader>
          <ColHeader>Line</ColHeader>

          <RowHeader>Default Off</RowHeader>
          <Checkbox variant="box" size="medium" />
          <Checkbox variant="line" size="medium" />

          <RowHeader>Default On</RowHeader>
          <Checkbox variant="box" size="medium" defaultChecked />
          <Checkbox variant="line" size="medium" defaultChecked />

          <RowHeader>Disabled Off</RowHeader>
          <Checkbox variant="box" size="medium" disabled />
          <Checkbox variant="line" size="medium" disabled />

          <RowHeader>Disabled On</RowHeader>
          <Checkbox variant="box" size="medium" disabled defaultChecked />
          <Checkbox variant="line" size="medium" disabled defaultChecked />

          <RowHeader>Disabled Indeterminate</RowHeader>
          <Checkbox variant="box" size="medium" disabled checked="indeterminate" onCheckedChange={() => {}} />
          <Checkbox variant="line" size="medium" disabled checked="indeterminate" onCheckedChange={() => {}} />
        </div>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mt-4">
          Hover, press, and focus states are interactive — try them with mouse and keyboard (Tab + Space).
        </p>
      </section>

      {/* ─── Indeterminate (parent/child pattern) ───────────────── */}
      <section id="checkbox-indeterminate" className="mb-12">
        <SectionTitle>Indeterminate — Parent / Child</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mb-4">
          The classic tri-state pattern: a parent checkbox reflects whether all, some, or none of its
          children are selected. Toggling the parent selects/deselects all children at once.
        </p>
        <div className="flex flex-col gap-3 max-w-md">
          <label className="flex items-center gap-3">
            <Checkbox checked={parentChecked} onCheckedChange={(v) => onParentChange(v === true)} />
            <span className="typography-15-medium text-semantic-text-on-bright-900">Select all fruits</span>
          </label>
          <div className="flex flex-col gap-3 pl-8">
            <label className="flex items-center gap-3">
              <Checkbox checked={child1} onCheckedChange={(v) => setChild1(v === true)} />
              <span className="typography-14-regular text-semantic-text-on-bright-800">Apple</span>
            </label>
            <label className="flex items-center gap-3">
              <Checkbox checked={child2} onCheckedChange={(v) => setChild2(v === true)} />
              <span className="typography-14-regular text-semantic-text-on-bright-800">Banana</span>
            </label>
            <label className="flex items-center gap-3">
              <Checkbox checked={child3} onCheckedChange={(v) => setChild3(v === true)} />
              <span className="typography-14-regular text-semantic-text-on-bright-800">Cherry</span>
            </label>
          </div>
        </div>
      </section>

      {/* ─── Controlled ─────────────────────────────────────────── */}
      <section id="checkbox-controlled" className="mb-12">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex items-center gap-4">
          <Checkbox checked={controlled} onCheckedChange={(v) => setControlled(v === true)} size="medium" />
          <span className="typography-14-regular text-semantic-text-on-bright-700">
            State: <strong>{controlled ? 'on' : 'off'}</strong>
          </span>
          <button
            type="button"
            className="typography-13-medium text-semantic-text-on-bright-500 underline underline-offset-2"
            onClick={() => setControlled((v) => !v)}
          >
            Toggle externally
          </button>
        </div>
      </section>

      {/* ─── Hit Area Demo ──────────────────────────────────────── */}
      <section id="checkbox-hit-area" className="mb-12">
        <SectionTitle>Hit Area — Invisible Inset</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mb-4">
          The visual square is 16/20/24px depending on size, but every checkbox has an additional
          <strong> 8px invisible padding</strong> on all sides for easier touch/click targets. The
          layout footprint stays equal to the visual size (negative margin compensates), so checkboxes
          align cleanly with adjacent atoms. The dotted box below visualizes the actual hit area.
        </p>
        <div className="flex items-center gap-12">
          {CHECKBOX_SIZES.map((size) => {
            const visual = size === 'xSmall' ? 16 : size === 'small' ? 20 : 24
            const hit = visual + 16
            return (
              <div key={size} className="flex flex-col items-center gap-3">
                <div
                  className="relative grid place-items-center"
                  style={{ width: hit, height: hit }}
                >
                  <div
                    className="absolute inset-0 border border-dashed border-semantic-neutral-black-alpha-300 rounded-[2px]"
                    aria-hidden
                  />
                  <Checkbox size={size} defaultChecked />
                </div>
                <span className="typography-12-regular text-semantic-text-on-bright-500">
                  {size} · visual {visual} · hit {hit}
                </span>
              </div>
            )
          })}
        </div>
        <p className="typography-12-regular text-semantic-text-on-bright-400 mt-4">
          When placing Checkbox next to other interactive atoms, use <code>gap-4</code> (16px) or
          larger to prevent hit area overlap.
        </p>
      </section>

      {/* ─── Form Integration ───────────────────────────────────── */}
      <section id="checkbox-form" className="mb-12">
        <SectionTitle>Form Integration</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <label className="flex items-center gap-3">
            <Checkbox name="newsletter" value="weekly" defaultChecked />
            <span className="typography-14-regular text-semantic-text-on-bright-800">Subscribe to weekly newsletter</span>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox name="terms" value="accepted" required />
            <span className="typography-14-regular text-semantic-text-on-bright-800">
              I accept the terms and conditions <span className="text-semantic-error-700">*</span>
            </span>
          </label>
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
      <section id="checkbox-with-label" className="mb-12">
        <SectionTitle>With Label</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mb-4">
          Checkbox is an atom — labels are composed externally via <code>&lt;label htmlFor&gt;</code>.
          Clicking the label toggles the checkbox. Use <code>gap-4</code> minimum between adjacent
          checkboxes to prevent hit area overlap.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <label htmlFor="cb-notif" className="flex items-start gap-3 cursor-pointer">
            <Checkbox id="cb-notif" size="medium" defaultChecked />
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">Push notifications</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                Receive alerts when something happens
              </span>
            </div>
          </label>
          <label htmlFor="cb-analytics" className="flex items-start gap-3 cursor-pointer">
            <Checkbox id="cb-analytics" size="medium" />
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">Anonymous analytics</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                Help us improve by sharing usage data
              </span>
            </div>
          </label>
        </div>
      </section>
    </div>
  )
}
