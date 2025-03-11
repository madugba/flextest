import { createRateLimiter } from '@flextest/ratelimit';

const maxRateLimit = Number(process.env.MAX_RATELIMIT) || 100;
const maxLoginRateLimit = Number(process.env.MAX_LOGIN_RATELIMIT) || 10;

const rateLimiter = createRateLimiter({ maxRateLimit });
const loginRateLimit = createRateLimiter({ maxRateLimit: maxLoginRateLimit });

export {
  rateLimiter,
  loginRateLimit
};
