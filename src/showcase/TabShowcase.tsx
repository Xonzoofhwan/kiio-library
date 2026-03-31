import { useState } from 'react'
import { Tab, TAB_SIZES } from '@/components/Tab'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const TAB_TOC: TocEntry[] = [
  { id: 'tab-circular', label: 'Circular' },
  { id: 'tab-circular-sizes', label: 'Circular Sizes' },
  { id: 'tab-underlined', label: 'Underlined' },
  { id: 'tab-controlled', label: 'Controlled' },
  { id: 'tab-with-panels', label: 'With Panels' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function TabShowcase() {
  const [controlledValue, setControlledValue] = useState('overview')

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Tab</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Navigation tabs with circular (chip) and underlined variants. Built on Radix Tabs for full keyboard accessibility.
        </p>
      </div>

      {/* ─── Circular ──────────────────────────────────────────── */}
      <section id="tab-circular" className="mb-12">
        <SectionTitle>Circular</SectionTitle>
        <div className="flex flex-col gap-6">
          <Tab defaultValue="chart" variant="circular" size="large">
            <Tab.List>
              <Tab.Item value="chart">Chart</Tab.Item>
              <Tab.Item value="performance">Performance</Tab.Item>
              <Tab.Item value="revenue">Revenue</Tab.Item>
              <Tab.Item value="assets">Assets</Tab.Item>
            </Tab.List>
          </Tab>

          <Tab defaultValue="all" variant="circular" size="large">
            <Tab.List>
              <Tab.Item value="all">All</Tab.Item>
              <Tab.Item value="active" badge>Active</Tab.Item>
              <Tab.Item value="completed">Completed</Tab.Item>
            </Tab.List>
          </Tab>
        </div>
      </section>

      {/* ─── Circular Sizes ────────────────────────────────────── */}
      <section id="tab-circular-sizes" className="mb-12">
        <SectionTitle>Circular Sizes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-6 items-center">
          {TAB_SIZES.map((size) => (
            <div key={size} className="contents">
              <RowHeader>{size}</RowHeader>
              <Tab defaultValue="tab1" variant="circular" size={size}>
                <Tab.List>
                  <Tab.Item value="tab1">Overview</Tab.Item>
                  <Tab.Item value="tab2">Details</Tab.Item>
                  <Tab.Item value="tab3">Settings</Tab.Item>
                </Tab.List>
              </Tab>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Underlined ────────────────────────────────────────── */}
      <section id="tab-underlined" className="mb-12">
        <SectionTitle>Underlined</SectionTitle>
        <div className="flex flex-col gap-6">
          <Tab defaultValue="volume" variant="underlined">
            <Tab.List>
              <Tab.Item value="volume">거래대금</Tab.Item>
              <Tab.Item value="amount">거래량</Tab.Item>
              <Tab.Item value="popular">인기</Tab.Item>
              <Tab.Item value="rising">급상승</Tab.Item>
              <Tab.Item value="falling">급하락</Tab.Item>
              <Tab.Item value="watchlist">관심</Tab.Item>
            </Tab.List>
          </Tab>

          <Tab defaultValue="overview" variant="underlined">
            <Tab.List>
              <Tab.Item value="overview">Overview</Tab.Item>
              <Tab.Item value="analytics" badge>Analytics</Tab.Item>
              <Tab.Item value="reports">Reports</Tab.Item>
            </Tab.List>
          </Tab>
        </div>
      </section>

      {/* ─── Controlled ────────────────────────────────────────── */}
      <section id="tab-controlled" className="mb-12">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <span className="typography-13-medium text-semantic-text-on-bright-500">Active:</span>
            <span className="typography-13-semibold text-semantic-text-on-bright-800">{controlledValue}</span>
          </div>

          <div className="flex flex-col gap-4">
            <Tab value={controlledValue} onValueChange={setControlledValue} variant="circular" size="large">
              <Tab.List>
                <Tab.Item value="overview">Overview</Tab.Item>
                <Tab.Item value="details">Details</Tab.Item>
                <Tab.Item value="settings">Settings</Tab.Item>
              </Tab.List>
            </Tab>

            <Tab value={controlledValue} onValueChange={setControlledValue} variant="underlined">
              <Tab.List>
                <Tab.Item value="overview">Overview</Tab.Item>
                <Tab.Item value="details">Details</Tab.Item>
                <Tab.Item value="settings">Settings</Tab.Item>
              </Tab.List>
            </Tab>
          </div>
        </div>
      </section>

      {/* ─── With Panels ──────────────────────────────────────── */}
      <section id="tab-with-panels" className="mb-12">
        <SectionTitle>With Panels</SectionTitle>
        <div className="flex flex-col gap-6">
          {/* Circular with panels */}
          <div className="rounded-3 border border-semantic-divider-solid-100 p-6">
            <Tab defaultValue="chart" variant="circular" size="large">
              <Tab.List>
                <Tab.Item value="chart">Chart</Tab.Item>
                <Tab.Item value="table">Table</Tab.Item>
                <Tab.Item value="summary">Summary</Tab.Item>
              </Tab.List>
              <Tab.Panel value="chart" className="mt-6">
                <div className="h-32 rounded-2 bg-semantic-neutral-black-alpha-50 flex items-center justify-center">
                  <span className="typography-14-medium text-semantic-text-on-bright-400">Chart content</span>
                </div>
              </Tab.Panel>
              <Tab.Panel value="table" className="mt-6">
                <div className="h-32 rounded-2 bg-semantic-neutral-black-alpha-50 flex items-center justify-center">
                  <span className="typography-14-medium text-semantic-text-on-bright-400">Table content</span>
                </div>
              </Tab.Panel>
              <Tab.Panel value="summary" className="mt-6">
                <div className="h-32 rounded-2 bg-semantic-neutral-black-alpha-50 flex items-center justify-center">
                  <span className="typography-14-medium text-semantic-text-on-bright-400">Summary content</span>
                </div>
              </Tab.Panel>
            </Tab>
          </div>

          {/* Underlined with panels */}
          <div className="rounded-3 border border-semantic-divider-solid-100 p-6">
            <Tab defaultValue="revenue" variant="underlined">
              <Tab.List>
                <Tab.Item value="revenue">Revenue</Tab.Item>
                <Tab.Item value="expenses">Expenses</Tab.Item>
                <Tab.Item value="profit">Profit</Tab.Item>
              </Tab.List>
              <Tab.Panel value="revenue" className="mt-6">
                <div className="h-32 rounded-2 bg-semantic-neutral-black-alpha-50 flex items-center justify-center">
                  <span className="typography-14-medium text-semantic-text-on-bright-400">Revenue content</span>
                </div>
              </Tab.Panel>
              <Tab.Panel value="expenses" className="mt-6">
                <div className="h-32 rounded-2 bg-semantic-neutral-black-alpha-50 flex items-center justify-center">
                  <span className="typography-14-medium text-semantic-text-on-bright-400">Expenses content</span>
                </div>
              </Tab.Panel>
              <Tab.Panel value="profit" className="mt-6">
                <div className="h-32 rounded-2 bg-semantic-neutral-black-alpha-50 flex items-center justify-center">
                  <span className="typography-14-medium text-semantic-text-on-bright-400">Profit content</span>
                </div>
              </Tab.Panel>
            </Tab>
          </div>
        </div>
      </section>
    </div>
  )
}
