import { chromium } from 'playwright';

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.log('[BROWSER PAGE ERROR]:', err.message, err.stack));
  page.on('requestfailed', req => console.log('[BROWSER REQ FAILED]:', req.url(), req.failure()?.errorText));
  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`[BROWSER HTTP ${resp.status()}]:`, resp.url());
    }
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  console.log('Clicking Start New Expedition...');
  await page.click('button:has-text("Start New Expedition")');
  await page.waitForTimeout(500);

  console.log('Confirming Astronaut...');
  await page.click('button:has-text("Confirm Astronaut")');
  await page.waitForTimeout(500);

  console.log('Selecting Mars & Launching...');
  await page.click('text=Mars (The Red Planet)');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Launch")');
  await page.waitForTimeout(4000);

  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log('Canvas count:', canvasCount);

  if (canvasCount > 0) {
    const canvasInfo = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return { 
        width: c.width, 
        height: c.height, 
        clientWidth: c.clientWidth,
        clientHeight: c.clientHeight,
        style: c.getAttribute('style')
      };
    });
    console.log('Canvas info:', canvasInfo);
  }

  const htmlDump = await page.evaluate(() => {
    return document.getElementById('root')?.innerHTML.substring(0, 500);
  });
  console.log('Root HTML snippet:', htmlDump);

  await browser.close();
  console.log('Done testing browser.');
})();
