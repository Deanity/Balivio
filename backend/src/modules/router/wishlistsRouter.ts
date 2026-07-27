import { Router } from 'express';
import * as wishlistsController from '../controller/wishlistsController';
import { authMiddleware } from '../../middleware/authMiddleware';

export const wishlistsRouter = Router();

wishlistsRouter.get('/', authMiddleware, wishlistsController.getWishlist);
wishlistsRouter.post('/:villaId', authMiddleware, wishlistsController.addToWishlist);
wishlistsRouter.delete('/:villaId', authMiddleware, wishlistsController.removeFromWishlist);
