const { chromium } = require('playwright');
const http = require('http');

(async () => {
  console.log("Connecting to existing port 8000");
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
    await page.locator('#gapbot-3d-container').scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/home/jules/verification/verification.png', fullPage: true });
    await browser.close();
    console.log('Verification screenshot saved');
  } catch(e) {
    console.error(e);
  }
})();
