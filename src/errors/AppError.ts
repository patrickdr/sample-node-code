export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) { super(message, 404); }
}

export class ValidationError extends AppError {
  constructor(message: string) { super(message, 400); }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}

export class ConflictError extends AppError {
  constructor(message: string) { super(message, 409); }
}
