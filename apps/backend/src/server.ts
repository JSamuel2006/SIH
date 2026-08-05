import { createApp } from './app.js';
import { logger } from './logging/logger.js';
import { env } from './configuration/environment.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 ArogyaVerse AI Backend Microservice running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🏥 Health check endpoint active at http://localhost:${env.PORT}/health`);
});

// Graceful Shutdown Handling
process.on('SIGTERM', () => {
  logger.warn('SIGTERM signal received. Closing HTTP server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed. Process exiting.');
    process.exit(0);
  });
});
