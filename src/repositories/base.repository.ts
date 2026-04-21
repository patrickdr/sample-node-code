export interface PrismaDelegate<T> {
  findMany(args?: Record<string, unknown>): Promise<T[]>;
  findUnique(args: Record<string, unknown>): Promise<T | null>;
  create(args: { data: Record<string, unknown> }): Promise<T>;
  update(args: { where: Record<string, unknown>; data: Record<string, unknown> }): Promise<T>;
  delete(args: { where: Record<string, unknown> }): Promise<T>;
}

export default class BaseRepository<T> {
  constructor(protected model: PrismaDelegate<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: Record<string, unknown>): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: Record<string, unknown>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
