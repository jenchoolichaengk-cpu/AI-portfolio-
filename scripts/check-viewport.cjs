const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('@playwright/test');

// Run after npm run build. Set PLAYWRIGHT_CHANNEL for an installed browser.
(async () => {
  const server = spawn(process.execPath, ['scripts/preview.mjs', '--port', '3105'], {
    cwd: path.resolve(__dirname, '..'), stdio: ['ignore', 'pipe', 'pipe'],
  });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.stdout.once('data', resolve);
      server.once('error', reject);
      server.once('exit', code => reject(new Error(`Preview exited: ${code}`)));
    });
    browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:3105', { waitUntil: 'networkidle' });
    async function check(name, requireFooter = true) {
      await page.locator('.view-footer').waitFor();
      await page.waitForTimeout(250);
      const bounds = await page.locator('.view-footer').boundingBox();
      if (requireFooter) assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 900, `${name}: primary actions below fold`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: horizontal overflow`);
      console.log(`PASS ${name}`);
    }
    await page.getByRole('button', { name: 'Continue project', exact: true }).click();
    for (const title of ['Missing usability testing', 'Weak research-to-strategy evidence', 'Storytelling is too descriptive']) {
      await page.locator('.gap-summary').filter({ hasText: title }).click();
      await check(title);
    }
    await page.getByRole('button', { name: /Career Match/ }).click();
    for (const title of ['Product Designer', 'UX Designer', 'Industrial Designer', 'UI Designer']) {
      await page.locator('.career-card').filter({ hasText: title }).click();
      await check(title, false);
      const panel = await page.locator('.copilot').boundingBox();
      const main = await page.locator('.main-content').boundingBox();
      assert.equal((await page.locator('.sidebar').boundingBox()).width, 220);
      assert.equal(panel.width, 320);
      assert.equal(await page.locator('.workspace-body').evaluate(el => getComputedStyle(el).display), 'grid');
      assert.equal(await page.locator('.copilot').evaluate(el => getComputedStyle(el).position), 'sticky');
      assert.equal(main.width, 900);
      assert.equal(main.x + main.width, panel.x);
      const primary = await page.locator('.career-card').first().boundingBox();
      const secondary = await page.locator('.career-card').nth(1).boundingBox();
      assert(primary.width > secondary.width * 2, 'Primary career is not dominant');
      assert(secondary.y >= primary.y + primary.height, 'Secondary options must be below primary');
      for (const selector of ['.section-heading', '.ai-summary', '.ai-summary+.section-line', '.career-grid']) {
        const box = await page.locator(selector).boundingBox();
        assert(box.y >= 0 && box.y + box.height <= 900, `${selector}: below fold`);
        assert(box.x >= main.x && box.x + box.width <= panel.x, `${selector}: overlaps Copilot`);
      }
      for (const card of await page.locator('.career-card').all()) {
        const bounds = await card.boundingBox();
        assert(bounds.y >= 0 && bounds.y + bounds.height <= 900, 'Career option below fold');
        assert(bounds.x >= main.x && bounds.x + bounds.width <= panel.x, 'Career card clipped horizontally');
        assert(await card.evaluate(el => el.scrollWidth <= el.clientWidth), 'Card content overflows');
        assert(await card.evaluate(el => {
          const r = el.getBoundingClientRect();
          return [r.left + 4, r.right - 4].every(x => el.contains(document.elementFromPoint(x, r.top + r.height / 2)));
        }), 'Career card is physically covered by another element');
      }
      assert.deepEqual(await page.locator('.main-content').evaluate(el => {
        const edge = document.querySelector('.copilot').getBoundingClientRect().left;
        return [...el.querySelectorAll('*')].filter(child => {
          const r = child.getBoundingClientRect();
          return r.width > 0 && r.right > edge + 1;
        }).map(child => child.className);
      }), [], 'Career content extends underneath Copilot');
      assert.deepEqual(await page.locator('.career-card').first().evaluate(el => [getComputedStyle(el.querySelector('h3')).fontSize, getComputedStyle(el.querySelector('.career-score')).fontSize]), ['14px', '28px']);
      if (title === 'Product Designer') {
        fs.mkdirSync('test-results', { recursive: true });
        await page.screenshot({ path: 'test-results/career-1440x900.png' });
      }
    }
    await page.getByRole('button', { name: 'Close copilot' }).click();
    await check('Career without copilot', false);
    assert.equal((await page.locator('.main-content').boundingBox()).width, 1220);
    await page.getByRole('button', { name: 'Copilot', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForTimeout(300);
    assert.equal((await page.locator('.copilot').boundingBox()).width, 320, 'Desktop layout must not depend on height');
    assert.equal((await page.locator('.main-content').boundingBox()).width, 900);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: 'Continue with this role' }).click();
    await page.getByRole('button', { name: 'Build portfolio story' }).click();
    for (let i = 0; i < 6; i++) {
      await page.locator('.outline-item>button').nth(i).click();
      await check(`Builder section ${i + 1}`);
    }
    await page.getByRole('button', { name: 'Close copilot' }).click();
    await check('Builder without copilot');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile horizontal overflow');
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
