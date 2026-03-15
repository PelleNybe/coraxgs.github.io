const puppeteer = require('puppeteer');
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const serve = serveStatic('.', { 'index': ['index.html'] });

const server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res));
});

server.listen(8000);

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

    console.log("Starting e2e tests...");

    // Test 1: Page load & Title
    const title = await page.title();
    if (!title.includes("Corax CoLAB")) throw new Error("Title mismatch");
    console.log("✓ Page title correct");

    // Test 2: Hero Section
    const heroVisible = await page.$eval('.hero', el => !!el);
    if (!heroVisible) throw new Error("Hero section missing");
    console.log("✓ Hero section visible");

    // Test 3: 3D GAPbot integration
    const botContainer = await page.$eval('#gapbot-3d-container', el => !!el);
    if (!botContainer) throw new Error("3D container missing");
    console.log("✓ 3D container present");

    // Test 4: Web3 Demo
    const web3Demo = await page.$eval('#web3-demo', el => !!el);
    const connectBtn = await page.$eval('#connect-wallet-btn', el => !!el);
    if (!web3Demo || !connectBtn) throw new Error("Web3 Demo missing");
    console.log("✓ Web3 Demo present");

    // Test 5: Blog Section
    const blogSection = await page.$eval('#insights', el => !!el);
    const blogCardsCount = await page.$$eval('#blog-grid .feature-card', els => els.length);
    if (!blogSection || blogCardsCount < 3) throw new Error("Blog section or cards missing");
    console.log("✓ Blog Section present with " + blogCardsCount + " cards");

    console.log("All e2e tests passed successfully!");
  } catch (err) {
    console.error("Test failed:", err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})();
