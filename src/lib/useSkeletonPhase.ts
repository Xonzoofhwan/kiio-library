import { useState, useEffect, useRef } from 'react'

/* ─── Types ────────────────────────────────────────────────────────────────── */

export interface UseSkeletonPhaseOptions {
  /** Defer 시간 — 이 시간 안에 로딩이 끝나면 skeleton을 띄우지 않음 (anti-flash).
   * @default 100 */
  deferMs?: number
  /** Minimum hold 시간 — skeleton이 한 번 등장하면 최소한 이 시간 동안 유지.
   * 이 hold window 동안 TextReservation의 pretext가 정확한 라인 폭으로 측정.
   * @default 300 */
  minHoldMs?: number
}

export interface UseSkeletonPhaseResult {
  /** Skeleton(SkeletonBlock/TextReservation)을 마운트할지 여부.
   * - `false`: defer 단계 (아직 deferMs 안 됨) 또는 idle → 콘텐츠 직접 렌더 또는 null
   * - `true`: skeleton 등장 후 (콘텐츠 fade-in 단계 포함) → skeleton 또는 TextReservation 마운트 */
  showSkeleton: boolean
  /** TextReservation의 `ready` prop으로 전달.
   * - `false`: skeleton 표시 중
   * - `true`: 콘텐츠 fade-in */
  ready: boolean
}

/* ─── Hook ─────────────────────────────────────────────────────────────────── */

/**
 * "Defer + Minimum Hold" 로딩 정책을 강제하는 훅.
 *
 * 동작:
 * 1. `isLoading=true` 진입 → defer 타이머 시작 (기본 100ms)
 * 2-A. defer 만료 전 `isLoading=false` → skeleton 건너뛰고 즉시 콘텐츠 표시
 *      (anti-flash: 빠른 작업은 시각적 잡음 없이)
 * 2-B. defer 만료 후에도 여전히 로딩 → skeleton 표시 + minHold 타이머 시작 (기본 300ms)
 * 3. minHold 만료 전 `isLoading=false` → minHold 만료 시까지 skeleton 유지 → fade-in
 * 4. minHold 만료 후 `isLoading=false` → 즉시 fade-in
 *
 * 이 정책의 핵심: skeleton이 뜨는 모든 경우에 hold window가 생기고,
 * 그 동안 TextReservation의 pretext가 정확한 라인 폭으로 측정 → fade-in 시 layout shift 0.
 *
 * @example
 * const { data, isLoading } = useFetch(...)
 * const { showSkeleton, ready } = useSkeletonPhase(isLoading)
 *
 * if (!showSkeleton) {
 *   return data ? <p>{data.title}</p> : null
 * }
 * return (
 *   <TextReservation text={data?.title ?? null} typography="16-semibold" ready={ready}>
 *     {(text) => <p className="typography-16-semibold">{text}</p>}
 *   </TextReservation>
 * )
 */
export function useSkeletonPhase(
  isLoading: boolean,
  options: UseSkeletonPhaseOptions = {},
): UseSkeletonPhaseResult {
  const { deferMs = 100, minHoldMs = 300 } = options

  const [showSkeleton, setShowSkeleton] = useState(false)
  const [ready, setReady] = useState(!isLoading)
  const skeletonShownAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      // 로딩 시작: defer 단계 진입
      setReady(false)
      setShowSkeleton(false)
      skeletonShownAtRef.current = null

      const deferTimer = setTimeout(() => {
        setShowSkeleton(true)
        skeletonShownAtRef.current = performance.now()
      }, deferMs)

      return () => clearTimeout(deferTimer)
    }

    // 로딩 종료
    const shownAt = skeletonShownAtRef.current
    if (shownAt == null) {
      // skeleton 등장 전 (defer 단계 또는 idle) → 곧장 콘텐츠
      setShowSkeleton(false)
      setReady(true)
      return
    }

    // skeleton이 이미 떴음 → minHold 충족 여부 확인
    const elapsed = performance.now() - shownAt
    const remaining = Math.max(0, minHoldMs - elapsed)

    if (remaining === 0) {
      setReady(true)
      return
    }

    const holdTimer = setTimeout(() => setReady(true), remaining)
    return () => clearTimeout(holdTimer)
  }, [isLoading, deferMs, minHoldMs])

  return { showSkeleton, ready }
}
