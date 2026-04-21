import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';
import type UserRepository from '../repositories/user.repository.js';
import type { Config } from '../config/env.js';
import type { JwtPayload } from '../types/auth.js';

export default class AuthService {
  constructor(
    private userRepository: UserRepository,
    private config: Config,
  ) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      this.config.JWT_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { expiresIn: this.config.JWT_EXPIRES_IN as any },
    );
    return { token };
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.config.JWT_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
