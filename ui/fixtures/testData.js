/**
 * Test user data for authentication tests
 */
const testUsers = {
  standardUser: {
    email: 'test@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    cardDetails: {
      number: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123'
    }
  },
  premiumUser: {
    email: 'premium@example.com',
    password: 'Password456!',
    firstName: 'Premium',
    lastName: 'User',
    cardDetails: {
      number: '5555555555554444',
      expiryDate: '11/25',
      cvv: '321'
    }
  }
};

/**
 * Test credit card data
 */
const testCreditCards = [
  {
    bank: 'Example Bank',
    type: 'Visa',
    lastDigits: '1111',
    expiryDate: '12/25',
    cardholderName: 'TEST USER'
  },
  {
    bank: 'Other Bank',
    type: 'Mastercard',
    lastDigits: '4444',
    expiryDate: '11/25',
    cardholderName: 'PREMIUM USER'
  }
];

module.exports = {
  testUsers,
  testCreditCards
};
