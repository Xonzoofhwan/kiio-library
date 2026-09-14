/**
 * 여러 ref 를 하나의 callback ref 로 합친다.
 *
 * 쓰는 곳: 소비자 ref(객체든 함수든)와 내부 ref 를 **둘 다** 채워야 하는 래퍼 —
 * `Tooltip.Trigger` · `Callout.Anchor` 가 트리거 요소를 컨텍스트 ref 에도 넣어 포털
 * 콘텐츠가 조상의 `data-theme` 을 읽게 한다. `ref ?? internalRef` 처럼 둘 중 하나만 고르면
 * 소비자가 callback ref 를 준 순간 내부 ref 가 비어 테마가 끊긴다(2026-09-13 실측).
 *
 * React 19 의 callback ref 는 cleanup 함수를 돌려줄 수 있다. 하나라도 돌려주면 우리도
 * cleanup 을 돌려주고, 그 안에서 cleanup 이 없는 ref 는 `null` 로 되돌린다 — 그러지 않으면
 * React 가 우리 cleanup 만 부르고 `ref(null)` 은 부르지 않아, 그 ref 들이 떨어진 노드를 계속
 * 가리킨다. (Radix `@radix-ui/react-compose-refs` 와 같은 처리. 직접 의존하지 않는 이유는
 * 그 패키지가 우리 의존성 트리에서 transitive 라 버전을 우리가 고정할 수 없기 때문이다.)
 */
import { useCallback, type Ref, type RefCallback } from 'react'

type PossibleRef<T> = Ref<T> | undefined

/** ref 하나에 값을 넣는다. callback ref 가 cleanup 을 돌려주면 그대로 넘긴다. */
function setRef<T>(ref: PossibleRef<T>, value: T | null): ReturnType<RefCallback<T>> | void {
  if (typeof ref === 'function') return ref(value)
  if (ref != null) (ref as { current: T | null }).current = value
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node) => {
    let hasCleanup = false
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node)
      if (typeof cleanup === 'function') hasCleanup = true
      return cleanup
    })
    if (!hasCleanup) return
    return () => {
      cleanups.forEach((cleanup, index) => {
        if (typeof cleanup === 'function') cleanup()
        else setRef(refs[index], null)
      })
    }
  }
}

/**
 * `composeRefs` 의 훅 버전. 원소가 같으면 같은 콜백을 돌려줘 Radix 가 렌더마다 ref 를
 * 떼고 다시 붙이지 않게 한다.
 */
export function useComposedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  // refs 배열은 호출마다 새로 만들어지지만 의존성은 그 **원소**다 — 원소가 같으면 콜백도 같아야 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(composeRefs(...refs), refs)
}
