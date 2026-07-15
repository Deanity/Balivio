import rateLimit from "express-rate-limit";
import { sendError } from "../utils/responseUtils.js";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return standard rate limit info headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  handler: (_req, res) => {
    sendError(res, "Too many login attempts. Please try again after 15 minutes.", 429);
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 registration requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, "Too many registration attempts from this IP. Please try again after an hour.", 429);
  },
});
