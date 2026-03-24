import { numbers } from '@/tokens/numbers'

const MAX_BAR_WIDTH = 320

export function SpacingSection() {
  const entries = Object.entries(numbers.spacing)

  return (
    <section id="spacing">
      <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Spacing</h2>
      <p className="typography-14-regular text-semantic-text-on-bright-600 mb-8">
        36 spacing steps based on 4px base unit. Tailwind: p-4 = 16px, gap-6 = 24px.
      </p>

      <div className="flex flex-col gap-1.5">
        {entries.map(([key, value]) => {
          const px = parseInt(value, 10)
          const barWidth = Math.min(px, MAX_BAR_WIDTH)
          const isOverflow = px > MAX_BAR_WIDTH

          return (
            <div key={key} className="flex items-center gap-3 h-6">
              {/* Key label */}
              <span className="typography-13-medium text-semantic-text-on-bright-800 w-10 text-right shrink-0">
                {key}
              </span>

              {/* Bar */}
              <div className="flex-1 flex items-center">
                <div
                  className="h-3 rounded-0.5 bg-semantic-emphasized-purple-400"
                  style={{ width: barWidth || 1 }}
                />
                {isOverflow && (
                  <div className="w-4 border-t border-dashed border-semantic-emphasized-purple-300 ml-0.5" />
                )}
              </div>

              {/* Value */}
              <span className="typography-12-regular text-semantic-text-on-bright-400 w-14 shrink-0">
                {value}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
