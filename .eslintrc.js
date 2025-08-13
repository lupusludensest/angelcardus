module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'playwright/no-forced-navigations': 'error',
    'playwright/no-wait-for-timeout': 'warn',
    // Disable no-conditional-in-test since we need conditionals for our resilient test strategy
    'playwright/no-conditional-in-test': 'off',
    'playwright/valid-expect': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'ui/reports/',
    'ui/test-results/',
    'playwright-report/',
    'dist/'
  ]
};
