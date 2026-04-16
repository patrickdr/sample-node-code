import { jest } from '@jest/globals';
import { z } from 'zod';
import validate from '../../src/middlewares/validate.middleware.js';
import errorMiddleware from '../../src/middlewares/error.middleware.js';
import createAuthMiddleware from '../../src/middlewares/auth.middleware.js';
import { NotFoundError, UnauthorizedError } from '../../src/errors/AppError.js';

describe('validate middleware', () => {
  const schema = z.object({ name: z.string().min(1) });

  it('calls next with ValidationError when body is invalid', () => {
    const req = { body: {} };
    const next = jest.fn();
    validate(schema)(req, {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  it('calls next() and sets req.body to parsed data when valid', () => {
    const req = { body: { name: 'Alice', extra: 'stripped' } };
    const next = jest.fn();
    validate(schema)(req, {}, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'Alice' });
  });
});

describe('error middleware', () => {
  const res = () => {
    const r = {};
    r.status = jest.fn().mockReturnValue(r);
    r.json = jest.fn().mockReturnValue(r);
    return r;
  };

  it('returns statusCode and error name for AppError', () => {
    const r = res();
    errorMiddleware(new NotFoundError('not found'), {}, r, jest.fn());
    expect(r.status).toHaveBeenCalledWith(404);
    expect(r.json).toHaveBeenCalledWith({ error: 'NotFoundError', message: 'not found' });
  });

  it('returns 500 for unknown errors', () => {
    const r = res();
    errorMiddleware(new Error('boom'), {}, r, jest.fn());
    expect(r.status).toHaveBeenCalledWith(500);
    expect(r.json).toHaveBeenCalledWith({ error: 'InternalServerError', message: 'Something went wrong' });
  });
});

describe('auth middleware', () => {
  it('calls next with UnauthorizedError when no Authorization header', () => {
    const authService = { verifyToken: jest.fn() };
    const middleware = createAuthMiddleware(authService);
    const req = { headers: {} };
    const next = jest.fn();
    middleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('attaches decoded user to req.user on valid token', () => {
    const decoded = { sub: '1', email: 'a@b.com' };
    const authService = { verifyToken: jest.fn().mockReturnValue(decoded) };
    const middleware = createAuthMiddleware(authService);
    const req = { headers: { authorization: 'Bearer valid.token.here' } };
    const next = jest.fn();
    middleware(req, {}, next);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalledWith();
  });
});
