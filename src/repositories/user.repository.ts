import type { Prisma, User, PrismaClient } from '@prisma/client';
import BaseRepository from './base.repository.js';
import type { PrismaDelegate } from './base.repository.js';

export type UserWithRoles = Prisma.UserGetPayload<{
  include: { userRoles: { include: { role: true } } };
}>;

export default class UserRepository extends BaseRepository<User> {
  constructor(private prisma: PrismaClient) {
    super(prisma.user as unknown as PrismaDelegate<User>);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } }) as Promise<User | null>;
  }

  async findAllWithRoles(): Promise<UserWithRoles[]> {
    return this.prisma.user.findMany({
      include: { userRoles: { include: { role: true } } },
    });
  }

  async findByIdWithRoles(id: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
  }
}
