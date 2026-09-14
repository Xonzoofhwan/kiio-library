/**
 * 버튼 계열의 inert 표면 — `disabled` · `loading` 이 루트 요소에 만드는 속성과 가드.
 *
 * Button · ButtonEmphasized · ButtonError · IconButton · IconButtonEmphasized · IconButtonError ·
 * TextButton · ChipUniversal 이 같은 규칙을 쓴다. 2026-09-13 전에는 이 로직이 파일마다 복제돼
 * 있었고, 그 복제본 전부가 같은 결함 세 가지(가드 순서 · 소비자 tabIndex 덮어쓰기 · 로딩 시
 * 접근 가능한 이름)를 갖고 있었다(`docs/STABILIZATION_PLAN.md` §1). 규칙을 한 곳에 두는 이유는
 * "7종이 같은 패턴을 쓴다"를 주석이 아니라 사실로 만들기 위해서다.
 * 7종 공통 계약은 `src/testing/buttonFamilyContract.test.tsx` 가 전부 렌더해 잠근다.
 *
 * ## 규칙
 * - `loading` 은 **네이티브 `disabled` 를 켜지 않는다.** 켜면 눌러 놓은 버튼이 로딩에 들어가는
 *   순간 포커스가 `<body>` 로 떨어지고 스크린리더는 `aria-busy` 를 읽을 대상을 잃는다.
 *   대신 `aria-disabled` + `aria-busy` 를 세우고 활성화를 가드로 막는다.
 * - 가드는 **캡처 단계**(`onClickCapture`)에 있다. `aria-disabled` 는 시맨틱일 뿐 활성화를
 *   막지 못하고 `pointer-events-none` 은 CSS 라 키보드 Enter/Space 에 무력하다. 브라우저가
 *   Enter/Space 를 `click` 으로 바꿔 주므로 click 하나를 막으면 포인터와 키보드가 함께 덮인다.
 *   **bubble 단계(`onClick`)로는 부족하다** — Radix Slot 은 같은 이름의 핸들러를 자식 → Slot
 *   순서로 합성하므로 `asChild` 자식의 `onClick` 이 우리 가드보다 먼저 돈다. React 는 같은
 *   요소에서도 캡처 리스너를 bubble 리스너보다 먼저 돌리고, 캡처에서 `stopPropagation` 하면
 *   bubble 단계 자체가 열리지 않는다. 그래서 캡처 가드 하나가 자식 · 소비자 · 조상의 `onClick`
 *   을 전부 막고, `preventDefault` 가 기본 동작(링크 이동 · 폼 제출)을 막는다.
 * - 네이티브 `disabled` 는 `<button>` 에만 유효하다. `asChild` 는 소비자가 어떤 요소를 줄지
 *   모르므로(`<a>`·`<div>` 면 무의미한 속성이 붙는다) 대신 `tabIndex=-1` 로 tab 순서에서 뺀다.
 *   그 경우가 아니면 **소비자의 `tabIndex` 를 그대로 통과**시킨다 — 복합 위젯(roving tabindex)이
 *   포커스 순서를 관리할 때 컴포넌트가 그 값을 지우면 안 된다.
 * - `type` 은 `asChild` 면 붙이지 않는다 — 소비자 요소가 `<button>` 이 아닐 수 있다.
 *
 * ## 한계
 * 자식이 자기 `onClickCapture` 를 갖고 있으면 그것이 우리 가드보다 먼저 돈다(Radix 의 같은
 * 합성 규칙). 이 조합은 사용처가 없다.
 *
 * 이 모듈은 `index.ts` 에서 export 하지 않는다 — 라이브러리 표면이 아니다.
 */
import type { MouseEventHandler } from 'react'

export type InertButtonType = 'button' | 'submit' | 'reset'

export interface InertInput<E extends HTMLElement = HTMLButtonElement> {
  disabled: boolean
  loading: boolean
  asChild: boolean
  type: InertButtonType
  onClick?: MouseEventHandler<E>
  tabIndex?: number
}

/** 루트 요소에 그대로 스프레드하는 속성. 소비자 `...rest` **뒤에** 놓아 덮어쓰이지 않게 한다. */
export interface InertRootProps<E extends HTMLElement = HTMLButtonElement> {
  onClickCapture: MouseEventHandler<E>
  onClick: MouseEventHandler<E>
  type: InertButtonType | undefined
  disabled: boolean | undefined
  tabIndex: number | undefined
  'aria-disabled': true | undefined
  'aria-busy': true | undefined
}

export function inertRootProps<E extends HTMLElement = HTMLButtonElement>(
  input: InertInput<E>,
): { isInert: boolean; rootProps: InertRootProps<E> } {
  const { disabled, loading, asChild, type, onClick, tabIndex } = input
  const isInert = disabled || loading

  return {
    isInert,
    rootProps: {
      onClickCapture: (event) => {
        if (!isInert) return
        // 네이티브 disabled 는 click 을 아예 발생시키지 않는다. 그 동작에 맞춰 기본 동작과 전파를 함께 끊는다.
        event.preventDefault()
        event.stopPropagation()
      },
      onClick: (event) => {
        // inert 면 캡처 가드가 전파를 끊어 여기까지 오지 않는다. 그래도 한 번 더 본다 —
        // 가드를 우회하는 경로가 생겨도 소비자 핸들러가 돌지는 않게.
        if (isInert) return
        onClick?.(event)
      },
      type: asChild ? undefined : type,
      disabled: asChild ? undefined : disabled,
      tabIndex: asChild && disabled ? -1 : tabIndex,
      'aria-disabled': isInert || undefined,
      'aria-busy': loading || undefined,
    },
  }
}
