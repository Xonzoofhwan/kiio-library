import { cn } from '@/lib/utils'
import type { ControlDef } from './types'

/* ─── SelectControl ─── */

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="typography-12-medium text-semantic-text-on-bright-500">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'px-2.5 py-1 rounded-2 typography-13-medium transition-colors',
              value === opt
                ? 'bg-semantic-primary-500 text-white'
                : 'bg-semantic-neutral-black-alpha-50 text-semantic-text-on-bright-700 hover:bg-semantic-neutral-black-alpha-70',
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── ToggleControl ─── */

function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'w-9 h-5 rounded-full transition-colors relative',
          value ? 'bg-semantic-primary-500' : 'bg-semantic-neutral-solid-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
            value ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </button>
      <span className="typography-13-medium text-semantic-text-on-bright-700">{label}</span>
    </label>
  )
}

/* ─── TextControl ─── */

function TextControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="typography-12-medium text-semantic-text-on-bright-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-2.5 py-1.5 rounded-2 border border-semantic-divider-solid-100 bg-semantic-background-0 typography-14-regular text-semantic-text-on-bright-900 outline-none focus:border-semantic-primary-400 w-full"
      />
    </div>
  )
}

/* ─── ControlRenderer ─── */

export function ControlRenderer({
  control,
  value,
  onChange,
}: {
  control: ControlDef
  value: string | boolean
  onChange: (value: string | boolean) => void
}) {
  switch (control.type) {
    case 'select':
      return (
        <SelectControl
          label={control.label}
          value={value as string}
          options={control.options}
          onChange={onChange}
        />
      )
    case 'boolean':
      return (
        <ToggleControl
          label={control.label}
          value={value as boolean}
          onChange={onChange}
        />
      )
    case 'text':
      return (
        <TextControl
          label={control.label}
          value={value as string}
          onChange={onChange}
        />
      )
  }
}
