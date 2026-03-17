/* ─── Spec types (loose, matching JSON structure) ─────────────────────────── */

interface SpecProp {
  type: string
  default?: unknown
  description?: string
}

interface SpecSubComponent {
  name: string
  role?: string
  props?: Record<string, SpecProp>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentSpec = Record<string, any>

/* ─── PropRow ─────────────────────────────────────────────────────────────── */

export interface PropRow {
  name: string
  type: string
  default: string
  description: string
}

/* ─── Extractors ──────────────────────────────────────────────────────────── */

export function extractHeader(spec: ComponentSpec) {
  return {
    name: spec.component as string ?? 'Component',
    description: spec.description as string ?? '',
    classification: spec.classification as string ?? 'Primitive',
  }
}

export function extractProps(spec: ComponentSpec): PropRow[] {
  const props = spec.props as Record<string, SpecProp> | undefined
  if (!props) return []

  return Object.entries(props).map(([name, prop]) => ({
    name,
    type: prop.type,
    default: prop.default != null ? String(prop.default) : '—',
    description: prop.description ?? '',
  }))
}

export function extractSubComponentProps(
  spec: ComponentSpec,
): { name: string; props: PropRow[] }[] {
  const subs = spec.subComponents as SpecSubComponent[] | undefined
  if (!subs) return []

  return subs
    .filter(sub => sub.props && Object.keys(sub.props).length > 0)
    .map(sub => ({
      name: sub.name,
      props: Object.entries(sub.props!).map(([name, prop]) => ({
        name,
        type: prop.type,
        default: prop.default != null ? String(prop.default) : '—',
        description: prop.description ?? '',
      })),
    }))
}

/**
 * Parse variant size entries to extract token name-value pairs.
 * Handles formats like: "--comp-button-height-xs (24px)" or "typography-14-semibold"
 */
export function extractTokensFromVariants(
  variants: Record<string, Record<string, string>> | undefined,
): { name: string; value: string }[] {
  if (!variants) return []

  const tokens: { name: string; value: string }[] = []

  for (const [, entries] of Object.entries(variants)) {
    for (const [, raw] of Object.entries(entries)) {
      const match = raw.match(/^(--[^\s(]+)\s*\(([^)]+)\)$/)
      if (match) {
        const name = match[1]
        if (!tokens.some(t => t.name === name)) {
          tokens.push({ name, value: match[2] })
        }
      }
    }
    break // only parse first variant entry (tokens are the same pattern across sizes)
  }

  return tokens
}
