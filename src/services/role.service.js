import { NotFoundError, ConflictError } from '../errors/AppError.js';

export default class RoleService {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async getAll() {
    return this.roleRepository.findAll();
  }

  async getById(id) {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundError(`Role with id ${id} not found`);
    return role;
  }

  async create(data) {
    const existing = await this.roleRepository.findByName(data.name);
    if (existing) throw new ConflictError(`Role "${data.name}" already exists`);
    return this.roleRepository.create(data);
  }

  async update(id, data) {
    const existing = await this.roleRepository.findById(id);
    if (!existing) throw new NotFoundError(`Role with id ${id} not found`);
    return this.roleRepository.update(id, data);
  }

  async delete(id) {
    const existing = await this.roleRepository.findById(id);
    if (!existing) throw new NotFoundError(`Role with id ${id} not found`);
    await this.roleRepository.delete(id);
  }
}
