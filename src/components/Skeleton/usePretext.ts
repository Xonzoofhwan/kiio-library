import { useState, useEffect, useMemo } from 'react'
import { prepareWithSegments, layoutWithLines, type LayoutLine } from '@chenglou/pretext'

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

  // Wait for the font to load before measuring
  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setFontReady(true)
    })
    return () => { cancelled = true }
  }, [])

  // 세그먼트 준비는 text/font 에만 의존하므로 여기서 캐시한다.
  // fontReady 를 의존성에 둔 이유: 폰트 로드 전에는 fallback 폰트 폭이 잡혀
  // 실제 레이아웃과 어긋난다. 이전의 ref 캐시도 fontReady 가 켜진 뒤 첫 호출에서
  // 채워졌으므로 준비 시점은 그대로다 — 렌더 중 계산이라 첫 페인트 전에 값이 나온다.
  const prepared = useMemo(() => {
    if (!fontReady || text == null) return null
    return prepareWithSegments(text, font)
  }, [fontReady, text, font])

  // 줄바꿈 결과만 컨테이너 폭·행간에 의존한다. 준비 단계와 분리해야
  // 리사이즈마다 세그먼트를 다시 재지 않는다.
  const measurement = useMemo(() => {
    if (prepared == null || maxWidth <= 0) return null

    const result = layoutWithLines(prepared, maxWidth, lineHeight)
    return {
      height: result.height,
      lineCount: result.lineCount,
      lines: result.lines,
    }
  }, [prepared, maxWidth, lineHeight])

  return { fontReady, measurement }
}
