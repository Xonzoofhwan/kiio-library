import { useState, useMemo, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

export type PlaygroundControlType =
  | { kind: 'select'; options: readonly string[] }
  | { kind: 'boolean' }
  | { kind: 'text' }
  | { kind: 'slot'; options: Record<string, ReactNode | null> }

export interface PlaygroundConfig {
  controls: Record<string, PlaygroundControlType>
  defaults: Record<string, unknown>
  render: (props: Record<string, unknown>) => ReactNode
}

export interface UsageGuidelineData {
  doUse: string[]
  dontUse: { text: string; alternative?: string; alternativeLabel?: string }[]
  related?: { id: string; label: string }[]
}

export interface CodeExampleData {
  title: string
  code: string
  description?: string
}

export interface TokenGroupData {
  title: string
  scope: string
  tokens: { name: string; value: string }[]
}

/* ═══════════════════════════════════════════════════════════════════════════
   ShowcaseHeader
   ═══════════════════════════════════════════════════════════════════════════ */

export function ShowcaseHeader({
  id,
  name,
  description,
  classification,
  groupName,
}: {
  id: string
  name: string
  description: string
  classification?: string
  groupName?: string
}) {
  return (
    <div id={id} className="flex flex-col gap-4 mb-8 scroll-mt-6">
      <div className="flex flex-col gap-1">
        {groupName && (
          <span className="typography-14-medium text-semantic-text-on-bright-400">
            {groupName}
          </span>
        )}
        <div className="flex items-center gap-3">
          <h1 className="typography-48-semibold text-semantic-text-on-bright-950">{name}</h1>
          {classification && (
            <span className="typography-12-medium text-semantic-emphasized-purple-500 bg-semantic-emphasized-purple-50 px-2 py-0.5 rounded-full">
              {classification}
            </span>
          )}
        </div>
      </div>
      <p className="typography-16-regular text-semantic-text-on-bright-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ShowcaseSection
   ═══════════════════════════════════════════════════════════════════════════ */

export function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-6">
      <h2 className="typography-16-semibold text-semantic-text-on-bright-800 mb-4">{title}</h2>
      {description && (
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">{description}</p>
      )}
      {children}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Playground
   ═══════════════════════════════════════════════════════════════════════════ */

export function Playground({ config }: { config: PlaygroundConfig }) {
  const [state, setState] = useState<Record<string, unknown>>({ ...config.defaults })

  const handleChange = (key: string, value: unknown) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  // Resolve slot values: string key → ReactNode
  const resolvedProps: Record<string, unknown> = { ...state }
  for (const [key, control] of Object.entries(config.controls)) {
    if (control.kind === 'slot') {
      resolvedProps[key] = control.options[state[key] as string] ?? null
    }
  }

  return (
    <div className="rounded-4 border border-semantic-divider-solid-100 overflow-hidden">
      {/* Preview */}
      <div className="flex items-center justify-center min-h-[200px] p-10 bg-semantic-background-50">
        {config.render(resolvedProps)}
      </div>

      {/* Controls */}
      <div className="border-t border-semantic-divider-solid-100 bg-semantic-background-0 px-5 py-4">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {Object.entries(config.controls).map(([key, control]) => (
            <PlaygroundControl
              key={key}
              label={key}
              control={control}
              value={state[key]}
              onChange={v => handleChange(key, v)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const selectClassName =
  'typography-13-regular text-semantic-text-on-bright-700 bg-semantic-background-0 border border-semantic-divider-solid-100 rounded-2 px-2 py-1 outline-none focus:ring-1 focus:ring-semantic-emphasized-purple-300'

function PlaygroundControl({
  label,
  control,
  value,
  onChange,
}: {
  label: string
  control: PlaygroundControlType
  value: unknown
  onChange: (v: unknown) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="typography-13-medium text-semantic-text-on-bright-500 select-none">
        {label}
      </span>

      {control.kind === 'boolean' && (
        <button
          type="button"
          role="switch"
          aria-checked={value as boolean}
          onClick={() => onChange(!(value as boolean))}
          className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-fast ease-enter cursor-pointer',
            (value as boolean) ? 'bg-semantic-emphasized-purple-500' : 'bg-semantic-neutral-solid-300',
          )}
        >
          <span className={cn(
            'inline-block h-4 w-4 rounded-full bg-white transition-transform duration-fast ease-enter',
            (value as boolean) ? 'translate-x-[18px]' : 'translate-x-[2px]',
          )} />
        </button>
      )}

      {control.kind === 'select' && (
        <select
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={selectClassName}
        >
          {control.options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {control.kind === 'slot' && (
        <select
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={selectClassName}
        >
          {Object.keys(control.options).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {control.kind === 'text' && (
        <input
          type="text"
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={cn(selectClassName, 'w-[140px]')}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   AnatomyBox
   ═══════════════════════════════════════════════════════════════════════════ */

export function AnatomyBox({
  label,
  children,
  className,
  dashed = true,
}: {
  label: string
  children?: ReactNode
  className?: string
  dashed?: boolean
}) {
  return (
    <div
      className={cn(
        'relative rounded-2 mt-3',
        dashed
          ? 'border border-dashed border-semantic-emphasized-purple-300'
          : 'border border-semantic-divider-solid-200',
        className,
      )}
    >
      <span className="absolute -top-2.5 left-2 px-1.5 bg-semantic-background-0 typography-12-medium text-semantic-emphasized-purple-500 whitespace-nowrap leading-none">
        {label}
      </span>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sorting primitives
   ═══════════════════════════════════════════════════════════════════════════ */

type SortDir = 'ascending' | 'descending' | false

function cycleSortDirection(current: SortDir): SortDir {
  if (current === false) return 'descending'
  if (current === 'descending') return 'ascending'
  return false
}

function ShowcaseSortIcon({ direction }: { direction: SortDir }) {
  const active = 'var(--semantic-emphasized-purple-500)'
  const inactive = 'var(--semantic-neutral-solid-400)'

  if (direction === 'ascending') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
        <path d="M8 4L12 9H4L8 4Z" fill={active} />
      </svg>
    )
  }
  if (direction === 'descending') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
        <path d="M8 12L4 7H12L8 12Z" fill={active} />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
      <path d="M8 4L11 7H5L8 4Z" fill={inactive} />
      <path d="M8 12L5 9H11L8 12Z" fill={inactive} />
    </svg>
  )
}

const thBaseClass = 'typography-13-semibold text-semantic-text-on-bright-500 py-2.5 whitespace-nowrap'

function SortableHeader({
  children,
  sortDirection,
  onSort,
  className,
}: {
  children: ReactNode
  sortDirection: SortDir
  onSort: () => void
  className?: string
}) {
  const isSorted = sortDirection === 'ascending' || sortDirection === 'descending'

  return (
    <th className={cn(thBaseClass, className)}>
      <button
        type="button"
        onClick={onSort}
        className="group/sort inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 m-0 font-inherit text-inherit outline-none"
      >
        <span className={cn(isSorted && 'text-semantic-emphasized-purple-500')}>{children}</span>
        <span
          className={cn(
            'transition-opacity duration-fast ease-enter',
            isSorted ? 'opacity-100' : 'opacity-0 group-hover/sort:opacity-100',
          )}
        >
          <ShowcaseSortIcon direction={sortDirection} />
        </span>
      </button>
    </th>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PropsTable (with sorting)
   ═══════════════════════════════════════════════════════════════════════════ */

import type { PropRow } from './spec-utils'

export function PropsTable({ props, title }: { props: PropRow[]; title?: string }) {
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(false)

  if (props.length === 0) return null

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

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return props
    const dir = sortDir === 'ascending' ? 1 : -1
    return [...props].sort((a, b) => {
      const key = sortCol as keyof PropRow
      return String(a[key]).localeCompare(String(b[key])) * dir
    })
  }, [props, sortCol, sortDir])

  return (
    <div className="mb-6">
      {title && (
        <h3 className="typography-14-semibold text-semantic-text-on-bright-700 mb-3">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-semantic-divider-solid-200">
              <SortableHeader
                sortDirection={sortCol === 'name' ? sortDir : false}
                onSort={() => handleSort('name')}
                className="pr-6"
              >
                Prop
              </SortableHeader>
              <th className={cn(thBaseClass, 'pr-6')}>Type</th>
              <SortableHeader
                sortDirection={sortCol === 'default' ? sortDir : false}
                onSort={() => handleSort('default')}
                className="pr-6"
              >
                Default
              </SortableHeader>
              <th className={thBaseClass}>Description</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(prop => (
              <tr key={prop.name} className="border-b border-semantic-divider-solid-50">
                <td className="typography-13-medium text-semantic-emphasized-purple-500 py-2.5 pr-6 font-mono whitespace-nowrap">
                  {prop.name}
                </td>
                <td className="typography-12-regular text-semantic-text-on-bright-600 py-2.5 pr-6 font-mono">
                  {prop.type}
                </td>
                <td className="typography-12-regular text-semantic-text-on-bright-400 py-2.5 pr-6 font-mono">
                  {prop.default}
                </td>
                <td className="typography-13-regular text-semantic-text-on-bright-600 py-2.5">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   CodeBlock
   ═══════════════════════════════════════════════════════════════════════════ */

export function CodeBlock({
  code,
  title,
  description,
}: {
  code: string
  title?: string
  description?: string
}) {
  return (
    <div className="rounded-2 border border-semantic-divider-solid-100 overflow-hidden mb-4">
      {title && (
        <div className="px-4 py-2.5 border-b border-semantic-divider-solid-100 bg-semantic-neutral-solid-50">
          <span className="typography-13-semibold text-semantic-text-on-bright-600">{title}</span>
          {description && (
            <p className="typography-12-regular text-semantic-text-on-bright-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      <pre className="px-4 py-3 bg-semantic-neutral-solid-50 overflow-x-auto">
        <code className="typography-13-regular text-semantic-text-on-bright-700 font-mono whitespace-pre leading-relaxed">
          {code.trim()}
        </code>
      </pre>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   UsageGuidelines
   ═══════════════════════════════════════════════════════════════════════════ */

const CheckCircleIcon = () => (
  <svg
    className="w-4 h-4 text-semantic-success-500 shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

const XCircleIcon = () => (
  <svg
    className="w-4 h-4 text-semantic-error-500 shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
)

export function UsageGuidelines({
  data,
  onNavigate,
}: {
  data: UsageGuidelineData
  onNavigate?: (id: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Do use */}
      <div>
        <h3 className="typography-14-semibold text-semantic-success-700 mb-3 flex items-center gap-2">
          <CheckCircleIcon />
          Use when
        </h3>
        <ul className="space-y-2 ml-6">
          {data.doUse.map((text, i) => (
            <li
              key={i}
              className="typography-14-regular text-semantic-text-on-bright-700 list-disc marker:text-semantic-success-400"
            >
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Don't use */}
      <div>
        <h3 className="typography-14-semibold text-semantic-error-700 mb-3 flex items-center gap-2">
          <XCircleIcon />
          Don&apos;t use when
        </h3>
        <ul className="space-y-2 ml-6">
          {data.dontUse.map((item, i) => (
            <li
              key={i}
              className="typography-14-regular text-semantic-text-on-bright-700 list-disc marker:text-semantic-error-400"
            >
              {item.text}
              {item.alternative && onNavigate && (
                <>
                  {' \u2192 '}
                  <button
                    onClick={() => onNavigate(item.alternative!)}
                    className="typography-14-medium text-semantic-emphasized-purple-500 hover:underline"
                  >
                    {item.alternativeLabel ?? item.alternative}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Related */}
      {data.related && data.related.length > 0 && (
        <div>
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-3">
            Related Components
          </h3>
          <div className="flex gap-2 flex-wrap">
            {data.related.map(r => (
              <button
                key={r.id}
                onClick={() => onNavigate?.(r.id)}
                className="typography-13-medium text-semantic-emphasized-purple-500 bg-semantic-emphasized-purple-50 hover:bg-semantic-emphasized-purple-100 px-3 py-1.5 rounded-full transition-colors duration-fast ease-enter"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TokensReference — simple name-value list (for size/shape tokens)
   ═══════════════════════════════════════════════════════════════════════════ */

export function TokensReference({ groups }: { groups: TokenGroupData[] }) {
  if (groups.length === 0) return null

  return (
    <div className="space-y-8">
      {groups.map(group => (
        <div key={group.title}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="typography-14-semibold text-semantic-text-on-bright-700">
              {group.title}
            </h3>
            <span className="typography-12-regular text-semantic-text-on-bright-400 font-mono bg-semantic-neutral-solid-50 px-2 py-0.5 rounded">
              {group.scope}
            </span>
          </div>
          <div className="border border-semantic-divider-solid-100 rounded-2 overflow-hidden">
            {group.tokens.map((token, i) => (
              <div
                key={token.name}
                className={cn(
                  'flex items-center justify-between px-4 py-2',
                  i !== group.tokens.length - 1 && 'border-b border-semantic-divider-solid-50',
                )}
              >
                <span className="typography-12-regular text-semantic-text-on-bright-700 font-mono">
                  {token.name}
                </span>
                <span className="typography-12-regular text-semantic-text-on-bright-400">
                  {token.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TokenChainTable — 3-layer token chain with light/dark comparison
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TokenChainRow {
  component: string
  semantic: string
  lightPrimitive: string
  lightHex: string
  darkPrimitive: string
  darkHex: string
}

export interface TokenChainData {
  title: string
  rows: TokenChainRow[]
}

function ColorDot({ hex }: { hex: string }) {
  if (hex === 'transparent') {
    return (
      <span className="inline-block w-3 h-3 rounded-full border border-dashed border-semantic-neutral-solid-300 shrink-0" />
    )
  }
  return (
    <span
      className="inline-block w-3 h-3 rounded-full border border-semantic-divider-solid-100 shrink-0"
      style={{ backgroundColor: hex }}
    />
  )
}

function TokenChainTableSection({ chain }: { chain: TokenChainData }) {
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

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return chain.rows
    const dir = sortDir === 'ascending' ? 1 : -1
    return [...chain.rows].sort((a, b) => {
      const key = sortCol as keyof TokenChainRow
      return String(a[key]).localeCompare(String(b[key])) * dir
    })
  }, [chain.rows, sortCol, sortDir])

  const chainThClass = 'typography-12-semibold text-semantic-text-on-bright-500 py-2 whitespace-nowrap'

  return (
    <div>
      <h3 className="typography-14-semibold text-semantic-text-on-bright-700 mb-3">
        {chain.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-semantic-divider-solid-200">
              <SortableHeader
                sortDirection={sortCol === 'component' ? sortDir : false}
                onSort={() => handleSort('component')}
                className="pr-4 typography-12-semibold"
              >
                Component
              </SortableHeader>
              <th className={cn(chainThClass, 'pr-4')}>Semantic</th>
              <th className={cn(chainThClass, 'pr-4')}>Light</th>
              <th className={chainThClass}>Dark</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => (
              <tr key={row.component} className="border-b border-semantic-divider-solid-50">
                <td className="typography-12-regular text-semantic-text-on-bright-700 font-mono py-2 pr-4 whitespace-nowrap">
                  {row.component}
                </td>
                <td className="typography-12-regular text-semantic-text-on-bright-500 font-mono py-2 pr-4 whitespace-nowrap">
                  {row.semantic}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-1.5">
                    <ColorDot hex={row.lightHex} />
                    <span className="typography-12-regular text-semantic-text-on-bright-500 font-mono">
                      {row.lightPrimitive}
                    </span>
                    <span className="typography-12-regular text-semantic-text-on-bright-400">
                      {row.lightHex}
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1.5">
                    <ColorDot hex={row.darkHex} />
                    <span className="typography-12-regular text-semantic-text-on-bright-500 font-mono">
                      {row.darkPrimitive}
                    </span>
                    <span className="typography-12-regular text-semantic-text-on-bright-400">
                      {row.darkHex}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TokenChainTable({ chains }: { chains: TokenChainData[] }) {
  if (chains.length === 0) return null

  return (
    <div className="space-y-8">
      {chains.map(chain => (
        <TokenChainTableSection key={chain.title} chain={chain} />
      ))}
    </div>
  )
}
