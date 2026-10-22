export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code = 'INTERNAL_ERROR',
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', details?: unknown): ApiError {
    return new ApiError(400, message, code, true, details);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(401, message, code, true);
  }

  static forbidden(message = 'Forbidden: Access Denied', code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, message, code, true);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, message, code, true);
  }

  static conflict(message = 'Conflict: Resource already exists', code = 'CONFLICT'): ApiError {
    return new ApiError(409, message, code, true);
  }

  static unprocessable(message = 'Unprocessable Entity', code = 'VALIDATION_ERROR', details?: unknown): ApiError {
    return new ApiError(422, message, code, true, details);
  }

  static internal(message = 'Internal Server Error', code = 'INTERNAL_SERVER_ERROR'): ApiError {
    return new ApiError(500, message, code, false);
  }
}
