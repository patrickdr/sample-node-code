import express, { type Router } from 'express';
import createAuthRouter from './auth.routes.js';
import createUserRouter from './user.routes.js';
import createRoleRouter from './role.routes.js';
import createUserRoleRouter from './userRole.routes.js';
import createAuthMiddleware from '../middlewares/auth.middleware.js';
import type { Container } from '../container/index.js';

const createRouter = (container: Container): Router => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container.auth.service);
  router.use('/auth', createAuthRouter(container.auth.controller));
  router.use('/users', createUserRouter(container.user.controller, authMiddleware));
  router.use('/roles', createRoleRouter(container.role.controller, authMiddleware));
  router.use('/user-roles', createUserRoleRouter(container.userRole.controller, authMiddleware));
  return router;
};

export default createRouter;
