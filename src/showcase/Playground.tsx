import { useState, useCallback } from 'react'
import type { ControlValues, ShowcaseItem } from './types'
import { ControlRenderer } from './PlaygroundControls'
import { CodePreview } from './CodePreview'

interface PlaygroundProps {
  item: ShowcaseItem
}

export function Playground({ item }: PlaygroundProps) {
  const [values, setValues] = useState<ControlValues>(() => {
    const initial: ControlValues = {}
    for (const ctrl of item.controls) {
      initial[ctrl.name] = ctrl.defaultValue
    }
    return initial
  })

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleReset = useCallback(() => {
    const initial: ControlValues = {}
    for (const ctrl of item.controls) {
      initial[ctrl.name] = ctrl.defaultValue
    }
    setValues(initial)
  }, [item.controls])

  const selectTextControls = item.controls.filter(c => c.type === 'select' || c.type === 'text')
  const booleanControls = item.controls.filter(c => c.type === 'boolean')

  return (
    <div className="flex flex-col gap-6">
      {/* Preview + Properties */}
      <div className="flex flex-col lg:flex-row rounded-3 border border-semantic-divider-solid-100 overflow-hidden">
        {/* Preview stage */}
        <div className="flex-1 flex items-center justify-center min-h-[240px] p-10 bg-semantic-background-0 relative">
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--semantic-neutral-solid-400) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div className="relative z-10">
            {item.component(values)}
          </div>
        </div>

        {/* Properties panel */}
        <div className="w-full lg:w-72 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-semantic-divider-solid-100 bg-semantic-background-50 flex flex-col">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-semantic-divider-solid-100">
            <span className="typography-13-semibold text-semantic-text-on-bright-800">Properties</span>
            <button
              onClick={handleReset}
              className="typography-12-medium text-semantic-text-on-bright-400 hover:text-semantic-text-on-bright-600 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Controls */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {selectTextControls.map(ctrl => (
              <ControlRenderer
                key={ctrl.name}
                control={ctrl}
                value={values[ctrl.name]}
                onChange={v => handleChange(ctrl.name, v)}
              />
            ))}

            {booleanControls.length > 0 && (
              <div className="flex flex-col gap-3 pt-2 border-t border-semantic-divider-solid-100">
                {booleanControls.map(ctrl => (
                  <ControlRenderer
                    key={ctrl.name}
                    control={ctrl}
                    value={values[ctrl.name]}
                    onChange={v => handleChange(ctrl.name, v)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <CodePreview
        componentName={item.name}
        controls={item.controls}
        values={values}
      />
    </div>
  )
}
