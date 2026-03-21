// scripts/fetch-datatable-docs.js
// Playwright를 사용해 JS 렌더링 페이지에서 Data Table 문서를 수집합니다.

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const URLS = [
  {
    name: 'baseweb',
    url: 'https://baseweb.design/components/data-table/#data-table',
  },
  {
    name: 'uber-base',
    url: 'https://base.uber.com/6d2425e9f/p/901301-data-table',
  },
];

async function fetchPage(browser, { name, url }) {
  const page = await browser.newPage();
  console.log(`[${name}] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // 추가 대기: 동적 콘텐츠 로딩
  await page.waitForTimeout(3000);

  // 메인 콘텐츠 영역 우선, 없으면 body 전체
  let text = '';
  for (const sel of ['main', 'article', '[role="main"]']) {
    try {
      const el = await page.$(sel);
      if (el) {
        text = await el.innerText();
        if (text.length > 200) break;
      }
    } catch (_) {}
  }

  if (!text || text.length < 200) {
    text = await page.innerText('body');
  }

  await page.close();
  console.log(`[${name}] Extracted ${text.length} chars`);
  return text;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const target of URLS) {
    try {
      const text = await fetchPage(browser, target);
      results.push({ name: target.name, url: target.url, text });
    } catch (err) {
      console.error(`[${target.name}] Error:`, err.message);
      results.push({ name: target.name, url: target.url, text: `ERROR: ${err.message}` });
    }
  }

  await browser.close();

  // 결과를 마크다운으로 저장
  const output = results
    .map(({ name, url, text }) =>
      `# ${name}\n\nSource: ${url}\n\n\`\`\`\n${text.trim()}\n\`\`\`\n`
    )
    .join('\n---\n\n');

  const outPath = join(__dirname, 'datatable-research.md');
  writeFileSync(outPath, output, 'utf8');
  console.log(`\nSaved to: ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
