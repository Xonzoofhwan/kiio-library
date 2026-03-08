import { Input } from '@/components/Input'
import { IconCancel } from '@/components/icons'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['xLarge', 'large', 'medium', 'small'] as const
const validations = ['default', 'error', 'success'] as const

/* ─── Size Matrix ─── */

function SizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map(s => (
        <Row key={s} label={s}>
          <Input
            size={s}
            placeholder={`Size ${s}`}
            iconLeading={<IconCancel className="size-full" />}
          />
        </Row>
      ))}
    </div>
  )
}

/* ─── Validation States ─── */

function ValidationMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {validations.map(v => (
        <Row key={v} label={v}>
          <Input
            validation={v}
            label="Label"
            placeholder="Placeholder"
            helperText={
              v === 'error'
                ? 'Error message here'
                : v === 'success'
                  ? 'Success message here'
                  : 'Helper text here'
            }
            iconTrailing={<IconCancel className="size-full" />}
          />
        </Row>
      ))}
    </div>
  )
}

/* ─── Label Types ─── */

function LabelTypeMatrix() {
  return (
    <div className="flex flex-wrap gap-6">
      <Input label="Default Label" labelType="none" placeholder="labelType=none" />
      <Input label="Optional Label" labelType="optional" placeholder="labelType=optional" />
      <Input label="Required Label" labelType="asterisk" placeholder="labelType=asterisk" />
    </div>
  )
}

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <Input placeholder="Default state" />
      </Row>
      <Row label="With value">
        <Input defaultValue="Typed text" />
      </Row>
      <Row label="With icons">
        <Input
          placeholder="Leading & trailing"
          iconLeading={<IconCancel className="size-full" />}
          iconTrailing={<IconCancel className="size-full" />}
        />
      </Row>
      <Row label="Read-only">
        <Input defaultValue="Read-only value" readOnly />
      </Row>
      <Row label="Disabled">
        <Input placeholder="Disabled" disabled />
      </Row>
      <Row label="Disabled with value">
        <Input defaultValue="Disabled value" disabled />
      </Row>
      <Row label="Counter">
        <Input placeholder="Type to count" counter maxLength={50} />
      </Row>
      <Row label="Counter (over limit)">
        <Input
          defaultValue="This text exceeds the maximum character count allowed"
          counter
          maxLength={20}
        />
      </Row>
      <Row label="Full width">
        <Input placeholder="Full width input" fullWidth />
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function InputVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size variants" hint="xLarge · Large · Medium · Small">
        <SizeMatrix />
      </Block>
      <Block title="Validation states" hint="Default · Error · Success">
        <ValidationMatrix />
      </Block>
      <Block title="Label types" hint="None · Optional · Asterisk">
        <LabelTypeMatrix />
      </Block>
      <Block title="States" hint="Default · Typed · Icons · ReadOnly · Disabled · Counter · FullWidth">
        <StatesDemo />
      </Block>
    </div>
  )
}
