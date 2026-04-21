import type { Prisma, UserRole, PrismaClient } from '@prisma/client';
import BaseRepository from './base.repository.js';
import type { PrismaDelegate } from './base.repository.js';

export type UserRoleWithRole = Prisma.UserRoleGetPayload<{
  include: { role: true };
}>;

export default class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(private prisma: PrismaClient) {
    super(prisma.userRole as unknown as PrismaDelegate<UserRole>);
  }

  async findByUserAndRole(userId: string, roleId: string): Promise<UserRole | null> {
    return this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
  }

  async findByUser(userId: string): Promise<UserRoleWithRole[]> {
    return this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }
}
