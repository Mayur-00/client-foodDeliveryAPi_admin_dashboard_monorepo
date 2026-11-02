import { Redis } from 'ioredis';

const redisUrl = process.env.CACHE_REDIS_URL!;


const redis = new Redis(redisUrl, {
  // lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Retrying Redis connection (attempt ${times})...`);
    return delay;
  },
});

export type redisClientType = typeof redis;

redis.on('connect', () => {
  console.log('✓ Connected to Redis Cloud ❤️');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

export default redis;
