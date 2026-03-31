import { type HTMLAttributes, type ReactNode, useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { typography, type TypographyKey } from '@/tokens/typography'
import { usePretext } from './usePretext'
import { SkeletonBlock } from './SkeletonBlock'

/* ─── Typography resolver ──────────────────────────────────────────────────── */

/**
 * Derives pretext `font` shorthand and `lineHeight` from a typography token key.
 * Single source of truth — eliminates manual font/lineHeight synchronization.
 *
 * @example resolveTypography('22-semibold')
 * // → { font: "600 22px 'Geist Sans', sans-serif", lineHeight: 28 }
 */
function resolveTypography(key: TypographyKey) {
  const token = typography[key]

  // Extract px font-size from the key (e.g., "22-semibold" → 22)
  const fontSizePx = parseInt(key, 10)
  const lineHeight = parseInt(token.lineHeight, 10)
  const font = `${token.fontWeight} ${fontSizePx}px ${token.fontFamily}`

  return { font, lineHeight }
}

/* ─── Types ────────────────────────────────────────────────────────────────── */

type TextReservationPhase = 'estimation' | 'reservation' | 'content'

export interface TextReservationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Text content. `undefined`/`null` = text hasn't arrived (estimation mode). */
  text?: string | null
  /** Typography token key (e.g., `"16-regular"`, `"22-semibold"`).
   * Used to derive font metrics for pretext measurement and skeleton line height.
   * Must match the typography class used in the children render function.
   * @see {@link TypographyKey} */
  typography: TypographyKey
  /** Controls when content is displayed.
   * - `true` (default): content shows as soon as text is measured.
   * - `false`: skeleton is maintained even if text is available and measured.
   *   This allows pretext to compute accurate skeleton dimensions while
   *   keeping the skeleton visible (e.g., during loading animations).
   * @default true */
  ready?: boolean
  /** Render function called when text is ready to display.
   * Receives the measured text. Return the actual content element. */
  children: (text: string) => ReactNode
  /** Estimated number of lines for fallback skeleton (estimation mode).
   * Only used when `text` is `null`/`undefined` (no text to measure).
   * @default 3 */
  estimatedLines?: number
  /** Width ratio (0–1) of the last skeleton line in estimation mode.
   * @default 0.6 */
  lastLineRatio?: number
  /** Disable shimmer animation on skeleton lines.
   * @default false */
  disableAnimation?: boolean
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function TextReservation({
  text,
  typography: typographyKey,
  ready = true,
  children,
  estimatedLines = 3,
  lastLineRatio = 0.6,
  disableAnimation = false,
  className,
  style,
  ...rest
}: TextReservationProps) {
  const { font, lineHeight } = resolveTypography(typographyKey)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [showContent, setShowContent] = useState(false)

  // Observe container width for pretext maxWidth
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Pretext measurement
  const { fontReady, measurement } = usePretext({
    text,
    font,
    maxWidth: containerWidth,
    lineHeight,
  })

  // Determine phase
  let phase: TextReservationPhase
  if (text == null || !fontReady) {
    phase = 'estimation'
  } else if (!ready || !showContent) {
    phase = 'reservation'
  } else {
    phase = 'content'
  }

  // Transition: reservation → content (when ready and measurement is done)
  useEffect(() => {
    if (ready && measurement && text != null && fontReady) {
      const raf = requestAnimationFrame(() => {
        setShowContent(true)
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [ready, measurement, text, fontReady])

  // Reset when text becomes null or ready becomes false
  useEffect(() => {
    if (text == null || !ready) {
      setShowContent(false)
    }
  }, [text, ready])

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={style}
      {...rest}
    >
      {phase === 'content' && text != null ? (
        /* ─── Content phase: actual content with fade-in ─── */
        <div className="animate-[fade-in_var(--semantic-duration-normal)_var(--semantic-easing-enter)]">
          {children(text)}
        </div>
      ) : (
        /* ─── Estimation / Reservation phase: skeleton lines ─── */
        <SkeletonLines
          measurement={measurement}
          lineHeight={lineHeight}
          estimatedLines={estimatedLines}
          lastLineRatio={lastLineRatio}
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}

/* ─── Skeleton Lines (internal) ────────────────────────────────────────────── */

/**
 * Each skeleton line occupies exactly `lineHeight` px of vertical space,
 * matching the actual text layout. The visible bar (cap-height approximation)
 * is centered within that space. Total height = lineCount * lineHeight,
 * guaranteeing zero layout shift on skeleton → content transition.
 *
 * Bar height ratio: ~0.65 of lineHeight approximates the visual weight
 * of a line of text (between cap-height and ascender-to-descender).
 */
const BAR_HEIGHT_RATIO = 0.65

interface SkeletonLinesProps {
  measurement: ReturnType<typeof usePretext>['measurement']
  lineHeight: number
  estimatedLines: number
  lastLineRatio: number
  disableAnimation: boolean
}

function SkeletonLines({
  measurement,
  lineHeight,
  estimatedLines,
  lastLineRatio,
  disableAnimation,
}: SkeletonLinesProps) {
  const barHeight = Math.round(lineHeight * BAR_HEIGHT_RATIO)

  // Reservation mode: use pretext measurements for accurate line widths
  if (measurement) {
    return (
      <div className="flex flex-col">
        {measurement.lines.map((line, i) => (
          <div
            key={i}
            className="flex items-center"
            style={{ height: lineHeight }}
          >
            <SkeletonBlock
              shape="small"
              width={Math.max(line.width, 20)}
              height={barHeight}
              disableAnimation={disableAnimation}
            />
          </div>
        ))}
      </div>
    )
  }

  // Estimation mode: fallback heuristic
  return (
    <div className="flex flex-col">
      {Array.from({ length: estimatedLines }, (_, i) => {
        const isLast = i === estimatedLines - 1
        const widthPercent = isLast ? `${lastLineRatio * 100}%` : '100%'

        return (
          <div
            key={i}
            className="flex items-center"
            style={{ height: lineHeight }}
          >
            <SkeletonBlock
              shape="small"
              width={widthPercent}
              height={barHeight}
              disableAnimation={disableAnimation}
            />
          </div>
        )
      })}
    </div>
  )
}
