import bcrypt from 'bcryptjs';
import { NotFoundError, ConflictError } from '../errors/AppError.js';

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAll() {
    const users = await this.userRepository.findAllWithRoles();
    return users.map(this._sanitize);
  }

  async getById(id) {
    const user = await this.userRepository.findByIdWithRoles(id);
    if (!user) throw new NotFoundError(`User with id ${id} not found`);
    return this._sanitize(user);
  }

  async create(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError(`Email ${data.email} already in use`);
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({ ...data, password });
    return this._sanitize(user);
  }

  async update(id, data) {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id ${id} not found`);
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.update(id, data);
    return this._sanitize(user);
  }

  async delete(id) {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id ${id} not found`);
    await this.userRepository.delete(id);
  }

  _sanitize(user) {
    const { password, ...safe } = user;
    return safe;
  }
}
