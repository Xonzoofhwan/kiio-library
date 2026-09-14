/**
 * 버튼 계열 공통 계약 — 같은 구조를 복제한 7종을 **한 배열로** 돌린다.
 *
 * `Button.test.tsx` 는 Button 하나만 렌더한다. 나머지 6종(ButtonEmphasized · ButtonError ·
 * IconButton · IconButtonEmphasized · IconButtonError · TextButton)은 "같은 패턴을 공유한다"는
 * 사실만 근거였고 실제로 렌더해 본 적이 없었다. 2026-09-13 검토에서 그 공유 패턴 자체에
 * 결함이 드러났다(`docs/STABILIZATION_PLAN.md` §1) — 이 파일은 그것을 7종 전부에 대해 잠근다.
 *
 * ## 보장하는 것
 * 1. inert 표면 — `loading` 은 `aria-busy` + `aria-disabled` 만 세우고 네이티브 `disabled` 는
 *    켜지 않는다(포커스 유지). `disabled` 는 네이티브 `disabled` 를 켠다. 스피너는 장식이다.
 * 2. 가드 순서 — inert 면 소비자 `onClick` · `asChild` 자식의 `onClick` · 조상의 `onClick`
 *    어느 것도 돌지 않고 기본 동작(링크 이동·폼 제출)이 막힌다. Radix Slot 은 같은 이름의
 *    핸들러를 **자식 → Slot** 순서로 합성하므로 bubble 단계의 `onClick` 가드는 원리적으로
 *    자식보다 먼저 돌 수 없다. 가드는 캡처 단계(`onClickCapture`)에 있어야 한다.
 * 3. `tabIndex` — 소비자 값이 보존된다. 컴포넌트가 덮는 것은 `asChild` + `disabled` 한 경우다.
 * 4. 접근 가능한 이름 — `loading` 이어도 이름이 남는다. 콘텐츠를 `visibility:hidden` 으로
 *    감추면 접근성 트리에서 빠져 이름이 빈 문자열이 된다. **빌드된 CSS 의 실제 규칙**을
 *    주입해 잰다 — jsdom 은 Tailwind 를 로드하지 않으므로 주입 없이는 클래스가 문자열일 뿐이다.
 * 5. `ref` — 루트 요소를 받는다. `asChild` 면 소비자 요소다.
 *
 * ## 보장하지 않는 것
 * 시각 결과. `opacity: 0` 이 실제로 안 보이는지, 스피너가 중앙에 오는지는 브라우저의 몫이다.
 * 색·크기·radius 는 각 컴포넌트의 몫이다(`Button.test.tsx` 가 Button 에 대해 본다).
 * `pointer-events-none` 의 효력은 여기서도 재지 않는다 — 그 규칙은 주입하지 않으므로
 * 클릭이 요소에 닿고, 관찰되는 차단은 전부 가드의 것이다.
 *
 * 판정기(이름 계산 · CSS 주입)가 고장 나면 조용히 통과하는 껍데기가 되므로, 아래에서
 * `visibility:hidden` 을 주입한 대조군이 실제로 이름을 잃는 것을 함께 확인한다.
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 밖으로 export 하지 않는다.)
 */
import { createRef, type MouseEventHandler, type ReactElement, type ReactNode, type Ref } from 'react'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { computeAccessibleName } from 'dom-accessibility-api'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  Button,
  ButtonEmphasized,
  ButtonError,
  IconButton,
  IconButtonEmphasized,
  IconButtonError,
} from '@/components/Button'
import { TextButton } from '@/components/TextButton'

/* ─── 빌드 CSS 주입 ────────────────────────────────────────────────────────── */

const BUILT_CSS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist/assets')

/**
 * 빌드 산출물 중 가장 최근 CSS 를 읽는다. `dist` 가 없으면 skip 하지 않고 던진다 —
 * 조용히 통과하는 계약 테스트는 아무것도 검사하지 않으면서 검사한 것처럼 보인다.
 * (`cssContract.test.ts` 와 같은 규칙. `npm run check` 는 build 뒤에 test 를 돈다.)
 */
function readLatestBuiltCss(): string {
  let entries: string[]
  try {
    entries = readdirSync(BUILT_CSS_DIR).filter((name) => name.endsWith('.css'))
  } catch {
    entries = []
  }
  if (entries.length === 0) {
    throw new Error(`dist/assets/*.css 가 없다 — \`npm run build\` 를 먼저 실행하라. (찾은 경로: ${BUILT_CSS_DIR})`)
  }
  const newest = entries
    .map((name) => {
      const path = join(BUILT_CSS_DIR, name)
      return { path, mtimeMs: statSync(path).mtimeMs }
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]
  return readFileSync(newest.path, 'utf8')
}

/**
 * 빌드 CSS 에서 `.{className}` 을 셀렉터로 갖는 규칙을 그대로 뽑는다.
 *
 * 규칙을 손으로 적지 않는 이유: "Tailwind 가 이런 규칙을 낸다"는 가정이 검사에 섞이면
 * 그 가정이 틀렸을 때 검사가 먼저 틀린다. 실제 산출물을 쓰면 가정이 사라진다.
 * 미니파이어가 선언이 같은 규칙을 `.a,.b{…}` 로 합칠 수 있어 셀렉터 목록으로 본다.
 */
function extractRule(css: string, className: string): string {
  const wanted = `.${className}`
  const found: string[] = []
  postcss.parse(css).walkRules((rule) => {
    const selectors = rule.selector.split(',').map((s) => s.trim())
    if (selectors.includes(wanted)) {
      found.push(`${wanted}{${rule.nodes.map((node) => node.toString()).join(';')}}`)
    }
  })
  if (found.length === 0) {
    throw new Error(
      `빌드 CSS 에 ${wanted} 규칙이 없다 — 컴포넌트가 그 클래스를 쓰지 않으면 Tailwind 가 생성하지 않는다.`,
    )
  }
  return found.join('\n')
}

let injectedStyle: HTMLStyleElement | null = null

beforeAll(() => {
  const css = readLatestBuiltCss()
  injectedStyle = document.createElement('style')
  // 실제 빌드 규칙(.opacity-0) + 대조군용 Tailwind 정의(.invisible).
  // 후자를 빌드에서 뽑지 않는 이유: 컴포넌트가 더는 쓰지 않으면 빌드에 없다. 대조군의
  // 목적은 "visibility:hidden 이 이름을 지운다"는 판정기 검증이라 정의를 직접 적어도 된다.
  injectedStyle.textContent = `${extractRule(css, 'opacity-0')}\n.invisible{visibility:hidden}`
  document.head.appendChild(injectedStyle)
})

afterAll(() => {
  injectedStyle?.remove()
  injectedStyle = null
})

/* ─── 7종 ──────────────────────────────────────────────────────────────────── */

const LABEL = '저장'

interface FamilyProps {
  disabled?: boolean
  loading?: boolean
  asChild?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  tabIndex?: number
  ref?: Ref<HTMLButtonElement>
  /** `asChild` 일 때 루트가 될 소비자 요소. 텍스트 버튼은 비우면 LABEL 을 콘텐츠로 쓴다. */
  children?: ReactNode
}

interface FamilyMember {
  name: string
  render: (props: FamilyProps) => ReactElement
}

const FAMILY: FamilyMember[] = [
  { name: 'Button', render: ({ children, ...p }) => <Button {...p}>{children ?? LABEL}</Button> },
  {
    name: 'ButtonEmphasized',
    render: ({ children, ...p }) => <ButtonEmphasized {...p}>{children ?? LABEL}</ButtonEmphasized>,
  },
  { name: 'ButtonError', render: ({ children, ...p }) => <ButtonError {...p}>{children ?? LABEL}</ButtonError> },
  { name: 'TextButton', render: ({ children, ...p }) => <TextButton {...p}>{children ?? LABEL}</TextButton> },
  // 아이콘 버튼은 보이는 텍스트가 없어 이름을 aria-label 로 준다. children 은 asChild 에서만 쓰인다.
  {
    name: 'IconButton',
    render: ({ children, ...p }) => (
      <IconButton {...p} icon={<i />} aria-label={LABEL}>
        {children}
      </IconButton>
    ),
  },
  {
    name: 'IconButtonEmphasized',
    render: ({ children, ...p }) => (
      <IconButtonEmphasized {...p} icon={<i />} aria-label={LABEL}>
        {children}
      </IconButtonEmphasized>
    ),
  },
  {
    name: 'IconButtonError',
    render: ({ children, ...p }) => (
      <IconButtonError {...p} icon={<i />} aria-label={LABEL}>
        {children}
      </IconButtonError>
    ),
  },
]

/** 루트를 집는다. 비-asChild 는 button, asChild 는 소비자가 준 a 다. 없으면 던진다. */
function mount(member: FamilyMember, props: FamilyProps = {}) {
  const { container } = render(member.render(props))
  const root = container.querySelector<HTMLElement>('button, a')
  if (!root) throw new Error(`${member.name}: 루트 요소(button 또는 a)가 렌더되지 않았다`)
  return { root, container }
}

/** asChild 용 소비자 요소. 링크의 기본 동작(이동)이 막히는지 보기 위해 href 를 준다. */
const link = (onClick?: MouseEventHandler<HTMLAnchorElement>) => (
  <a href="/docs" onClick={onClick}>
    {LABEL}
  </a>
)

/* ─── 계약 ─────────────────────────────────────────────────────────────────── */

describe.each(FAMILY)('$name — 버튼 계열 공통 계약', (member) => {
  describe('inert 표면', () => {
    it('loading 은 aria-busy 와 aria-disabled 를 세우고 네이티브 disabled 는 켜지 않는다', () => {
      const { root } = mount(member, { loading: true })
      expect(root.getAttribute('aria-busy')).toBe('true')
      expect(root.getAttribute('aria-disabled')).toBe('true')
      // 눌러 놓은 버튼이 로딩에 들어가는 순간 포커스가 body 로 떨어지면 안 된다.
      expect(root.hasAttribute('disabled')).toBe(false)
    })

    it('disabled 는 네이티브 disabled 를 켜고 aria-busy 는 세우지 않는다', () => {
      const { root } = mount(member, { disabled: true })
      expect(root.hasAttribute('disabled')).toBe(true)
      expect(root.getAttribute('aria-disabled')).toBe('true')
      expect(root.getAttribute('aria-busy')).toBeNull()
    })

    it('loading 의 스피너는 장식이다 — aria-hidden 래퍼 안에 있다', () => {
      const { root } = mount(member, { loading: true })
      const svg = root.querySelector('svg')
      expect(svg).not.toBeNull()
      // 스피너 SVG 는 <style> 텍스트를 품는다. 보조기술이 그것을 읽지 않도록 래퍼가 감춘다.
      expect(svg!.closest('[aria-hidden="true"]')).not.toBeNull()
    })
  })

  describe('가드 순서', () => {
    it('loading 이면 클릭도 Enter 도 소비자 onClick 에 닿지 않는다', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const { root } = mount(member, { loading: true, onClick })

      await user.click(root)
      root.focus()
      await user.keyboard('{Enter}')
      expect(onClick).not.toHaveBeenCalled()
    })

    it('inert 가 아니면 소비자 onClick 이 정확히 한 번 불린다 — 가드가 항상 막는 것이 아니다', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const { root } = mount(member, { onClick })

      await user.click(root)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('asChild + loading: 자식 onClick 이 마우스에도 Enter 에도 불리지 않고 기본 동작이 막힌다', async () => {
      // Radix Slot 은 자식 핸들러를 먼저 부른다. bubble 단계의 가드는 이 케이스를 통과시킬 수 없다.
      const user = userEvent.setup()
      const childClick = vi.fn()
      const onClick = vi.fn()
      const { root } = mount(member, { asChild: true, loading: true, onClick, children: link(childClick) })
      expect(root.tagName).toBe('A')

      await user.click(root)
      root.focus()
      await user.keyboard('{Enter}')
      expect(childClick).not.toHaveBeenCalled()
      expect(onClick).not.toHaveBeenCalled()

      // 링크의 기본 동작은 이동이다. user-event 는 defaultPrevented 를 돌려주지 않으므로
      // 네이티브 이벤트를 직접 던져 읽는다.
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      root.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    })

    it('asChild + disabled: 자식 onClick 이 불리지 않는다', async () => {
      const user = userEvent.setup()
      const childClick = vi.fn()
      const { root } = mount(member, { asChild: true, disabled: true, children: link(childClick) })

      await user.click(root)
      expect(childClick).not.toHaveBeenCalled()
    })

    it('asChild 가 inert 가 아니면 자식 onClick 과 소비자 onClick 이 각각 한 번 불린다', async () => {
      const user = userEvent.setup()
      const childClick = vi.fn()
      const onClick = vi.fn()
      const { root } = mount(member, { asChild: true, onClick, children: link(childClick) })

      await user.click(root)
      expect(childClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('inert 클릭은 조상으로 전파되지 않는다', async () => {
      // 네이티브 disabled 는 click 을 아예 발생시키지 않는다. loading 도 그 동작에 맞춘다 —
      // 끊지 않으면 카드·행 같은 조상이 대신 반응한다.
      const user = userEvent.setup()
      const onAncestorClick = vi.fn()
      const { container } = render(<div onClick={onAncestorClick}>{member.render({ loading: true })}</div>)
      const root = container.querySelector<HTMLElement>('button, a')!

      await user.click(root)
      expect(onAncestorClick).not.toHaveBeenCalled()
    })
  })

  describe('tabIndex', () => {
    it('소비자 tabIndex 를 보존한다', () => {
      // 복합 위젯(roving tabindex)이 포커스 순서를 관리할 때 컴포넌트가 그 값을 지우면 안 된다.
      const { root } = mount(member, { tabIndex: -1 })
      expect(root.getAttribute('tabindex')).toBe('-1')
    })

    it('asChild 도 소비자 tabIndex 를 보존한다', () => {
      const { root } = mount(member, { asChild: true, tabIndex: -1, children: link() })
      expect(root.getAttribute('tabindex')).toBe('-1')
    })

    it('asChild + disabled 에서만 tabIndex 를 -1 로 덮는다', () => {
      // 네이티브 disabled 를 붙일 수 없는 요소(a·div)를 tab 순서에서 빼는 유일한 수단이다.
      const { root } = mount(member, { asChild: true, disabled: true, tabIndex: 0, children: link() })
      expect(root.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('접근 가능한 이름', () => {
    it('loading 이어도 이름이 남는다', () => {
      // 빌드 CSS 의 .opacity-0 규칙이 주입된 상태다. 콘텐츠를 visibility:hidden 으로 감췄다면
      // 이 단언은 빈 문자열을 받는다 — 아래 "판정기 자기 검사"가 그 대조군이다.
      const { root } = mount(member, { loading: true })
      expect(computeAccessibleName(root)).toBe(LABEL)
    })

    it('평소 이름과 loading 이름이 같다', () => {
      const idle = mount(member).root
      const loading = mount(member, { loading: true }).root
      expect(computeAccessibleName(loading)).toBe(computeAccessibleName(idle))
    })
  })

  describe('ref', () => {
    it('루트 button 요소를 받는다', () => {
      const ref = createRef<HTMLButtonElement>()
      const { root } = mount(member, { ref })
      expect(ref.current).toBe(root)
      expect(ref.current?.tagName).toBe('BUTTON')
    })

    it('asChild 면 소비자 요소를 받는다', () => {
      // 타입은 HTMLButtonElement 지만 실제로는 소비자가 준 요소다 — Radix 와 같은 타협. JSDoc 에 적혀 있다.
      const ref = createRef<HTMLButtonElement>()
      const { root } = mount(member, { asChild: true, ref, children: link() })
      expect(ref.current).toBe(root)
      expect(ref.current?.tagName).toBe('A')
    })
  })
})

/* ─── ref prop 타입 — tsc -b 가 이 파일을 본다 ────────────────────────────── */

describe('ref prop 타입', () => {
  it('7종 모두 ref 를 JSX 속성으로 받는다', () => {
    // 위 계약은 props 객체를 스프레드하므로 타입에 ref 가 없어도 컴파일된다(스프레드는 초과 속성을
    // 검사하지 않는다). 여기서는 속성으로 직접 써서 타입 계약을 건다 — 2026-09-13 전에는 7종 전부
    // "Property 'ref' does not exist" 였다(런타임은 React 19 라 통과했다).
    const ref = createRef<HTMLButtonElement>()
    render(
      <>
        <Button ref={ref}>{LABEL}</Button>
        <ButtonEmphasized ref={ref}>{LABEL}</ButtonEmphasized>
        <ButtonError ref={ref}>{LABEL}</ButtonError>
        <TextButton ref={ref}>{LABEL}</TextButton>
        <IconButton ref={ref} icon={<i />} aria-label={LABEL} />
        <IconButtonEmphasized ref={ref} icon={<i />} aria-label={LABEL} />
        <IconButtonError ref={ref} icon={<i />} aria-label={LABEL} />
      </>,
    )
    // 같은 ref 를 일곱 번 넘겼으니 마지막 요소가 남는다. 컴파일이 됐다는 사실이 이 케이스의 목적이다.
    expect(ref.current?.tagName).toBe('BUTTON')
  })
})

/* ─── 판정기 자기 검사 — 대조군으로 판정기가 살아 있음을 보인다 ───────────── */

describe('판정기 자기 검사', () => {
  it('주입된 .opacity-0 규칙이 실제로 opacity 를 0 으로 만든다', () => {
    const { container } = render(
      <button type="button">
        <span className="opacity-0">{LABEL}</span>
      </button>,
    )
    const span = container.querySelector('span')!
    expect(getComputedStyle(span).opacity).toBe('0')
  })

  it('opacity:0 은 접근 가능한 이름을 남긴다', () => {
    const { container } = render(
      <button type="button">
        <span className="opacity-0">{LABEL}</span>
      </button>,
    )
    expect(computeAccessibleName(container.querySelector('button')!)).toBe(LABEL)
  })

  it('visibility:hidden 대조군은 접근 가능한 이름을 잃는다', () => {
    // 이것이 2026-09-13 이전 Button 계열 4종(텍스트 버튼)의 loading 상태였다.
    const { container } = render(
      <button type="button">
        <span className="invisible">{LABEL}</span>
      </button>,
    )
    const span = container.querySelector('span')!
    expect(getComputedStyle(span).visibility).toBe('hidden')
    expect(computeAccessibleName(container.querySelector('button')!)).toBe('')
  })

  it('7종 전부가 배열에 있다 — 하나가 빠지면 그 컴포넌트는 검사되지 않은 것이다', () => {
    expect(FAMILY.map((m) => m.name)).toEqual([
      'Button',
      'ButtonEmphasized',
      'ButtonError',
      'TextButton',
      'IconButton',
      'IconButtonEmphasized',
      'IconButtonError',
    ])
  })
})
