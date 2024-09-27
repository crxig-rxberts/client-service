const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/clients', clientRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
