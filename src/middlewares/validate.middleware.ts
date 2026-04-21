import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { ValidationError } from '../errors/AppError.js';

const validate = (schema: ZodTypeAny): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join('.') || 'body'}: ${e.message}`)
      .join(', ');
    next(new ValidationError(message));
    return;
  }
  req.body = result.data;
  next();
};

export default validate;
