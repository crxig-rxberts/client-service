const request = require('supertest');
const app = require('../../src/app');
const { documentClient } = require('../../src/config/dynamodb');
const { NotFoundError } = require('../../src/middleware/errors');
const authFilter = require('../../src/middleware/authFilter');

jest.mock('../../src/config/dynamodb');
jest.mock('../../src/utils/logger');
jest.mock('../../src/middleware/authFilter');

describe('Client API Integration Tests', () => {
  const mockClient = {
    userSub: 'test-user-sub',
    clientName: 'Test Client'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authFilter.mockImplementation((req, res, next) => next());
  });

  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      documentClient.put.mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
      });

      const response = await request(app)
        .post('/api/clients')
        .send(mockClient)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(mockClient);
    });

    it('should return 400 for invalid input', async () => {
      const invalidClient = { clientName: 'Invalid Client' }; // Missing userSub

      const response = await request(app)
        .post('/api/clients')
        .send(invalidClient)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('"userSub" is required');
    });
  });

  describe('GET /api/clients/:userSub', () => {
    it('should return a client by userSub', async () => {
      documentClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockClient })
      });

      const response = await request(app)
        .get(`/api/clients/${mockClient.userSub}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockClient);
    });

    it('should return 404 for non-existent client', async () => {
      documentClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
      });

      const response = await request(app)
        .get('/api/clients/non-existent-sub')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Client not found');
    });
  });

  describe('PUT /api/clients/:userSub', () => {
    it('should update an existing client', async () => {
      const updatedClient = { ...mockClient, clientName: 'Updated Client' };
      documentClient.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Attributes: updatedClient })
      });

      const response = await request(app)
        .put(`/api/clients/${mockClient.userSub}`)
        .send(updatedClient)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedClient);
    });

    it('should return 400 for invalid input', async () => {
      const invalidUpdate = { clientName: '', userSub: mockClient.userSub }; // Empty name

      const response = await request(app)
        .put(`/api/clients/${mockClient.userSub}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('"clientName" is not allowed to be empty');
    });

    it('should return 404 for non-existent client', async () => {
      documentClient.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new NotFoundError('Client not found'))
      });

      const response = await request(app)
        .put('/api/clients/non-existent-sub')
        .send({ clientName: 'Non-existent Client', userSub: mockClient.userSub })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Client not found');
    });
  });

  describe('DELETE /api/clients/:userSub', () => {
    it('should delete an existing client', async () => {
      documentClient.delete.mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Attributes: mockClient
        })
      });

      const response = await request(app)
        .delete(`/api/clients/${mockClient.userSub}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({ id: mockClient.userSub });
    });

    it('should return 404 for non-existent client', async () => {
      documentClient.delete.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new NotFoundError('Client not found'))
      });

      const response = await request(app)
        .delete('/api/clients/non-existent-sub')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Client not found');
    });
  });
});
