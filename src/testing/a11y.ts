/**
 * 접근성 스캔 헬퍼 — axe-core 를 **컴포넌트 단위**로 돌린다.
 *
 * `COMPONENT_CHECKLIST.md` 의 Accessibility 절은 오랫동안 사람이 읽고 판단하는
 * 목록이었다. 그중 기계가 확정할 수 있는 것(역할·접근 가능한 이름·ARIA 속성의
 * 유효성·필수 부모/자식 관계·중복 id)을 axe 에 넘기고, 그 결과를 테스트가 부채
 * 목록과 대조할 수 있는 문자열 배열로 정규화하는 것이 이 파일의 전부다.
 *
 * ## 보장하는 것
 * axe-core 가 **호출 시점의 정적 DOM** 에서 판정할 수 있는 규칙.
 *
 * ## 보장하지 않는 것
 * - 색 대비 — jsdom 에서 판정 자체가 불가능하다 (`UNDECIDABLE_INCOMPLETE` 참고).
 * - 키보드 조작 경로·초점 이동 — 정적 DOM 에 없다.
 * - 접근 가능한 이름의 **품질**. axe 는 이름의 존재만 본다 — `aria-label="a"` 도 통과한다.
 * - **스캔하지 않은 상태.** 열려야 콘텐츠가 나오는 컴포넌트를 닫힌 채로 스캔하면
 *   빈 DOM 을 검사하고 통과한다. 그것을 막는 것은 호출부의 책임이다.
 *
 * `src/testing/**` 은 라이브러리 표면이 아니므로 어떤 `index.ts` 에서도 export 하지 않는다.
 */
import axe from 'axe-core'
import type { Result, RuleObject } from 'axe-core'

/**
 * **스캔 범위의 산물**이라 끄는 페이지 수준 규칙.
 *
 * 이 검사는 문서 전체가 아니라 컴포넌트 하나를 렌더해서 본다. 그 안에 `<main>`
 * 랜드마크도 `<h1>` 도 건너뛰기 링크도 있을 수 없다 — 있으면 오히려 이상하다.
 * 즉 이 규칙들이 내는 실패는 컴포넌트의 결함이 아니라 **우리가 컴포넌트만
 * 렌더했다는 사실**을 보고할 뿐이다. 페이지 조립은 소비자의 책임이고, 그 층은
 * 이 파일이 아니라 쇼케이스/앱에서 검증해야 한다.
 */
const PAGE_SCOPE_RULES = ['region', 'page-has-heading-one', 'bypass', 'landmark-one-main'] as const

/**
 * jsdom 에서 **판정 자체가 불가능한** 규칙.
 *
 * `color-contrast` 는 요소의 실제 전경/배경을 합성해 대비를 계산한다. 그러려면
 * 레이아웃과 페인트가 필요한데 jsdom 에는 둘 다 없고 `<canvas>` 도 없다. 실제로
 * 돌려보면 이 규칙은 매번 `"Axe encountered an error; test the page for this type
 * of problem manually"` 라는 incomplete 만 내놓고, jsdom 은 시도할 때마다
 * `Not implemented: HTMLCanvasElement's getContext()` 를 stderr 에 찍는다.
 *
 * **끄기만 하고 걸러내지 않는 이유**: 이 환경에서 이 규칙은 violation 을 낼
 * 가능성이 원리적으로 0 이다. 켜 둬 봐야 얻는 것은 없고 게이트 출력이 경고로
 * 뒤덮여 진짜 실패가 묻힌다.
 *
 * 대비는 이 검사가 **보지 못하는 항목**이다. 여기서 통과했다는 말에 대비는 포함되지 않는다.
 */
const UNDECIDABLE_INCOMPLETE = ['color-contrast'] as const

interface ScanOptions {
  /**
   * 추가로 끌 규칙 id.
   *
   * **탈출구다.** 쓰는 순간 호출부에 "왜 이 규칙이 이 컴포넌트에 적용될 수
   * 없는가"를 주석으로 남긴다. 지금 못 고치는 위반을 감추는 데 쓰면 검사가
   * 무의미해진다 — 그런 위반은 이 옵션이 아니라 부채 목록에 등록한다.
   */
  disableRules?: string[]
}

function toRuleObject(ids: readonly string[]): RuleObject {
  const out: RuleObject = {}
  for (const id of ids) out[id] = { enabled: false }
  return out
}

/**
 * 결과 하나를 `id[impact]` 한 줄로 줄인다.
 *
 * 노드 정보를 싣지 않는 이유: 실패 메시지가 **부채 목록과 그대로 대조 가능한**
 * 형태여야 하기 때문이다. 어느 컴포넌트인지는 테스트 케이스 이름이 이미 말해준다.
 *
 * incomplete 은 impact 자리에 `incomplete` 를 박는다. axe 의 impact 값은
 * `minor|moderate|serious|critical` 넷뿐이라 `incomplete` 과 겹치지 않으므로,
 * 한 문자열 안에서 "확실한 위반"과 "판정 보류"가 구분된다.
 */
function label(result: Result, kind: 'violation' | 'incomplete'): string {
  return `${result.id}[${kind === 'incomplete' ? 'incomplete' : (result.impact ?? 'unknown')}]`
}

/**
 * 컨테이너를 스캔해 위반 목록을 돌려준다. 빈 배열이면 위반 없음.
 *
 * **`incomplete` 도 위반으로 센다.** axe 는 판정에 확신이 없으면 violation 이
 * 아니라 incomplete 로 분류하는데, **여기에 실제 결함이 섞인다.** 대표적인 것이
 * 존재하지 않는 id 를 가리키는 `aria-describedby` 다 — `aria-valid-attr-value` 가
 * "가리키는 요소가 나중에 생길 수도 있다"며 incomplete 로 빼기 때문에, violations
 * 만 보는 스캐너는 조용히 통과한다. 실제로는 스크린리더가 읽어줄 설명이 영영 없다.
 * 그래서 기본값을 "둘 다 위반"으로 두고, 판정이 원리적으로 불가능한 규칙만
 * `UNDECIDABLE_INCOMPLETE` 로 끈다.
 *
 * 반환값은 정렬·중복 제거된 배열이다 — 같은 규칙이 노드 여럿에서 걸려도 한 줄로
 * 모인다. 실패 메시지의 길이가 아니라 **어떤 계약이 깨졌는지**가 읽혀야 한다.
 */
export async function scanA11y(container: HTMLElement, options?: ScanOptions): Promise<string[]> {
  const results = await axe.run(container, {
    // 검사에 쓰지 않는 결과(passes·inapplicable)의 노드 수집을 생략해 스캔을 가볍게 한다.
    resultTypes: ['violations', 'incomplete'],
    rules: {
      ...toRuleObject(PAGE_SCOPE_RULES),
      ...toRuleObject(UNDECIDABLE_INCOMPLETE),
      ...toRuleObject(options?.disableRules ?? []),
    },
  })

  const found = [
    ...results.violations.map((r) => label(r, 'violation')),
    ...results.incomplete.map((r) => label(r, 'incomplete')),
  ]

  return [...new Set(found)].sort()
}
