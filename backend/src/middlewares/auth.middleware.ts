import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { TokenService } from '../services/token.service';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Fallback to cookie
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. No token provided.', 'AUTH_REQUIRED');
    }

    // 3. Verify JWT signature & expiration
    const decoded = TokenService.verifyAccessToken(token);

    // 4. Verify user still exists in database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.userId } });

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.', 'USER_NOT_FOUND');
    }

    // 5. Attach authenticated user to request context
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
