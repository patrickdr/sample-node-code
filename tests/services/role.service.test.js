import { jest } from '@jest/globals';
import RoleService from '../../src/services/role.service.js';
import { NotFoundError, ConflictError } from '../../src/errors/AppError.js';

const makeRepo = (overrides = {}) => ({
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByName: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: '1', name: 'admin' }),
  update: jest.fn().mockResolvedValue({ id: '1', name: 'updated' }),
  delete: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('RoleService', () => {
  describe('create', () => {
    it('throws ConflictError when role name already exists', async () => {
      const repo = makeRepo({ findByName: jest.fn().mockResolvedValue({ id: '1', name: 'admin' }) });
      const service = new RoleService(repo);
      await expect(service.create({ name: 'admin' })).rejects.toThrow(ConflictError);
    });

    it('creates and returns role when name is unique', async () => {
      const service = new RoleService(makeRepo());
      const result = await service.create({ name: 'admin' });
      expect(result).toEqual({ id: '1', name: 'admin' });
    });
  });

  describe('getById', () => {
    it('throws NotFoundError when role does not exist', async () => {
      const service = new RoleService(makeRepo());
      await expect(service.getById('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('throws NotFoundError when role does not exist', async () => {
      const service = new RoleService(makeRepo());
      await expect(service.delete('missing')).rejects.toThrow(NotFoundError);
    });
  });
});
