import type { Request, Response, NextFunction } from 'express';
import * as usersService from '../service/usersService';
import { successResponse } from '../../utils/responseUtils';
import type { UpdateProfileDto, ChangePasswordDto } from '../schema/usersSchema';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await usersService.getProfile(req.user!.id);
    successResponse(res, profile, 'Profile retrieved');
  } catch (err) { next(err); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await usersService.updateProfile(req.user!.id, req.body as UpdateProfileDto);
    successResponse(res, profile, 'Profile updated');
  } catch (err) { next(err); }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await usersService.changePassword(req.user!.id, req.body as ChangePasswordDto);
    res.status(204).send();
  } catch (err) { next(err); }
}
