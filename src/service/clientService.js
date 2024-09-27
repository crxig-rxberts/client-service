const { documentClient, TABLE_NAME } = require('../config/dynamodb');
const logger = require('../utils/logger');
const { NotFoundError } = require('../middleware/errors');

class ClientService {
  async createClient(clientData) {
    const params = {
      TableName: TABLE_NAME,
      Item: clientData
    };

    try {
      await documentClient.put(params).promise();
      return clientData;
    } catch (error) {
      logger.error('Error creating client', { error });
      throw error;
    }
  }

  async getClient(userSub) {
    const params = {
      TableName: TABLE_NAME,
      Key: { userSub }
    };

    try {
      const result = await documentClient.get(params).promise();
      if (!result.Item) {
        throw new NotFoundError('Client not found');
      }
      return result.Item;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Error getting client', { error, userSub });
      throw error;
    }
  }

  async updateClient(userSub, clientData) {
    const params = {
      TableName: TABLE_NAME,
      Key: { userSub },
      UpdateExpression: 'set clientName = :cn',
      ExpressionAttributeValues: {
        ':cn': clientData.clientName
      },
      ReturnValues: 'ALL_NEW'
    };

    try {
      const result = await documentClient.update(params).promise();
      if (!result.Attributes) {
        throw new NotFoundError('Client not found');
      }
      return result.Attributes;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new NotFoundError('Client not found');
      }
      logger.error('Error updating client', { error, userSub });
      throw error;
    }
  }

  async deleteClient(userSub) {
    const params = {
      TableName: TABLE_NAME,
      Key: { userSub },
      ReturnValues: 'ALL_OLD'
    };

    try {
      const result = await documentClient.delete(params).promise();
      if (!result.Attributes) {
        throw new NotFoundError('Client not found');
      }
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new NotFoundError('Client not found');
      }
      logger.error('Error deleting client', { error, userSub });
      throw error;
    }
  }
}

module.exports = new ClientService();
