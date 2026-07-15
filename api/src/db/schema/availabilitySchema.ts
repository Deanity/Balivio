import { pgTable, uuid, date, varchar, numeric, timestamp, unique } from "drizzle-orm/pg-core";
import { villas } from "./propertiesSchema.js";
import { sql } from "drizzle-orm";

export const villaAvailability = pgTable("villa_availability", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  villaId: uuid("villa_id").references(() => villas.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  status: varchar("status").notNull().default("available"), // 'available', 'blocked', 'booked'
  priceOverride: numeric("price_override", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  unique("villa_date_unique").on(table.villaId, table.date)
]);
