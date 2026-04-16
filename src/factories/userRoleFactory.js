import UserRoleRepository from '../repositories/userRole.repository.js';
import UserRoleService from '../services/userRole.service.js';
import UserRoleController from '../controllers/userRole.controller.js';

const createUserRoleComponents = (prisma, userRepository, roleRepository) => {
  const repository = new UserRoleRepository(prisma);
  const service = new UserRoleService(repository, userRepository, roleRepository);
  const controller = new UserRoleController(service);
  return { repository, service, controller };
};

export default createUserRoleComponents;
