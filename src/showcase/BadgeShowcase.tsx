import {
  BadgeLabel, BadgeDot,
  BADGE_SIZES, BADGE_SHAPES, BADGE_WEIGHTS, BADGE_COLORS, BADGE_DOT_SIZES,
} from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const BADGE_TOC: TocEntry[] = [
  { id: 'badge-sizes', label: 'Sizes' },
  { id: 'badge-shapes', label: 'Shapes' },
  { id: 'badge-weights', label: 'Weights' },
  { id: 'badge-colors', label: 'Color Palette' },
  { id: 'badge-dot', label: 'BadgeDot' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function BadgeShowcase() {
  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">Badge</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Display-only label and dot indicator for status, categories, and counts.
        </p>
      </div>

      {/* ─── Sizes ──────────────────────────────────────────────── */}
      <section id="badge-sizes" className="mb-12">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-wrap gap-3 items-center">
          {BADGE_SIZES.map((s) => (
            <BadgeLabel key={s} size={s} color="indigo">{s === 'nano' ? '7' : s}</BadgeLabel>
          ))}
        </div>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mt-3">
          nano 사이즈는 counter 전용입니다 (숫자만 허용).
        </p>
      </section>

      {/* ─── Shapes ─────────────────────────────────────────────── */}
      <section id="badge-shapes" className="mb-12">
        <SectionTitle>Shapes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {BADGE_SHAPES.map((shape) => (
            <div key={shape} className="contents">
              <RowHeader>{shape}</RowHeader>
              <div className="flex flex-wrap gap-3 items-center">
                {BADGE_SIZES.map((s) => (
                  <BadgeLabel key={s} size={s} shape={shape} color="purple">{s === 'nano' ? '9' : s}</BadgeLabel>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Weights ────────────────────────────────────────────── */}
      <section id="badge-weights" className="mb-12">
        <SectionTitle>Weights</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-4 gap-x-6 items-center">
          {BADGE_WEIGHTS.map((w) => (
            <div key={w} className="contents">
              <RowHeader>{w}</RowHeader>
              <div className="flex flex-wrap gap-3 items-center">
                {(['gray', 'indigo', 'red', 'emerald', 'blue', 'amber'] as const).map((c) => (
                  <BadgeLabel key={c} weight={w} color={c}>{c}</BadgeLabel>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Color Palette ──────────────────────────────────────── */}
      <section id="badge-colors" className="mb-12">
        <SectionTitle>Color Palette</SectionTitle>

        {/* Light */}
        <div className="mb-6">
          <ColHeader>Light</ColHeader>
          <div className="flex flex-wrap gap-2">
            {BADGE_COLORS.map((c) => (
              <BadgeLabel key={c} color={c} weight="light">{c}</BadgeLabel>
            ))}
          </div>
        </div>

        {/* Heavy */}
        <div>
          <ColHeader>Heavy</ColHeader>
          <div className="flex flex-wrap gap-2">
            {BADGE_COLORS.map((c) => (
              <BadgeLabel key={c} color={c} weight="heavy">{c}</BadgeLabel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BadgeDot ───────────────────────────────────────────── */}
      <section id="badge-dot" className="mb-12">
        <SectionTitle>BadgeDot</SectionTitle>

        {/* Sizes */}
        <div className="mb-6">
          <ColHeader>Sizes</ColHeader>
          <div className="flex flex-wrap gap-4 items-center">
            {BADGE_DOT_SIZES.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <BadgeDot size={s} color="red" />
                <span className="typography-12-regular text-semantic-text-on-bright-500">{s}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outlined */}
        <div className="mb-6">
          <ColHeader>Outlined</ColHeader>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-primitive-gray-200 px-3 py-2 rounded-2">
              <BadgeDot color="red" />
              <span className="typography-12-regular text-semantic-text-on-bright-500">default</span>
            </div>
            <div className="flex items-center gap-2 bg-primitive-gray-200 px-3 py-2 rounded-2">
              <BadgeDot color="red" outlined />
              <span className="typography-12-regular text-semantic-text-on-bright-500">outlined</span>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div>
          <ColHeader>Colors</ColHeader>
          <div className="flex flex-wrap gap-3 items-center">
            {BADGE_COLORS.map((c) => (
              <div key={c} className="flex items-center gap-1.5">
                <BadgeDot color={c} />
                <span className="typography-12-regular text-semantic-text-on-bright-500">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
