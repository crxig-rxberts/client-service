const express = require('express');
const clientController = require('../controller/clientController');
const { validateClient } = require('../schemas/clientSchemas');
const authFilter = require('../middleware/authFilter');

const router = express.Router();

router.post('/', validateClient, clientController.createClient);
router.get('/:userSub', authFilter, clientController.getClient);
router.put('/:userSub', authFilter, validateClient, clientController.updateClient);
router.delete('/:userSub', authFilter, clientController.deleteClient);

module.exports = router;
