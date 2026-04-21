import express, { type Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares/validate.middleware.js';
import type AuthController from '../controllers/auth.controller.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createAuthRouter = (controller: AuthController): Router => {
  const router = express.Router();
  router.post('/login', validate(loginSchema), controller.login);
  return router;
};

export default createAuthRouter;
