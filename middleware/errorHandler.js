// middleware/errorHandler.js
const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong' });
};

module.exports = errorHandler;
