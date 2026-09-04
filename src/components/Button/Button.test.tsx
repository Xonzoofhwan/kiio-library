/**
 * `Button` 공개 계약 테스트.
 *
 * Button 은 이 라이브러리에서 가장 많이 복제된 구조다. `isInert = disabled || loading` 과
 * 같은 레이어 배치(포커스 링 span · 상태 오버레이 span · 콘텐츠 span · 스피너 span)를
 * ButtonEmphasized·ButtonError·IconButton·IconButtonEmphasized·IconButtonError·TextButton 이
 * 그대로 복사해 쓴다(2026-09-05 기준 7개). 여기서 깨지는 계약은 한 컴포넌트의 문제가 아니다.
 * 다만 이 파일이 **실제로 렌더해 보는 것은 Button 하나**이고, 나머지는 같은 패턴을
 * 공유한다는 사실만 근거다 — 나머지의 검증은 여기서 통과한 것이 아니다.
 *
 * ## 보장하는 것
 * 1. `loading` / `disabled` 의 DOM·ARIA 표면과 **둘의 차이**
 * 2. 클릭·탭 순서에서 두 상태가 실제로 어떻게 다른가(추정이 아니라 렌더 결과)
 * 3. `asChild` 가 소비자 요소를 루트로 삼고, 우리 레이어를 그 안에 넣는다
 * 4. `iconLeading`/`iconTrailing` 의 렌더 위치와 size → 아이콘 토큰 매핑
 * 5. `BUTTON_HIERARCHIES` × `BUTTON_SIZES` × `BUTTON_SHAPES` 전 조합이 던지지 않고,
 *    루트·포커스 링·상태 오버레이의 radius 가 서로 일치한다
 *
 * ## 보장하지 않는 것
 * **시각 결과 전부.** jsdom 은 Tailwind 스타일시트를 로드하지 않으므로
 * `pointer-events-none`·`invisible`·`group-focus-visible:opacity-100` 은 전부 그냥
 * 문자열이다. 여기서 확인하는 것은 "클래스가 붙었다"이지 "그렇게 보인다/동작한다"가
 * 아니다. 실제 차단이 관찰되는 경로는 네이티브 `disabled` 와 `onClick` 가드 둘뿐이다 —
 * `pointer-events-none` 은 여전히 문자열이다.
 * 재지 못한 항목은 `UNMEASURED_ASPECTS` 에 사유와 함께 둔다.
 *
 * ## 소스와 브리프가 갈린 지점
 * 이 파일은 소스가 실제로 하는 일만 단언한다. 소스가 이상해 보이는 곳은
 * `KNOWN_DEFECTS` 에 등록하고, 현재 동작을 그대로 못 박는 특성화 테스트를 둔다.
 * 결함이 고쳐지면 그 단언이 실패한다 — 그때 케이스와 등록 항목을 함께 지운다.
 *
 * 판정 로직은 순수 함수(`radiusUtilities`·`findRadiusDisagreements`·`readInertness`)로
 * 분리했다. 실제 컴포넌트가 계약을 만족하는 동안에도 판정기가 고장 나면 이 테스트는
 * 조용히 통과하는 껍데기가 되므로, 가짜 DOM·가짜 클래스 문자열로 판정기가 위반을
 * 잡아내는지 아래에서 함께 검사한다.
 */
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Button,
  BUTTON_HIERARCHIES,
  BUTTON_SIZES,
  BUTTON_SHAPES,
  type ButtonSize,
} from './Button'

/* ─── 알려진 결함 · 미검증 목록 ────────────────────────────────────────────── */

/**
 * 소스를 읽고 확인한 **현재 동작 중 결함으로 보이는 것.** 승인된 예외가 아니라 부채다.
 * 아래 특성화 테스트가 현재 동작을 고정하므로, 고치는 순간 red 가 나서 이 목록도 함께 정리된다.
 */
const KNOWN_DEFECTS: Record<string, string> = {
  // **비어 있다.** 등록됐던 두 항목은 전부 해소됐다 (2026-09-05):
  // - 'asChild 가 항상 던진다' → Slottable 로 소비자 자식을 감쌌다
  // - 'type 을 지정하지 않는다' → type prop 을 추가하고 기본값을 'button' 으로 뒀다
  // 목록이 비었다는 것은 "Button 에 결함이 없다"가 아니라 "여기 적힌 것이 없다"는 뜻이다.
  // UNMEASURED_ASPECTS 를 함께 읽어라.
}

/**
 * 이 테스트가 **보지 못하는** 것. 통과한 것이 아니라 재지 못한 것이다.
 * 목록이 비어 있지 않은 한 이 파일의 결과를 "Button 전부 검증됨"으로 읽으면 안 된다.
 */
const UNMEASURED_ASPECTS: Record<string, string> = {
  'pointer-events-none 의 실제 효력':
    'jsdom 은 Tailwind 스타일시트를 로드하지 않아 computed pointer-events 가 늘 auto 다. ' +
    '여기서 관찰되는 차단은 네이티브 disabled 와 onClick 가드뿐이고, pointer-events-none 이 ' +
    '포인터를 실제로 통과시키는지는 브라우저에서만 확인된다.',
  'asChild 경로의 도장 순서':
    'asChild 는 콘텐츠 래퍼를 쓸 수 없어(Slottable 은 Slot 의 최상위 자식이어야 한다) 링·오버레이를 ' +
    'isolate + -z-10 으로 콘텐츠 뒤에 둔다. 클래스가 붙었다는 것만 볼 수 있고, 실제 z-index 계산과 ' +
    '소비자 텍스트가 오버레이 위에 오는지는 브라우저의 몫이다. 콘텐츠 래퍼가 없어 텍스트 좌우 여백' +
    '(textMarginMap)도 빠지는데, 그 폭 차이 역시 여기서는 재지 못한다.',
  '포커스 링·상태 오버레이의 표시 여부':
    'group-focus-visible:/group-hover: 는 CSS 로만 켜진다. 여기서는 클래스 존재까지만 본다.',
  '아이콘의 실제 픽셀 크기':
    'size-[var(--comp-button-icon-*)] 의 var() 는 jsdom 에서 해석되지 않는다. 토큰 이름까지만 고정한다.',
  '눌림 scale·색 대비·타이포 렌더':
    '레이아웃과 실제 색 계산이 필요하다. 쇼케이스 육안 확인과 cssContract 의 몫이다.',
}

/* ─── 판정 로직 (순수 함수) ────────────────────────────────────────────────── */

interface Layer {
  name: string
  className: string
}

/**
 * 클래스 문자열에서 radius 유틸리티만 뽑는다.
 *
 * `rounded-full`·`rounded-none`·`rounded-[var(--comp-button-radius-md)]` 셋을 모두 잡아야
 * 하므로 접두사로 본다. 두 개 이상 나오면 그 자체가 신호다 — cn(twMerge) 이 충돌을
 * 해소했어야 할 자리이기 때문이다.
 */
function radiusUtilities(className: string): string[] {
  return className.split(/\s+/).filter((token) => /^rounded(-.+)?$/.test(token))
}

/**
 * 루트와 내부 레이어의 radius 가 어긋난 지점을 찾는다.
 *
 * 어긋나면 모서리에서 상태 오버레이나 포커스 링이 삐져나온다. `shape`/`size` 조합마다
 * 루트는 CVA(변형 + compound)에서, 내부 레이어는 `radiusMap` 에서 각각 값을 얻으므로
 * 두 경로가 갈라지기 쉽다 — 이 술어가 그 갈라짐을 잡는다.
 */
function findRadiusDisagreements(layers: readonly Layer[]): string[] {
  const violations: string[] = []
  const resolved: Array<[string, string]> = []

  for (const layer of layers) {
    const utilities = radiusUtilities(layer.className)
    if (utilities.length === 1) {
      resolved.push([layer.name, utilities[0]])
      continue
    }
    violations.push(
      `${layer.name}: radius 유틸리티가 ${utilities.length}개 (${utilities.join(', ') || '없음'})`,
    )
  }

  const distinct = new Set(resolved.map(([, utility]) => utility))
  if (distinct.size > 1) {
    violations.push(
      `레이어별 radius 불일치: ${resolved.map(([name, utility]) => `${name}=${utility}`).join(' / ')}`,
    )
  }
  return violations
}

/**
 * 콘텐츠 래퍼. 루트의 직계 span 중 유일하게 `relative` 인 것이다.
 *
 * `:scope > span:not([aria-hidden])` 로는 스피너 래퍼까지 걸린다(스피너 span 에는
 * aria-hidden 이 없다 — 그 자체가 §KNOWN 이 아니라 a11y 스모크의 관심사다).
 * 순서 인덱스로 집으면 loading 여부에 따라 자리가 바뀌므로 클래스로 집는다.
 */
function findContentWrapper(root: HTMLElement): HTMLElement | null {
  return (
    Array.from(root.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement && child.classList.contains('relative'),
    ) ?? null
  )
}

interface InertReport {
  /** 네이티브 `disabled` 속성. **탭 순서와 클릭 차단을 실제로 결정하는 유일한 값이다.** */
  nativeDisabled: boolean
  ariaDisabled: string | null
  ariaBusy: string | null
  /** 클래스 존재 여부일 뿐이다 — 실제 효력은 `UNMEASURED_ASPECTS` 참고. */
  pointerEventsNone: boolean
  /** 콘텐츠 래퍼가 `invisible` 인가. */
  contentHidden: boolean
  hasSpinner: boolean
  /** 상태 오버레이 레이어 수. inert 일 때 0 이어야 한다. */
  stateOverlays: number
}

/** 버튼 하나의 inert 표면을 한 번에 읽는다. loading 과 disabled 를 나란히 놓고 비교하려면 형태가 같아야 한다. */
function readInertness(root: HTMLElement): InertReport {
  const content = findContentWrapper(root)
  return {
    nativeDisabled: root.hasAttribute('disabled'),
    ariaDisabled: root.getAttribute('aria-disabled'),
    ariaBusy: root.getAttribute('aria-busy'),
    pointerEventsNone: root.classList.contains('pointer-events-none'),
    contentHidden: content?.classList.contains('invisible') ?? false,
    hasSpinner: root.querySelector('svg') !== null,
    stateOverlays: root.querySelectorAll(':scope > span[aria-hidden="true"].transition-colors').length,
  }
}

/**
 * radius 를 대조할 레이어를 모은다 — 루트와, 루트의 직계 `aria-hidden` span 전부.
 *
 * 계약 테스트와 아래 red 시연이 **같은 수집 경로**를 쓴다. 수집이 조용히 0개를 돌려주면
 * 술어가 아무리 옳아도 통과하므로, 개수 자체도 호출부에서 함께 단언한다.
 */
function collectRadiusLayers(root: HTMLElement): Layer[] {
  return [
    { name: 'root', className: root.className },
    ...Array.from(root.querySelectorAll<HTMLElement>(':scope > span[aria-hidden="true"]')).map(
      (span, index) => ({ name: `layer#${index}`, className: span.className }),
    ),
  ]
}

/** 루트 버튼을 집는다. `render` 는 호출마다 새 container 를 만들므로 스코프가 겹치지 않는다. */
function renderButton(ui: ReactElement): HTMLElement {
  const { container } = render(ui)
  const root = container.querySelector('button')
  if (!root) throw new Error('button 이 렌더되지 않았다')
  return root
}

/* ─── size → 아이콘 토큰 (의도적 중복) ────────────────────────────────────── */

/**
 * 소스의 `iconSizeMap`/`iconFontSizeVar` 를 import 하지 않고 **여기에 다시 적는다.**
 * 소스를 import 하면 "소스가 소스와 같다"는 항진명제가 되어 매핑이 바뀌어도 통과한다.
 */
const EXPECTED_ICON_TOKEN: Record<ButtonSize, string> = {
  xLarge: '--comp-button-icon-xl',
  large: '--comp-button-icon-lg',
  medium: '--comp-button-icon-md',
  small: '--comp-button-icon-sm',
}

/* ─── 계약 ─────────────────────────────────────────────────────────────────── */

describe('Button — 기본 표면', () => {
  it('button 요소로 렌더되고 inert 표시가 하나도 없다', () => {
    const root = renderButton(<Button>저장</Button>)

    expect(readInertness(root)).toEqual({
      nativeDisabled: false,
      ariaDisabled: null,
      ariaBusy: null,
      pointerEventsNone: false,
      contentHidden: false,
      hasSpinner: false,
      stateOverlays: 1,
    })
    expect(findContentWrapper(root)?.textContent).toBe('저장')
  })

  it('type 의 기본값이 button 이다 — HTML 기본값 submit 을 덮는다', () => {
    // HTML 의 기본값은 submit 이라, 지정하지 않으면 form 안의 모든 버튼이 제출 버튼이 된다.
    // 실수로 제출되는 쪽보다 명시적으로 제출을 요구하는 쪽이 안전하다.
    expect(renderButton(<Button>저장</Button>).getAttribute('type')).toBe('button')
  })

  it('type 을 넘기면 그대로 나간다', () => {
    expect(renderButton(<Button type="submit">저장</Button>).getAttribute('type')).toBe('submit')
    expect(renderButton(<Button type="reset">초기화</Button>).getAttribute('type')).toBe('reset')
  })

  it('asChild 면 type 을 붙이지 않는다 — 소비자 요소가 button 이 아닐 수 있다', () => {
    const { container } = render(
      <Button asChild>
        <a href="/docs">문서</a>
      </Button>,
    )
    expect(container.querySelector('a')!.hasAttribute('type')).toBe(false)
  })
})

describe('Button — loading', () => {
  it('aria-busy·aria-disabled 를 세우고 콘텐츠를 감춘 뒤 스피너를 올린다', () => {
    const root = renderButton(<Button loading>저장</Button>)

    expect(readInertness(root)).toEqual({
      // 로딩은 비활성이 아니라 진행 중이다. 네이티브 disabled 를 걸지 않아 포커스가 남는다.
      nativeDisabled: false,
      ariaDisabled: 'true',
      ariaBusy: 'true',
      pointerEventsNone: true,
      contentHidden: true,
      hasSpinner: true,
      // inert 면 상태 오버레이를 아예 마운트하지 않는다 — hover/active 배경이 남지 않게.
      stateOverlays: 0,
    })
    // 콘텐츠는 감출 뿐 제거하지 않는다. 제거하면 버튼 폭이 스피너 크기로 줄어 레이아웃이 튄다.
    expect(findContentWrapper(root)?.textContent).toBe('저장')
  })

  it('disabled 색 토큰은 적용하지 않는다 — 로딩은 비활성이 아니라 진행 중이다', () => {
    const root = renderButton(<Button loading>저장</Button>)

    expect(root.className).toContain('bg-[var(--comp-button-bg-primary)]')
    expect(root.className).not.toContain('--comp-button-bg-primary-disabled')
  })

  it('클릭이 무시된다 — onClick 가드가 소비자 핸들러를 부르지 않는다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const root = renderButton(
      <Button loading onClick={onClick}>
        저장
      </Button>,
    )

    await user.click(root)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('키보드 활성화(Enter·Space)도 같은 가드가 막는다', async () => {
    // 브라우저는 버튼의 Enter/Space 를 click 이벤트로 바꿔 준다. 그래서 onClick 가드
    // 하나가 포인터와 키보드를 함께 덮는다 — 이 케이스가 그 전제를 확인한다.
    const user = userEvent.setup()
    const onClick = vi.fn()
    const root = renderButton(
      <Button loading onClick={onClick}>
        저장
      </Button>,
    )

    root.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('탭 순서에 남고 포커스를 잃지 않는다', async () => {
    // 이것이 E2 의 목적이다. 네이티브 disabled 를 걸면 눌러 놓은 버튼이 로딩에 들어가는
    // 순간 포커스가 body 로 떨어지고, aria-busy 를 읽을 대상 자체가 사라진다.
    const user = userEvent.setup()
    const { container } = render(
      <>
        <button data-testid="before">before</button>
        <Button loading>저장</Button>
        <button data-testid="after">after</button>
      </>,
    )
    const loadingButton = container.querySelector('button[aria-busy="true"]')

    await user.tab()
    expect(document.activeElement).toBe(container.querySelector('[data-testid="before"]'))
    await user.tab()
    expect(document.activeElement).toBe(loadingButton)
    await user.tab()
    expect(document.activeElement).toBe(container.querySelector('[data-testid="after"]'))
  })

  it('form 안에서 제출을 일으키지 않는다', async () => {
    // Button 은 type 을 지정하지 않아 기본값이 submit 이다(KNOWN_DEFECTS). 네이티브
    // disabled 를 뗀 이상 제출을 막는 것은 가드의 preventDefault 뿐이다.
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault())
    const { container } = render(
      <form onSubmit={onSubmit}>
        <Button loading>저장</Button>
      </form>,
    )

    await user.click(container.querySelector('button')!)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('로딩이 아니면 제출된다 — 가드가 항상 막는 것이 아니다', async () => {
    // 위 케이스의 대조군. 가드가 무조건 preventDefault 하도록 잘못 짜여도 그 쪽은 통과하므로,
    // "막지 않아야 할 때 막지 않는가"를 함께 본다.
    // type="submit" 을 명시하는 이유: 기본값이 'button' 이라 지정하지 않으면 제출 자체가
    // 일어나지 않아 이 대조가 성립하지 않는다.
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault())
    const { container } = render(
      <form onSubmit={onSubmit}>
        <Button type="submit">저장</Button>
      </form>,
    )

    await user.click(container.querySelector('button')!)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('클릭이 조상으로 전파되지 않는다', async () => {
    // 네이티브 disabled 는 click 을 아예 발생시키지 않는다. 가드는 그 동작에 맞춰
    // 전파까지 끊는다 — 끊지 않으면 카드·행 같은 조상이 대신 반응한다.
    const user = userEvent.setup()
    const onAncestorClick = vi.fn()
    const { container } = render(
      <div onClick={onAncestorClick}>
        <Button loading>저장</Button>
      </div>,
    )

    await user.click(container.querySelector('button')!)
    expect(onAncestorClick).not.toHaveBeenCalled()
  })
})

describe('Button — disabled 와 loading 의 대조', () => {
  it('차단 수단이 다르다 — disabled 는 네이티브, loading 은 aria + 가드다', () => {
    const disabled = renderButton(<Button disabled>저장</Button>)
    const loading = renderButton(<Button loading>저장</Button>)

    const disabledReport = readInertness(disabled)
    const loadingReport = readInertness(loading)

    // 같은 것: "지금 누를 수 없다"는 표시와, 상태 오버레이를 마운트하지 않는 것.
    expect(disabledReport.ariaDisabled).toBe(loadingReport.ariaDisabled)
    expect(disabledReport.pointerEventsNone).toBe(loadingReport.pointerEventsNone)
    expect(disabledReport.stateOverlays).toBe(loadingReport.stateOverlays)

    // 다른 것 ①: 네이티브 disabled. disabled 만 탭 순서 밖으로 나가고, loading 은 남는다.
    expect(disabledReport.nativeDisabled).toBe(true)
    expect(loadingReport.nativeDisabled).toBe(false)

    // 다른 것 ②: 진행 중임을 알리는 aria-busy, 감춘 콘텐츠, 스피너.
    expect(disabledReport.ariaBusy).toBeNull()
    expect(loadingReport.ariaBusy).toBe('true')
    expect(disabledReport.contentHidden).toBe(false)
    expect(loadingReport.contentHidden).toBe(true)
    expect(disabledReport.hasSpinner).toBe(false)
    expect(loadingReport.hasSpinner).toBe(true)
  })

  it('disabled 만 비활성 색 토큰으로 갈아탄다', () => {
    const root = renderButton(<Button disabled>저장</Button>)

    expect(root.className).toContain('bg-[var(--comp-button-bg-primary-disabled)]')
    // cn(twMerge) 이 기본 배경을 걷어냈어야 한다. 남아 있으면 순서에 따라 승자가 바뀐다.
    expect(root.className).not.toContain('bg-[var(--comp-button-bg-primary)]')
  })

  it('disabled 도 탭 순서에서 빠지고 클릭이 무시된다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(
      <>
        <button data-testid="before">before</button>
        <Button disabled onClick={onClick}>
          저장
        </Button>
        <button data-testid="after">after</button>
      </>,
    )

    const root = container.querySelector('button[aria-disabled="true"]') as HTMLElement
    await user.click(root)
    expect(onClick).not.toHaveBeenCalled()

    await user.tab()
    await user.tab()
    expect(document.activeElement).toBe(container.querySelector('[data-testid="after"]'))
  })
})

describe('Button — asChild', () => {
  /**
   * asChild 경로의 루트는 **소비자가 준 요소**다. button 이 아니므로 `renderButton` 을 쓸 수 없다.
   * 이 헬퍼가 a 를 찾지 못하면 던지므로, 렌더가 조용히 빈 결과를 내는 경우도 함께 걸린다.
   */
  function renderAsChild(ui: ReactElement) {
    const { container } = render(ui)
    const root = container.querySelector('a')
    if (!root) throw new Error('소비자 요소(a)가 렌더되지 않았다')
    return { root, container }
  }

  it('소비자 요소가 루트가 되고 button 은 만들어지지 않는다', () => {
    const { root, container } = renderAsChild(
      <Button asChild>
        <a href="/docs">문서</a>
      </Button>,
    )

    expect(root.tagName).toBe('A')
    expect(root.getAttribute('href')).toBe('/docs')
    expect(container.querySelector('button')).toBeNull()
    expect(root.textContent).toContain('문서')
  })

  it('disabled 는 네이티브 속성 대신 tabIndex 로 tab 순서에서 뺀다', () => {
    // 네이티브 disabled 는 <button> 에만 유효하다. asChild 는 소비자가 어떤 요소를 줄지
    // 모르므로 <a disabled=""> 같은 무의미한 속성을 만들지 않는다. 대신 요소 종류와
    // 무관하게 결과가 같아지는 tabIndex 로 tab 순서에서 뺀다.
    const { root } = renderAsChild(
      <Button asChild disabled>
        <a href="/docs">문서</a>
      </Button>,
    )

    expect(root.hasAttribute('disabled')).toBe(false)
    expect(root.getAttribute('tabindex')).toBe('-1')
    expect(root.getAttribute('aria-disabled')).toBe('true')
  })

  it('disabled 가 아니면 tabIndex 를 건드리지 않는다', () => {
    // 강제로 0 을 박으면 소비자가 준 tabIndex 를 덮어쓴다. 필요한 때만 손댄다.
    const { root } = renderAsChild(
      <Button asChild>
        <a href="/docs">문서</a>
      </Button>,
    )

    expect(root.hasAttribute('tabindex')).toBe(false)
  })

  it('disabled 상태에서 클릭이 소비자 핸들러에 닿지 않는다', () => {
    // tabIndex 는 tab 순서만 다룬다. 활성화 차단은 onClick 가드의 몫이다 —
    // 마우스 클릭과 프로그래밍적 click() 은 tab 순서와 무관하게 일어난다.
    const onClick = vi.fn()
    const { root } = renderAsChild(
      <Button asChild disabled onClick={onClick}>
        <a href="/docs">문서</a>
      </Button>,
    )

    root.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('변형 클래스와 소비자 className 이 함께 남는다', () => {
    const { root } = renderAsChild(
      <Button asChild hierarchy="outlined" size="large" className="from-prop">
        <a href="/docs" className="from-child">
          문서
        </a>
      </Button>,
    )

    expect(root.className).toContain('bg-[var(--comp-button-bg-outlined)]')
    expect(root.className).toContain('h-[var(--comp-button-height-lg)]')
    // Radix mergeProps 는 두 className 을 이어 붙인다 — 한쪽이 사라지면 안 된다.
    expect(root.className).toContain('from-prop')
    expect(root.className).toContain('from-child')
  })

  it('상태 표면(aria)과 우리 레이어가 소비자 요소 안으로 들어간다', () => {
    const { root } = renderAsChild(
      <Button asChild loading>
        <a href="/docs">문서</a>
      </Button>,
    )

    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.getAttribute('aria-disabled')).toBe('true')
    // 포커스 링은 남고(inert 라 상태 오버레이는 마운트되지 않는다), 스피너가 올라간다.
    expect(root.querySelectorAll(':scope > span[aria-hidden="true"]')).toHaveLength(1)
    expect(root.querySelector('svg')).not.toBeNull()
  })

  it('아이콘은 콘텐츠 래퍼 없이 루트 직계 형제로, leading·자식·trailing 순서로 놓인다', () => {
    const { root } = renderAsChild(
      <Button asChild iconLeading={<i data-testid="lead" />} iconTrailing={<i data-testid="trail" />}>
        <a href="/docs">문서</a>
      </Button>,
    )

    // Slottable 은 Slot 의 최상위 자식이어야 발견된다. 콘텐츠 래퍼로 감싸는 순간 다시
    // 던지므로, **래퍼가 없다는 것 자체가 계약**이다.
    expect(findContentWrapper(root)).toBeNull()

    const marks = Array.from(root.childNodes).map((node) => {
      if (!(node instanceof HTMLElement)) return node.textContent
      if (node.querySelector('[data-testid="lead"]')) return 'lead'
      if (node.querySelector('[data-testid="trail"]')) return 'trail'
      return 'layer'
    })
    expect(marks).toEqual(['layer', 'layer', 'lead', '문서', 'trail'])
  })

  it('콘텐츠 래퍼가 없어진 만큼 간격을 루트가 갖는다', () => {
    const { root } = renderAsChild(
      <Button asChild size="small">
        <a href="/docs">문서</a>
      </Button>,
    )

    // 래퍼가 없으면 gap 도 함께 사라져 아이콘이 텍스트에 붙는다. 그래서 루트로 올린다.
    expect(root.className).toContain('gap-[var(--comp-button-gap-sm)]')
    // 링·오버레이를 콘텐츠 뒤로 보내기 위한 스태킹 컨텍스트(표시 여부는 UNMEASURED).
    expect(root.className).toContain('isolate')
  })

  it('가드가 소비자 핸들러와 기본 동작(이동)을 함께 막는다', () => {
    const onClick = vi.fn()
    const { root } = renderAsChild(
      <Button asChild loading onClick={onClick}>
        <a href="/docs">문서</a>
      </Button>,
    )

    // 링크의 기본 동작은 이동이다. user.click 은 defaultPrevented 를 돌려주지 않으므로
    // 네이티브 이벤트를 직접 던져 그 값을 읽는다.
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    root.dispatchEvent(event)

    expect(onClick).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })
})

describe('Button — 아이콘 슬롯', () => {
  it('leading·텍스트·trailing 순서로 콘텐츠 래퍼 안에 놓인다', () => {
    const root = renderButton(
      <Button iconLeading={<i data-testid="lead" />} iconTrailing={<i data-testid="trail" />}>
        저장
      </Button>,
    )
    const content = findContentWrapper(root)
    expect(content).not.toBeNull()

    const slots = Array.from(content!.children)
    expect(slots).toHaveLength(3)
    expect(slots[0].querySelector('[data-testid="lead"]')).not.toBeNull()
    expect(slots[1].textContent).toBe('저장')
    expect(slots[2].querySelector('[data-testid="trail"]')).not.toBeNull()
  })

  it('아이콘을 넘기지 않으면 래퍼 자체가 없다', () => {
    const root = renderButton(<Button>저장</Button>)
    expect(findContentWrapper(root)?.children).toHaveLength(1)
  })

  it.each(BUTTON_SIZES)('size=%s 는 대응하는 아이콘 토큰으로 박스와 font-size 를 함께 준다', (size) => {
    const token = EXPECTED_ICON_TOKEN[size]
    const root = renderButton(
      <Button size={size} iconLeading={<i data-testid="lead" />}>
        저장
      </Button>,
    )
    const slot = findContentWrapper(root)!.children[0] as HTMLElement

    // 박스 크기(class)와 폰트 아이콘 크기(inline style)가 **같은 토큰**을 가리켜야 한다.
    // 갈라지면 Material Symbols 같은 폰트 아이콘이 박스 밖으로 넘친다.
    expect(slot.className).toContain(`size-[var(${token})]`)
    expect(slot.style.fontSize).toBe(`var(${token})`)
    // 아이콘이 눌려 찌그러지지 않게 하는 고정점.
    expect(slot.classList.contains('flex-shrink-0')).toBe(true)
  })
})

describe('Button — variant 전 조합', () => {
  // as const 배열이 단일 소스다. 새 값을 추가하면 이 테스트가 자동으로 늘어난다.
  const combinations = BUTTON_HIERARCHIES.flatMap((hierarchy) =>
    BUTTON_SIZES.flatMap((size) => BUTTON_SHAPES.map((shape) => ({ hierarchy, size, shape }))),
  )

  it('조합 수가 세 배열의 곱과 같다', () => {
    // 조합을 만들다 축 하나를 빠뜨리면 아래 루프가 조용히 줄어든다.
    expect(combinations).toHaveLength(
      BUTTON_HIERARCHIES.length * BUTTON_SIZES.length * BUTTON_SHAPES.length,
    )
  })

  it.each(combinations)('hierarchy=$hierarchy size=$size shape=$shape 이 던지지 않고 렌더된다', (props) => {
    const root = renderButton(<Button {...props}>저장</Button>)
    expect(root.tagName).toBe('BUTTON')
    expect(findContentWrapper(root)?.textContent).toBe('저장')
  })

  it.each(combinations)('hierarchy=$hierarchy size=$size shape=$shape 의 레이어 radius 가 일치한다', (props) => {
    const root = renderButton(<Button {...props}>저장</Button>)
    const layers = collectRadiusLayers(root)

    // 루트(포커스 링·오버레이 포함) 3겹이 같은 radius 를 써야 모서리가 어긋나지 않는다.
    expect(layers).toHaveLength(3)
    expect(findRadiusDisagreements(layers).join('\n')).toBe('')
  })
})

describe('Button — 부채·미검증 목록', () => {
  it('알려진 결함은 사유와 함께 등록돼 있다', () => {
    const defects = Object.keys(KNOWN_DEFECTS)
    for (const name of defects) expect(KNOWN_DEFECTS[name].length).toBeGreaterThan(0)
    // 비어 있지 않은 한 이 파일의 green 을 "Button 계약 이상 없음"으로 읽으면 안 된다.
    // 목록을 리터럴로 대조한다 — 승인 없이 항목이 늘거나 조용히 줄면 여기서 먼저 깨진다.
    expect(defects).toEqual([])
  })

  it('미검증 항목은 사유와 함께 남아 있다', () => {
    const unmeasured = Object.keys(UNMEASURED_ASPECTS)
    for (const name of unmeasured) expect(UNMEASURED_ASPECTS[name].length).toBeGreaterThan(0)
    expect(unmeasured.length).toBeGreaterThan(0)
  })
})

/* ─── red 시연 — 판정 로직이 실제로 위반을 잡는다 ─────────────────────────── */

describe('판정 로직', () => {
  describe('radiusUtilities', () => {
    it('토큰·full·none 세 형태를 모두 잡는다', () => {
      expect(radiusUtilities('a rounded-[var(--x)] b')).toEqual(['rounded-[var(--x)]'])
      expect(radiusUtilities('rounded-full flex')).toEqual(['rounded-full'])
      expect(radiusUtilities('rounded-none')).toEqual(['rounded-none'])
    })

    it('radius 가 아닌 클래스는 잡지 않는다', () => {
      // `rounded` 로 시작하지 않는 것과, 접두사만 겹치는 것 둘 다.
      expect(radiusUtilities('border-2 grouped-thing rounding-x')).toEqual([])
    })
  })

  describe('findRadiusDisagreements', () => {
    it('레이어끼리 radius 가 다르면 잡는다', () => {
      const violations = findRadiusDisagreements([
        { name: 'root', className: 'rounded-full' },
        { name: 'ring', className: 'rounded-[var(--comp-button-radius-md)]' },
      ])
      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('불일치')
    })

    it('radius 가 아예 없는 레이어를 잡는다', () => {
      const violations = findRadiusDisagreements([
        { name: 'root', className: 'rounded-full' },
        { name: 'ring', className: 'absolute inset-0' },
      ])
      expect(violations).toEqual(['ring: radius 유틸리티가 0개 (없음)'])
    })

    it('충돌이 해소되지 않아 radius 가 둘 남은 레이어를 잡는다', () => {
      const violations = findRadiusDisagreements([{ name: 'root', className: 'rounded-full rounded-none' }])
      expect(violations).toEqual(['root: radius 유틸리티가 2개 (rounded-full, rounded-none)'])
    })

    it('전부 같으면 빈 배열이다', () => {
      expect(
        findRadiusDisagreements([
          { name: 'root', className: 'flex rounded-none' },
          { name: 'ring', className: 'absolute rounded-none' },
        ]),
      ).toEqual([])
    })
  })

  describe('readInertness', () => {
    /**
     * 정책 없는 대조군. "aria-busy 만 세우면 로딩"이라고 믿는 순진한 구현이다.
     * 손으로 만든 타임라인이 아니라 실제 DOM 을 읽혀야, 판정기가 옳아도 아무것도
     * 관찰하지 못하는 조합이 통과하는 일을 막을 수 있다.
     */
    function renderNaiveLoadingButton(): HTMLElement {
      const { container } = render(
        <button aria-busy="true">
          <span className="relative">저장</span>
        </button>,
      )
      return container.querySelector('button')!
    }

    it('대조군의 누락을 전부 드러낸다', () => {
      expect(readInertness(renderNaiveLoadingButton())).toEqual({
        nativeDisabled: false,
        ariaDisabled: null,
        ariaBusy: 'true',
        pointerEventsNone: false,
        contentHidden: false,
        hasSpinner: false,
        stateOverlays: 0,
      })
    })

    it('콘텐츠 래퍼가 없으면 contentHidden 을 참으로 만들지 않는다', () => {
      const { container } = render(<button aria-busy="true" />)
      expect(readInertness(container.querySelector('button')!).contentHidden).toBe(false)
    })
  })

  describe('레이어 수집 + radius 판정 (렌더 경로 전체)', () => {
    /**
     * 정책 없는 대조군. Button 과 같은 3겹 구조를 흉내 내되 포커스 링만 다른 radius 를 쓴다 —
     * `radiusMap` 과 CVA compound 가 갈라졌을 때 실제로 나오는 모양이다.
     *
     * 가짜 클래스 문자열만으로 술어를 검사하면 "술어는 옳지만 수집이 아무것도 못 찾는" 조합이
     * 그대로 통과한다. 여기서는 render → collectRadiusLayers → findRadiusDisagreements 전 경로를 태운다.
     */
    function renderMismatchedButton(): HTMLElement {
      const { container } = render(
        <button className="rounded-full">
          <span aria-hidden className="absolute inset-0 rounded-[var(--comp-button-radius-md)]" />
          <span aria-hidden className="absolute inset-0 rounded-full" />
          <span className="relative">저장</span>
        </button>,
      )
      return container.querySelector('button')!
    }

    it('실제 렌더에서 어긋난 radius 를 잡는다', () => {
      const layers = collectRadiusLayers(renderMismatchedButton())

      expect(layers.map((layer) => layer.name)).toEqual(['root', 'layer#0', 'layer#1'])
      const violations = findRadiusDisagreements(layers)
      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('layer#0=rounded-[var(--comp-button-radius-md)]')
    })

    it('aria-hidden 이 아닌 레이어는 수집하지 않는다', () => {
      // 콘텐츠 래퍼에는 radius 가 없다. 함께 수집하면 "0개" 위반으로 매번 오탐한다.
      const layers = collectRadiusLayers(renderMismatchedButton())
      expect(layers.some((layer) => layer.className.includes('relative'))).toBe(false)
    })
  })

  describe('findContentWrapper', () => {
    it('absolute 레이어가 아니라 relative 인 콘텐츠 래퍼를 집는다', () => {
      const { container } = render(
        <button>
          <span aria-hidden className="absolute inset-0" />
          <span className="relative flex">본문</span>
          <span className="absolute inset-0">스피너 자리</span>
        </button>,
      )
      expect(findContentWrapper(container.querySelector('button')!)?.textContent).toBe('본문')
    })
  })
})
