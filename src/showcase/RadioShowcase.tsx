import { RadioGroup, RadioItem } from '@/components/Radio'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['large', 'medium', 'small'] as const

/* ─── Size Matrix ─── */

function SizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map(s => (
        <Row key={s} label={s}>
          <RadioGroup size={s} defaultValue="a" orientation="horizontal">
            <RadioItem value="a" label="Selected" />
            <RadioItem value="b" label="Unselected" />
            <RadioItem value="c" label="Unselected" />
          </RadioGroup>
        </Row>
      ))}
    </div>
  )
}

/* ─── Orientation ─── */

function OrientationDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Vertical">
        <RadioGroup defaultValue="a" orientation="vertical">
          <RadioItem value="a" label="Option A" />
          <RadioItem value="b" label="Option B" />
          <RadioItem value="c" label="Option C" />
        </RadioGroup>
      </Row>
      <Row label="Horizontal">
        <RadioGroup defaultValue="a" orientation="horizontal">
          <RadioItem value="a" label="Option A" />
          <RadioItem value="b" label="Option B" />
          <RadioItem value="c" label="Option C" />
        </RadioGroup>
      </Row>
    </div>
  )
}

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <RadioGroup defaultValue="a" orientation="horizontal">
          <RadioItem value="a" label="Selected" />
          <RadioItem value="b" label="Unselected" />
        </RadioGroup>
      </Row>
      <Row label="No labels">
        <RadioGroup defaultValue="a" orientation="horizontal">
          <RadioItem value="a" />
          <RadioItem value="b" />
          <RadioItem value="c" />
        </RadioGroup>
      </Row>
      <Row label="Disabled group">
        <RadioGroup defaultValue="a" orientation="horizontal" disabled>
          <RadioItem value="a" label="Disabled selected" />
          <RadioItem value="b" label="Disabled" />
        </RadioGroup>
      </Row>
      <Row label="Individual disabled">
        <RadioGroup defaultValue="a" orientation="horizontal">
          <RadioItem value="a" label="Selected" />
          <RadioItem value="b" label="Enabled" />
          <RadioItem value="c" label="Disabled" disabled />
        </RadioGroup>
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function RadioVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size variants" hint="Large · Medium · Small">
        <SizeMatrix />
      </Block>
      <Block title="Orientation" hint="Vertical · Horizontal">
        <OrientationDemo />
      </Block>
      <Block title="States" hint="Default · NoLabels · Disabled · IndividualDisabled">
        <StatesDemo />
      </Block>
    </div>
  )
}
