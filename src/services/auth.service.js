import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';

export default class AuthService {
  constructor(userRepository, config) {
    this.userRepository = userRepository;
    this.config = config;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      this.config.JWT_SECRET,
      { expiresIn: this.config.JWT_EXPIRES_IN }
    );
    return { token };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.config.JWT_SECRET);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
