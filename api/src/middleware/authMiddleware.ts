import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils.js";
import { sendError } from "../utils/responseUtils.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Access Denied: No Token Provided", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      ...decoded,
      id: decoded.userId,
    };
    next();
  } catch (error) {
    sendError(res, "Access Denied: Invalid or Expired Token", 401, error);
  }
};

export const roleGuard = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Access Denied: Unauthenticated", 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, "Access Denied: Forbidden", 403);
      return;
    }

    next();
  };
};
