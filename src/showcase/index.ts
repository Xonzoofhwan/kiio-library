export type { ControlDef, ControlValues, ShowcaseItem } from './types'
import type { ShowcaseItem } from './types'
import { buttonEntry } from './buttonRegistry'
import { inputEntry } from './inputRegistry'
import { textareaEntry } from './textareaRegistry'
import { searchbarEntry } from './searchbarRegistry'
import { checkboxEntry } from './checkboxRegistry'
import { radioEntry } from './radioRegistry'

/**
 * Registry of all design system showcases.
 *
 * To add a new component:
 * 1. Create `src/showcase/{name}Registry.tsx` with controls and render function
 * 2. Optionally create `src/showcase/{Name}Showcase.tsx` for variants/states
 * 3. Import the entry here and add it to the array
 * 4. Done — sidebar, playground, and code preview update automatically
 */
export const showcaseRegistry: ShowcaseItem[] = [
  // ── Add new components below ──────────────────────────────────────
  buttonEntry,
  inputEntry,
  textareaEntry,
  searchbarEntry,
  checkboxEntry,
  radioEntry,
]
