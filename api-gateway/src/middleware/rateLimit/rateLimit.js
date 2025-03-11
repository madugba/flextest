import { HttpStatusCode } from 'axios';
import RateLimit from 'express-rate-limit';
import { MAX_RATELIMIT } from '../../config/envconfig.js';
import { AppError } from '@flextest/apperrorhandler';


const maxRateLimit = Number(MAX_RATELIMIT);
const rateLimitValue = isNaN(maxRateLimit) || maxRateLimit <= 0 ? 100 : maxRateLimit;

const rateLimits = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: rateLimitValue,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response, next) => {
    const error = new AppError(HttpStatusCode.TooManyRequests, 'Too many requests', true, '', 'RATE_LIMIT_EXCEEDED');
    next(error);
  },
  skipFailedRequests: true,
  keyGenerator: (request) => request.ip,
});

export default rateLimits;