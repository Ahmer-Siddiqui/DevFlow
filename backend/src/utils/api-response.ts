import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown> | PaginationMeta;
}

export class ApiResponse {
  static send<T>(res: Response, options: ApiResponseOptions<T>): Response {
    const { statusCode = 200, message = 'Success', data = null, meta } = options;

    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  }

  static ok<T>(res: Response, data: T, message = 'Success', meta?: Record<string, unknown>): Response {
    return ApiResponse.send(res, { statusCode: 200, data, message, meta });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return ApiResponse.send(res, { statusCode: 201, data, message });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static paginated<T>(
    res: Response,
    items: T[],
    pagination: PaginationMeta,
    message = 'Data retrieved successfully'
  ): Response {
    return ApiResponse.send(res, {
      statusCode: 200,
      message,
      data: items,
      meta: { pagination },
    });
  }
}
