import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.name, message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong' });
};

export default errorMiddleware;
