import { Button } from '@/components/Button'
import { IconCancel } from '@/components/icons'
import { ButtonVariantsShowcase } from './ButtonShowcase'
import type { ShowcaseItem, ControlValues } from './types'

export const buttonEntry: ShowcaseItem = {
  id: 'button',
  name: 'Button',
  description: 'Systemic button — 4 hierarchies × 4 sizes, with icon and loading support.',
  category: 'Actions',
  controls: [
    {
      type: 'select',
      name: 'hierarchy',
      label: 'hierarchy',
      options: ['primary', 'secondary', 'outlined', 'ghost'] as const,
      defaultValue: 'primary',
    },
    {
      type: 'select',
      name: 'size',
      label: 'size',
      options: ['xLarge', 'large', 'medium', 'small'] as const,
      defaultValue: 'medium',
    },
    {
      type: 'text',
      name: 'children',
      label: 'text',
      defaultValue: 'Button',
    },
    {
      type: 'boolean',
      name: 'fullWidth',
      label: 'fullWidth',
      defaultValue: false,
    },
    {
      type: 'boolean',
      name: 'loading',
      label: 'loading',
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
    const { hierarchy, size, children, fullWidth, loading, disabled, iconLeading, iconTrailing } = values
    return (
      <Button
        hierarchy={hierarchy as 'primary' | 'secondary' | 'outlined' | 'ghost'}
        size={size as 'xLarge' | 'large' | 'medium' | 'small'}
        fullWidth={fullWidth as boolean}
        loading={loading as boolean}
        disabled={disabled as boolean}
        iconLeading={iconLeading ? <IconCancel className="size-full" /> : undefined}
        iconTrailing={iconTrailing ? <IconCancel className="size-full" /> : undefined}
      >
        {(children as string) || undefined}
      </Button>
    )
  },
  showcase: ButtonVariantsShowcase,
}
