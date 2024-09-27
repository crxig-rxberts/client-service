const request = require('supertest');
const express = require('express');
const app = require('../../src/app');
const errorHandler = require('../../src/middleware/errorHandler');
const { initializeDynamoDB } = require('../../src/config/dynamodb');

jest.mock('../../src/config/dynamodb', () => ({
  initializeDynamoDB: jest.fn()
}));

describe('Server', () => {
  let server;

  beforeAll(async () => {
    await initializeDynamoDB();

    // Create a new express app for testing
    server = express();

    // Add the test error route before other middlewares
    server.use('/test-error', () => {
      throw new Error('Test error');
    });

    // Use the main app as middleware
    server.use(app);

    // Add the error handler after the main app
    server.use(errorHandler);
  });

  it('should respond with 404 for unknown routes', async () => {
    const response = await request(server).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Not found' });
  });

  it('should handle errors and return 500', async () => {
    const response = await request(server).get('/test-error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, message: 'Internal server error', data: null });
  });
});
