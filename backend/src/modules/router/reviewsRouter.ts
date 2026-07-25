import { Router } from 'express';
import * as reviewsController from '@/modules/controller/reviewsController';
import { authMiddleware } from '@/middleware/authMiddleware';
import { roleGuard } from '@/middleware/roleGuard';
import { validate } from '@/middleware/validateMiddleware';
import { createReviewSchema, replyReviewSchema } from '@/modules/schema/reviewsSchema';

export const reviewsRouter = Router();

reviewsRouter.post('/', authMiddleware, roleGuard(['guest', 'host', 'admin']), validate(createReviewSchema), reviewsController.createReview);
reviewsRouter.patch('/:id/reply', authMiddleware, roleGuard(['host', 'admin']), validate(replyReviewSchema), reviewsController.replyToReview);
reviewsRouter.delete('/:id', authMiddleware, roleGuard(['guest', 'host', 'admin']), reviewsController.deleteReview);
