import { useState } from 'react'
import { SegmentBar, SegmentButton, SEGMENT_SIZES } from '@/components/SegmentBar'
import type { SegmentSize } from '@/components/SegmentBar'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SpecLabel } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SEGMENTBAR_TOC: TocEntry[] = [
  { id: 'component-segmentbar',     label: 'SegmentBar',         level: 1 },
  { id: 'segment-sizes',            label: 'Sizes'                        },
  { id: 'segment-shape',            label: 'Shape'                        },
  { id: 'segment-width',            label: 'Width Mode'                   },
  { id: 'segment-icons',            label: 'With Icons'                   },
  { id: 'segment-states',           label: 'States'                       },
  { id: 'segment-controlled',       label: 'Controlled'                   },
]

/* ─── Size spec ───────────────────────────────────────────────────────────── */

const SIZE_SPECS: Record<SegmentSize, { height: string; font: string }> = {
  large:  { height: '48px', font: '17 SB' },
  medium: { height: '36px', font: '16 M' },
  small:  { height: '28px', font: '14 M' },
  xSmall: { height: '20px', font: '13 M' },
}

/* ─── Demo icons (inline SVG) ─────────────────────────────────────────────── */

function GridIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="6" height="6" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
      <path d="M6 4h9M6 9h9M6 14h9M3 4h0M3 9h0M3 14h0" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="8" width="4" height="8" rx="0.5" />
      <rect x="7" y="4" width="4" height="12" rx="0.5" />
      <rect x="12" y="2" width="4" height="14" rx="0.5" />
    </svg>
  )
}

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SegmentBarShowcase() {
  const [sizeValues, setSizeValues] = useState<Record<SegmentSize, string>>({
    large: 'all', medium: 'all', small: 'all', xSmall: 'all',
  })
  const [shapeSquare, setShapeSquare] = useState('tab1')
  const [shapeCircular, setShapeCircular] = useState('tab1')
  const [widthFixed, setWidthFixed] = useState('day')
  const [widthHug, setWidthHug] = useState('day')
  const [iconVal, setIconVal] = useState('grid')
  const [disabledVal, setDisabledVal] = useState('opt1')
  const [controlledVal, setControlledVal] = useState('overview')

  return (
    <>
      <h1
        id="component-segmentbar"
        className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6"
      >
        SegmentBar
      </h1>

      {/* Sizes */}
      <section id="segment-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-6 max-w-lg">
          {SEGMENT_SIZES.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-20 flex flex-col items-end gap-0.5 shrink-0">
                <SpecLabel>{s}</SpecLabel>
                <span className="typography-12-regular text-semantic-text-on-bright-400">
                  {SIZE_SPECS[s].height} / {SIZE_SPECS[s].font}
                </span>
              </div>
              <SegmentBar
                size={s}
                value={sizeValues[s]}
                onValueChange={(v) => setSizeValues((prev) => ({ ...prev, [s]: v }))}
                aria-label={`Size ${s}`}
              >
                <SegmentButton value="all">전체</SegmentButton>
                <SegmentButton value="active">활성</SegmentButton>
                <SegmentButton value="done">완료</SegmentButton>
              </SegmentBar>
            </div>
          ))}
        </div>
      </section>

      {/* Shape */}
      <section id="segment-shape" className="mb-12 scroll-mt-6">
        <SectionTitle>Shape</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <div>
            <SpecLabel>Square (default)</SpecLabel>
            <div className="mt-2">
              <SegmentBar shape="square" value={shapeSquare} onValueChange={setShapeSquare} aria-label="Shape square">
                <SegmentButton value="tab1">Tab 1</SegmentButton>
                <SegmentButton value="tab2">Tab 2</SegmentButton>
                <SegmentButton value="tab3">Tab 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>Circular</SpecLabel>
            <div className="mt-2">
              <SegmentBar shape="circular" value={shapeCircular} onValueChange={setShapeCircular} aria-label="Shape circular">
                <SegmentButton value="tab1">Tab 1</SegmentButton>
                <SegmentButton value="tab2">Tab 2</SegmentButton>
                <SegmentButton value="tab3">Tab 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
        </div>
      </section>

      {/* Width Mode */}
      <section id="segment-width" className="mb-12 scroll-mt-6">
        <SectionTitle>Width Mode</SectionTitle>
        <div className="flex flex-col gap-6 max-w-lg">
          <div>
            <SpecLabel>Fixed (균등 분할)</SpecLabel>
            <div className="mt-2">
              <SegmentBar width="fixed" value={widthFixed} onValueChange={setWidthFixed} aria-label="Width fixed">
                <SegmentButton value="day">일간</SegmentButton>
                <SegmentButton value="week">주간</SegmentButton>
                <SegmentButton value="month">월간</SegmentButton>
                <SegmentButton value="year">연간</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>Hug (콘텐츠 맞춤)</SpecLabel>
            <div className="mt-2">
              <SegmentBar width="hug" value={widthHug} onValueChange={setWidthHug} aria-label="Width hug">
                <SegmentButton value="day">일간</SegmentButton>
                <SegmentButton value="week">주간</SegmentButton>
                <SegmentButton value="month">월간</SegmentButton>
                <SegmentButton value="year">연간</SegmentButton>
              </SegmentBar>
            </div>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section id="segment-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <SegmentBar value={iconVal} onValueChange={setIconVal} aria-label="View mode">
            <SegmentButton value="grid" icon={<GridIcon />}>그리드</SegmentButton>
            <SegmentButton value="list" icon={<ListIcon />}>리스트</SegmentButton>
            <SegmentButton value="chart" icon={<ChartIcon />}>차트</SegmentButton>
          </SegmentBar>
          <SegmentBar size="small" shape="circular" value={iconVal} onValueChange={setIconVal} aria-label="View mode small">
            <SegmentButton value="grid" icon={<GridIcon />}>그리드</SegmentButton>
            <SegmentButton value="list" icon={<ListIcon />}>리스트</SegmentButton>
            <SegmentButton value="chart" icon={<ChartIcon />}>차트</SegmentButton>
          </SegmentBar>
        </div>
      </section>

      {/* States */}
      <section id="segment-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <div>
            <SpecLabel>Global disabled</SpecLabel>
            <div className="mt-2">
              <SegmentBar disabled defaultValue="opt1" aria-label="Disabled">
                <SegmentButton value="opt1">옵션 1</SegmentButton>
                <SegmentButton value="opt2">옵션 2</SegmentButton>
                <SegmentButton value="opt3">옵션 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>Individual disabled (옵션 3)</SpecLabel>
            <div className="mt-2">
              <SegmentBar value={disabledVal} onValueChange={setDisabledVal} aria-label="Partial disabled">
                <SegmentButton value="opt1">옵션 1</SegmentButton>
                <SegmentButton value="opt2">옵션 2</SegmentButton>
                <SegmentButton value="opt3" disabled>옵션 3</SegmentButton>
              </SegmentBar>
            </div>
          </div>
          <div>
            <SpecLabel>2개 항목 (divider 없음)</SpecLabel>
            <div className="mt-2">
              <SegmentBar defaultValue="on" aria-label="Toggle">
                <SegmentButton value="on">켜기</SegmentButton>
                <SegmentButton value="off">끄기</SegmentButton>
              </SegmentBar>
            </div>
          </div>
        </div>
      </section>

      {/* Controlled */}
      <section id="segment-controlled" className="mb-12 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          <SegmentBar value={controlledVal} onValueChange={setControlledVal} aria-label="Page">
            <SegmentButton value="overview">Overview</SegmentButton>
            <SegmentButton value="analytics">Analytics</SegmentButton>
            <SegmentButton value="settings">Settings</SegmentButton>
          </SegmentBar>
          <p className="typography-13-regular text-semantic-text-on-bright-500">
            선택됨: <strong className="typography-13-semibold">{controlledVal}</strong>
          </p>
        </div>
      </section>
    </>
  )
}
