class BaseException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends BaseException {
  constructor(message) {
    super(message, 404);
    this.name = this.constructor.name;
  }
}

class ValidationError extends BaseException {
  constructor(message) {
    super(message, 400);
    this.name = this.constructor.name;
  }
}

class UnauthorizedError extends BaseException {
  constructor(message) {
    super(message, 401);
    this.name = this.constructor.name;
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError
};
