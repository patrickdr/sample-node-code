import { jest } from '@jest/globals';
import UserService from '../../src/services/user.service.js';
import { NotFoundError, ConflictError } from '../../src/errors/AppError.js';
import type UserRepository from '../../src/repositories/user.repository.js';

const makeRepo = (overrides: Partial<Record<keyof UserRepository, jest.Mock>> = {}) =>
  ({
    findAll: jest.fn().mockResolvedValue([]),
    findAllWithRoles: jest.fn().mockResolvedValue([]),
    findByIdWithRoles: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
    ...overrides,
  }) as unknown as UserRepository;

describe('UserService', () => {
  describe('create', () => {
    it('throws ConflictError when email already in use', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue({ id: '1', email: 'a@b.com' }) });
      const service = new UserService(repo);
      await expect(service.create({ name: 'A', email: 'a@b.com', password: 'pass' }))
        .rejects.toThrow(ConflictError);
    });

    it('hashes the password before saving', async () => {
      const repo = makeRepo({
        create: jest.fn().mockImplementation((data: Record<string, unknown>) =>
          Promise.resolve({ id: '1', ...data, userRoles: [] }),
        ),
      });
      const service = new UserService(repo);
      await service.create({ name: 'A', email: 'a@b.com', password: 'plaintext' });
      const saved = (repo.create as jest.Mock).mock.calls[0][0] as Record<string, unknown>;
      expect(saved.password).not.toBe('plaintext');
      expect((saved.password as string).length).toBeGreaterThan(20);
    });

    it('returns user without password field', async () => {
      const repo = makeRepo({
        create: jest.fn().mockResolvedValue({
          id: '1', name: 'A', email: 'a@b.com', password: 'hashed', userRoles: [],
        }),
      });
      const service = new UserService(repo);
      const result = await service.create({ name: 'A', email: 'a@b.com', password: 'pass' });
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('1');
    });
  });

  describe('getById', () => {
    it('throws NotFoundError when user does not exist', async () => {
      const service = new UserService(makeRepo());
      await expect(service.getById('missing')).rejects.toThrow(NotFoundError);
    });

    it('returns user without password', async () => {
      const repo = makeRepo({
        findByIdWithRoles: jest.fn().mockResolvedValue({
          id: '1', name: 'A', email: 'a@b.com', password: 'hashed', userRoles: [],
        }),
      });
      const service = new UserService(repo);
      const result = await service.getById('1');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('update', () => {
    it('throws NotFoundError when user does not exist', async () => {
      const service = new UserService(makeRepo());
      await expect(service.update('missing', { name: 'B' })).rejects.toThrow(NotFoundError);
    });

    it('hashes password if provided in update', async () => {
      const repo = makeRepo({
        findById: jest.fn().mockResolvedValue({ id: '1' }),
        update: jest.fn().mockImplementation((id: string, data: Record<string, unknown>) =>
          Promise.resolve({ id, ...data, userRoles: [] }),
        ),
      });
      const service = new UserService(repo);
      await service.update('1', { password: 'newpass' });
      const updatedWith = (repo.update as jest.Mock).mock.calls[0][1] as Record<string, unknown>;
      expect(updatedWith.password).not.toBe('newpass');
    });
  });

  describe('delete', () => {
    it('throws NotFoundError when user does not exist', async () => {
      const service = new UserService(makeRepo());
      await expect(service.delete('missing')).rejects.toThrow(NotFoundError);
    });

    it('calls repository delete when user exists', async () => {
      const repo = makeRepo({
        findById: jest.fn().mockResolvedValue({ id: '1' }),
        delete: jest.fn().mockResolvedValue(undefined),
      });
      const service = new UserService(repo);
      await service.delete('1');
      expect(repo.delete as jest.Mock).toHaveBeenCalledWith('1');
    });
  });
});
