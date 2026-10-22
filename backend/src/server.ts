import 'reflect-metadata';
import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, AppDataSource } from './config/data-source';
import { connectRedis, redisClient } from './config/redis';

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    logger.info('🚀 Bootstrapping DevFlow Backend Server...');

    // 1. Initialize Database Connection
    await connectDatabase().catch((err) => {
      logger.warn(`Database connection deferred or failed: ${err.message}. Ensure PostgreSQL / Supabase credentials in .env are correct.`);
    });

    // 2. Initialize Redis Connection
    await connectRedis();

    // 3. Start HTTP Server
    server.listen(env.PORT, () => {
      logger.info(`✨ DevFlow API listening on port ${env.PORT} in [${env.NODE_ENV}] mode`);
      logger.info(`👉 Health Check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful Shutdown Handler
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`🛑 Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info('PostgreSQL connection pool closed');
      }

      if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
        await redisClient.quit();
        logger.info('Redis connection closed');
      }

      logger.info('Graceful shutdown complete. Exiting.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10s timeout
  setTimeout(() => {
    logger.error('Forcefully terminating process after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
