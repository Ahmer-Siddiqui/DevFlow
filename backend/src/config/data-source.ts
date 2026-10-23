import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { logger } from './logger';

import { User, Session } from '../entities';

const isProduction = env.NODE_ENV === 'production';
const isSupabase = env.DATABASE_URL.includes('supabase.co');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === 'development', // Auto-sync in dev; disable in prod in favor of migrations
  logging: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  entities: [User, Session, __dirname + '/../entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  subscribers: [],
  ssl: isSupabase || isProduction ? { rejectUnauthorized: false } : false,
  extra: {
    // Connection pool limits
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
});

export const connectDatabase = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('🐘 PostgreSQL Database successfully connected via TypeORM');
    }
    return AppDataSource;
  } catch (error) {
    logger.error('❌ Failed to connect to PostgreSQL Database:', error);
    throw error;
  }
};
