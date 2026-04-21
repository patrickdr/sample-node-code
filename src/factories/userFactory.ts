import type { PrismaClient } from '@prisma/client';
import UserRepository from '../repositories/user.repository.js';
import UserService from '../services/user.service.js';
import UserController from '../controllers/user.controller.js';

export interface UserComponents {
  repository: UserRepository;
  service: UserService;
  controller: UserController;
}

const createUserComponents = (prisma: PrismaClient): UserComponents => {
  const repository = new UserRepository(prisma);
  const service = new UserService(repository);
  const controller = new UserController(service);
  return { repository, service, controller };
};

export default createUserComponents;
