import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export class PasswordUtil {
  /**
   * Hashes a plaintext password using bcrypt with 12 salt rounds.
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compares a plaintext password with a hashed password.
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
