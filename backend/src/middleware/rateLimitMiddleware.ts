import rateLimit from 'express-rate-limit';
import { errorResponse } from '@/utils/responseUtils';
import { env } from '@/config/env';
import type { Request, Response } from 'express';

const isDev = env.NODE_ENV !== 'production';

/**
 * Rate limiter for login endpoint: 10 requests per 15 minutes per IP (1000 in dev)
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    errorResponse(
      res,
      'Too many login attempts. Please try again after 15 minutes.',
      429
    );
  },
});

/**
 * Rate limiter for register endpoint: 5 requests per hour per IP (1000 in dev)
 */
export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 1000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    errorResponse(
      res,
      'Too many registration attempts. Please try again after an hour.',
      429
    );
  },
});
