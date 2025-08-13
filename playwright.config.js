const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');

// Read from .env file
dotenv.config();

module.exports = defineConfig({
  // Directory where tests are located
  testDir: './ui/tests',
  
  // Maximum time one test can run for
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 60000, // Increase timeout to 60s
  
  // Number of retries if test fails
  retries: Number(process.env.RETRIES) || 1, // Reduce retries for debugging
  
  // Opt out of parallel tests - use 1 worker for easier debugging
  workers: 1,
  
  // Run one test at a time for easier debugging
  fullyParallel: false,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: './ui/reports/html-report' }],
    ['junit', { outputFile: './ui/reports/junit-report.xml' }],
    ['list']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like page.goto()
    baseURL: process.env.BASE_URL || 'https://www.angelcard.us',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video only when test fails
    video: 'on-first-retry',
    
    // Record screenshots only when test fails
    screenshot: 'only-on-failure',
    
    // Set the navigation timeout
    navigationTimeout: 30000,
    
    // Viewport size
    viewport: { 
      width: Number(process.env.VIEWPORT_WIDTH) || 1280, 
      height: Number(process.env.VIEWPORT_HEIGHT) || 720 
    },
    
    // Action timeout
    actionTimeout: 15000,
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'true' || false
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: process.env.HEADLESS === 'true' || false
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: process.env.HEADLESS === 'true' || false
      },
    },
    
    // Test against mobile viewports
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        headless: process.env.HEADLESS === 'true' || false
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
        headless: process.env.HEADLESS === 'true' || false
      },
    },
  ],
  
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'ui/test-results/',
});
