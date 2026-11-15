import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.log('[BROWSER ERROR]:', err.message, err.stack));

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  console.log('Clicking Start New Expedition...');
  await page.click('text=Start New Expedition');
  await page.waitForTimeout(500);

  console.log('Confirming Astronaut...');
  await page.click('text=Confirm Astronaut & Proceed');
  await page.waitForTimeout(500);

  console.log('Selecting Mars & Launching...');
  await page.click('text=Mars (The Red Planet)');
  await page.waitForTimeout(500);
  await page.click('text=Launch to Mars');
  await page.waitForTimeout(3000);

  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log('Canvas count:', canvasCount);

  if (canvasCount > 0) {
    const canvasInfo = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return { width: c.width, height: c.height, style: c.getAttribute('style') };
    });
    console.log('Canvas info:', canvasInfo);
  }

  await browser.close();
  console.log('Done testing browser.');
})();
