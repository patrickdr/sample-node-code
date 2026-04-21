import type { PrismaClient } from '@prisma/client';
import RoleRepository from '../repositories/role.repository.js';
import RoleService from '../services/role.service.js';
import RoleController from '../controllers/role.controller.js';

export interface RoleComponents {
  repository: RoleRepository;
  service: RoleService;
  controller: RoleController;
}

const createRoleComponents = (prisma: PrismaClient): RoleComponents => {
  const repository = new RoleRepository(prisma);
  const service = new RoleService(repository);
  const controller = new RoleController(service);
  return { repository, service, controller };
};

export default createRoleComponents;
