import { JwtPayload } from "../utils/jwtUtils.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string }; // Standard user payload containing userId, email, role
    }
  }
}
export {};
