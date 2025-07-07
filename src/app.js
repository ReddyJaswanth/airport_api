const express = require('express');
const AppDataSource = require('./data-source');
const airportRouter = require('./routes/airport');
const winston = require('winston');
const importCSV = require('./import-csv');
require('reflect-metadata');

const app = express();
const PORT = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, body: req.body });
  next();
});

// Mount routes
app.use('/api/airport', airportRouter);

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server after DB init and CSV import
AppDataSource.initialize()
  .then(async () => {
    await importCSV();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to initialize database', err);
    process.exit(1);
  });
