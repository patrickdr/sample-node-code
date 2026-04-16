import BaseRepository from './base.repository.js';

export default class RoleRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma.role);
  }

  async findByName(name) {
    return this.model.findUnique({ where: { name } });
  }
}
