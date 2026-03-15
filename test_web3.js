const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  // check if web3 elements exist
  const elementsExist = await page.evaluate(() => {
    return !!document.querySelector('#web3-demo') &&
           !!document.querySelector('#connect-wallet-btn') &&
           !!document.querySelector('#sign-message-btn');
  });

  console.log('Web3 elements exist:', elementsExist);

  await browser.close();
})();
