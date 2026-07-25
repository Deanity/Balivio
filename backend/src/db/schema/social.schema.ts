import {
  pgTable,
  uuid,
  numeric,
  text,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { villas } from './properties.schema';
import { users } from './auth.schema';
import { bookings } from './bookings.schema';

// =============================================
// REVIEWS
// =============================================
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id, {
    onDelete: 'set null',
  }),
  villaId: uuid('villa_id')
    .references(() => villas.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
  comment: text('comment'),
  replyFromHost: text('reply_from_host'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// =============================================
// WISHLISTS
// =============================================
export const wishlists = pgTable(
  'wishlists',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    villaId: uuid('villa_id')
      .references(() => villas.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (t) => [primaryKey({ columns: [t.userId, t.villaId] })]
);

// =============================================
// RELATIONS
// =============================================
export const reviewsRelations = relations(reviews, ({ one }) => ({
  villa: one(villas, { fields: [reviews.villaId], references: [villas.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  villa: one(villas, { fields: [wishlists.villaId], references: [villas.id] }),
}));
