#!/usr/bin/env node
/**
 * 문서·스킬·스펙 정합 검사 — `node scripts/docs-check.mjs`
 *
 * 이 저장소의 규칙은 대부분 산문으로 존재하고, 산문은 코드를 따라오지 못해도
 * 아무 소리를 내지 않는다. 실제로 새어나간 것들이 있었다 — 이름이 `emphasized-*`
 * 로 재편된 뒤에도 문서 6곳에 남은 `semantic-primary`, `name` 이 빠진 스킬
 * frontmatter, 구현은 있는데 spec 이 없는 컴포넌트, 삭제된 컴포넌트를 여전히
 * "참조 예시"로 가리키는 스킬 문서. 전부 사람이 읽어서 잡기로 되어 있던 것들이다.
 *
 * ## npm 의존성을 쓰지 않는 이유
 * `docs/` 만 바꾼 작업이 **빌드 없이** 이 검사를 돌릴 수 있어야 한다. 문서 수정에
 * `npm run build` 를 요구하면 검사를 건너뛰는 쪽이 합리적인 선택이 되고, 그 순간
 * 검사는 존재하지 않는 것과 같아진다. 그래서 `node:fs` / `node:path` 만 쓴다.
 *
 * ## 보장하는 것
 * D1 마크다운 상대 링크가 실재하는 파일을 가리킨다
 * D2 스킬 `SKILL.md` frontmatter 에 `name`·`description` 이 있다
 * D3 문서가 언급하는 `semantic-{family}` 패밀리가 `tokens.css` 에 정의돼 있다
 * D4 CLAUDE.md 모션 표와 `tailwind.config.js` 키가 **양방향으로** 일치한다
 * D5 컴포넌트 ↔ spec ↔ 쇼케이스(`SHOWCASE_MAP`·`NAV_GROUPS`) 3자 정합
 * D6 스킬 문서가 코드 스팬으로 가리키는 구체 경로가 실재한다
 *
 * ## 보장하지 않는 것
 * **이름 수준의 정합까지**다. 내용이 옳은지는 보지 않는다 — spec 의 값이 구현과
 * 같은지, 문서의 설명이 최신인지, 링크가 가리키는 문단이 실제로 그 내용인지는
 * 범위 밖이다. 여기서 통과했다는 말은 "가리키는 대상이 존재한다"까지이지
 * "가리키는 내용이 맞다"가 아니다. 보지 못하는 항목은 `UNMEASURED` 에 사유와
 * 함께 적어 두었고, 그 목록이 비어 있지 않은 한 "문서가 전부 옳다"고 쓸 수 없다.
 *
 * 판정 로직은 전부 순수 함수로 분리했다. 실제 저장소가 계약을 만족하는 동안에도
 * 판정기가 고장 나면 이 스크립트는 조용히 통과하는 껍데기가 되므로, 매 실행마다
 * 가짜 입력으로 판정기가 위반을 잡아내는지 **먼저** 검사한다(`판정기 자체 검사`).
 * 자체 검사가 하나라도 실패하면 본 검사 결과와 무관하게 exit 1 이다.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/* ─── 파일 수집 ────────────────────────────────────────────────────────────── */

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage'])

/** 디렉터리를 재귀로 훑어 조건에 맞는 파일의 **저장소 상대 경로**를 모은다. */
function walk(relDir, accept, out = []) {
  const absDir = join(REPO_ROOT, relDir)
  if (!existsSync(absDir)) return out
  for (const entry of readdirSync(absDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue
      walk(join(relDir, entry.name), accept, out)
      continue
    }
    const relPath = join(relDir, entry.name)
    if (accept(relPath)) out.push(relPath)
  }
  return out
}

const isMarkdown = (path) => path.endsWith('.md')
const readRepoFile = (relPath) => readFileSync(join(REPO_ROOT, relPath), 'utf8')
const existsInRepo = (relPath) => existsSync(join(REPO_ROOT, relPath))

/**
 * 검사 대상 마크다운. `scripts/` 의 조사 메모처럼 제품 문서가 아닌 것은 뺀다.
 * `.github/**` 는 지금 `.md` 가 0건이지만, 나중에 생길 문서가 자동으로 들어오도록
 * 목록에 둔다 — 새 문서가 검사 밖에서 태어나는 것이 가장 조용한 누락이다.
 */
const MARKDOWN_ROOTS = ['CLAUDE.md', 'README.md', 'docs', '.claude/skills', '.github']

function listCheckedMarkdown() {
  const out = []
  for (const root of MARKDOWN_ROOTS) {
    const abs = join(REPO_ROOT, root)
    if (!existsSync(abs)) continue
    if (statSync(abs).isDirectory()) out.push(...walk(root, isMarkdown))
    else if (isMarkdown(root)) out.push(root)
  }
  return out.sort()
}

/* ─── 공통 텍스트 헬퍼 ─────────────────────────────────────────────────────── */

/**
 * JS 소스에서 주석을 지운다. 따옴표 안은 건드리지 않는다.
 *
 * 순진하게 `//` 부터 줄 끝을 지우면 `'https://…'` 같은 문자열이 잘려 나가고,
 * 그 뒤의 중괄호 균형이 깨져 블록 추출이 엉뚱한 곳에서 끝난다.
 */
export function stripJsComments(source) {
  let out = ''
  let i = 0
  while (i < source.length) {
    const ch = source[i]
    if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i += 1
      continue
    }
    if (ch === '/' && source[i + 1] === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i += 1
      i += 2
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch
      out += ch
      i += 1
      while (i < source.length) {
        out += source[i]
        if (source[i] === '\\') {
          out += source[i + 1] ?? ''
          i += 2
          continue
        }
        if (source[i] === quote) {
          i += 1
          break
        }
        i += 1
      }
      continue
    }
    out += ch
    i += 1
  }
  return out
}

/**
 * `label` 뒤에 오는 객체/배열 리터럴 본문을 통째로 꺼낸다.
 *
 * `skipTo` 는 여는 괄호를 찾기 전에 반드시 지나야 하는 문자다. TS 선언에서
 * **타입 주석이 먼저 괄호를 연다** — `const SHOWCASE_MAP: Record<string, { … }> = {`
 * 의 첫 `{` 는 값이 아니라 타입이고, `const NAV_GROUPS: NavGroup[] = [` 의 첫 `[`
 * 는 배열 값이 아니라 `NavGroup[]` 의 대괄호다. `skipTo: '='` 로 대입을 지난
 * 뒤부터 찾아야 값 리터럴을 집는다.
 *
 * 찾지 못하면 빈 문자열이 아니라 `null` 을 돌려준다. 빈 문자열을 돌려주면
 * "키가 0개"로 읽혀 검사가 조용히 통과한다 — 파서가 소스 변경을 못 따라간
 * 순간이야말로 시끄럽게 실패해야 하는 지점이다.
 */
export function extractLiteralBlock(source, label, { open = '{', close = '}', skipTo = null } = {}) {
  const labelIndex = source.indexOf(label)
  if (labelIndex === -1) return null

  let searchFrom = labelIndex + label.length
  if (skipTo !== null) {
    const skipIndex = source.indexOf(skipTo, searchFrom)
    if (skipIndex === -1) return null
    searchFrom = skipIndex + skipTo.length
  }

  const start = source.indexOf(open, searchFrom)
  if (start === -1) return null

  let depth = 0
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === open) depth += 1
    else if (source[i] === close) {
      depth -= 1
      if (depth === 0) return source.slice(start + 1, i)
    }
  }
  return null
}

/** 실패 메시지에 위반을 **전부** 싣는다. 개수만 알면 고칠 수가 없다. */
function formatViolations(violations) {
  return violations.map((v) => `    - ${v}`).join('\n')
}

/* ─── D1 · 마크다운 상대 링크 무결성 ──────────────────────────────────────── */

/** 저장소 밖을 가리키거나 파일 시스템 대상이 아닌 링크. 경로 검사의 대상이 아니다. */
const isExternalTarget = (target) =>
  /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//') || target.startsWith('#')

/**
 * 한 줄에서 인라인 링크의 **상대 경로 대상**만 뽑는다.
 *
 * 앵커(`#…`)와 쿼리는 파일 경로가 아니므로 떼어낸다. `[…](path "title")` 형태의
 * 제목도 경로가 아니므로 버린다.
 */
export function extractRelativeLinkTargets(line) {
  const out = []
  for (const match of line.matchAll(/\]\(\s*(<[^>]*>|[^()\s]+)(?:\s+["'][^"']*["'])?\s*\)/g)) {
    const raw = match[1].replace(/^<|>$/g, '')
    if (raw === '' || isExternalTarget(raw)) continue
    const path = raw.split('#')[0].split('?')[0]
    if (path === '') continue
    let decoded = path
    try {
      decoded = decodeURIComponent(path)
    } catch {
      // 퍼센트 인코딩이 깨진 링크는 원문 그대로 검사한다 — 어차피 존재하지 않는다.
    }
    out.push(decoded)
  }
  return out
}

function checkMarkdownLinks(markdownFiles) {
  const violations = []
  let examined = 0
  for (const file of markdownFiles) {
    const lines = readRepoFile(file).split('\n')
    lines.forEach((line, index) => {
      for (const target of extractRelativeLinkTargets(line)) {
        examined += 1
        const resolved = relative(REPO_ROOT, resolve(REPO_ROOT, dirname(file), target))
        if (existsInRepo(resolved)) continue
        violations.push(`${file}:${index + 1}  ${target} → ${resolved} 가 없다`)
      }
    })
  }
  return { examined, unit: '개 링크', violations }
}

/* ─── D2 · 스킬 frontmatter ────────────────────────────────────────────────── */

/** 모든 `SKILL.md` 가 가져야 하는 frontmatter 키. */
const REQUIRED_FRONTMATTER_KEYS = ['name', 'description']

/**
 * frontmatter 블록을 열고 닫는 `---` 사이에서 최상위 키를 읽는다.
 *
 * YAML 파서를 쓰지 않는 이유는 의존성 0 을 지키기 위해서다. 그래서 중첩 구조는
 * 읽지 못하지만, 요구하는 키가 전부 최상위 스칼라라 충분하다.
 */
export function checkSkillFrontmatter(text) {
  const lines = text.split('\n')
  if (lines[0]?.trim() !== '---') return ['frontmatter 블록(`---`)으로 시작하지 않는다']

  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  if (closing === -1) return ['frontmatter 블록이 닫히지 않았다 (`---` 누락)']

  const found = new Map()
  for (const line of lines.slice(1, closing)) {
    const match = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line)
    if (match) found.set(match[1], match[2].trim())
  }

  return REQUIRED_FRONTMATTER_KEYS.flatMap((key) => {
    if (!found.has(key)) return [`frontmatter 에 \`${key}\` 이(가) 없다`]
    if (found.get(key) === '') return [`frontmatter 의 \`${key}\` 값이 비어 있다`]
    return []
  })
}

function checkSkillFrontmatters() {
  const files = walk('.claude/skills', (path) => path.endsWith('SKILL.md')).sort()
  const violations = []
  for (const file of files) {
    for (const problem of checkSkillFrontmatter(readRepoFile(file))) {
      violations.push(`${file}:1  ${problem}`)
    }
  }
  return { examined: files.length, unit: '개 SKILL.md', violations }
}

/* ─── D3 · 문서가 언급하는 semantic 패밀리 ────────────────────────────────── */

/**
 * D3 대상에서 빼는 문서. **이 결함 자체를 서술하는** 문서라 언급이 정상이다.
 *
 * 두 문서는 "`semantic-primary` 가 존재하지 않는데 문서 6곳에 남아 있다"는 사실을
 * 기록하는 자리다. 결함을 기록한 문장이 그 결함으로 잡히면, 기록을 지우는 것이
 * 검사를 통과시키는 가장 쉬운 길이 된다 — 검사가 기록을 없애는 압력이 되는 셈이다.
 * **목록은 줄이기만 한다.** 새 문서를 여기 올리는 순간이 곧 승인을 받아야 하는 시점이다.
 */
const D3_EXEMPT_DOCS = ['docs/QUALITY_GATES_PLAN.md', 'docs/DEVIATIONS.md']

/** `semantic-{family}-{shade}` 언급에서 패밀리를 뽑는다. 셰이드는 숫자 꼬리다. */
const SEMANTIC_MENTION = /semantic-([a-z][a-z0-9-]*?)-(\d+)(?![\w-])/g

export function extractSemanticFamilies(text) {
  const out = []
  for (const match of text.matchAll(SEMANTIC_MENTION)) {
    out.push({ family: match[1], mention: `semantic-${match[1]}-${match[2]}` })
  }
  return out
}

/** `tokens.css` 에 `--semantic-{family}-{shade}` 로 실제 선언된 패밀리 집합. */
export function collectDefinedSemanticFamilies(tokensCss) {
  const families = new Set()
  for (const match of tokensCss.matchAll(/--semantic-([a-z][a-z0-9-]*?)-(\d+)(?![\w-])\s*:/g)) {
    families.add(match[1])
  }
  return families
}

function checkSemanticFamilyMentions(markdownFiles, definedFamilies) {
  const violations = []
  let examined = 0
  for (const file of markdownFiles) {
    if (D3_EXEMPT_DOCS.includes(file)) continue
    readRepoFile(file)
      .split('\n')
      .forEach((line, index) => {
        for (const { family, mention } of extractSemanticFamilies(line)) {
          examined += 1
          if (definedFamilies.has(family)) continue
          violations.push(
            `${file}:${index + 1}  ${mention} → tokens.css 에 --semantic-${family}-* 패밀리가 없다`,
          )
        }
      })
  }
  return { examined, unit: '개 토큰 언급', violations }
}

/* ─── D4 · 모션 표 ↔ Tailwind config ──────────────────────────────────────── */

/**
 * 문서의 모션 표에 싣지 않는 config 키를 가려내는 규칙.
 *
 * `comp-switch-toggle` 은 Switch 하나의 토글 곡선(Material decelerate)이다.
 * `ease-[var(--comp-switch-easing-toggle)]` 라는 arbitrary 형태가 cubic-bezier 의
 * 쉼표 때문에 파싱되지 않아 **이름 있는 키가 어쩔 수 없이 필요해서** 생긴 것이지,
 * 공용 어휘를 넓히려던 것이 아니다. CLAUDE.md 의 모션 표는 "어느 컴포넌트에서나
 * 골라 쓰는 어휘"를 싣는 자리라, 컴포넌트 전용 곡선을 여기 올리면 아무 데나 써도
 * 되는 값으로 읽힌다.
 *
 * 목록이 아니라 **접두사 규칙**으로 판정한다 — 새 컴포넌트 전용 곡선이 생겨도
 * 예외 목록을 늘리지 않아도 되고, 반대로 `comp-` 를 붙이지 않은 공용 키는
 * 문서에 실리도록 계속 강제된다.
 */
const isComponentScopedMotionKey = (key) => key.startsWith('comp-')

/** CLAUDE.md 모션 표 행에서 `duration-*`·`ease-*` 항목을 뽑는다. */
export function extractMotionTableKeys(markdown) {
  const durations = []
  const easings = []
  for (const line of markdown.split('\n')) {
    const match = /^\|\s*`(duration|ease)-([a-z0-9-]+)`\s*\|/.exec(line.trim())
    if (!match) continue
    ;(match[1] === 'duration' ? durations : easings).push(match[2])
  }
  return { durations, easings }
}

/** 객체 리터럴 본문에서 최상위 키 이름을 뽑는다. 따옴표 유무를 모두 받는다. */
export function extractObjectKeys(blockBody) {
  const keys = []
  let depth = 0
  for (const rawLine of blockBody.split('\n')) {
    const line = rawLine.trim()
    if (depth === 0) {
      const match = /^(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$-]*))\s*:/.exec(line)
      if (match) keys.push(match[1] ?? match[2] ?? match[3])
    }
    for (const ch of line) {
      if (ch === '{' || ch === '[') depth += 1
      else if (ch === '}' || ch === ']') depth -= 1
    }
  }
  return keys
}

/** 양쪽에만 있는 항목을 각각 돌려준다. 한쪽에만 있으면 위반이다. */
export function diffKeySets(docKeys, configKeys) {
  const docs = new Set(docKeys)
  const config = new Set(configKeys)
  return {
    missingInConfig: [...docs].filter((key) => !config.has(key)).sort(),
    missingInDocs: [...config].filter((key) => !docs.has(key)).sort(),
  }
}

function checkMotionTable() {
  const violations = []
  const table = extractMotionTableKeys(readRepoFile('CLAUDE.md'))
  const config = stripJsComments(readRepoFile('tailwind.config.js'))

  const durationBlock = extractLiteralBlock(config, 'transitionDuration:')
  const easingBlock = extractLiteralBlock(config, 'transitionTimingFunction:')

  // 파서가 소스를 못 따라간 경우를 조용히 통과시키지 않는다.
  if (table.durations.length === 0 || table.easings.length === 0) {
    violations.push('CLAUDE.md 에서 모션 표 행을 찾지 못했다 — 표 형식이 바뀌었다면 파서를 고쳐라')
  }
  if (durationBlock === null) violations.push('tailwind.config.js 에서 transitionDuration 블록을 찾지 못했다')
  if (easingBlock === null) violations.push('tailwind.config.js 에서 transitionTimingFunction 블록을 찾지 못했다')

  const configDurations = durationBlock === null ? [] : extractObjectKeys(durationBlock)
  const configEasings =
    easingBlock === null
      ? []
      : extractObjectKeys(easingBlock).filter((key) => !isComponentScopedMotionKey(key))

  if (durationBlock !== null && configDurations.length === 0) {
    violations.push('tailwind.config.js 의 transitionDuration 에서 키를 하나도 읽지 못했다 — 파서를 고쳐라')
  }
  if (easingBlock !== null && configEasings.length === 0) {
    violations.push('tailwind.config.js 의 transitionTimingFunction 에서 공용 키를 하나도 읽지 못했다 — 파서를 고쳐라')
  }

  const durationDiff = diffKeySets(table.durations, configDurations)
  for (const key of durationDiff.missingInConfig) {
    violations.push(`duration-${key} — CLAUDE.md 표에만 있고 tailwind.config.js 에 없다`)
  }
  for (const key of durationDiff.missingInDocs) {
    violations.push(`duration-${key} — tailwind.config.js 에만 있고 CLAUDE.md 표에 없다`)
  }

  const easingDiff = diffKeySets(table.easings, configEasings)
  for (const key of easingDiff.missingInConfig) {
    violations.push(`ease-${key} — CLAUDE.md 표에만 있고 tailwind.config.js 에 없다`)
  }
  for (const key of easingDiff.missingInDocs) {
    violations.push(`ease-${key} — tailwind.config.js 에만 있고 CLAUDE.md 표에 없다`)
  }

  const examined =
    table.durations.length + table.easings.length + configDurations.length + configEasings.length
  return { examined, unit: '개 모션 키', violations }
}

/* ─── D5 · specs ↔ components ↔ showcase 3자 정합 ─────────────────────────── */

/**
 * 컴포넌트 디렉터리 ↔ spec ↔ 쇼케이스 id 의 **명시적** 매핑.
 *
 * 이름이 1:1 이 아니라서 추론할 수 없다 — `Button/` 한 디렉터리가 `button` 과
 * `icon-button` 두 쇼케이스를 가지면서 spec 은 `button.json` 하나이고, `Chip/` 은
 * spec 도 쇼케이스도 둘이다. 규칙으로 유도하려 들면 규칙이 예외를 흡수하다가
 * 아무것도 못 잡는 형태가 된다. 그래서 **손으로 유지한다.**
 *
 * **새 컴포넌트를 만들면 여기 등록한다.** 등록하지 않으면 아래 (a) 가 잡는다 —
 * 검사가 있다는 사실만으로 안심하는 상태를 만들지 않기 위해서다.
 *
 * `specs` 는 spec 파일의 `component` 필드 값이다(파일명이 아니다).
 */
const COMPONENT_TRIAD = {
  Badge: { specs: ['Badge'], showcases: ['badge'] },
  // IconButton 은 Button 과 토큰·구조를 공유해 같은 디렉터리에 있고 spec 도 button.json 하나다.
  Button: { specs: ['Button'], showcases: ['button', 'icon-button'] },
  Callout: { specs: ['Callout'], showcases: ['callout'] },
  Checkbox: { specs: ['Checkbox'], showcases: ['checkbox'] },
  Chip: { specs: ['ChipUniversal', 'ChipBadgeLike'], showcases: ['chip-universal', 'chip-badgelike'] },
  NavVertical: { specs: ['NavVertical'], showcases: ['nav-vertical'] },
  Radio: { specs: ['Radio'], showcases: ['radio'] },
  SegmentBar: { specs: ['SegmentBar'], showcases: ['segment-bar'] },
  Skeleton: { specs: ['Skeleton'], showcases: ['skeleton'] },
  Switch: { specs: ['Switch'], showcases: ['switch'] },
  Tab: { specs: ['Tab'], showcases: ['tab'] },
  TextButton: { specs: ['TextButton'], showcases: ['text-button'] },
  Tooltip: { specs: ['Tooltip'], showcases: ['tooltip'] },
}

/** 컴포넌트가 아닌 쇼케이스. 토큰 카탈로그와 블록 카탈로그는 대응 컴포넌트가 없다. */
const COMPONENTLESS_SHOWCASES = ['tokens', 'block-catalog']

/** `src/components/` 아래이지만 컴포넌트가 아닌 디렉터리. */
const NON_COMPONENT_DIRS = ['icons', 'showcase-layout']

/** spec 템플릿. `component` 가 `"ComponentName"` 인 자리 표시자라 대조 대상이 아니다. */
const SPEC_TEMPLATE = '_TEMPLATE.json'

/**
 * `Chip.Universal` 과 `ChipUniversal` 처럼 표기만 다른 같은 이름을 같게 본다.
 * 표기 차이로 위반을 내면 진짜 누락이 표기 소음에 묻힌다.
 */
export const normalizeSymbol = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

/** `SHOWCASE_MAP` 의 키. 블록을 못 찾으면 `null` — 조용히 0개로 통과시키지 않는다. */
export function extractShowcaseMapKeys(appSource) {
  const block = extractLiteralBlock(stripJsComments(appSource), 'const SHOWCASE_MAP', { skipTo: '=' })
  if (block === null) return null
  // 0개는 "정합한다"가 아니라 파서가 소스를 못 따라갔다는 뜻이다 — 쇼케이스가
  // 0개인 상태는 이 저장소에 존재하지 않는다. 빈 배열을 돌려주면 3자 정합이 통째로 통과한다.
  const keys = [...block.matchAll(/'([a-z0-9-]+)'\s*:/g)].map((m) => m[1])
  return keys.length === 0 ? null : keys
}

/** `NAV_GROUPS` 의 항목 id. */
export function extractNavGroupIds(sidebarSource) {
  const block = extractLiteralBlock(stripJsComments(sidebarSource), 'const NAV_GROUPS', {
    open: '[',
    close: ']',
    skipTo: '=',
  })
  if (block === null) return null
  const ids = [...block.matchAll(/\bid:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])
  return ids.length === 0 ? null : ids
}

/**
 * 3자 정합 판정. 입력을 전부 인자로 받아 파일 시스템과 분리한다 —
 * 그래야 가짜 입력으로 판정기가 실제로 위반을 잡는지 확인할 수 있다.
 */
export function findTriadViolations({ componentDirs, specComponents, showcaseIds, navIds }) {
  const violations = []
  const registered = Object.keys(COMPONENT_TRIAD)
  const specSet = new Set(specComponents.map((s) => normalizeSymbol(s.component)))

  // (a) 디렉터리가 매핑 표에 등록돼 있는가 — 등록하지 않으면 검사가 아예 보지 않는다.
  for (const dir of componentDirs) {
    if (!registered.includes(dir)) {
      violations.push(`src/components/${dir}/ 가 COMPONENT_TRIAD 에 등록되지 않았다`)
    }
  }
  // (b) 표에 있는데 디렉터리가 사라진 경우.
  for (const name of registered) {
    if (!componentDirs.includes(name)) {
      violations.push(`COMPONENT_TRIAD 의 ${name} 에 대응하는 src/components/${name}/ 가 없다`)
    }
  }

  const claimedShowcases = new Set(COMPONENTLESS_SHOWCASES)
  for (const name of registered) {
    const entry = COMPONENT_TRIAD[name]

    // (c) spec 존재
    for (const symbol of entry.specs) {
      if (!specSet.has(normalizeSymbol(symbol))) {
        violations.push(`${name} — "component": "${symbol}" 인 specs/*.json 이 없다`)
      }
    }

    for (const id of entry.showcases) {
      claimedShowcases.add(id)
      // (d) 쇼케이스 등록
      if (!showcaseIds.includes(id)) {
        violations.push(`${name} — SHOWCASE_MAP 에 '${id}' 항목이 없다 (src/App.tsx)`)
      }
      // (e) 사이드바 등록
      if (!navIds.includes(id)) {
        violations.push(`${name} — NAV_GROUPS 에 '${id}' 항목이 없다 (Sidebar.tsx)`)
      }
    }
  }

  // (f) SHOWCASE_MAP ↔ NAV_GROUPS 양방향
  for (const id of showcaseIds) {
    if (!navIds.includes(id)) violations.push(`'${id}' — SHOWCASE_MAP 에만 있고 NAV_GROUPS 에 없다`)
    if (!claimedShowcases.has(id)) {
      violations.push(`'${id}' — SHOWCASE_MAP 에 있으나 COMPONENT_TRIAD 어디에도 속하지 않는다`)
    }
  }
  for (const id of navIds) {
    if (!showcaseIds.includes(id)) violations.push(`'${id}' — NAV_GROUPS 에만 있고 SHOWCASE_MAP 에 없다`)
  }

  // (g) 어느 컴포넌트도 청구하지 않은 spec — 이름이 바뀐 뒤 남은 파일을 잡는다.
  const claimedSpecs = new Set(
    registered.flatMap((name) => COMPONENT_TRIAD[name].specs.map(normalizeSymbol)),
  )
  for (const { file, component } of specComponents) {
    if (!claimedSpecs.has(normalizeSymbol(component))) {
      violations.push(`${file} — "component": "${component}" 를 청구하는 컴포넌트가 COMPONENT_TRIAD 에 없다`)
    }
  }

  return violations
}

function checkShowcaseTriad() {
  const violations = []

  const componentDirs = readdirSync(join(REPO_ROOT, 'src/components'), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !NON_COMPONENT_DIRS.includes(e.name))
    .map((e) => e.name)
    .sort()

  const specComponents = []
  for (const name of readdirSync(join(REPO_ROOT, 'specs')).sort()) {
    if (!name.endsWith('.json') || name === SPEC_TEMPLATE) continue
    const file = `specs/${name}`
    try {
      const parsed = JSON.parse(readRepoFile(file))
      const component = parsed?.component ?? parsed?.meta?.component
      if (typeof component !== 'string') {
        violations.push(`${file} — 최상위 "component" 필드가 없다`)
        continue
      }
      specComponents.push({ file, component })
    } catch (error) {
      violations.push(`${file} — JSON 파싱 실패: ${error.message}`)
    }
  }

  const showcaseIds = extractShowcaseMapKeys(readRepoFile('src/App.tsx'))
  const navIds = extractNavGroupIds(readRepoFile('src/components/showcase-layout/Sidebar.tsx'))

  if (showcaseIds === null) {
    violations.push('src/App.tsx 에서 SHOWCASE_MAP 의 키를 하나도 읽지 못했다 — 파서를 고쳐라')
  }
  if (navIds === null) {
    violations.push('Sidebar.tsx 에서 NAV_GROUPS 의 id 를 하나도 읽지 못했다 — 파서를 고쳐라')
  }

  violations.push(
    ...findTriadViolations({
      componentDirs,
      specComponents,
      showcaseIds: showcaseIds ?? [],
      navIds: navIds ?? [],
    }),
  )

  const examined =
    componentDirs.length + specComponents.length + (showcaseIds?.length ?? 0) + (navIds?.length ?? 0)
  return { examined, unit: '개 심볼(디렉터리+spec+쇼케이스+메뉴)', violations }
}

/* ─── D6 · 스킬 문서가 참조하는 소스 경로 ─────────────────────────────────── */

/**
 * 플레이스홀더·glob 판정 규칙.
 *
 * 스킬 문서는 "`src/components/{Name}/{Name}.tsx` 를 만든다"처럼 **채워 넣을 자리**
 * 를 적는 문서라, 구체 경로와 자리 표시자가 한 파일에 섞인다. 자리 표시자를
 * 실재 검사에 넣으면 오탐이 쏟아지고, 오탐을 예외 목록으로 무마하면 목록이
 * 곧 검사를 대체한다. 그래서 **문자 규칙으로** 가른다 — 오탐이 나오면 예외를
 * 추가하는 것이 아니라 이 규칙을 넓힌다.
 *
 * 자리 표시자로 보는 것:
 * - `*`  glob (`docs/**`, `src/components/{Name}/*.tsx`)
 * - `{` `}`  치환 자리 (`{Name}`, `{component}`)
 * - `$`  인자 치환 (`$ARGUMENTS`)
 * - `<` `>`  꺾쇠 자리 표시자
 * - `?`  glob 한 글자
 * - `…` / `...`  생략
 */
const PLACEHOLDER_MARKERS = ['*', '{', '}', '$', '<', '>', '?', '…', '...']

export const isPlaceholderPath = (path) => PLACEHOLDER_MARKERS.some((mark) => path.includes(mark))

/** 검사 대상 경로 접두사. 저장소 안의 실제 디렉터리만 본다. */
const SOURCE_PATH_ROOTS = ['src', 'specs', 'docs']

const PATH_TOKEN = new RegExp(
  String.raw`\b(?:${SOURCE_PATH_ROOTS.join('|')})\/[A-Za-z0-9_./{}$*<>?…-]*`,
  'g',
)

/**
 * 마크다운의 코드 스팬(인라인 `` ` `` 과 펜스 블록) 안에서 경로 토큰을 뽑는다.
 *
 * 산문에서 뽑지 않는 이유: 문장 안의 `docs/` 같은 조각은 경로가 아니라 지시어로
 * 쓰이고, 조사가 붙어(`src/에`) 토큰 경계가 무너진다. 코드 스팬은 필자가 "이건
 * 그대로 쓰는 문자열"이라고 표시한 자리라 판정 근거가 분명하다.
 *
 * 펜스 블록도 포함한다 — 스킬 문서의 구조 예시(`src/components/{Name}/index.ts`)와
 * import 예시가 거기 있고, 그중 구체 경로는 실재해야 한다.
 */
export function extractCodeSpanPaths(markdown) {
  const out = []
  let inFence = false
  markdown.split('\n').forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return
    }
    const codeTexts = inFence ? [line] : [...line.matchAll(/`([^`\n]+)`/g)].map((m) => m[1])
    for (const text of codeTexts) {
      for (const match of text.matchAll(PATH_TOKEN)) {
        // 산문 끝의 마침표·쉼표가 붙어 오는 것만 걷어낸다. 확장자의 점은 남는다.
        const path = match[0].replace(/[.,]+$/, '')
        if (path !== '') out.push({ line: index + 1, path })
      }
    }
  })
  return out
}

function checkSkillSourcePaths() {
  const files = walk('.claude/skills', isMarkdown).sort()
  const violations = []
  let examined = 0
  let placeholders = 0

  for (const file of files) {
    for (const { line, path } of extractCodeSpanPaths(readRepoFile(file))) {
      if (isPlaceholderPath(path)) {
        placeholders += 1
        continue
      }
      examined += 1
      // 디렉터리 참조(`src/tokens/`)도 실재해야 한다. existsSync 가 둘 다 본다.
      if (existsInRepo(path.replace(/\/$/, ''))) continue
      violations.push(`${file}:${line}  ${path} 가 없다`)
    }
  }
  return {
    examined,
    unit: `개 구체 경로 (자리 표시자 ${placeholders}개 제외)`,
    violations,
  }
}

/* ─── 검사가 보지 못하는 것 ───────────────────────────────────────────────── */

/**
 * **검증되지 않은 것이지 통과한 것이 아니다.**
 * 이 목록이 비어 있지 않은 한 "문서 정합이 전부 확인됐다"고 쓸 수 없다.
 */
const UNMEASURED = {
  '링크 앵커(#…)':
    'D1 은 파일 존재만 본다. 앵커가 실제 제목을 가리키는지는 슬러그 규칙이 렌더러마다 달라 판정하지 않는다.',
  '참조 스타일 링크·HTML <a href>':
    'D1 은 인라인 링크(`](path)`)만 본다. 현재 저장소에 다른 형태가 0건이라 미구현으로 둔다.',
  'semantic 셰이드 번호':
    'D3 은 패밀리까지만 본다. `semantic-text-on-bright-777` 처럼 패밀리는 있으나 셰이드가 없는 언급은 잡히지 않는다.',
  'spec 내용 ↔ 구현 값':
    'D5 는 이름 수준의 3자 정합만 본다. spec 의 사이즈·색 값이 tokens.css 와 같은지는 보지 않는다.',
  '산문 속 경로':
    'D6 은 코드 스팬 안만 본다. 문장 안에 백틱 없이 적힌 경로는 조사가 붙어 토큰 경계를 확정할 수 없다.',
}

/* ─── 판정기 자체 검사 ────────────────────────────────────────────────────── */

const selfTests = []
const selfTest = (name, fn) => selfTests.push({ name, fn })

function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) throw new Error(`${message}\n      기대: ${e}\n      실제: ${a}`)
}

selfTest('D1 — 상대 링크만 뽑고 앵커를 떼어낸다', () => {
  assertEqual(
    extractRelativeLinkTargets('[a](./x.md#anchor) [b](https://e.com) [c](#local) [d](../y.md)'),
    ['./x.md', '../y.md'],
    '외부·앵커 전용 링크는 경로 검사 대상이 아니다',
  )
})

selfTest('D1 — 제목이 붙은 링크와 꺾쇠 링크를 견딘다', () => {
  assertEqual(
    extractRelativeLinkTargets('[a](./x.md "제목") [b](<./y z.md>)'),
    ['./x.md', './y z.md'],
    '제목은 경로가 아니고 꺾쇠는 경로의 일부가 아니다',
  )
})

selfTest('D1 — mailto: 는 파일 경로가 아니다', () => {
  assertEqual(extractRelativeLinkTargets('[a](mailto:x@y.z)'), [], 'mailto 는 건너뛴다')
})

selfTest('D2 — name 이 없는 frontmatter 를 잡아낸다', () => {
  const problems = checkSkillFrontmatter('---\ndescription: "x"\n---\n# 제목\n')
  assertEqual(problems.length, 1, 'name 누락 1건')
})

selfTest('D2 — 값이 빈 키도 잡아낸다', () => {
  const problems = checkSkillFrontmatter('---\nname:\ndescription: "x"\n---\n')
  assertEqual(problems.length, 1, '빈 값 1건')
})

selfTest('D2 — frontmatter 가 아예 없으면 잡아낸다', () => {
  assertEqual(checkSkillFrontmatter('# 제목만 있는 문서\n').length, 1, 'frontmatter 누락')
})

selfTest('D2 — 두 키가 모두 있으면 통과한다', () => {
  assertEqual(checkSkillFrontmatter('---\nname: x\ndescription: y\n---\n'), [], '정상 frontmatter')
})

selfTest('D3 — 여러 마디 패밀리를 끝까지 읽는다', () => {
  assertEqual(
    extractSemanticFamilies('bg-semantic-emphasized-purple-300 text-semantic-primary-500').map(
      (m) => m.family,
    ),
    ['emphasized-purple', 'primary'],
    '셰이드는 마지막 숫자 마디다',
  )
})

selfTest('D3 — 숫자 셰이드가 없는 언급은 대상이 아니다', () => {
  assertEqual(extractSemanticFamilies('--semantic-duration-fast'), [], '셰이드 없는 토큰은 무시')
})

selfTest('D3 — tokens.css 에 없는 패밀리를 잡아낸다', () => {
  const defined = collectDefinedSemanticFamilies(
    '[data-theme]{--semantic-emphasized-purple-300: red;}',
  )
  assertEqual([...defined], ['emphasized-purple'], '선언에서 패밀리를 뽑는다')
  assertEqual(defined.has('primary'), false, '재편으로 사라진 패밀리는 없다고 나와야 한다')
})

selfTest('D4 — 모션 표 행만 읽고 산문의 duration 언급은 무시한다', () => {
  const md = [
    '- Do NOT use `duration-100`, `ease-out`',
    '| `duration-fast` | 100ms | hover |',
    '| `ease-enter` | ease-out | enter |',
  ].join('\n')
  assertEqual(extractMotionTableKeys(md), { durations: ['fast'], easings: ['enter'] }, '표 행만')
})

selfTest('D4 — 따옴표 있는 키와 없는 키를 모두 읽는다', () => {
  assertEqual(
    extractObjectKeys("\n  fast: 'a',\n  'comp-switch-toggle': 'b',\n"),
    ['fast', 'comp-switch-toggle'],
    '두 표기 모두 키다',
  )
})

selfTest('D4 — 중첩 객체의 안쪽 키는 최상위 키가 아니다', () => {
  assertEqual(extractObjectKeys('\n  outer: {\n    inner: 1,\n  },\n  next: 2,\n'), ['outer', 'next'], '깊이 0만')
})

selfTest('D4 — 한쪽에만 있는 키를 양방향으로 잡아낸다', () => {
  assertEqual(
    diffKeySets(['fast', 'onlyDocs'], ['fast', 'onlyConfig']),
    { missingInConfig: ['onlyDocs'], missingInDocs: ['onlyConfig'] },
    '양방향 차집합',
  )
})

selfTest('D4 — 컴포넌트 전용 easing 은 문서 표에 실리지 않아도 된다', () => {
  assertEqual(isComponentScopedMotionKey('comp-switch-toggle'), true, 'comp- 접두사')
  assertEqual(isComponentScopedMotionKey('enter'), false, '공용 키는 예외가 아니다')
})

selfTest('D5 — 선언 자체가 사라지면 null 이다', () => {
  assertEqual(extractShowcaseMapKeys('const OTHER = {}'), null, '이름이 바뀌면 시끄럽게 실패한다')
  assertEqual(extractNavGroupIds('const OTHER = []'), null, '이름이 바뀌면 시끄럽게 실패한다')
})

selfTest('D5 — TS 타입 주석의 괄호를 값 리터럴로 오인하지 않는다', () => {
  // 실제로 이 스크립트를 처음 돌렸을 때 잡힌 형태다. `Record<string, { … }>` 의
  // 첫 `{` 를 값으로 집으면 키가 0개로 읽히고, 3자 정합 전체가 조용히 통과한다.
  assertEqual(
    extractShowcaseMapKeys("const SHOWCASE_MAP: Record<string, { c: T }> = {\n  'button': { c: X },\n}"),
    ['button'],
    '타입 주석을 지나 값 리터럴을 집는다',
  )
  assertEqual(
    extractNavGroupIds("export const NAV_GROUPS: NavGroup[] = [{ items: [{ id: 'tab' }] }]"),
    ['tab'],
    'NavGroup[] 의 대괄호를 배열 값으로 오인하지 않는다',
  )
})

selfTest('D5 — 키가 0개면 빈 배열이 아니라 null 이다', () => {
  // 빈 배열을 돌려주면 "쇼케이스가 하나도 없으니 어긋남도 없다"로 읽혀 통과한다.
  assertEqual(extractShowcaseMapKeys('const SHOWCASE_MAP = {}'), null, '0개는 파서 고장 신호')
  assertEqual(extractNavGroupIds('const NAV_GROUPS = []'), null, '0개는 파서 고장 신호')
})

selfTest('D5 — SHOWCASE_MAP 키와 NAV_GROUPS id 를 읽는다', () => {
  assertEqual(
    extractShowcaseMapKeys("const SHOWCASE_MAP = {\n  'button': { c: X },\n  'tab': { c: Y },\n}"),
    ['button', 'tab'],
    '키만',
  )
  assertEqual(
    extractNavGroupIds("const NAV_GROUPS = [{ items: [{ id: 'button', label: 'Button' }] }]"),
    ['button'],
    'id만',
  )
})

selfTest('D5 — 표기가 다른 같은 심볼을 같게 본다', () => {
  assertEqual(normalizeSymbol('Chip.Universal'), normalizeSymbol('ChipUniversal'), '표기 차이 흡수')
})

selfTest('D5 — spec 이 없는 컴포넌트를 잡아낸다', () => {
  const violations = findTriadViolations({
    componentDirs: Object.keys(COMPONENT_TRIAD),
    specComponents: Object.values(COMPONENT_TRIAD)
      .flatMap((e) => e.specs)
      .filter((s) => s !== 'Tab')
      .map((component) => ({ file: `specs/${component}.json`, component })),
    showcaseIds: [...COMPONENTLESS_SHOWCASES, ...Object.values(COMPONENT_TRIAD).flatMap((e) => e.showcases)],
    navIds: [...COMPONENTLESS_SHOWCASES, ...Object.values(COMPONENT_TRIAD).flatMap((e) => e.showcases)],
  })
  assertEqual(violations, ['Tab — "component": "Tab" 인 specs/*.json 이 없다'], 'spec 누락 1건')
})

selfTest('D5 — SHOWCASE_MAP 과 NAV_GROUPS 의 어긋남을 양방향으로 잡아낸다', () => {
  const all = [...COMPONENTLESS_SHOWCASES, ...Object.values(COMPONENT_TRIAD).flatMap((e) => e.showcases)]
  const violations = findTriadViolations({
    componentDirs: Object.keys(COMPONENT_TRIAD),
    specComponents: Object.values(COMPONENT_TRIAD)
      .flatMap((e) => e.specs)
      .map((component) => ({ file: `specs/${component}.json`, component })),
    showcaseIds: all.filter((id) => id !== 'tab'),
    navIds: [...all, 'ghost-page'],
  })
  assertEqual(
    violations,
    [
      // 'tab' 은 두 번 보고된다 — 컴포넌트 관점(Tab 의 쇼케이스가 없다)과
      // 집합 관점(NAV_GROUPS 에만 있다)은 고치는 자리가 다르므로 합치지 않는다.
      "Tab — SHOWCASE_MAP 에 'tab' 항목이 없다 (src/App.tsx)",
      "'tab' — NAV_GROUPS 에만 있고 SHOWCASE_MAP 에 없다",
      "'ghost-page' — NAV_GROUPS 에만 있고 SHOWCASE_MAP 에 없다",
    ],
    '양쪽 누락을 각각 잡는다',
  )
})

selfTest('D5 — 등록되지 않은 컴포넌트 디렉터리를 잡아낸다', () => {
  const all = [...COMPONENTLESS_SHOWCASES, ...Object.values(COMPONENT_TRIAD).flatMap((e) => e.showcases)]
  const violations = findTriadViolations({
    componentDirs: [...Object.keys(COMPONENT_TRIAD), 'Dialog'],
    specComponents: Object.values(COMPONENT_TRIAD)
      .flatMap((e) => e.specs)
      .map((component) => ({ file: `specs/${component}.json`, component })),
    showcaseIds: all,
    navIds: all,
  })
  assertEqual(violations, ['src/components/Dialog/ 가 COMPONENT_TRIAD 에 등록되지 않았다'], '미등록 1건')
})

selfTest('D6 — 자리 표시자와 구체 경로를 가른다', () => {
  assertEqual(isPlaceholderPath('src/components/{Name}/{Name}.tsx'), true, '치환 자리')
  assertEqual(isPlaceholderPath('docs/**'), true, 'glob')
  assertEqual(isPlaceholderPath('specs/$ARGUMENTS.json'), true, '인자 치환')
  assertEqual(isPlaceholderPath('src/App.tsx'), false, '구체 경로')
})

selfTest('D6 — 코드 스팬 안의 경로만 뽑는다', () => {
  const md = ['산문 속 src/App.tsx 는 대상이 아니다', '`src/index.css` 는 대상이다'].join('\n')
  assertEqual(extractCodeSpanPaths(md), [{ line: 2, path: 'src/index.css' }], '백틱 안만')
})

selfTest('D6 — 펜스 블록 안의 경로도 뽑는다', () => {
  const md = ['```', 'import x from "src/tokens/tokens.css"', '```'].join('\n')
  assertEqual(extractCodeSpanPaths(md), [{ line: 2, path: 'src/tokens/tokens.css' }], '펜스 포함')
})

selfTest('D6 — 문장 끝 마침표는 떼고 확장자의 점은 남긴다', () => {
  assertEqual(extractCodeSpanPaths('`src/App.tsx.`'), [{ line: 1, path: 'src/App.tsx' }], '꼬리 구두점')
})

selfTest('공통 — 주석 안의 중괄호가 블록 추출을 깨뜨리지 않는다', () => {
  const source = "const A = {\n  // }\n  k: 'https://x/y', // 주석\n}"
  assertEqual(
    extractObjectKeys(extractLiteralBlock(stripJsComments(source), 'const A', { skipTo: '=' })),
    ['k'],
    '주석 제거',
  )
})

function runSelfTests() {
  const failures = []
  for (const { name, fn } of selfTests) {
    try {
      fn()
    } catch (error) {
      failures.push(`${name}\n      ${error.message}`)
    }
  }
  return failures
}

/* ─── 실행 ────────────────────────────────────────────────────────────────── */

function main() {
  const lines = ['', 'docs-check — 문서·스킬·스펙 정합', '']

  const selfTestFailures = runSelfTests()
  if (selfTestFailures.length > 0) {
    lines.push(`  판정기 자체 검사  ${selfTests.length}건 중 ${selfTestFailures.length}건 실패`)
    lines.push(formatViolations(selfTestFailures))
    lines.push('')
    lines.push('  판정기가 고장 났다. 본 검사 결과를 신뢰할 수 없다.')
    console.log(lines.join('\n'))
    process.exit(1)
  }
  lines.push(`  판정기 자체 검사  ${selfTests.length}건 통과`)
  lines.push('')

  const markdownFiles = listCheckedMarkdown()
  const definedFamilies = collectDefinedSemanticFamilies(readRepoFile('src/tokens/tokens.css'))

  const results = [
    { id: 'D1', title: '마크다운 상대 링크', ...checkMarkdownLinks(markdownFiles) },
    { id: 'D2', title: '스킬 frontmatter', ...checkSkillFrontmatters() },
    {
      id: 'D3',
      title: '문서의 semantic 패밀리',
      ...checkSemanticFamilyMentions(markdownFiles, definedFamilies),
    },
    { id: 'D4', title: '모션 표 ↔ tailwind.config', ...checkMotionTable() },
    { id: 'D5', title: 'specs ↔ components ↔ showcase', ...checkShowcaseTriad() },
    { id: 'D6', title: '스킬 문서의 소스 경로', ...checkSkillSourcePaths() },
  ]

  for (const result of results) {
    const mark = result.violations.length === 0 ? 'ok  ' : 'FAIL'
    lines.push(
      `  ${mark} ${result.id} ${result.title.padEnd(28)} ${String(result.examined).padStart(4)}${result.unit} 검사 · 위반 ${result.violations.length}`,
    )
    if (result.violations.length > 0) lines.push(formatViolations(result.violations))
  }

  lines.push('')
  lines.push(`  미검증 ${Object.keys(UNMEASURED).length}항목 — 검사가 보지 못하는 것이지 통과한 것이 아니다`)
  for (const [item, reason] of Object.entries(UNMEASURED)) {
    lines.push(`    · ${item} — ${reason}`)
  }

  const failed = results.filter((r) => r.violations.length > 0)
  const total = results.reduce((sum, r) => sum + r.violations.length, 0)
  lines.push('')
  lines.push(
    failed.length === 0
      ? `  요약: 검사 ${results.length}종 전부 통과 · 위반 0 (미검증 ${Object.keys(UNMEASURED).length}항목은 위 목록 참고)`
      : `  요약: 검사 ${results.length}종 중 ${failed.length}종 실패 (${failed.map((r) => r.id).join(', ')}) · 위반 ${total}건`,
  )
  lines.push('')

  console.log(lines.join('\n'))
  process.exit(failed.length === 0 ? 0 : 1)
}

/**
 * 직접 실행할 때만 검사를 돌린다.
 *
 * 판정 함수를 다른 파일에서 import 해 **결함을 주입한 입력**으로 시험할 수 있어야
 * red 시연이 가능하다. import 만으로 `process.exit` 가 나면 시험할 방법이 없다.
 */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
