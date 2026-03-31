import { createContext } from 'react'
import type { TocEntry } from '@/components/showcase-layout'

/**
 * Tabbed showcases call this to override the default TOC entries.
 * Non-tabbed showcases never call it — the static TOC from SHOWCASE_MAP is used.
 */
export const ShowcaseTocContext = createContext<(entries: TocEntry[]) => void>(() => {})
