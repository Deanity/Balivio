import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  villaId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export const replyReviewSchema = z.object({
  replyFromHost: z.string().min(1).max(2000),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type ReplyReviewDto = z.infer<typeof replyReviewSchema>;
