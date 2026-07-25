import { db, wishlists, villas } from '@/db';
import { eq, and, isNull } from 'drizzle-orm';

export async function getWishlist(userId: string): Promise<unknown[]> {
  return db.select({
    villaId: wishlists.villaId,
    createdAt: wishlists.createdAt,
    villaName: villas.name,
    villaSlug: villas.slug,
    pricePerNight: villas.pricePerNight,
  })
    .from(wishlists)
    .innerJoin(villas, and(eq(wishlists.villaId, villas.id), isNull(villas.deletedAt)))
    .where(eq(wishlists.userId, userId));
}

export async function addToWishlist(userId: string, villaId: string): Promise<Record<string, unknown>> {
  const [result] = await db.insert(wishlists)
    .values({ userId, villaId })
    .onConflictDoNothing()
    .returning();
  return (result ?? { userId, villaId }) as Record<string, unknown>;
}

export async function removeFromWishlist(userId: string, villaId: string): Promise<void> {
  await db.delete(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.villaId, villaId)));
}
