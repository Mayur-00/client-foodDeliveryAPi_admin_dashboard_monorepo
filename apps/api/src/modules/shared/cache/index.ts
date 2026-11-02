import { logger } from '../../../config/logger.config.js';
import redis from '../../../config/redis.config.js';
import { CacheService } from './cache.service.js';

export * from './cache.service.js';

export const cacheService = new CacheService(logger, redis);