const logger = require('../utils/logger');
const { NotFoundError, ValidationError, UnauthorizedError } = require('./errors');
const { formatResponse } = require('../utils/formatResponse');

function errorHandler(err, req, res, next) {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json(formatResponse(err.message, null, false));
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(formatResponse(err.message, null, false));
  }

  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json(formatResponse(err.message, null, false));
  }

  logger.error('Error caught by middleware', { error: err });

  res.status(500).json(formatResponse('Internal server error', null, false));
}

module.exports = errorHandler;
