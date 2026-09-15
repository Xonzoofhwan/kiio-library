/**
 * T9 — 타이포그래피 Figma ↔ TypeScript ↔ CSS ↔ Tailwind 4자 정합.
 *
 * T8(`figmaContract.test.ts`)이 **색**에 대해 하는 일을 **글자**에 대해 한다. 축은 같다 —
 * 사본끼리 맞추는 것은 정합이 아니므로 Figma 를 원본으로 못 박고 나머지 셋이 따라오는지 잰다.
 *
 * ## 왜 필요한가
 * 타이포 값이 네 곳에 중복돼 있다: Figma 텍스트 스타일 · `src/tokens/typography.ts` ·
 * `src/tokens/tokens.css` 의 `--text-*` · `tailwind.config.js` 의 typography 플러그인.
 * 2026-09-14 실측에서 **행간 5개(32·28·24·22·20)가 Figma 보다 2~4px 넓었다.** 자간은 17개
 * 전부 같았다. 코드 값은 옛 파일에서 옮겨 온 것이고 Figma 쪽이 그 뒤 조여졌다.
 *
 * ## 보장하는 것
 * 1. **사이즈 키 집합**이 스냅샷과 같다 (TS · CSS · Tailwind 셋 다)
 * 2. **font-size**: Figma px ÷ 16 = TS·CSS 의 rem
 * 3. **line-height**: Figma px = TS·CSS 의 px
 * 4. **letter-spacing**: Figma % ÷ 100 = TS·CSS 의 em
 * 5. **굵기 4종 × 사이즈 17종 = 68개 Tailwind 유틸리티**가 전부 있고, 각자 제 사이즈의
 *    `--text-*` 변수를 참조하며 font-weight 가 스냅샷의 매핑과 같다
 * 6. **폰트 패밀리**: 스냅샷의 이름이 TS 의 스택 첫머리에 있다
 *
 * ## 보장하지 않는 것
 * - **스냅샷이 최신인가.** 사람이 갱신하는 파일이다. Figma 에서 행간을 바꿔도 이 검사는
 *   조용하다 — 다시 뽑아야 한다. 절차는 스냅샷의 `_method` 에 적혀 있다.
 * - **행간이 Wanted Sans 에 맞는가.** 이 수치들은 Geist 시절 값이고 폰트 교체 때
 *   건드리지 않았다. 맞는지는 사람이 보고 정할 문제이고 검사가 대신할 수 없다.
 * - **어느 문자 기준인가.** 지금은 **영문 기준**이다(2026-09-15 확정). 국문은 20 이상
 *   디스플레이 구간에서 조정이 필요할 수 있다 — 같은 행간에서 한글이 받는 줄 간격이
 *   라틴의 절반이기 때문이다. 이 검사는 Figma 와 코드가 **같은가**만 보고, 그 값이
 *   **어느 문자에 좋은가**는 보지 않는다. 근거는 STABILIZATION_PLAN.md 의 N12.
 * - **굵기별 행간 차이.** 스냅샷은 크기당 하나로 접혀 있다(실측에서 네 굵기가 같았다).
 *   Figma 에서 굵기마다 다르게 두면 이 검사는 그것을 보지 못한다.
 * - 브라우저가 실제로 그 폰트로 그렸는가. 그것은 `npm run capture` 의 몫이다.
 *
 * 판정기가 고장 나면 조용히 통과하는 껍데기가 되므로, 아래에서 단위 변환과 파서를
 * 가짜 입력으로 검사한다. (`src/testing/**` 은 라이브러리 표면이 아니므로 export 하지 않는다.)
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { typography } from '@/tokens/typography'

const REPO_ROOT = process.cwd()
const SNAPSHOT = join(REPO_ROOT, 'specs/tokens/typography.figma.json')
const TOKENS_CSS = join(REPO_ROOT, 'src/tokens/tokens.css')
const TAILWIND = join(REPO_ROOT, 'tailwind.config.js')

interface Snapshot {
  fontFamily: string
  weights: Record<string, { figmaStyle: string; cssWeight: number }>
  sizes: Record<string, { lineHeightPx: number; letterSpacingPct: number }>
}

const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8')) as Snapshot
const cssText = readFileSync(TOKENS_CSS, 'utf8')
const tailwindText = readFileSync(TAILWIND, 'utf8')

/* ─── 단위 변환 ─────────────────────────────────────────────────────────────
   Figma 와 코드는 단위가 다르다. 변환을 한 곳에 두고 자체 검사한다. */

/** Figma 의 px 크기 → rem 수치. 16px 기준. */
export function pxToRem(px: number): number {
  return px / 16
}

/** Figma 의 % 자간 → em 수치. -1.2% → -0.012 */
export function pctToEm(pct: number): number {
  return pct / 100
}

/**
 * CSS 길이 문자열을 {수치, 단위} 로 가른다.
 *
 * **문자열로 비교하지 않는다.** `-0.010em` 과 `-0.01em` 은 같은 값인데 표기만 다르다 —
 * 실제로 이 검사의 첫 실행에서 그 둘을 불일치로 잡아냈고, 그건 코드 결함이 아니라
 * 판정기의 오탐이었다. 값은 수치로, 단위는 따로 본다.
 */
export function parseLen(raw: string | null): { value: number; unit: string } | null {
  if (raw === null) return null
  const m = /^(-?\d*\.?\d+)([a-z%]*)$/.exec(raw.trim())
  if (!m) return null
  const unit = m[2] === '' ? 'unitless' : m[2]
  return { value: Number(m[1]), unit }
}

/** 기대 수치·단위와 실제 문자열이 같은 값인가. 표기 차이는 통과시킨다. */
export function sameLen(raw: string | null, value: number, unit: string): boolean {
  const got = parseLen(raw)
  if (got === null) return false
  // 0 은 단위가 무엇이든(0 · 0em · 0px) 같은 값이다.
  if (value === 0 && got.value === 0) return true
  return got.unit === unit && Math.abs(got.value - value) < 1e-9
}

/** `--text-lh-24: 30px;` 같은 선언에서 값을 꺼낸다. */
export function readCssVar(css: string, name: string): string | null {
  const m = new RegExp(`--${name}\\s*:\\s*([^;]+);`).exec(css)
  return m ? m[1].trim() : null
}

/** typography.ts 가 만든 합성 토큰 키. */
const key = (size: string, weight: string) => `${size}-${weight}` as keyof typeof typography

/* ─── 판정기 자체 검사 ───────────────────────────────────────────────────── */

describe('T9 판정기 자체 검사 — 변환과 파서가 실제로 동작하는가', () => {
  it('px → rem 변환이 맞다', () => {
    expect(pxToRem(64)).toBe(4)
    expect(pxToRem(16)).toBe(1)
    expect(pxToRem(10)).toBe(0.625)
    expect(pxToRem(17)).toBe(1.0625)
  })

  it('% → em 변환이 맞다', () => {
    expect(pctToEm(-1.2)).toBeCloseTo(-0.012, 10)
    expect(pctToEm(-0.9)).toBeCloseTo(-0.009, 10)
    expect(pctToEm(0)).toBe(0)
  })

  it('표기만 다른 같은 값을 불일치로 잡지 않는다', () => {
    expect(sameLen('-0.010em', -0.01, 'em')).toBe(true)
    expect(sameLen('-0.01em', -0.01, 'em')).toBe(true)
    expect(sameLen('4rem', 4, 'rem')).toBe(true)
    expect(sameLen('0em', 0, 'em')).toBe(true)
    expect(sameLen('0', 0, 'em')).toBe(true)
  })

  it('값이 다르면 잡는다 — 느슨해져서 통과시키는 것이 아니다', () => {
    expect(sameLen('-0.012em', -0.01, 'em')).toBe(false)
    expect(sameLen('38px', 36, 'px')).toBe(false)
    expect(sameLen('4rem', 4, 'px')).toBe(false)
    expect(sameLen(null, 4, 'rem')).toBe(false)
  })

  it('CSS 변수 파서가 값을 꺼내고, 없는 이름에는 null 을 준다', () => {
    const fake = ':root { --text-lh-24: 30px; --text-ls-24: -0.008em; }'
    expect(readCssVar(fake, 'text-lh-24')).toBe('30px')
    expect(readCssVar(fake, 'text-ls-24')).toBe('-0.008em')
    expect(readCssVar(fake, 'text-lh-99')).toBeNull()
  })

  it('불일치를 실제로 잡는다 — 통과만 하는 껍데기가 아니다', () => {
    const fake = ':root { --text-lh-24: 30px; }'
    expect(readCssVar(fake, 'text-lh-24')).not.toBe('28px')
  })
})

/* ─── 1. 사이즈 키 집합 ─────────────────────────────────────────────────── */

const figmaSizes = Object.keys(snapshot.sizes).sort((a, b) => Number(b) - Number(a))
const weightNames = Object.keys(snapshot.weights)

describe('T9-1 사이즈 키 집합이 네 곳에서 같다', () => {
  it(`Figma 스냅샷이 ${figmaSizes.length} 사이즈를 갖는다`, () => {
    expect(figmaSizes.length).toBeGreaterThan(0)
  })

  it('typography.ts 의 사이즈 집합 = Figma', () => {
    const tsSizes = [...new Set(Object.keys(typography).map((k) => k.split('-')[0]))]
    expect(tsSizes.sort()).toEqual([...figmaSizes].sort())
  })

  it('tokens.css 의 --text-size-* 집합 = Figma', () => {
    const cssSizes = [...cssText.matchAll(/--text-size-(\d+)\s*:/g)].map((m) => m[1])
    expect([...new Set(cssSizes)].sort()).toEqual([...figmaSizes].sort())
  })

  it('tailwind 유틸리티가 사이즈 × 굵기 전부를 덮는다', () => {
    const missing: string[] = []
    for (const size of figmaSizes) {
      for (const w of weightNames) {
        if (!tailwindText.includes(`'${size}-${w}'`)) missing.push(`${size}-${w}`)
      }
    }
    expect(missing).toEqual([])
  })
})

/* ─── 2~4. 값 대조 ──────────────────────────────────────────────────────── */

describe.each(figmaSizes)('T9-2 사이즈 %s 의 값이 Figma 와 같다', (size) => {
  const fig = snapshot.sizes[size]
  const remValue = pxToRem(Number(size))
  const emValue = pctToEm(fig.letterSpacingPct)

  it(`font-size — TS·CSS 가 ${remValue}rem`, () => {
    expect(sameLen(typography[key(size, 'regular')].fontSize, remValue, 'rem')).toBe(true)
    expect(sameLen(readCssVar(cssText, `text-size-${size}`), remValue, 'rem')).toBe(true)
  })

  it(`line-height — TS·CSS 가 ${fig.lineHeightPx}px`, () => {
    expect(typography[key(size, 'regular')].lineHeight).toBe(`${fig.lineHeightPx}px`)
    expect(sameLen(readCssVar(cssText, `text-lh-${size}`), fig.lineHeightPx, 'px')).toBe(true)
  })

  it(`letter-spacing — TS·CSS 가 ${emValue}em`, () => {
    expect(sameLen(typography[key(size, 'regular')].letterSpacing, emValue, 'em')).toBe(true)
    expect(sameLen(readCssVar(cssText, `text-ls-${size}`), emValue, 'em')).toBe(true)
  })

  it('네 굵기가 같은 행간·자간을 쓴다 — 굵기는 weight 만 바꾼다', () => {
    for (const w of weightNames) {
      expect(sameLen(typography[key(size, w)].lineHeight, fig.lineHeightPx, 'px')).toBe(true)
      expect(sameLen(typography[key(size, w)].letterSpacing, emValue, 'em')).toBe(true)
    }
  })
})

/* ─── 5. 굵기 매핑 ──────────────────────────────────────────────────────── */

describe('T9-3 굵기 매핑이 Figma 와 같다', () => {
  it.each(weightNames)('%s 의 font-weight 가 스냅샷과 같다', (w) => {
    const expected = snapshot.weights[w].cssWeight
    for (const size of figmaSizes) {
      expect(typography[key(size, w)].fontWeight).toBe(expected)
    }
  })

  it('tailwind 유틸리티의 font-weight 도 같다', () => {
    const wrong: string[] = []
    for (const w of weightNames) {
      const expected = String(snapshot.weights[w].cssWeight)
      for (const size of figmaSizes) {
        const re = new RegExp(`'${size}-${w}'\\s*:\\s*\\{[^}]*fontWeight:\\s*'(\\d+)'`)
        const m = re.exec(tailwindText)
        if (!m) wrong.push(`${size}-${w}: 유틸리티를 찾지 못했다`)
        else if (m[1] !== expected) wrong.push(`${size}-${w}: ${m[1]} (기대 ${expected})`)
      }
    }
    expect(wrong).toEqual([])
  })

  it('tailwind 유틸리티가 제 사이즈의 변수를 참조한다', () => {
    const wrong: string[] = []
    for (const w of weightNames) {
      for (const size of figmaSizes) {
        const re = new RegExp(`'${size}-${w}'\\s*:\\s*\\{([^}]*)\\}`)
        const m = re.exec(tailwindText)
        if (!m) continue
        const body = m[1]
        for (const prop of ['size', 'lh', 'ls']) {
          if (!body.includes(`--text-${prop}-${size}`)) wrong.push(`${size}-${w}: --text-${prop}-${size} 참조 없음`)
        }
      }
    }
    expect(wrong).toEqual([])
  })
})

/* ─── 6. 폰트 패밀리 ────────────────────────────────────────────────────── */

describe('T9-4 폰트 패밀리가 Figma 와 같다', () => {
  it(`typography.ts 의 스택이 "${snapshot.fontFamily}" 를 담는다`, () => {
    const stack = typography['16-regular'].fontFamily
    expect(stack).toContain(snapshot.fontFamily)
  })

  it('스택의 첫 항목이 그 패밀리다 — fallback 이 앞서면 안 된다', () => {
    const first = typography['16-regular'].fontFamily.split(',')[0].replace(/['"]/g, '').trim()
    // 가변 폰트는 "Wanted Sans Variable" 처럼 접미사가 붙는다.
    expect(first.startsWith(snapshot.fontFamily)).toBe(true)
  })
})
