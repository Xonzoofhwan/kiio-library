import { Switch } from '@/components/Switch'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['large', 'medium', 'small'] as const

/* ─── Size Matrix ─── */

function SizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map(s => (
        <Row key={s} label={s}>
          <Switch size={s} defaultChecked={false} label={`Off ${s}`} />
          <Switch size={s} defaultChecked={true} label={`On ${s}`} />
        </Row>
      ))}
    </div>
  )
}

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Off">
        <Switch defaultChecked={false} label="Off" />
      </Row>
      <Row label="On">
        <Switch defaultChecked={true} label="On" />
      </Row>
      <Row label="No label">
        <Switch defaultChecked={false} />
        <Switch defaultChecked={true} />
      </Row>
      <Row label="Disabled off">
        <Switch defaultChecked={false} disabled label="Disabled off" />
      </Row>
      <Row label="Disabled on">
        <Switch defaultChecked={true} disabled label="Disabled on" />
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function SwitchVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size variants" hint="Large · Medium · Small × Off · On">
        <SizeMatrix />
      </Block>
      <Block title="States" hint="Off · On · NoLabel · Disabled">
        <StatesDemo />
      </Block>
    </div>
  )
}
