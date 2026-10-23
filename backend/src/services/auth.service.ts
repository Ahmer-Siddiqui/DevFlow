import { AppDataSource } from '../config/data-source';
import { User, Session } from '../entities';
import { ApiError } from '../utils/api-error';
import { PasswordUtil } from '../utils/password.util';
import { CryptoUtil } from '../utils/crypto.util';
import { TokenService } from './token.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export interface AuthClientMetadata {
  userAgent?: string | null;
  ipAddress?: string | null;
}

export interface AuthResult {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static userRepository = AppDataSource.getRepository(User);
  private static sessionRepository = AppDataSource.getRepository(Session);

  /**
   * Register a new user and create an initial session.
   */
  static async register(input: RegisterInput, meta: AuthClientMetadata): Promise<AuthResult> {
    const existing = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (existing) {
      throw ApiError.conflict('An account with this email address already exists', 'EMAIL_TAKEN');
    }

    const passwordHash = await PasswordUtil.hash(input.password);

    const user = this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      isEmailVerified: false,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiresAt } =
      TokenService.generateAuthTokens({ userId: user.id, email: user.email });

    // Persist Session with hashed refresh token
    const session = this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt: refreshTokenExpiresAt,
    });

    await this.sessionRepository.save(session);

    // Remove passwordHash before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate a user with email & password, issuing a new session.
   */
  static async login(input: LoginInput, meta: AuthClientMetadata): Promise<AuthResult> {
    // Specifically query passwordHash using query builder because select: false
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: input.email })
      .getOne();

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await PasswordUtil.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Generate tokens
    const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiresAt } =
      TokenService.generateAuthTokens({ userId: user.id, email: user.email });

    // Persist session
    const session = this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt: refreshTokenExpiresAt,
    });

    await this.sessionRepository.save(session);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate a Refresh Token: Invalidate old token hash and issue new pair.
   */
  static async refreshToken(
    rawRefreshToken: string,
    meta: AuthClientMetadata
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    const tokenHash = CryptoUtil.sha256(rawRefreshToken);

    const session = await this.sessionRepository.findOne({
      where: { refreshTokenHash: tokenHash },
      relations: ['user'],
    });

    if (!session) {
      throw ApiError.unauthorized('Invalid or expired refresh token. Please log in again.', 'SESSION_NOT_FOUND');
    }

    if (session.expiresAt < new Date()) {
      await this.sessionRepository.remove(session);
      throw ApiError.unauthorized('Refresh token has expired. Please log in again.', 'TOKEN_EXPIRED');
    }

    // Token Rotation: Generate new pair
    const { accessToken, refreshToken: newRefreshToken, refreshTokenHash: newHash, refreshTokenExpiresAt } =
      TokenService.generateAuthTokens({ userId: session.user.id, email: session.user.email });

    // Update existing session with new rotated hash
    session.refreshTokenHash = newHash;
    session.expiresAt = refreshTokenExpiresAt;
    session.userAgent = meta.userAgent || session.userAgent;
    session.ipAddress = meta.ipAddress || session.ipAddress;

    await this.sessionRepository.save(session);

    return {
      accessToken,
      newRefreshToken,
    };
  }

  /**
   * Log out: Invalidate the specific session.
   */
  static async logout(rawRefreshToken: string): Promise<void> {
    if (!rawRefreshToken) return;

    const tokenHash = CryptoUtil.sha256(rawRefreshToken);
    await this.sessionRepository.delete({ refreshTokenHash: tokenHash });
  }

  /**
   * Retrieve current user profile.
   */
  static async getCurrentUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    return user;
  }
}
