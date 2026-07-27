import { db, reviews, bookings } from '../../db';
import { eq, and, isNull } from 'drizzle-orm';
import type { CreateReviewDto, ReplyReviewDto } from '../schema/reviewsSchema';

export async function createReview(dto: CreateReviewDto, userId: string): Promise<Record<string, unknown>> {
  // Verify booking is completed and belongs to user
  const [booking] = await db.select().from(bookings)
    .where(eq(bookings.id, dto.bookingId)).limit(1);

  if (!booking) {
    const err = new Error('Booking not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (booking.customerId !== userId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }
  if (booking.status !== 'completed') {
    const err = new Error('Reviews can only be submitted for completed bookings') as Error & { statusCode: number };
    err.statusCode = 422;
    throw err;
  }

  const [review] = await db.insert(reviews).values({
    bookingId: dto.bookingId,
    villaId: dto.villaId,
    userId,
    rating: String(dto.rating),
    comment: dto.comment ?? null,
  }).returning();

  return review as Record<string, unknown>;
}

export async function replyToReview(reviewId: string, dto: ReplyReviewDto, hostId: string): Promise<Record<string, unknown>> {
  const [review] = await db.select().from(reviews)
    .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt))).limit(1);

  if (!review) {
    const err = new Error('Review not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  const [updated] = await db.update(reviews)
    .set({ replyFromHost: dto.replyFromHost })
    .where(eq(reviews.id, reviewId))
    .returning();

  return updated as Record<string, unknown>;
}

export async function softDeleteReview(reviewId: string, userId: string): Promise<void> {
  const [review] = await db.select().from(reviews)
    .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt))).limit(1);

  if (!review) {
    const err = new Error('Review not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (review.userId !== userId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }

  await db.update(reviews).set({ deletedAt: new Date() }).where(eq(reviews.id, reviewId));
}
