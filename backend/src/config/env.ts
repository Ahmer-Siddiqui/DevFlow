import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  API_PREFIX: z.string().default('/api/v1'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // PostgreSQL Connection String
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Redis Connection String
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT Configuration
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters long'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Storage
  STORAGE_PROVIDER: z.enum(['local', 'supabase']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('./uploads'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default('devflow-attachments'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ FATAL: Invalid environment variables configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
