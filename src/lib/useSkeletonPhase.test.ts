/**
 * `useSkeletonPhase` 타이밍 계약 테스트 — Defer + Minimum Hold.
 *
 * 이 훅은 "로딩이 짧으면 skeleton 을 아예 띄우지 않고, 한 번 띄웠으면 최소 시간은
 * 유지한다"는 정책을 **시간**으로 강제한다. 정책이 깨져도 타입은 통과하고 화면도
 * 대체로 그럴듯해 보인다 — 증상은 "빠른 응답에서 skeleton 이 한 프레임 번쩍인다",
 * "fade-in 직전에 레이아웃이 튄다" 처럼 손으로는 재현하기 어려운 형태로만 나온다.
 * 그래서 시계를 통제하고 상태 전이를 표본으로 남겨 판정한다.
 *
 * 훅은 최근 리팩터링에서 effect 안 동기 setState 를 버리고 **렌더 중 파생 + 타이머**로
 * 바뀌었다. 이 파일이 고정하는 것은 그 리팩터링이 지켜야 했던 타이밍 불변식이다.
 *
 * ## 보장하는 것
 * 1. defer 만료 **전**에 로딩이 끝나면 skeleton 이 한 번도 뜨지 않는다 (anti-flash)
 * 2. defer 만료 **후**에도 로딩 중이면 skeleton 이 뜬다
 * 3. skeleton 등장 후 minHold 가 차기 전에는 `ready` 가 서지 않는다
 * 4. minHold 가 이미 찼으면 로딩 종료 직후 `ready` 가 선다
 * 5. skeleton 은 한 번 뜨면 fade-in 동안에도 내려가지 않는다
 * 6. 로딩이 다시 시작되면 **같은 렌더에서** 초기화된다
 *
 * ## 보장하지 않는 것
 * 실제 화면. `showSkeleton`/`ready` 를 받은 소비자가 무엇을 그리는지, fade-in 이
 * 부드러운지, TextReservation 의 라인 폭 측정이 hold window 안에 끝나는지는 범위 밖이다
 * — jsdom 은 레이아웃도 페인트도 하지 않으므로 애초에 잴 수 없다. 여기서 통과했다는
 * 말은 "정책의 시간 축이 맞다"까지이지 "로딩이 매끄럽다"가 아니다.
 * 재지 못한 항목은 `UNMEASURED_ASPECTS` 에 사유와 함께 남겨 둔다.
 *
 * 판정 로직(타임라인 술어)은 순수 함수로 분리했다. 훅이 계약을 만족하는 동안에도
 * 술어가 고장 나면 이 테스트는 조용히 통과하는 껍데기가 되므로, 아래 두 겹으로 검사한다.
 * (1) 가짜 타임라인으로 술어가 위반을 잡는지, (2) **정책이 없는 대조 훅**을 같은
 * 탐침에 통과시켜 술어가 실제로 red 를 내는지.
 * (`src/lib/**` 의 `.test.ts` 는 라이브러리 표면이 아니므로 밖으로 export 하지 않는다.)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useSkeletonPhase, type UseSkeletonPhaseOptions, type UseSkeletonPhaseResult } from './useSkeletonPhase'

/* ─── 시계 통제 ────────────────────────────────────────────────────────────── */

/**
 * `performance` 를 반드시 함께 fake 한다.
 *
 * minHold 의 남은 시간은 `minHoldMs - (performance.now() - skeletonShownAt)` 으로 계산된다.
 * 타이머만 fake 하고 `performance` 를 실시계로 두면 이 뺄셈이 항상 0 에 가까워져
 * **로딩이 얼마나 걸렸든 hold 가 늘 full minHold 로 잡힌다.** 그러면 계약 4(이미
 * hold 가 찬 경우 즉시 ready)가 검사 대상 자체를 잃고, 계약 3 은 우연히 통과한다.
 * `toFake` 에 목록을 명시하는 이유도 같다 — 기본값에는 `performance` 가 없다.
 *
 * `queueMicrotask`·`nextTick` 은 일부러 빼 둔다. React 의 스케줄링과 `act` 의 flush 가
 * 마이크로태스크에 의존하므로 함께 fake 하면 훅이 아니라 러너가 멈춘다.
 */
const FAKED_CLOCKS = ['setTimeout', 'clearTimeout', 'Date', 'performance'] as const

beforeEach(() => {
  vi.useFakeTimers({ toFake: [...FAKED_CLOCKS] })
})

afterEach(() => {
  vi.useRealTimers()
})

/* ─── 표본 타임라인 ────────────────────────────────────────────────────────── */

/** 표본 간격. 이보다 짧게 살았다 사라지는 상태는 이 테스트가 보지 못한다. */
const SAMPLE_STEP_MS = 10

interface PhaseSample {
  /** fake clock 기준 경과 ms. */
  at: number
  showSkeleton: boolean
  ready: boolean
}

/** 계약별 시나리오가 공유하는 시간 값. 전부 `SAMPLE_STEP_MS` 의 배수여야 한다(아래 탐침이 강제). */
const DEFER_MS = 100
const MIN_HOLD_MS = 300

interface PhaseProbe {
  /** 지금까지 찍은 표본. 시각 오름차순이다. */
  readonly timeline: readonly PhaseSample[]
  /** `SAMPLE_STEP_MS` 씩 시계를 진행시키며 매 걸음 표본을 남긴다. */
  advance(ms: number): void
  /** `isLoading` 을 바꾸고 그 직후 상태를 표본으로 남긴다. 시계는 진행하지 않는다. */
  setLoading(isLoading: boolean): void
  /** 마지막 표본. */
  last(): PhaseSample
}

/**
 * 훅을 시계 위에 올려 놓고 상태 전이를 표본으로 수집한다.
 *
 * `advance` 가 한 번에 뛰지 않고 잘게 나누는 이유: 계약 위반은 대부분 **잠깐 스쳐가는
 * 상태**다(한 프레임 번쩍이는 skeleton, 한 틱 먼저 서는 ready). 목표 시각에서만
 * 읽으면 그 중간을 통째로 놓친다.
 *
 * 훅을 인자로 받는 이유: 같은 탐침에 정책 없는 대조 훅을 태워 술어가 실제로 red 를
 * 내는지 보여주기 위해서다. 탐침과 술어를 한 쌍으로 검증하지 않으면, 술어가 옳아도
 * 탐침이 아무것도 관찰하지 못한 채 통과할 수 있다.
 */
function renderPhaseProbe(
  usePhase: (isLoading: boolean) => UseSkeletonPhaseResult,
  initialLoading: boolean,
  options: UseSkeletonPhaseOptions = {},
): PhaseProbe {
  for (const [name, value] of Object.entries(options)) {
    if (typeof value === 'number' && value % SAMPLE_STEP_MS !== 0) {
      // 배수가 아니면 "표본이 찍힌 시각"과 "실제 전이 시각"이 어긋나 술어가
      // minHold 창을 실제보다 넓게 잡고 오탐한다.
      throw new Error(`${name}=${value} 은 SAMPLE_STEP_MS(${SAMPLE_STEP_MS}) 의 배수여야 한다`)
    }
  }

  const timeline: PhaseSample[] = []
  let now = 0

  const { result, rerender } = renderHook(({ isLoading }) => usePhase(isLoading), {
    initialProps: { isLoading: initialLoading },
  })

  const sample = () => {
    timeline.push({ at: now, ...result.current })
  }
  sample()

  return {
    timeline,
    advance(ms) {
      let remaining = ms
      while (remaining > 0) {
        const step = Math.min(SAMPLE_STEP_MS, remaining)
        act(() => {
          vi.advanceTimersByTime(step)
        })
        now += step
        remaining -= step
        sample()
      }
    },
    setLoading(isLoading) {
      act(() => {
        rerender({ isLoading })
      })
      sample()
    },
    last() {
      return timeline[timeline.length - 1]
    },
  }
}

/* ─── 판정 로직 (순수 함수) ────────────────────────────────────────────────── */

/** skeleton 이 처음 뜬 표본. anti-flash 경로에서는 `undefined` 여야 한다. */
function firstSkeletonSample(timeline: readonly PhaseSample[]): PhaseSample | undefined {
  return timeline.find((sample) => sample.showSkeleton)
}

/** `ready` 가 처음 선 표본. */
function firstReadySample(timeline: readonly PhaseSample[]): PhaseSample | undefined {
  return timeline.find((sample) => sample.ready)
}

/**
 * 계약 5 위반: `showSkeleton` 이 true → false 로 내려간 표본.
 *
 * 로딩이 **다시 시작되는** 경우에도 내려가지만 그건 정상이므로(계약 6), 이 술어는
 * 재시작이 없는 한 사이클의 타임라인에만 쓴다. 재시작 초기화는 별도 케이스에서 본다.
 */
function findSkeletonDrops(timeline: readonly PhaseSample[]): PhaseSample[] {
  const drops: PhaseSample[] = []
  for (let i = 1; i < timeline.length; i += 1) {
    if (timeline[i - 1].showSkeleton && !timeline[i].showSkeleton) drops.push(timeline[i])
  }
  return drops
}

/**
 * 계약 3 위반: skeleton 이 뜬 뒤 minHold 가 차기 전에 `ready` 인 표본.
 *
 * skeleton 이 아예 뜨지 않은 타임라인(anti-flash 경로)에는 hold 의무가 없으므로 빈 배열이다.
 */
function findReadyBeforeMinHold(
  timeline: readonly PhaseSample[],
  minHoldMs: number,
): PhaseSample[] {
  const shown = firstSkeletonSample(timeline)
  if (!shown) return []
  const holdUntil = shown.at + minHoldMs
  return timeline.filter((sample) => sample.ready && sample.at < holdUntil)
}

/** 실패 메시지에 위반 표본을 전부 싣는다. 개수만 알면 어느 순간이 깨졌는지 알 수 없다. */
function formatSamples(title: string, samples: readonly PhaseSample[]): string {
  if (samples.length === 0) return ''
  return [
    `${title} (${samples.length}건):`,
    ...samples.map((s) => `  - t=${s.at}ms showSkeleton=${s.showSkeleton} ready=${s.ready}`),
  ].join('\n')
}

/* ─── 미검증 목록 ──────────────────────────────────────────────────────────── */

/**
 * 이 테스트가 **보지 못하는** 것. 통과한 것이 아니라 재지 못한 것이다.
 * 목록이 비어 있지 않은 한 "로딩 정책 전부 검증됨"이라고 쓰지 않는다.
 */
const UNMEASURED_ASPECTS: Record<string, string> = {
  'fade-in 의 시각 품질':
    'jsdom 은 레이아웃도 페인트도 하지 않는다. opacity 전이가 실제로 보이는지는 쇼케이스 육안 확인의 몫이다.',
  'hold window 안에 pretext 측정이 끝나는가':
    '라인 폭 측정은 실제 폰트 메트릭을 요구한다. jsdom 의 텍스트 크기는 전부 0 이라 측정 자체가 성립하지 않는다.',
  '실제 브라우저의 타이머 지터':
    'fake clock 은 정확히 진행한다. 배경 탭 스로틀링이나 긴 태스크로 defer 가 밀리는 상황은 여기서 재현되지 않는다.',
}

/* ─── 대조군 — 정책이 없는 훅 ─────────────────────────────────────────────── */

/**
 * defer 도 minHold 도 없는 순진한 구현. **red 시연 전용이다.**
 *
 * 손으로 만든 타임라인만으로 술어를 검사하면 "술어는 옳지만 탐침이 아무것도 관찰하지
 * 못하는" 조합이 그대로 통과한다. 이 훅을 같은 탐침에 태워, 실제 렌더 → 표본 →
 * 술어 경로가 위반을 잡아내는 것을 보인다.
 */
function useNaiveSkeletonPhase(isLoading: boolean): UseSkeletonPhaseResult {
  return { showSkeleton: isLoading, ready: !isLoading }
}

/* ─── 계약 ─────────────────────────────────────────────────────────────────── */

describe('useSkeletonPhase — Defer + Minimum Hold 타이밍 계약', () => {
  it('fake clock 이 performance.now() 까지 통제한다', () => {
    // 이 전제가 깨지면 아래 minHold 계약이 전부 무의미해지므로 먼저 못 박는다.
    const before = performance.now()
    vi.advanceTimersByTime(250)
    expect(performance.now() - before).toBe(250)
  })

  it('로딩 없이 시작하면 skeleton 없이 곧장 ready 다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      false,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    probe.advance(500)

    expect(firstSkeletonSample(probe.timeline)).toBeUndefined()
    expect(firstReadySample(probe.timeline)?.at).toBe(0)
  })

  it('계약 1 — defer 만료 전에 로딩이 끝나면 skeleton 을 한 번도 띄우지 않는다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      true,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    probe.advance(DEFER_MS - SAMPLE_STEP_MS) // t=90 — defer 만료 직전
    probe.setLoading(false)
    probe.advance(500) // 남은 defer 타이머가 뒤늦게 살아나지 않는지까지 본다

    expect(formatSamples('anti-flash 경로에서 뜬 skeleton', probe.timeline.filter((s) => s.showSkeleton))).toBe('')
    // skeleton 을 건너뛴 경로에는 hold 의무가 없다 — 로딩이 끝난 그 순간 ready 다.
    expect(firstReadySample(probe.timeline)?.at).toBe(DEFER_MS - SAMPLE_STEP_MS)
  })

  it('계약 2 — defer 만료 후에도 로딩 중이면 정확히 deferMs 에 skeleton 이 뜬다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      true,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    probe.advance(500)

    expect(firstSkeletonSample(probe.timeline)?.at).toBe(DEFER_MS)
    // 로딩이 계속되는 동안에는 절대 ready 가 서지 않는다.
    expect(firstReadySample(probe.timeline)).toBeUndefined()
  })

  it('계약 3 — minHold 가 차기 전에 로딩이 끝나도 ready 는 minHold 까지 기다린다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      true,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    probe.advance(200) // skeleton 은 t=100 에 떴고, 아직 hold 중
    probe.setLoading(false) // t=200 — hold 가 100ms 밖에 안 찼다
    probe.advance(400)

    expect(
      formatSamples('minHold 이전에 선 ready', findReadyBeforeMinHold(probe.timeline, MIN_HOLD_MS)),
    ).toBe('')
    // hold 는 **skeleton 등장 시각** 기준이다 — 로딩 종료 시각이 아니다.
    expect(firstReadySample(probe.timeline)?.at).toBe(DEFER_MS + MIN_HOLD_MS)
  })

  it('계약 4 — minHold 가 이미 찬 뒤 로딩이 끝나면 다음 틱에 ready 다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      true,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    const loadingEndedAt = 500 // skeleton t=100 + hold 300 = 400 < 500
    probe.advance(loadingEndedAt)
    probe.setLoading(false)
    probe.advance(100)

    const readyAt = firstReadySample(probe.timeline)?.at
    expect(readyAt).toBeDefined()
    // 같은 렌더에서 서지는 않는다. 훅이 남은 hold 를 0ms `setTimeout` 으로 소진하므로
    // 매크로태스크 한 번을 거친다 — 실브라우저에서는 한 프레임 미만이라 눈에 띄지 않지만,
    // "즉시"가 아니라 "다음 틱"이라는 사실은 여기 적어 둔다.
    expect(readyAt).toBeGreaterThan(loadingEndedAt)
    expect(readyAt! - loadingEndedAt).toBeLessThanOrEqual(SAMPLE_STEP_MS)
  })

  it('계약 5 — 한 번 뜬 skeleton 은 fade-in 동안에도 내려가지 않는다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      true,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    probe.advance(200)
    probe.setLoading(false)
    probe.advance(600) // ready 가 선 뒤로도 한참 더 지켜본다

    // 내려가면 fade-in 할 대상 자체가 사라져 콘텐츠가 툭 튀어나온다.
    expect(formatSamples('fade-in 중 언마운트된 skeleton', findSkeletonDrops(probe.timeline))).toBe('')
    expect(probe.last()).toEqual({ at: 800, showSkeleton: true, ready: true })
  })

  it('계약 6 — 로딩이 다시 시작되면 같은 렌더에서 초기화된다', () => {
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS }),
      true,
      { deferMs: DEFER_MS, minHoldMs: MIN_HOLD_MS },
    )
    probe.advance(200)
    probe.setLoading(false)
    probe.advance(400)
    expect(probe.last().ready).toBe(true)

    probe.setLoading(true)
    // 초기화가 effect 로 밀리면 직전 사이클의 skeleton·ready 가 한 프레임 더 그려진다.
    // 렌더 중 파생이므로 재시작을 알린 그 표본에서 이미 둘 다 내려가 있어야 한다.
    expect(probe.last()).toEqual({ at: 600, showSkeleton: false, ready: false })

    // 그리고 새 사이클은 처음부터 다시 defer 를 센다.
    probe.advance(DEFER_MS - SAMPLE_STEP_MS)
    expect(probe.last().showSkeleton).toBe(false)
    probe.advance(SAMPLE_STEP_MS)
    expect(probe.last().showSkeleton).toBe(true)
  })

  it('deferMs·minHoldMs 옵션이 실제 타이밍을 바꾼다', () => {
    // 기본값(100/300)이 하드코딩돼 옵션이 무시되는 회귀를 잡는다.
    const probe = renderPhaseProbe(
      (isLoading) => useSkeletonPhase(isLoading, { deferMs: 50, minHoldMs: 200 }),
      true,
      { deferMs: 50, minHoldMs: 200 },
    )
    probe.advance(50)
    probe.setLoading(false)
    probe.advance(400)

    expect(firstSkeletonSample(probe.timeline)?.at).toBe(50)
    expect(findReadyBeforeMinHold(probe.timeline, 200)).toEqual([])
    expect(firstReadySample(probe.timeline)?.at).toBe(250)
  })

  it('미검증 항목은 사유와 함께 남아 있다', () => {
    const unmeasured = Object.keys(UNMEASURED_ASPECTS)
    for (const name of unmeasured) {
      expect(UNMEASURED_ASPECTS[name].length).toBeGreaterThan(0)
    }
    // 목록이 비지 않는 한 이 파일의 결과를 "로딩 정책 전부 검증됨"으로 읽으면 안 된다.
    expect(unmeasured.length).toBeGreaterThan(0)
  })
})

/* ─── red 시연 1 — 정책 없는 대조 훅을 같은 탐침에 태운다 ─────────────────── */

describe('red 시연 — 정책이 없으면 술어가 실제로 잡는다', () => {
  it('대조 훅은 defer 없이 즉시 skeleton 을 띄운다 (계약 1·2 위반)', () => {
    const probe = renderPhaseProbe(useNaiveSkeletonPhase, true)
    probe.advance(DEFER_MS - SAMPLE_STEP_MS)
    probe.setLoading(false)
    probe.advance(500)

    // 진짜 훅이라면 undefined 여야 할 자리에서 t=0 이 잡힌다.
    expect(firstSkeletonSample(probe.timeline)?.at).toBe(0)
  })

  it('대조 훅은 hold 없이 ready 를 세운다 (계약 3 위반)', () => {
    const probe = renderPhaseProbe(useNaiveSkeletonPhase, true)
    probe.advance(200)
    probe.setLoading(false)
    probe.advance(400)

    const violations = findReadyBeforeMinHold(probe.timeline, MIN_HOLD_MS)
    expect(violations.length).toBeGreaterThan(0)
    expect(formatSamples('minHold 이전에 선 ready', violations)).toContain('t=200ms')
  })

  it('대조 훅은 로딩이 끝나는 순간 skeleton 을 내린다 (계약 5 위반)', () => {
    const probe = renderPhaseProbe(useNaiveSkeletonPhase, true)
    probe.advance(200)
    probe.setLoading(false)
    probe.advance(100)

    const drops = findSkeletonDrops(probe.timeline)
    expect(drops).toHaveLength(1)
    expect(drops[0].at).toBe(200)
  })
})

/* ─── red 시연 2 — 술어 자체의 단위 검사 ──────────────────────────────────── */

describe('판정 로직', () => {
  const line = (at: number, showSkeleton: boolean, ready: boolean): PhaseSample => ({ at, showSkeleton, ready })

  describe('firstSkeletonSample', () => {
    it('skeleton 이 뜬 첫 표본을 돌려준다', () => {
      expect(firstSkeletonSample([line(0, false, false), line(10, true, false)])?.at).toBe(10)
    })

    it('한 번도 뜨지 않으면 undefined 다', () => {
      expect(firstSkeletonSample([line(0, false, false), line(10, false, true)])).toBeUndefined()
    })
  })

  describe('findSkeletonDrops', () => {
    it('true → false 로 내려간 지점을 잡는다', () => {
      expect(
        findSkeletonDrops([line(0, true, false), line(10, true, false), line(20, false, true)]),
      ).toEqual([line(20, false, true)])
    })

    it('오르기만 하는 타임라인은 통과시킨다', () => {
      expect(findSkeletonDrops([line(0, false, false), line(10, true, false), line(20, true, true)])).toEqual([])
    })
  })

  describe('findReadyBeforeMinHold', () => {
    it('hold 가 차기 전에 선 ready 를 전부 잡는다', () => {
      const timeline = [line(0, false, false), line(100, true, false), line(200, true, true), line(400, true, true)]
      expect(findReadyBeforeMinHold(timeline, 300).map((s) => s.at)).toEqual([200])
    })

    it('hold 경계 시각(등장 + minHold)은 위반이 아니다', () => {
      const timeline = [line(100, true, false), line(400, true, true)]
      expect(findReadyBeforeMinHold(timeline, 300)).toEqual([])
    })

    it('skeleton 이 뜨지 않은 타임라인에는 hold 의무가 없다', () => {
      const timeline = [line(0, false, false), line(50, false, true)]
      expect(findReadyBeforeMinHold(timeline, 300)).toEqual([])
    })

    it('hold 는 로딩 종료가 아니라 skeleton 등장 시각부터 센다', () => {
      // 등장 t=100, 종료 t=200, ready t=350 — 종료 기준이라면 통과지만 등장 기준으로는 위반이다.
      const timeline = [line(100, true, false), line(200, true, false), line(350, true, true)]
      expect(findReadyBeforeMinHold(timeline, 300).map((s) => s.at)).toEqual([350])
    })
  })

  describe('formatSamples', () => {
    it('위반이 없으면 빈 문자열이다', () => {
      expect(formatSamples('제목', [])).toBe('')
    })

    it('위반 표본을 전부 싣는다', () => {
      expect(formatSamples('제목', [line(10, true, true), line(20, true, true)])).toBe(
        '제목 (2건):\n  - t=10ms showSkeleton=true ready=true\n  - t=20ms showSkeleton=true ready=true',
      )
    })
  })

  describe('탐침 가드', () => {
    it('표본 간격의 배수가 아닌 옵션은 거부한다', () => {
      // 어긋난 값은 술어가 hold 창을 실제보다 넓게 잡아 조용히 오탐한다.
      expect(() =>
        renderPhaseProbe((isLoading) => useSkeletonPhase(isLoading, { deferMs: 105 }), true, { deferMs: 105 }),
      ).toThrow(/배수/)
    })
  })
})
