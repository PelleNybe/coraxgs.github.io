const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:8000');

  // Wait for the diagram to be visible
  const archSection = await page.locator('#architecture');
  await archSection.waitFor();

  const archInfo = await page.locator('#arch-info');
  const defaultText = await archInfo.textContent();
  console.log('Default text:', defaultText.trim());

  const nodes = await page.locator('.arch-node');
  const count = await nodes.count();
  console.log(`Found ${count} arch nodes.`);

  if (count > 0) {
    const firstNode = nodes.first();
    const expectedInfo = await firstNode.getAttribute('data-info');

    // Make sure we dispatch the exact event that the code listens for.
    await firstNode.dispatchEvent('mouseenter');

    await page.waitForTimeout(100);

    const hoverText = await archInfo.textContent();
    console.log(`Expected info: ${expectedInfo.trim()}`);
    console.log(`Hover text: ${hoverText.trim()}`);

    if (hoverText.trim() === expectedInfo.trim()) {
      console.log('Hover test passed!');
    } else {
      console.error('Hover test failed!');
      process.exit(1);
    }

    await firstNode.dispatchEvent('mouseleave');
    await page.waitForTimeout(100);

    const leaveText = await archInfo.textContent();
    console.log(`Leave text: ${leaveText.trim()}`);

    if (leaveText.trim() === defaultText.trim()) {
      console.log('Leave test passed!');
    } else {
      console.error('Leave test failed!');
      process.exit(1);
    }
  } else {
    console.error('No arch nodes found!');
    process.exit(1);
  }

  await browser.close();
  process.exit(0);
})();
