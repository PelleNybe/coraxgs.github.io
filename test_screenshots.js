const puppeteer = require('puppeteer');
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const fs = require('fs');

if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

const serve = serveStatic('.', { 'index': ['index.html'] });
const server = http.createServer((req, res) => serve(req, res, finalhandler(req, res)));
server.listen(8001);

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:8001', { waitUntil: 'networkidle0' });

    console.log("Taking hero screenshot...");
    await page.screenshot({ path: 'images/v2_main_hero.png', clip: {x: 0, y: 0, width: 1280, height: 600} });

    console.log("Taking AI sim screenshot...");
    const aiSim = await page.$('#ai-simulator');
    if (aiSim) await aiSim.screenshot({ path: 'images/v1_boot_screen.png' }); // Overwriting an old image slot for README update

    console.log("Taking Hologram screenshot...");
    const hologram = await page.$('#hologram');
    if (hologram) await hologram.screenshot({ path: 'images/v5_3d_parallax_card.png' }); // Overwriting

    console.log("Screenshots updated successfully.");
  } catch (err) {
    console.error("Screenshot test failed:", err);
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(0);
  }
})();
