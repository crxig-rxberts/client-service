const clientService = require('../../../src/service/clientService');
const { documentClient } = require('../../../src/config/dynamodb');
const { NotFoundError } = require('../../../src/middleware/errors');

jest.mock('../../../src/config/dynamodb', () => ({
  documentClient: {
    put: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  TABLE_NAME: 'MockTableName'
}));

describe('Client Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const mockClient = { userSub: '123', clientName: 'Test Client' };
      documentClient.put.mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

      const result = await clientService.createClient(mockClient);

      expect(result).toEqual(mockClient);
      expect(documentClient.put).toHaveBeenCalledWith({
        TableName: expect.any(String),
        Item: mockClient
      });
    });

    it('should throw an error if creation fails', async () => {
      const mockClient = { userSub: '123', clientName: 'Test Client' };
      const mockError = new Error('Creation failed');
      documentClient.put.mockReturnValue({ promise: jest.fn().mockRejectedValue(mockError) });

      await expect(clientService.createClient(mockClient)).rejects.toThrow('Creation failed');
    });
  });

  describe('getClient', () => {
    it('should return a client by userSub', async () => {
      const mockClient = { userSub: '123', clientName: 'Test Client' };
      documentClient.get.mockReturnValue({ promise: jest.fn().mockResolvedValue({ Item: mockClient }) });

      const result = await clientService.getClient('123');

      expect(result).toEqual(mockClient);
      expect(documentClient.get).toHaveBeenCalledWith({
        TableName: expect.any(String),
        Key: { userSub: '123' }
      });
    });

    it('should throw a NotFoundError if client is not found', async () => {
      documentClient.get.mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

      await expect(clientService.getClient('123')).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if get operation fails', async () => {
      const mockError = new Error('Get operation failed');
      documentClient.get.mockReturnValue({ promise: jest.fn().mockRejectedValue(mockError) });

      await expect(clientService.getClient('123')).rejects.toThrow('Get operation failed');
    });
  });

  describe('updateClient', () => {
    it('should update an existing client', async () => {
      const mockUpdatedClient = { userSub: '123', clientName: 'Updated Client' };
      documentClient.update.mockReturnValue({ promise: jest.fn().mockResolvedValue({ Attributes: mockUpdatedClient }) });

      const result = await clientService.updateClient('123', { clientName: 'Updated Client' });

      expect(result).toEqual(mockUpdatedClient);
      expect(documentClient.update).toHaveBeenCalledWith({
        TableName: expect.any(String),
        Key: { userSub: '123' },
        UpdateExpression: 'set clientName = :cn',
        ExpressionAttributeValues: {
          ':cn': 'Updated Client'
        },
        ReturnValues: 'ALL_NEW'
      });
    });

    it('should throw a NotFoundError if client is not found during update', async () => {
      documentClient.update.mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

      await expect(clientService.updateClient('123', { clientName: 'Updated Client' })).rejects.toThrow(NotFoundError);
    });

    it('should throw a NotFoundError if ConditionalCheckFailedException occurs', async () => {
      const mockError = { name: 'ConditionalCheckFailedException' };
      documentClient.update.mockReturnValue({ promise: jest.fn().mockRejectedValue(mockError) });

      await expect(clientService.updateClient('123', { clientName: 'Updated Client' })).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if update operation fails', async () => {
      const mockError = new Error('Update operation failed');
      documentClient.update.mockReturnValue({ promise: jest.fn().mockRejectedValue(mockError) });

      await expect(clientService.updateClient('123', { clientName: 'Updated Client' })).rejects.toThrow('Update operation failed');
    });
  });

  describe('deleteClient', () => {
    it('should delete an existing client', async () => {
      const mockDeletedClient = { userSub: '123', clientName: 'Deleted Client' };
      documentClient.delete.mockReturnValue({ promise: jest.fn().mockResolvedValue({ Attributes: mockDeletedClient }) });

      await clientService.deleteClient('123');

      expect(documentClient.delete).toHaveBeenCalledWith({
        TableName: expect.any(String),
        Key: { userSub: '123' },
        ReturnValues: 'ALL_OLD'
      });
    });

    it('should throw a NotFoundError if client is not found during delete', async () => {
      documentClient.delete.mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

      await expect(clientService.deleteClient('123')).rejects.toThrow(NotFoundError);
    });

    it('should throw a NotFoundError if ConditionalCheckFailedException occurs', async () => {
      const mockError = { name: 'ConditionalCheckFailedException' };
      documentClient.delete.mockReturnValue({ promise: jest.fn().mockRejectedValue(mockError) });

      await expect(clientService.deleteClient('123')).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if delete operation fails', async () => {
      const mockError = new Error('Delete operation failed');
      documentClient.delete.mockReturnValue({ promise: jest.fn().mockRejectedValue(mockError) });

      await expect(clientService.deleteClient('123')).rejects.toThrow('Delete operation failed');
    });
  });
});
