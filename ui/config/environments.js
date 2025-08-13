/**
 * Environment configuration for testing
 */
const environments = {
  production: {
    baseURL: 'https://www.angelcard.us',
    platformURL: 'https://platform.angelcard.us',
    apiURL: 'https://api.angelcard.us',
  }
};

// Get environment configuration
const getEnvironment = () => {
  return environments.production;
};

module.exports = {
  environments,
  getEnvironment
};
