import type { Request, Response, NextFunction } from 'express';
import * as authService from '@/modules/service/authService';
import { successResponse, errorResponse } from '@/utils/responseUtils';
import type { RegisterDto, LoginDto, RefreshDto } from '@/modules/schema/authSchema';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.register(req.body as RegisterDto);
    successResponse(res, result, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.login(req.body as LoginDto);
    successResponse(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function googleOAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url } = await authService.getGoogleOAuthUrl();
    successResponse(res, { url }, 'Google OAuth URL generated');
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.refreshSession(req.body as RefreshDto);
    successResponse(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    await authService.logout(token);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.getMe(req.user!.id);
    successResponse(res, user, 'User retrieved');
  } catch (err) {
    next(err);
  }
}
