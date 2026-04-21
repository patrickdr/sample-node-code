import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/AppError.js';
import type AuthService from '../services/auth.service.js';

const createAuthMiddleware = (authService: AuthService): RequestHandler => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or malformed Authorization header'));
    return;
  }
  const token = authHeader.slice(7);
  try {
    req.user = authService.verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
};

export default createAuthMiddleware;
