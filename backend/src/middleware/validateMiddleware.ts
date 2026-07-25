import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '@/utils/responseUtils';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * validate
 * Zod middleware factory — validates req[target] against schema.
 * Returns 400 with ZodIssue[] on failure.
 *
 * @example
 * router.post('/register', validate(registerSchema), authController.register)
 */
export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      errorResponse(res, 'Validation error', 400, zodError.issues);
      return;
    }

    // Replace with parsed/coerced values (compatible with Express 5 getters)
    try {
      (req as unknown as Record<string, unknown>)[target] = result.data;
    } catch {
      Object.defineProperty(req, target, {
        value: result.data,
        writable: true,
        configurable: true,
      });
    }
    next();
  };
}
