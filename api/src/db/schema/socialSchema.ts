import { pgTable, uuid, numeric, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { bookings } from "./bookingsSchema.js";
import { villas } from "./propertiesSchema.js";
import { users } from "./authSchema.js";
import { sql } from "drizzle-orm";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
  villaId: uuid("villa_id").references(() => villas.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(), // Scale 1-5
  comment: text("comment"),
  replyFromHost: text("reply_from_host"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const wishlists = pgTable("wishlists", {
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  villaId: uuid("villa_id").references(() => villas.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.villaId] })
]);
