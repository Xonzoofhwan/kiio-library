import { useState } from 'react'
import { Checkbox } from '@/components/Checkbox'
import { CheckboxVariantsShowcase } from './CheckboxShowcase'
import type { ShowcaseItem, ControlValues } from './types'

function CheckboxPlayground(values: ControlValues) {
  const { size, label, disabled } = values
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)

  return (
    <Checkbox
      size={size as 'large' | 'medium' | 'small'}
      checked={checked}
      onCheckedChange={setChecked}
      label={(label as string) || undefined}
      disabled={disabled as boolean}
    />
  )
}

export const checkboxEntry: ShowcaseItem = {
  id: 'checkbox',
  name: 'Checkbox',
  description: 'Checkbox — 3 sizes, checked/unchecked/indeterminate, with optional label.',
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
      defaultValue: 'Accept terms',
    },
    {
      type: 'boolean',
      name: 'disabled',
      label: 'disabled',
      defaultValue: false,
    },
  ],
  component: CheckboxPlayground,
  showcase: CheckboxVariantsShowcase,
}
