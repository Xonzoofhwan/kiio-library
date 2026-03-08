import { useState } from 'react'
import { RadioGroup, RadioItem } from '@/components/Radio'
import { RadioVariantsShowcase } from './RadioShowcase'
import type { ShowcaseItem, ControlValues } from './types'

function RadioPlayground(values: ControlValues) {
  const { size, orientation, disabled } = values
  const [value, setValue] = useState('option1')

  return (
    <RadioGroup
      size={size as 'large' | 'medium' | 'small'}
      orientation={orientation as 'vertical' | 'horizontal'}
      value={value}
      onValueChange={setValue}
      disabled={disabled as boolean}
    >
      <RadioItem value="option1" label="Option 1" />
      <RadioItem value="option2" label="Option 2" />
      <RadioItem value="option3" label="Option 3" />
    </RadioGroup>
  )
}

export const radioEntry: ShowcaseItem = {
  id: 'radio',
  name: 'Radio',
  description: 'Radio group — 3 sizes, vertical/horizontal, roving tab index with arrow keys.',
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
      type: 'select',
      name: 'orientation',
      label: 'orientation',
      options: ['vertical', 'horizontal'] as const,
      defaultValue: 'vertical',
    },
    {
      type: 'boolean',
      name: 'disabled',
      label: 'disabled',
      defaultValue: false,
    },
  ],
  component: RadioPlayground,
  showcase: RadioVariantsShowcase,
}
