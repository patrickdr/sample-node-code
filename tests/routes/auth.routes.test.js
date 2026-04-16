import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import createAuthRouter from '../../src/routes/auth.routes.js';
import AuthController from '../../src/controllers/auth.controller.js';
import errorMiddleware from '../../src/middlewares/error.middleware.js';
import { UnauthorizedError } from '../../src/errors/AppError.js';

const makeApp = (authServiceOverrides = {}) => {
  const authService = {
    login: jest.fn().mockResolvedValue({ token: 'test.jwt.token' }),
    ...authServiceOverrides,
  };
  const controller = new AuthController(authService);
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter(controller));
  app.use(errorMiddleware);
  return app;
};

describe('POST /api/auth/login', () => {
  it('returns 200 with token on valid credentials', async () => {
    const res = await request(makeApp())
      .post('/api/auth/login')
      .send({ email: 'a@b.com', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'test.jwt.token');
  });

  it('returns 400 when email is invalid', async () => {
    const res = await request(makeApp())
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'pass123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(makeApp())
      .post('/api/auth/login')
      .send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('returns 401 when credentials are invalid', async () => {
    const app = makeApp({
      login: jest.fn().mockRejectedValue(new UnauthorizedError('Invalid credentials')),
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@b.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UnauthorizedError');
  });
});
