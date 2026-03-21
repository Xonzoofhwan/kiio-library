import { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@/components/DataTable'
import { BadgeLabel } from '@/components/Badge'
import {
  TABLE_DENSITIES,
  TABLE_DIVIDERS,
} from '@/components/Table'
import type { TableDensity, TableDivider } from '@/components/Table'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  PropsTable,
  CodeBlock,
  UsageGuidelines,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
} from './showcase-blocks'
import type { PropRow } from './spec-utils'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const DATA_TABLE_TOC: TocEntry[] = [
  { id: 'component-data-table',      label: 'DataTable',            level: 1 },
  { id: 'data-table-playground',     label: 'Playground'                     },
  { id: 'data-table-basic',          label: 'Basic'                          },
  { id: 'data-table-sortable',       label: 'Sortable Columns'               },
  { id: 'data-table-selection',      label: 'Row Selection'                  },
  { id: 'data-table-full',           label: 'Full Featured'                  },
  { id: 'data-table-empty',          label: 'Empty State'                    },
  { id: 'data-table-density',        label: 'Density'                        },
  { id: 'data-table-divider',        label: 'Divider'                        },
  { id: 'data-table-usage',          label: 'Usage Guidelines'               },
  { id: 'data-table-props',          label: 'Props'                          },
  { id: 'data-table-code',           label: 'Code Examples'                  },
]

/* ─── Sample data ─────────────────────────────────────────────────────────── */

interface Session {
  id: string
  sessionStart: string
  duration: string
  messages: number
}

const SESSIONS: Session[] = [
  { id: 'SKTDEMO604-s12040d4', sessionStart: 'Nov 8, 2023, 1:20 PM',  duration: '8m 22s', messages: 14 },
  { id: 'SKTDEMO593-s12040c3', sessionStart: 'Nov 3, 2023, 8:00 AM',  duration: '6m 5s',  messages: 9  },
  { id: 'SKTDEMO159-s12040i9', sessionStart: 'Nov 25, 2023, 2:15 PM', duration: '4m 10s', messages: 6  },
  { id: 'SKTDEMO048-s12040h8', sessionStart: 'Nov 6, 2023, 5:30 PM',  duration: '5m 50s', messages: 21 },
  { id: 'SKTDEMO260-s12040j0', sessionStart: 'Nov 10, 2023, 9:00 AM', duration: '2m 45s', messages: 4  },
]

interface Extraction {
  name: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Failed' | 'Test-run'
  extractionId: string
  createdOn: string
  format: string
}

const EXTRACTIONS: Extraction[] = [
  { name: 'Test Examples for Chatting',    status: 'Test-run',    extractionId: 'SKTDEMO377-211a4e16', createdOn: 'Dec 31, 2025', format: 'Categorical' },
  { name: 'Tone of Assistant Responses',   status: 'In Progress', extractionId: 'SKTDEMO377-211a4e16', createdOn: 'Nov 15, 2025', format: 'Value'       },
  { name: 'Chat Dynamics: User Styles',    status: 'Completed',   extractionId: 'SKTDEMO377-f3db47fc', createdOn: 'Oct 10, 2025', format: 'Categorical' },
  { name: 'User Engagement Personas',      status: 'Completed',   extractionId: 'SKTDEMO377-3ed89f4f', createdOn: 'Sep 5, 2025',  format: 'Categorical' },
  { name: 'Chat Profiles: User Types',     status: 'Completed',   extractionId: 'SKTDEMO377-97efea4c', createdOn: 'Aug 20, 2025', format: 'Value'       },
  { name: 'Communication Styles Guide',    status: 'Pending',     extractionId: 'SKTDEMO377-9a3fcb4d', createdOn: 'Jul 15, 2025', format: 'Natural'     },
  { name: 'User Categories: Interaction',  status: 'Completed',   extractionId: 'SKTDEMO377-8c4d2e5f', createdOn: 'Jun 25, 2025', format: 'Natural'     },
  { name: 'User Types in Chat Overview',   status: 'Failed',      extractionId: 'SKTDEMO377-6e4c3b2a', createdOn: 'Apr 1, 2025',  format: 'Value'       },
]

const STATUS_COLOR: Record<string, 'forest' | 'blue' | 'amber' | 'red-bright' | 'gray'> = {
  'Completed':   'forest',
  'In Progress': 'blue',
  'Pending':     'amber',
  'Failed':      'red-bright',
  'Test-run':    'gray',
}

/* ─── Column definitions ──────────────────────────────────────────────────── */

const sessionColumns: ColumnDef<Session>[] = [
  {
    id: 'id',
    header: 'Session ID',
    cell: row => row.id,
    emphasis: 'strong',
  },
  {
    id: 'sessionStart',
    header: 'Session Start',
    cell: row => row.sessionStart,
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: row => row.duration,
    align: 'center',
  },
  {
    id: 'messages',
    header: 'Messages',
    cell: row => row.messages,
    align: 'center',
  },
]

const sortableSessionColumns: ColumnDef<Session>[] = [
  {
    id: 'id',
    header: 'Session ID',
    cell: row => row.id,
    emphasis: 'strong',
  },
  {
    id: 'sessionStart',
    header: 'Session Start',
    cell: row => row.sessionStart,
    sortable: (a, b) => a.sessionStart.localeCompare(b.sessionStart),
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: row => row.duration,
    sortable: (a, b) => a.duration.localeCompare(b.duration),
    align: 'center',
  },
  {
    id: 'messages',
    header: 'Messages',
    cell: row => row.messages,
    sortable: (a, b) => a.messages - b.messages,
    align: 'center',
  },
]

const extractionColumns: ColumnDef<Extraction>[] = [
  {
    id: 'name',
    header: 'Group Name',
    cell: row => row.name,
    emphasis: 'strong',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: row => (
      <BadgeLabel size="small" weight="light" color={STATUS_COLOR[row.status]}>
        {row.status}
      </BadgeLabel>
    ),
  },
  {
    id: 'extractionId',
    header: 'Extraction ID',
    cell: row => row.extractionId,
  },
  {
    id: 'createdOn',
    header: 'Created On',
    cell: row => row.createdOn,
    sortable: (a, b) => a.createdOn.localeCompare(b.createdOn),
  },
  {
    id: 'format',
    header: 'Format',
    cell: row => row.format,
    align: 'center',
  },
]

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    density:         { kind: 'select', options: TABLE_DENSITIES },
    divider:         { kind: 'select', options: TABLE_DIVIDERS  },
    columnHighlight: { kind: 'boolean' },
    selectable:      { kind: 'boolean' },
  },
  defaults: {
    density: 'default',
    divider: 'border',
    columnHighlight: false,
    selectable: false,
  },
  render: (props) => (
    <DataTable
      columns={extractionColumns}
      data={EXTRACTIONS.slice(0, 4)}
      getRowId={row => (row as Extraction).extractionId + (row as Extraction).name}
      density={props.density as TableDensity}
      divider={props.divider as TableDivider}
      columnHighlight={props.columnHighlight as boolean}
      selectable={props.selectable as boolean}
    />
  ),
}

/* ─── Props tables ────────────────────────────────────────────────────────── */

const dataTableProps: PropRow[] = [
  { name: 'columns',            type: 'ColumnDef<TData>[]',                              default: '—',       description: '컬럼 정의 배열' },
  { name: 'data',               type: 'TData[]',                                         default: '—',       description: '행 데이터 배열' },
  { name: 'getRowId',           type: '(row: TData, index: number) => string',           default: '—',       description: '행 ID 추출 함수. 미지정 시 배열 인덱스 사용' },
  { name: 'selectable',         type: 'boolean',                                         default: 'false',   description: '행 선택 체크박스 컬럼 활성화' },
  { name: 'onSelectionChange',  type: '(rows: TData[], ids: Set<string>) => void',       default: '—',       description: '선택 변경 콜백' },
  { name: 'density',            type: "'compact' | 'default' | 'comfortable'",           default: "'default'", description: '행 높이 밀도' },
  { name: 'divider',            type: "'border' | 'zebra'",                              default: "'border'", description: '행 구분 스타일' },
  { name: 'columnHighlight',    type: 'boolean',                                         default: 'false',   description: '헤더 hover 시 해당 컬럼 셀 하이라이트' },
  { name: 'emptyMessage',       type: 'React.ReactNode',                                 default: "'No data'", description: '데이터 없을 때 표시할 내용' },
  { name: 'className',          type: 'string',                                          default: '—',       description: '루트 요소에 전달되는 className' },
]

const columnDefProps: PropRow[] = [
  { name: 'id',        type: 'string',                                          default: '—',         description: '컬럼 고유 식별자' },
  { name: 'header',    type: 'React.ReactNode',                                 default: '—',         description: '헤더 셀 내용' },
  { name: 'cell',      type: '(row: TData, index: number) => React.ReactNode', default: '—',         description: '셀 렌더 함수' },
  { name: 'sortable',  type: 'true | ((a: TData, b: TData) => number)',        default: '—',         description: 'true: 기본 String 비교 정렬. 함수: 커스텀 비교. undefined: 정렬 불가' },
  { name: 'align',     type: "'left' | 'center' | 'right'",                    default: "'left'",    description: '셀 텍스트 정렬' },
  { name: 'emphasis',  type: "'strong' | 'normal' | 'weak'",                   default: "'normal'",  description: '셀 텍스트 강조 수준' },
  { name: 'sticky',    type: 'boolean',                                         default: 'false',     description: 'position: sticky 고정 컬럼' },
  { name: 'width',     type: 'string | number',                                 default: '—',         description: '컬럼 너비 (CSS 값 또는 px 숫자)' },
]

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    '컬럼 정의와 데이터 배열을 분리하여 선언적으로 테이블을 구성할 때',
    '정렬·선택 로직을 직접 관리하지 않고 컴포넌트에 위임하고 싶을 때',
    'ViewModel이 준비한 도메인 객체 배열을 그대로 렌더링할 때',
  ],
  dontUse: [
    { text: '셀 병합, 다단 헤더 등 복잡한 레이아웃이 필요할 때', alternative: 'table', alternativeLabel: 'Table (primitive)' },
    { text: '정렬 상태를 상위 컴포넌트에서 직접 제어해야 할 때', alternative: 'table', alternativeLabel: 'Table (primitive)' },
    { text: '가상화(Virtualization)가 필요한 수만 행의 데이터' },
  ],
  related: [
    { id: 'table', label: 'Table' },
    { id: 'badge', label: 'Badge' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@/components/DataTable'

interface Session {
  id: string
  start: string
  duration: string
}

const columns: ColumnDef<Session>[] = [
  { id: 'id',       header: 'Session ID', cell: row => row.id, emphasis: 'strong' },
  { id: 'start',    header: 'Start',      cell: row => row.start },
  { id: 'duration', header: 'Duration',   cell: row => row.duration, align: 'center' },
]

<DataTable columns={columns} data={sessions} getRowId={row => row.id} />`,
  },
  {
    title: 'With sorting',
    code: `const columns: ColumnDef<Session>[] = [
  {
    id: 'start',
    header: 'Session Start',
    cell: row => row.start,
    // Custom comparator
    sortable: (a, b) => a.start.localeCompare(b.start),
  },
  {
    id: 'messages',
    header: 'Messages',
    cell: row => row.messages,
    // Numeric comparator
    sortable: (a, b) => a.messages - b.messages,
    align: 'center',
  },
]

// Sort state is fully managed by DataTable — no boilerplate needed
<DataTable columns={columns} data={sessions} getRowId={row => row.id} />`,
    description: 'Define sortable per column. DataTable manages sort state internally. Cycle: unsorted → descending → ascending → unsorted.',
  },
  {
    title: 'With row selection',
    code: `<DataTable
  columns={columns}
  data={sessions}
  getRowId={row => row.id}
  selectable
  onSelectionChange={(selectedRows, selectedIds) => {
    console.log('selected', selectedRows, selectedIds)
  }}
/>`,
    description: 'selectable adds checkbox column. onSelectionChange receives both the filtered data array and the Set<string> of selected IDs.',
  },
  {
    title: 'sortable: true (string fallback)',
    code: `const columns: ColumnDef<Item>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: row => row.name,
    // Uses String(cell(row)) for comparison — sufficient for plain text
    sortable: true,
  },
]`,
    description: "sortable: true uses String(cell(row, 0)).localeCompare(...) as a fallback. Prefer a custom comparator when cell returns a ReactNode or numeric value.",
  },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function DataTableShowcase() {
  const [selectionLog, setSelectionLog] = useState<string>('No selection yet')

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-data-table"
        name="DataTable"
        description="Column-schema–driven table. Pass columns and data — DataTable handles sorting and row selection internally. Built on top of the Table primitive components."
        classification="Smart"
      />

      {/* 2. Playground */}
      <ShowcaseSection id="data-table-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Basic */}
      <ShowcaseSection
        id="data-table-basic"
        title="Basic"
        description="Define columns once with cell render functions. DataTable renders every row without boilerplate."
      >
        <DataTable
          columns={sessionColumns}
          data={SESSIONS}
          getRowId={row => row.id}
        />
      </ShowcaseSection>

      {/* 4. Sortable Columns */}
      <ShowcaseSection
        id="data-table-sortable"
        title="Sortable Columns"
        description="Set sortable on any column — either true (String fallback) or a custom comparator. Click headers to cycle: unsorted → descending → ascending → unsorted."
      >
        <DataTable
          columns={sortableSessionColumns}
          data={SESSIONS}
          getRowId={row => row.id}
        />
      </ShowcaseSection>

      {/* 5. Row Selection */}
      <ShowcaseSection
        id="data-table-selection"
        title="Row Selection"
        description="selectable adds a checkbox column. onSelectionChange fires with the selected rows array and the Set of IDs."
      >
        <p className="typography-13-medium text-semantic-text-on-bright-500 mb-3">
          {selectionLog}
        </p>
        <DataTable
          columns={sessionColumns}
          data={SESSIONS}
          getRowId={row => row.id}
          selectable
          onSelectionChange={(_rows, ids) =>
            setSelectionLog(
              ids.size === 0
                ? 'No selection'
                : `${ids.size} selected: ${[...ids].join(', ')}`
            )
          }
        />
      </ShowcaseSection>

      {/* 6. Full Featured */}
      <ShowcaseSection
        id="data-table-full"
        title="Full Featured"
        description="Sorting + selection + rich cell content (Badge). Column definitions are defined once and shared across sorting and selection logic."
      >
        <DataTable
          columns={extractionColumns}
          data={EXTRACTIONS}
          getRowId={row => row.extractionId + row.name}
          selectable
          columnHighlight
        />
      </ShowcaseSection>

      {/* 7. Empty State */}
      <ShowcaseSection
        id="data-table-empty"
        title="Empty State"
        description="When data is an empty array, DataTable renders the emptyMessage spanning all columns."
      >
        <DataTable
          columns={sessionColumns}
          data={[]}
          getRowId={row => row.id}
          emptyMessage="No sessions found"
        />
      </ShowcaseSection>

      {/* 8. Density */}
      <ShowcaseSection
        id="data-table-density"
        title="Density"
        description="Passed through to the underlying Table. compact (36px) / default (44px) / comfortable (52px)."
      >
        <div className="flex flex-col gap-8">
          {TABLE_DENSITIES.map(density => (
            <div key={density}>
              <p className="typography-13-semibold text-semantic-text-on-bright-600 mb-2">{density}</p>
              <DataTable
                columns={sessionColumns}
                data={SESSIONS.slice(0, 3)}
                getRowId={row => row.id}
                density={density}
              />
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* 9. Divider */}
      <ShowcaseSection
        id="data-table-divider"
        title="Divider"
        description="border (default) draws horizontal lines between rows. zebra alternates row backgrounds."
      >
        <div className="flex flex-col gap-8">
          {TABLE_DIVIDERS.map(divider => (
            <div key={divider}>
              <p className="typography-13-semibold text-semantic-text-on-bright-600 mb-2">{divider}</p>
              <DataTable
                columns={sessionColumns}
                data={SESSIONS}
                getRowId={row => row.id}
                divider={divider}
              />
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* 10. Usage Guidelines */}
      <ShowcaseSection id="data-table-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={() => {}} />
      </ShowcaseSection>

      {/* 11. Props */}
      <ShowcaseSection id="data-table-props" title="Props">
        <PropsTable props={dataTableProps} title="DataTable" />
        <PropsTable props={columnDefProps} title="ColumnDef<TData>" />
      </ShowcaseSection>

      {/* 12. Code Examples */}
      <ShowcaseSection id="data-table-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>
    </>
  )
}
