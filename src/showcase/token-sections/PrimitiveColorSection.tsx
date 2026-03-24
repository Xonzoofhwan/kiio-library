import { primitive } from '@/tokens/primitive'

const SHADES = [0, 50, 70, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const

const ALPHA_FAMILIES = new Set<string>(['BlackAlpha', 'WhiteAlpha'])

const CHECKERBOARD = `repeating-conic-gradient(#d0d0d0 0% 25%, #f0f0f0 0% 50%) 0 0 / 12px 12px`

/* ─── Swatch ──────────────────────────────────────────────────────────────── */

function Swatch({ color, shade, isAlpha }: { color: string; shade: number; isAlpha: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="w-10 h-10 rounded-1 border border-semantic-divider-solid-50"
        style={isAlpha
          ? { background: `${CHECKERBOARD}`, position: 'relative' }
          : { backgroundColor: color }
        }
      >
        {isAlpha && (
          <div
            className="absolute inset-0 rounded-1"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      <span className="typography-10-regular text-semantic-text-on-bright-400">{shade}</span>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

export function PrimitiveColorSection() {
  return (
    <section id="primitive-colors">
      <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Primitive Colors</h2>
      <p className="typography-14-regular text-semantic-text-on-bright-600 mb-8">
        23 color families × 14 shades = 322 tokens. Raw color values used as the foundation for semantic tokens.
      </p>

      <div className="flex flex-col gap-3">
        {Object.entries(primitive).map(([family, scale]) => {
          const isAlpha = ALPHA_FAMILIES.has(family)
          return (
            <div key={family} className="flex items-center gap-3">
              <span className="typography-13-medium text-semantic-text-on-bright-800 w-24 shrink-0">
                {family}
              </span>
              <div className="flex gap-1">
                {SHADES.map((shade) => (
                  <Swatch
                    key={shade}
                    color={scale[shade]}
                    shade={shade}
                    isAlpha={isAlpha}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
