import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { villas } from './properties.schema';
import { users } from './auth.schema';

// =============================================
// BOOKINGS
// =============================================
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingCode: varchar('booking_code', { length: 100 }).unique().notNull(),
  villaId: uuid('villa_id').references(() => villas.id, {
    onDelete: 'set null',
  }),
  customerId: uuid('customer_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  checkIn: varchar('check_in').notNull(),
  checkOut: varchar('check_out').notNull(),
  guestsCount: integer('guests_count').notNull().default(2),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  serviceFee: numeric('service_fee', { precision: 12, scale: 2 }).notNull(),
  tax: numeric('tax', { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  customerNotes: text('customer_notes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// =============================================
// RELATIONS
// =============================================
export const bookingsRelations = relations(bookings, ({ one }) => ({
  villa: one(villas, { fields: [bookings.villaId], references: [villas.id] }),
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
  }),
}));
