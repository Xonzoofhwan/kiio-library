export type ControlDef =
  | {
      type: 'select'
      name: string
      label: string
      options: readonly string[]
      defaultValue: string
    }
  | {
      type: 'boolean'
      name: string
      label: string
      defaultValue: boolean
    }
  | {
      type: 'text'
      name: string
      label: string
      defaultValue: string
    }

export type ControlValues = Record<string, string | boolean>

export interface ShowcaseItem {
  /** URL-safe identifier */
  id: string
  /** Display name */
  name: string
  /** Brief description of the component */
  description: string
  /** Category group header in sidebar */
  category: string
  /** Control definitions for the generic playground */
  controls: ControlDef[]
  /** Render function for the playground preview */
  component: (values: ControlValues) => React.ReactNode
  /** Optional showcase for the States & Variants section */
  showcase?: React.ComponentType
}
