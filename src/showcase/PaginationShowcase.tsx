import { useState } from 'react'
import { Pagination, PAGINATION_TYPES, PAGINATION_ALIGNS, PAGINATION_COMPACTS } from '@/components/Pagination'
import type { PaginationType, PaginationAlign, PaginationCompact } from '@/components/Pagination'
import { SectionTitle } from './shared'
import type { TocEntry } from '@/components/showcase-layout'

/* ─── TOC ───────────────────────────────────────────────────────────────────── */

export const PAGINATION_TOC: TocEntry[] = [
  { id: 'pagination',    label: 'Pagination',    level: 1 },
  { id: 'playground',   label: 'Playground' },
  { id: 'types',        label: 'Types' },
  { id: 'align',        label: 'Align' },
  { id: 'compact',      label: 'Compact' },
  { id: 'ellipsis',     label: 'Ellipsis' },
  { id: 'per-page',     label: 'Per Page' },
  { id: 'minimal',      label: 'Minimal' },
  { id: 'states',       label: 'States' },
]

/* ─── Demo row ───────────────────────────────────────────────────────────────── */

function DemoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="typography-12-medium text-semantic-text-on-bright-400">{label}</span>
      <div className="p-4 rounded-2 border border-semantic-divider-solid-100 bg-semantic-background-0">
        {children}
      </div>
    </div>
  )
}

/* ─── Controlled Pagination demo ────────────────────────────────────────────── */

function PaginationDemo({
  type,
  align,
  compact,
  showJumpButtons,
  showPerPage,
  totalPages,
  background,
  totalItems,
}: {
  type?: PaginationType
  align?: PaginationAlign
  compact?: PaginationCompact
  showJumpButtons?: boolean
  showPerPage?: boolean
  totalPages?: number
  background?: boolean
  totalItems?: number
}) {
  const [page, setPage] = useState(4)
  const [pageSize, setPageSize] = useState(20)
  const pages = totalPages ?? 10

  return (
    <Pagination
      page={page}
      totalPages={pages}
      onPageChange={setPage}
      type={type}
      align={align}
      compact={compact}
      showJumpButtons={showJumpButtons}
      showPerPage={showPerPage}
      pageSize={pageSize}
      pageSizeOptions={[10, 20, 50, 100]}
      onPageSizeChange={setPageSize}
      background={background}
      totalItems={totalItems}
    />
  )
}

/* ─── Showcase ───────────────────────────────────────────────────────────────── */

export function PaginationShowcase() {
  /* Playground state */
  const [pgType, setPgType]               = useState<PaginationType>('numbered')
  const [pgAlign, setPgAlign]             = useState<PaginationAlign>('right')
  const [pgCompact, setPgCompact]         = useState<PaginationCompact>('compact')
  const [pgJump, setPgJump]               = useState(false)
  const [pgPerPage, setPgPerPage]         = useState(false)
  const [pgPage, setPgPage]               = useState(4)
  const [pgPageSize, setPgPageSize]       = useState(20)

  return (
    <div className="flex flex-col gap-16">

      {/* ── Header ── */}
      <div id="pagination">
        <h1 className="typography-28-bold text-semantic-text-on-bright-900 mb-2">Pagination</h1>
        <p className="typography-15-regular text-semantic-text-on-bright-500">
          테이블, 리스트, 캐러셀 하단에 배치하는 페이지네이션. 4가지 타입(numbered, overflow, legacyMethod, minimal)과 다양한 옵션을 지원하는 controlled 컴포넌트.
        </p>
      </div>

      {/* ── Playground ── */}
      <section id="playground" className="flex flex-col gap-6">
        <SectionTitle>Playground</SectionTitle>

        {/* Controls */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 p-5 rounded-2 bg-semantic-background-50 border border-semantic-divider-solid-100">
          <div className="flex flex-col gap-1.5">
            <span className="typography-12-medium text-semantic-text-on-bright-500">type</span>
            <div className="flex gap-1">
              {PAGINATION_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setPgType(t)}
                  className={`px-2 py-1 rounded-1.5 typography-12-medium transition-colors duration-fast ease-enter cursor-pointer ${pgType === t ? 'bg-semantic-primary-500 text-semantic-neutral-white-alpha-950' : 'bg-semantic-neutral-black-alpha-70 text-semantic-text-on-bright-700 hover:bg-semantic-state-on-bright-70'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {pgType !== 'minimal' && pgType !== 'legacyMethod' && (
            <div className="flex flex-col gap-1.5">
              <span className="typography-12-medium text-semantic-text-on-bright-500">align</span>
              <div className="flex gap-1">
                {PAGINATION_ALIGNS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setPgAlign(a)}
                    className={`px-2 py-1 rounded-1.5 typography-12-medium transition-colors duration-fast ease-enter cursor-pointer ${pgAlign === a ? 'bg-semantic-primary-500 text-semantic-neutral-white-alpha-950' : 'bg-semantic-neutral-black-alpha-70 text-semantic-text-on-bright-700 hover:bg-semantic-state-on-bright-70'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {pgType === 'numbered' && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="typography-12-medium text-semantic-text-on-bright-500">compact</span>
                <div className="flex gap-1">
                  {PAGINATION_COMPACTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setPgCompact(c)}
                      className={`px-2 py-1 rounded-1.5 typography-12-medium transition-colors duration-fast ease-enter cursor-pointer ${pgCompact === c ? 'bg-semantic-primary-500 text-semantic-neutral-white-alpha-950' : 'bg-semantic-neutral-black-alpha-70 text-semantic-text-on-bright-700 hover:bg-semantic-state-on-bright-70'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="typography-12-medium text-semantic-text-on-bright-500">showJumpButtons</span>
                <button
                  onClick={() => setPgJump(!pgJump)}
                  className={`px-2 py-1 rounded-1.5 typography-12-medium transition-colors duration-fast ease-enter cursor-pointer w-fit ${pgJump ? 'bg-semantic-primary-500 text-semantic-neutral-white-alpha-950' : 'bg-semantic-neutral-black-alpha-70 text-semantic-text-on-bright-700 hover:bg-semantic-state-on-bright-70'}`}
                >
                  {pgJump ? 'true' : 'false'}
                </button>
              </div>
            </>
          )}

          {(pgType === 'numbered' || pgType === 'overflow') && (
            <div className="flex flex-col gap-1.5">
              <span className="typography-12-medium text-semantic-text-on-bright-500">showPerPage</span>
              <button
                onClick={() => setPgPerPage(!pgPerPage)}
                className={`px-2 py-1 rounded-1.5 typography-12-medium transition-colors duration-fast ease-enter cursor-pointer w-fit ${pgPerPage ? 'bg-semantic-primary-500 text-semantic-neutral-white-alpha-950' : 'bg-semantic-neutral-black-alpha-70 text-semantic-text-on-bright-700 hover:bg-semantic-state-on-bright-70'}`}
              >
                {pgPerPage ? 'true' : 'false'}
              </button>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="p-6 rounded-2 border border-semantic-divider-solid-100 bg-semantic-background-0">
          <Pagination
            page={pgPage}
            totalPages={20}
            onPageChange={setPgPage}
            type={pgType}
            align={pgAlign}
            compact={pgCompact}
            showJumpButtons={pgJump}
            showPerPage={pgPerPage}
            pageSize={pgPageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageSizeChange={setPgPageSize}
            totalItems={pgPageSize * 20}
          />
        </div>
      </section>

      {/* ── Types ── */}
      <section id="types" className="flex flex-col gap-4">
        <SectionTitle>Types</SectionTitle>
        <div className="flex flex-col gap-3">
          <DemoRow label="numbered">
            <PaginationDemo type="numbered" />
          </DemoRow>
          <DemoRow label="overflow">
            <PaginationDemo type="overflow" />
          </DemoRow>
          <DemoRow label="legacyMethod">
            <PaginationDemo type="legacyMethod" totalItems={660} />
          </DemoRow>
          <DemoRow label="minimal">
            <PaginationDemo type="minimal" totalPages={5} />
          </DemoRow>
        </div>
      </section>

      {/* ── Align ── */}
      <section id="align" className="flex flex-col gap-4">
        <SectionTitle>Align</SectionTitle>
        <div className="flex flex-col gap-3">
          <DemoRow label="align=right (default)">
            <PaginationDemo type="numbered" align="right" />
          </DemoRow>
          <DemoRow label="align=center">
            <PaginationDemo type="numbered" align="center" />
          </DemoRow>
        </div>
      </section>

      {/* ── Compact ── */}
      <section id="compact" className="flex flex-col gap-4">
        <SectionTitle>Compact</SectionTitle>
        <div className="flex flex-col gap-3">
          <DemoRow label="compact=compact (1 sibling, default)">
            <PaginationDemo type="numbered" compact="compact" totalPages={20} />
          </DemoRow>
          <DemoRow label="compact=full (3 siblings)">
            <PaginationDemo type="numbered" compact="full" totalPages={20} />
          </DemoRow>
          <DemoRow label="compact=compact + showJumpButtons">
            <PaginationDemo type="numbered" compact="compact" showJumpButtons totalPages={20} />
          </DemoRow>
          <DemoRow label="compact=full + showJumpButtons">
            <PaginationDemo type="numbered" compact="full" showJumpButtons totalPages={20} />
          </DemoRow>
        </div>
      </section>

      {/* ── Ellipsis ── */}
      <section id="ellipsis" className="flex flex-col gap-4">
        <SectionTitle>Ellipsis Behavior</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 -mt-1">
          활성 페이지가 첫/마지막 페이지와 인접하지 않으면 ellipsis가 자동 표시됩니다.
        </p>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
          {[
            { label: 'page 1 of 20', page: 1 },
            { label: 'page 2 of 20', page: 2 },
            { label: 'page 3 of 20', page: 3 },
            { label: 'page 10 of 20', page: 10 },
            { label: 'page 18 of 20', page: 18 },
            { label: 'page 19 of 20', page: 19 },
            { label: 'page 20 of 20', page: 20 },
          ].map(({ label, page: p }) => (
            <EllipsisRow key={label} label={label} page={p} totalPages={20} />
          ))}
        </div>
      </section>

      {/* ── Per Page ── */}
      <section id="per-page" className="flex flex-col gap-4">
        <SectionTitle>Per Page</SectionTitle>
        <div className="flex flex-col gap-3">
          <DemoRow label="numbered + showPerPage">
            <PaginationDemo type="numbered" showPerPage />
          </DemoRow>
          <DemoRow label="overflow + showPerPage">
            <PaginationDemo type="overflow" showPerPage />
          </DemoRow>
        </div>
      </section>

      {/* ── Minimal ── */}
      <section id="minimal" className="flex flex-col gap-4">
        <SectionTitle>Minimal</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-500 -mt-1">
          캐러셀 / 배너에 사용하는 점 인디케이터. <code>background=true</code>로 반투명 배경 pill을 추가할 수 있습니다.
        </p>
        <div className="flex flex-col gap-3">
          <DemoRow label="background=false (default)">
            <PaginationDemo type="minimal" totalPages={5} background={false} />
          </DemoRow>
          <DemoRow label="background=true">
            <div className="rounded-2 bg-semantic-neutral-solid-200 p-6">
              <PaginationDemo type="minimal" totalPages={5} background />
            </div>
          </DemoRow>
        </div>
      </section>

      {/* ── States ── */}
      <section id="states" className="flex flex-col gap-4">
        <SectionTitle>Edge States</SectionTitle>
        <div className="flex flex-col gap-3">
          <DemoRow label="First page — prev disabled">
            <FirstLastDemo page={1} totalPages={10} />
          </DemoRow>
          <DemoRow label="Last page — next disabled">
            <FirstLastDemo page={10} totalPages={10} />
          </DemoRow>
          <DemoRow label="Single page">
            <FirstLastDemo page={1} totalPages={1} />
          </DemoRow>
          <DemoRow label="Two pages">
            <FirstLastDemo page={1} totalPages={2} />
          </DemoRow>
        </div>
      </section>

    </div>
  )
}

/* ─── Ellipsis static row ─────────────────────────────────────────────────── */

function EllipsisRow({ label, page, totalPages }: { label: string; page: number; totalPages: number }) {
  const [currentPage, setCurrentPage] = useState(page)
  return (
    <>
      <span className="typography-12-medium text-semantic-text-on-bright-400 whitespace-nowrap">{label}</span>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        type="numbered"
        align="right"
      />
    </>
  )
}

function FirstLastDemo({ page: initialPage, totalPages }: { page: number; totalPages: number }) {
  const [page, setPage] = useState(initialPage)
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      type="numbered"
      align="right"
      showJumpButtons
    />
  )
}
