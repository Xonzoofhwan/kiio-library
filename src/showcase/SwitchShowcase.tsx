import { useState } from 'react'
import { Switch, SWITCH_SIZES, SWITCH_SHAPES } from '@/components/Switch'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const SWITCH_TOC: TocEntry[] = [
  { id: 'switch-shapes', label: 'Shapes' },
  { id: 'switch-sizes', label: 'Sizes' },
  { id: 'switch-states', label: 'States' },
  { id: 'switch-controlled', label: 'Controlled' },
  { id: 'switch-form', label: 'Form Integration' },
  { id: 'switch-with-label', label: 'With Label' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function SwitchShowcase() {
  const [controlled, setControlled] = useState(false)
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
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Switch</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Toggle switch built on Radix Switch. Two shapes with distinct interaction models —
          circular squeezes the knob on press, square slides the knob inward.
        </p>
      </div>

      {/* ─── Shapes ─────────────────────────────────────────────── */}
      <section id="switch-shapes" className="mb-12">
        <SectionTitle>Shapes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-y-4 gap-x-6 items-center max-w-fit">
          <div />
          <ColHeader>Off</ColHeader>
          <ColHeader>On</ColHeader>
          {SWITCH_SHAPES.map((shape) => (
            <div key={shape} className="contents">
              <RowHeader>{shape}</RowHeader>
              <Switch shape={shape} size="large" defaultChecked={false} />
              <Switch shape={shape} size="large" defaultChecked={true} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Sizes ──────────────────────────────────────────────── */}
      <section id="switch-sizes" className="mb-12">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-8">
          {SWITCH_SHAPES.map((shape) => (
            <div key={shape} className="flex flex-col gap-3">
              <ColHeader>{shape}</ColHeader>
              <div className="grid grid-cols-[auto_1fr_1fr] gap-y-4 gap-x-6 items-center max-w-fit">
                <div />
                <ColHeader>Off</ColHeader>
                <ColHeader>On</ColHeader>
                {SWITCH_SIZES.map((size) => (
                  <div key={size} className="contents">
                    <RowHeader>{size}</RowHeader>
                    <Switch shape={shape} size={size} defaultChecked={false} />
                    <Switch shape={shape} size={size} defaultChecked={true} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── States ─────────────────────────────────────────────── */}
      <section id="switch-states" className="mb-12">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-y-4 gap-x-6 items-center max-w-fit">
          <div />
          <ColHeader>Circular</ColHeader>
          <ColHeader>Square</ColHeader>

          <RowHeader>Default Off</RowHeader>
          <Switch shape="circular" size="large" />
          <Switch shape="square" size="large" />

          <RowHeader>Default On</RowHeader>
          <Switch shape="circular" size="large" defaultChecked />
          <Switch shape="square" size="large" defaultChecked />

          <RowHeader>Disabled Off</RowHeader>
          <Switch shape="circular" size="large" disabled />
          <Switch shape="square" size="large" disabled />

          <RowHeader>Disabled On</RowHeader>
          <Switch shape="circular" size="large" disabled defaultChecked />
          <Switch shape="square" size="large" disabled defaultChecked />
        </div>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mt-4">
          Hover, press, and focus states are interactive — try them with mouse and keyboard (Tab + Space).
        </p>
      </section>

      {/* ─── Controlled ─────────────────────────────────────────── */}
      <section id="switch-controlled" className="mb-12">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex items-center gap-4">
          <Switch
            checked={controlled}
            onCheckedChange={setControlled}
            size="large"
          />
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

      {/* ─── Form Integration ───────────────────────────────────── */}
      <section id="switch-form" className="mb-12">
        <SectionTitle>Form Integration</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
          <label className="flex items-center gap-3">
            <Switch name="notifications" value="enabled" defaultChecked />
            <span className="typography-14-regular text-semantic-text-on-bright-800">Email notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <Switch name="marketing" value="opted-in" />
            <span className="typography-14-regular text-semantic-text-on-bright-800">Marketing emails</span>
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
      <section id="switch-with-label" className="mb-12">
        <SectionTitle>With Label</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 mb-4">
          Switch is an atom — labels are composed externally via <code>&lt;label htmlFor&gt;</code>.
          Clicking the label toggles the switch.
        </p>
        <div className="flex flex-col gap-3 max-w-md">
          <label htmlFor="airplane" className="flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">Airplane mode</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                Disable all wireless connections
              </span>
            </div>
            <Switch id="airplane" size="medium" />
          </label>
          <label htmlFor="wifi" className="flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex flex-col">
              <span className="typography-15-medium text-semantic-text-on-bright-900">Wi-Fi</span>
              <span className="typography-13-regular text-semantic-text-on-bright-500">
                Connect to wireless networks
              </span>
            </div>
            <Switch id="wifi" size="medium" defaultChecked />
          </label>
        </div>
      </section>
    </div>
  )
}
