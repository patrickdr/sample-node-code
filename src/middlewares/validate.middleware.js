import { ValidationError } from '../errors/AppError.js';

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join('.') || 'body'}: ${e.message}`)
      .join(', ');
    return next(new ValidationError(message));
  }
  req.body = result.data;
  next();
};

export default validate;
