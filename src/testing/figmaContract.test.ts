/**
 * T8 — Figma ↔ TypeScript ↔ CSS ↔ Tailwind 4자 정합.
 *
 * `tokenContract.test.ts` 의 T1–T7 은 **소스 안의 규칙**(var 무결성·스코프·하드코딩)을 본다.
 * 이 파일은 축이 다르다 — **외부 원본과 코드가 같은가**를 본다.
 *
 * ## 왜 필요한가
 * semantic 토큰이 네 곳에 중복돼 있다: Figma 변수 · `src/tokens/semantic.ts` ·
 * `src/tokens/tokens.css` · `tailwind.config.js`. 2026-09-13 실측에서 **네 곳이 서로 달랐다** —
 * CSS 에만 있는 키 6개, TS 에만 있는 키 2개, Tailwind 에 빠진 키 3개, TS 의 다크 값 5개 오류.
 * 사본끼리 맞추는 것은 정합이 아니므로 **Figma 를 원본으로 못 박고** 나머지 셋이 따라오는지 잰다.
 *
 * ## 보장하는 것
 * 1. 패밀리별 **shade 키 집합**이 Figma 스냅샷과 같다 (TS · CSS · Tailwind 셋 다)
 * 2. **light 값**: CSS 를 primitive 까지 해석한 값 = Figma 값
 * 3. **light 값**: TS = CSS 해석 값
 * 4. **dark 값**: TS = CSS 해석 값 — 다크는 **코드가 소유**하므로 Figma 는 비교 대상이 아니다
 *    (2026-09-13 사용자 확정. `specs/tokens/semantic.figma.json` 의 `_method.darkMode` 참고)
 *
 * ## 보장하지 않는 것
 * - **스냅샷이 최신인가.** 사람이 갱신하는 파일이다. Figma 가 바뀌어도 이 검사는 조용하다 —
 *   갱신 절차는 [FIGMA_TO_CODE.md](../../docs/FIGMA_TO_CODE.md) §C.
 * - **값을 읽지 못한 토큰**(`_unverifiedValues`). 어떤 Figma 컴포넌트도 쓰지 않아 MCP 가 값을
 *   주지 않는다. 키만 대조하고 값은 건너뛴다 — **통과한 것이 아니라 재지 못한 것이다.**
 * - 컴포넌트 토큰(`--comp-*`)이 Figma 변형과 같은가. 그것은 B6 의 몫이다.
 *
 * 판정기가 고장 나면 조용히 통과하는 껍데기가 되므로, 아래에서 색 정규화와 불일치 탐지를
 * 가짜 입력으로 검사한다. (`src/testing/**` 은 라이브러리 표면이 아니므로 export 하지 않는다.)
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import type { Declaration, Rule } from 'postcss'
import { describe, expect, it } from 'vitest'

import { semantic } from '@/tokens/semantic'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const SNAPSHOT = join(REPO_ROOT, 'specs/tokens/semantic.figma.json')
const TOKENS_CSS = join(REPO_ROOT, 'src/tokens/tokens.css')
const TAILWIND_CONFIG = join(REPO_ROOT, 'tailwind.config.js')

/* ─── 스냅샷 ───────────────────────────────────────────────────────────────── */

interface FigmaFamily {
  shades: number[]
  values: Record<string, string>
}
interface FigmaSnapshot {
  families: Record<string, FigmaFamily>
  _unverifiedValues: Record<string, number[]>
}

const figma: FigmaSnapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))

/* ─── 색 정규화 ────────────────────────────────────────────────────────────── */

interface Rgba {
  r: number
  g: number
  b: number
  /** 0–255. `rgba()` 의 소수 알파는 반올림한다. */
  a: number
}

/**
 * `#rrggbb` · `#rrggbbaa` · `rgba(r, g, b, a)` 를 하나의 형태로 옮긴다.
 *
 * 두 표기를 직접 비교할 수 없어서다 — Figma 는 8bit 16진수로, 코드는 소수 알파로 적는다.
 * 파싱할 수 없으면 `null` 을 돌려주고, 호출부가 그것을 **불일치가 아니라 판정 불가**로 다룬다.
 */
export function parseColor(input: string): Rgba | null {
  const text = input.trim().toLowerCase()

  const hex = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(text)
  if (hex) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16))
    return { r, g, b, a: hex[2] === undefined ? 255 : parseInt(hex[2], 16) }
  }

  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(text)
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 255 : Math.round(Number(rgba[4]) * 255),
    }
  }

  return null
}

/**
 * 두 색이 같은가. **알파는 ±1 을 허용한다.**
 *
 * Figma 는 알파를 8bit 로 양자화하고(`0x0a` = 10) 코드는 소수 두 자리로 적는다(`0.04` → 10.2).
 * 반올림 방향이 갈리면 1 이 어긋나는데 그것은 값이 다른 것이 아니라 표기가 다른 것이다.
 * RGB 는 정확히 같아야 한다 — 거기서 1 이 어긋나면 다른 색이다.
 */
export function sameColor(a: Rgba, b: Rgba): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b && Math.abs(a.a - b.a) <= 1
}

const show = (c: Rgba) => `rgba(${c.r},${c.g},${c.b},${c.a}/255)`

/* ─── CSS 파싱 ─────────────────────────────────────────────────────────────── */

const css = readFileSync(TOKENS_CSS, 'utf8')

/** 셀렉터별 커스텀 프로퍼티 맵. 같은 셀렉터가 여러 번 나오면 뒤의 것이 이긴다(캐스케이드). */
function declarationsFor(selector: string): Map<string, string> {
  const out = new Map<string, string>()
  postcss.parse(css).walkRules((rule: Rule) => {
    if (rule.selector.replace(/\s+/g, ' ').trim() !== selector) return
    rule.walkDecls((decl: Declaration) => {
      if (decl.prop.startsWith('--')) out.set(decl.prop, decl.value.trim())
    })
  })
  return out
}

const rootVars = declarationsFor(':root')

/** `var(--x)` 체인을 리터럴까지 되푼다. primitive 는 `:root` 에 있다. */
function resolveValue(value: string, scope: Map<string, string>, depth = 0): string {
  if (depth > 10) return value
  const match = /var\(\s*(--[a-z0-9-]+)\s*\)/.exec(value)
  if (!match) return value
  const replacement = scope.get(match[1]) ?? rootVars.get(match[1])
  if (replacement === undefined) return value
  return resolveValue(value.replace(match[0], replacement), scope, depth + 1)
}

/** 한 테마의 `--semantic-*` 를 `{패밀리-shade: 해석된 값}` 으로. */
function cssSemantic(theme: 'light' | 'dark'): Map<string, string> {
  const scope = declarationsFor(`[data-theme="${theme}"]`)
  const out = new Map<string, string>()
  for (const [prop, value] of scope) {
    if (!prop.startsWith('--semantic-')) continue
    out.set(prop.slice('--semantic-'.length), resolveValue(value, scope))
  }
  return out
}

/* ─── TS 파싱 ──────────────────────────────────────────────────────────────── */

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** `semantic[theme]` 중첩 객체를 `{패밀리-shade: 값}` 으로 편다. */
function tsSemantic(theme: 'light' | 'dark'): Map<string, string> {
  const out = new Map<string, string>()
  const walk = (node: unknown, path: string[]) => {
    if (typeof node === 'string') {
      out.set(path.map(kebab).join('-'), node)
      return
    }
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) walk(value, [...path, key])
  }
  walk(semantic[theme], [])
  return out
}

/* ─── Tailwind 파싱 ────────────────────────────────────────────────────────── */

/**
 * `tailwind.config.js` 가 참조하는 `--semantic-*` **색** 토큰 이름.
 *
 * 설정 파일을 **import 하지 않고 텍스트로 읽는** 이유: 그 파일은 `require('tailwindcss-animate')`
 * 를 쓰는데 vitest 의 ESM 로더에는 `require` 가 없다. 우리가 필요한 것은 참조 이름뿐이다.
 *
 * **색만 본다.** `--semantic-duration-*`·`--semantic-easing-*` 도 semantic 이지만 이 스냅샷은
 * Figma 의 색 변수만 담는다 — 모션은 Figma 에 변수가 없고(Foundation 의 Motion 섹션은 설명뿐)
 * CLAUDE.md 모션 표 ↔ tailwind config 일치를 `docs:check` D4 가 이미 본다. 그래서 여기서
 * 모션까지 대조하면 "Tailwind 에만 있다"는 오탐만 10건 난다. 스냅샷의 패밀리 접두어로
 * 걸러 **경계를 이름이 아니라 스냅샷 자체가 정하게** 한다.
 */
function tailwindSemantic(): Set<string> {
  const text = readFileSync(TAILWIND_CONFIG, 'utf8')
  const families = Object.keys(figma.families)
  const out = new Set<string>()
  for (const match of text.matchAll(/var\(\s*--semantic-([a-z0-9-]+)\s*\)/g)) {
    const key = match[1]
    if (families.some((family) => key.startsWith(`${family}-`))) out.add(key)
  }
  return out
}

/* ─── 판정기 ───────────────────────────────────────────────────────────────── */

/** 스냅샷의 패밀리를 `패밀리-shade` 키 집합으로. */
export function figmaKeys(snapshot: FigmaSnapshot): Set<string> {
  const out = new Set<string>()
  for (const [family, { shades }] of Object.entries(snapshot.families)) {
    for (const shade of shades) out.add(`${family}-${shade}`)
  }
  return out
}

/**
 * 한쪽에만 있는 키를 사람이 읽을 줄로.
 *
 * `pending` 은 "Figma 에 없는데 코드가 아직 쓰는" 것으로 **등록된** 키다. 그 키가 코드에만
 * 있는 것은 이미 아는 사실이므로 보고하지 않는다. 반대로 Figma 에 있는데 코드에 없는 것은
 * pending 여부와 무관하게 보고한다 — 그것은 새로 생긴 누락이다.
 */
export function diffKeys(
  expected: Set<string>,
  actual: Set<string>,
  actualName: string,
  pending: Set<string> = new Set(),
): string[] {
  const out: string[] = []
  for (const key of [...actual].sort()) {
    if (!expected.has(key) && !pending.has(key)) out.push(`${actualName} 에만 있다: --semantic-${key}`)
  }
  for (const key of [...expected].sort()) {
    if (!actual.has(key)) out.push(`${actualName} 에 없다: --semantic-${key}`)
  }
  return out
}

/** 값 불일치를 사람이 읽을 줄로. 파싱 불가는 별도로 보고한다. */
export function diffValues(
  expected: Map<string, string>,
  actual: Map<string, string>,
  label: string,
  skip: Set<string> = new Set(),
): string[] {
  const out: string[] = []
  for (const [key, expectedRaw] of [...expected].sort()) {
    if (skip.has(key)) continue
    const actualRaw = actual.get(key)
    if (actualRaw === undefined) continue // 키 차이는 diffKeys 가 본다

    const a = parseColor(expectedRaw)
    const b = parseColor(actualRaw)
    if (!a || !b) {
      out.push(`${label} --semantic-${key}: 색을 해석할 수 없다 (${expectedRaw} / ${actualRaw})`)
      continue
    }
    if (!sameColor(a, b)) {
      out.push(`${label} --semantic-${key}: ${show(a)} ≠ ${show(b)}  (${expectedRaw} / ${actualRaw})`)
    }
  }
  return out
}

function format(title: string, violations: string[]): string {
  if (violations.length === 0) return ''
  return [`${title} (${violations.length}건):`, ...violations.map((v) => `  - ${v}`)].join('\n')
}

/* ─── 계약 ─────────────────────────────────────────────────────────────────── */

const expectedKeys = figmaKeys(figma)
const cssLight = cssSemantic('light')
const cssDark = cssSemantic('dark')
const tsLight = tsSemantic('light')
const tsDark = tsSemantic('dark')

/**
 * **Figma 에 없는데 코드가 아직 쓰는 토큰.** 승인된 예외가 아니라 부채다.
 *
 * 각 항목에 **왜 지금 못 지우는지**와 **무엇이 해소 조건인지**를 적는다.
 * **목록은 줄이기만 한다** — 새 항목을 넣어야 하는 순간이 곧 승인을 받아야 하는 시점이다.
 * 2026-09-14 기준 5개가 해소됐다: `neutral-solid-500`·`700`(사용 0) ·
 * `text-on-bright-300`(사용 0) · `text-on-bright-500`(쇼케이스 12파일 54곳을 600 으로 리매핑) ·
 * `text-on-dim-300`(사용 0).
 */
const PENDING_FIGMA_SYNC: Record<string, string> = {
  // **현재 비어 있다.** 2026-09-14 에 6건이 전부 해소됐다:
  // - `neutral-solid-500`·`700` · `text-on-bright-300` · `text-on-dim-300` — 사용 0 이라 삭제
  // - `text-on-bright-500` — 쇼케이스 12파일 54곳을 600 으로 리매핑한 뒤 삭제
  // - `neutral-solid-900` — Checkbox 를 Figma 값으로 리매핑한 뒤 삭제. 막고 있던 판단(hover 와
  //   pressed 가 Figma 에서 같은 값이라 눌림 피드백이 없다)은 **Radio 가 이미 그 값을 쓰고 있다**는
  //   사실로 풀렸다 — 디자이너 판단이 아니라 Checkbox 쪽 구현이 갈려 있던 것이었다.
  //
  // 비었다는 것은 "Figma 와 코드가 같다"가 아니라 "여기 적힌 것이 없다"는 뜻이다.
  // `_unverifiedValues`(값을 읽지 못한 토큰)를 함께 읽어라.
}

/** 값을 읽지 못한 토큰. 키는 대조하되 값은 건너뛴다. */
const unverified = new Set(
  Object.entries(figma._unverifiedValues)
    .filter(([family]) => family !== '_comment')
    .flatMap(([family, shades]) => shades.map((shade) => `${family}-${shade}`)),
)

const pending = new Set(Object.keys(PENDING_FIGMA_SYNC))

/** Figma 스냅샷의 값 맵. */
const figmaValues = new Map<string, string>()
for (const [family, { values }] of Object.entries(figma.families)) {
  for (const [shade, value] of Object.entries(values)) figmaValues.set(`${family}-${shade}`, value)
}

describe('T8 — Figma 가 원본이다 (키 집합)', () => {
  it('tokens.css 의 light 키가 Figma 와 같다', () => {
    expect(format('키 불일치', diffKeys(expectedKeys, new Set(cssLight.keys()), 'tokens.css[light]', pending))).toBe('')
  })

  it('tokens.css 의 dark 키가 Figma 와 같다', () => {
    // 다크는 **값**을 Figma 와 비교하지 않지만 **키**는 같아야 한다 — 한쪽에만 있는 토큰은
    // 테마를 바꾸는 순간 미정의가 된다(T3 가 보는 것과 같은 위험).
    expect(format('키 불일치', diffKeys(expectedKeys, new Set(cssDark.keys()), 'tokens.css[dark]', pending))).toBe('')
  })

  it('semantic.ts 의 키가 Figma 와 같다', () => {
    expect(format('키 불일치', diffKeys(expectedKeys, new Set(tsLight.keys()), 'semantic.ts[light]', pending))).toBe('')
    expect(format('키 불일치', diffKeys(expectedKeys, new Set(tsDark.keys()), 'semantic.ts[dark]', pending))).toBe('')
  })

  it('tailwind.config.js 가 모든 Figma 토큰을 노출한다', () => {
    // Tailwind 에 빠진 토큰은 CSS 에 있어도 클래스로 쓸 수 없다 — 소비자에게는 없는 것과 같다.
    expect(format('키 불일치', diffKeys(expectedKeys, tailwindSemantic(), 'tailwind.config.js', pending))).toBe('')
  })
})

describe('T8 — Figma 가 원본이다 (light 값)', () => {
  it('tokens.css 의 light 값이 Figma 값과 같다', () => {
    expect(format('Figma ↔ CSS 값 불일치', diffValues(figmaValues, cssLight, 'CSS', unverified))).toBe('')
  })

  it('semantic.ts 의 light 값이 CSS 해석 값과 같다', () => {
    expect(format('CSS ↔ TS light 값 불일치', diffValues(cssLight, tsLight, 'TS'))).toBe('')
  })
})

describe('T8 — 다크는 코드가 소유한다', () => {
  it('semantic.ts 의 dark 값이 CSS 해석 값과 같다', () => {
    // Figma 는 다크 값을 갖지 않는다. 그래서 여기서는 사본 둘(TS·CSS)의 일치만 본다 —
    // 원본이 없는 축이므로 "어느 쪽이 맞다"가 아니라 "갈라지지 않았다"까지가 이 검사의 한계다.
    expect(format('CSS ↔ TS dark 값 불일치', diffValues(cssDark, tsDark, 'TS'))).toBe('')
  })
})

describe('T8 — Figma 에 없는데 코드가 쓰는 토큰', () => {
  it('부채 목록의 항목이 사유와 해소 조건을 갖고, 실제로 코드에 남아 있다', () => {
    // 해소된 항목이 목록에 남아 있으면 "아직 문제가 있다"고 거짓 보고한다.
    for (const [key, reason] of Object.entries(PENDING_FIGMA_SYNC)) {
      expect(reason.length, `${key} 에 사유가 없다`).toBeGreaterThan(80)
      expect(figmaKeys(figma).has(key), `${key} 가 Figma 에 있다면 부채가 아니다`).toBe(false)
      expect(cssLight.has(key), `${key} 가 tokens.css 에 없다 — 해소됐다면 목록에서 뺀다`).toBe(true)
    }
  })

  it('목록이 승인 없이 늘지 않았다', () => {
    // 리터럴로 대조한다. 항목이 늘거나 조용히 줄면 여기서 먼저 깨진다.
    expect(Object.keys(PENDING_FIGMA_SYNC)).toEqual([])
  })
})

describe('T8 — 미검증 목록', () => {
  it('값을 읽지 못한 토큰이 사유와 함께 남아 있다', () => {
    // 이 목록이 비어 있지 않은 한 "Figma 와 전부 일치"라고 쓸 수 없다.
    expect(unverified.size).toBeGreaterThan(0)
    // 미검증 키가 실제로 Figma 키 집합 안에 있어야 한다 — 오타로 적힌 항목은
    // 아무 값도 건너뛰지 않으면서 목록만 부풀린다.
    for (const key of unverified) {
      expect(expectedKeys.has(key), `_unverifiedValues 의 ${key} 가 Figma 키 집합에 없다`).toBe(true)
    }
    // 값이 있는데도 미검증으로 적힌 항목이 없어야 한다.
    for (const key of unverified) {
      expect(figmaValues.has(key), `${key} 는 값이 있는데 미검증으로 적혀 있다`).toBe(false)
    }
  })
})

/* ─── 판정기 자기 검사 ─────────────────────────────────────────────────────── */

describe('판정 로직', () => {
  describe('parseColor', () => {
    it('6자리 hex 는 알파 255 다', () => {
      expect(parseColor('#fdfefe')).toEqual({ r: 253, g: 254, b: 254, a: 255 })
    })

    it('8자리 hex 의 알파를 읽는다', () => {
      expect(parseColor('#1010130a')).toEqual({ r: 16, g: 16, b: 19, a: 10 })
    })

    it('rgba 의 소수 알파를 0–255 로 반올림한다', () => {
      expect(parseColor('rgba(16, 16, 19, 0.04)')).toEqual({ r: 16, g: 16, b: 19, a: 10 })
      expect(parseColor('rgb(16, 16, 19)')).toEqual({ r: 16, g: 16, b: 19, a: 255 })
    })

    it('해석할 수 없는 값은 null 이다 — 불일치로 오인하지 않기 위해서다', () => {
      expect(parseColor('var(--missing)')).toBeNull()
      expect(parseColor('transparent')).toBeNull()
    })
  })

  describe('sameColor', () => {
    it('양자화 차이 1 은 같다고 본다', () => {
      // Figma 0x1f = 31, 코드 0.12 × 255 = 30.6 → 31. 반올림이 갈리면 1 이 어긋난다.
      expect(sameColor(parseColor('#1010131f')!, parseColor('rgba(16,16,19,0.12)')!)).toBe(true)
    })

    it('알파가 2 이상 다르면 다르다', () => {
      expect(sameColor(parseColor('#10101320')!, parseColor('#1010131f')!)).toBe(true) // 1 차이
      expect(sameColor(parseColor('#10101321')!, parseColor('#1010131f')!)).toBe(false) // 2 차이
    })

    it('RGB 는 1 만 달라도 다르다 — 알파와 달리 표기 문제가 아니다', () => {
      expect(sameColor(parseColor('#101014')!, parseColor('#101013')!)).toBe(false)
    })
  })

  describe('diffKeys', () => {
    it('양쪽 방향의 차이를 모두 보고한다', () => {
      const violations = diffKeys(new Set(['a-1', 'a-2']), new Set(['a-2', 'a-3']), 'X')
      expect(violations).toEqual(['X 에만 있다: --semantic-a-3', 'X 에 없다: --semantic-a-1'])
    })

    it('같으면 빈 배열이다', () => {
      expect(diffKeys(new Set(['a-1']), new Set(['a-1']), 'X')).toEqual([])
    })
  })

  describe('diffValues', () => {
    const expected = new Map([['x-1', '#fdfefe']])

    it('값이 다르면 잡는다', () => {
      expect(diffValues(expected, new Map([['x-1', '#ffffff']]), 'X')).toHaveLength(1)
    })

    it('skip 에 든 키는 건너뛴다', () => {
      expect(diffValues(expected, new Map([['x-1', '#ffffff']]), 'X', new Set(['x-1']))).toEqual([])
    })

    it('상대에 없는 키는 값 검사 대상이 아니다 — 키 차이는 diffKeys 의 몫이다', () => {
      expect(diffValues(expected, new Map(), 'X')).toEqual([])
    })

    it('해석할 수 없는 값은 불일치가 아니라 판정 불가로 보고한다', () => {
      const violations = diffValues(expected, new Map([['x-1', 'var(--broken)']]), 'X')
      expect(violations[0]).toContain('해석할 수 없다')
    })
  })

  describe('수집 경로', () => {
    it('CSS·TS·Tailwind 에서 실제로 토큰을 모았다 — 0개면 검사가 아무것도 안 본다', () => {
      expect(cssLight.size).toBeGreaterThan(100)
      expect(cssDark.size).toBeGreaterThan(100)
      expect(tsLight.size).toBeGreaterThan(100)
      expect(tailwindSemantic().size).toBeGreaterThan(100)
      expect(expectedKeys.size).toBeGreaterThan(100)
    })

    it('CSS 값이 primitive 까지 해석됐다 — var() 가 남아 있으면 대조가 무의미하다', () => {
      const unresolved = [...cssLight].filter(([, value]) => value.includes('var('))
      expect(unresolved.map(([key]) => key)).toEqual([])
    })
  })
})
