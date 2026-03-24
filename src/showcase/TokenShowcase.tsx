import type { TocEntry } from '@/components/showcase-layout'
import { PrimitiveColorSection } from './token-sections/PrimitiveColorSection'
import { SemanticColorSection } from './token-sections/SemanticColorSection'
import { TypographySection } from './token-sections/TypographySection'
import { SpacingSection } from './token-sections/SpacingSection'
import { RadiusSection } from './token-sections/RadiusSection'
import { MotionSection } from './token-sections/MotionSection'

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const TOKEN_TOC: TocEntry[] = [
  { id: 'primitive-colors', label: 'Primitive Colors' },
  { id: 'semantic-colors', label: 'Semantic Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radius', label: 'Border Radius' },
  { id: 'motion', label: 'Motion' },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TokenShowcase() {
  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="typography-24-bold text-semantic-text-on-bright-900 mb-2">Design Tokens</h1>
        <p className="typography-14-regular text-semantic-text-on-bright-600">
          Three-layer token system: Primitive → Semantic → Component. All tokens exist as TypeScript objects, CSS custom properties, and Tailwind utilities.
        </p>
      </div>

      <PrimitiveColorSection />
      <SemanticColorSection />
      <TypographySection />
      <SpacingSection />
      <RadiusSection />
      <MotionSection />
    </div>
  )
}
