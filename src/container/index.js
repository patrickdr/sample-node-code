import { PrismaClient } from '@prisma/client';
import createUserComponents from '../factories/userFactory.js';
import createRoleComponents from '../factories/roleFactory.js';
import createAuthComponents from '../factories/authFactory.js';
import createUserRoleComponents from '../factories/userRoleFactory.js';
import config from '../config/env.js';

const createContainer = () => {
  const prisma = new PrismaClient();
  const user = createUserComponents(prisma);
  const role = createRoleComponents(prisma);
  const userRole = createUserRoleComponents(prisma, user.repository, role.repository);
  const auth = createAuthComponents(user.repository, config);
  return { prisma, user, role, userRole, auth };
};

export default createContainer;
