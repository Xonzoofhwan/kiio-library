import { useState, useEffect } from 'react'

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

  /**
   * skeleton이 등장한 시각. `null`이면 아직 defer 단계이거나 idle이다.
   *
   * ref가 아니라 state인 이유: 이 값이 곧 `showSkeleton`이므로 렌더에 필요하고,
   * 렌더 중 ref를 읽는 것은 React가 금지한다.
   */
  const [skeletonShownAt, setSkeletonShownAt] = useState<number | null>(null)
  /** minHold 창이 닫혔는가. 타이머만 이 값을 참으로 만든다. */
  const [holdDone, setHoldDone] = useState(false)

  /**
   * `isLoading`이 바뀌는 순간의 초기화는 **렌더 중 파생**이다.
   *
   * effect 안에서 되돌리면 초기화가 한 프레임 늦어, 새 로딩이 시작됐는데도
   * 직전 로딩의 skeleton과 ready가 한 번 더 그려진다. React가 문서화한
   * "이전 렌더 정보로 상태 조정" 패턴을 쓴다 — 렌더 중 setState는 허용되며,
   * React가 커밋 전에 즉시 재실행하므로 중간 상태가 화면에 나가지 않는다.
   */
  const [prevIsLoading, setPrevIsLoading] = useState(isLoading)
  if (isLoading !== prevIsLoading) {
    setPrevIsLoading(isLoading)
    if (isLoading) {
      setSkeletonShownAt(null)
      setHoldDone(false)
    }
  }

  // defer 타이머 — 로딩 중에만 돈다. deps에 skeletonShownAt을 넣지 않는다.
  // 넣으면 타이머가 스스로를 재시작해 defer가 영원히 만료되지 않는다.
  useEffect(() => {
    if (!isLoading) return
    const deferTimer = setTimeout(() => setSkeletonShownAt(performance.now()), deferMs)
    return () => clearTimeout(deferTimer)
  }, [isLoading, deferMs])

  // minHold 타이머 — 로딩이 끝났고 skeleton이 이미 떴을 때만 필요하다.
  useEffect(() => {
    if (isLoading || skeletonShownAt == null) return
    const remaining = Math.max(0, minHoldMs - (performance.now() - skeletonShownAt))
    const holdTimer = setTimeout(() => setHoldDone(true), remaining)
    return () => clearTimeout(holdTimer)
  }, [isLoading, skeletonShownAt, minHoldMs])

  // skeleton이 한 번 뜨면 콘텐츠 fade-in 동안에도 마운트를 유지한다 —
  // 언마운트하면 fade-in 할 대상 자체가 사라진다.
  const showSkeleton = skeletonShownAt !== null
  // skeleton을 건너뛴 경로(skeletonShownAt == null)는 hold 없이 곧장 ready다.
  const ready = !isLoading && (skeletonShownAt === null || holdDone)

  return { showSkeleton, ready }
}
