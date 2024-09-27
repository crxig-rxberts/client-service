const clientService = require('../service/clientService');
const { NotFoundError, ValidationError } = require('../middleware/errors');

class ClientController {
  async createClient(req, res, next) {
    try {
      const clientData = req.body;
      if (!clientData.clientName || !clientData.userSub) {
        throw new ValidationError('Client name and userSub are required');
      }
      const result = await clientService.createClient(clientData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  async getClient(req, res, next) {
    try {
      const { userSub } = req.params;
      const result = await clientService.getClient(userSub);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  async updateClient(req, res, next) {
    try {
      const { userSub } = req.params;
      const clientData = req.body;
      if (!clientData.clientName) {
        throw new ValidationError('Client name is required');
      }
      const result = await clientService.updateClient(userSub, clientData);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ success: false, message: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  async deleteClient(req, res, next) {
    try {
      const { userSub } = req.params;
      await clientService.deleteClient(userSub);
      res.json({ success: true, data: { id: userSub } });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = new ClientController();
