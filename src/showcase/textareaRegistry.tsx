import { Textarea } from '@/components/Textarea'
import { IconCancel } from '@/components/icons'
import { TextareaVariantsShowcase } from './TextareaShowcase'
import type { ShowcaseItem, ControlValues } from './types'

export const textareaEntry: ShowcaseItem = {
  id: 'textarea',
  name: 'Textarea',
  description: 'Multi-line text input — 2 sizes, validation states, label, helper text, and counter.',
  category: 'Form',
  controls: [
    {
      type: 'select',
      name: 'size',
      label: 'size',
      options: ['xLarge', 'large'] as const,
      defaultValue: 'large',
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
      type: 'select',
      name: 'resize',
      label: 'resize',
      options: ['none', 'vertical', 'both'] as const,
      defaultValue: 'vertical',
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
      resize,
      label,
      placeholder,
      helperText,
      counter,
      fullWidth,
      disabled,
      readOnly,
      iconTrailing,
    } = values
    return (
      <Textarea
        size={size as 'xLarge' | 'large'}
        validation={validation as 'default' | 'error' | 'success'}
        labelType={labelType as 'none' | 'optional' | 'asterisk'}
        resize={resize as 'none' | 'vertical' | 'both'}
        label={(label as string) || undefined}
        placeholder={placeholder as string}
        helperText={(helperText as string) || undefined}
        counter={counter as boolean}
        maxLength={counter ? 200 : undefined}
        fullWidth={fullWidth as boolean}
        disabled={disabled as boolean}
        readOnly={readOnly as boolean}
        iconTrailing={iconTrailing ? <IconCancel className="size-full" /> : undefined}
      />
    )
  },
  showcase: TextareaVariantsShowcase,
}
