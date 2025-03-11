import { HttpStatusCode } from "axios";
import createRedisClient from "./config/redis.js";
import { AppError } from "@flextest/apperrorhandler";

class RedisService {
  constructor(redisUrl) {
    this.redis = null;
    this.redisUrl = redisUrl;
  }

  async connect() {
    try {
      if (!this.redis) {
        this.redis = createRedisClient(this.redisUrl);
        await this.redis.ping();
      }
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Failed to connect to Redis');
    }
  }

  async ensureConnection() {
    if (!this.redis) {
      await this.connect();
    }
  }

  async set(key, value, ttl = 300) {
    try {
      await this.ensureConnection();
      await this.redis.setex(key, ttl, value);
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Error setting data in Redis');
    }
  }

  async get(key) {
    try {
      if (!key) {
        throw new AppError(HttpStatusCode.BadRequest, 'Redis key required');
      }
      await this.ensureConnection();
      const value = await this.redis.get(key);
      return value;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(HttpStatusCode.InternalServerError, 'Error getting data from Redis');
    }
  }

  async delete(key) {
    try {
      await this.ensureConnection();
      await this.redis.del(key);
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Error deleting data from Redis');
    }
  }

  async cacheServiceInstances(serviceName, instances, ttl = 60) {
    try {
      const instanceStr = JSON.stringify(instances);
      await this.set(serviceName, instanceStr, ttl);
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Error caching service instances');
    }
  }

  async getServiceInstances(serviceName) {
    try {
      const instanceStr = await this.get(serviceName);
      if (instanceStr) {
        return JSON.parse(instanceStr);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async disconnect() {
    try {
      if (this.redis) {
        await this.redis.quit();
        this.redis = null;
      }
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Error disconnecting from Redis');
    }
  }
}

export default RedisService;
