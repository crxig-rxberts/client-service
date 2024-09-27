const clientController = require('../../../src/controller/clientController');
const clientService = require('../../../src/service/clientService');

jest.mock('../../../src/service/clientService');

describe('Client Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      const clientData = { userSub: 'user123', clientName: 'Test Client' };
      const createdClient = { ...clientData, id: '1' };
      req.body = clientData;
      clientService.createClient.mockResolvedValue(createdClient);

      await clientController.createClient(req, res, next);

      expect(clientService.createClient).toHaveBeenCalledWith(clientData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: createdClient });
    });

    it('should handle errors when creating a client', async () => {
      const error = new Error('Database error');
      req.body = { userSub: 'user123', clientName: 'Test Client' };
      clientService.createClient.mockRejectedValue(error);

      await clientController.createClient(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getClient', () => {
    it('should return a client successfully', async () => {
      const userSub = 'user123';
      const client = { userSub, clientName: 'Test Client', id: '1' };
      req.params = { userSub };
      clientService.getClient.mockResolvedValue(client);

      await clientController.getClient(req, res, next);

      expect(clientService.getClient).toHaveBeenCalledWith(userSub);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: client });
    });

    it('should handle errors when getting a client', async () => {
      const error = new Error('Client not found');
      req.params = { userSub: 'nonexistent' };
      clientService.getClient.mockRejectedValue(error);

      await clientController.getClient(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateClient', () => {
    it('should update a client successfully', async () => {
      const userSub = 'user123';
      const updateData = { clientName: 'Updated Client' };
      const updatedClient = { userSub, ...updateData, id: '1' };
      req.params = { userSub };
      req.body = updateData;
      clientService.updateClient.mockResolvedValue(updatedClient);

      await clientController.updateClient(req, res, next);

      expect(clientService.updateClient).toHaveBeenCalledWith(userSub, updateData);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedClient });
    });

    it('should handle errors when updating a client', async () => {
      const error = new Error('Client not found');
      req.params = { userSub: 'nonexistent' };
      req.body = { clientName: 'Updated Client' };
      clientService.updateClient.mockRejectedValue(error);

      await clientController.updateClient(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client successfully', async () => {
      const userSub = 'user123';
      req.params = { userSub };
      clientService.deleteClient.mockResolvedValue();

      await clientController.deleteClient(req, res, next);

      expect(clientService.deleteClient).toHaveBeenCalledWith(userSub);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: userSub }
      });
    });

    it('should handle errors when deleting a client', async () => {
      const error = new Error('Client not found');
      req.params = { userSub: 'nonexistent' };
      clientService.deleteClient.mockRejectedValue(error);

      await clientController.deleteClient(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
