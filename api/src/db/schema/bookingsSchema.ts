import { pgTable, uuid, varchar, date, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { villas } from "./propertiesSchema.js";
import { users } from "./authSchema.js";
import { sql } from "drizzle-orm";

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingCode: varchar("booking_code").unique().notNull(),
  villaId: uuid("villa_id").references(() => villas.id, { onDelete: "restrict" }),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "restrict" }),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guestsCount: integer("guests_count").notNull().default(2),
  status: varchar("status").notNull().default("pending"), // 'pending', 'confirmed', 'paid', 'cancelled', 'completed'
  
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  serviceFee: numeric("service_fee", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  customerNotes: text("customer_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
