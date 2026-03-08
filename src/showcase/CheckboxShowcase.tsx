import { Checkbox } from '@/components/Checkbox'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['large', 'medium', 'small'] as const

/* ─── Size Matrix ─── */

function SizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map(s => (
        <Row key={s} label={s}>
          <Checkbox size={s} checked={false} label={`Size ${s}`} />
          <Checkbox size={s} checked={true} label={`Size ${s}`} />
          <Checkbox size={s} checked="indeterminate" label={`Size ${s}`} />
        </Row>
      ))}
    </div>
  )
}

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Unchecked">
        <Checkbox checked={false} label="Unchecked" />
      </Row>
      <Row label="Checked">
        <Checkbox checked={true} label="Checked" />
      </Row>
      <Row label="Indeterminate">
        <Checkbox checked="indeterminate" label="Indeterminate" />
      </Row>
      <Row label="No label">
        <Checkbox checked={false} />
        <Checkbox checked={true} />
        <Checkbox checked="indeterminate" />
      </Row>
      <Row label="Disabled unchecked">
        <Checkbox checked={false} disabled label="Disabled" />
      </Row>
      <Row label="Disabled checked">
        <Checkbox checked={true} disabled label="Disabled" />
      </Row>
      <Row label="Disabled indeterminate">
        <Checkbox checked="indeterminate" disabled label="Disabled" />
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function CheckboxVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size × State" hint="Large · Medium · Small × Unchecked · Checked · Indeterminate">
        <SizeMatrix />
      </Block>
      <Block title="States" hint="Unchecked · Checked · Indeterminate · NoLabel · Disabled">
        <StatesDemo />
      </Block>
    </div>
  )
}
