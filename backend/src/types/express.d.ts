import type { AuthUser } from './apiTypes';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
