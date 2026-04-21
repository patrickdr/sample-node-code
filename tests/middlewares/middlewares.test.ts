import { jest } from '@jest/globals';
import { z } from 'zod';
import validate from '../../src/middlewares/validate.middleware.js';
import errorMiddleware from '../../src/middlewares/error.middleware.js';
import createAuthMiddleware from '../../src/middlewares/auth.middleware.js';
import { NotFoundError, UnauthorizedError } from '../../src/errors/AppError.js';
import type { Request, Response, NextFunction } from 'express';
import type AuthService from '../../src/services/auth.service.js';

describe('validate middleware', () => {
  const schema = z.object({ name: z.string().min(1) });

  it('calls next with ValidationError when body is invalid', () => {
    const req = { body: {} } as Request;
    const next = jest.fn() as unknown as NextFunction;
    validate(schema)(req, {} as Response, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  it('calls next() and sets req.body to parsed data when valid', () => {
    const req = { body: { name: 'Alice', extra: 'stripped' } } as Request;
    const next = jest.fn() as unknown as NextFunction;
    validate(schema)(req, {} as Response, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'Alice' });
  });
});

describe('error middleware', () => {
  const makeRes = () => {
    const r = { status: jest.fn(), json: jest.fn() };
    r.status.mockReturnValue(r);
    r.json.mockReturnValue(r);
    return r as unknown as Response;
  };

  it('returns statusCode and error name for AppError', () => {
    const r = makeRes();
    errorMiddleware(new NotFoundError('not found'), {} as Request, r, jest.fn() as unknown as NextFunction);
    expect((r.status as jest.Mock)).toHaveBeenCalledWith(404);
    expect((r.json as jest.Mock)).toHaveBeenCalledWith({ error: 'NotFoundError', message: 'not found' });
  });

  it('returns 500 for unknown errors', () => {
    const r = makeRes();
    errorMiddleware(new Error('boom'), {} as Request, r, jest.fn() as unknown as NextFunction);
    expect((r.status as jest.Mock)).toHaveBeenCalledWith(500);
    expect((r.json as jest.Mock)).toHaveBeenCalledWith({ error: 'InternalServerError', message: 'Something went wrong' });
  });
});

describe('auth middleware', () => {
  it('calls next with UnauthorizedError when no Authorization header', () => {
    const authService = { verifyToken: jest.fn() } as unknown as AuthService;
    const middleware = createAuthMiddleware(authService);
    const req = { headers: {} } as Request;
    const next = jest.fn() as unknown as NextFunction;
    middleware(req, {} as Response, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('attaches decoded user to req.user on valid token', () => {
    const decoded = { sub: '1', email: 'a@b.com' };
    const authService = { verifyToken: jest.fn().mockReturnValue(decoded) } as unknown as AuthService;
    const middleware = createAuthMiddleware(authService);
    const req = { headers: { authorization: 'Bearer valid.token.here' } } as Request;
    const next = jest.fn() as unknown as NextFunction;
    middleware(req, {} as Response, next);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalledWith();
  });
});
