import type { Role, PrismaClient } from '@prisma/client';
import BaseRepository from './base.repository.js';
import type { PrismaDelegate } from './base.repository.js';

export default class RoleRepository extends BaseRepository<Role> {
  constructor(prisma: PrismaClient) {
    super(prisma.role as unknown as PrismaDelegate<Role>);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.model.findUnique({ where: { name } }) as Promise<Role | null>;
  }
}
