import UserRepository from '../repositories/user.repository.js';
import UserService from '../services/user.service.js';
import UserController from '../controllers/user.controller.js';

const createUserComponents = (prisma) => {
  const repository = new UserRepository(prisma);
  const service = new UserService(repository);
  const controller = new UserController(service);
  return { repository, service, controller };
};

export default createUserComponents;
