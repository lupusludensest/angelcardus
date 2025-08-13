# AngelCard.us UI Testing Framework

This repository contains a comprehensive UI testing framework for [AngelCard.us](https://www.angelcard.us/), implementing end-to-end (e2e) testing using Playwright.

## Project Overview

AngelCard is a service that helps users monitor their credit cards and provides notifications about their status to prevent unwanted card cancellations, which could negatively impact credit scores. The service offers:

- Credit card status monitoring through a personal dashboard
- Automated notifications regarding credit cards' status
- A commercial satisfaction guarantee (Angel Guarantee)

## Framework Structure

```
angelcardus/
├── ui/                         # UI Testing Framework
│   ├── config/                 # Configuration files
│   ├── fixtures/               # Test fixtures and test data
│   ├── pages/                  # Page Object Models (POM)
│   ├── reports/                # Test reports output
│   ├── tests/                  # Test cases
│   ├── utils/                  # Helper functions and utilities
│   └── webhooks/               # Webhook implementation
├── .env                        # Environment variables
├── .gitignore                  # Git ignore configuration
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Technologies

- **[Playwright](https://playwright.dev/)**: Modern end-to-end testing framework for web applications
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**: Core programming language for the test framework
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment
- **[Allure Report](http://allure.qatools.ru/)**: Beautiful test report visualization
- **[Webhook Implementation](https://developer.mozilla.org/en-US/docs/Web/API/Webhooks_API)**: For CI/CD integration

## Features

- **Page Object Model (POM)**: Clear separation of test logic and page interactions
- **Cross-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **Parallel Test Execution**: For faster test runs
- **Screenshot & Video Capture**: For failed tests
- **Data-Driven Testing**: Using fixtures and parameterized tests
- **CI/CD Integration**: Using GitHub Actions
- **Webhooks**: For test result notifications
- **Visual Testing**: For UI regression testing
- **Accessibility Testing**: For ensuring application accessibility
- **Comprehensive Reporting**: With Allure Reports

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lupusludensest/angelcardus.git
   cd angelcardus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

### Running Tests

Run all tests:
```bash
npm test
```

Run specific test file:
```bash
npx playwright test ui/tests/homeNavigation.spec.js
```

Run tests with specific browser:
```bash
npx playwright test --project=chromium
```

Generate and open Allure report:
```bash
npm run report
```

## Test Coverage

The framework includes tests for the following user flows:

1. **Homepage Navigation**: Verify core UI elements and navigation
2. **Platform Entry**: Test the "Enter Platform" functionality
3. **User Authentication**: Login, registration, and account verification
4. **Dashboard Functionality**: Credit card monitoring features
5. **Notification System**: Alert configuration and delivery
6. **Public Offer & Privacy Policy**: Terms and conditions acceptance
7. **Responsiveness**: Mobile and tablet views
8. **Accessibility**: WCAG compliance tests

## Future Extensions

This framework is designed to be extended with:

- **API Tests**: For testing backend services
- **Stress Tests**: For performance under load
- **Performance Tests**: For monitoring application speed and resource usage

## Webhooks

The framework includes webhook implementations for:

1. Test execution start/completion notifications
2. Integration with CI/CD pipelines
3. Slack/Teams notifications for test failures
4. Report generation triggers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact the project maintainer.
