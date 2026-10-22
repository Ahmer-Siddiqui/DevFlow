import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { env } from './config/env';
import { logger } from './config/logger';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { ApiResponse } from './utils/api-response';
import { ApiError } from './utils/api-error';

const app: Application = express();

// 1. Security & Performance Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Request Tracing & Structured HTTP Logging
app.use(requestIdMiddleware);
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      requestId: req.id,
      ip: req.ip,
      status: res.statusCode,
      duration,
    });
  });
  next();
});

// 3. Health Check & Diagnostic Endpoints
app.get('/health', (req: Request, res: Response) => {
  return ApiResponse.ok(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  }, 'Service is operational');
});

app.get(`${env.API_PREFIX}/health`, (req: Request, res: Response) => {
  return ApiResponse.ok(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  }, 'DevFlow API v1 is operational');
});

// 4. API Routes (Will mount v1 router here)
// app.use(env.API_PREFIX, v1Router);

// 5. 404 Route Handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// 6. Global Centralized Error Middleware
app.use(errorMiddleware);

export default app;
