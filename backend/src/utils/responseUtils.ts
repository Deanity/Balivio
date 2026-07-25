import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@/types/apiTypes';

export function successResponse<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(body);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  meta: PaginatedResponse<T>['meta'],
  message: string = 'Success'
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    meta,
  };
  return res.status(200).json(body);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors: unknown[] | null = null
): Response {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    errors,
  };
  return res.status(statusCode).json(body);
}
