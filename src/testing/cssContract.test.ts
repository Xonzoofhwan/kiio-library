/**
 * 빌드된 CSS 계약 테스트 — 입력 장치 규칙.
 *
 * `tailwind.config.js` 의 `future.hoverOnlyWhenSupported` 는 소스 어디에도
 * 흔적을 남기지 않는다. 효력이 사라져도 — 설정이 꺼지거나, arbitrary variant
 * (`group-[[data-state=checked]:hover]:…`) 로 가드를 우회하거나 — 데스크톱
 * 개발 화면에서는 증상이 전혀 없고, 터치 기기에서 탭 뒤 hover 가 눌어붙는
 * 형태로만 드러난다. 그래서 소스가 아니라 **빌드 산출물**을 파싱한다.
 *
 * ## 보장하는 것
 * 선언된 규칙이 어느 at-rule 안에 있는지, 그 **위치**만 본다.
 * 1. `:hover` 를 쓰는 규칙은 포인터 가드 안에 있다.
 * 2. `:active` 를 쓰는 규칙은 포인터 가드 밖에 있다.
 * 3. reduced-motion 블록이 `*` 의 전환 시간을 전역으로 죽이지 않는다.
 *
 * ## 보장하지 않는 것
 * 실제 렌더 결과, 셀렉터 특이성과 적용 순서, DOM 구조, 컴포넌트가 그 클래스를
 * 실제로 붙이는지 여부. 그것은 컴포넌트 테스트의 몫이다. 여기서 통과했다는 말은
 * "규칙이 옳은 자리에 있다"까지이지 "화면이 옳게 보인다"가 아니다.
 *
 * 판정 로직은 순수 함수로 분리해 두었다. 빌드 산출물이 계약을 만족하는 동안에도
 * 판정기 자체가 고장 나면 이 테스트는 조용히 통과하는 껍데기가 되므로,
 * 가짜 CSS 문자열로 판정기가 위반을 잡아내는지 아래에서 함께 검사한다.
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 밖으로 export 하지 않는다.)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import type { AtRule, Node } from 'postcss'
import { beforeAll, describe, expect, it } from 'vitest'

const BUILT_CSS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist/assets')

/**
 * 빌드 산출물 중 가장 최근 CSS 를 읽는다.
 *
 * 파일명에 콘텐츠 해시가 붙어 고정 경로로 집을 수 없고, 이전 빌드 산출물이
 * 남아 있을 수 있으므로 mtime 이 가장 큰 것을 고른다.
 *
 * `dist` 가 없을 때 skip 하지 않고 던지는 이유: 조용히 통과하는 계약 테스트는
 * 아무것도 검사하지 않으면서 검사한 것처럼 보인다.
 */
function readLatestBuiltCss(): string {
  let entries: string[]
  try {
    entries = readdirSync(BUILT_CSS_DIR).filter((name) => name.endsWith('.css'))
  } catch {
    entries = []
  }

  if (entries.length === 0) {
    throw new Error(
      `dist/assets/*.css 가 없다 — \`npm run build\` 를 먼저 실행하라. (찾은 경로: ${BUILT_CSS_DIR})`,
    )
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
 * 이스케이프된 문자를 걷어낸다.
 *
 * Tailwind 는 클래스명의 콜론을 `\:` 로 이스케이프하므로 `.sm\:hover\:bg-x`
 * 같은 **클래스명**도 `:hover` 를 부분 문자열로 갖는다. 걷어내지 않으면
 * 실제 의사 클래스와 구분할 수 없어 오탐이 난다.
 */
function stripEscapes(selector: string): string {
  return selector.replace(/\\./g, '')
}

/** 뒤에 식별자 문자가 붙은 다른 의사 클래스까지 잡지 않도록 경계를 둔다. */
const PSEUDO_PATTERN = {
  hover: /:hover(?![\w-])/,
  active: /:active(?![\w-])/,
} as const

function hasPseudo(selector: string, pseudo: keyof typeof PSEUDO_PATTERN): boolean {
  return PSEUDO_PATTERN[pseudo].test(stripEscapes(selector))
}

/**
 * `:not(…)` 안의 내용을 걷어낸다. 괄호 깊이를 세어 중첩(`:not(:is(a, b))`)을 견딘다.
 */
function stripNegations(selector: string): string {
  let out = ''
  let i = 0
  while (i < selector.length) {
    if (!selector.startsWith(':not(', i)) {
      out += selector[i]
      i += 1
      continue
    }
    let depth = 0
    let j = i + ':not'.length
    for (; j < selector.length; j += 1) {
      if (selector[j] === '(') depth += 1
      else if (selector[j] === ')') {
        depth -= 1
        if (depth === 0) {
          j += 1
          break
        }
      }
    }
    i = j
  }
  return out
}

/**
 * 부정(`:not()`)을 걷어내고 **양성으로** 쓰인 의사 클래스만 본다.
 *
 * **두 계약이 `:not()` 을 다르게 다루는 이유가 여기 있다.**
 * - `:not(:hover)` 는 hover 의 **부재**에 의존한다. 터치에서 hover 가 들러붙으면
 *   조건이 영영 거짓이 되어 규칙이 안 걸리므로, 이것도 hover 의존이고 계약 1의
 *   대상이다 → 계약 1은 `hasPseudo` 를 그대로 쓴다.
 * - `:not(:active)` 는 눌림 스타일이 **아니라 그 부정**이다. 가드 안에 있어도
 *   "눌림 피드백이 fine pointer 에만 걸린다"는 문제가 생기지 않는다
 *   → 계약 2는 이 함수를 쓴다.
 */
function hasPositivePseudo(selector: string, pseudo: keyof typeof PSEUDO_PATTERN): boolean {
  return PSEUDO_PATTERN[pseudo].test(stripNegations(stripEscapes(selector)))
}

/** 미니파이 결과는 `(hover:hover)and (pointer:fine)` 처럼 공백이 사라지므로 유연하게 본다. */
function isHoverGuardParams(params: string): boolean {
  return /\(\s*hover\s*:\s*hover\s*\)/.test(params) && /\(\s*pointer\s*:\s*fine\s*\)/.test(params)
}

/** at-rule 은 중첩될 수 있으므로 부모 체인을 끝까지 올라간다. */
function isInsideHoverGuard(node: Node): boolean {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type !== 'atrule') continue
    const atRule = parent as AtRule
    if (atRule.name === 'media' && isHoverGuardParams(atRule.params)) return true
  }
  return false
}

/** 계약 1 위반: 포인터 가드 밖에서 `:hover` 를 쓰는 규칙. */
function findUnguardedHoverSelectors(css: string): string[] {
  const violations: string[] = []
  postcss.parse(css).walkRules((rule) => {
    if (hasPseudo(rule.selector, 'hover') && !isInsideHoverGuard(rule)) {
      violations.push(rule.selector)
    }
  })
  return violations
}

/** 계약 2 위반: 포인터 가드 안에 갇힌 `:active` 규칙. 부정(`:not(:active)`)은 대상이 아니다. */
function findGuardedActiveSelectors(css: string): string[] {
  const violations: string[] = []
  postcss.parse(css).walkRules((rule) => {
    if (hasPositivePseudo(rule.selector, 'active') && isInsideHoverGuard(rule)) {
      violations.push(rule.selector)
    }
  })
  return violations
}

/** `*`, `*::before`, `*:after` 처럼 전체 요소를 겨냥하는 셀렉터인가. */
function isUniversalSelector(part: string): boolean {
  return /^\*(::?[\w-]+)*$/.test(part.trim())
}

/**
 * 계약 3 위반: reduced-motion 블록에서 `*` 의 전환 시간을 끄는 선언.
 *
 * `transition` 단축 속성도 duration 을 함께 덮으므로 같이 본다.
 */
function findGlobalTransitionKillsUnderReducedMotion(css: string): string[] {
  const violations: string[] = []
  postcss.parse(css).walkAtRules('media', (atRule) => {
    if (!/prefers-reduced-motion\s*:\s*reduce/.test(atRule.params)) return
    atRule.walkRules((rule) => {
      if (!rule.selector.split(',').some(isUniversalSelector)) return
      rule.walkDecls(/^transition(-duration)?$/, (decl) => {
        violations.push(`${rule.selector} { ${decl.prop}: ${decl.value} }`)
      })
    })
  })
  return violations
}

/** 실패 메시지에 위반 셀렉터를 전부 싣는다. 개수만 알면 고칠 수가 없다. */
function formatViolations(title: string, violations: string[]): string {
  if (violations.length === 0) return ''
  return [`${title} (${violations.length}건):`, ...violations.map((v) => `  - ${v}`)].join('\n')
}

describe('빌드 CSS 계약 — 입력 장치', () => {
  let css = ''

  beforeAll(() => {
    css = readLatestBuiltCss()
  })

  it(':hover 를 쓰는 모든 규칙이 (hover: hover) and (pointer: fine) 안에 있다', () => {
    expect(formatViolations('포인터 가드 밖에서 :hover 를 쓰는 규칙', findUnguardedHoverSelectors(css))).toBe('')
  })

  // `:hover` 와 `:active` 가 한 규칙에 묶여 있으면(선언이 같은 두 규칙을
  // 미니파이어가 합칠 때 생긴다) 예외로 빼지 않는다. 한 규칙은 가드 안이거나
  // 밖이거나 둘 중 하나이므로 묶인 규칙은 위아래 단언 중 **정확히 하나**에
  // 걸리고, 그게 맞는 신호다 — 두 상태를 한 규칙에 묶지 말고 나누라는 뜻이다.
  it(':active 를 쓰는 규칙은 포인터 가드 밖에 있다', () => {
    expect(formatViolations('포인터 가드 안에 갇힌 :active 규칙', findGuardedActiveSelectors(css))).toBe('')
  })

  it('reduced-motion 블록이 * 의 전환 시간을 죽이지 않는다', () => {
    expect(
      formatViolations(
        'reduced-motion 에서 전역 전환을 끄는 선언 (색·투명도 전환은 유지해야 한다)',
        findGlobalTransitionKillsUnderReducedMotion(css),
      ),
    ).toBe('')
  })
})

describe('판정 로직', () => {
  describe('가드 밖 :hover 탐지', () => {
    it('가드 밖 규칙을 잡아낸다', () => {
      const css = `
        .btn:hover { color: red }
        @media (hover: hover) and (pointer: fine) { .ok:hover { color: red } }
      `
      expect(findUnguardedHoverSelectors(css)).toEqual(['.btn:hover'])
    })

    it('미니파이로 공백이 사라진 가드도 가드로 인정한다', () => {
      const css = '@media (hover:hover)and (pointer:fine){.ok:hover{color:red}}'
      expect(findUnguardedHoverSelectors(css)).toEqual([])
    })

    it('가드가 중첩 at-rule 바깥에 있어도 부모 체인을 끝까지 올라가 찾는다', () => {
      const css = `
        @media (hover: hover) and (pointer: fine) {
          @supports (display: grid) { .deep:hover { color: red } }
        }
      `
      expect(findUnguardedHoverSelectors(css)).toEqual([])
    })

    it('pointer 조건이 빠진 반쪽 가드는 가드로 치지 않는다', () => {
      const css = '@media (hover: hover) { .half:hover { color: red } }'
      expect(findUnguardedHoverSelectors(css)).toEqual(['.half:hover'])
    })

    it(':not(:hover) 처럼 부정으로 쓴 것도 hover 의존이므로 잡는다', () => {
      const css = '.knob:not(:hover):not(:active) { width: 1px }'
      expect(findUnguardedHoverSelectors(css)).toEqual(['.knob:not(:hover):not(:active)'])
    })

    it('이스케이프된 클래스명(.sm\\:hover\\:bg-x)은 오탐하지 않는다', () => {
      const css = '.sm\\:hover\\:bg-x { color: red }'
      expect(findUnguardedHoverSelectors(css)).toEqual([])
    })
  })

  describe('가드 안 :active 탐지', () => {
    it('가드 안에 갇힌 :active 를 잡아낸다', () => {
      const css = `
        .btn:active { color: red }
        @media (hover: hover) and (pointer: fine) { .caged:active { color: red } }
      `
      expect(findGuardedActiveSelectors(css)).toEqual(['.caged:active'])
    })

    it('부정으로 쓴 :not(:active) 는 눌림 스타일이 아니므로 잡지 않는다', () => {
      // Switch 의 ON-idle knob 이 이 형태다 — 가드 안에서 "눌리지 않았을 때"를
      // 가리키므로 눌림 피드백이 fine pointer 에 갇히는 문제와 무관하다.
      const css =
        '@media (hover: hover) and (pointer: fine) { .knob:not(:hover):not(:active) { width: 1px } }'
      expect(findGuardedActiveSelectors(css)).toEqual([])
    })

    it('중첩 괄호가 든 :not() 도 끝까지 걷어낸다', () => {
      const css =
        '@media (hover: hover) and (pointer: fine) { .x:not(:is(:active, :focus)) { width: 1px } }'
      expect(findGuardedActiveSelectors(css)).toEqual([])
    })

    it('부정과 양성이 함께 있으면 양성 쪽을 잡는다', () => {
      const css =
        '@media (hover: hover) and (pointer: fine) { .y:not(:active):active { width: 1px } }'
      expect(findGuardedActiveSelectors(css)).toEqual(['.y:not(:active):active'])
    })
  })

  describe('reduced-motion 전역 전환 차단 탐지', () => {
    it('* 의 transition-duration 선언을 잡아낸다', () => {
      const css = `
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition-duration: 0.01ms !important }
        }
      `
      expect(findGlobalTransitionKillsUnderReducedMotion(css)).toHaveLength(1)
    })

    it('animation 만 끄고 개별 유틸리티만 손대는 블록은 통과시킨다', () => {
      const css = `
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important }
          .motion-reduce\\:transition-none { transition-property: none }
        }
      `
      expect(findGlobalTransitionKillsUnderReducedMotion(css)).toEqual([])
    })
  })

  describe('실패 메시지', () => {
    it('위반이 없으면 빈 문자열이다', () => {
      expect(formatViolations('제목', [])).toBe('')
    })

    it('위반 항목을 전부 싣는다', () => {
      expect(formatViolations('제목', ['.a:hover', '.b:hover'])).toBe(
        '제목 (2건):\n  - .a:hover\n  - .b:hover',
      )
    })
  })
})
