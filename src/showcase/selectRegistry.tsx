import { Select } from '@/components/Select'
import { SelectVariantsShowcase } from './SelectShowcase'
import type { ShowcaseItem, ControlValues } from './types'

export const selectEntry: ShowcaseItem = {
  id: 'select',
  name: 'Select',
  description: 'Dropdown select — 4 sizes, validation, label, helper text, keyboard navigation.',
  category: 'Form',
  controls: [
    {
      type: 'select',
      name: 'size',
      label: 'size',
      options: ['xLarge', 'large', 'medium', 'small'] as const,
      defaultValue: 'medium',
    },
    {
      type: 'select',
      name: 'validation',
      label: 'validation',
      options: ['default', 'error'] as const,
      defaultValue: 'default',
    },
    {
      type: 'select',
      name: 'labelType',
      label: 'labelType',
      options: ['none', 'optional', 'asterisk'] as const,
      defaultValue: 'none',
    },
    {
      type: 'text',
      name: 'label',
      label: 'label',
      defaultValue: 'Label',
    },
    {
      type: 'text',
      name: 'placeholder',
      label: 'placeholder',
      defaultValue: 'Select...',
    },
    {
      type: 'text',
      name: 'helperText',
      label: 'helperText',
      defaultValue: '',
    },
    {
      type: 'boolean',
      name: 'fullWidth',
      label: 'fullWidth',
      defaultValue: false,
    },
    {
      type: 'boolean',
      name: 'disabled',
      label: 'disabled',
      defaultValue: false,
    },
  ],
  component: (values: ControlValues) => {
    const { size, validation, labelType, label, placeholder, helperText, fullWidth, disabled } = values
    return (
      <Select.Root disabled={disabled as boolean}>
        <Select.Trigger
          size={size as 'xLarge' | 'large' | 'medium' | 'small'}
          validation={validation as 'default' | 'error'}
          labelType={labelType as 'none' | 'optional' | 'asterisk'}
          label={(label as string) || undefined}
          placeholder={placeholder as string}
          helperText={(helperText as string) || undefined}
          fullWidth={fullWidth as boolean}
        />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
          <Select.Item value="grape">Grape</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
        </Select.Content>
      </Select.Root>
    )
  },
  showcase: SelectVariantsShowcase,
}
