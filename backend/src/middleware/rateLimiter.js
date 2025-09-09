// backend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Strict rate limiting for AI generation endpoints
const rateLimitStrict = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute for AI endpoints
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many meal plan generation requests. Please wait before trying again.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
const rateLimitGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests from this IP, please try again later.'
  }
});

module.exports = {
  rateLimitStrict,
  rateLimitGeneral
};
