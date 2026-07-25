import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  doublePrecision,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './auth.schema';

// =============================================
// AREAS
// =============================================
export const areas = pgTable('areas', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  region: varchar('region', { length: 255 }).notNull().default('Bali'),
  imageUrl: varchar('image_url', { length: 512 }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// PROPERTY TYPES
// =============================================
export const propertyTypes = pgTable('property_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// VILLAS
// =============================================
export const villas = pgTable('villas', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  propertyTypeId: integer('property_type_id').references(
    () => propertyTypes.id,
    { onDelete: 'set null' }
  ),
  areaId: integer('area_id').references(() => areas.id, {
    onDelete: 'set null',
  }),
  hostId: uuid('host_id').references(() => users.id, { onDelete: 'set null' }),
  address: text('address').notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  pricePerNight: numeric('price_per_night', { precision: 12, scale: 2 }).notNull(),
  originalPrice: numeric('original_price', { precision: 12, scale: 2 }),
  discountPercent: integer('discount_percent').default(0),
  bedrooms: integer('bedrooms').notNull().default(1),
  guestsCapacity: integer('guests_capacity').notNull().default(2),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// =============================================
// VILLA IMAGES
// =============================================
export const villaImages = pgTable('villa_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  villaId: uuid('villa_id')
    .references(() => villas.id, { onDelete: 'cascade' })
    .notNull(),
  imageUrl: varchar('image_url', { length: 512 }).notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// AMENITIES
// =============================================
export const amenities = pgTable('amenities', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).unique().notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  iconName: varchar('icon_name', { length: 100 }),
  category: varchar('category', { length: 100 }),
});

// =============================================
// VILLA AMENITIES (junction)
// =============================================
export const villaAmenities = pgTable(
  'villa_amenities',
  {
    villaId: uuid('villa_id')
      .references(() => villas.id, { onDelete: 'cascade' })
      .notNull(),
    amenityId: integer('amenity_id')
      .references(() => amenities.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (t) => [primaryKey({ columns: [t.villaId, t.amenityId] })]
);

// =============================================
// VILLA POLICIES
// =============================================
export const villaPolicies = pgTable('villa_policies', {
  villaId: uuid('villa_id')
    .primaryKey()
    .references(() => villas.id, { onDelete: 'cascade' }),
  checkInTime: varchar('check_in_time', { length: 10 }).notNull().default('14:00'),
  checkOutTime: varchar('check_out_time', { length: 10 }).notNull().default('12:00'),
  cancellationPolicy: text('cancellation_policy').notNull(),
  customRules: text('custom_rules'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// RELATIONS
// =============================================
export const areasRelations = relations(areas, ({ many }) => ({
  villas: many(villas),
}));

export const propertyTypesRelations = relations(propertyTypes, ({ many }) => ({
  villas: many(villas),
}));

export const villasRelations = relations(villas, ({ one, many }) => ({
  area: one(areas, { fields: [villas.areaId], references: [areas.id] }),
  propertyType: one(propertyTypes, {
    fields: [villas.propertyTypeId],
    references: [propertyTypes.id],
  }),
  host: one(users, { fields: [villas.hostId], references: [users.id] }),
  images: many(villaImages),
  villaAmenities: many(villaAmenities),
  policy: one(villaPolicies, {
    fields: [villas.id],
    references: [villaPolicies.villaId],
  }),
}));

export const villaImagesRelations = relations(villaImages, ({ one }) => ({
  villa: one(villas, { fields: [villaImages.villaId], references: [villas.id] }),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  villaAmenities: many(villaAmenities),
}));

export const villaAmenitiesRelations = relations(villaAmenities, ({ one }) => ({
  villa: one(villas, {
    fields: [villaAmenities.villaId],
    references: [villas.id],
  }),
  amenity: one(amenities, {
    fields: [villaAmenities.amenityId],
    references: [amenities.id],
  }),
}));

export const villaPoliciesRelations = relations(villaPolicies, ({ one }) => ({
  villa: one(villas, {
    fields: [villaPolicies.villaId],
    references: [villas.id],
  }),
}));
