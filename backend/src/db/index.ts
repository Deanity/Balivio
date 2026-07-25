import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/config/env';

// Schema exports
export * from './schema/auth.schema';
export * from './schema/properties.schema';
export * from './schema/availability.schema';
export * from './schema/bookings.schema';
export * from './schema/payments.schema';
export * from './schema/social.schema';

// Import all schemas for Drizzle instance
import * as authSchema from './schema/auth.schema';
import * as propertiesSchema from './schema/properties.schema';
import * as availabilitySchema from './schema/availability.schema';
import * as bookingsSchema from './schema/bookings.schema';
import * as paymentsSchema from './schema/payments.schema';
import * as socialSchema from './schema/social.schema';

const allSchemas = {
  ...authSchema,
  ...propertiesSchema,
  ...availabilitySchema,
  ...bookingsSchema,
  ...paymentsSchema,
  ...socialSchema,
};

// Create postgres client
const client = postgres(env.DATABASE_URL, { max: 10 });

// Create Drizzle instance
export const db = drizzle(client, { schema: allSchemas });

export type DbClient = typeof db;
