import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseUtils';

/**
 * roleGuard
 * Checks if req.user.role is in the allowed roles list.
 * Must be used AFTER authMiddleware.
 *
 * @example
 * router.post('/villas', authMiddleware, roleGuard(['host', 'admin']), createVilla)
 */
export function roleGuard(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      errorResponse(
        res,
        `Forbidden: requires one of [${allowedRoles.join(', ')}] role`,
        403
      );
      return;
    }

    next();
  };
}
