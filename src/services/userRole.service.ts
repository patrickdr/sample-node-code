import type { UserRole } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/AppError.js';
import type UserRoleRepository from '../repositories/userRole.repository.js';
import type { UserRoleWithRole } from '../repositories/userRole.repository.js';
import type UserRepository from '../repositories/user.repository.js';
import type RoleRepository from '../repositories/role.repository.js';

export default class UserRoleService {
  constructor(
    private userRoleRepository: UserRoleRepository,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async assign(userId: string, roleId: string): Promise<UserRole> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with id ${userId} not found`);
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new NotFoundError(`Role with id ${roleId} not found`);
    const existing = await this.userRoleRepository.findByUserAndRole(userId, roleId);
    if (existing) throw new ConflictError('User already has this role');
    return this.userRoleRepository.create({ userId, roleId });
  }

  async revoke(id: string): Promise<void> {
    const existing = await this.userRoleRepository.findById(id);
    if (!existing) throw new NotFoundError(`UserRole with id ${id} not found`);
    await this.userRoleRepository.delete(id);
  }

  async getByUser(userId: string): Promise<UserRoleWithRole[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with id ${userId} not found`);
    return this.userRoleRepository.findByUser(userId);
  }
}
