import {
  pgTable,
  uuid,
  date,
  varchar,
  numeric,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { villas } from './properties.schema';

// =============================================
// VILLA AVAILABILITY
// =============================================
export const villaAvailability = pgTable(
  'villa_availability',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    villaId: uuid('villa_id')
      .references(() => villas.id, { onDelete: 'cascade' })
      .notNull(),
    date: date('date').notNull(),
    status: varchar('status', { length: 50 }).notNull().default('available'),
    priceOverride: numeric('price_override', { precision: 12, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (t) => [unique().on(t.villaId, t.date)]
);

// =============================================
// RELATIONS
// =============================================
export const villaAvailabilityRelations = relations(
  villaAvailability,
  ({ one }) => ({
    villa: one(villas, {
      fields: [villaAvailability.villaId],
      references: [villas.id],
    }),
  })
);
