import { useState, useEffect, useCallback } from 'react'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle } from '@/showcase/shared'
import { SkeletonBlock, TextReservation } from '@/components/Skeleton'
import { useSkeletonPhase } from '@/lib/useSkeletonPhase'

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const SKELETON_TOC: TocEntry[] = [
  { id: 'skeleton-real-world', label: 'Real-World Examples' },
  { id: 'skeleton-profile-card', label: 'Profile Card (80ms)', level: 2 },
  { id: 'skeleton-mobile-feed', label: 'Mobile Feed (200ms)', level: 2 },
  { id: 'skeleton-list-row', label: 'List Row (1500ms)', level: 2 },
  { id: 'skeleton-text-reservation', label: 'TextReservation' },
  { id: 'skeleton-block-shapes', label: 'Block Shapes' },
  { id: 'skeleton-block-sizes', label: 'Block Sizes' },
]

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/** 외부 fetch를 시뮬레이션. trigger 변경 시 재실행. */
function useSimulatedFetch<T>(value: T, latencyMs: number, trigger: number) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setData(null)
    setIsLoading(true)
    const t = setTimeout(() => {
      setData(value)
      setIsLoading(false)
    }, latencyMs)
    return () => clearTimeout(t)
  }, [latencyMs, trigger, value])

  return { data, isLoading }
}

/* ─── Data ────────────────────────────────────────────────────────────────── */

const profileData = {
  initials: 'JS',
  name: 'Juhwan Son',
  role: 'Product Designer & Developer',
  bio: '디자인 시스템과 인터랙션 디자인에 관심이 많습니다. Figma에서 시작해 코드로 마무리하는 워크플로를 즐깁니다.',
}

const feedData = {
  author: 'kiio.design',
  body: 'Skeleton은 단순한 회색 박스가 아닙니다. 최종 콘텐츠가 차지할 공간을 미리 확보하는 space reservation 시스템입니다. layout shift를 0에 수렴시키는 것이 목표입니다.',
}

const listItems = [
  { title: 'TextReservation 컴포넌트 구현', desc: 'pretext 엔진 기반 3단계 텍스트 공간 예약', date: '3월 31일' },
  { title: 'SkeletonBlock shape 토큰 정의', desc: 'small / medium / large / circular 4종 radius', date: '3월 30일' },
  { title: 'Shimmer 애니메이션 튜닝', desc: '대각선 gradient + white-alpha 토큰 연결', date: '3월 29일' },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SkeletonShowcase() {
  const [trigger, setTrigger] = useState(0)
  const replay = useCallback(() => setTrigger((t) => t + 1), [])

  /* ─── Three latency scenarios — each demonstrates a different policy branch ─── */

  // 80ms → defer (100ms) 안에 끝남 → skeleton 등장 안 함 (anti-flash 작동)
  const profileFetch = useSimulatedFetch(profileData, 80, trigger)
  const profilePhase = useSkeletonPhase(profileFetch.isLoading)

  // 200ms → 100ms에 skeleton 등장, 200ms에 데이터 도착, minHold(300ms)까지 hold → 400ms에 fade
  const feedFetch = useSimulatedFetch(feedData, 200, trigger)
  const feedPhase = useSkeletonPhase(feedFetch.isLoading)

  // 1500ms → 100ms에 skeleton 등장, 1500ms까지 길게 유지 → 도착 즉시 fade
  const listFetch = useSimulatedFetch(listItems, 1500, trigger)
  const listPhase = useSkeletonPhase(listFetch.isLoading)

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
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-2">
          세 섹션이 서로 다른 응답 시간(80ms / 200ms / 1500ms)을 시뮬레이션합니다.
        </p>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-4">
          <strong>Defer 100ms + Minimum Hold 300ms</strong> 정책: 빠른 응답은 skeleton 없이, 보통 응답은 깔끔한 hold window와 함께, 느린 응답은 자연스러운 fade-in으로 처리됩니다. <code>useSkeletonPhase</code> 훅 + <code>TextReservation</code> 조합으로 layout shift 0을 보장합니다.
        </p>

        <button
          onClick={replay}
          className="mb-8 px-4 py-2 typography-14-semibold rounded-[var(--primitive-radius-2)] bg-semantic-neutral-solid-950 text-semantic-neutral-solid-0 cursor-pointer"
        >
          Replay
        </button>

        {/* ── Profile Card (80ms — defer 작동, skeleton 등장 안 함) ── */}
        <div id="skeleton-profile-card" className="mb-12">
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-1">Profile Card</h3>
          <p className="typography-12-regular text-semantic-text-on-bright-400 mb-4">
            latency 80ms — defer 100ms 안에 데이터 도착 → skeleton 없이 곧장 콘텐츠 (anti-flash)
          </p>
          <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 p-6 max-w-[360px]">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              {!profilePhase.showSkeleton && profileFetch.data ? (
                <div className="w-14 h-14 rounded-full bg-semantic-emphasized-purple-100 flex items-center justify-center typography-20-bold text-semantic-emphasized-purple-600 flex-shrink-0">
                  {profileFetch.data.initials}
                </div>
              ) : (
                <SkeletonBlock width={56} height={56} shape="circular" />
              )}

              <div className="flex-1 min-w-0">
                {/* Name */}
                {!profilePhase.showSkeleton && profileFetch.data ? (
                  <p className="typography-16-semibold text-semantic-text-on-bright-900">{profileFetch.data.name}</p>
                ) : (
                  <TextReservation
                    key={`pn-${trigger}`}
                    text={profileFetch.data?.name ?? null}
                    typography="16-semibold"
                    ready={profilePhase.ready}
                  >
                    {(text) => (
                      <p className="typography-16-semibold text-semantic-text-on-bright-900">{text}</p>
                    )}
                  </TextReservation>
                )}

                {/* Role */}
                {!profilePhase.showSkeleton && profileFetch.data ? (
                  <p className="typography-13-regular text-semantic-text-on-bright-500 mt-1">{profileFetch.data.role}</p>
                ) : (
                  <TextReservation
                    key={`pr-${trigger}`}
                    text={profileFetch.data?.role ?? null}
                    typography="13-regular"
                    ready={profilePhase.ready}
                  >
                    {(text) => (
                      <p className="typography-13-regular text-semantic-text-on-bright-500 mt-1">{text}</p>
                    )}
                  </TextReservation>
                )}
              </div>
            </div>

            {/* Bio */}
            {!profilePhase.showSkeleton && profileFetch.data ? (
              <p className="typography-14-regular text-semantic-text-on-bright-600">{profileFetch.data.bio}</p>
            ) : (
              <TextReservation
                key={`pb-${trigger}`}
                text={profileFetch.data?.bio ?? null}
                typography="14-regular"
                ready={profilePhase.ready}
              >
                {(text) => (
                  <p className="typography-14-regular text-semantic-text-on-bright-600">{text}</p>
                )}
              </TextReservation>
            )}
          </div>
        </div>

        {/* ── Mobile Feed (200ms — minHold 작동, hold window 시각적으로 보임) ── */}
        <div id="skeleton-mobile-feed" className="mb-12">
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-1">Mobile Feed</h3>
          <p className="typography-12-regular text-semantic-text-on-bright-400 mb-4">
            latency 200ms — 100ms에 skeleton 등장, 200ms에 도착해도 minHold 300ms까지 hold → 400ms에 fade-in
          </p>
          <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 max-w-[380px] overflow-hidden">
            {/* Image */}
            {!feedPhase.showSkeleton && feedFetch.data ? (
              <div className="w-full h-[220px] bg-semantic-neutral-solid-70 flex items-center justify-center">
                <span className="typography-14-medium text-semantic-text-on-bright-400">Image</span>
              </div>
            ) : (
              <SkeletonBlock width="100%" height={220} shape="small" />
            )}

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {!feedPhase.showSkeleton && feedFetch.data ? (
                  <div className="w-8 h-8 rounded-full bg-semantic-emphasized-purple-100 flex items-center justify-center typography-12-bold text-semantic-emphasized-purple-600 flex-shrink-0">
                    K
                  </div>
                ) : (
                  <SkeletonBlock width={32} height={32} shape="circular" />
                )}

                {/* Author */}
                {!feedPhase.showSkeleton && feedFetch.data ? (
                  <span className="typography-14-semibold text-semantic-text-on-bright-800">{feedFetch.data.author}</span>
                ) : (
                  <TextReservation
                    key={`fa-${trigger}`}
                    text={feedFetch.data?.author ?? null}
                    typography="14-semibold"
                    ready={feedPhase.ready}
                  >
                    {(text) => (
                      <span className="typography-14-semibold text-semantic-text-on-bright-800">{text}</span>
                    )}
                  </TextReservation>
                )}
              </div>

              {/* Body */}
              {!feedPhase.showSkeleton && feedFetch.data ? (
                <p className="typography-14-regular text-semantic-text-on-bright-600">{feedFetch.data.body}</p>
              ) : (
                <TextReservation
                  key={`fb-${trigger}`}
                  text={feedFetch.data?.body ?? null}
                  typography="14-regular"
                  ready={feedPhase.ready}
                >
                  {(text) => (
                    <p className="typography-14-regular text-semantic-text-on-bright-600">{text}</p>
                  )}
                </TextReservation>
              )}
            </div>
          </div>
        </div>

        {/* ── List Row (1500ms — 자연 진행, 길게 hold 후 fade) ── */}
        <div id="skeleton-list-row">
          <h3 className="typography-14-semibold text-semantic-text-on-bright-600 mb-1">List Row</h3>
          <p className="typography-12-regular text-semantic-text-on-bright-400 mb-4">
            latency 1500ms — 100ms에 skeleton 등장, 1500ms 시점까지 자연스럽게 유지 → 도착 즉시 fade-in
          </p>
          <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 divide-y divide-semantic-divider-solid-100 max-w-[640px]">
            {listItems.map((_, i) => {
              const item = listFetch.data?.[i]

              return (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  {/* Index badge */}
                  {!listPhase.showSkeleton && item ? (
                    <div className="w-10 h-10 rounded-[var(--comp-skeleton-radius-medium)] bg-semantic-neutral-solid-70 flex items-center justify-center flex-shrink-0">
                      <span className="typography-12-medium text-semantic-text-on-bright-400">{i + 1}</span>
                    </div>
                  ) : (
                    <SkeletonBlock width={40} height={40} shape="medium" />
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    {!listPhase.showSkeleton && item ? (
                      <p className="typography-14-semibold text-semantic-text-on-bright-800">{item.title}</p>
                    ) : (
                      <TextReservation
                        key={`lt-${i}-${trigger}`}
                        text={item?.title ?? null}
                        typography="14-semibold"
                        ready={listPhase.ready}
                      >
                        {(text) => (
                          <p className="typography-14-semibold text-semantic-text-on-bright-800">{text}</p>
                        )}
                      </TextReservation>
                    )}

                    {/* Desc */}
                    {!listPhase.showSkeleton && item ? (
                      <p className="typography-13-regular text-semantic-text-on-bright-500 mt-0.5">{item.desc}</p>
                    ) : (
                      <TextReservation
                        key={`ld-${i}-${trigger}`}
                        text={item?.desc ?? null}
                        typography="13-regular"
                        ready={listPhase.ready}
                      >
                        {(text) => (
                          <p className="typography-13-regular text-semantic-text-on-bright-500 mt-0.5">{text}</p>
                        )}
                      </TextReservation>
                    )}
                  </div>

                  <div className="flex-shrink-0 w-16 text-right">
                    {/* Date */}
                    {!listPhase.showSkeleton && item ? (
                      <span className="typography-12-regular text-semantic-text-on-bright-400">{item.date}</span>
                    ) : (
                      <TextReservation
                        key={`ldt-${i}-${trigger}`}
                        text={item?.date ?? null}
                        typography="12-regular"
                        ready={listPhase.ready}
                      >
                        {(text) => (
                          <span className="typography-12-regular text-semantic-text-on-bright-400">{text}</span>
                        )}
                      </TextReservation>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {/* Diagnostic readout for the list scenario */}
          <div className="mt-3 typography-12-regular text-semantic-text-on-bright-400">
            phase — showSkeleton: <code>{String(listPhase.showSkeleton)}</code>, ready: <code>{String(listPhase.ready)}</code>, isLoading: <code>{String(listFetch.isLoading)}</code>
          </div>
        </div>
      </section>

      {/* ─── Section: TextReservation ─── */}
      <section id="skeleton-text-reservation">
        <SectionTitle>TextReservation</SectionTitle>
        <p className="typography-14-regular text-semantic-text-on-bright-500 mb-4">
          pretext 엔진 기반 텍스트 공간 예약. typography 토큰 키 하나로 font + lineHeight를 자동 파생하여 hold window 동안 정확한 라인 폭을 측정합니다. fade-in 시 layout shift 0.
        </p>

        <div className="rounded-[var(--primitive-radius-3)] border border-semantic-divider-solid-100 p-6 flex flex-col gap-5 max-w-[560px]">
          {/* 이 섹션은 List Row와 동일한 1500ms 시나리오를 재사용해 reservation phase를 시각화 */}
          <TextReservation
            key={`trt-${trigger}`}
            text={listFetch.isLoading ? null : 'Space Reservation System'}
            typography="22-semibold"
            ready={listPhase.ready}
          >
            {(text) => (
              <h3 className="typography-22-semibold text-semantic-text-on-bright-900">{text}</h3>
            )}
          </TextReservation>

          <TextReservation
            key={`trb-${trigger}`}
            text={listFetch.isLoading ? null : 'Skeleton은 최종 콘텐츠가 차지할 공간을 미리 확보하는 space reservation입니다. 텍스트가 도착하면 pretext 엔진이 정확한 치수를 계산하여 layout shift 없이 콘텐츠를 표시합니다.'}
            typography="15-regular"
            ready={listPhase.ready}
          >
            {(text) => (
              <p className="typography-15-regular text-semantic-text-on-bright-600">{text}</p>
            )}
          </TextReservation>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <span className="typography-12-medium text-semantic-text-on-bright-400">
            phase — {listFetch.isLoading
              ? 'estimation (text=null, fallback skeleton)'
              : listPhase.ready
                ? 'content (fade-in 완료)'
                : 'reservation (text 도착, pretext 측정 중, hold)'}
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
