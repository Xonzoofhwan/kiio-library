/**
 * 포털 테마 계약 — Tooltip · Callout.
 *
 * 두 컴포넌트의 콘텐츠는 Radix 포털로 `document.body` 밑에 렌더되므로 트리거 조상의
 * `data-theme` 을 CSS 상속으로 받지 못한다. 그래서 트리거 요소의 ref 로 조상을 DOM 에서
 * 읽어 포털 래퍼에 다시 붙인다(`useAncestorTheme`). 그 "다시 읽기"가 **트리거 ref 가
 * 채워지는 것**에 의존한다.
 *
 * 2026-09-13 검토: 소비자가 callback ref 를 주면 `ref ?? internalRef` 가 소비자 것만 쓰고
 * 내부 ref 를 비워, 포털이 테마를 잃었다(`data-theme` 이 `undefined`). 객체 ref 에서만 동작했다.
 *
 * ## 보장하는 것
 * 소비자 ref 의 형태(없음 · 객체 · 함수)와 무관하게 포털 래퍼의 `data-theme` 이 조상과 같고,
 * 열린 채 조상 테마가 바뀌면 포털도 따라온다.
 *
 * ## 보장하지 않는 것
 * 테마가 붙은 뒤의 **색**. 토큰이 실제로 어떤 값이 되는지는 `tokenContract`·쇼케이스의 몫이다.
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 밖으로 export 하지 않는다.)
 */
import { createRef, type ReactElement, type Ref } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/Button'
import { Tooltip } from '@/components/Tooltip'
import { Callout } from '@/components/Callout'

interface PortalCase {
  name: string
  /** 포털 콘텐츠의 role. 이것으로 콘텐츠를 찾아 가장 가까운 `[data-theme]` 을 읽는다. */
  role: string
  renderOpen: (ref?: Ref<HTMLButtonElement>) => ReactElement
}

const CASES: PortalCase[] = [
  {
    name: 'Tooltip',
    role: 'tooltip',
    renderOpen: (ref) => (
      <div data-theme="dark" data-testid="theme-root">
        <Tooltip.Provider delayDuration={0}>
          <Tooltip defaultOpen>
            <Tooltip.Trigger ref={ref}>
              <Button>도움말</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>설명 문구</Tooltip.Content>
          </Tooltip>
        </Tooltip.Provider>
      </div>
    ),
  },
  {
    name: 'Callout',
    role: 'dialog',
    renderOpen: (ref) => (
      <div data-theme="dark" data-testid="theme-root">
        <Callout defaultOpen>
          <Callout.Anchor ref={ref}>
            <Button>안내 열기</Button>
          </Callout.Anchor>
          <Callout.Content>
            <Callout.Text>본문</Callout.Text>
          </Callout.Content>
        </Callout>
      </div>
    ),
  },
]

/** 포털 콘텐츠에서 가장 가까운 `[data-theme]` 의 값. 래퍼가 테마를 못 받았으면 속성이 없어 `null` 이다. */
function portalTheme(role: string): string | null {
  const content = document.querySelector(`[role="${role}"]`)
  if (!content) throw new Error(`[role="${role}"] 이 DOM 에 없다 — 열리지 않은 상태를 보고 있다`)
  return content.closest('[data-theme]')?.getAttribute('data-theme') ?? null
}

describe.each(CASES)('$name — 포털 테마', ({ role, renderOpen }) => {
  it('ref 없이도 포털이 조상 테마를 받는다', async () => {
    render(renderOpen())
    await screen.findByRole(role)
    expect(portalTheme(role)).toBe('dark')
  })

  it('객체 ref 로도 받는다', async () => {
    const ref = createRef<HTMLButtonElement>()
    render(renderOpen(ref))
    await screen.findByRole(role)
    expect(ref.current?.tagName).toBe('BUTTON')
    expect(portalTheme(role)).toBe('dark')
  })

  it('callback ref 로도 받는다 — 2026-09-13 이전에는 여기서 테마가 끊겼다', async () => {
    let received: HTMLElement | null = null
    render(
      renderOpen((el) => {
        received = el
      }),
    )
    await screen.findByRole(role)
    // 소비자 ref 와 내부 ref 가 **둘 다** 채워져야 한다. 하나만 채우면 한쪽이 깨진다.
    expect(received).not.toBeNull()
    expect(portalTheme(role)).toBe('dark')
  })

  it('열린 채 조상 테마가 바뀌면 포털이 따라온다', async () => {
    render(renderOpen())
    await screen.findByRole(role)
    expect(portalTheme(role)).toBe('dark')

    // useAncestorTheme 은 MutationObserver 로 조상을 구독한다. 속성 변경 → 마이크로태스크로
    // 알림 → 재렌더. act 안에서 한 틱 양보해 그 경로를 태운다.
    await act(async () => {
      screen.getByTestId('theme-root').setAttribute('data-theme', 'light')
      await Promise.resolve()
    })
    await waitFor(() => expect(portalTheme(role)).toBe('light'))
  })
})

describe('판정기 자기 검사', () => {
  it('테마 래퍼가 없는 포털은 null 로 읽힌다 — 속성이 없다는 사실이 실패로 드러나야 한다', () => {
    const portal = document.createElement('div')
    portal.innerHTML = '<div role="tooltip">x</div>'
    document.body.appendChild(portal)
    try {
      expect(portalTheme('tooltip')).toBeNull()
    } finally {
      portal.remove()
    }
  })

  it('닫힌 상태를 보면 던진다 — 빈 DOM 은 언제나 통과하기 때문이다', () => {
    expect(() => portalTheme('dialog')).toThrow()
  })
})
