import { NotFoundError, ConflictError } from '../errors/AppError.js';

export default class UserRoleService {
  constructor(userRoleRepository, userRepository, roleRepository) {
    this.userRoleRepository = userRoleRepository;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async assign(userId, roleId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with id ${userId} not found`);
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new NotFoundError(`Role with id ${roleId} not found`);
    const existing = await this.userRoleRepository.findByUserAndRole(userId, roleId);
    if (existing) throw new ConflictError('User already has this role');
    return this.userRoleRepository.create({ userId, roleId });
  }

  async revoke(id) {
    const existing = await this.userRoleRepository.findById(id);
    if (!existing) throw new NotFoundError(`UserRole with id ${id} not found`);
    await this.userRoleRepository.delete(id);
  }

  async getByUser(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with id ${userId} not found`);
    return this.userRoleRepository.findByUser(userId);
  }
}
