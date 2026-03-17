import { useState, useContext } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableHeadSelect,
  TableCellSelect,
  TableCellButton,
  TableEmpty,
  TableRowActions,
  TABLE_CELL_EMPHASIZES,
  TABLE_CELL_ALIGNS,
  TABLE_DENSITIES,
  TABLE_DIVIDERS,
} from '@/components/Table'
import type { TableDensity, TableDivider } from '@/components/Table'
import { BadgeLabel } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
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
import { extractHeader } from './spec-utils'
import type { PropRow } from './spec-utils'
import tableSpec from '../../specs/table.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(tableSpec)

/**
 * Extract props from each subComponent in the table spec.
 * The spec uses a Record<string, { props: Record<string, ...> }> format.
 */
function extractTableSubComponentProps(): { name: string; props: PropRow[] }[] {
  const subs = tableSpec.subComponents as Record<
    string,
    { props?: Record<string, { type: string; default?: unknown; description?: string }> }
  >
  if (!subs) return []

  return Object.entries(subs)
    .filter(([, sub]) => sub.props && Object.keys(sub.props).length > 0)
    .map(([name, sub]) => ({
      name,
      props: Object.entries(sub.props!).map(([propName, prop]) => ({
        name: propName,
        type: prop.type,
        default: prop.default != null ? String(prop.default) : '\u2014',
        description: prop.description ?? '',
      })),
    }))
}

const subComponentPropGroups = extractTableSubComponentProps()

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TABLE_TOC: TocEntry[] = [
  { id: 'component-table',      label: 'Table',                       level: 1 },
  { id: 'table-playground',     label: 'Playground'                            },
  { id: 'table-anatomy',        label: 'Anatomy'                               },
  { id: 'table-basic',          label: 'Basic'                                 },
  { id: 'table-emphasis',       label: 'Emphasis'                              },
  { id: 'table-alignment',      label: 'Alignment'                             },
  { id: 'table-sorting',        label: 'Sorting'                               },
  { id: 'table-selection',      label: 'Selection (Select Cells)'              },
  { id: 'table-divider',        label: 'Divider'                               },
  { id: 'table-density',        label: 'Density'                               },
  { id: 'table-col-highlight',  label: 'Column Highlight'                      },
  { id: 'table-cell-button',    label: 'Cell Button'                           },
  { id: 'table-row-actions',    label: 'Row Actions'                           },
  { id: 'table-empty',          label: 'Empty State'                           },
  { id: 'table-badges',         label: 'With Badges'                           },
  { id: 'table-scroll',         label: 'Horizontal Scroll'                     },
  { id: 'table-sticky',         label: 'Sticky Columns'                        },
  { id: 'table-usage',          label: 'Usage Guidelines'                      },
  { id: 'table-props',          label: 'Props'                                 },
  { id: 'table-code',           label: 'Code Examples'                         },
  { id: 'table-tokens',         label: 'Design Tokens'                         },
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
  { id: 'SKTDEMO593-s12040c3', sessionStart: 'Nov 3, 2023, 8:00 AM',  duration: '6m 5s',  messages: 14 },
  { id: 'SKTDEMO159-s12040i9', sessionStart: 'Nov 25, 2023, 2:15 PM', duration: '4m 10s', messages: 14 },
  { id: 'SKTDEMO048-s12040h8', sessionStart: 'Nov 6, 2023, 5:30 PM',  duration: '5m 50s', messages: 14 },
  { id: 'SKTDEMO260-s12040j0', sessionStart: 'Nov 10, 2023, 9:00 AM', duration: '2m 45s', messages: 14 },
]

interface Extraction {
  name: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Failed' | 'Test-run'
  extractionId: string
  createdOn: string
  format: string
}

const EXTRACTIONS: Extraction[] = [
  { name: 'Test Examples for Chatting', status: 'Test-run',    extractionId: 'SKTDEMO377-211a4e16', createdOn: 'Dec 31, 2025', format: 'Categorical' },
  { name: 'Tone of Assistant Responses', status: 'In Progress', extractionId: 'SKTDEMO377-211a4e16', createdOn: 'Nov 15, 2025', format: 'Value'       },
  { name: 'Chat Dynamics: User Styles',  status: 'Completed',   extractionId: 'SKTDEMO377-f3db47fc', createdOn: 'Oct 10, 2025', format: 'Categorical' },
  { name: 'User Engagement Personas',    status: 'Completed',   extractionId: 'SKTDEMO377-3ed89f4f', createdOn: 'Sep 5, 2025',  format: 'Categorical' },
  { name: 'Chat Profiles: User Types',   status: 'Completed',   extractionId: 'SKTDEMO377-97efea4c', createdOn: 'Aug 20, 2025', format: 'Value'       },
  { name: 'Communication Styles Guide',  status: 'Pending',     extractionId: 'SKTDEMO377-9a3fcb4d', createdOn: 'Jul 15, 2025', format: 'Natural'     },
  { name: 'User Categories: Interaction', status: 'Completed',  extractionId: 'SKTDEMO377-8c4d2e5f', createdOn: 'Jun 25, 2025', format: 'Natural'     },
  { name: 'User Types in Chat Overview',  status: 'Failed',     extractionId: 'SKTDEMO377-6e4c3b2a', createdOn: 'Apr 1, 2025',  format: 'Value'       },
]

const STATUS_COLOR: Record<string, 'forest' | 'blue' | 'amber' | 'red-bright' | 'gray'> = {
  'Completed':   'forest',
  'In Progress': 'blue',
  'Pending':     'amber',
  'Failed':      'red-bright',
  'Test-run':    'gray',
}

/* ─── Sorting helper ──────────────────────────────────────────────────────── */

type SortDir = 'ascending' | 'descending' | false

function cycleSortDirection(current: SortDir): SortDir {
  if (current === false) return 'descending'
  if (current === 'descending') return 'ascending'
  return false
}

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    density:         { kind: 'select', options: TABLE_DENSITIES },
    divider:         { kind: 'select', options: TABLE_DIVIDERS },
    columnHighlight: { kind: 'boolean' },
  },
  defaults: {
    density: 'default',
    divider: 'border',
    columnHighlight: false,
  },
  render: (props) => (
    <Table
      density={props.density as TableDensity}
      divider={props.divider as TableDivider}
      columnHighlight={props.columnHighlight as boolean}
    >
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="center">Format</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {EXTRACTIONS.slice(0, 3).map(e => (
          <TableRow key={e.extractionId + e.name}>
            <TableCell emphasis="strong">{e.name}</TableCell>
            <TableCell>
              <BadgeLabel size="small" weight="light" color={STATUS_COLOR[e.status]}>
                {e.status}
              </BadgeLabel>
            </TableCell>
            <TableCell align="center">{e.format}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Displaying structured tabular data with rows and columns',
    'Sortable data lists with header controls',
    'Data-dense views with multiple attributes per item',
  ],
  dontUse: [
    { text: 'Simple key-value pairs', alternative: 'formfield', alternativeLabel: 'FormField' },
    { text: 'Card-based content layout' },
    { text: 'Navigation menu', alternative: 'sidenav', alternativeLabel: 'SideNav' },
  ],
  related: [
    { id: 'badge', label: 'Badge' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead align="right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell emphasis="strong">Alice</TableCell>
      <TableCell>alice@example.com</TableCell>
      <TableCell align="right">$120.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },
  {
    title: 'With sorting',
    code: `const [sortCol, setSortCol] = useState<string | null>(null)
const [sortDir, setSortDir] = useState<SortDir>(false)

<Table>
  <TableHeader>
    <TableRow>
      <TableHead
        sortDirection={sortCol === 'name' ? sortDir : false}
        onSort={() => handleSort('name')}
      >
        Name
      </TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sorted.map(item => (
      <TableRow key={item.id}>
        <TableCell emphasis="strong">{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    description: 'Sort state is consumer-managed. Sortable headers show sort icon on hover and highlight text when active.',
  },
  {
    title: 'Custom cell emphasis',
    code: `<TableCell emphasis="strong">Key identifier</TableCell>
<TableCell emphasis="normal">Regular content</TableCell>
<TableCell emphasis="weak">No data</TableCell>`,
    description: 'Three emphasis levels control text weight and color: strong (semibold + darkest), normal (regular + medium), weak (regular + lightest).',
  },
  {
    title: 'Dense layout',
    code: `<Table density="compact" divider="zebra">
  <TableHeader>
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell emphasis="strong">001</TableCell>
      <TableCell>100</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    description: 'Compact density reduces row height to 36px. Zebra divider alternates row backgrounds instead of borders.',
  },
]

/* ─── Token data: 3-layer chain ───────────────────────────────────────────── */

const colorTokenChains: TokenChainData[] = [
  {
    title: 'Row & Background Tokens',
    rows: [
      { component: '--comp-table-row-bg',          semantic: 'background-0',            lightPrimitive: 'gray-0',          lightHex: '#fdfefe', darkPrimitive: 'gray-950',       darkHex: '#1d1e22' },
      { component: '--comp-table-row-bg-selected',  semantic: 'primary-50',              lightPrimitive: 'purple-50',       lightHex: '#f5f0ff', darkPrimitive: 'purple-950',      darkHex: '#1f1630' },
      { component: '--comp-table-row-hover',         semantic: 'state-on-bright-50',      lightPrimitive: 'black-alpha-50',  lightHex: 'rgba(0,0,0,0.04)',  darkPrimitive: 'black-alpha-50', darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-table-row-active',        semantic: 'state-on-bright-70',      lightPrimitive: 'black-alpha-70',  lightHex: 'rgba(0,0,0,0.06)',  darkPrimitive: 'black-alpha-70', darkHex: 'rgba(0,0,0,0.06)' },
      { component: '--comp-table-header-bg',         semantic: 'background-50',           lightPrimitive: 'gray-50',         lightHex: '#f7f8f9', darkPrimitive: 'gray-900',       darkHex: '#282a2f' },
      { component: '--comp-table-row-bg-striped',    semantic: 'background-50',           lightPrimitive: 'gray-50',         lightHex: '#f7f8f9', darkPrimitive: 'gray-900',       darkHex: '#282a2f' },
      { component: '--comp-table-row-hover-opaque',  semantic: 'background-50',           lightPrimitive: 'gray-50',         lightHex: '#f7f8f9', darkPrimitive: 'gray-900',       darkHex: '#282a2f' },
    ],
  },
  {
    title: 'Text & Header Tokens',
    rows: [
      { component: '--comp-table-text-strong',         semantic: 'text-on-bright-950', lightPrimitive: 'gray-950', lightHex: '#1d1e22', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-table-text-normal',         semantic: 'text-on-bright-800', lightPrimitive: 'gray-800', lightHex: '#34363c', darkPrimitive: 'gray-100', darkHex: '#f0f1f3' },
      { component: '--comp-table-text-weak',           semantic: 'text-on-bright-400', lightPrimitive: 'gray-400', lightHex: '#a9acb3', darkPrimitive: 'gray-600', darkHex: '#505560' },
      { component: '--comp-table-header-text',         semantic: 'text-on-bright-600', lightPrimitive: 'gray-600', lightHex: '#505560', darkPrimitive: 'gray-400', darkHex: '#a9acb3' },
      { component: '--comp-table-header-text-sorted',  semantic: 'text-on-bright-900', lightPrimitive: 'gray-900', lightHex: '#282a2f', darkPrimitive: 'gray-70',  darkHex: '#e1e2e5' },
    ],
  },
  {
    title: 'Border & Divider Tokens',
    rows: [
      { component: '--comp-table-border-row',    semantic: 'divider-solid-100', lightPrimitive: 'gray-100', lightHex: '#f0f1f3', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-table-border-side',   semantic: 'divider-solid-100', lightPrimitive: 'gray-100', lightHex: '#f0f1f3', darkPrimitive: 'gray-900', darkHex: '#282a2f' },
      { component: '--comp-table-border-sticky', semantic: 'divider-solid-300', lightPrimitive: 'gray-300', lightHex: '#c3c5ca', darkPrimitive: 'gray-700', darkHex: '#404349' },
    ],
  },
  {
    title: 'Sort Icon & Interaction Tokens',
    rows: [
      { component: '--comp-table-sort-icon-color',        semantic: 'text-on-bright-400',     lightPrimitive: 'gray-400',       lightHex: '#a9acb3',            darkPrimitive: 'gray-600',       darkHex: '#505560' },
      { component: '--comp-table-sort-icon-color-active',  semantic: 'text-on-bright-900',     lightPrimitive: 'gray-900',       lightHex: '#282a2f',            darkPrimitive: 'gray-70',        darkHex: '#e1e2e5' },
      { component: '--comp-table-header-hover',            semantic: 'state-on-bright-50',     lightPrimitive: 'black-alpha-50', lightHex: 'rgba(0,0,0,0.04)',   darkPrimitive: 'black-alpha-50', darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-table-col-highlight',           semantic: 'state-on-bright-50',     lightPrimitive: 'black-alpha-50', lightHex: 'rgba(0,0,0,0.04)',   darkPrimitive: 'black-alpha-50', darkHex: 'rgba(0,0,0,0.04)' },
    ],
  },
  {
    title: 'Cell Button Tokens',
    rows: [
      { component: '--comp-table-btn-system',       semantic: 'text-on-bright-800',  lightPrimitive: 'gray-800',   lightHex: '#34363c',          darkPrimitive: 'gray-100',    darkHex: '#f0f1f3' },
      { component: '--comp-table-btn-system-hover',  semantic: 'state-on-bright-50',  lightPrimitive: 'black-alpha-50', lightHex: 'rgba(0,0,0,0.04)', darkPrimitive: 'black-alpha-50', darkHex: 'rgba(0,0,0,0.04)' },
      { component: '--comp-table-btn-brand',         semantic: 'primary-500',         lightPrimitive: 'purple-500', lightHex: '#7b61ff',          darkPrimitive: 'purple-500',  darkHex: '#7b61ff' },
      { component: '--comp-table-btn-brand-hover',   semantic: 'primary-50',          lightPrimitive: 'purple-50',  lightHex: '#f5f0ff',          darkPrimitive: 'purple-950',  darkHex: '#1f1630' },
      { component: '--comp-table-btn-error',         semantic: 'error-500',           lightPrimitive: 'red-500',    lightHex: '#ef4444',          darkPrimitive: 'red-500',     darkHex: '#ef4444' },
      { component: '--comp-table-btn-error-hover',   semantic: 'error-50',            lightPrimitive: 'red-50',     lightHex: '#fef2f2',          darkPrimitive: 'red-950',     darkHex: '#2d1515' },
    ],
  },
]

const sizeTokenGroups: TokenGroupData[] = [
  {
    title: 'Row & Cell Dimensions',
    scope: ':root',
    tokens: [
      { name: '--comp-table-row-height',              value: '44px' },
      { name: '--comp-table-row-height-compact',      value: '36px' },
      { name: '--comp-table-row-height-comfortable',  value: '52px' },
      { name: '--comp-table-cell-px',                 value: '12px' },
      { name: '--comp-table-cell-py',                 value: '10px' },
      { name: '--comp-table-cell-py-compact',         value: '6px' },
      { name: '--comp-table-cell-py-comfortable',     value: '14px' },
      { name: '--comp-table-cell-gap',                value: '4px' },
      { name: '--comp-table-cell-icon',               value: '20px' },
    ],
  },
  {
    title: 'Sort Icon & Select',
    scope: ':root',
    tokens: [
      { name: '--comp-table-sort-icon',       value: '16px' },
      { name: '--comp-table-select-width',    value: '44px' },
      { name: '--comp-table-select-size',     value: '18px' },
      { name: '--comp-table-row-actions-gap', value: '4px' },
    ],
  },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TableShowcase() {
  const navigate = useContext(NavigateContext)

  /* sorting state */
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(false)

  const handleSort = (col: string) => {
    if (sortCol === col) {
      const next = cycleSortDirection(sortDir)
      setSortDir(next)
      if (next === false) setSortCol(null)
    } else {
      setSortCol(col)
      setSortDir('descending')
    }
  }

  const sortedSessions = [...SESSIONS].sort((a, b) => {
    if (!sortCol || sortDir === false) return 0
    const dir = sortDir === 'ascending' ? 1 : -1
    if (sortCol === 'duration') return a.duration.localeCompare(b.duration) * dir
    if (sortCol === 'sessionStart') return a.sessionStart.localeCompare(b.sessionStart) * dir
    if (sortCol === 'messages') return (a.messages - b.messages) * dir
    return 0
  })

  /* selection state */
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === SESSIONS.length) setSelected(new Set())
    else setSelected(new Set(SESSIONS.map(s => s.id)))
  }

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-table"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="table-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Anatomy */}
      <ShowcaseSection
        id="table-anatomy"
        title="Anatomy"
        description="Compound component structure. All cell sub-components are reusable across Table and future DataTable."
      >
        <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed">
{`Table (root: div wrapper + table)
\u251c\u2500\u2500 TableHeader (thead)
\u2502   \u2514\u2500\u2500 TableRow (tr)
\u2502       \u251c\u2500\u2500 TableHeadSelect  \u2014 checkbox header cell
\u2502       \u2514\u2500\u2500 TableHead         \u2014 th, sortDirection + onSort
\u251c\u2500\u2500 TableBody (tbody)
\u2502   \u2514\u2500\u2500 TableRow (tr, selected?)
\u2502       \u251c\u2500\u2500 TableCellSelect   \u2014 checkbox body cell
\u2502       \u251c\u2500\u2500 TableCell          \u2014 td, emphasis + align
\u2502       \u251c\u2500\u2500 TableCellButton    \u2014 inline action button cell
\u2502       \u2514\u2500\u2500 TableRowActions    \u2014 hover-revealed action area
\u2514\u2500\u2500 TableEmpty (empty state row)`}
        </pre>
      </ShowcaseSection>

      {/* ══════════════════ Basic ══════════════════ */}
      <ShowcaseSection id="table-basic" title="Basic Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Session Start</TableHead>
              <TableHead align="center">Total Duration</TableHead>
              <TableHead align="center">Messages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SESSIONS.map(s => (
              <TableRow key={s.id}>
                <TableCell emphasis="strong">{s.id}</TableCell>
                <TableCell>{s.sessionStart}</TableCell>
                <TableCell align="center">{s.duration}</TableCell>
                <TableCell align="center">{s.messages}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Emphasis ══════════════════ */}
      <ShowcaseSection
        id="table-emphasis"
        title="Cell Emphasis"
        description="Three levels: Strong for key identifiers, Normal for general text, Weak for empty/placeholder."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emphasis</TableHead>
              <TableHead>Example</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TABLE_CELL_EMPHASIZES.map(emp => (
              <TableRow key={emp}>
                <TableCell emphasis="strong">{emp}</TableCell>
                <TableCell emphasis={emp}>
                  {emp === 'weak' ? 'No data' : 'SKTDEMO604-s12040d4'}
                </TableCell>
                <TableCell>
                  {emp === 'strong' && 'Key identifiers, primary info'}
                  {emp === 'normal' && 'General text content'}
                  {emp === 'weak' && 'Empty or placeholder state'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Alignment ══════════════════ */}
      <ShowcaseSection
        id="table-alignment"
        title="Cell Alignment"
        description="Left (default), Center, and Right alignment."
      >
        <Table>
          <TableHeader>
            <TableRow>
              {TABLE_CELL_ALIGNS.map(align => (
                <TableHead key={align} align={align}>{align}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {TABLE_CELL_ALIGNS.map(align => (
                <TableCell key={align} align={align}>Content</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Sorting ══════════════════ */}
      <ShowcaseSection
        id="table-sorting"
        title="Sorting"
        description="Click sortable headers to cycle: unsorted \u2192 descending \u2192 ascending \u2192 unsorted. Sortable headers show hover background."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead
                sortDirection={sortCol === 'sessionStart' ? sortDir : false}
                onSort={() => handleSort('sessionStart')}
              >
                Session Start
              </TableHead>
              <TableHead
                align="center"
                sortDirection={sortCol === 'duration' ? sortDir : false}
                onSort={() => handleSort('duration')}
              >
                Total Duration
              </TableHead>
              <TableHead
                align="center"
                sortDirection={sortCol === 'messages' ? sortDir : false}
                onSort={() => handleSort('messages')}
              >
                Messages
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSessions.map(s => (
              <TableRow key={s.id}>
                <TableCell emphasis="strong">{s.id}</TableCell>
                <TableCell>{s.sessionStart}</TableCell>
                <TableCell align="center">{s.duration}</TableCell>
                <TableCell align="center">{s.messages}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Selection (Select Cells) ══════════════════ */}
      <ShowcaseSection
        id="table-selection"
        title="Selection (Select Cells)"
        description="TableHeadSelect and TableCellSelect sub-components provide built-in checkbox cells with proper sizing and accessibility."
      >
        <p className="typography-13-medium text-semantic-text-on-bright-500 mb-3">
          {selected.size}/{SESSIONS.length} selected
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadSelect
                checked={selected.size === SESSIONS.length}
                indeterminate={selected.size > 0 && selected.size < SESSIONS.length}
                onChange={toggleAll}
              />
              <TableHead>Session ID</TableHead>
              <TableHead>Session Start</TableHead>
              <TableHead align="center">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SESSIONS.map(s => (
              <TableRow key={s.id} selected={selected.has(s.id)}>
                <TableCellSelect
                  checked={selected.has(s.id)}
                  onChange={() => toggleRow(s.id)}
                />
                <TableCell emphasis="strong">{s.id}</TableCell>
                <TableCell>{s.sessionStart}</TableCell>
                <TableCell align="center">{s.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Divider ══════════════════ */}
      <ShowcaseSection
        id="table-divider"
        title="Divider"
        description="Table divider prop selects row separation style: 'border' (horizontal lines, default) or 'zebra' (alternating row backgrounds)."
      >
        <div className="flex flex-col gap-8">
          {TABLE_DIVIDERS.map(divider => (
            <div key={divider}>
              <p className="typography-13-semibold text-semantic-text-on-bright-600 mb-2">{divider}</p>
              <Table divider={divider}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Session Start</TableHead>
                    <TableHead align="center">Duration</TableHead>
                    <TableHead align="center">Messages</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SESSIONS.map(s => (
                    <TableRow key={s.id}>
                      <TableCell emphasis="strong">{s.id}</TableCell>
                      <TableCell>{s.sessionStart}</TableCell>
                      <TableCell align="center">{s.duration}</TableCell>
                      <TableCell align="center">{s.messages}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* ══════════════════ Density ══════════════════ */}
      <ShowcaseSection
        id="table-density"
        title="Density"
        description="Table density prop controls row height: compact (36px), default (44px), comfortable (52px)."
      >
        <div className="flex flex-col gap-8">
          {TABLE_DENSITIES.map(density => (
            <div key={density}>
              <p className="typography-13-semibold text-semantic-text-on-bright-600 mb-2">{density}</p>
              <Table density={density}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Session Start</TableHead>
                    <TableHead align="center">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SESSIONS.slice(0, 3).map(s => (
                    <TableRow key={s.id}>
                      <TableCell emphasis="strong">{s.id}</TableCell>
                      <TableCell>{s.sessionStart}</TableCell>
                      <TableCell align="center">{s.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* ══════════════════ Column Highlight ══════════════════ */}
      <ShowcaseSection
        id="table-col-highlight"
        title="Column Highlight"
        description="Table columnHighlight prop enables column-wide background highlight when hovering header cells."
      >
        <Table columnHighlight>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Session Start</TableHead>
              <TableHead align="center">Total Duration</TableHead>
              <TableHead align="center">Messages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SESSIONS.map(s => (
              <TableRow key={s.id}>
                <TableCell emphasis="strong">{s.id}</TableCell>
                <TableCell>{s.sessionStart}</TableCell>
                <TableCell align="center">{s.duration}</TableCell>
                <TableCell align="center">{s.messages}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Cell Button ══════════════════ */}
      <ShowcaseSection
        id="table-cell-button"
        title="Cell Button"
        description="TableCellButton renders inline action buttons in three themes: system, brand, error."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Session Start</TableHead>
              <TableHead>System</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SESSIONS.slice(0, 3).map(s => (
              <TableRow key={s.id}>
                <TableCell emphasis="strong">{s.id}</TableCell>
                <TableCell>{s.sessionStart}</TableCell>
                <TableCellButton theme="system" onClick={() => {}}>Edit</TableCellButton>
                <TableCellButton theme="brand" onClick={() => {}}>View</TableCellButton>
                <TableCellButton theme="error" onClick={() => {}}>Delete</TableCellButton>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Row Actions ══════════════════ */}
      <ShowcaseSection
        id="table-row-actions"
        title="Row Actions"
        description="TableRowActions appears on row hover, pinned to the right edge. Useful for contextual actions."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Session Start</TableHead>
              <TableHead align="center">Duration</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {SESSIONS.map(s => (
              <TableRow key={s.id}>
                <TableCell emphasis="strong">{s.id}</TableCell>
                <TableCell>{s.sessionStart}</TableCell>
                <TableCell align="center">{s.duration}</TableCell>
                <TableRowActions>
                  <button className="px-2 py-1 rounded-2 typography-13-medium text-semantic-primary-500 hover:bg-semantic-primary-50 transition-colors duration-fast cursor-pointer bg-transparent border-none">
                    Edit
                  </button>
                  <button className="px-2 py-1 rounded-2 typography-13-medium text-semantic-error-500 hover:bg-semantic-error-50 transition-colors duration-fast cursor-pointer bg-transparent border-none">
                    Delete
                  </button>
                </TableRowActions>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Empty State ══════════════════ */}
      <ShowcaseSection
        id="table-empty"
        title="Empty State"
        description="TableEmpty renders a centered message when the table has no data."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Session Start</TableHead>
              <TableHead align="center">Duration</TableHead>
              <TableHead align="center">Messages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty colSpan={4}>No sessions found</TableEmpty>
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ With Badges ══════════════════ */}
      <ShowcaseSection
        id="table-badges"
        title="With Badges"
        description="Cells can contain any React content including Badge components for status indicators."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Extraction ID</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead>Format</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXTRACTIONS.map(e => (
              <TableRow key={e.extractionId + e.name}>
                <TableCell emphasis="strong">{e.name}</TableCell>
                <TableCell>
                  <BadgeLabel size="small" weight="light" color={STATUS_COLOR[e.status]}>
                    {e.status}
                  </BadgeLabel>
                </TableCell>
                <TableCell>{e.extractionId}</TableCell>
                <TableCell>{e.createdOn}</TableCell>
                <TableCell>{e.format}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseSection>

      {/* ══════════════════ Horizontal Scroll ══════════════════ */}
      <ShowcaseSection
        id="table-scroll"
        title="Horizontal Scroll"
        description="Horizontal scrolling is automatically enabled when table content exceeds container width."
      >
        <div className="max-w-[600px] border-y border-semantic-divider-solid-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Extraction ID</TableHead>
                <TableHead>Created on</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Included Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EXTRACTIONS.slice(0, 4).map(e => (
                <TableRow key={e.extractionId + e.name}>
                  <TableCell emphasis="strong" className="min-w-[240px]">{e.name}</TableCell>
                  <TableCell className="min-w-[120px]">
                    <BadgeLabel size="small" weight="light" color={STATUS_COLOR[e.status]}>
                      {e.status}
                    </BadgeLabel>
                  </TableCell>
                  <TableCell className="min-w-[200px]">{e.extractionId}</TableCell>
                  <TableCell className="min-w-[140px]">{e.createdOn}</TableCell>
                  <TableCell className="min-w-[120px]">{e.format}</TableCell>
                  <TableCell className="min-w-[200px]">
                    <div className="flex gap-1 flex-wrap">
                      <BadgeLabel size="small" weight="light" color="blue">Category A</BadgeLabel>
                      <BadgeLabel size="small" weight="light" color="purple">Category B</BadgeLabel>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ShowcaseSection>

      {/* ══════════════════ Sticky Columns ══════════════════ */}
      <ShowcaseSection
        id="table-sticky"
        title="Sticky Columns"
        description="sticky prop fixes columns to the left edge during horizontal scroll."
      >
        <div className="max-w-[600px] border-y border-semantic-divider-solid-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead sticky className="min-w-[200px]">Group Name</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[200px]">Extraction ID</TableHead>
                <TableHead className="min-w-[140px]">Created on</TableHead>
                <TableHead className="min-w-[120px]">Format</TableHead>
                <TableHead className="min-w-[200px]">Included Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EXTRACTIONS.slice(0, 5).map(e => (
                <TableRow key={e.extractionId + e.name}>
                  <TableCell sticky emphasis="strong" className="min-w-[200px]">{e.name}</TableCell>
                  <TableCell className="min-w-[120px]">
                    <BadgeLabel size="small" weight="light" color={STATUS_COLOR[e.status]}>
                      {e.status}
                    </BadgeLabel>
                  </TableCell>
                  <TableCell className="min-w-[200px]">{e.extractionId}</TableCell>
                  <TableCell className="min-w-[140px]">{e.createdOn}</TableCell>
                  <TableCell className="min-w-[120px]">{e.format}</TableCell>
                  <TableCell className="min-w-[200px]">
                    <div className="flex gap-1 flex-wrap">
                      <BadgeLabel size="small" weight="light" color="cyan">Label 1</BadgeLabel>
                      <BadgeLabel size="small" weight="light" color="emerald">Label 2</BadgeLabel>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ShowcaseSection>

      {/* 5. Usage Guidelines */}
      <ShowcaseSection id="table-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 6. Props Table (per sub-component) */}
      <ShowcaseSection id="table-props" title="Props">
        {subComponentPropGroups.map(group => (
          <PropsTable key={group.name} props={group.props} title={group.name} />
        ))}
      </ShowcaseSection>

      {/* 7. Code Examples */}
      <ShowcaseSection id="table-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 8. Design Tokens */}
      <ShowcaseSection
        id="table-tokens"
        title="Design Tokens"
        description="Component \u2192 Semantic \u2192 Primitive resolution chain. Color tokens switch by theme, size tokens are theme-agnostic."
      >
        <TokenChainTable chains={colorTokenChains} />
        <div className="mt-8">
          <TokensReference groups={sizeTokenGroups} />
        </div>
      </ShowcaseSection>
    </>
  )
}
