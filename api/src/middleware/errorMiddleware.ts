import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/responseUtils.js";
import { env } from "../config/env.js";

export interface CustomError extends Error {
  statusCode?: number;
  errors?: unknown;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // Log the error details
  console.error(`[Error] ${req.method} ${req.path} - Status: ${statusCode} - Message: ${message}`);
  if (err.stack && env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    sendError(res, "Validation Error", 400, err.errors);
    return;
  }

  // Handle DB or general errors
  const isProduction = env.NODE_ENV === "production";
  const clientMessage = isProduction && statusCode === 500 
    ? "An unexpected error occurred" 
    : message;

  sendError(res, clientMessage, statusCode, err.errors);
};
