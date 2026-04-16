import { UnauthorizedError } from '../errors/AppError.js';

const createAuthMiddleware = (authService) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
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
