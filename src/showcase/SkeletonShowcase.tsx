import { useState, useEffect, useCallback } from 'react'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle } from '@/showcase/shared'
import { SkeletonBlock, TextReservation } from '@/components/Skeleton'

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const SKELETON_TOC: TocEntry[] = [
  { id: 'skeleton-real-world', label: 'Real-World Examples' },
  { id: 'skeleton-profile-card', label: 'Profile Card', level: 2 },
  { id: 'skeleton-mobile-feed', label: 'Mobile Feed', level: 2 },
  { id: 'skeleton-list-row', label: 'List Row', level: 2 },
  { id: 'skeleton-text-reservation', label: 'TextReservation' },
  { id: 'skeleton-block-shapes', label: 'Block Shapes' },
  { id: 'skeleton-block-sizes', label: 'Block Sizes' },
]

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function useDelayedFlag(delayMs: number, trigger: number) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    const timer = setTimeout(() => setReady(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs, trigger])

  return ready
}

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SkeletonShowcase() {
  const [trigger, setTrigger] = useState(0)
  const replay = useCallback(() => setTrigger((t) => t + 1), [])

  /* ─── Ready flags ─── */
  const profileReady = useDelayedFlag(2000, trigger)
  const feedReady = useDelayedFlag(2500, trigger)
  const listReady = useDelayedFlag(1800, trigger)
  const trReady = useDelayedFlag(2500, trigger)

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-900">Skeleton</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600 mt-2">
          콘텐츠 로딩 중 공간을 확보하는 placeholder UI. SkeletonBlock(비텍스트)과 TextReservation(텍스트)으로 구성.
        </p>
      </div>

      {/* ─── Section: Real-World Examples ─── */}
      <section id="skeleton-real-world">
        <SectionTitle>Real-World Examples</SectionTitle>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-4">
          SkeletonBlock과 TextReservation을 조합한 실제 UI 패턴. 텍스트는 즉시 전달되어 pretext가 정확한 치수를 측정하고, ready 플래그로 콘텐츠 표시 시점을 제어합니다.
        </p>

        <button
          onClick={replay}
          className="mb-8 px-4 py-2 typography-14-semibold rounded-[var(--primitive-radius-2)] bg-semantic-neutral-solid-950 text-semantic-neutral-solid-0 cursor-pointer"
        >
          Replay
        </button>

        {/* ── Profile Card ── */}
        <div id="skeleton-profile-card" className="mb-12">
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-4">Profile Card</h3>
          <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 p-6 max-w-[360px]">
            <div className="flex items-center gap-4 mb-4">
              {profileReady ? (
                <div className="w-14 h-14 rounded-full bg-semantic-emphasized-purple-100 flex items-center justify-center typography-20-bold text-semantic-emphasized-purple-600 flex-shrink-0">
                  JS
                </div>
              ) : (
                <SkeletonBlock width={56} height={56} shape="circular" />
              )}
              <div className="flex-1 min-w-0">
                <TextReservation
                  key={`pn-${trigger}`}
                  text="Juhwan Son"
                  typography="16-semibold"
                  ready={profileReady}
                >
                  {(text) => (
                    <p className="typography-16-semibold text-semantic-text-on-bright-900">{text}</p>
                  )}
                </TextReservation>
                <TextReservation
                  key={`pr-${trigger}`}
                  text="Product Designer & Developer"
                  typography="13-regular"
                  ready={profileReady}
                >
                  {(text) => (
                    <p className="typography-13-regular text-semantic-text-on-bright-500 mt-1">{text}</p>
                  )}
                </TextReservation>
              </div>
            </div>
            <TextReservation
              key={`pb-${trigger}`}
              text="디자인 시스템과 인터랙션 디자인에 관심이 많습니다. Figma에서 시작해 코드로 마무리하는 워크플로를 즐깁니다."
              typography="14-regular"
              ready={profileReady}
            >
              {(text) => (
                <p className="typography-14-regular text-semantic-text-on-bright-600">{text}</p>
              )}
            </TextReservation>
          </div>
        </div>

        {/* ── Mobile Feed ── */}
        <div id="skeleton-mobile-feed" className="mb-12">
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-4">Mobile Feed</h3>
          <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 max-w-[380px] overflow-hidden">
            {feedReady ? (
              <div className="w-full h-[220px] bg-semantic-neutral-solid-70 flex items-center justify-center">
                <span className="typography-14-medium text-semantic-text-on-bright-400">Image</span>
              </div>
            ) : (
              <SkeletonBlock width="100%" height={220} shape="small" />
            )}

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {feedReady ? (
                  <div className="w-8 h-8 rounded-full bg-semantic-emphasized-purple-100 flex items-center justify-center typography-12-bold text-semantic-emphasized-purple-600 flex-shrink-0">
                    K
                  </div>
                ) : (
                  <SkeletonBlock width={32} height={32} shape="circular" />
                )}
                <TextReservation
                  key={`fa-${trigger}`}
                  text="kiio.design"
                  typography="14-semibold"
                  ready={feedReady}
                >
                  {(text) => (
                    <span className="typography-14-semibold text-semantic-text-on-bright-800">{text}</span>
                  )}
                </TextReservation>
              </div>
              <TextReservation
                key={`fb-${trigger}`}
                text="Skeleton은 단순한 회색 박스가 아닙니다. 최종 콘텐츠가 차지할 공간을 미리 확보하는 space reservation 시스템입니다. layout shift를 0에 수렴시키는 것이 목표입니다."
                typography="14-regular"
                ready={feedReady}
              >
                {(text) => (
                  <p className="typography-14-regular text-semantic-text-on-bright-600">{text}</p>
                )}
              </TextReservation>
            </div>
          </div>
        </div>

        {/* ── Web List Row ── */}
        <div id="skeleton-list-row">
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-4">List Row</h3>
          <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 divide-y divide-semantic-divider-solid-100 max-w-[640px]">
            {[
              { title: 'TextReservation 컴포넌트 구현', desc: 'pretext 엔진 기반 3단계 텍스트 공간 예약', date: '3월 31일' },
              { title: 'SkeletonBlock shape 토큰 정의', desc: 'small / medium / large / circular 4종 radius', date: '3월 30일' },
              { title: 'Shimmer 애니메이션 튜닝', desc: '대각선 gradient + white-alpha 토큰 연결', date: '3월 29일' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                {listReady ? (
                  <div className="w-10 h-10 rounded-[var(--comp-skeleton-radius-medium)] bg-semantic-neutral-solid-70 flex items-center justify-center flex-shrink-0">
                    <span className="typography-12-medium text-semantic-text-on-bright-400">{i + 1}</span>
                  </div>
                ) : (
                  <SkeletonBlock width={40} height={40} shape="medium" />
                )}

                <div className="flex-1 min-w-0">
                  <TextReservation
                    key={`lt-${i}-${trigger}`}
                    text={item.title}
                    typography="14-semibold"
                    ready={listReady}
                  >
                    {(text) => (
                      <p className="typography-14-semibold text-semantic-text-on-bright-800">{text}</p>
                    )}
                  </TextReservation>
                  <TextReservation
                    key={`ld-${i}-${trigger}`}
                    text={item.desc}
                    typography="13-regular"
                    ready={listReady}
                  >
                    {(text) => (
                      <p className="typography-13-regular text-semantic-text-on-bright-500 mt-0.5">{text}</p>
                    )}
                  </TextReservation>
                </div>

                <div className="flex-shrink-0 w-16 text-right">
                  <TextReservation
                    key={`ldt-${i}-${trigger}`}
                    text={item.date}
                    typography="12-regular"
                    ready={listReady}
                  >
                    {(text) => (
                      <span className="typography-12-regular text-semantic-text-on-bright-400">{text}</span>
                    )}
                  </TextReservation>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section: TextReservation ─── */}
      <section id="skeleton-text-reservation">
        <SectionTitle>TextReservation</SectionTitle>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-4">
          pretext 엔진 기반 텍스트 공간 예약. typography 토큰 키 하나로 font + lineHeight를 자동 파생하여 layout shift를 방지합니다.
        </p>

        <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 p-6 flex flex-col gap-5 max-w-[560px]">
          <TextReservation
            key={`trt-${trigger}`}
            text="Space Reservation System"
            typography="22-semibold"
            ready={trReady}
          >
            {(text) => (
              <h3 className="typography-22-semibold text-semantic-text-on-bright-900">{text}</h3>
            )}
          </TextReservation>

          <TextReservation
            key={`trb-${trigger}`}
            text="Skeleton은 최종 콘텐츠가 차지할 공간을 미리 확보하는 space reservation입니다. 텍스트가 도착하면 pretext 엔진이 정확한 치수를 계산하여 layout shift 없이 콘텐츠를 표시합니다."
            typography="15-regular"
            ready={trReady}
          >
            {(text) => (
              <p className="typography-15-regular text-semantic-text-on-bright-600">{text}</p>
            )}
          </TextReservation>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <span className="typography-12-medium text-semantic-text-on-bright-400">
            ready: {trReady ? 'true (콘텐츠 표시)' : 'false (skeleton 유지, pretext 측정 완료)'}
          </span>
        </div>
      </section>

      {/* ─── Section: Block Shapes ─── */}
      <section id="skeleton-block-shapes">
        <SectionTitle>Block Shapes</SectionTitle>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-6">
          4가지 shape variant로 다양한 콘텐츠 유형의 placeholder를 표현합니다.
        </p>

        <div className="grid grid-cols-4 gap-6">
          {(['small', 'medium', 'large', 'circular'] as const).map((shape) => (
            <div key={shape} className="flex flex-col items-center gap-3">
              <SkeletonBlock
                shape={shape}
                width={shape === 'circular' ? 64 : '100%'}
                height={shape === 'circular' ? 64 : 48}
              />
              <span className="typography-12-medium text-semantic-text-on-bright-400">
                {shape}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section: Block Sizes ─── */}
      <section id="skeleton-block-sizes">
        <SectionTitle>Block Sizes</SectionTitle>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-6">
          width/height를 숫자(px) 또는 문자열(%, auto 등)로 지정합니다.
        </p>

        <div className="flex flex-col gap-3">
          <SkeletonBlock width="100%" height={12} shape="small" />
          <SkeletonBlock width="80%" height={12} shape="small" />
          <SkeletonBlock width="55%" height={12} shape="small" />
        </div>

        <div className="flex items-end gap-4 mt-8">
          <SkeletonBlock width={40} height={40} shape="medium" />
          <SkeletonBlock width={80} height={80} shape="medium" />
          <SkeletonBlock width={120} height={120} shape="medium" />
          <SkeletonBlock width={160} height={90} shape="medium" />
        </div>
      </section>
    </div>
  )
}
