import bcrypt from 'bcryptjs';
import { NotFoundError, ConflictError } from '../errors/AppError.js';
import type UserRepository from '../repositories/user.repository.js';
import type { UserWithRoles } from '../repositories/user.repository.js';
import type { CreateUserDto, UpdateUserDto } from '../types/dto.js';

type SafeUser = Omit<UserWithRoles, 'password'>;

export default class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAllWithRoles();
    return users.map(this._sanitize);
  }

  async getById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findByIdWithRoles(id);
    if (!user) throw new NotFoundError(`User with id ${id} not found`);
    return this._sanitize(user);
  }

  async create(data: CreateUserDto): Promise<SafeUser> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError(`Email ${data.email} already in use`);
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({ ...data, password });
    return this._sanitize(user as UserWithRoles);
  }

  async update(id: string, data: UpdateUserDto): Promise<SafeUser> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id ${id} not found`);
    const updateData: Record<string, unknown> = { ...data };
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.update(id, updateData);
    return this._sanitize(user as UserWithRoles);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id ${id} not found`);
    await this.userRepository.delete(id);
  }

  private _sanitize(user: UserWithRoles): SafeUser {
    const { password, ...safe } = user;
    return safe;
  }
}
