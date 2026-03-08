import { useState } from 'react'
import { Switch } from '@/components/Switch'
import { SwitchVariantsShowcase } from './SwitchShowcase'
import type { ShowcaseItem, ControlValues } from './types'

function SwitchPlayground(values: ControlValues) {
  const { size, label, disabled } = values
  const [checked, setChecked] = useState(false)

  return (
    <Switch
      size={size as 'large' | 'medium' | 'small'}
      checked={checked}
      onCheckedChange={setChecked}
      label={(label as string) || undefined}
      disabled={disabled as boolean}
    />
  )
}

export const switchEntry: ShowcaseItem = {
  id: 'switch',
  name: 'Switch',
  description: 'Toggle switch — 3 sizes, on/off with slide animation, optional label.',
  category: 'Form',
  controls: [
    {
      type: 'select',
      name: 'size',
      label: 'size',
      options: ['large', 'medium', 'small'] as const,
      defaultValue: 'medium',
    },
    {
      type: 'text',
      name: 'label',
      label: 'label',
      defaultValue: 'Enable notifications',
    },
    {
      type: 'boolean',
      name: 'disabled',
      label: 'disabled',
      defaultValue: false,
    },
  ],
  component: SwitchPlayground,
  showcase: SwitchVariantsShowcase,
}
