import crypto from 'crypto';

export class CryptoUtil {
  /**
   * Generates a cryptographically secure random hex string.
   */
  static randomString(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Hashes any string (e.g., refresh token, reset token) using SHA-256.
   * This ensures plain tokens are never stored directly in the database.
   */
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
