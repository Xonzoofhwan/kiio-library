import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ControlDef, ControlValues } from './types'

interface CodePreviewProps {
  componentName: string
  controls: ControlDef[]
  values: ControlValues
}

function generateJsx(
  componentName: string,
  controls: ControlDef[],
  values: ControlValues,
): string {
  const props: string[] = []
  let childrenValue: string | null = null

  for (const control of controls) {
    const val = values[control.name]

    if (control.name === 'children') {
      if (typeof val === 'string' && val !== '') childrenValue = val
      continue
    }

    // Skip default values
    if (val === control.defaultValue) continue

    if (typeof val === 'boolean') {
      if (val) props.push(`  ${control.name}`)
    } else if (typeof val === 'string') {
      props.push(`  ${control.name}="${val}"`)
    }
  }

  const propsBlock = props.length > 0 ? '\n' + props.join('\n') + '\n' : ''

  if (childrenValue) {
    if (propsBlock) {
      return `<${componentName}${propsBlock}>\n  ${childrenValue}\n</${componentName}>`
    }
    return `<${componentName}>\n  ${childrenValue}\n</${componentName}>`
  }

  if (propsBlock) {
    return `<${componentName}${propsBlock}/>`
  }
  return `<${componentName} />`
}

export function CodePreview({ componentName, controls, values }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const code = generateJsx(componentName, controls, values)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-3 border border-semantic-divider-solid-100 bg-semantic-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-semantic-divider-solid-100">
        <span className="typography-12-semibold text-semantic-text-on-bright-600">Usage</span>
        <button
          onClick={handleCopy}
          className={cn(
            'typography-12-medium transition-colors',
            copied
              ? 'text-semantic-success-600'
              : 'text-semantic-primary-500 hover:text-semantic-primary-600',
          )}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="typography-13-regular font-mono text-semantic-text-on-bright-800 whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}
