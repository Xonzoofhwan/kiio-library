/**
 * 키보드 계약 테스트 — APG composite widget 규칙을 실행 검사로 옮긴다.
 *
 * 이 저장소의 키보드 동작은 두 갈래다. 대부분은 Radix 가 제공하고,
 * `NavVertical` 하나만 `onKeyDown` 으로 직접 구현했다. 둘 다 지금까지 **문서에만**
 * 존재했고, 어느 쪽도 회귀를 감지할 수단이 없었다. 키보드 결함은 마우스로 만지는
 * 개발 화면에서 증상이 전혀 없으므로 특히 조용히 새어나간다.
 *
 * ## 보장하는 것
 * 렌더 결과의 **키보드 상호작용 계약**만 본다.
 * - 어떤 키를 눌렀을 때 포커스가 어디로 가는가 (`focusOrder`)
 * - 위젯 항목 중 tab 순서에 몇 개가 있는가 (`inspectRovingTabIndex`)
 * - 활성화 키가 상태를 바꾸는가 (`aria-checked`·`aria-selected`·`aria-current`·`onClick`)
 * - 열림/닫힘이 focus·Escape 로 제어되는가
 *
 * ## 보장하지 않는 것
 * - **시각**: 포커스 링이 실제로 보이는지, 인디케이터가 옳은 자리에 있는지.
 *   그것은 `cssContract` 와 쇼케이스 육안 확인의 몫이다.
 * - **실제 브라우저의 순차 포커스 탐색**: jsdom 의 Tab 이동은 user-event 가 흉내 내는
 *   것이다. 그래서 "Tab 한 번으로 위젯을 빠져나온다" 같은 항목은 여기서 단언하지
 *   않고 `UNMEASURED_KEYBOARD` 에 사유와 함께 남긴다.
 * - **스크린 리더 발화**: role·이름·상태 속성이 옳다는 것까지만 본다.
 *
 * ## 발견한 위반은 고치지 않고 고정한다
 * 기대와 다른 동작은 `KNOWN_KEYBOARD_DEBT` 에 **현재 동작 그대로** 사유와 함께
 * 박아 둔다. 회귀는 막되 그것이 부채임을 명시한다. 컴포넌트 소스는 이 PR 에서
 * 건드리지 않는다 — 부채 해소는 별도의 판단이 필요한 작업이다.
 *
 * 판정 로직(`inspectRovingTabIndex`·`describeElement`)은 순수 함수로 분리돼 있다.
 * 컴포넌트가 계약을 만족하는 동안에도 판정기가 고장 나면 이 파일은 조용히 통과하는
 * 껍데기가 되므로, 가짜 DOM 으로 판정기가 위반을 잡아내는지 아래에서 함께 검사한다.
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 어떤 index.ts 에서도 export 하지 않는다.)
 */
import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { NavVertical } from '@/components/NavVertical'
import { Radio, RadioGroup } from '@/components/Radio'
import { SegmentBar } from '@/components/SegmentBar'
import { Switch } from '@/components/Switch'
import { Tab } from '@/components/Tab'
import { Tooltip } from '@/components/Tooltip'
import { NO_FOCUS, describeElement, focusOrder, inspectRovingTabIndex } from './keyboard'

/* ─── 부채 목록 — 승인 없이 늘리지 않는다 ─────────────────────────────────── */

/**
 * **기대와 다르지만 지금 고치지 않기로 한 동작.** 승인된 예외가 아니라 부채다.
 *
 * 여기 있는 항목은 아래 케이스에서 **현재 동작 그대로** 고정된다. 회귀는 막지만
 * "통과했다"는 뜻이 아니다. 해소되면 케이스를 옳은 기대로 바꾸고 여기서 뺀다.
 * **새 항목을 추가하는 순간이 곧 승인을 받아야 하는 시점이다.**
 */
const KNOWN_KEYBOARD_DEBT = {
  'NavVertical.탭스톱이_포커스를_따라가지_않음': [
    'APG roving tabindex 는 tabIndex=0 을 **마지막으로 포커스한** 항목에 둔다. 이 구현은 ',
    '**선택된** 항목에 둔다. 그래서 방향키로 이동만 하고 활성화하지 않은 채 Tab 으로 나갔다 ',
    '돌아오면, 사용자가 있던 자리가 아니라 선택된 항목으로 돌아온다.',
  ].join(''),
} as const

type DebtId = keyof typeof KNOWN_KEYBOARD_DEBT

/** 케이스 제목에서 인용된 부채 id. 인용되지 않은 항목(=죽은 부채)을 아래에서 잡는다. */
const citedDebt = new Set<DebtId>()

/** 존재하지 않는 부채를 인용하면 **타입 에러**가 난다. 목록과 케이스가 어긋날 수 없다. */
function debt(id: DebtId): string {
  citedDebt.add(id)
  return `[부채 ${id}]`
}

/**
 * **검사가 판정할 수 없는 항목.** 검증되지 않은 것이지 통과한 것이 아니다.
 *
 * 이 목록이 비어 있지 않은 한 "키보드 계약 전부 통과"라고 쓸 수 없다.
 */
const UNMEASURED_KEYBOARD: Record<string, string> = {
  'Radio.선택이_포커스를_따라가는가': [
    'Radix RovingFocusGroup 은 방향키 포커스 이동을 `setTimeout` 으로 미루고, RadioGroup 은 ',
    '그 뒤 도착한 focus 이벤트에서 `document` 의 keydown 리스너가 세운 플래그를 보고 클릭한다. ',
    'jsdom + user-event 에서는 keyup 이 그 setTimeout 보다 먼저 실행돼 플래그가 이미 꺼져 있다 ',
    '— 실측: `{ArrowDown>}`(keydown 만)이면 선택이 따라오고, keyup 까지 보내면 따라오지 않는다. ',
    '즉 이 환경의 결과는 컴포넌트 동작이 아니라 타이머 끼어들기 순서다. 실브라우저 확인이 필요하다.',
  ].join(''),
  '정방향_Tab_한_번으로_위젯을_빠져나오는가': [
    'APG composite widget 의 핵심 성질이지만 jsdom 에는 순차 포커스 탐색이 없고 user-event 가 ',
    '흉내 낸다. Radix 는 컨테이너(tabIndex=0)와 현재 항목(tabIndex=0)을 동시에 tab 순서에 두고 ',
    '컨테이너 onFocus 로 항목에 넘기는 방식이라, 흉내 낸 탐색으로는 실제 브라우저의 결과를 ',
    '대신할 수 없다. 실브라우저 확인이 필요하다.',
  ].join(''),
  'Escape_이외의_닫기_경로': [
    'Tooltip 은 focus/blur 와 Escape 만 검사한다. 포인터로 열린 뒤의 닫힘, 스크롤·리사이즈 ',
    '충돌 재배치는 레이아웃이 필요해 jsdom 에서 판정할 수 없다.',
  ].join(''),
}

/* ─── 공통 ─────────────────────────────────────────────────────────────────── */

const setup = () => userEvent.setup()

/** 위젯 앞뒤에 경계 버튼을 두어 "진입"과 "탈출"이 기록에서 구분되게 한다. */
function withBoundaries(children: ReactNode) {
  return (
    <div>
      <Button>앞</Button>
      {children}
      <Button>뒤</Button>
    </div>
  )
}

const checkedStates = (role: 'radio' | 'checkbox' | 'switch') =>
  screen.getAllByRole(role).map((el) => el.getAttribute('aria-checked'))

/* ═══ NavVertical — 이 저장소가 직접 구현한 유일한 키보드 로직 ══════════════ */

function renderNav(props: { defaultValue?: string } = {}) {
  return render(
    withBoundaries(
      <NavVertical {...props}>
        <NavVertical.Item value="a">알파</NavVertical.Item>
        <NavVertical.Item value="b">브라보</NavVertical.Item>
        <NavVertical.Item value="c">찰리</NavVertical.Item>
      </NavVertical>,
    ),
  )
}

// role 이 아니라 data 속성으로 찾는다 — NavVerticalItem 은 role 을 덮지 않고
// 네이티브 button role 을 쓰므로(그룹 토글 버튼과 role 이 같다) role 로는 구분되지 않는다.
const navItems = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-nav-vertical-item]'))

describe('NavVertical — 직접 구현한 roving tabindex', () => {
  it('활성 항목 하나만 tab 순서에 있다', () => {
    renderNav({ defaultValue: 'b' })
    const report = inspectRovingTabIndex(navItems())
    expect(report.ok).toBe(true)
    expect(report.focusable).toEqual(['브라보 [button]'])
    // 프로퍼티와 속성을 함께 본다 — 속성이 실제로 붙어 있어야 roving 을 "구현했다"고 할 수 있다.
    expect(report.tabIndexes).toEqual([-1, 0, -1])
    expect(report.attributes).toEqual(['-1', '0', '-1'])
  })

  it('Tab 한 번으로 활성 항목에 진입한다', async () => {
    const user = setup()
    renderNav({ defaultValue: 'b' })
    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '브라보 [button]'])
  })

  it('ArrowDown / ArrowUp 이 항목을 순환한다', async () => {
    const user = setup()
    renderNav({ defaultValue: 'b' })
    expect(await focusOrder(user, ['{Tab}', '{Tab}', '{ArrowDown}', '{ArrowDown}', '{ArrowUp}'])).toEqual([
      '앞 [button]',
      '브라보 [button]',
      '찰리 [button]',
      '알파 [button]', // 마지막에서 첫째로 순환
      '찰리 [button]', // 첫째에서 마지막으로 역순환
    ])
  })

  it('Home / End 가 양 끝으로 보낸다', async () => {
    const user = setup()
    renderNav({ defaultValue: 'b' })
    expect(await focusOrder(user, ['{Tab}', '{Tab}', '{End}', '{Home}'])).toEqual([
      '앞 [button]',
      '브라보 [button]',
      '찰리 [button]',
      '알파 [button]',
    ])
  })

  it('disabled 항목은 방향키 이동에서 건너뛴다', async () => {
    const user = setup()
    render(
      withBoundaries(
        <NavVertical defaultValue="a">
          <NavVertical.Item value="a">알파</NavVertical.Item>
          <NavVertical.Item value="b" disabled>
            브라보
          </NavVertical.Item>
          <NavVertical.Item value="c">찰리</NavVertical.Item>
        </NavVertical>,
      ),
    )
    expect(await focusOrder(user, ['{Tab}', '{Tab}', '{ArrowDown}'])).toEqual([
      '앞 [button]',
      '알파 [button]',
      '찰리 [button]', // 브라보를 건너뛴다
    ])
  })

  it('Enter 와 Space 가 항목을 활성화하고 tab 스톱이 함께 옮겨간다', async () => {
    const user = setup()
    renderNav({ defaultValue: 'a' })

    await user.keyboard('{Tab}{Tab}{ArrowDown}{Enter}')
    expect(navItems().map((i) => i.getAttribute('aria-current'))).toEqual([null, 'page', null])
    expect(inspectRovingTabIndex(navItems()).focusable).toEqual(['브라보 [button]'])

    await user.keyboard('{ArrowDown} ')
    expect(navItems().map((i) => i.getAttribute('aria-current'))).toEqual([null, null, 'page'])
    expect(inspectRovingTabIndex(navItems()).focusable).toEqual(['찰리 [button]'])
  })

  it('활성 값이 없어도 첫 항목이 tab 순서에 남아 진입할 수 있다', async () => {
    // APG 보완 규칙: 선택이 없으면 첫 항목을 tab 순서에 둔다.
    // 이것이 없으면 uncontrolled + defaultValue 미지정일 때 모든 항목이 -1 이 되어
    // Tab 이 위젯을 통째로 건너뛴다 — 키보드 사용자에게 내비게이션이 존재하지 않는다.
    const user = setup()
    renderNav() // defaultValue 없음

    const report = inspectRovingTabIndex(navItems())
    expect(report.ok).toBe(true)
    expect(report.focusable).toEqual(['알파 [button]'])
    expect(report.tabIndexes).toEqual([0, -1, -1])

    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '알파 [button]'])
  })

  it(`${debt('NavVertical.탭스톱이_포커스를_따라가지_않음')} 방향키로 옮긴 포커스를 tab 스톱이 따라가지 않는다`, async () => {
    const user = setup()
    renderNav({ defaultValue: 'a' })

    await user.keyboard('{Tab}{Tab}{ArrowDown}')
    expect(describeElement(document.activeElement)).toBe('브라보 [button]')
    // 포커스는 브라보인데 tab 스톱은 선택된 알파에 그대로 있다.
    expect(inspectRovingTabIndex(navItems()).focusable).toEqual(['알파 [button]'])
  })
})

/* ═══ Tab — Radix roving + activationMode ═════════════════════════════════ */

function renderTabs(activationMode?: 'automatic' | 'manual') {
  return render(
    withBoundaries(
      <Tab defaultValue="1" activationMode={activationMode}>
        <Tab.List>
          <Tab.Item value="1">첫째</Tab.Item>
          <Tab.Item value="2">둘째</Tab.Item>
          <Tab.Item value="3">셋째</Tab.Item>
        </Tab.List>
        <Tab.Panel value="1">패널1</Tab.Panel>
        <Tab.Panel value="2">패널2</Tab.Panel>
        <Tab.Panel value="3">패널3</Tab.Panel>
      </Tab>,
    ),
  )
}

const tabItems = () => screen.getAllByRole('tab')
const selectedTabs = () => tabItems().map((t) => t.getAttribute('aria-selected'))

describe('Tab — Radix roving tabindex', () => {
  it('진입 전에는 컨테이너가 탭 스톱이고 항목은 전부 tab 순서 밖이다', () => {
    renderTabs()
    // NavVertical(항목이 처음부터 탭 스톱)과 다른 유효한 변형이다. Radix 는 tablist 를
    // tab 순서에 두고, 거기에 포커스가 닿으면 onFocus 로 현재 항목에 넘긴다.
    expect(screen.getByRole('tablist').tabIndex).toBe(0)
    expect(inspectRovingTabIndex(tabItems()).ok).toBe(false)
    expect(inspectRovingTabIndex(tabItems()).tabIndexes).toEqual([-1, -1, -1])
  })

  it('Tab 한 번으로 선택된 탭에 진입하고, 그때 항목 하나가 tab 순서에 들어온다', async () => {
    const user = setup()
    renderTabs()
    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '첫째 [tab]'])

    const report = inspectRovingTabIndex(tabItems())
    expect(report.ok).toBe(true)
    expect(report.focusable).toEqual(['첫째 [tab]'])
    expect(report.attributes).toEqual(['0', '-1', '-1'])
  })

  it('automatic(기본): 방향키가 포커스와 선택·패널을 함께 옮긴다', async () => {
    const user = setup()
    renderTabs()
    await user.keyboard('{Tab}{Tab}')
    expect(await focusOrder(user, ['{ArrowRight}'])).toEqual(['둘째 [tab]'])
    expect(selectedTabs()).toEqual(['false', 'true', 'false'])
    expect(screen.queryByText('패널2')).not.toBe(null)
    expect(screen.queryByText('패널1')).toBe(null)
  })

  it('manual: 방향키는 포커스만 옮기고 Enter 가 선택한다', async () => {
    const user = setup()
    renderTabs('manual')
    await user.keyboard('{Tab}{Tab}')

    expect(await focusOrder(user, ['{ArrowRight}'])).toEqual(['둘째 [tab]'])
    expect(selectedTabs()).toEqual(['true', 'false', 'false']) // 선택은 그대로
    expect(screen.queryByText('패널2')).toBe(null)

    await user.keyboard('{Enter}')
    expect(selectedTabs()).toEqual(['false', 'true', 'false'])
    expect(screen.queryByText('패널2')).not.toBe(null)
  })

  it('manual: Space 로도 선택된다', async () => {
    const user = setup()
    renderTabs('manual')
    await user.keyboard('{Tab}{Tab}{ArrowRight} ')
    expect(selectedTabs()).toEqual(['false', 'true', 'false'])
  })

  it('패널이 탭 목록 다음 탭 스톱이며, 이름이 자신을 가리키는 탭과 같다', async () => {
    const user = setup()
    renderTabs()
    // 패널의 접근 가능한 이름은 aria-labelledby 로 탭에서 온다. 이름만 비교하면
    // "제자리걸음"으로 오독되므로 describeElement 가 role 을 함께 싣는다.
    expect(await focusOrder(user, ['{Tab}', '{Tab}', '{Tab}'])).toEqual([
      '앞 [button]',
      '첫째 [tab]',
      '첫째 [tabpanel]',
    ])
  })
})

/* ═══ SegmentBar — 그룹 안 roving ══════════════════════════════════════════ */

function renderSegmentBar() {
  return render(
    withBoundaries(
      <SegmentBar defaultValue="a">
        <SegmentBar.Item value="a">에이</SegmentBar.Item>
        <SegmentBar.Item value="b">비</SegmentBar.Item>
        <SegmentBar.Item value="c">씨</SegmentBar.Item>
      </SegmentBar>,
    ),
  )
}

describe('SegmentBar — 그룹 안 roving', () => {
  it('진입 후 항목 하나만 tab 순서에 있고, 방향키가 순환하며 tab 스톱이 따라온다', async () => {
    const user = setup()
    renderSegmentBar()

    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '에이 [radio]'])
    expect(inspectRovingTabIndex(screen.getAllByRole('radio')).ok).toBe(true)

    expect(await focusOrder(user, ['{ArrowRight}', '{ArrowRight}', '{ArrowRight}'])).toEqual([
      '비 [radio]',
      '씨 [radio]',
      '에이 [radio]', // 순환
    ])
    expect(inspectRovingTabIndex(screen.getAllByRole('radio')).focusable).toEqual(['에이 [radio]'])
  })

  it('방향키만으로는 선택이 바뀌지 않고 Enter·Space 가 선택한다', async () => {
    const user = setup()
    renderSegmentBar()
    await user.keyboard('{Tab}{Tab}{ArrowRight}')
    expect(checkedStates('radio')).toEqual(['true', 'false', 'false'])

    await user.keyboard('{Enter}')
    expect(checkedStates('radio')).toEqual(['false', 'true', 'false'])

    await user.keyboard('{ArrowRight} ')
    expect(checkedStates('radio')).toEqual(['false', 'false', 'true'])
  })

  it('role="radio" 의 부모가 radiogroup 이다', () => {
    // ARIA 는 radio 의 소유자로 radiogroup 을 요구한다(aria-required-parent).
    // Radix ToggleGroup 은 루트에 role="group" 을 주므로 우리가 덮어써야 한다 —
    // 없으면 보조기술이 "3개 중 1번째" 같은 위치 정보를 읽어주지 못한다.
    renderSegmentBar()
    const item = screen.getAllByRole('radio')[0]
    expect(item.parentElement?.getAttribute('role')).toBe('radiogroup')
    expect(screen.getByRole('radiogroup')).toBeDefined()
  })
})

/* ═══ Radio + RadioGroup ══════════════════════════════════════════════════ */

function renderRadios() {
  return render(
    withBoundaries(
      <RadioGroup defaultValue="a">
        <Radio value="a" aria-label="에이" />
        <Radio value="b" aria-label="비" />
        <Radio value="c" aria-label="씨" />
      </RadioGroup>,
    ),
  )
}

describe('Radio + RadioGroup — 그룹 안 roving', () => {
  it('진입 후 선택된 항목 하나만 tab 순서에 있다', async () => {
    const user = setup()
    renderRadios()
    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '에이 [radio]'])

    const report = inspectRovingTabIndex(screen.getAllByRole('radio'))
    expect(report.ok).toBe(true)
    expect(report.focusable).toEqual(['에이 [radio]'])
    expect(report.attributes).toEqual(['0', '-1', '-1'])
  })

  it('방향키가 항목을 순환하고 tab 스톱이 포커스를 따라간다', async () => {
    const user = setup()
    renderRadios()
    await user.keyboard('{Tab}{Tab}')

    expect(await focusOrder(user, ['{ArrowDown}', '{ArrowDown}', '{ArrowDown}'])).toEqual([
      '비 [radio]',
      '씨 [radio]',
      '에이 [radio]',
    ])
    await user.keyboard('{ArrowDown}')
    expect(inspectRovingTabIndex(screen.getAllByRole('radio')).focusable).toEqual(['비 [radio]'])
  })

  it('Space 가 포커스한 항목을 선택한다', async () => {
    const user = setup()
    renderRadios()
    await user.keyboard('{Tab}{Tab}{ArrowDown} ')
    expect(checkedStates('radio')).toEqual(['false', 'true', 'false'])
  })

  it('그룹은 radiogroup 으로 노출된다', () => {
    renderRadios()
    expect(screen.getAllByRole('radio')[0].parentElement?.getAttribute('role')).toBe('radiogroup')
  })
})

/* ═══ Switch · Checkbox — 활성화 키 ═══════════════════════════════════════ */

describe('Switch · Checkbox — 활성화 키', () => {
  it('Switch: Space 로 토글된다', async () => {
    const user = setup()
    render(<Switch aria-label="알림" />)
    await user.keyboard('{Tab}')
    expect(describeElement(document.activeElement)).toBe('알림 [switch]')

    await user.keyboard(' ')
    expect(checkedStates('switch')).toEqual(['true'])
    await user.keyboard(' ')
    expect(checkedStates('switch')).toEqual(['false'])
  })

  it('Switch: Enter 로도 토글된다 (Checkbox 와 다른 지점)', async () => {
    const user = setup()
    render(<Switch aria-label="알림" />)
    await user.keyboard('{Tab}{Enter}')
    // Radix Switch 는 Checkbox 와 달리 Enter 를 막지 않는다. `<button>` 의 기본 동작이
    // 그대로 살아 click 이 발생한다. APG 의 switch 패턴은 Enter 를 선택 사항으로 두므로
    // 위반은 아니지만, 같은 라이브러리 안에서 두 토글의 키 반응이 다르다는 사실을 고정한다.
    expect(checkedStates('switch')).toEqual(['true'])
  })

  it('Checkbox: Space 로 토글되고 Enter 에는 반응하지 않는다', async () => {
    const user = setup()
    render(<Checkbox aria-label="동의" />)
    await user.keyboard('{Tab}')
    expect(describeElement(document.activeElement)).toBe('동의 [checkbox]')

    await user.keyboard(' ')
    expect(checkedStates('checkbox')).toEqual(['true'])

    await user.keyboard('{Enter}')
    expect(checkedStates('checkbox')).toEqual(['true']) // 변화 없음
  })

  it('disabled 토글은 tab 순서 밖이다', async () => {
    const user = setup()
    render(
      withBoundaries(
        <>
          <Switch aria-label="알림" disabled />
          <Checkbox aria-label="동의" disabled />
        </>,
      ),
    )
    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '뒤 [button]'])
  })
})

/* ═══ Tooltip — focus 로 열고 Escape 로 닫는다 ═══════════════════════════ */

function renderTooltip() {
  return render(
    <Tooltip.Provider delayDuration={0}>
      <Tooltip>
        <Tooltip.Trigger>
          <Button>도움말</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>설명 문구</Tooltip.Content>
      </Tooltip>
      <Button>뒤</Button>
    </Tooltip.Provider>,
  )
}

describe('Tooltip — 키보드 경로', () => {
  it('트리거에 포커스가 닿으면 열린다', async () => {
    const user = setup()
    renderTooltip()
    expect(screen.queryByRole('tooltip')).toBe(null)

    await user.keyboard('{Tab}')
    expect(describeElement(document.activeElement)).toBe('도움말 [button]')
    expect(await screen.findByRole('tooltip')).not.toBe(null)
  })

  it('Escape 로 닫히고 포커스는 트리거에 남는다', async () => {
    const user = setup()
    renderTooltip()
    await user.keyboard('{Tab}')
    await screen.findByRole('tooltip')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).toBe(null)
    // 닫기가 포커스를 빼앗으면 사용자가 자리를 잃는다.
    expect(describeElement(document.activeElement)).toBe('도움말 [button]')
  })

  it('포커스가 떠나면 닫히고, 돌아오면 다시 열린다', async () => {
    const user = setup()
    renderTooltip()
    await user.keyboard('{Tab}')
    await screen.findByRole('tooltip')

    await user.keyboard('{Tab}')
    expect(describeElement(document.activeElement)).toBe('뒤 [button]')
    expect(screen.queryByRole('tooltip')).toBe(null)

    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(await screen.findByRole('tooltip')).not.toBe(null)
  })
})

/* ═══ Button — 활성화 키와 탭 순서 ════════════════════════════════════════ */

describe('Button — 활성화 키와 탭 순서', () => {
  it('Enter 와 Space 가 onClick 을 부른다', async () => {
    const user = setup()
    let clicks = 0
    render(
      <Button
        onClick={() => {
          clicks += 1
        }}
      >
        저장
      </Button>,
    )

    await user.keyboard('{Tab}')
    expect(describeElement(document.activeElement)).toBe('저장 [button]')

    await user.keyboard('{Enter}')
    expect(clicks).toBe(1)
    await user.keyboard(' ')
    expect(clicks).toBe(2)
  })

  it('disabled 버튼은 tab 순서에서 빠진다', async () => {
    const user = setup()
    render(withBoundaries(<Button disabled>비활성</Button>))
    expect(await focusOrder(user, ['{Tab}', '{Tab}', '{Tab}'])).toEqual([
      '앞 [button]',
      '뒤 [button]',
      NO_FOCUS,
    ])
  })

  it('loading 버튼은 tab 순서에 남는다 — disabled 와 갈리는 지점', async () => {
    // 눌러 놓은 버튼이 로딩에 들어가는 순간 포커스가 body 로 떨어지면 키보드 사용자가
    // 자리를 잃고, 스크린리더는 aria-busy 를 읽을 대상 자체를 잃는다.
    // 그래서 loading 은 native disabled 를 켜지 않고 aria-disabled 로만 막는다.
    const user = setup()
    render(withBoundaries(<Button loading>저장</Button>))

    const loadingButton = screen.getByRole('button', { name: '저장' })
    expect(loadingButton.getAttribute('aria-busy')).toBe('true')
    expect(loadingButton.getAttribute('aria-disabled')).toBe('true')
    expect(loadingButton.hasAttribute('disabled')).toBe(false)

    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '저장 [button]'])
  })

  it('disabled 버튼은 tab 순서에서 빠진다 — loading 과의 대조', async () => {
    // 같은 inert 처럼 보여도 둘은 다르다. disabled 는 "지금 쓸 수 없다"라 건너뛰는 것이 맞고,
    // loading 은 "곧 다시 쓸 수 있다"라 자리를 지켜야 한다.
    const user = setup()
    render(withBoundaries(<Button disabled>저장</Button>))

    const disabledButton = screen.getByRole('button', { name: '저장' })
    expect(disabledButton.hasAttribute('disabled')).toBe(true)

    expect(await focusOrder(user, ['{Tab}', '{Tab}'])).toEqual(['앞 [button]', '뒤 [button]'])
  })
})

/* ═══ 부채·미검증 목록 자체를 검사한다 ════════════════════════════════════ */

describe('부채·미검증 목록', () => {
  it('모든 부채 항목이 실제 케이스에서 인용된다', () => {
    // 인용되지 않은 부채는 해소됐거나 잘못 적힌 것이다. 어느 쪽이든 목록에서 빠져야 한다.
    const uncited = (Object.keys(KNOWN_KEYBOARD_DEBT) as DebtId[]).filter((id) => !citedDebt.has(id))
    expect(uncited).toEqual([])
  })

  it('부채 목록이 2026-09-05 실측 그대로다', () => {
    // 목록이 늘어나면 이 단언이 먼저 깨진다 — 승인 없이 부채가 쌓이는 것을 막는다.
    expect(Object.keys(KNOWN_KEYBOARD_DEBT)).toEqual([
      'NavVertical.탭스톱이_포커스를_따라가지_않음',
    ])
    for (const reason of Object.values(KNOWN_KEYBOARD_DEBT)) {
      expect(reason.length).toBeGreaterThan(40)
    }
  })

  it('미검증 목록이 무엇을 판정하지 못했는지 사유와 함께 드러낸다', () => {
    // 이 단언은 목록을 비우라는 뜻이 아니라 **검증되지 않은 것과 통과한 것을 구분해
    // 두라는 것**이다. 목록이 비어 있지 않은 한 "전부 통과"라고 쓸 수 없다.
    expect(Object.keys(UNMEASURED_KEYBOARD)).toEqual([
      'Radio.선택이_포커스를_따라가는가',
      '정방향_Tab_한_번으로_위젯을_빠져나오는가',
      'Escape_이외의_닫기_경로',
    ])
    for (const reason of Object.values(UNMEASURED_KEYBOARD)) {
      expect(reason.length).toBeGreaterThan(40)
    }
  })
})

/* ═══ 판정 로직 자체 검사 — red 시연 ═════════════════════════════════════ */

interface FakeItemSpec {
  name: string
  /** 생략하면 `tabindex` 속성을 아예 붙이지 않는다 — `<button>` 의 기본 상태를 재현한다. */
  tabindex?: number
  disabled?: boolean
  ariaDisabled?: boolean
}

/**
 * 가짜 위젯을 만든다. 판정기가 진짜 컴포넌트 없이도 위반을 잡아내는지 보기 위해서다.
 *
 * `document.body` 에 직접 붙이지 않고 `render` 를 쓰는 이유: RTL 의 `cleanup` 은
 * 자기가 만든 컨테이너만 걷어낸다. 손으로 붙인 노드는 다음 케이스까지 살아남아
 * `getByRole` 을 "여러 개 찾음"으로 깨뜨린다(실제로 그렇게 깨졌다).
 */
function fakeItems(specs: FakeItemSpec[]): HTMLElement[] {
  const { container } = render(
    <div>
      {specs.map((spec) => (
        <button
          key={spec.name}
          type="button"
          tabIndex={spec.tabindex}
          disabled={spec.disabled}
          aria-disabled={spec.ariaDisabled || undefined}
        >
          {spec.name}
        </button>
      ))}
    </div>,
  )
  return [...container.querySelectorAll('button')]
}

describe('판정 로직 — inspectRovingTabIndex', () => {
  it('항목이 전부 tabIndex=0 이면 위반으로 잡는다', () => {
    // roving 을 구현하지 않은 위젯의 형태. 사용자가 빠져나가려면 Tab 을 항목 수만큼 눌러야 한다.
    const report = inspectRovingTabIndex(
      fakeItems([
        { name: '하나', tabindex: 0 },
        { name: '둘', tabindex: 0 },
        { name: '셋', tabindex: 0 },
      ]),
    )
    expect(report.ok).toBe(false)
    expect(report.focusable).toEqual(['하나 [button]', '둘 [button]', '셋 [button]'])
  })

  it('tabindex 속성을 아예 붙이지 않아도 <button> 은 tab 순서에 남는다', () => {
    // 속성만 보면 "아무것도 안 했다"로 보이지만 프로퍼티는 0 이다.
    // 두 값을 따로 보고하는 이유가 이것이다 — 고치는 방법이 갈린다.
    const report = inspectRovingTabIndex(fakeItems([{ name: '하나' }, { name: '둘' }]))
    expect(report.ok).toBe(false)
    expect(report.attributes).toEqual([null, null])
    expect(report.tabIndexes).toEqual([0, 0])
  })

  it('항목이 전부 tabIndex=-1 이어도 위반으로 잡는다', () => {
    // 위젯에 아예 진입할 수 없는 상태. "정확히 하나"는 0 개도 배제한다.
    const report = inspectRovingTabIndex(
      fakeItems([
        { name: '하나', tabindex: -1 },
        { name: '둘', tabindex: -1 },
      ]),
    )
    expect(report.ok).toBe(false)
    expect(report.focusable).toEqual([])
  })

  it('정확히 하나만 tab 순서에 있으면 통과시킨다', () => {
    const report = inspectRovingTabIndex(
      fakeItems([
        { name: '하나', tabindex: -1 },
        { name: '둘', tabindex: 0 },
        { name: '셋', tabindex: -1 },
      ]),
    )
    expect(report.ok).toBe(true)
    expect(report.focusable).toEqual(['둘 [button]'])
  })

  it('disabled 는 tabIndex 프로퍼티가 0 이어도 tab 순서 밖으로 센다', () => {
    const report = inspectRovingTabIndex(
      fakeItems([
        { name: '하나', tabindex: 0, disabled: true },
        { name: '둘', tabindex: 0 },
      ]),
    )
    expect(report.ok).toBe(true)
    expect(report.tabIndexes).toEqual([0, 0]) // 프로퍼티는 둘 다 0 이다
    expect(report.focusable).toEqual(['둘 [button]'])
  })

  it('aria-disabled 는 tab 순서에 남긴다', () => {
    // 비활성인데도 포커스를 받아 이유를 읽어줄 수 있게 하는 것이 aria-disabled 의 목적이다.
    const report = inspectRovingTabIndex(
      fakeItems([
        { name: '하나', tabindex: 0, ariaDisabled: true },
        { name: '둘', tabindex: 0 },
      ]),
    )
    expect(report.ok).toBe(false)
    expect(report.focusable).toEqual(['하나 [button]', '둘 [button]'])
  })
})

describe('판정 로직 — describeElement', () => {
  it('aria-hidden 사본을 이름에 세지 않는다 (textContent 와 대비)', () => {
    render(
      <button type="button">
        <span>저장</span>
        {/* 레이아웃 흔들림 방지용 사본 — 화면에도 보조기술에도 없어야 한다 */}
        <span aria-hidden="true">저장</span>
      </button>,
    )
    const element = screen.getByRole('button')
    expect(element.textContent).toBe('저장저장') // textContent 를 썼다면 이 값이 이름이 된다
    expect(describeElement(element)).toBe('저장 [button]')
  })

  it('Spinner 의 <style> 본문이 이름을 오염시키지 않는다', () => {
    // loading Button 은 SVG 안에 <style> 로 keyframes 를 심는다. textContent 는 그
    // CSS 를 통째로 싣는다 — 실패 메시지가 수십 줄짜리 스타일 시트가 된다.
    render(<Button loading>저장</Button>)
    const element = screen.getByRole('button')
    expect(element.textContent).toContain('@keyframes')
    expect(describeElement(element)).toBe('저장 [button]')
  })

  it('이름이 같아도 role 로 구분된다', () => {
    // Radix Tabs 에서 실제로 나오는 형태 — 패널이 aria-labelledby 로 자기 탭을 가리킨다.
    const { container } = render(
      <div>
        <button type="button" id="t" role="tab">
          둘째
        </button>
        <div role="tabpanel" aria-labelledby="t" />
      </div>,
    )
    expect(describeElement(container.querySelector('[role=tab]'))).toBe('둘째 [tab]')
    expect(describeElement(container.querySelector('[role=tabpanel]'))).toBe('둘째 [tabpanel]')
  })

  it('이름이 없으면 그 사실을 싣는다', () => {
    const { container } = render(
      <div>
        <div role="tablist" />
        <span />
      </div>,
    )
    expect(describeElement(container.querySelector('[role=tablist]'))).toBe('(이름 없음) [tablist]')
    // role 이 없는 요소는 태그명으로 대신 표시한다.
    expect(describeElement(container.querySelector('span'))).toBe('(이름 없음) [<span>]')
  })

  it('포커스가 body 에 있거나 요소가 없으면 (포커스 없음) 이다', () => {
    expect(describeElement(null)).toBe(NO_FOCUS)
    expect(describeElement(document.body)).toBe(NO_FOCUS)
  })
})

describe('판정 로직 — focusOrder', () => {
  it('키 개수만큼, 각 키를 누른 직후의 포커스를 기록한다', async () => {
    const user = setup()
    render(
      <div>
        <Button>하나</Button>
        <Button>둘</Button>
      </div>,
    )
    const trail = await focusOrder(user, ['{Tab}', '{Tab}', '{Tab}'])
    expect(trail).toHaveLength(3)
    expect(trail).toEqual(['하나 [button]', '둘 [button]', NO_FOCUS])
  })

  it('키가 없으면 아무것도 기록하지 않는다', async () => {
    const user = setup()
    render(<Button>하나</Button>)
    expect(await focusOrder(user, [])).toEqual([])
  })
})
