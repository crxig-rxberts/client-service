const errorHandler = require('../../../../client-service/src/middleware/errorHandler');
const { NotFoundError, ValidationError, UnauthorizedError } = require('../../../../client-service/src/middleware/errors');
const logger = require('../../../src/utils/logger');
const { formatResponse } = require('../../../src/utils/formatResponse');

jest.mock('../../../src/utils/logger');
jest.mock('../../../src/utils/formatResponse');

describe('errorHandler', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    formatResponse.mockImplementation((message, data, success) => ({ message, data, success }));
  });

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('Resource not found');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(formatResponse).toHaveBeenCalledWith('Resource not found', null, false);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Resource not found',
      data: null,
      success: false
    });
  });

  it('should handle ValidationError', () => {
    const error = new ValidationError('Invalid input');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(formatResponse).toHaveBeenCalledWith('Invalid input', null, false);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid input',
      data: null,
      success: false
    });
  });

  it('should handle UnauthorizedError', () => {
    const error = new UnauthorizedError('Unauthorized access');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(formatResponse).toHaveBeenCalledWith('Unauthorized access', null, false);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized access',
      data: null,
      success: false
    });
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith('Error caught by middleware', { error });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(formatResponse).toHaveBeenCalledWith('Internal server error', null, false);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      data: null,
      success: false
    });
  });
});
