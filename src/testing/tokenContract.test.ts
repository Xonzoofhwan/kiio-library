/**
 * 토큰 계약 테스트 — CLAUDE.md 의 토큰 규칙을 소스에서 기계적으로 판정한다.
 *
 * 이 저장소의 토큰 규칙은 오랫동안 산문으로만 존재했고, 그 결과 실제로 새어나간
 * 것들이 있었다 — 이름이 바뀐 뒤 남은 `var(--semantic-primary-300)` 참조(값이
 * 비어 포커스 링이 텍스트색으로 그려졌다), spacing 토큰이 있는데도 박아 넣은
 * `44px`·`16px` 리터럴, `typography-10-medium` 이 있는데도 쓴
 * `text-[10px] leading-[12px]`. 전부 사람이 읽어서 잡기로 되어 있던 것들이다.
 *
 * ## 보장하는 것
 * T1 `var()` 무결성 · T2 `:root` 스코프 · T3 테마 정의 완전성 ·
 * T4 컨트롤 높이 허용 집합 · T5 높이 리터럴 · T6 타이포 arbitrary · T7 하드코딩
 *
 * ## 보장하지 않는 것
 * 값이 **옳은지**는 보지 않는다. `--comp-button-bg-primary` 가 브랜드 색을
 * 가리키는지, 대비가 WCAG AA 를 넘는지, 디자인과 일치하는지는 범위 밖이다.
 * 여기서 통과했다는 말은 "토큰 체계의 규칙을 지켰다"까지이지 "값이 맞다"가 아니다.
 * 런타임 계산(특이성, 캐스케이드 승자)도 보지 않는다 — 그것은
 * `cssContract.test.ts` 가 빌드 산출물에서 본다.
 *
 * 판정 로직은 순수 함수로 분리했다. 실제 소스가 계약을 만족하는 동안에도 판정기가
 * 고장 나면 이 테스트는 조용히 통과하는 껍데기가 되므로, 가짜 입력으로 판정기가
 * 위반을 잡아내는지 아래에서 함께 검사한다.
 * (`src/testing/**` 은 라이브러리 표면이 아니므로 밖으로 export 하지 않는다.)
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import type { Declaration, Rule } from 'postcss'
import { describe, expect, it } from 'vitest'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const TOKENS_CSS = join(REPO_ROOT, 'src/tokens/tokens.css')
const INDEX_CSS = join(REPO_ROOT, 'src/index.css')
const COMPONENTS_DIR = join(REPO_ROOT, 'src/components')

/* ─── 소스 수집 ────────────────────────────────────────────────────────────── */

function listSourceFiles(dir: string, extensions: string[]): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((name) => extensions.some((ext) => name.endsWith(ext)))
    .map((name) => join(dir, name))
}

interface SourceFile {
  /** 저장소 기준 상대 경로. 실패 메시지에 이것을 싣는다. */
  path: string
  text: string
}

function readSources(dir: string, extensions: string[]): SourceFile[] {
  return listSourceFiles(dir, extensions).map((path) => ({
    path: path.slice(REPO_ROOT.length + 1),
    text: readFileSync(path, 'utf8'),
  }))
}

/* ─── 문자열 리터럴 추출 ───────────────────────────────────────────────────── */

/**
 * 소스에서 **문자열 리터럴의 내용만** 뽑는다. 주석과 식별자는 버린다.
 *
 * 순진하게 파일 전체를 grep 하면 주석이 오탐한다 — 실제로 `Switch.tsx` 에
 * `// … match hover speed: 100ms / ease-out` 이라는 서술이 있어 "기본 easing 사용"
 * 으로 잡힌다. 클래스 이름은 언제나 문자열 안에 있으므로 문자열만 본다.
 *
 * 반환은 `{ line, value }` 다 — 실패 메시지가 줄 번호를 알려줘야 고칠 수 있다.
 */
export function extractStringLiterals(source: string): Array<{ line: number; value: string }> {
  const out: Array<{ line: number; value: string }> = []
  let line = 1
  let i = 0

  const isEscaped = (index: number): boolean => {
    let backslashes = 0
    for (let k = index - 1; k >= 0 && source[k] === '\\'; k -= 1) backslashes += 1
    return backslashes % 2 === 1
  }

  while (i < source.length) {
    const ch = source[i]

    if (ch === '\n') {
      line += 1
      i += 1
      continue
    }

    // 줄 주석
    if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i += 1
      continue
    }

    // 블록 주석
    if (ch === '/' && source[i + 1] === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line += 1
        i += 1
      }
      i += 2
      continue
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      const startLine = line
      const quote = ch
      i += 1
      let value = ''
      while (i < source.length) {
        if (source[i] === quote && !isEscaped(i)) break
        if (source[i] === '\n') line += 1
        value += source[i]
        i += 1
      }
      i += 1
      out.push({ line: startLine, value })
      continue
    }

    i += 1
  }

  return out
}

/* ─── CSS 파싱 헬퍼 ────────────────────────────────────────────────────────── */

const isRootSelector = (selector: string): boolean =>
  selector
    .split(',')
    .some((part) => part.trim() === ':root')

interface TokenDeclaration {
  prop: string
  value: string
  selector: string
  line: number
  /** 규칙이 파일에서 몇 번째로 등장했는가. 캐스케이드 순서 판정에 쓴다. */
  ruleIndex: number
}

function collectDeclarations(css: string): TokenDeclaration[] {
  const out: TokenDeclaration[] = []
  let ruleIndex = 0
  postcss.parse(css).walkRules((rule: Rule) => {
    const selector = rule.selector.replace(/\s+/g, ' ').trim()
    const index = ruleIndex
    ruleIndex += 1
    rule.walkDecls((decl: Declaration) => {
      if (!decl.prop.startsWith('--')) return
      out.push({
        prop: decl.prop,
        value: decl.value.trim(),
        selector,
        line: decl.source?.start?.line ?? 0,
        ruleIndex: index,
      })
    })
  })
  return out
}

/**
 * `var(--x)` 참조 이름을 뽑는다.
 *
 * TS 템플릿 리터럴로 만든 동적 참조(`var(--primitive-${shade})`)는 이름이
 * 하이픈으로 끝나는 미완성 조각으로 잡히므로 걸러낸다. 동적 참조는 이 검사가
 * 판정할 수 없으며, 그 사실이 `UNMEASURED` 로 드러나야 한다.
 */
export function extractVarReferences(text: string): string[] {
  const names = new Set<string>()
  for (const match of text.matchAll(/var\(\s*(--[a-zA-Z0-9-]*)/g)) {
    names.add(match[1])
  }
  return [...names]
}

/** 동적으로 조립된 미완성 참조인가. */
const isDynamicReference = (name: string): boolean => name.endsWith('-')

/** Radix 가 런타임에 주입하는 변수. 소스에 정의가 있을 수 없다. */
const isRuntimeInjected = (name: string): boolean => name.startsWith('--radix-')

/* ─── var() 값 해석 ────────────────────────────────────────────────────────── */

/** `var(` 하나의 닫는 괄호 위치. 중첩 괄호를 센다. */
function findClosingParen(value: string, openIndex: number): number {
  let depth = 0
  for (let i = openIndex; i < value.length; i += 1) {
    if (value[i] === '(') depth += 1
    else if (value[i] === ')') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

/**
 * `var(--a, fallback)` 을 리터럴까지 되푼다.
 *
 * 정규식으로 하지 않는 이유: fallback 안에 다시 괄호가 올 수 있어
 * (`var(--a, calc(1px + 2px))`) `[^)]*` 로는 중간에서 끊긴다. 끊기면 `)` 가 남아
 * **부분 해석된 쓰레기 문자열**이 결과에 들어가고, 그 값이 허용 집합에 없다는
 * 이유로 엉뚱한 실패가 난다.
 */
export function resolveVars(value: string, vars: Map<string, string>, depth = 0): string {
  if (depth > 10) return value
  const start = value.indexOf('var(')
  if (start === -1) return value

  const open = start + 'var'.length
  const close = findClosingParen(value, open)
  if (close === -1) return value

  const inner = value.slice(open + 1, close)
  const comma = inner.indexOf(',')
  const name = (comma === -1 ? inner : inner.slice(0, comma)).trim()
  const fallback = comma === -1 ? null : inner.slice(comma + 1).trim()

  const defined = vars.get(name)
  const replacement = defined ?? fallback ?? value.slice(start, close + 1)

  const next = value.slice(0, start) + replacement + value.slice(close + 1)
  return resolveVars(next, vars, depth + 1)
}

/** 해석된 값에서 px 숫자를 뽑는다. px 리터럴이 아니면 null. */
export function toPx(resolved: string): number | null {
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(resolved.trim())
  return match ? Number(match[1]) : null
}

/* ─── T4 대상 목록 — 손으로 유지한다 ──────────────────────────────────────── */

/**
 * 컨트롤 심볼. **자동 판별이 불가능해서** 손으로 적는다 —
 * `height: 36px` 이 버튼인지 썸네일인지 코드는 말해주지 않는다.
 *
 * **새 인터랙티브 컴포넌트를 만들면 여기 등록한다.** 등록하지 않으면 T4 가 그
 * 컴포넌트를 아예 보지 않으므로, 검사가 있다는 사실만으로 안심하게 된다.
 *
 * `padding` 이 있는 항목은 **레일이 컨트롤**인 경우다. 사용자가 마주하는 표면의
 * 높이가 `아이템 + 패딩×2` 로 결정되므로 그 값으로 잰다.
 */
const CONTROLS: Record<string, { height: string; padding?: string }> = {
  Button: { height: '--comp-button-height-' },
  TextButton: { height: '--comp-text-button-height-' },
  Tab: { height: '--comp-tab-height-' },
  ChipUniversal: { height: '--comp-chip-universal-height-' },
  ChipBadgeLike: { height: '--comp-chip-badgelike-height-' },
  Switch: { height: '--comp-switch-track-h-' },
  // SegmentBar 의 컨트롤은 개별 아이템이 아니라 아이템들을 담은 **레일**이다.
  // 레일은 높이를 선언하지 않고 아이템 + 컨테이너 패딩×2 로 결정된다.
  SegmentBar: { height: '--comp-segment-item-height-', padding: '--comp-segment-bar-padding-' },
}

/**
 * 허용 컨트롤 높이. **2026-09-05 실측 동결. 목록은 줄이기만 한다.**
 *
 * 간격이 일정하지 않다(`4 4 4 4 4 8 8`) — 40 까지 4px 그리드이고 그 뒤로 8px 다.
 * 현재 Figma 값을 고정점으로 보존하기로 했으므로 이 불규칙도 그대로 안는다.
 */
const ALLOWED_HEIGHTS = [20, 24, 28, 32, 36, 40, 48, 56]

/**
 * 허용 집합 밖인데 아직 디자이너 판단을 받지 못한 컨트롤.
 *
 * **승인된 예외가 아니라 부채다.** 검사를 통과시키려고 등록해 둔 목록이며,
 * 승인이 나면 사유와 함께 정식 예외로 옮기고 해소되면 여기서 뺀다.
 * **승인 없이 새 항목을 추가하지 않는다.**
 */
const PENDING_DECISION: Record<string, number[]> = {}

/**
 * 소스 스캔으로 크기를 알 수 없는 컨트롤.
 *
 * 이 검사는 `--comp-*-height-*` 선언을 읽는다. 그래서 **높이를 그 형태로
 * 선언하지 않는 컨트롤은 보이지 않는다.**
 * 여기 있는 항목은 **검증되지 않은 것이지 통과한 것이 아니다.**
 */
const UNMEASURED_CONTROLS: Record<string, string> = {
  Checkbox:
    '히트 영역이 `--comp-checkbox-visual-*`(16/20/24) + `--comp-checkbox-inset`(8) 로 나뉘어 있어 ' +
    '실제 컨트롤 높이를 소스만으로 확정할 수 없다. 렌더 결과 측정이 필요하다.',
  Radio:
    '`--comp-radio-visual-*` + `--comp-radio-inset` 구조가 Checkbox 와 같다. 같은 이유로 미측정.',
  NavVertical:
    '아이템 높이를 선언하지 않고 패딩과 타이포그래피 line-height 로 결정한다. 소스 스캔 대상이 아니다.',
}

/* ─── 판정기 ───────────────────────────────────────────────────────────────── */

/** T1: 정의되지 않은 `var()` 참조. */
export function findUndefinedVarReferences(
  references: Array<{ name: string; where: string }>,
  defined: Set<string>,
): string[] {
  return references
    .filter(({ name }) => !isRuntimeInjected(name) && !isDynamicReference(name))
    .filter(({ name }) => !defined.has(name))
    .map(({ name, where }) => `${name}  (${where})`)
}

/**
 * T2: `:root` 에서 **테마 스코프에만 있는** semantic 토큰을 참조하는 선언.
 *
 * CLAUDE.md 는 ":root 에서 var(--semantic-*) 참조 금지"라고 적지만, 그 규칙이
 * 막으려는 것은 **var() 체인이 끊어지는 경우**다. semantic 토큰 중에도
 * `--semantic-duration-*`·`--semantic-easing-*`·`--semantic-scale-press-*` 처럼
 * 테마 불변이라 `:root` 에 정의된 것들이 있고, 그것을 같은 스코프에서 참조하는 것은
 * 체인이 멀쩡하다. 실제로 끊어지는 것은 **`[data-theme]` 에만 정의된 색 계열**을
 * `:root` 에서 참조할 때다. 이름이 아니라 **정의 위치**로 판정한다.
 */
export function findBrokenSemanticRefsInRoot(declarations: TokenDeclaration[]): string[] {
  const definedInRoot = new Set(
    declarations.filter((d) => isRootSelector(d.selector)).map((d) => d.prop),
  )
  const out: string[] = []
  for (const d of declarations) {
    if (!isRootSelector(d.selector)) continue
    for (const name of extractVarReferences(d.value)) {
      if (!name.startsWith('--semantic-') || definedInRoot.has(name)) continue
      out.push(`tokens.css:${d.line}  ${d.prop}: ${d.value}  → ${name} 은 [data-theme] 스코프에만 있다`)
    }
  }
  return out
}

interface ThemeCompleteness {
  /** 어느 테마에서도 정의되지 않는 토큰. */
  missing: string[]
  /** 기본 `[data-theme]` 을 덮어야 하는데 그보다 **앞에** 선언된 토큰. */
  misordered: string[]
}

/**
 * T3: 테마 정의 완전성.
 *
 * 구조는 이렇다 — `[data-theme="light"]`·`[data-theme="dark"]` 가 semantic 색을
 * 정의하고, 그 뒤 `[data-theme]` 이 component 색을 semantic 에 **매핑**하며,
 * 마지막에 일부 테마가 그 매핑을 덮는다(Tooltip·Callout 의 black/white 는 dark 에서
 * 의미가 뒤집힌다).
 *
 * 두 가지를 본다:
 * 1. 테마 한쪽에만 있는 토큰은 **기본 `[data-theme]` 에 받침이 있어야** 한다.
 *    없으면 다른 테마에서 그 토큰이 미정의가 된다.
 * 2. 기본을 덮는 테마별 선언은 기본보다 **뒤에** 와야 한다.
 *    `[data-theme]` 과 `[data-theme="dark"]` 는 **특이성이 같아서**(둘 다 속성
 *    선택자 하나) 순서가 승자를 정한다. 앞에 두면 조용히 무시된다.
 */
export function checkThemeCompleteness(declarations: TokenDeclaration[]): ThemeCompleteness {
  const base = new Map<string, number>()
  const perTheme = new Map<string, Map<string, number>>()

  for (const d of declarations) {
    const scoped = /^\[data-theme="([^"]+)"\]$/.exec(d.selector)
    if (scoped) {
      const theme = scoped[1]
      if (!perTheme.has(theme)) perTheme.set(theme, new Map())
      const map = perTheme.get(theme)
      if (map && !map.has(d.prop)) map.set(d.prop, d.ruleIndex)
      continue
    }
    if (d.selector === '[data-theme]' && !base.has(d.prop)) base.set(d.prop, d.ruleIndex)
  }

  const themes = [...perTheme.keys()]
  const missing: string[] = []
  const misordered: string[] = []

  for (const [theme, tokens] of perTheme) {
    for (const [prop, ruleIndex] of tokens) {
      const others = themes.filter((t) => t !== theme)
      const inAllOthers = others.every((t) => perTheme.get(t)?.has(prop))
      const baseIndex = base.get(prop)

      if (baseIndex === undefined && !inAllOthers) {
        const absent = others.filter((t) => !perTheme.get(t)?.has(prop))
        missing.push(`${prop} — "${theme}" 에만 있고 기본 [data-theme] 에 없다 (없는 테마: ${absent.join(', ')})`)
      }
      if (baseIndex !== undefined && ruleIndex < baseIndex) {
        misordered.push(`${prop} — "${theme}" 선언이 기본 [data-theme] 보다 앞에 있어 덮이지 않는다`)
      }
    }
  }

  return { missing, misordered }
}

interface HeightViolation {
  control: string
  variant: string
  height: number
  detail: string
}

/** T4: 컨트롤 높이가 허용 집합 밖. 레일이 컨트롤이면 아이템 + 패딩×2 로 잰다. */
export function findControlHeightViolations(
  declarations: TokenDeclaration[],
  vars: Map<string, string>,
): HeightViolation[] {
  const violations: HeightViolation[] = []

  for (const [control, spec] of Object.entries(CONTROLS)) {
    const heights = declarations.filter((d) => d.prop.startsWith(spec.height))
    for (const decl of heights) {
      const variant = decl.prop.slice(spec.height.length)
      const itemPx = toPx(resolveVars(decl.value, vars))
      if (itemPx === null) continue

      let total = itemPx
      let detail = `${decl.prop} = ${itemPx}px`

      if (spec.padding) {
        const paddingDecl = declarations.find((d) => d.prop === `${spec.padding}${variant}`)
        const paddingPx = paddingDecl ? toPx(resolveVars(paddingDecl.value, vars)) : null
        if (paddingPx === null) continue
        total = itemPx + paddingPx * 2
        detail = `${itemPx}px + ${paddingPx}px×2 (레일)`
      }

      const pending = PENDING_DECISION[`${control}.${variant}`] ?? []
      if (ALLOWED_HEIGHTS.includes(total) || pending.includes(total)) continue
      violations.push({ control, variant, height: total, detail })
    }
  }

  return violations
}

/**
 * T5: 사이즈 변형 높이 토큰이 리터럴 px 인데 같은 값의 spacing 토큰이 존재.
 *
 * 대상은 `--comp-*-height-{size}` 처럼 **사이즈 접미사가 붙은** 것만이다.
 * `--comp-tooltip-arrow-height` 같은 기하 상수는 스페이싱 리듬 위에 있지 않으므로
 * 대상이 아니다 — 화살표 크기는 8px 이라는 도형의 성질이지 간격이 아니다.
 */
export function findLiteralHeightTokens(declarations: TokenDeclaration[]): string[] {
  const spacingByPx = new Map<number, string>()
  for (const d of declarations) {
    if (!d.prop.startsWith('--primitive-spacing-')) continue
    const px = toPx(d.value)
    if (px !== null && !spacingByPx.has(px)) spacingByPx.set(px, d.prop)
  }

  return declarations
    .filter((d) => /^--comp-.+-height-[a-z0-9]+$/.test(d.prop))
    .flatMap((d) => {
      const px = toPx(d.value)
      if (px === null) return []
      const token = spacingByPx.get(px)
      if (!token) return []
      return [`tokens.css:${d.line}  ${d.prop}: ${d.value} → var(${token}) 를 쓴다`]
    })
}

interface ClassRule {
  id: string
  pattern: RegExp
  hint: string
}

/**
 * T6·T7 의 금지 패턴.
 *
 * 문자열 리터럴에만 적용한다 — 주석에 적힌 서술(`… 100ms / ease-out`)을 오탐하지
 * 않기 위해서다.
 */
const FORBIDDEN_CLASS_RULES: ClassRule[] = [
  // T6
  { id: 'T6', pattern: /\btext-\[\d+px\]/, hint: 'typography-{size}-{weight} 를 쓴다' },
  { id: 'T6', pattern: /\bleading-\[\d+px\]/, hint: 'typography 토큰이 line-height 를 함께 설정한다' },
  // T7
  { id: 'T7', pattern: /\b(?:bg|text|border|ring|fill|stroke|from|via|to)-primitive-/, hint: 'semantic 또는 --comp-* 토큰을 쓴다' },
  { id: 'T7', pattern: /\b(?:bg|text|border|ring|fill|stroke|shadow|outline)-\[#/, hint: 'hex 대신 토큰을 쓴다' },
  { id: 'T7', pattern: /\btransition-all\b/, hint: '바뀌는 속성만 지정한다' },
  { id: 'T7', pattern: /\bduration-\d+\b/, hint: 'duration-fast·normal 같은 semantic 토큰을 쓴다' },
  { id: 'T7', pattern: /\bease-(?:in-out|in|out)\b/, hint: 'ease-enter·exit·move·linear 를 쓴다' },
  { id: 'T7', pattern: /\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b/, hint: 'typography-{size}-{weight} 를 쓴다' },
]

/**
 * primitive 팔레트를 직접 쓰도록 허용된 파일. **목록은 줄이기만 한다.**
 *
 * 여기 오르는 순간이 곧 `docs/DEVIATIONS.md` 에 근거를 남겨야 하는 시점이다.
 * primitive 규칙만 면제하며 hex·transition-all·기본 duration/easing/타이포는
 * 그대로 적용된다.
 */
const PRIMITIVE_PALETTE_EXCEPTIONS: Record<string, string> = {
  'src/components/Badge/shared.ts':
    'Badge 는 17색 팔레트 자체가 공개 API(`color="blue"`)다. 색이 의미(성공/경고)가 아니라 ' +
    '분류 라벨이라 semantic 계층에 대응물이 없다. 대신 테마를 따라가지 않는다는 뜻이므로 ' +
    'DEVIATIONS.md 에 기록하고 디자이너 판단을 기다린다.',
}

const isPrimitiveRule = (rule: ClassRule): boolean => /primitive-/.test(rule.pattern.source)

/** T6·T7: 컴포넌트 소스의 클래스 문자열에서 금지 패턴을 찾는다. */
export function findForbiddenClassUsage(files: SourceFile[], ruleId: string): string[] {
  const rules = FORBIDDEN_CLASS_RULES.filter((r) => r.id === ruleId)
  const violations: string[] = []
  for (const file of files) {
    const paletteExempt = file.path in PRIMITIVE_PALETTE_EXCEPTIONS
    for (const { line, value } of extractStringLiterals(file.text)) {
      for (const rule of rules) {
        if (paletteExempt && isPrimitiveRule(rule)) continue
        const match = rule.pattern.exec(value)
        if (match) violations.push(`${file.path}:${line}  "${match[0]}" — ${rule.hint}`)
      }
    }
  }
  return violations
}

function format(title: string, violations: string[]): string {
  if (violations.length === 0) return ''
  return [`${title} (${violations.length}건):`, ...violations.map((v) => `  - ${v}`)].join('\n')
}

/* ─── 실제 소스에 대한 계약 ────────────────────────────────────────────────── */

const tokensCss = readFileSync(TOKENS_CSS, 'utf8')
const indexCss = readFileSync(INDEX_CSS, 'utf8')
/**
 * 컴포넌트 소스. **테스트 파일은 제외한다.**
 *
 * 테스트는 판정기를 검증하려고 `text-[10px]`·`var(--x)` 같은 **가짜 위반을 일부러**
 * 문자열로 넣는다. 그것을 스캔하면 검사가 자기 자신의 미끼에 걸린다.
 */
const componentFiles = readSources(COMPONENTS_DIR, ['.tsx', '.ts']).filter(
  (f) => !/\.test\.tsx?$/.test(f.path),
)
const declarations = collectDeclarations(tokensCss)
const definedNames = new Set(declarations.map((d) => d.prop))
const varsByName = new Map(declarations.map((d) => [d.prop, d.value]))

describe('T1 — var() 무결성', () => {
  it('참조된 모든 커스텀 프로퍼티가 tokens.css 에 정의돼 있다', () => {
    const references = [
      ...extractVarReferences(tokensCss).map((name) => ({ name, where: 'src/tokens/tokens.css' })),
      ...extractVarReferences(indexCss).map((name) => ({ name, where: 'src/index.css' })),
      ...componentFiles.flatMap((f) =>
        extractVarReferences(f.text).map((name) => ({ name, where: f.path })),
      ),
    ]
    expect(format('정의되지 않은 var() 참조', findUndefinedVarReferences(references, definedNames))).toBe('')
  })
})

describe('T2 — :root 스코프', () => {
  it(':root 에서 테마 스코프 semantic 토큰을 참조하지 않는다', () => {
    // :root 는 [data-theme] 바깥이라 테마 색은 아직 값을 갖지 않는다.
    // 참조하면 var() 체인이 끊어져 값이 조용히 비어진다.
    expect(format(':root 에서 끊어지는 semantic 참조', findBrokenSemanticRefsInRoot(declarations))).toBe('')
  })
})

describe('T3 — 테마 정의 완전성', () => {
  it('한 테마에만 있는 토큰은 기본 [data-theme] 에 받침이 있다', () => {
    expect(format('어느 테마에서 미정의가 되는 토큰', checkThemeCompleteness(declarations).missing)).toBe('')
  })

  it('기본을 덮는 테마별 선언이 기본보다 뒤에 있다', () => {
    expect(format('캐스케이드 순서가 뒤집힌 선언', checkThemeCompleteness(declarations).misordered)).toBe('')
  })
})

describe('T4 — 컨트롤 높이 허용 집합', () => {
  it('등록된 컨트롤의 높이가 허용 집합 안에 있다', () => {
    const violations = findControlHeightViolations(declarations, varsByName).map(
      (v) => `${v.control}.${v.variant} = ${v.height}px  [${v.detail}] — 허용: ${ALLOWED_HEIGHTS.join(', ')}`,
    )
    expect(format('허용 집합 밖 컨트롤 높이', violations)).toBe('')
  })

  it('미측정 컨트롤 목록이 무엇이 검증되지 않았는지 드러낸다', () => {
    // 이 단언은 목록을 비우라는 뜻이 아니다. **검증되지 않은 것과 통과한 것을
    // 구분해 두라는 것**이다. 목록이 비어 있지 않은 한 "전부 통과"라고 쓸 수 없다.
    const unmeasured = Object.keys(UNMEASURED_CONTROLS)
    for (const name of unmeasured) {
      expect(UNMEASURED_CONTROLS[name].length).toBeGreaterThan(0)
      expect(CONTROLS[name]).toBe(undefined)
    }
    expect(unmeasured).toEqual(['Checkbox', 'Radio', 'NavVertical'])
  })
})

describe('T5 — 높이 토큰 리터럴', () => {
  it('사이즈 변형 높이가 리터럴 px 대신 spacing 토큰을 참조한다', () => {
    expect(format('spacing 토큰이 있는데 리터럴을 쓴 높이', findLiteralHeightTokens(declarations))).toBe('')
  })
})

describe('T6 — 타이포그래피 arbitrary', () => {
  it('컴포넌트가 text-[Npx]·leading-[Npx] 를 쓰지 않는다', () => {
    expect(format('arbitrary 타이포그래피', findForbiddenClassUsage(componentFiles, 'T6'))).toBe('')
  })
})

describe('T7 — 하드코딩·기본 유틸리티', () => {
  it('primitive 직접 사용·hex·transition-all·기본 duration/easing/타이포가 없다', () => {
    // 예외: `style={{ fontSize }}` 는 CLAUDE.md 가 아이콘 컨테이너에 **요구하는**
    // 패턴이다(외부 아이콘 폰트의 클래스 기반 font-size 를 이기기 위해).
    // 인라인 스타일이므로 클래스 문자열 검사의 대상이 아니며, 여기서 금지하지 않는다.
    expect(format('하드코딩 / 기본 유틸리티', findForbiddenClassUsage(componentFiles, 'T7'))).toBe('')
  })
})

/* ─── 판정 로직 자체 검사 ──────────────────────────────────────────────────── */

describe('판정 로직', () => {
  describe('문자열 리터럴 추출', () => {
    it('주석 안의 내용은 뽑지 않는다', () => {
      const source = ["// duration-100 ease-out 이라고 적힌 주석", "const a = 'p-4'"].join('\n')
      expect(extractStringLiterals(source).map((s) => s.value)).toEqual(['p-4'])
    })

    it('블록 주석도 건너뛰고 줄 번호를 유지한다', () => {
      const source = ['/* text-[10px]', '   여러 줄 */', "const a = 'p-4'"].join('\n')
      const literals = extractStringLiterals(source)
      expect(literals.map((s) => s.value)).toEqual(['p-4'])
      expect(literals[0].line).toBe(3)
    })

    it('템플릿 리터럴과 이스케이프된 따옴표를 견딘다', () => {
      const source = ['const a = `text-[10px]`', "const b = 'it\\'s'"].join('\n')
      expect(extractStringLiterals(source).map((s) => s.value)).toEqual(['text-[10px]', "it\\'s"])
    })
  })

  describe('var() 참조 추출', () => {
    it('동적 조립 참조는 걸러낸다', () => {
      const refs = extractVarReferences('var(--primitive-${shade}) var(--comp-button-height-md)')
      expect(findUndefinedVarReferences(refs.map((name) => ({ name, where: 'x' })), new Set())).toEqual([
        '--comp-button-height-md  (x)',
      ])
    })

    it('--radix-* 는 런타임 주입이라 정의를 요구하지 않는다', () => {
      const refs = extractVarReferences('var(--radix-collapsible-content-height)')
      expect(findUndefinedVarReferences(refs.map((name) => ({ name, where: 'x' })), new Set())).toEqual([])
    })

    it('정의되지 않은 참조를 잡아낸다', () => {
      // 이 저장소에서 실제로 있었던 형태 — 이름이 바뀐 뒤 남은 참조.
      const refs = extractVarReferences('var(--semantic-primary-300)')
      expect(findUndefinedVarReferences(refs.map((name) => ({ name, where: 'x' })), new Set())).toHaveLength(1)
    })
  })

  describe('var() 값 해석', () => {
    it('중첩 참조를 리터럴까지 되푼다', () => {
      const vars = new Map([
        ['--a', 'var(--b)'],
        ['--b', '44px'],
      ])
      expect(toPx(resolveVars('var(--a)', vars))).toBe(44)
    })

    it('fallback 안의 괄호에서 끊기지 않는다', () => {
      const vars = new Map<string, string>()
      expect(resolveVars('var(--missing, calc(1px + 2px))', vars)).toBe('calc(1px + 2px)')
    })

    it('순환 참조에서 무한 루프에 빠지지 않는다', () => {
      const vars = new Map([['--a', 'var(--a)']])
      expect(() => resolveVars('var(--a)', vars)).not.toThrow()
    })
  })

  describe(':root semantic 참조 탐지', () => {
    it('테마 스코프에만 있는 색을 :root 에서 참조하면 잡아낸다', () => {
      const decls = collectDeclarations(
        ':root{--comp-x-bg:var(--semantic-error-500)}[data-theme="light"]{--semantic-error-500:red}',
      )
      expect(findBrokenSemanticRefsInRoot(decls)).toHaveLength(1)
    })

    it(':root 에 정의된 테마 불변 semantic 은 정상이다', () => {
      // duration·easing·scale 이 이 형태다. 같은 스코프라 체인이 끊어지지 않는다.
      const decls = collectDeclarations(
        ':root{--semantic-duration-fast:100ms;--comp-x-t:var(--semantic-duration-fast)}',
      )
      expect(findBrokenSemanticRefsInRoot(decls)).toEqual([])
    })

    it('[data-theme] 안의 테마 색 참조는 정상이다', () => {
      const decls = collectDeclarations(
        '[data-theme]{--comp-x-bg:var(--semantic-error-500)}[data-theme="light"]{--semantic-error-500:red}',
      )
      expect(findBrokenSemanticRefsInRoot(decls)).toEqual([])
    })
  })

  describe('테마 완전성 판정', () => {
    it('받침 없이 한 테마에만 있는 토큰을 잡아낸다', () => {
      const decls = collectDeclarations(
        '[data-theme="light"]{--x:1}[data-theme="dark"]{--x:2;--only-dark:3}',
      )
      expect(checkThemeCompleteness(decls).missing).toHaveLength(1)
    })

    it('기본 [data-theme] 이 받쳐주면 한쪽에만 있어도 정상이다', () => {
      const decls = collectDeclarations(
        '[data-theme="light"]{--x:1}[data-theme="dark"]{--x:2}[data-theme]{--o:0}[data-theme="dark"]{--o:3}',
      )
      expect(checkThemeCompleteness(decls).missing).toEqual([])
    })

    it('기본보다 앞에 선언된 오버라이드를 잡아낸다', () => {
      // 특이성이 같아 순서가 승자를 정한다 — 앞에 두면 조용히 무시된다.
      const decls = collectDeclarations('[data-theme="dark"]{--o:3}[data-theme]{--o:0}')
      expect(checkThemeCompleteness(decls).misordered).toHaveLength(1)
    })
  })

  describe('컨트롤 높이 판정', () => {
    it('레일이 컨트롤이면 아이템 + 패딩×2 로 잰다', () => {
      // 아이템 44 는 허용 집합에 없지만 레일 44+2×2 = 48 은 있다.
      const decls = collectDeclarations(
        ':root{--comp-segment-item-height-lg:44px;--comp-segment-bar-padding-lg:2px}',
      )
      expect(findControlHeightViolations(decls, new Map())).toEqual([])
    })

    it('레일이 집합 밖이면 잡아낸다', () => {
      // 스펙과 토큰이 어긋난 경우의 형태 — 패딩이 4px 이면 레일이 52 가 된다.
      const decls = collectDeclarations(
        ':root{--comp-segment-item-height-lg:44px;--comp-segment-bar-padding-lg:4px}',
      )
      expect(findControlHeightViolations(decls, new Map())[0].height).toBe(52)
    })

    it('레일이 아닌 컨트롤은 선언된 높이를 그대로 본다', () => {
      const decls = collectDeclarations(':root{--comp-button-height-md:41px}')
      expect(findControlHeightViolations(decls, new Map())[0].height).toBe(41)
    })
  })

  describe('높이 리터럴 판정', () => {
    it('같은 값의 spacing 토큰이 있으면 잡아낸다', () => {
      const decls = collectDeclarations(
        ':root{--primitive-spacing-11:44px;--comp-segment-item-height-lg:44px}',
      )
      expect(findLiteralHeightTokens(decls)).toHaveLength(1)
    })

    it('대응하는 spacing 토큰이 없으면 잡지 않는다', () => {
      const decls = collectDeclarations(':root{--comp-x-height-md:41px}')
      expect(findLiteralHeightTokens(decls)).toEqual([])
    })

    it('사이즈 접미사가 없는 기하 상수는 대상이 아니다', () => {
      const decls = collectDeclarations(
        ':root{--primitive-spacing-2:8px;--comp-tooltip-arrow-height:8px}',
      )
      expect(findLiteralHeightTokens(decls)).toEqual([])
    })
  })

  describe('금지 클래스 판정', () => {
    const file = (text: string): SourceFile[] => [{ path: 'x.tsx', text }]

    it('arbitrary 타이포를 잡아낸다', () => {
      expect(findForbiddenClassUsage(file("const a = 'text-[10px] leading-[12px]'"), 'T6')).toHaveLength(2)
    })

    it('주석에 적힌 ease-out 은 오탐하지 않는다', () => {
      expect(findForbiddenClassUsage(file('// 100ms / ease-out 로 맞춘다'), 'T7')).toEqual([])
    })

    it('클래스 문자열의 ease-out 은 잡아낸다', () => {
      expect(findForbiddenClassUsage(file("const a = 'ease-out'"), 'T7')).toHaveLength(1)
    })

    it('프로젝트 semantic easing 은 통과시킨다', () => {
      expect(findForbiddenClassUsage(file("const a = 'ease-enter ease-exit ease-linear'"), 'T7')).toEqual([])
    })

    it('primitive 직접 사용과 hex 를 잡아낸다', () => {
      expect(findForbiddenClassUsage(file("const a = 'bg-primitive-gray-500'"), 'T7')).toHaveLength(1)
      expect(findForbiddenClassUsage(file("const a = 'bg-[#5B4FFF]'"), 'T7')).toHaveLength(1)
    })

    it('팔레트 예외 파일은 primitive 만 면제되고 나머지는 그대로 적용된다', () => {
      const exempt = [{ path: 'src/components/Badge/shared.ts', text: "const a = 'bg-primitive-gray-500 bg-[#5B4FFF]'" }]
      expect(findForbiddenClassUsage(exempt, 'T7')).toHaveLength(1)
      expect(findForbiddenClassUsage(exempt, 'T7')[0]).toContain('#')
    })
  })
})
