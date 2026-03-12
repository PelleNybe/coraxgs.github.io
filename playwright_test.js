const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });

  // Take full page screenshot
  await page.screenshot({ path: '/app/fullpage_screenshot.png', fullPage: true });

  await browser.close();
  console.log('Screenshot saved to /app/fullpage_screenshot.png');
})();
