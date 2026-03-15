const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  // check if canvas exists in gapbot-3d-container
  const canvasExists = await page.evaluate(() => {
    return !!document.querySelector('#gapbot-3d-container canvas');
  });

  console.log('Canvas exists:', canvasExists);

  await browser.close();
})();
