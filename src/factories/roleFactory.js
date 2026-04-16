import RoleRepository from '../repositories/role.repository.js';
import RoleService from '../services/role.service.js';
import RoleController from '../controllers/role.controller.js';

const createRoleComponents = (prisma) => {
  const repository = new RoleRepository(prisma);
  const service = new RoleService(repository);
  const controller = new RoleController(service);
  return { repository, service, controller };
};

export default createRoleComponents;
