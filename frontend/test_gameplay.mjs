import { chromium } from 'playwright';

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.addInitScript(() => {
    localStorage.setItem('missionverse_guest_save_v1', JSON.stringify({
      version: 1,
      sessionId: 'test-session',
      updatedAt: new Date().toISOString(),
      player: {
        avatarId: 'astra',
        name: 'Astronaut Astra',
        selectedPlanet: 'mars'
      },
      resources: { oxygen: 100, energy: 100, battery: 100, samples: 0 },
      completedMissions: [],
      currentMissionIndex: 0,
      discoveries: [],
      badges: []
    }));
  });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Resume:")');
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'gameplay_screenshot.png' });
  console.log('Saved screenshot to gameplay_screenshot.png');

  await browser.close();
})();
