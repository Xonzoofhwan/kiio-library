import React from 'react'
import { cn } from '@/lib/utils'

// ─── ShowcaseSection ──────────────────────────────────────────────────────────
interface ShowcaseSectionProps {
  id: string
  label: string
  description?: string
  children: React.ReactNode
}

export function ShowcaseSection({ id, label, description, children }: ShowcaseSectionProps) {
  return (
    <section id={id} className="mb-20 scroll-mt-6">
      <div className="mb-8">
        <h2 className="typography-20-semibold text-semantic-text-on-bright-900">{label}</h2>
        {description && (
          <p className="typography-14-regular text-semantic-text-on-bright-600 mt-1">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  )
}

// ─── Block (named group of related demos) ────────────────────────────────────
interface BlockProps {
  title: string
  children: React.ReactNode
  hint?: string
}

export function Block({ title, hint, children }: BlockProps) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-semantic-divider-solid-100">
        <p className="typography-14-semibold text-semantic-text-on-bright-800">{title}</p>
        {hint && <p className="typography-12-regular text-semantic-text-on-bright-400">{hint}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────
interface RowProps {
  label: string
  children: React.ReactNode
  className?: string
  vertical?: boolean
}

export function Row({ label, children, className, vertical }: RowProps) {
  return (
    <div>
      <p className="typography-12-regular text-semantic-text-on-bright-400 mb-2">{label}</p>
      <div className={cn(
        vertical ? 'flex flex-col gap-3' : 'flex flex-wrap gap-3 items-center',
        className,
      )}>
        {children}
      </div>
    </div>
  )
}

// ─── DimArea ──────────────────────────────────────────────────────────────────
interface DimAreaProps {
  children: React.ReactNode
  className?: string
}

export function DimArea({ children, className }: DimAreaProps) {
  return (
    <div
      className={cn(
        'bg-semantic-neutral-solid-950 rounded-3 p-5 flex flex-wrap gap-4 items-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── TokenChip ────────────────────────────────────────────────────────────────
interface TokenChipProps {
  value: string
  prefix?: string
  className?: string
}

export function TokenChip({ value, prefix, className }: TokenChipProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 typography-12-regular font-mono px-1.5 py-0.5 rounded-1',
      'bg-semantic-neutral-black-alpha-50 text-semantic-text-on-bright-600',
      className,
    )}>
      {prefix && <span className="text-semantic-text-on-bright-400">{prefix}</span>}
      {value}
    </span>
  )
}

// ─── ColorSwatch ──────────────────────────────────────────────────────────────
interface ColorSwatchProps {
  token: string
  bgClass: string
  label?: string
}

export function ColorSwatch({ bgClass, label, token }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('w-3 h-3 rounded-1 border border-semantic-divider-solid-100 flex-shrink-0', bgClass)} />
      {label && <span className="typography-12-regular text-semantic-text-on-bright-400">{label}</span>}
      <code className="typography-12-regular font-mono text-semantic-text-on-bright-600">{token}</code>
    </div>
  )
}

// ─── State Cell (button + token badges beneath) ───────────────────────────────
interface StateCellProps {
  label: string
  tokens?: string[]
  children: React.ReactNode
  /** Force-show the hover overlay on the button inside */
  forceHover?: boolean
  /** Force-show the active overlay on the button inside */
  forceActive?: boolean
  /** Use on-dim overlay instead of on-bright */
  overlayOnDim?: boolean
}

export function StateCell({ label, tokens, children, forceHover, forceActive, overlayOnDim }: StateCellProps) {
  const wrapperClass = cn({
    '[&_span[aria-hidden]]:!bg-semantic-state-on-bright-50  [&_span[aria-hidden]]:!pointer-events-none': forceHover && !overlayOnDim,
    '[&_span[aria-hidden]]:!bg-semantic-state-on-dim-50    [&_span[aria-hidden]]:!pointer-events-none': forceHover && overlayOnDim,
    '[&_span[aria-hidden]]:!bg-semantic-state-on-bright-70 [&_span[aria-hidden]]:!pointer-events-none': forceActive && !overlayOnDim,
    '[&_span[aria-hidden]]:!bg-semantic-state-on-dim-100   [&_span[aria-hidden]]:!pointer-events-none': forceActive && overlayOnDim,
  })

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <p className="typography-12-regular text-semantic-text-on-bright-400">{label}</p>
      <div className={wrapperClass}>
        <div className={cn((forceHover || forceActive) && 'pointer-events-none')}>
          {children}
        </div>
      </div>
      {tokens && tokens.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {tokens.map(t => <TokenChip key={t} value={t} />)}
        </div>
      )}
    </div>
  )
}

// ─── StateMatrix ──────────────────────────────────────────────────────────────
// A row of states for a single hierarchy variant
interface StateRowProps {
  label: string
  overlayOnDim?: boolean
  children: React.ReactNode
}

export function StateRow({ label, overlayOnDim, children }: StateRowProps) {
  const states = [
    { key: 'default', stateLabel: 'Default' },
    { key: 'hover',   stateLabel: 'Hover ↗', forceHover: true, overlayOnDim },
    { key: 'active',  stateLabel: 'Pressed ↓', forceActive: true, overlayOnDim },
    { key: 'disabled', stateLabel: 'Disabled' },
    { key: 'loading',  stateLabel: 'Loading' },
  ]

  const childArray = React.Children.toArray(children)

  return (
    <div className="flex gap-1 items-start">
      {/* row label */}
      <div className="w-24 flex-shrink-0 pt-6">
        <span className="typography-12-semibold text-semantic-text-on-bright-800">{label}</span>
      </div>
      {/* state cells */}
      {states.map((s, i) => {
        const child = childArray[i]
        return (
          <div key={s.key} className="flex flex-col gap-1.5 items-start min-w-[100px]">
            <p className="typography-12-regular text-semantic-text-on-bright-400">{s.stateLabel}</p>
            <div
              className={cn({
                '[&_span[aria-hidden]]:!bg-semantic-state-on-bright-50 [&_*]:pointer-events-none': s.forceHover && !s.overlayOnDim,
                '[&_span[aria-hidden]]:!bg-semantic-state-on-dim-50 [&_*]:pointer-events-none':   s.forceHover && s.overlayOnDim,
                '[&_span[aria-hidden]]:!bg-semantic-state-on-bright-70 [&_*]:pointer-events-none': s.forceActive && !s.overlayOnDim,
                '[&_span[aria-hidden]]:!bg-semantic-state-on-dim-100 [&_*]:pointer-events-none':  s.forceActive && s.overlayOnDim,
              })}
            >
              {child}
            </div>
          </div>
        )
      })}
    </div>
  )
}

