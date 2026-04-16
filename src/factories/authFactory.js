import AuthService from '../services/auth.service.js';
import AuthController from '../controllers/auth.controller.js';

const createAuthComponents = (userRepository, config) => {
  const service = new AuthService(userRepository, config);
  const controller = new AuthController(service);
  return { service, controller };
};

export default createAuthComponents;
