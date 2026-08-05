import { Request, Response, NextFunction } from 'express';
import { logger } from '../logging/logger.js';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });
  next();
}
