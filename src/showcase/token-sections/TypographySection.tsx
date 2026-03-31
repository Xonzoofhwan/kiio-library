import { typography } from '@/tokens/typography'
import type { TypographySize, TypographyWeight, TypographyTokenValue } from '@/tokens/typography'

const SIZES: TypographySize[] = ['64', '48', '40', '32', '28', '24', '22', '20', '18', '17', '16', '15', '14', '13', '12', '11', '10']
const WEIGHTS: TypographyWeight[] = ['regular', 'medium', 'semibold', 'bold']

export function TypographySection() {
  return (
    <section id="typography">
      <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Typography</h2>
      <p className="typography-14-regular text-semantic-text-on-bright-600 mb-8">
        17 sizes × 4 weights = 68 composite tokens. Each token sets font-size, line-height, letter-spacing, and font-weight.
      </p>

      {/* Column headers */}
      <div className="flex items-end gap-4 mb-4 pl-16">
        {WEIGHTS.map((w) => (
          <div key={w} className="flex-1 typography-12-semibold text-semantic-text-on-bright-400 uppercase tracking-wider">
            {w} ({w === 'regular' ? 400 : w === 'medium' ? 500 : w === 'semibold' ? 600 : 700})
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {SIZES.map((size) => (
          <div key={size} className="flex items-start gap-4">
            {/* Size label */}
            <div className="w-12 shrink-0 flex flex-col items-end pt-1">
              <span className="typography-14-bold text-semantic-text-on-bright-900">{size}</span>
            </div>

            {/* Weight cells */}
            {WEIGHTS.map((weight) => {
              const key = `${size}-${weight}` as keyof typeof typography
              const token = typography[key] as TypographyTokenValue
              return (
                <div key={weight} className="flex-1 min-w-0">
                  <div className={`typography-${size}-${weight} text-semantic-text-on-bright-900 truncate`}>
                    Aa 가나다 123
                  </div>
                  <div className="typography-10-regular text-semantic-text-on-bright-400 mt-0.5">
                    {token.fontSize} / {token.lineHeight} / {token.letterSpacing}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
