import { semantic } from '@/tokens/semantic'
import type { SemanticTheme } from '@/tokens/semantic'

/* ─── Mapping table: semantic → primitive source ──────────────────────────── */

const PRIMITIVE_MAP: Record<string, Record<string, string>> = {
  'Emphasized.Purple':  { light: 'Purple', dark: 'Purple' },
  'Emphasized.Blue':    { light: 'Blue', dark: 'Blue' },
  'Emphasized.Orange':  { light: 'RedOrange', dark: 'RedOrange' },
  Success:  { light: 'Forest', dark: 'Forest' },
  Warning:  { light: 'Amber (offset)', dark: 'Amber (offset)' },
  Error:    { light: 'RedDark', dark: 'RedDark' },
  'Neutral.Solid':      { light: 'Gray', dark: 'Gray (reversed)' },
  'Neutral.BlackAlpha': { light: 'BlackAlpha', dark: 'WhiteAlpha (swapped)' },
  'Neutral.WhiteAlpha': { light: 'WhiteAlpha', dark: 'BlackAlpha (swapped)' },
  Background:           { light: 'Gray 0/50/70', dark: 'Gray 950/900/800' },
  'Divider.Solid':      { light: 'Gray', dark: 'Gray (reversed)' },
  'Divider.Alpha':      { light: 'BlackAlpha', dark: 'BlackAlpha' },
  'Text.OnBright':      { light: 'BlackAlpha', dark: 'WhiteAlpha (swapped)' },
  'Text.OnDim':         { light: 'WhiteAlpha (offset)', dark: 'BlackAlpha (swapped)' },
  'State.OnBright':     { light: 'BlackAlpha', dark: 'WhiteAlpha (swapped)' },
  'State.OnDim':        { light: 'WhiteAlpha (offset)', dark: 'BlackAlpha (swapped)' },
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

type FlatCategory = {
  label: string
  cssPrefix: string
  shades: (string | number)[]
  isAlpha?: boolean
  isText?: boolean
  isState?: boolean
}

function flattenCategories(theme: SemanticTheme): FlatCategory[] {
  const cats: FlatCategory[] = []

  // Emphasized
  for (const [sub, scale] of Object.entries(theme.Emphasized)) {
    const kebab = sub.toLowerCase()
    cats.push({
      label: `Emphasized.${sub}`,
      cssPrefix: `--semantic-emphasized-${kebab}`,
      shades: Object.keys(scale),
    })
  }

  // Status
  for (const name of ['Success', 'Warning', 'Error'] as const) {
    cats.push({
      label: name,
      cssPrefix: `--semantic-${name.toLowerCase()}`,
      shades: Object.keys(theme[name]),
    })
  }

  // Neutral sub-families
  for (const [sub, scale] of Object.entries(theme.Neutral)) {
    const kebab = sub.replace(/([A-Z])/g, (_, c, i) => (i ? '-' : '') + c.toLowerCase())
    cats.push({
      label: `Neutral.${sub}`,
      cssPrefix: `--semantic-neutral-${kebab}`,
      shades: Object.keys(scale),
      isAlpha: sub !== 'Solid',
    })
  }

  // Background
  cats.push({
    label: 'Background',
    cssPrefix: '--semantic-background',
    shades: Object.keys(theme.Background),
  })

  // Divider
  for (const [sub, scale] of Object.entries(theme.Divider)) {
    const kebab = sub.toLowerCase()
    cats.push({
      label: `Divider.${sub}`,
      cssPrefix: `--semantic-divider-${kebab}`,
      shades: Object.keys(scale),
      isAlpha: sub === 'Alpha',
    })
  }

  // Text
  for (const [sub, scale] of Object.entries(theme.Text)) {
    const kebab = sub.replace(/([A-Z])/g, '-$1').toLowerCase()
    cats.push({
      label: `Text.${sub}`,
      cssPrefix: `--semantic-text${kebab}`,
      shades: Object.keys(scale),
      isText: true,
    })
  }

  // State
  for (const [sub, scale] of Object.entries(theme.State)) {
    const kebab = sub.replace(/([A-Z])/g, '-$1').toLowerCase()
    cats.push({
      label: `State.${sub}`,
      cssPrefix: `--semantic-state${kebab}`,
      shades: Object.keys(scale),
      isState: true,
    })
  }

  return cats
}

const CHECKERBOARD = `repeating-conic-gradient(#d0d0d0 0% 25%, #f0f0f0 0% 50%) 0 0 / 12px 12px`
const CHECKERBOARD_DARK = `repeating-conic-gradient(#333 0% 25%, #555 0% 50%) 0 0 / 12px 12px`

/* ─── Swatch row ──────────────────────────────────────────────────────────── */

function SwatchRow({
  cat,
  themeMode,
  primitiveSource,
}: {
  cat: FlatCategory
  themeMode: 'light' | 'dark'
  primitiveSource?: string
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="typography-13-medium text-semantic-text-on-bright-800">{cat.label}</span>
        {primitiveSource && (
          <span className="typography-11-regular text-semantic-text-on-bright-400">
            ← {primitiveSource}
          </span>
        )}
      </div>
      <div className="flex gap-1 flex-wrap">
        {cat.shades.map((shade) => {
          const varName = `${cat.cssPrefix}-${shade}`

          if (cat.isText) {
            return (
              <div
                key={shade}
                className="flex flex-col items-center gap-0.5"
              >
                <div className="w-10 h-10 rounded-1 border border-semantic-divider-solid-50 flex items-center justify-center bg-semantic-background-0">
                  <span
                    className="typography-14-bold"
                    style={{ color: `var(${varName})` }}
                  >
                    Aa
                  </span>
                </div>
                <span className="typography-10-regular text-semantic-text-on-bright-400">{shade}</span>
              </div>
            )
          }

          if (cat.isState) {
            return (
              <div
                key={shade}
                className="flex flex-col items-center gap-0.5"
              >
                <div className="w-10 h-10 rounded-1 border border-semantic-divider-solid-50 bg-semantic-background-0 relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `var(${varName})` }}
                  />
                </div>
                <span className="typography-10-regular text-semantic-text-on-bright-400">{shade}</span>
              </div>
            )
          }

          const needsCheckerboard = cat.isAlpha
          const checkerBg = themeMode === 'dark' ? CHECKERBOARD_DARK : CHECKERBOARD

          return (
            <div key={shade} className="flex flex-col items-center gap-0.5">
              <div
                className="w-10 h-10 rounded-1 border border-semantic-divider-solid-50 relative overflow-hidden"
                style={needsCheckerboard ? { background: checkerBg } : undefined}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: `var(${varName})` }}
                />
              </div>
              <span className="typography-10-regular text-semantic-text-on-bright-400">{shade}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Theme column ────────────────────────────────────────────────────────── */

function ThemeColumn({ mode, categories }: { mode: 'light' | 'dark'; categories: FlatCategory[] }) {
  return (
    <div
      data-theme={mode}
      className="flex-1 rounded-3 p-5 bg-semantic-background-0 border border-semantic-divider-solid-100"
    >
      <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-4 capitalize">{mode}</h3>
      {categories.map((cat) => (
        <SwatchRow
          key={cat.label}
          cat={cat}
          themeMode={mode}
          primitiveSource={PRIMITIVE_MAP[cat.label]?.[mode]}
        />
      ))}
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

export function SemanticColorSection() {
  const lightCats = flattenCategories(semantic.light)
  const darkCats = flattenCategories(semantic.dark)

  return (
    <section id="semantic-colors">
      <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Semantic Colors</h2>
      <p className="typography-14-regular text-semantic-text-on-bright-600 mb-2">
        Theme-aware tokens mapped from Primitive colors. Light and Dark side by side.
      </p>
      <p className="typography-13-regular text-semantic-text-on-bright-400 mb-8">
        Each row shows the primitive source mapping (← arrow).
      </p>

      <div className="flex gap-4">
        <ThemeColumn mode="light" categories={lightCats} />
        <ThemeColumn mode="dark" categories={darkCats} />
      </div>
    </section>
  )
}
