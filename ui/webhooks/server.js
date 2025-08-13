const express = require('express');
const dotenv = require('dotenv');
const { createHmac } = require('crypto');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default_secret';

// Middleware to parse JSON
app.use(express.json());

/**
 * Verify webhook signature
 * @param {string} signature - Webhook signature from request header
 * @param {object} payload - Request payload
 * @returns {boolean} - True if signature is valid
 */
const verifySignature = (signature, payload) => {
  const hmac = createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');
  return signature === digest;
};

/**
 * Handle incoming test result webhooks
 */
app.post('/webhook/test-results', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  // Verify webhook signature
  if (!signature || !verifySignature(signature, req.body)) {
    logger.warn('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { testResults, buildId, runId } = req.body;
  
  logger.info(`Received test results webhook for build ${buildId}, run ${runId}`);
  logger.info(`Test summary: ${testResults.summary}`);
  
  // Process test results here
  // For example, send notifications or update dashboards
  
  return res.status(200).json({ status: 'success' });
});

/**
 * Handle CI/CD pipeline triggers
 */
app.post('/webhook/ci-trigger', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  // Verify webhook signature
  if (!signature || !verifySignature(signature, req.body)) {
    logger.warn('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { repository, branch, commit, action } = req.body;
  
  logger.info(`Received CI trigger webhook for ${repository}/${branch} (${commit})`);
  logger.info(`Action: ${action}`);
  
  // Process CI/CD trigger here
  // For example, trigger test run or deployment
  
  return res.status(200).json({ status: 'success' });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'healthy' });
});

/**
 * Start webhook server
 */
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Webhook server running on port ${PORT}`);
  });
}

module.exports = app;
