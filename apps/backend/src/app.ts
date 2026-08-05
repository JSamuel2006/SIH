import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { loggingMiddleware } from './middleware/loggingMiddleware.js';

export function createApp(): Express {
  const app = express();

  // Security & Core Middlewares
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request Logging
  app.use(loggingMiddleware);

  // Health Check Endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      platform: 'ArogyaVerse AI Backend API',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // API Routes
  app.use('/api/v1', router);

  // Global Error Handler Middleware
  app.use(errorHandler);

  return app;
}
