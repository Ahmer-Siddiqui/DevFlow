import winston from 'winston';
import { env } from './env';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Human-readable format for local development
const devFormat = printf(({ level, message, timestamp, stack, requestId }) => {
  const reqPrefix = requestId ? `[${requestId}] ` : '';
  return `${timestamp} ${level}: ${reqPrefix}${stack || message}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'production'
        ? json()
        : combine(colorize({ all: true }), devFormat),
    }),
  ],
  exitOnError: false,
});
