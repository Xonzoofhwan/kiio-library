/**
 * 키보드 계약 헬퍼 — APG composite widget 규칙을 검사 가능한 형태로 옮긴다.
 *
 * ## 왜 이 두 함수인가
 * 키보드 결함은 **실패했을 때 무엇이 잘못됐는지 읽히지 않는 것**이 가장 큰 비용이다.
 * `expect(document.activeElement).toBe(items[1])` 는 실패하면 DOM 노드 두 개를 덤프하고
 * 끝난다 — 어느 항목에 포커스가 갔는지 사람이 알아보려면 그 덤프를 눈으로 파싱해야 한다.
 * 그래서 두 헬퍼 모두 **사람이 읽는 이름**과 **원본 값**을 돌려주는 쪽으로 설계했다.
 *
 * ## 보장하는 것
 * 아무것도 보장하지 않는다. 이 파일은 판정기가 아니라 **관측기**다.
 * `focusOrder` 는 키를 누른 뒤 포커스가 어디 있었는지 기록하고, `inspectRovingTabIndex`
 * 는 tab 순서 상태를 있는 그대로 보고한다. 무엇이 옳은지는 호출하는 계약 테스트가 정한다.
 *
 * ## 보장하지 않는 것
 * 시각(포커스 링이 실제로 보이는지), 스크린 리더 발화, 실제 브라우저의 순차 포커스 탐색
 * 순서. jsdom 의 Tab 이동은 user-event 가 흉내 내는 것이지 브라우저 구현이 아니다 —
 * `display:none`·`visibility:hidden`·`inert` 로 숨겨진 요소의 처리는 브라우저와 다를 수 있다.
 *
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 어떤 index.ts 에서도 export 하지 않는다.)
 */
import { computeAccessibleName, getRole } from 'dom-accessibility-api'
import type { UserEvent } from '@testing-library/user-event'

/* ─── 접근 가능한 이름 ─────────────────────────────────────────────────────── */

/** 이름을 구할 수 없는 요소를 가리키는 표식. 빈 문자열로 두면 실패 메시지에서 사라진다. */
const UNNAMED = '(이름 없음)'

/** 포커스가 어느 요소에도 있지 않을 때의 표식. `document.body` 는 사실상 "아무데도 없음"이다. */
export const NO_FOCUS = '(포커스 없음)'

/**
 * 요소를 사람이 읽을 수 있는 한 줄 `이름 [role]` 로 만든다.
 *
 * **`textContent` 를 쓰지 않는 이유**: `textContent` 는 화면에 없는 것까지 이어 붙인다.
 * 이 저장소에 실제로 두 가지 형태가 있다.
 * - `aria-hidden` 사본: 레이아웃 흔들림을 막으려고 라벨을 두 번 렌더하면
 *   `textContent` 는 "저장저장" 이 된다.
 * - `<style>` 본문: `Spinner` 는 SVG 안에 `<style>` 로 keyframes 를 심는다.
 *   `loading` Button 의 `textContent` 는 그 CSS 수십 줄을 통째로 문자열에 싣는다.
 *
 * `computeAccessibleName` 은 accname 명세대로 둘 다 제외한다.
 *
 * **role 을 함께 싣는 이유**: 이름만으로는 서로 다른 요소가 구분되지 않는 경우가 있다.
 * Radix Tabs 의 패널은 `aria-labelledby` 로 자신의 탭을 가리키므로 **탭과 패널의 접근
 * 가능한 이름이 같다.** 포커스 이동 기록이 `["둘째", "둘째"]` 로 나오면 제자리걸음처럼
 * 보이지만 실제로는 탭 → 패널로 옳게 이동한 것이다. role 이 붙으면 그 오독이 사라진다.
 *
 * 이름이 비면 `(이름 없음)` 을 싣는다 — 이름이 없다는 사실 자체가 결함일 때가 많은데
 * 빈 문자열만 나오면 그 사실이 실패 메시지에서 지워진다.
 */
export function describeElement(element: Element | null): string {
  if (!element || element === element.ownerDocument.body) return NO_FOCUS

  const name = computeAccessibleName(element).trim() || UNNAMED
  // role 이 없는 요소(예: 순수 `<div>`)는 태그명으로 대신 표시한다.
  const role = getRole(element) ?? `<${element.tagName.toLowerCase()}>`
  return `${name} [${role}]`
}

/* ─── 포커스 이동 기록 ─────────────────────────────────────────────────────── */

/**
 * 키를 순서대로 누르고 **각 단계 뒤의** 포커스를 접근 가능한 이름으로 기록한다.
 *
 * 반환 길이는 `keys` 와 같다 — `keys[i]` 를 누른 직후의 포커스가 `result[i]` 다.
 * 누르기 전 상태는 기록하지 않는다. 필요하면 호출부에서 `describeElement` 로 직접 찍는다.
 *
 * 키 문자열은 user-event 의 키보드 문법을 그대로 쓴다(`'{Tab}'`, `'{ArrowDown}'`, `'{Shift>}{Tab}{/Shift}'`).
 *
 * @example
 * expect(await focusOrder(user, ['{Tab}', '{ArrowDown}', '{End}'])).toEqual(['홈', '검색', '설정'])
 */
export async function focusOrder(user: UserEvent, keys: string[]): Promise<string[]> {
  const trail: string[] = []
  for (const key of keys) {
    await user.keyboard(key)
    trail.push(describeElement(document.activeElement))
  }
  return trail
}

/* ─── roving tabindex 관측 ─────────────────────────────────────────────────── */

export interface RovingTabIndexReport {
  /** tab 순서에 있는 항목이 **정확히 하나**인가. APG composite widget 의 최소 조건이다. */
  ok: boolean
  /** tab 순서에 있는 항목들의 접근 가능한 이름. 실패 시 "누가 남아 있는지"가 바로 보인다. */
  focusable: string[]
  /** 각 항목의 `tabIndex` **프로퍼티**(브라우저가 계산한 실효값). */
  tabIndexes: number[]
  /** 각 항목의 `tabindex` **속성** 원본. 속성이 없으면 `null`. */
  attributes: (string | null)[]
}

/**
 * 요소가 순차 포커스 탐색 순서(tab 순서)에 있는가.
 *
 * `disabled` 는 `tabIndex` 프로퍼티를 0 으로 남긴 채 요소를 순서에서 빼므로 따로 본다.
 * **`aria-disabled` 는 빼지 않는다** — 그것이 `aria-disabled` 를 쓰는 이유다.
 * 비활성이면서도 포커스를 받아, 왜 눌리지 않는지 스크린 리더가 읽어줄 수 있어야 한다.
 */
function isInTabOrder(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return false
  return element.tabIndex >= 0
}

/**
 * 항목들의 tab 순서 상태를 **보고한다. 단언하지 않는다.**
 *
 * 단언을 여기 넣지 않는 이유는 두 가지다.
 * 1. 기대가 테스트마다 다르다 — 활성 항목이 하나도 없는 상태를 허용하는 위젯이 있고,
 *    아닌 위젯이 있다.
 * 2. 실패했을 때 **원본 값이 그대로 보이는 편**이 낫다. `ok === false` 만 남으면
 *    tabindex 가 전부 0 인지, 전부 -1 인지, 어느 항목이 남았는지 알 수 없다.
 *
 * **`tabIndexes`(프로퍼티)와 `attributes`(속성)를 따로 돌려주는 이유**: 두 값이
 * 가리키는 결함이 다르고, **고치는 방법이 갈린다.**
 * - `<button>` 은 `tabindex` 속성이 없어도 `tabIndex === 0` 이다. 즉 속성이 `null` 인데
 *   프로퍼티가 0 이면 "roving 을 구현하지 않았다"는 뜻이다 → 속성을 붙여야 한다.
 * - 속성이 `"-1"` 인데 프로퍼티가 0 이면 파싱 실패거나 다른 코드가 덮어쓴 것이다 →
 *   붙이는 코드가 아니라 덮어쓰는 코드를 찾아야 한다.
 *
 * APG 근거: composite widget 은 **Tab 한 번으로 진입하고 방향키로 내부를 이동**한다.
 * 그러려면 항목 중 정확히 하나만 tab 순서에 있어야 한다. 항목마다 `tabIndex=0` 이면
 * 사용자가 위젯을 빠져나가려고 Tab 을 항목 수만큼 눌러야 한다.
 */
export function inspectRovingTabIndex(items: HTMLElement[]): RovingTabIndexReport {
  const inOrder = items.filter(isInTabOrder)
  return {
    ok: inOrder.length === 1,
    focusable: inOrder.map(describeElement),
    tabIndexes: items.map((item) => item.tabIndex),
    attributes: items.map((item) => item.getAttribute('tabindex')),
  }
}
