import { pgTable, uuid, varchar, text, integer, doublePrecision, numeric, serial, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./authSchema.js";
import { sql } from "drizzle-orm";

export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  region: varchar("region").notNull().default("Bali"),
  imageUrl: varchar("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const propertyTypes = pgTable("property_types", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const villas = pgTable("villas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").unique().notNull(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  propertyTypeId: integer("property_type_id").references(() => propertyTypes.id),
  areaId: integer("area_id").references(() => areas.id),
  hostId: uuid("host_id").references(() => users.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  pricePerNight: numeric("price_per_night", { precision: 12, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
  discountPercent: integer("discount_percent").default(0),
  bedrooms: integer("bedrooms").notNull().default(1),
  guestsCapacity: integer("guests_capacity").notNull().default(2),
  status: varchar("status").notNull().default("active"), // 'active', 'inactive', 'maintenance'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const villaImages = pgTable("villa_images", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  villaId: uuid("villa_id").references(() => villas.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  key: varchar("key").unique().notNull(),
  label: varchar("label").notNull(),
  iconName: varchar("icon_name"),
  category: varchar("category"), // e.g. 'General', 'Safety', 'Entertainment'
});

export const villaAmenities = pgTable("villa_amenities", {
  villaId: uuid("villa_id").references(() => villas.id, { onDelete: "cascade" }),
  amenityId: integer("amenity_id").references(() => amenities.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.villaId, table.amenityId] })
]);

export const villaPolicies = pgTable("villa_policies", {
  villaId: uuid("villa_id").primaryKey().references(() => villas.id, { onDelete: "cascade" }),
  checkInTime: varchar("check_in_time").notNull().default("14:00"),
  checkOutTime: varchar("check_out_time").notNull().default("12:00"),
  cancellationPolicy: text("cancellation_policy").notNull(),
  customRules: text("custom_rules"),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
