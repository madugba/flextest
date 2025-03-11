import { HttpStatusCode } from 'axios';
import RateLimit from 'express-rate-limit';
import { AppError } from '@flextest/apperrorhandler';

/**
 * Rate limiter package
 * @param {Object} options - The options for the rate limiter.
 * @param {number} options.maxRateLimit - The maximum number of requests allowed within the time window (default: 100).
 * @param {number} options.windowMs - The time window for rate limiting in milliseconds (default: 1 minute).
 * @returns {function} The rate limiter middleware function.
 */
export const createRateLimiter = ({ maxRateLimit = 100, windowMs = 1 * 60 * 1000 }) => {
  // Ensure the maxRateLimit is a positive integer
  const rateLimitValue = isNaN(maxRateLimit) || maxRateLimit <= 0 ? 100 : maxRateLimit;

  return RateLimit({
    windowMs, // Time window for requests (default: 1 minute)
    max: rateLimitValue, // Maximum requests allowed (default: 100)
    standardHeaders: true, // Send rate limit info in response headers
    legacyHeaders: false, // Do not send X-RateLimit-Remaining header
    handler: (request, response, next) => {
      const error = new AppError(HttpStatusCode.TooManyRequests, 'Too many requests', true, '', 'RATE_LIMIT_EXCEEDED');
      next(error);
    },
    skipFailedRequests: true, // Skip rate-limiting failed requests
    keyGenerator: (request) => request.ip, // Generate a key for each IP
  });
};
