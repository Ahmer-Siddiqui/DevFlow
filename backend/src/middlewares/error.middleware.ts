import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal error occurred';
  let details: unknown = undefined;

  // 1. Handled Operational Errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  }
  // 2. Zod Request Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }
  // 3. PostgreSQL / TypeORM Unique Violation
  else if ('code' in err && (err as { code: string }).code === '23505') {
    statusCode = 409;
    errorCode = 'DUPLICATE_RESOURCE';
    message = 'A resource with this identifier already exists';
  }
  // 4. JWT Syntax or Expiration Errors
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired. Please refresh your session.';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Authentication token is invalid or malformed.';
  } else {
    // Unhandled / Programmer error - log full stack
    logger.error(`Unhandled Error: ${err.message}`, {
      requestId: req.id,
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  }

  // Response payload
  const errorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  };

  return res.status(statusCode).json(errorResponse);
};
