import express from 'express';
import createAuthRouter from './auth.routes.js';
import createUserRouter from './user.routes.js';
import createRoleRouter from './role.routes.js';
import createUserRoleRouter from './userRole.routes.js';
import createAuthMiddleware from '../middlewares/auth.middleware.js';

const createRouter = (container) => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container.auth.service);
  router.use('/auth', createAuthRouter(container.auth.controller));
  router.use('/users', createUserRouter(container.user.controller, authMiddleware));
  router.use('/roles', createRoleRouter(container.role.controller, authMiddleware));
  router.use('/user-roles', createUserRoleRouter(container.userRole.controller, authMiddleware));
  return router;
};

export default createRouter;
