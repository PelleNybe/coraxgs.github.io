const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the local server
  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });

  // Ensure we scrolled to the GAPbot 3D container to trigger any lazy loading or intersection observer
  await page.locator('#gapbot-3d-container').scrollIntoViewIfNeeded();

  // Take a full page screenshot
  await page.screenshot({ path: '/home/jules/verification/verification.png', fullPage: true });

  await browser.close();
  console.log('Verification screenshot saved to /home/jules/verification/verification.png');
})();
