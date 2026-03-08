import { SearchBar } from '@/components/SearchBar'
import { Block, Row } from './ShowcaseLayout'

const sizes = ['xLarge', 'large', 'medium', 'small'] as const
const shapes = ['rectangle', 'circular'] as const

/* ─── Size × Shape Matrix ─── */

function SizeShapeMatrix() {
  return (
    <div className="flex flex-col gap-6">
      {shapes.map(sh => (
        <div key={sh} className="flex flex-col gap-4">
          <p className="typography-13-semibold text-semantic-text-on-bright-700 capitalize">{sh}</p>
          <div className="flex flex-col gap-3">
            {sizes.map(s => (
              <Row key={s} label={s}>
                <SearchBar size={s} shape={sh} placeholder={`${sh} ${s}`} />
              </Row>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── States ─── */

function StatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <SearchBar placeholder="Default state" />
      </Row>
      <Row label="With clear button">
        <SearchBar value="Search query" clearButton />
      </Row>
      <Row label="With search button">
        <SearchBar placeholder="With search button" searchButton />
      </Row>
      <Row label="Both buttons">
        <SearchBar value="Query text" clearButton searchButton />
      </Row>
      <Row label="Disabled">
        <SearchBar placeholder="Disabled" disabled />
      </Row>
      <Row label="Full width">
        <SearchBar placeholder="Full width" fullWidth />
      </Row>
      <Row label="Circular">
        <SearchBar shape="circular" placeholder="Circular search" />
      </Row>
    </div>
  )
}

/* ─── Export ─── */

export function SearchBarVariantsShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Size × Shape" hint="4 sizes × 2 shapes">
        <SizeShapeMatrix />
      </Block>
      <Block title="States" hint="Default · Clear · Search · Both · Disabled · FullWidth · Circular">
        <StatesDemo />
      </Block>
    </div>
  )
}
