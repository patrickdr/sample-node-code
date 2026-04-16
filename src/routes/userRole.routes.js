import express from 'express';
import { z } from 'zod';
import validate from '../middlewares/validate.middleware.js';

const assignSchema = z.object({
  userId: z.string().min(1),
  roleId: z.string().min(1),
});

const createUserRoleRouter = (controller, authMiddleware) => {
  const router = express.Router();
  router.post('/', authMiddleware, validate(assignSchema), controller.assign);
  router.delete('/:id', authMiddleware, controller.revoke);
  router.get('/user/:userId', authMiddleware, controller.getByUser);
  return router;
};

export default createUserRoleRouter;
