const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  // check if blog elements exist
  const elementsExist = await page.evaluate(() => {
    return !!document.querySelector('#insights') &&
           !!document.querySelector('#blog-grid') &&
           document.querySelectorAll('#blog-grid .feature-card').length >= 3;
  });

  console.log('Blog elements exist:', elementsExist);

  await browser.close();
})();
