/**
 * 접근성 스모크 — 컴포넌트를 대표 props 로 렌더해 axe 로 스캔한다.
 *
 * 목적은 "완전한 접근성 검증"이 아니라 **회귀 감시**다. 역할·접근 가능한 이름·
 * ARIA 속성 유효성처럼 기계가 확정할 수 있는 계약이 어느 날 조용히 깨지는 것을 막는다.
 *
 * ## 보장하는 것
 * 각 컴포넌트를 **한 가지 대표 상태로** 렌더했을 때 `scanA11y` 결과가 기대값과 같다.
 * 열려야 콘텐츠가 나오는 것(Tooltip·Callout·collapsible 그룹)은 **연 상태에서**
 * 스캔하며, 열렸다는 사실을 스캔 전에 단언한다 — 빈 DOM 은 언제나 통과하기 때문이다.
 *
 * ## 보장하지 않는 것
 * `UNMEASURED_A11Y` 에 사유와 함께 적어 둔다. 그 목록이 비어 있지 않은 한
 * "접근성 전부 통과"라고 쓸 수 없다.
 *
 * 기대값이 빈 배열이 아닌 케이스가 있고, 성격이 둘로 갈린다:
 * - `KNOWN_A11Y_DEBT` — **실제 결함.** 컴포넌트를 고쳐야 사라진다.
 * - `AXE_RULE_LIMITATIONS` — axe 가 원리적으로 판정을 보류하는 조합. 우리 결함이 아니다.
 *
 * 스캐너가 고장 나면 이 파일은 **아무것도 검사하지 않으면서 전부 통과**한다.
 * 그래서 "스캐너 자기 검사" 절에서 결함을 일부러 주입해 잡히는지 확인한다.
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 밖으로 export 하지 않는다.)
 */
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { scanA11y } from './a11y'

import { Button, ButtonEmphasized, ButtonError, IconButton } from '@/components/Button'
import { TextButton } from '@/components/TextButton'
import { BadgeDot, BadgeLabel } from '@/components/Badge'
import { ChipBadgeLikeEmphasized, ChipBadgeLikeUniversal, ChipUniversal } from '@/components/Chip'
import { Checkbox } from '@/components/Checkbox'
import { Radio, RadioGroup } from '@/components/Radio'
import { Switch } from '@/components/Switch'
import { SegmentBar } from '@/components/SegmentBar'
import { Tab } from '@/components/Tab'
import { NavVertical } from '@/components/NavVertical'
import { Tooltip } from '@/components/Tooltip'
import { Callout } from '@/components/Callout'
import { SkeletonBlock } from '@/components/Skeleton'
import { Icon } from '@/components/icons'

/* ─── 기대값이 비지 않은 케이스 ────────────────────────────────────────────── */

interface ExpectedViolations {
  violations: string[]
  reason: string
}

/**
 * 아직 해소되지 않은 접근성 부채. **승인된 예외가 아니다.**
 *
 * 여기 등록된 위반은 "괜찮다"가 아니라 "지금 이 작업에서 고칠 수 없다"는 뜻이다.
 * 각 항목에 왜 지금 못 고치는지와 **무엇을 고쳐야 하는지**를 적는다.
 * **목록은 줄이기만 한다** — 새 항목을 넣어야 하는 순간이 곧 승인을 받아야 하는 시점이다.
 */
const KNOWN_A11Y_DEBT: Record<string, ExpectedViolations> = {
  // **현재 비어 있다.** 이 목록이 비었다는 것은 "위반이 없다"가 아니라
  // "이 스모크가 보는 범위 안에서 위반이 없다"는 뜻이다. UNMEASURED_A11Y 를 함께 읽어라.
  //
  // 해소된 항목 (2026-09-05):
  // - NavVertical `aria-required-parent` — NavVerticalItem 이 role="menuitem" 을
  //   덮어써 조상에 menu/menubar/group 을 요구했다. ARIA 에서 menuitem 은 애플리케이션
  //   메뉴의 항목이지 사이트 내비게이션 링크가 아니다. role 을 떼고 네이티브 button
  //   role + aria-current="page" 로 되돌렸다.
  // - Callout `aria-dialog-name` — Radix Popover.Content 가 role="dialog" 인데 이름이
  //   없었다. CalloutContent 가 본문(upper row)에 id 를 붙이고 aria-labelledby 로
  //   가리키게 했다. 소비자가 aria-label/aria-labelledby 를 주면 그쪽이 이긴다.
}

/**
 * axe 가 **원리적으로 판정을 보류하는** 조합. 부채가 아니다 — 우리 코드는 옳다.
 *
 * `KNOWN_A11Y_DEBT` 와 섞지 않는 이유: 부채 목록은 0 으로 수렴해야 하는 목록이고,
 * 여기 있는 것은 컴포넌트를 아무리 고쳐도 줄지 않는다. 섞으면 부채가 줄고 있는지
 * 볼 수 없게 된다.
 */
const AXE_RULE_LIMITATIONS: Record<string, ExpectedViolations> = {
  'Callout (열린 상태)': {
    violations: ['aria-valid-attr-value[incomplete]'],
    reason:
      'axe 의 aria-valid-attr-value 는 aria-haspopup 이 붙은 요소의 aria-controls 를 ' +
      '**id 존재 여부와 무관하게 무조건** "검토 필요"로 분류한다 ' +
      '(axe.js ariaValidAttrValueEvaluate 의 aria-controls 사전 검사: hasPopup 이면 ' +
      'messageKey="controlsWithinPopup"). Radix Popover.Trigger 는 aria-haspopup="dialog" 와 ' +
      'aria-controls 를 항상 함께 내보내므로 열린 Callout 은 반드시 이 보류를 낸다. ' +
      '실제로는 id 가 존재하며 열린 dialog 를 가리킨다 — 아래 "판정 보류의 출처" 케이스가 그 사실을 실증한다. ' +
      '**한계**: 이 항목이 서 있는 동안 Callout 안의 진짜 aria-valid-attr-value 보류(예: 끊어진 ' +
      'aria-describedby)는 같은 문자열이라 흡수된다. 그래서 출처를 분리해 보는 케이스를 따로 둔다.',
  },
}

/**
 * 이 스모크가 **보지 못하는** 것. 검증되지 않은 것이지 통과한 것이 아니다.
 */
const UNMEASURED_A11Y: Record<string, string> = {
  '색 대비':
    'jsdom 에 레이아웃도 페인트도 canvas 도 없어 실제 전경/배경을 합성할 수 없다. ' +
    'axe 의 color-contrast 를 아예 끄고 돌린다 (a11y.ts UNDECIDABLE_INCOMPLETE). ' +
    'WCAG AA 대비는 여전히 사람이 확인한다.',
  '대표 상태 외의 상태':
    '컴포넌트당 한 가지 조합만 렌더한다. disabled·loading·checked·indeterminate 조합은 ' +
    '스캔 대상이 아니다. 상태별 ARIA(예: loading 의 aria-busy)는 컴포넌트 단위 테스트가 맡는다.',
  '키보드 조작 경로':
    '초점 순서·roving tabindex·Escape 닫힘은 정적 DOM 스캔으로 판정할 수 없다. keyboardContract 의 몫이다.',
  '접근 가능한 이름의 품질':
    'axe 는 이름의 존재만 본다. aria-label="a" 도 통과한다. 문구가 용도를 설명하는지는 사람이 판단한다.',
  '소비자가 이름을 주는 컨트롤':
    'Checkbox·Radio·Switch·IconButton 은 스스로 이름을 만들 수 없어 케이스에서 aria-label 을 넣어 준다. ' +
    '즉 "소비자가 이름을 줬을 때 나머지가 옳다"까지만 검증한 것이고, 소비자가 빠뜨린 경우는 ' +
    'IconButton 자기 검사 한 건으로만 실증했다.',
}

/* ─── 스모크 케이스 ────────────────────────────────────────────────────────── */

interface SmokeCase {
  /** 케이스 이름. 기대값 목록의 키이기도 하다. */
  name: string
  element: ReactElement
  /**
   * Radix 포털로 `document.body` 직속에 렌더되는 콘텐츠까지 보려면 컨테이너가
   * 아니라 body 를 스캔해야 한다. 컨테이너만 스캔하면 열린 콘텐츠를 **한 글자도
   * 보지 않고** 통과한다 (아래 자기 검사에서 이 차이를 실증한다).
   */
  scanBody?: true
  /**
   * 스캔 직전 DOM 에 반드시 존재해야 하는 셀렉터.
   *
   * 열려야 콘텐츠가 나오는 컴포넌트를 닫힌 채 스캔하고 "통과"라고 적는 것을 막는다.
   */
  mustContain?: string
}

const CASES: SmokeCase[] = [
  {
    name: 'Button',
    element: <Button iconLeading={<Icon name="add" />}>저장</Button>,
  },
  {
    name: 'ButtonEmphasized',
    element: <ButtonEmphasized color="purple">업그레이드</ButtonEmphasized>,
  },
  {
    name: 'ButtonError',
    element: <ButtonError hierarchy="primary">삭제</ButtonError>,
  },
  {
    // 시각적 라벨이 없는 컨트롤. 이름은 소비자가 aria-label 로 준다.
    // 주지 않은 경우가 실제로 위반으로 잡히는지는 아래 자기 검사에서 확인한다.
    name: 'IconButton (aria-label 있음)',
    element: <IconButton icon={<Icon name="settings" />} aria-label="설정 열기" />,
  },
  {
    name: 'TextButton',
    element: <TextButton iconTrailing={<Icon name="arrow_forward" />}>더 보기</TextButton>,
  },
  {
    name: 'BadgeLabel',
    element: <BadgeLabel color="blue">신규</BadgeLabel>,
  },
  {
    name: 'BadgeDot',
    element: <BadgeDot color="red" />,
  },
  {
    name: 'ChipUniversal',
    element: <ChipUniversal iconLeading={<Icon name="filter_list" />}>필터</ChipUniversal>,
  },
  {
    name: 'ChipBadgeLikeUniversal',
    element: <ChipBadgeLikeUniversal onClose={() => {}}>태그</ChipBadgeLikeUniversal>,
  },
  {
    name: 'ChipBadgeLikeEmphasized',
    element: (
      <ChipBadgeLikeEmphasized color="blue" onClose={() => {}}>
        태그
      </ChipBadgeLikeEmphasized>
    ),
  },
  {
    name: 'Checkbox',
    element: <Checkbox aria-label="이용 약관에 동의" />,
  },
  {
    name: 'RadioGroup + Radio',
    element: (
      <RadioGroup defaultValue="monthly" aria-label="결제 주기">
        <Radio value="monthly" aria-label="월간 결제" />
        <Radio value="yearly" aria-label="연간 결제" />
      </RadioGroup>
    ),
  },
  {
    name: 'Switch',
    element: <Switch aria-label="알림 받기" />,
  },
  {
    name: 'SegmentBar',
    element: (
      <SegmentBar defaultValue="daily">
        <SegmentBar.Item value="daily" iconLeading={<Icon name="today" />}>
          일간
        </SegmentBar.Item>
        <SegmentBar.Item value="weekly">주간</SegmentBar.Item>
      </SegmentBar>
    ),
  },
  {
    name: 'Tab (compound)',
    element: (
      <Tab defaultValue="overview">
        <Tab.List>
          <Tab.Item value="overview">개요</Tab.Item>
          <Tab.Item value="detail" badgeDot>
            상세
          </Tab.Item>
        </Tab.List>
        <Tab.Panel value="overview">개요 내용</Tab.Panel>
        <Tab.Panel value="detail">상세 내용</Tab.Panel>
      </Tab>
    ),
    // Radix 는 활성 패널만 마운트한다. 패널이 하나도 없다면 탭 구조가 깨진 것이다.
    mustContain: '[role="tabpanel"]',
  },
  {
    name: 'NavVertical',
    element: (
      <NavVertical defaultValue="home">
        <NavVertical.Group label="워크스페이스">
          <NavVertical.Item value="home" iconLeading={<Icon name="home" />}>
            홈
          </NavVertical.Item>
          <NavVertical.Item value="reports" badgeDot>
            리포트
          </NavVertical.Item>
        </NavVertical.Group>
      </NavVertical>
    ),
    mustContain: '[data-nav-vertical-item]',
  },
  {
    // 접힐 수 있는 그룹은 **펼친 상태**로 본다. 접힌 채 스캔하면 항목을 보지 못한다.
    name: 'NavVertical (collapsible 그룹 펼침)',
    element: (
      <NavVertical defaultValue="home">
        <NavVertical.Group label="워크스페이스" collapsible defaultOpen>
          <NavVertical.Item value="home">홈</NavVertical.Item>
        </NavVertical.Group>
      </NavVertical>
    ),
    mustContain: '[data-nav-vertical-item]',
  },
  {
    name: 'Tooltip (열린 상태)',
    element: (
      <Tooltip.Provider>
        <Tooltip defaultOpen>
          <Tooltip.Trigger>
            <Button>도움말</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>변경 사항은 자동 저장된다</Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
    ),
    scanBody: true,
    mustContain: '[role="tooltip"]',
  },
  {
    name: 'Callout (열린 상태)',
    element: (
      <Callout defaultOpen>
        <Callout.Anchor>
          <Button>안내 열기</Button>
        </Callout.Anchor>
        <Callout.Content>
          <Callout.Text>새 기능이 추가되었다</Callout.Text>
          <Callout.Close aria-label="안내 닫기" />
          <Callout.Action closeOnClick>자세히</Callout.Action>
        </Callout.Content>
      </Callout>
    ),
    scanBody: true,
    mustContain: '[role="dialog"]',
  },
  {
    name: 'SkeletonBlock',
    element: <SkeletonBlock width={200} height={16} />,
  },
]

/** 부채와 axe 한계를 합쳐 이 케이스의 기대값을 만든다. 둘 다 없으면 빈 배열. */
function expectedFor(name: string): string[] {
  return [
    ...(KNOWN_A11Y_DEBT[name]?.violations ?? []),
    ...(AXE_RULE_LIMITATIONS[name]?.violations ?? []),
  ].sort()
}

describe('접근성 스모크 — 대표 props 렌더', () => {
  for (const smokeCase of CASES) {
    it(`${smokeCase.name} 의 axe 결과가 기대값과 같다`, async () => {
      const { container } = render(smokeCase.element)

      if (smokeCase.mustContain) {
        // 스캔 대상이 실제로 DOM 에 있는지 먼저 확인한다. 빈 DOM 스캔은 언제나 통과한다.
        expect(
          document.querySelectorAll(smokeCase.mustContain).length,
          `${smokeCase.mustContain} 가 DOM 에 없다 — 닫힌/빈 상태를 스캔하고 있다`,
        ).toBeGreaterThan(0)
      }

      const target = smokeCase.scanBody ? document.body : container
      expect(await scanA11y(target)).toEqual(expectedFor(smokeCase.name))
    })
  }
})

/* ─── 스캐너 자기 검사 — 결함을 주입해 잡히는지 본다 ──────────────────────── */

describe('스캐너 자기 검사', () => {
  it('존재하지 않는 id 를 가리키는 aria-describedby 를 incomplete 로 잡아낸다', async () => {
    // axe 는 이것을 violation 이 아니라 **incomplete** 로 분류한다 — 참조 대상이
    // 나중에 생길 수도 있다고 보기 때문이다. violations 만 보는 스캐너는 여기서
    // 조용히 통과하고, 스크린리더는 그 설명을 영영 읽지 못한다.
    // 이 케이스가 a11y.ts 의 "incomplete 도 위반으로 센다"가 살아 있다는 증거다.
    const { container } = render(<Button aria-describedby="존재하지-않는-설명">저장</Button>)
    expect(await scanA11y(container)).toEqual(['aria-valid-attr-value[incomplete]'])
  })

  it('접근 가능한 이름이 없는 IconButton 을 위반으로 잡아낸다', async () => {
    // aria-label 을 타입이 **요구**하지만 타입은 값의 존재만 강제한다.
    // 빈 문자열은 컴파일을 통과하고 화면에서는 이름 없는 버튼이 된다.
    // 아이콘 글리프는 aria-hidden 이라 이름에 기여하지 않는다.
    const { container } = render(<IconButton icon={<Icon name="settings" />} aria-label="" />)
    expect(await scanA11y(container)).toEqual(['button-name[critical]'])
  })

  it('disableRules 로 끄면 그 위반이 사라진다 — 그래서 함부로 쓰면 안 된다', async () => {
    const { container } = render(<IconButton icon={<Icon name="settings" />} aria-label="" />)
    expect(await scanA11y(container, { disableRules: ['button-name'] })).toEqual([])
  })

  it('컨테이너 스캔은 포털 콘텐츠를 보지 못하고 body 스캔은 본다', async () => {
    // Tooltip·Callout 케이스가 scanBody 를 쓰는 근거. 컨테이너만 스캔했다면
    // 열린 콘텐츠를 한 글자도 보지 않고 통과했을 것이다.
    const { container } = render(<Button>기준 요소</Button>)

    const portal = document.createElement('div')
    portal.appendChild(document.createElement('button')) // 이름 없는 버튼
    document.body.appendChild(portal)

    try {
      expect(await scanA11y(container)).toEqual([])
      expect(await scanA11y(document.body)).toEqual(['button-name[critical]'])
    } finally {
      portal.remove()
    }
  })

  it('닫힌 채 스캔하면 콘텐츠 쪽 결함을 하나도 보지 못한다', async () => {
    // mustContain 단언이 왜 필요한지에 대한 실증. 닫힌 Callout 은 이름 없는
    // dialog 를 아예 렌더하지 않으므로, 그 결함이 결과에서 통째로 사라진다.
    const { container } = render(
      <Callout>
        <Callout.Anchor>
          <Button>안내 열기</Button>
        </Callout.Anchor>
        <Callout.Content>
          <Callout.Text>새 기능이 추가되었다</Callout.Text>
        </Callout.Content>
      </Callout>,
    )
    expect(document.querySelectorAll('[role="dialog"]').length).toBe(0)

    const found = await scanA11y(container)
    // 열린 상태에서는 반드시 나오는 콘텐츠 결함이 여기서는 없다.
    expect(found).not.toContain('aria-dialog-name[serious]')
    // 남는 것은 트리거가 닫힌 상태에서도 유지하는 aria-haspopup/aria-controls 보류뿐이다.
    expect(found).toEqual(['aria-valid-attr-value[incomplete]'])
  })

  it('Callout 의 판정 보류는 트리거의 aria-haspopup 탓이지 콘텐츠 결함이 아니다', async () => {
    // AXE_RULE_LIMITATIONS 항목의 근거. 콘텐츠 서브트리만 떼어 스캔하면 보류가
    // 사라진다 — 보류의 출처가 **트리거 버튼**임이 드러난다.
    // 결과가 빈 배열이라는 사실이 두 가지를 동시에 말한다:
    //   (1) 보류는 콘텐츠 안에서 나온 것이 아니다
    //   (2) dialog 가 이름을 갖고 있다 (aria-labelledby 자동 연결이 살아 있다)
    // (2) 가 깨지면 aria-dialog-name 이 여기서 바로 잡힌다 — 목록 전체 스캔에서는
    // 같은 문자열의 보류에 가려질 수 있으므로 이 케이스가 그 감시를 맡는다.
    render(
      <Callout defaultOpen>
        <Callout.Anchor>
          <Button>안내 열기</Button>
        </Callout.Anchor>
        <Callout.Content>
          <Callout.Text>새 기능이 추가되었다</Callout.Text>
        </Callout.Content>
      </Callout>,
    )
    const content = document.querySelector<HTMLElement>('[role="dialog"]')
    expect(content).not.toBe(null)
    expect(await scanA11y(content as HTMLElement)).toEqual([])
  })
})

/* ─── 목록의 무결성 ────────────────────────────────────────────────────────── */

describe('기대값·미검증 목록', () => {
  it('무엇이 검사되지 않았는지 사유와 함께 남아 있다', () => {
    // 이 단언은 목록을 비우라는 뜻이 아니다. **검증되지 않은 것과 통과한 것을
    // 구분해 두라는 것**이다. 목록이 비어 있지 않은 한 "전부 통과"라고 쓸 수 없다.
    const names = Object.keys(UNMEASURED_A11Y)
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) {
      expect(UNMEASURED_A11Y[name].length, `${name} 에 사유가 없다`).toBeGreaterThan(0)
    }
  })

  it('기대값 목록의 키가 실제 케이스를 가리키고 사유가 붙어 있다', () => {
    // 케이스 이름이 바뀌었는데 목록을 안 고치면, 그 항목은 아무 케이스에도
    // 적용되지 않은 채 남아 부채가 해소된 것처럼 보인다. 그것을 여기서 막는다.
    const caseNames = new Set(CASES.map((c) => c.name))
    const lists = [
      ['KNOWN_A11Y_DEBT', KNOWN_A11Y_DEBT],
      ['AXE_RULE_LIMITATIONS', AXE_RULE_LIMITATIONS],
    ] as const

    for (const [listName, entries] of lists) {
      for (const [caseName, entry] of Object.entries(entries)) {
        expect(caseNames.has(caseName), `${listName}["${caseName}"] 에 대응하는 케이스가 없다`).toBe(true)
        expect(entry.reason.length, `${listName}["${caseName}"] 에 사유가 없다`).toBeGreaterThan(0)
        expect(
          entry.violations.length,
          `${listName}["${caseName}"] 이 비었다면 목록에서 뺀다`,
        ).toBeGreaterThan(0)
      }
    }
  })
})
