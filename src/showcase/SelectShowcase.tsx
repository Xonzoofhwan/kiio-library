import { Select } from '@/components/Select'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['xLarge', 'large', 'medium', 'small'] as const

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
]

/* ─── Size Matrix ─── */

function SizeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map(s => (
        <Row key={s} label={s}>
          <Select.Root>
            <Select.Trigger size={s} placeholder={`Size ${s}`} />
            <Select.Content>
              {fruits.map(f => (
                <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Row>
      ))}
    </div>
  )
}

/* ─── Validation ─── */

function ValidationDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <Select.Root>
          <Select.Trigger label="Label" placeholder="Select..." helperText="Helper text" />
          <Select.Content>
            {fruits.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Row>
      <Row label="Error">
        <Select.Root>
          <Select.Trigger label="Label" placeholder="Select..." validation="error" helperText="Error message" />
          <Select.Content>
            {fruits.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Row>
    </div>
  )
}

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="With selected value">
        <Select.Root defaultValue="cherry">
          <Select.Trigger placeholder="Select..." />
          <Select.Content>
            {fruits.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Row>
      <Row label="With label types">
        <div className="flex flex-wrap gap-4">
          <Select.Root>
            <Select.Trigger label="None" labelType="none" placeholder="Select..." />
            <Select.Content>
              {fruits.map(f => (
                <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Select.Root>
            <Select.Trigger label="Optional" labelType="optional" placeholder="Select..." />
            <Select.Content>
              {fruits.map(f => (
                <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Select.Root>
            <Select.Trigger label="Required" labelType="asterisk" placeholder="Select..." />
            <Select.Content>
              {fruits.map(f => (
                <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </Row>
      <Row label="Disabled">
        <Select.Root disabled>
          <Select.Trigger placeholder="Disabled" />
          <Select.Content>
            {fruits.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Row>
      <Row label="Disabled with value">
        <Select.Root defaultValue="banana" disabled>
          <Select.Trigger placeholder="Disabled" />
          <Select.Content>
            {fruits.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Row>
      <Row label="With disabled items">
        <Select.Root>
          <Select.Trigger placeholder="Some items disabled" />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana" disabled>Banana (disabled)</Select.Item>
            <Select.Item value="cherry">Cherry</Select.Item>
            <Select.Item value="grape" disabled>Grape (disabled)</Select.Item>
            <Select.Item value="orange">Orange</Select.Item>
          </Select.Content>
        </Select.Root>
      </Row>
      <Row label="Full width">
        <Select.Root>
          <Select.Trigger placeholder="Full width" fullWidth />
          <Select.Content>
            {fruits.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function SelectVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size variants" hint="xLarge · Large · Medium · Small">
        <SizeMatrix />
      </Block>
      <Block title="Validation" hint="Default · Error">
        <ValidationDemo />
      </Block>
      <Block title="States" hint="Selected · LabelTypes · Disabled · DisabledItems · FullWidth">
        <StatesDemo />
      </Block>
    </div>
  )
}
