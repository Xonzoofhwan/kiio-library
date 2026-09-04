import { useCallback, useSyncExternalStore, type RefObject } from 'react'

/** SSR에는 DOM이 없다. 훅 밖 상수로 두어 매 렌더 새 참조가 생기지 않게 한다. */
function getServerSnapshot(): string | undefined {
  return undefined
}

/**
 * 기준 요소의 조상에 걸린 `data-theme` 값을 읽어 반환한다.
 *
 * Tooltip·Callout 콘텐츠는 Radix 포털로 `document.body` 밑에 렌더되므로
 * 트리거 조상의 `data-theme`을 CSS 상속으로 받지 못한다. DOM을 직접 읽어
 * 포털 콘텐츠에 테마를 다시 붙이기 위한 훅이다.
 *
 * DOM은 React 밖의 외부 저장소이므로 effect + setState 대신
 * `useSyncExternalStore`로 구독한다. 이 방식이라야
 * (1) 구독 직후 React가 스냅샷을 다시 읽으므로 "마운트 뒤에 ref가 채워지는"
 *     타이밍이 자동으로 반영되고,
 * (2) MutationObserver 덕에 런타임 테마 토글도 별도 렌더 없이 따라온다.
 *
 * @param ref — 테마를 상속받아야 할 기준 요소(트리거/앵커)의 ref.
 * @returns 조상의 `data-theme` 값. 테마 조상이 없으면 `undefined`.
 */
export function useAncestorTheme(ref: RefObject<HTMLElement | null>): string | undefined {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const themed = ref.current?.closest('[data-theme]')
      // 테마 조상이 없으면 감시할 대상도 없다. 값은 계속 undefined로 남는다.
      if (!themed) return () => {}

      const observer = new MutationObserver(onStoreChange)
      observer.observe(themed, { attributes: true, attributeFilter: ['data-theme'] })
      return () => observer.disconnect()
    },
    [ref],
  )

  // 스냅샷이 원시값(string | undefined)이라 호출마다 새 참조가 생기지 않는다.
  // React의 동일성 비교가 그대로 성립하므로 별도 캐시가 필요 없다.
  const getSnapshot = useCallback(
    () => ref.current?.closest('[data-theme]')?.getAttribute('data-theme') ?? undefined,
    [ref],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
