const { expect } = require('@playwright/test');
const logger = require('../utils/logger');

/**
 * Base Page Object class with common methods for all page objects
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} baseURL - Base URL for the page
   */
  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL || 'https://www.angelcard.us';
  }

  /**
   * Navigate to specific path
   * @param {string} path - Path to navigate to
   */
  async goto(path = '') {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  /**
   * Wait for the page to load completely
   */
  async waitForPageLoad() {
    // Wait for load event to be fired
    await this.page.waitForLoadState('load');
    
    // Try to wait for a common element that should be on most pages
    try {
      // Wait for body to be visible
      await this.page.waitForSelector('body', { state: 'visible', timeout: 5000 });
      
      // Wait for main navigation - common in most websites
      await Promise.race([
        this.page.waitForSelector('nav', { timeout: 3000 }).catch(() => {}),
        this.page.waitForSelector('header', { timeout: 3000 }).catch(() => {})
      ]);
    } catch (error) {
      logger.warn('Could not wait for page to fully stabilize');
    }
  }

  /**
   * Check if element is visible - safely handling strict mode violations
   * @param {import('@playwright/test').Locator} locator - Element locator
   * @returns {Promise<boolean>} - True if element is visible
   */
  async isVisible(locator) {
    try {
      // First check if the locator might resolve to multiple elements
      const count = await locator.count().catch(() => 0);
      
      if (count > 1) {
        // If multiple elements, check if at least one is visible
        for (let i = 0; i < count; i++) {
          const isVisible = await locator.nth(i).isVisible().catch(() => false);
          if (isVisible) return true;
        }
        return false;
      } else if (count === 1) {
        // Single element case
        return await locator.isVisible().catch(() => false);
      } else {
        // No elements found
        return false;
      }
    } catch (error) {
      logger.warn(`Error checking visibility: ${error.message}`);
      return false;
    }
  }

  /**
   * Get page title
   * @returns {Promise<string>} - Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Take screenshot
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `./ui/reports/screenshots/${name}.png` });
  }

  /**
   * Accept cookies if present
   */
  async acceptCookies() {
    logger.info('Attempting to handle cookie consent if present');
    
    // Take a screenshot to see what we're dealing with
    await this.page.screenshot({ path: './ui/reports/screenshots/before-cookie-handling.png' });
    
    // First check if there's any cookie banner visible at all
    const hasCookieBanner = await this.page.evaluate(() => {
      /* eslint-disable no-undef */
      // document is valid inside evaluate since it runs in browser context
      return document.body.innerText.toLowerCase().includes('cookie') || 
             document.body.innerText.toLowerCase().includes('consent') || 
             document.body.innerText.toLowerCase().includes('privacy');
      /* eslint-enable no-undef */
    });
    
    if (!hasCookieBanner) {
      logger.info('No cookie banner detected on page - skipping cookie handling');
      return;
    }
    
    // Try different methods with error handling for each
    try {
      // Method 1: Look for a button with specific data attribute (common in cookie banners)
      const dataAttrButton = this.page.locator('[data-cky-tag="accept-button"]').first();
      const isDataAttrVisible = await dataAttrButton.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (isDataAttrVisible) {
        logger.info('Found cookie accept button with data attribute');
        await dataAttrButton.click().catch(e => {
          logger.warn(`Failed to click button with data attribute: ${e.message}`);
        });
        return;
      }
    } catch (error) {
      logger.warn(`Method 1 failed: ${error.message}`);
    }
    
    // Method 2: Try by role
    try {
      // Don't use .first() here as it can lead to strict mode violations
      const buttonsByRole = this.page.getByRole('button', { name: /Accept|Accept All|OK|Agree/i });
      const count = await buttonsByRole.count();
      
      if (count > 0) {
        logger.info(`Found ${count} possible cookie consent buttons`);
        // Click the first one
        await buttonsByRole.nth(0).click().catch(e => {
          logger.warn(`Failed to click button by role: ${e.message}`);
        });
        return;
      }
    } catch (error) {
      logger.warn(`Method 2 failed: ${error.message}`);
    }
    
    // Method 3: Try by common cookie banner classes
    try {
      const cookieBanners = [
        '.cookie-banner', 
        '.cookie-consent', 
        '.cookie-notice', 
        '.gdpr-banner',
        '.cky-consent-container'
      ];
      
      for (const selector of cookieBanners) {
        const banner = this.page.locator(selector).first();
        const isBannerVisible = await banner.isVisible({ timeout: 500 }).catch(() => false);
        
        if (isBannerVisible) {
          logger.info(`Found cookie banner with selector: ${selector}`);
          const acceptButton = banner.locator('button:has-text("Accept"), button:has-text("OK"), button:has-text("Agree")').first();
          await acceptButton.click().catch(e => {
            logger.warn(`Found banner but failed to click accept button: ${e.message}`);
          });
          return;
        }
      }
    } catch (error) {
      logger.warn(`Method 3 failed: ${error.message}`);
    }
    
    logger.info('Completed cookie handling attempts - continuing with test');
  }

  /**
   * Get current URL
   * @returns {Promise<string>} - Current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }
  
  /**
   * Wait for element to be visible
   * @param {import('@playwright/test').Locator} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(locator, timeout = 30000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Assert page title contains specific text
   * @param {string} expectedTitle - Expected title text
   */
  async assertTitleContains(expectedTitle) {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
}

module.exports = BasePage;
