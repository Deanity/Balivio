import type { Request, Response, NextFunction } from 'express';
import { env } from '@/config/env';

/**
 * Global error handler — must be the last middleware registered in app.ts.
 * Catches all errors thrown in route handlers.
 */
export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isDev = env.NODE_ENV === 'development';

  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof Error) {
    message = isDev ? err.message : 'Internal server error';

    // Known status codes from custom errors
    if ('statusCode' in err && typeof err.statusCode === 'number') {
      statusCode = err.statusCode;
      message = err.message; // OK to expose app-level errors
    }
  }

  // Never log in test env
  if (env.NODE_ENV !== 'test') {
    console.error(`[${req.method}] ${req.path} →`, err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors: isDev && err instanceof Error ? [err.stack] : null,
  });
}
