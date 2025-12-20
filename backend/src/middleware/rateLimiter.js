const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware configurations
 */

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Product submission rate limiter (stricter)
const submissionLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Limit each IP to 5 product submissions per day
  message: 'Maximum 5 product submissions per day reached. Please try again tomorrow.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Voting rate limiter
const voteLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // Limit each IP to 50 votes per day
  message: 'Maximum 50 votes per day reached. Please try again tomorrow.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Report rate limiter
const reportLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Limit each IP to 10 reports per day
  message: 'Maximum 10 reports per day reached. Please try again tomorrow.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  submissionLimiter,
  voteLimiter,
  reportLimiter,
};
