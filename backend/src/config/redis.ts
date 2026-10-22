import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
  lazyConnect: true,
});

redisClient.on('connect', () => {
  logger.info('🟥 Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.warn(`Redis connection error: ${err.message}`);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    await redisClient.ping();
    logger.info('🟥 Redis ping check passed');
  } catch (error) {
    logger.warn('⚠️ Redis is currently unreachable. Some background queues or caching features may be degraded until Redis starts.');
  }
};
