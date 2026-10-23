import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { CryptoUtil } from '../utils/crypto.util';

export interface JwtAccessTokenPayload {
  userId: string;
  email: string;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
}

export class TokenService {
  /**
   * Generates a short-lived JWT Access Token (15m).
   */
  static generateAccessToken(payload: JwtAccessTokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  /**
   * Generates a cryptographically secure random Refresh Token (7d)
   * along with its SHA-256 hash for database persistence.
   */
  static generateRefreshToken(): { token: string; hash: string; expiresAt: Date } {
    const rawToken = CryptoUtil.randomString(40);
    const hash = CryptoUtil.sha256(rawToken);

    // Default 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return {
      token: rawToken,
      hash,
      expiresAt,
    };
  }

  /**
   * Generates both Access and Refresh tokens in one operation.
   */
  static generateAuthTokens(payload: JwtAccessTokenPayload): GeneratedTokens {
    const accessToken = this.generateAccessToken(payload);
    const { token: refreshToken, hash: refreshTokenHash, expiresAt: refreshTokenExpiresAt } =
      this.generateRefreshToken();

    return {
      accessToken,
      refreshToken,
      refreshTokenHash,
      refreshTokenExpiresAt,
    };
  }

  /**
   * Verifies and decodes a JWT Access Token.
   */
  static verifyAccessToken(token: string): JwtAccessTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessTokenPayload;
  }
}
