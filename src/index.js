const express = require('express');
const { logger } = require('./utils/logger');
const userRoutes = require('./controllers/userController');
const errorHandler = require('./middleware/errorHandler');
const { pool } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.getConnection();
    logger.info('Connected to the database successfully.');
    app.use(express.json());
    app.use('/api/users', userRoutes);
    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error.message);
    process.exit(1);
  }
})();

module.exports = app;