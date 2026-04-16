import express from 'express';
import { z } from 'zod';
import validate from '../middlewares/validate.middleware.js';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const updateUserSchema = createUserSchema.partial();

const createUserRouter = (controller, authMiddleware) => {
  const router = express.Router();
  router.get('/', authMiddleware, controller.getAll);
  router.post('/', validate(createUserSchema), controller.create);
  router.get('/:id', authMiddleware, controller.getById);
  router.put('/:id', authMiddleware, validate(updateUserSchema), controller.update);
  router.delete('/:id', authMiddleware, controller.delete);
  return router;
};

export default createUserRouter;
