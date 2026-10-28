// Optional real-browser check. Build and serve dist on port 4173 first.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    for (const role of ['anonymous', 'pending', 'participant', 'owner']) {
      await page.goto(`http://127.0.0.1:4173/review.html?role=${role}#my-space`);
      const approved = ['participant', 'owner'].includes(role);
      assert.equal(await page.locator('#my-space-content').isVisible(), approved);
      assert.equal(await page.locator('.journey-progress').isVisible(), approved);
      assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth), true);
      await page.locator('[data-directory-view="participants"]').click();
      assert.equal(await page.locator('#participant-directory-content').isVisible(), approved);
      if (approved) {
        await page.goto(`http://127.0.0.1:4173/review.html?role=${role}#${role === 'owner' ? 'owner-inbox' : 'received-contact-log'}`);
        assert.equal(await page.locator(role === 'owner' ? '#owner-inbox' : '#received-contact-log').isVisible(), true);
        assert.equal(await page.locator('.thread-conversation[open]').count(), 0);
      }
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('Four-role desktop/mobile browser smoke passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
