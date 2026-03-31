import { useState, useEffect, useRef, useCallback } from 'react'
import {
  prepareWithSegments,
  layoutWithLines,
  type PreparedTextWithSegments,
  type LayoutLine,
} from '@chenglou/pretext'

/* ─── Types ────────────────────────────────────────────────────────────────── */

export interface PretextMeasurement {
  height: number
  lineCount: number
  lines: LayoutLine[]
}

export interface UsePretextOptions {
  /** Text to measure. `undefined` or `null` means text hasn't arrived yet. */
  text: string | undefined | null
  /** CSS font shorthand (e.g., `"16px Pretendard Variable"`). */
  font: string
  /** Container width in pixels. */
  maxWidth: number
  /** Line height in pixels. */
  lineHeight: number
}

export interface UsePretextResult {
  /** Whether the target font has loaded. */
  fontReady: boolean
  /** Measurement result, or `null` if text is absent or font not loaded. */
  measurement: PretextMeasurement | null
}

/* ─── Hook ─────────────────────────────────────────────────────────────────── */

export function usePretext({
  text,
  font,
  maxWidth,
  lineHeight,
}: UsePretextOptions): UsePretextResult {
  const [fontReady, setFontReady] = useState(false)
  const preparedRef = useRef<PreparedTextWithSegments | null>(null)
  const prevTextRef = useRef<string | null>(null)
  const prevFontRef = useRef<string | null>(null)

  // Wait for the font to load before measuring
  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setFontReady(true)
    })
    return () => { cancelled = true }
  }, [])

  // Invalidate prepared cache when text or font changes
  const getPrepared = useCallback(() => {
    if (text == null) return null

    if (text !== prevTextRef.current || font !== prevFontRef.current) {
      preparedRef.current = prepareWithSegments(text, font)
      prevTextRef.current = text
      prevFontRef.current = font
    }

    return preparedRef.current
  }, [text, font])

  // Compute measurement — only when font is ready and text is present
  if (!fontReady || text == null || maxWidth <= 0) {
    return { fontReady, measurement: null }
  }

  const prepared = getPrepared()
  if (!prepared) {
    return { fontReady, measurement: null }
  }

  const result = layoutWithLines(prepared, maxWidth, lineHeight)

  return {
    fontReady,
    measurement: {
      height: result.height,
      lineCount: result.lineCount,
      lines: result.lines,
    },
  }
}
