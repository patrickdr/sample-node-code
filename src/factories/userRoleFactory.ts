import type { PrismaClient } from '@prisma/client';
import UserRoleRepository from '../repositories/userRole.repository.js';
import UserRoleService from '../services/userRole.service.js';
import UserRoleController from '../controllers/userRole.controller.js';
import type UserRepository from '../repositories/user.repository.js';
import type RoleRepository from '../repositories/role.repository.js';

export interface UserRoleComponents {
  repository: UserRoleRepository;
  service: UserRoleService;
  controller: UserRoleController;
}

const createUserRoleComponents = (
  prisma: PrismaClient,
  userRepository: UserRepository,
  roleRepository: RoleRepository,
): UserRoleComponents => {
  const repository = new UserRoleRepository(prisma);
  const service = new UserRoleService(repository, userRepository, roleRepository);
  const controller = new UserRoleController(service);
  return { repository, service, controller };
};

export default createUserRoleComponents;
