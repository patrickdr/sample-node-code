import BaseRepository from './base.repository.js';

export default class UserRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma.user);
  }

  async findByEmail(email) {
    return this.model.findUnique({ where: { email } });
  }

  async findAllWithRoles() {
    return this.model.findMany({
      include: { userRoles: { include: { role: true } } },
    });
  }

  async findByIdWithRoles(id) {
    return this.model.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
  }
}
