import { AppError, NotFoundError, ValidationError, UnauthorizedError, ConflictError } from '../../src/errors/AppError.js';

describe('AppError', () => {
  it('sets name to class name and statusCode', () => {
    const err = new NotFoundError('not found');
    expect(err.name).toBe('NotFoundError');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('not found');
  });

  it('NotFoundError has statusCode 404', () => {
    expect(new NotFoundError('x').statusCode).toBe(404);
  });

  it('ValidationError has statusCode 400', () => {
    expect(new ValidationError('x').statusCode).toBe(400);
  });

  it('UnauthorizedError has statusCode 401', () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
  });

  it('ConflictError has statusCode 409', () => {
    expect(new ConflictError('x').statusCode).toBe(409);
  });
});
