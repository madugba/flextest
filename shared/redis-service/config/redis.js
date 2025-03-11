import Redis from 'ioredis';
import { AppError } from "@flextest/apperrorhandler";
import { HttpStatusCode } from 'axios';

const createRedisClient = (customRedisUrl = null) => {
  const redisUrl = customRedisUrl || 'redis://localhost:6379';

  const redis = new Redis(redisUrl, {
    retryStrategy(times) {
      const delay = Math.min(times * 50, 60000);
      return delay;
    },
    reconnectOnError(err) {
      const targetErrors = ['READONLY', 'ECONNRESET'];
      if (targetErrors.some(targetError => err.message.includes(targetError))) {
        return true;
      }
      return false;
    },
    maxRetriesPerRequest: 5,
    enableAutoPipelining: true,
    lazyConnect: true,
  });

 
  const shutdownRedis = async () => {
    try {
      await redis.quit();
    } catch (err) {
      throw new AppError(HttpStatusCode.InternalServerError, `Error during Redis shutdown: ${err}`)
    }
  };

  process.on('SIGINT', shutdownRedis);
  process.on('SIGTERM', shutdownRedis);

  return redis;
};

export default createRedisClient;

