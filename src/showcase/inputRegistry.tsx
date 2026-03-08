import { Input } from '@/components/Input'
import { IconCancel } from '@/components/icons'
import { InputVariantsShowcase } from './InputShowcase'
import type { ShowcaseItem, ControlValues } from './types'

export const inputEntry: ShowcaseItem = {
  id: 'input',
  name: 'Input',
  description: 'Text input — 4 sizes, validation states, label, helper text, and character counter.',
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
      options: ['default', 'error', 'success'] as const,
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
      defaultValue: 'Placeholder',
    },
    {
      type: 'text',
      name: 'helperText',
      label: 'helperText',
      defaultValue: '',
    },
    {
      type: 'boolean',
      name: 'counter',
      label: 'counter',
      defaultValue: false,
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
    {
      type: 'boolean',
      name: 'readOnly',
      label: 'readOnly',
      defaultValue: false,
    },
    {
      type: 'boolean',
      name: 'iconLeading',
      label: 'iconLeading',
      defaultValue: false,
    },
    {
      type: 'boolean',
      name: 'iconTrailing',
      label: 'iconTrailing',
      defaultValue: false,
    },
  ],
  component: (values: ControlValues) => {
    const {
      size,
      validation,
      labelType,
      label,
      placeholder,
      helperText,
      counter,
      fullWidth,
      disabled,
      readOnly,
      iconLeading,
      iconTrailing,
    } = values
    return (
      <Input
        size={size as 'xLarge' | 'large' | 'medium' | 'small'}
        validation={validation as 'default' | 'error' | 'success'}
        labelType={labelType as 'none' | 'optional' | 'asterisk'}
        label={(label as string) || undefined}
        placeholder={placeholder as string}
        helperText={(helperText as string) || undefined}
        counter={counter as boolean}
        maxLength={counter ? 100 : undefined}
        fullWidth={fullWidth as boolean}
        disabled={disabled as boolean}
        readOnly={readOnly as boolean}
        iconLeading={iconLeading ? <IconCancel className="size-full" /> : undefined}
        iconTrailing={iconTrailing ? <IconCancel className="size-full" /> : undefined}
      />
    )
  },
  showcase: InputVariantsShowcase,
}
