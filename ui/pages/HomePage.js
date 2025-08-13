const BasePage = require('./BasePage');

/**
 * Home page object model
 */
class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Initialize selectors based on actual website structure
    this.angelCardLogo = page.locator('img').first();
    this.publicOfferLink = page.locator('a:has-text("Public offer and Privacy policy")');
    this.termsAndConditionsLink = page.locator('a:has-text("Terms & Conditions")');
    this.refundPolicyLink = page.locator('a:has-text("Refund Policy")');
    this.shippingPolicyLink = page.locator('a:has-text("Shipping Policy")');
    // Cookie related selectors
    this.consentPreferencesButton = page.locator('[data-cky-tag="preferences-button"]');
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All' }).first();
    // Price indicator - may not be directly visible as "$1" text
    this.costOfServiceText = page.locator('text=/\\$1/, text=/1\\$/, :text-matches("\\$\\s*1")').first();
    
    // Try to find an "Enter Platform" button with various selectors
    this.enterPlatformButton = page.locator('a:has-text("Enter Platform"), button:has-text("Enter Platform"), a:has-text("Enter"), button:has-text("Enter")').first();
  }

  /**
   * Navigate to home page
   */
  async navigateToHomePage() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Click Enter Platform button if it exists
   * Note: This method is kept for compatibility, but the button may not exist on the current page
   */
  async clickEnterPlatform() {
    // Check if enterPlatformButton is defined
    if (!this.enterPlatformButton) {
      const possibleButtons = [
        this.page.getByRole('link', { name: /enter/i }).first(),
        this.page.getByRole('button', { name: /enter/i }).first(),
        this.page.locator('a:has-text("Enter"), button:has-text("Enter")').first()
      ];
      
      for (const button of possibleButtons) {
        if (await button.isVisible().catch(() => false)) {
          await button.click();
          await this.waitForPageLoad();
          return;
        }
      }
      throw new Error('Enter Platform button not found on page');
    }
    
    await this.enterPlatformButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Click on AngelCard logo 
   * Note: On this site, the logo may not always navigate back to home
   * It seems to act as a decorative element on some pages
   */
  async clickAngelCardLogo() {
    // First check if logo is visible and clickable
    const isLogoVisible = await this.angelCardLogo.isVisible().catch(() => false);
    
    if (!isLogoVisible) {
      throw new Error('AngelCard logo is not visible on the page');
    }
    
    // Try clicking the logo directly
    await this.angelCardLogo.click();
    await this.waitForPageLoad();
    
    // Log the actual behavior
    const currentUrl = this.page.url();
    if (currentUrl.match(/.*angelcard\.us\/?$/) || currentUrl.match(/.*angelcard\.us\/$/)) {
      // Successfully navigated to home
      return true;
    } else {
      // Logo click didn't navigate to home
      return false;
    }
  }

  /**
   * Click on Public Offer and Privacy Policy link
   */
  async clickPublicOfferLink() {
    await this.publicOfferLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Click on Terms and Conditions link
   */
  async clickTermsAndConditions() {
    await this.termsAndConditionsLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Click on Refund Policy link
   */
  async clickRefundPolicy() {
    await this.refundPolicyLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Click on Shipping Policy link
   */
  async clickShippingPolicy() {
    await this.shippingPolicyLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Check if any "Enter Platform" type button is visible
   * @returns {Promise<boolean>} - True if button is visible
   */
  async isEnterPlatformButtonVisible() {
    const possibleButtons = [
      this.page.getByRole('link', { name: /enter/i }).first(),
      this.page.getByRole('button', { name: /enter/i }).first(),
      this.page.locator('a:has-text("Enter"), button:has-text("Enter")').first()
    ];
    
    for (const button of possibleButtons) {
      if (await button.isVisible().catch(() => false)) {
        return true;
      }
    }
    
    return false;
  }
}

module.exports = HomePage;
