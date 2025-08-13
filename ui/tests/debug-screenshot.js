const { test } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const logger = require('../utils/logger');

test('Take debug screenshot of platform page', async ({ page }) => {
  logger.info('Taking debug screenshot of platform page');
  
  // Navigate to homepage
  const homePage = new HomePage(page);
  await homePage.navigateToHomePage();
  
  // Take screenshot of homepage
  await page.screenshot({ path: './ui/reports/screenshots/homepage-debug.png' });
  
  // Try to find and click any button that might lead to a platform or login page
  const possibleButtons = [
    'Enter Platform',
    'Enter',
    'Login',
    'Sign In',
    'Register',
    'Get Started'
  ];
  
  logger.info('Looking for platform entry buttons');
  
  // Log all buttons on the page
  const buttonTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a.button, a[class*="btn"], [role="button"]'))
      .map(button => ({
        text: button.innerText.trim(),
        tagName: button.tagName,
        href: button.href || null,
        id: button.id || null,
        className: button.className || null
      }));
  });
  
  logger.info(`Found ${buttonTexts.length} potential buttons`);
  logger.info(`Button info: ${JSON.stringify(buttonTexts, null, 2)}`);
  
  // Try to click on anything that might lead to a platform
  for (const text of possibleButtons) {
    const button = page.locator(`button:has-text("${text}"), a:has-text("${text}")`).first();
    if (await button.count() > 0) {
      logger.info(`Found and clicking "${text}" button`);
      await button.click();
      await page.waitForLoadState('networkidle');
      break;
    }
  }
  
  // Take screenshot after trying to navigate to platform
  await page.screenshot({ path: './ui/reports/screenshots/platform-page-debug.png' });
  
  // Log the current URL and page content
  logger.info(`Current URL: ${page.url()}`);
  
  // Log all links on the page
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({
        text: a.innerText.trim(),
        href: a.href,
        id: a.id || null,
        className: a.className || null
      }));
  });
  
  logger.info(`Found ${links.length} links on page`);
  logger.info(`Links info: ${JSON.stringify(links, null, 2)}`);
  
  // Log page structure
  const structure = await page.evaluate(() => {
    const getElements = (selector) => {
      return Array.from(document.querySelectorAll(selector)).length;
    };
    
    return {
      inputs: getElements('input'),
      buttons: getElements('button'),
      forms: getElements('form'),
      images: getElements('img'),
      divs: getElements('div'),
      headings: {
        h1: getElements('h1'),
        h2: getElements('h2'),
        h3: getElements('h3')
      }
    };
  });
  
  logger.info(`Page structure: ${JSON.stringify(structure, null, 2)}`);
});
