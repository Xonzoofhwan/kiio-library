import { numbers } from '@/tokens/numbers'

export function RadiusSection() {
  const entries = Object.entries(numbers.radius)

  return (
    <section id="radius">
      <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Border Radius</h2>
      <p className="typography-14-regular text-semantic-text-on-bright-600 mb-8">
        23 radius steps. Tailwind: rounded-2 = 8px, rounded-4 = 16px.
      </p>

      <div className="flex flex-wrap gap-4">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-1.5">
            <div
              className="w-16 h-16 border-2 border-semantic-emphasized-purple-400 bg-semantic-emphasized-purple-50"
              style={{ borderRadius: value }}
            />
            <span className="typography-12-semibold text-semantic-text-on-bright-800">{key}</span>
            <span className="typography-10-regular text-semantic-text-on-bright-400">{value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
