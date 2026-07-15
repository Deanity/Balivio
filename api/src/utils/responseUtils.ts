import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: unknown;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Operation successful",
  statusCode = 200,
  meta?: ApiResponse["meta"]
): Response => {
  const responseBody: ApiResponse<T> = {
    success: true,
    data,
    message,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  message = "An error occurred",
  statusCode = 500,
  errors?: unknown
): Response => {
  const responseBody: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    ...(errors !== undefined && errors !== null ? { errors } : {}),
  };
  return res.status(statusCode).json(responseBody);
};
