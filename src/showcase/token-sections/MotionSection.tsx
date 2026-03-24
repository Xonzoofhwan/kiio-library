import { motion } from '@/tokens/motion'

/* ─── Easing curve SVG ────────────────────────────────────────────────────── */

const EASING_CURVES: Record<string, [number, number, number, number]> = {
  'ease-out':    [0.0, 0.0, 0.2, 1],
  'ease-in':     [0.4, 0.0, 1, 1],
  'ease-in-out': [0.4, 0.0, 0.2, 1],
  'linear':      [0, 0, 1, 1],
}

const SEMANTIC_TO_PRIMITIVE_EASING: Record<string, string> = {
  enter: 'ease-out',
  exit: 'ease-in',
  move: 'ease-in-out',
  linear: 'linear',
}

const SEMANTIC_TO_PRIMITIVE_DURATION: Record<string, string> = {
  instant: '0',
  fast: '100',
  normal: '200',
  slow: '300',
  slower: '500',
}

function BezierCurve({ points }: { points: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = points
  const w = 80
  const h = 40
  const pad = 4

  // Map control points to SVG coords (y inverted)
  const sx = pad
  const sy = h - pad
  const ex = w - pad
  const ey = pad
  const cx1 = pad + x1 * (w - pad * 2)
  const cy1 = h - pad - y1 * (h - pad * 2)
  const cx2 = pad + x2 * (w - pad * 2)
  const cy2 = h - pad - y2 * (h - pad * 2)

  return (
    <svg width={w} height={h} className="shrink-0">
      {/* Grid */}
      <rect x={pad} y={pad} width={w - pad * 2} height={h - pad * 2} fill="none" stroke="var(--semantic-divider-solid-100)" strokeWidth="1" />
      {/* Curve */}
      <path
        d={`M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`}
        fill="none"
        stroke="var(--semantic-emphasized-purple-500)"
        strokeWidth="2"
      />
      {/* Endpoints */}
      <circle cx={sx} cy={sy} r="2" fill="var(--semantic-emphasized-purple-500)" />
      <circle cx={ex} cy={ey} r="2" fill="var(--semantic-emphasized-purple-500)" />
    </svg>
  )
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

export function MotionSection() {
  return (
    <section id="motion">
      <h2 className="typography-20-bold text-semantic-text-on-bright-900 mb-6">Motion</h2>
      <p className="typography-14-regular text-semantic-text-on-bright-600 mb-8">
        2-layer system: Primitive → Semantic. Components use semantic tokens only.
      </p>

      {/* Duration */}
      <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-4">Duration</h3>
      <div className="rounded-3 border border-semantic-divider-solid-100 overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-semantic-background-50">
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Semantic</th>
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Primitive</th>
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Value</th>
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Usage</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(motion.semantic.duration).map(([name, _cssVar]) => {
              const primKey = SEMANTIC_TO_PRIMITIVE_DURATION[name]
              const value = primKey ? motion.primitive.duration[primKey as keyof typeof motion.primitive.duration] : ''
              const usageMap: Record<string, string> = {
                instant: 'Color swap',
                fast: 'Hover, focus',
                normal: 'Dropdown, enter/exit',
                slow: 'Modal, overlay',
                slower: 'Page transition',
              }
              return (
                <tr key={name} className="border-t border-semantic-divider-solid-50">
                  <td className="typography-14-medium text-semantic-text-on-bright-900 px-4 py-2.5">{name}</td>
                  <td className="typography-13-regular text-semantic-text-on-bright-600 px-4 py-2.5">{primKey}</td>
                  <td className="typography-13-medium text-semantic-text-on-bright-800 px-4 py-2.5 font-mono">{value}</td>
                  <td className="typography-13-regular text-semantic-text-on-bright-400 px-4 py-2.5">{usageMap[name]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Easing */}
      <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-4">Easing</h3>
      <div className="rounded-3 border border-semantic-divider-solid-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-semantic-background-50">
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Semantic</th>
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Primitive</th>
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Value</th>
              <th className="typography-12-semibold text-semantic-text-on-bright-400 text-left px-4 py-2 uppercase tracking-wider">Curve</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(motion.semantic.easing).map(([name, _cssVar]) => {
              const primKey = SEMANTIC_TO_PRIMITIVE_EASING[name]
              const value = primKey ? motion.primitive.easing[primKey as keyof typeof motion.primitive.easing] : ''
              const curvePoints = primKey ? EASING_CURVES[primKey] : undefined
              return (
                <tr key={name} className="border-t border-semantic-divider-solid-50">
                  <td className="typography-14-medium text-semantic-text-on-bright-900 px-4 py-2.5">{name}</td>
                  <td className="typography-13-regular text-semantic-text-on-bright-600 px-4 py-2.5">{primKey}</td>
                  <td className="typography-13-regular text-semantic-text-on-bright-400 px-4 py-2.5 font-mono">{value}</td>
                  <td className="px-4 py-2.5">
                    {curvePoints && <BezierCurve points={curvePoints} />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
