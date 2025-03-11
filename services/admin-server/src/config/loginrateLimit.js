import { HttpStatusCode } from 'axios';
import RateLimit from 'express-rate-limit';
import { AppError } from "@flextest/apperrorhandler";

const loginRateLimit = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator: (request) => request.ip,
  handler: (req, res, next) => {
    const error = new AppError(HttpStatusCode.TooManyRequests, 'Too many login attempts', true, '', 'RATE_LIMIT_EXCEEDED');
    next(error);
  },
});

export default loginRateLimit;