import errorHandler from '../../src/middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test'; // Set environment to test
  });

  it('should handle custom errors', () => {
    const err = { message: 'Custom error', statusCode: 400 };
    errorHandler(err, mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: 'Custom error',
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    });
  });

  it('should handle unexpected errors', () => {
    const err = new Error('Unexpected error');
    errorHandler(err, mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: 'An unexpected error occurred.',
      details: 'Unexpected error',
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    });
  });
});
