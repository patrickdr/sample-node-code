import AuthService from '../services/auth.service.js';
import AuthController from '../controllers/auth.controller.js';
import type UserRepository from '../repositories/user.repository.js';
import type { Config } from '../config/env.js';

export interface AuthComponents {
  service: AuthService;
  controller: AuthController;
}

const createAuthComponents = (userRepository: UserRepository, config: Config): AuthComponents => {
  const service = new AuthService(userRepository, config);
  const controller = new AuthController(service);
  return { service, controller };
};

export default createAuthComponents;
