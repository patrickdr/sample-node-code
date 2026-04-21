import { jest } from '@jest/globals';
import BaseRepository from '../../src/repositories/base.repository.js';

type MockRecord = { id: string };

const makeMockModel = () => ({
  findMany: jest.fn().mockResolvedValue([{ id: '1' }]),
  findUnique: jest.fn().mockResolvedValue({ id: '1' }),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue({ id: '1' }),
});

describe('BaseRepository', () => {
  it('findAll calls model.findMany', async () => {
    const model = makeMockModel();
    const repo = new BaseRepository<MockRecord>(model);
    const result = await repo.findAll();
    expect(model.findMany).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1' }]);
  });

  it('findById calls model.findUnique with where id', async () => {
    const model = makeMockModel();
    const repo = new BaseRepository<MockRecord>(model);
    await repo.findById('abc');
    expect(model.findUnique).toHaveBeenCalledWith({ where: { id: 'abc' } });
  });

  it('create calls model.create with data', async () => {
    const model = makeMockModel();
    const repo = new BaseRepository<MockRecord>(model);
    await repo.create({ name: 'test' });
    expect(model.create).toHaveBeenCalledWith({ data: { name: 'test' } });
  });

  it('update calls model.update with where id and data', async () => {
    const model = makeMockModel();
    const repo = new BaseRepository<MockRecord>(model);
    await repo.update('abc', { name: 'updated' });
    expect(model.update).toHaveBeenCalledWith({ where: { id: 'abc' }, data: { name: 'updated' } });
  });

  it('delete calls model.delete with where id', async () => {
    const model = makeMockModel();
    const repo = new BaseRepository<MockRecord>(model);
    await repo.delete('abc');
    expect(model.delete).toHaveBeenCalledWith({ where: { id: 'abc' } });
  });
});
