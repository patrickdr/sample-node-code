import express, { type Router, type RequestHandler } from 'express';
import { z } from 'zod';
import validate from '../middlewares/validate.middleware.js';
import type RoleController from '../controllers/role.controller.js';

const roleSchema = z.object({ name: z.string().min(1) });
const updateRoleSchema = roleSchema.partial();

const createRoleRouter = (controller: RoleController, authMiddleware: RequestHandler): Router => {
  const router = express.Router();
  router.get('/', authMiddleware, controller.getAll);
  router.post('/', authMiddleware, validate(roleSchema), controller.create);
  router.get('/:id', authMiddleware, controller.getById);
  router.put('/:id', authMiddleware, validate(updateRoleSchema), controller.update);
  router.delete('/:id', authMiddleware, controller.delete);
  return router;
};

export default createRoleRouter;
