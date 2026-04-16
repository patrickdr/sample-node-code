import BaseRepository from './base.repository.js';

export default class UserRoleRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma.userRole);
  }

  async findByUserAndRole(userId, roleId) {
    return this.model.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
  }

  async findByUser(userId) {
    return this.model.findMany({
      where: { userId },
      include: { role: true },
    });
  }
}
