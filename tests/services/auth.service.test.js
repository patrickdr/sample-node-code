import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import AuthService from '../../src/services/auth.service.js';
import { UnauthorizedError } from '../../src/errors/AppError.js';

const config = { JWT_SECRET: 'test-secret-32chars-long!!!!!!!!', JWT_EXPIRES_IN: '1h' };

describe('AuthService', () => {
  describe('login', () => {
    it('throws UnauthorizedError when user not found', async () => {
      const repo = { findByEmail: jest.fn().mockResolvedValue(null) };
      const service = new AuthService(repo, config);
      await expect(service.login('a@b.com', 'pass')).rejects.toThrow(UnauthorizedError);
    });

    it('throws UnauthorizedError when password is wrong', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      const repo = { findByEmail: jest.fn().mockResolvedValue({ id: '1', email: 'a@b.com', password: hashed }) };
      const service = new AuthService(repo, config);
      await expect(service.login('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedError);
    });

    it('returns a JWT token on valid credentials', async () => {
      const hashed = await bcrypt.hash('pass123', 10);
      const repo = { findByEmail: jest.fn().mockResolvedValue({ id: '1', email: 'a@b.com', password: hashed }) };
      const service = new AuthService(repo, config);
      const result = await service.login('a@b.com', 'pass123');
      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
      expect(result.token.split('.').length).toBe(3);
    });
  });

  describe('verifyToken', () => {
    it('throws UnauthorizedError on malformed token', () => {
      const service = new AuthService({}, config);
      expect(() => service.verifyToken('not.a.token')).toThrow(UnauthorizedError);
    });

    it('returns decoded payload on valid token', async () => {
      const hashed = await bcrypt.hash('pass', 10);
      const repo = { findByEmail: jest.fn().mockResolvedValue({ id: '42', email: 'x@y.com', password: hashed }) };
      const service = new AuthService(repo, config);
      const { token } = await service.login('x@y.com', 'pass');
      const decoded = service.verifyToken(token);
      expect(decoded.sub).toBe('42');
      expect(decoded.email).toBe('x@y.com');
    });
  });
});
