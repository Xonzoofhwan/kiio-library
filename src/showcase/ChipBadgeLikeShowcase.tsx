import {
  ChipBadgeLikeUniversal,
  ChipBadgeLikeEmphasized,
  ChipBadgeLikeError,
  CHIP_BADGELIKE_SIZES, CHIP_BADGELIKE_SHAPES, CHIP_BADGELIKE_WEIGHTS, CHIP_BADGELIKE_COLORS,
} from '@/components/Chip'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const CHIP_BADGELIKE_TOC: TocEntry[] = [
  { id: 'chip-badgelike-universal', label: 'Universal (Neutral)' },
  { id: 'chip-badgelike-emphasized', label: 'Emphasized (Colors)' },
  { id: 'chip-badgelike-error', label: 'Error' },
  { id: 'chip-badgelike-shapes', label: 'Shapes' },
  { id: 'chip-badgelike-no-close', label: 'Without Close' },
]

const noop = () => {}

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function ChipBadgeLikeShowcase() {
  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Chip.BadgeLike</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Badge-like chip labels for tags, categories, and status display. Three sub-types: Universal (neutral), Emphasized (colored), Error.
        </p>
      </div>

      {/* ─── Universal (Neutral) ──────────────────────────────── */}
      <section id="chip-badgelike-universal" className="mb-12">
        <SectionTitle>Universal (Neutral)</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {CHIP_BADGELIKE_WEIGHTS.map((weight) => (
            <div key={weight} className="contents">
              <RowHeader>{weight}</RowHeader>
              <div className="flex flex-wrap gap-2 items-center">
                {CHIP_BADGELIKE_SIZES.map((size) => (
                  <ChipBadgeLikeUniversal key={size} size={size} weight={weight} onClose={noop}>{size}</ChipBadgeLikeUniversal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Emphasized (Colors) ──────────────────────────────── */}
      <section id="chip-badgelike-emphasized" className="mb-12">
        <SectionTitle>Emphasized (Colors)</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {CHIP_BADGELIKE_WEIGHTS.map((weight) => (
            <div key={weight} className="contents">
              <RowHeader>{weight}</RowHeader>
              <div className="flex flex-wrap gap-2 items-center">
                {CHIP_BADGELIKE_COLORS.map((color) => (
                  <ChipBadgeLikeEmphasized key={color} color={color} weight={weight} size="medium" onClose={noop}>{color}</ChipBadgeLikeEmphasized>
                ))}
              </div>
            </div>
          ))}
          {/* All sizes for blue */}
          <RowHeader>sizes (blue)</RowHeader>
          <div className="flex flex-wrap gap-2 items-center">
            {CHIP_BADGELIKE_SIZES.map((size) => (
              <ChipBadgeLikeEmphasized key={size} color="blue" size={size} onClose={noop}>{size}</ChipBadgeLikeEmphasized>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Error ────────────────────────────────────────────── */}
      <section id="chip-badgelike-error" className="mb-12">
        <SectionTitle>Error</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          {CHIP_BADGELIKE_WEIGHTS.map((weight) =>
            CHIP_BADGELIKE_SIZES.map((size) => (
              <ChipBadgeLikeError key={`${weight}-${size}`} size={size} weight={weight} onClose={noop}>
                {weight} {size}
              </ChipBadgeLikeError>
            ))
          )}
        </div>
      </section>

      {/* ─── Shapes ───────────────────────────────────────────── */}
      <section id="chip-badgelike-shapes" className="mb-12">
        <SectionTitle>Shapes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {CHIP_BADGELIKE_SHAPES.map((shape) => (
            <div key={shape} className="contents">
              <RowHeader>{shape}</RowHeader>
              <div className="flex flex-wrap gap-2 items-center">
                <ChipBadgeLikeUniversal shape={shape} size="medium" onClose={noop}>Neutral</ChipBadgeLikeUniversal>
                <ChipBadgeLikeEmphasized shape={shape} size="medium" color="blue" onClose={noop}>Blue</ChipBadgeLikeEmphasized>
                <ChipBadgeLikeEmphasized shape={shape} size="medium" color="purple" onClose={noop}>Purple</ChipBadgeLikeEmphasized>
                <ChipBadgeLikeError shape={shape} size="medium" onClose={noop}>Error</ChipBadgeLikeError>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Without Close ────────────────────────────────────── */}
      <section id="chip-badgelike-no-close" className="mb-12">
        <SectionTitle>Without Close</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          <ChipBadgeLikeUniversal size="medium">Neutral</ChipBadgeLikeUniversal>
          <ChipBadgeLikeUniversal size="medium" weight="heavy">Neutral Heavy</ChipBadgeLikeUniversal>
          <ChipBadgeLikeEmphasized size="medium" color="blue">Blue</ChipBadgeLikeEmphasized>
          <ChipBadgeLikeEmphasized size="medium" color="purple" weight="heavy">Purple</ChipBadgeLikeEmphasized>
          <ChipBadgeLikeError size="medium">Error</ChipBadgeLikeError>
        </div>
      </section>
    </div>
  )
}
