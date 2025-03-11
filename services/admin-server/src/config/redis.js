import RedisService from "@flextest/redis-service";

const REDIS_URL = process.env.REDIS_URL;

const redis = new RedisService(REDIS_URL);

export default redis;
