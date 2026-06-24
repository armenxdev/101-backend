const Redis = require('ioredis');

let redis = null;

const connectRedis = () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });

  redis.on('connect', () => console.log('Redis connected'));
  redis.on('error', (err) => console.error('Redis error:', err.message));

  return redis.connect().catch((err) => {
    console.warn('Redis unavailable, OTP caching disabled:', err.message);
    redis = null;
  });
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
