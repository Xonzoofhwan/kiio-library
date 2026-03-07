import { Button } from '@/components/Button'
import { IconCancel } from '@/components/icons'
import { Block, Row } from './ShowcaseLayout'

const hierarchies = ['primary', 'secondary', 'outlined', 'ghost'] as const
const sizes = ['xLarge', 'large', 'medium', 'small'] as const

/* ─── Hierarchy × Size Matrix ─── */

function HierarchySizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {hierarchies.map(h => (
        <Row key={h} label={h}>
          {sizes.map(s => (
            <Button
              key={s}
              hierarchy={h}
              size={s}
              iconLeading={<IconCancel className="size-full" />}
            >
              {s}
            </Button>
          ))}
        </Row>
      ))}
    </div>
  )
}

/* ─── States Matrix ─── */

function StateDemo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <span className="typography-12-regular text-semantic-text-on-bright-400">{label}</span>
      {children}
    </div>
  )
}

function StatesMatrix() {
  return (
    <div className="flex flex-col gap-8">
      {hierarchies.map(h => (
        <div key={h} className="flex flex-col gap-3">
          <p className="typography-13-semibold text-semantic-text-on-bright-700 capitalize">{h}</p>
          <div className="flex flex-wrap gap-3 items-center">
            <StateDemo label="Default">
              <Button hierarchy={h} size="medium">Button</Button>
            </StateDemo>
            <StateDemo label="With Icons">
              <Button
                hierarchy={h}
                size="medium"
                iconLeading={<IconCancel className="size-full" />}
                iconTrailing={<IconCancel className="size-full" />}
              >
                Button
              </Button>
            </StateDemo>
            <StateDemo label="Disabled">
              <Button hierarchy={h} size="medium" disabled>Button</Button>
            </StateDemo>
            <StateDemo label="Loading">
              <Button hierarchy={h} size="medium" loading>Button</Button>
            </StateDemo>
            <StateDemo label="Full Width">
              <Button hierarchy={h} size="medium" fullWidth>Button</Button>
            </StateDemo>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Export ─── */

export function ButtonVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Hierarchy × Size" hint="전체 조합">
        <HierarchySizeMatrix />
      </Block>
      <Block title="States" hint="Default · Icons · Disabled · Loading · Full Width">
        <StatesMatrix />
      </Block>
    </div>
  )
}
