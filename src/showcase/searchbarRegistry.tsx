import { SearchBar } from '@/components/SearchBar'
import { SearchBarVariantsShowcase } from './SearchBarShowcase'
import type { ShowcaseItem, ControlValues } from './types'

export const searchbarEntry: ShowcaseItem = {
  id: 'searchbar',
  name: 'SearchBar',
  description: 'Search input — 4 sizes × 2 shapes, with clear and search buttons.',
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
      name: 'shape',
      label: 'shape',
      options: ['rectangle', 'circular'] as const,
      defaultValue: 'rectangle',
    },
    {
      type: 'text',
      name: 'placeholder',
      label: 'placeholder',
      defaultValue: 'Search...',
    },
    {
      type: 'boolean',
      name: 'clearButton',
      label: 'clearButton',
      defaultValue: true,
    },
    {
      type: 'boolean',
      name: 'searchButton',
      label: 'searchButton',
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
  ],
  component: (values: ControlValues) => {
    const { size, shape, placeholder, clearButton, searchButton, fullWidth, disabled } = values
    return (
      <SearchBar
        size={size as 'xLarge' | 'large' | 'medium' | 'small'}
        shape={shape as 'rectangle' | 'circular'}
        placeholder={placeholder as string}
        clearButton={clearButton as boolean}
        searchButton={searchButton as boolean}
        fullWidth={fullWidth as boolean}
        disabled={disabled as boolean}
      />
    )
  },
  showcase: SearchBarVariantsShowcase,
}
