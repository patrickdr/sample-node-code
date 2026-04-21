import type { Role } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/AppError.js';
import type RoleRepository from '../repositories/role.repository.js';
import type { CreateRoleDto, UpdateRoleDto } from '../types/dto.js';

export default class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundError(`Role with id ${id} not found`);
    return role;
  }

  async create(data: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findByName(data.name);
    if (existing) throw new ConflictError(`Role "${data.name}" already exists`);
    return this.roleRepository.create(data as unknown as Record<string, unknown>);
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findById(id);
    if (!existing) throw new NotFoundError(`Role with id ${id} not found`);
    return this.roleRepository.update(id, data as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.roleRepository.findById(id);
    if (!existing) throw new NotFoundError(`Role with id ${id} not found`);
    await this.roleRepository.delete(id);
  }
}
