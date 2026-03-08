import { Textarea } from '@/components/Textarea'
import { IconCancel } from '@/components/icons'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['xLarge', 'large'] as const
const validations = ['default', 'error', 'success'] as const

/* ─── Size Matrix ─── */

function SizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map(s => (
        <Row key={s} label={s}>
          <Textarea size={s} placeholder={`Size ${s}`} />
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
          <Textarea
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

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <Textarea placeholder="Default state" />
      </Row>
      <Row label="With value">
        <Textarea defaultValue="Multi-line text content that demonstrates the textarea with some typed text." />
      </Row>
      <Row label="With trailing icon">
        <Textarea
          placeholder="Trailing icon"
          iconTrailing={<IconCancel className="size-full" />}
        />
      </Row>
      <Row label="Read-only">
        <Textarea defaultValue="Read-only value" readOnly />
      </Row>
      <Row label="Disabled">
        <Textarea placeholder="Disabled" disabled />
      </Row>
      <Row label="Counter">
        <Textarea placeholder="Type to count" counter maxLength={200} />
      </Row>
      <Row label="Resize none">
        <Textarea placeholder="Cannot resize" resize="none" />
      </Row>
      <Row label="Full width">
        <Textarea placeholder="Full width textarea" fullWidth />
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function TextareaVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size variants" hint="xLarge · Large">
        <SizeMatrix />
      </Block>
      <Block title="Validation states" hint="Default · Error · Success">
        <ValidationMatrix />
      </Block>
      <Block title="States" hint="Default · Typed · Icon · ReadOnly · Disabled · Counter · Resize · FullWidth">
        <StatesDemo />
      </Block>
    </div>
  )
}
