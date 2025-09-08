import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const { method, originalUrl, body, params, query } = req;
    const { statusCode } = res;
    let logLevel = 'info';

    if (statusCode >= 500) {
      logLevel = 'error';
    } else if (statusCode >= 400) {
      logLevel = 'warn';
    } else if (statusCode >= 100) {
      logLevel = 'http';
    }

    const logMessage = `${method} ${originalUrl}`;
    const logData = {
      body,
      params,
      query,
      statusCode,
    };

    // Log with meta data for file logging
    logger.log(logLevel, logMessage, logData);
  });

  next();
};
