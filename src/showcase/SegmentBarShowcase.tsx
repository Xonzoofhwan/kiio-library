import { useState } from 'react'
import { SegmentBar, SEGMENT_BAR_SIZES, SEGMENT_BAR_SHAPES } from '@/components/SegmentBar'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const SEGMENT_BAR_TOC: TocEntry[] = [
  { id: 'segment-bar-sizes-fixed', label: 'Sizes (Fixed)' },
  { id: 'segment-bar-sizes-hug', label: 'Sizes (Hug)' },
  { id: 'segment-bar-shapes', label: 'Shapes' },
  { id: 'segment-bar-icons', label: 'With Icons' },
  { id: 'segment-bar-badge', label: 'With Badge' },
  { id: 'segment-bar-controlled', label: 'Controlled' },
  { id: 'segment-bar-disabled', label: 'Disabled' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function SegmentBarShowcase() {
  const [controlledValue, setControlledValue] = useState('tab1')

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">SegmentBar</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Single-selection segment control. Groups segment buttons where one item is always active. Used as radio-group-like selection or tab-like navigation.
        </p>
      </div>

      {/* ─── Sizes (Fixed) ────────────────────────────────────── */}
      <section id="segment-bar-sizes-fixed" className="mb-12">
        <SectionTitle>Sizes (Fixed)</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-6 items-center">
          {SEGMENT_BAR_SIZES.map((size) => (
            <div key={size} className="contents">
              <RowHeader>{size}</RowHeader>
              <SegmentBar defaultValue="seg1" size={size} shape="basic" fullWidth>
                <SegmentBar.Item value="seg1">Segment 1</SegmentBar.Item>
                <SegmentBar.Item value="seg2">Segment 2</SegmentBar.Item>
                <SegmentBar.Item value="seg3">Segment 3</SegmentBar.Item>
              </SegmentBar>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Sizes (Hug) ──────────────────────────────────────── */}
      <section id="segment-bar-sizes-hug" className="mb-12">
        <SectionTitle>Sizes (Hug)</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-6 items-center">
          {(['small', 'medium'] as const).map((size) => (
            <div key={size} className="contents">
              <RowHeader>{size}</RowHeader>
              <SegmentBar defaultValue="a" size={size} shape="basic" fullWidth={false}>
                <SegmentBar.Item value="a">Alpha</SegmentBar.Item>
                <SegmentBar.Item value="b">Beta</SegmentBar.Item>
                <SegmentBar.Item value="c">Gamma</SegmentBar.Item>
              </SegmentBar>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Shapes ───────────────────────────────────────────── */}
      <section id="segment-bar-shapes" className="mb-12">
        <SectionTitle>Shapes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-6 items-center">
          {SEGMENT_BAR_SHAPES.map((shape) => (
            <div key={shape} className="contents">
              <RowHeader>{shape}</RowHeader>
              <SegmentBar defaultValue="opt1" size="medium" shape={shape}>
                <SegmentBar.Item value="opt1">Option 1</SegmentBar.Item>
                <SegmentBar.Item value="opt2">Option 2</SegmentBar.Item>
                <SegmentBar.Item value="opt3">Option 3</SegmentBar.Item>
              </SegmentBar>
            </div>
          ))}
        </div>
      </section>

      {/* ─── With Icons ───────────────────────────────────────── */}
      <section id="segment-bar-icons" className="mb-12">
        <SectionTitle>With Icons</SectionTitle>
        <div className="flex flex-col gap-6">
          <SegmentBar defaultValue="chart" size="small" shape="basic">
            <SegmentBar.Item value="chart" icon={<Icon name="bar_chart" />}>Chart</SegmentBar.Item>
            <SegmentBar.Item value="table" icon={<Icon name="table_rows" />}>Table</SegmentBar.Item>
            <SegmentBar.Item value="grid" icon={<Icon name="grid_view" />}>Grid</SegmentBar.Item>
          </SegmentBar>

          <SegmentBar defaultValue="list" size="medium" shape="circular">
            <SegmentBar.Item value="list" icon={<Icon name="view_list" />}>List</SegmentBar.Item>
            <SegmentBar.Item value="board" icon={<Icon name="view_kanban" />}>Board</SegmentBar.Item>
            <SegmentBar.Item value="calendar" icon={<Icon name="calendar_month" />}>Calendar</SegmentBar.Item>
          </SegmentBar>
        </div>
      </section>

      {/* ─── With Badge ───────────────────────────────────────── */}
      <section id="segment-bar-badge" className="mb-12">
        <SectionTitle>With Badge</SectionTitle>
        <div className="flex flex-col gap-6">
          <SegmentBar defaultValue="inbox" size="medium" shape="basic">
            <SegmentBar.Item value="inbox" badge>Inbox</SegmentBar.Item>
            <SegmentBar.Item value="sent">Sent</SegmentBar.Item>
            <SegmentBar.Item value="drafts" badge>Drafts</SegmentBar.Item>
          </SegmentBar>

          <SegmentBar defaultValue="all" size="large" shape="basic">
            <SegmentBar.Item value="all">All</SegmentBar.Item>
            <SegmentBar.Item value="unread" badge>Unread</SegmentBar.Item>
            <SegmentBar.Item value="flagged" badge>Flagged</SegmentBar.Item>
          </SegmentBar>
        </div>
      </section>

      {/* ─── Controlled ───────────────────────────────────────── */}
      <section id="segment-bar-controlled" className="mb-12">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <span className="typography-13-medium text-semantic-text-on-bright-500">Active:</span>
            <span className="typography-13-semibold text-semantic-text-on-bright-800">{controlledValue}</span>
          </div>

          <SegmentBar value={controlledValue} onValueChange={setControlledValue} size="medium" shape="basic">
            <SegmentBar.Item value="tab1">Overview</SegmentBar.Item>
            <SegmentBar.Item value="tab2">Details</SegmentBar.Item>
            <SegmentBar.Item value="tab3">Settings</SegmentBar.Item>
          </SegmentBar>

          <SegmentBar value={controlledValue} onValueChange={setControlledValue} size="large" shape="circular">
            <SegmentBar.Item value="tab1">Overview</SegmentBar.Item>
            <SegmentBar.Item value="tab2">Details</SegmentBar.Item>
            <SegmentBar.Item value="tab3">Settings</SegmentBar.Item>
          </SegmentBar>
        </div>
      </section>

      {/* ─── Disabled ─────────────────────────────────────────── */}
      <section id="segment-bar-disabled" className="mb-12">
        <SectionTitle>Disabled</SectionTitle>
        <SegmentBar defaultValue="active" size="medium" shape="basic">
          <SegmentBar.Item value="active">Active</SegmentBar.Item>
          <SegmentBar.Item value="disabled1" disabled>Disabled</SegmentBar.Item>
          <SegmentBar.Item value="normal">Normal</SegmentBar.Item>
          <SegmentBar.Item value="disabled2" disabled>Disabled</SegmentBar.Item>
        </SegmentBar>
      </section>
    </div>
  )
}
