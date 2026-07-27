import type { Request, Response, NextFunction } from 'express';
import * as reviewsService from '../service/reviewsService';
import { successResponse } from '../../utils/responseUtils';
import type { CreateReviewDto, ReplyReviewDto } from '../schema/reviewsSchema';

export async function createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await reviewsService.createReview(req.body as CreateReviewDto, req.user!.id);
    successResponse(res, review, 'Review submitted', 201);
  } catch (err) { next(err); }
}

export async function replyToReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await reviewsService.replyToReview(req.params['id'] as string, req.body as ReplyReviewDto, req.user!.id);
    successResponse(res, review, 'Reply added');
  } catch (err) { next(err); }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await reviewsService.softDeleteReview(req.params['id'] as string, req.user!.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
