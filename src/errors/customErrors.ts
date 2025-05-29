export class CustomError extends Error {
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized Access") {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends CustomError {
  constructor(message = "Conflict: Resource already exists") {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}