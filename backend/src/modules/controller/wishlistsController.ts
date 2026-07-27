import type { Request, Response, NextFunction } from 'express';
import * as wishlistsService from '../service/wishlistsService';
import { successResponse } from '../../utils/responseUtils';

export async function getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await wishlistsService.getWishlist(req.user!.id);
    successResponse(res, data, 'Wishlist retrieved');
  } catch (err) { next(err); }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await wishlistsService.addToWishlist(req.user!.id, req.params['villaId'] as string);
    successResponse(res, data, 'Added to wishlist', 201);
  } catch (err) { next(err); }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await wishlistsService.removeFromWishlist(req.user!.id, req.params['villaId'] as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
