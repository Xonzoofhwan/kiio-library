/**
 * 쇼케이스 캡처 + 브라우저 기계 검사.
 *
 * **`npm run check` 에 들어 있지 않다.** 빌드 산출물을 서빙하는 서버와 실제 브라우저가
 * 필요해 게이트에 넣기엔 무겁다. 대신 손으로 부른다:
 *
 *     npm run build && npx vite preview --port 4173 --strictPort &
 *     npm run capture
 *
 * 스크린샷은 사람이 보라고 찍는 것이고, 아래 세 검사는 **사람 눈보다 기계가 잘 본다** —
 * 셋 다 "봤는데 괜찮아 보였다"로는 잡히지 않는 종류다:
 *   F  폰트가 실제로 Wanted Sans 로 그려지는가. 스택의 첫 이름을 읽는 것이 아니라
 *      `document.fonts.check` 로 **로드 여부**를 본다 — 폰트가 안 받아져 fallback 으로
 *      떨어져도 `getComputedStyle` 의 font-family 는 여전히 원하는 이름을 돌려준다.
 *   H  가로 스크롤이 생기는가. 360 에서 가장 잘 깨지고 눈으로는 잘 안 보인다.
 *   C  콘솔 에러·경고. 2026-09-15 첫 실행에서 폰트 preload 의 crossorigin 불일치를
 *      이걸로 잡았다 — 화면은 멀쩡했고 CSS 만 두 번 받고 있었다.
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = 'http://localhost:4173'
const OUT = process.argv[2] || '.shots' // .gitignore 에 있다

const PAGES = [
  'tokens', 'block-catalog',
  'button', 'icon-button', 'text-button', 'switch', 'checkbox', 'radio',
  'badge', 'chip-universal', 'chip-badgelike',
  'tab', 'nav-vertical', 'segment-bar',
  'tooltip', 'callout', 'skeleton',
]
const WIDTHS = [
  { w: 1280, h: 900, tag: '1280' },
  { w: 768, h: 1000, tag: '768' },
  { w: 360, h: 800, tag: '360' },
]

try {
  const ping = await fetch(BASE, { method: 'HEAD' })
  if (!ping.ok) throw new Error(String(ping.status))
} catch {
  console.error(`${BASE} 에 아무도 없다. 먼저 빌드하고 서빙해라:\n` +
    `  npm run build && npx vite preview --port 4173 --strictPort`)
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const results = []

for (const { w, h, tag } of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()

  const consoleMsgs = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`${m.type()}: ${m.text()}`)
  })
  page.on('pageerror', (e) => consoleMsgs.push(`pageerror: ${e.message}`))

  // 테마는 1280 에서만 토글한다 — 그 아래에서는 사이드바가 서랍이라 토글이 화면 밖에 있다.
  const themes = tag === '1280' ? ['light', 'dark'] : ['light']

  for (const theme of themes) {
    for (const id of PAGES) {
      consoleMsgs.length = 0
      await page.goto(`${BASE}/#/${id}`, { waitUntil: 'networkidle' })

      // 테마 적용. 토글 버튼을 눌러 실제 경로를 지난다.
      const current = await page.evaluate(() => document.querySelector('[data-theme]')?.getAttribute('data-theme'))
      if (current !== theme) {
        await page.getByRole('button', { name: /Switch to (dark|light) mode/ }).click()
      }
      await page.waitForTimeout(250) // 전환 모션이 끝난 뒤에 찍는다

      const probe = await page.evaluate(() => {
        const el = document.querySelector('[data-theme]') || document.body
        const heading = document.querySelector('h1, h2, [class*="typography-"]') || el
        return {
          theme: el.getAttribute('data-theme'),
          // 스택의 첫 항목이 아니라 **실제로 그려진** 폰트가 있는지 본다.
          wantedVariableLoaded: document.fonts.check('16px "Wanted Sans Variable"'),
          wantedStaticLoaded: document.fonts.check('16px "Wanted Sans"'),
          appliedStack: getComputedStyle(heading).fontFamily,
          loadedFamilies: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))],
          docScrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          bodyScrollW: document.body.scrollWidth,
        }
      })

      const overflow = probe.docScrollW > probe.innerW + 1
      results.push({
        id, theme, width: tag,
        wantedVariableLoaded: probe.wantedVariableLoaded,
        wantedStaticLoaded: probe.wantedStaticLoaded,
        appliedStack: probe.appliedStack,
        loadedFamilies: probe.loadedFamilies,
        overflowPx: overflow ? probe.docScrollW - probe.innerW : 0,
        console: [...consoleMsgs],
      })

      await page.screenshot({
        path: `${OUT}/${tag}-${theme}-${id}.png`,
        fullPage: false,
      })
    }
  }
  await ctx.close()
}

await browser.close()
writeFileSync(`${OUT}/report.json`, JSON.stringify(results, null, 2))

// ── 요약 ─────────────────────────────────────────────────────────────────────
const fontBad = results.filter(r => !r.wantedVariableLoaded && !r.wantedStaticLoaded)
const overflowBad = results.filter(r => r.overflowPx > 0)
const consoleBad = results.filter(r => r.console.length > 0)

console.log(`캡처 ${results.length}장 → ${OUT}`)
console.log(`F 폰트  — Wanted Sans 로 그려지지 않은 조합: ${fontBad.length}`)
if (fontBad.length) console.log('   ' + fontBad.slice(0, 5).map(r => `${r.width}/${r.theme}/${r.id}`).join(', '))
console.log(`   적용된 스택 예시: ${results[0]?.appliedStack}`)
console.log(`   로드된 패밀리: ${JSON.stringify(results[0]?.loadedFamilies)}`)
console.log(`H 가로넘침 — 넘친 조합: ${overflowBad.length}`)
for (const r of overflowBad.slice(0, 10)) console.log(`   ${r.width}/${r.theme}/${r.id}  +${r.overflowPx}px`)
console.log(`C 콘솔    — 에러·경고가 난 조합: ${consoleBad.length}`)
for (const r of consoleBad.slice(0, 10)) console.log(`   ${r.width}/${r.theme}/${r.id}  ${r.console[0]}`)
