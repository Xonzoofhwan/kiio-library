import { cn } from '@/lib/utils'

/* ─── Helper UI components ────────────────────────────────────────────────── */

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="typography-16-semibold text-semantic-text-on-bright-800 mb-4">{children}</h2>
}

export function ColHeader({ children }: { children: React.ReactNode }) {
  return <div className="typography-13-semibold text-semantic-text-on-bright-500 pb-2 text-center">{children}</div>
}

export function RowHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="typography-13-semibold text-semantic-text-on-bright-500 flex items-start pt-2 capitalize">
      {children}
    </div>
  )
}

export function SpecLabel({ children }: { children: React.ReactNode }) {
  return <div className="typography-12-medium text-semantic-text-on-bright-400">{children}</div>
}

export function SpecValue({ children }: { children: React.ReactNode }) {
  return <div className="typography-12-regular text-semantic-text-on-bright-500 text-center">{children}</div>
}

export function ColorSwatch({ cssVar, label }: { cssVar: string; label: string }) {
  const isTransparent = label.includes('transparent')
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'w-3 h-3 rounded-full border flex-shrink-0',
          isTransparent ? 'border-dashed border-semantic-neutral-solid-300' : 'border-semantic-divider-solid-100',
        )}
        style={isTransparent ? undefined : { backgroundColor: `var(${cssVar})` }}
      />
      <span className="typography-12-regular text-semantic-text-on-bright-400 whitespace-nowrap">{label}</span>
    </div>
  )
}

/* ─── Placeholder icons ───────────────────────────────────────────────────── */

export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

export const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export const FilterIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h12M4 8h8M6 12h4" />
  </svg>
)

export const CategoryIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
)

export const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="5.5" />
    <path d="M16.5 16.5l-3.5-3.5" />
  </svg>
)

export const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4.5" width="16" height="11" rx="1.5" />
    <path d="M2 7l8 5 8-5" />
  </svg>
)

export const BookIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h5v12H4zM11 4h5v12h-5z" />
  </svg>
)

export const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.7l5.4-.8z" />
  </svg>
)

export const GridIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="5" rx="1" />
    <rect x="12" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="12" width="5" height="5" rx="1" />
    <rect x="12" y="12" width="5" height="5" rx="1" />
  </svg>
)
