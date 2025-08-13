const BasePage = require('./BasePage');
const logger = require('../utils/logger');

/**
 * Platform page object model
 */
class PlatformPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    // Use the platform URL for this page
    super(page, 'https://platform.angelcard.us');
    
    // Initialize selectors with more flexible matchers
    // For login options, use multiple patterns that could match various implementations
    this.continueWithEmailButton = page.locator([
      'a:has-text("Continue with Email")', 
      'button:has-text("Email")',
      'a:has-text("Email")',
      'a:has-text("Sign in with Email")',
      'button:has-text("Sign in with Email")',
      'a[href*="email"], button[class*="email"]'
    ].join(','));
    
    this.continueWithGoogleButton = page.locator([
      'a:has-text("Continue with Google")', 
      'button:has-text("Google")',
      'a:has-text("Google")', 
      'a:has-text("Sign in with Google")',
      'button:has-text("Sign in with Google")',
      'a[href*="google"], button[class*="google"]'
    ].join(','));
    
    this.continueWithAppleButton = page.locator([
      'a:has-text("Continue with Apple")', 
      'button:has-text("Apple")',
      'a:has-text("Apple")', 
      'a:has-text("Sign in with Apple")',
      'button:has-text("Sign in with Apple")',
      'a[href*="apple"], button[class*="apple"]'
    ].join(','));
    
    // More flexible logo selector
    this.angelCardLogo = page.locator([
      'img[alt="AngelCard Logo"]',
      'img[alt*="Angel"]', 
      'img[alt*="logo" i]', 
      'a.logo img',
      '.logo img', 
      'header img'
    ].join(','));
    
    // Footer links with more flexibility
    this.publicOfferLink = page.locator([
      'a:has-text("Public offer and Privacy policy")',
      'a:has-text("Public offer")',
      'a:has-text("Privacy policy")',
      'a[href*="public-offer"]',
      'a[href*="privacy"]'
    ].join(','));
    
    this.termsAndConditionsLink = page.locator([
      'a:has-text("Terms & Conditions")', 
      'a:has-text("Terms")',
      'a[href*="terms"]'
    ].join(','));
    
    this.refundPolicyLink = page.locator([
      'a:has-text("Refund Policy")', 
      'a:has-text("Refund")',
      'a[href*="refund"]'
    ].join(','));
    
    this.shippingPolicyLink = page.locator([
      'a:has-text("Shipping Policy")', 
      'a:has-text("Shipping")',
      'a[href*="shipping"]'
    ].join(','));
    
    // Cookie consent with more flexible matcher
    this.cookieConsentContainer = page.locator([
      '[role="region"][aria-label="We value your privacy"]',
      '[class*="cookie"]',
      '[id*="cookie"]',
      '[class*="consent"]',
      '[id*="consent"]'
    ].join(','));
  }

  /**
   * Navigate to platform page
   */
  async navigateToPlatform() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Click continue with email button or equivalent login option
   */
  async clickContinueWithEmail() {
    try {
      // First try our standard selector
      const isVisible = await this.continueWithEmailButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        await this.continueWithEmailButton.click();
        await this.waitForPageLoad();
        return;
      }
      
      // If not found, try other possible email login options
      const alternativeSelectors = [
        'form input[type="email"]',
        'a:has-text(/sign.?in/i)',
        'a:has-text(/log.?in/i)',
        'button:has-text(/sign.?in/i)',
        'button:has-text(/log.?in/i)',
        'a:has-text(/register/i)',
        'button:has-text(/register/i)'
      ];
      
      for (const selector of alternativeSelectors) {
        const element = this.page.locator(selector).first();
        const elementVisible = await element.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (elementVisible) {
          await element.click();
          await this.waitForPageLoad();
          return;
        }
      }
      
      throw new Error('Could not find email login option');
    } catch (error) {
      logger.error(`Error in clickContinueWithEmail: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click continue with Google button or equivalent
   */
  async clickContinueWithGoogle() {
    try {
      const isVisible = await this.continueWithGoogleButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        await this.continueWithGoogleButton.click();
        await this.waitForPageLoad();
        return;
      }
      
      throw new Error('Google login option not found');
    } catch (error) {
      logger.error(`Error in clickContinueWithGoogle: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click continue with Apple button or equivalent
   */
  async clickContinueWithApple() {
    try {
      const isVisible = await this.continueWithAppleButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        await this.continueWithAppleButton.click();
        await this.waitForPageLoad();
        return;
      }
      
      throw new Error('Apple login option not found');
    } catch (error) {
      logger.error(`Error in clickContinueWithApple: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if cookie consent is visible
   * @returns {Promise<boolean>} - True if cookie consent is visible
   */
  async isCookieConsentVisible() {
    try {
      // First try a direct method
      const count = await this.cookieConsentContainer.count();
      
      if (count > 0) {
        // Check each element to see if any are visible
        for (let i = 0; i < Math.min(count, 5); i++) {
          try {
            const visible = await this.cookieConsentContainer.nth(i).isVisible({ timeout: 1000 }).catch(() => false);
            if (visible) return true;
          } catch (error) {
            // Ignore errors for individual elements
          }
        }
      }
      
      // Try alternative - checking for cookie buttons
      const acceptButton = this.page.locator('[data-cky-tag="accept-button"], button:has-text("Accept")').first();
      if (await acceptButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        return true;
      }
      
      return false;
    } catch (error) {
      // If there's an error, assume no cookie consent
      return false;
    }
  }

  /**
   * Accept cookie consent if visible - safely, handling strict mode issues
   */
  async handleCookieConsent() {
    try {
      // Use the BasePage's acceptCookies method which has been made more robust
      await this.acceptCookies();
    } catch (error) {
      // If there's an error, just log it and continue
      logger.warn(`Cookie handling error: ${error.message}`);
    }
  }
  
  /**
   * Get login options that are actually visible on the page
   * @returns {Promise<Array<{name: string, element: Locator}>>} Array of visible login options
   */
  async getVisibleLoginOptions() {
    const options = [];
    
    // Check standard login options
    if (await this.continueWithEmailButton.isVisible().catch(() => false)) {
      options.push({ name: 'Email', element: this.continueWithEmailButton });
    }
    
    if (await this.continueWithGoogleButton.isVisible().catch(() => false)) {
      options.push({ name: 'Google', element: this.continueWithGoogleButton });
    }
    
    if (await this.continueWithAppleButton.isVisible().catch(() => false)) {
      options.push({ name: 'Apple', element: this.continueWithAppleButton });
    }
    
    // Check for other common login options
    const otherOptions = [
      { selector: 'a:has-text(/facebook/i), button:has-text(/facebook/i)', name: 'Facebook' },
      { selector: 'a:has-text(/twitter/i), button:has-text(/twitter/i)', name: 'Twitter' },
      { selector: 'a:has-text(/github/i), button:has-text(/github/i)', name: 'GitHub' },
      { selector: 'a:has-text(/microsoft/i), button:has-text(/microsoft/i)', name: 'Microsoft' },
      { selector: 'form input[type="email"]', name: 'Email Form' }
    ];
    
    for (const option of otherOptions) {
      const element = this.page.locator(option.selector).first();
      if (await element.isVisible().catch(() => false)) {
        options.push({ name: option.name, element });
      }
    }
    
    return options;
  }
  
  /**
   * Takes a screenshot of the current page state
   * Useful for debugging test failures
   */
  async takeDebugScreenshot(name = 'platform-debug') {
    await this.page.screenshot({ path: `./ui/reports/screenshots/${name}-${Date.now()}.png` });
  }
}

module.exports = PlatformPage;
