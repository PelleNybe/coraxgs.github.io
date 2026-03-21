const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
  }

  // 1. Boot Screen (Catch it early)
  await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: 'images/v1_boot_screen.png' });

  // 2. Main Hero (Wait for boot to finish)
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'images/v2_main_hero.png' });

  // 3. Scroll down slightly for Scrolled Nav (V4)
  await page.evaluate(() => window.scrollBy(0, 300));
  await new Promise(r => setTimeout(r, 500)); // allow transition
  await page.screenshot({ path: 'images/v4_scrolled_nav.png' });

  // 5. Scroll to feature cards to trigger tilt (V5) - do this before terminal to avoid terminal input focus issues
  await page.evaluate(() => {
    document.querySelector('.feature-card').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Simulate hover for tilt card
  const cardHandle = await page.$('.feature-card');
  if(cardHandle) {
    const box = await cardHandle.boundingBox();
    await page.mouse.move(box.x + box.width / 4, box.y + box.height / 4);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'images/v5_3d_parallax_card.png' });
  }

  await browser.close();
  console.log("Screenshots captured successfully.");
})();
