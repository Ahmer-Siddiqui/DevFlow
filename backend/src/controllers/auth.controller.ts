import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      };

      const result = await AuthService.register(req.body, meta);

      // Set Refresh Token in secure HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      ApiResponse.created(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Account created successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      };

      const result = await AuthService.login(req.body, meta);

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      ApiResponse.ok(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Logged in successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;

      if (!token) {
        throw ApiError.unauthorized('Refresh token is required', 'TOKEN_MISSING');
      }

      const meta = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      };

      const result = await AuthService.refreshToken(token, meta);

      // Rotate cookie
      res.cookie('refreshToken', result.newRefreshToken, COOKIE_OPTIONS);

      ApiResponse.ok(
        res,
        {
          accessToken: result.accessToken,
        },
        'Token rotated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;

      if (token) {
        await AuthService.logout(token);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      ApiResponse.ok(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.ok(res, req.user, 'Current user profile');
    } catch (error) {
      next(error);
    }
  }
}
