import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.js";

import * as authSchema from "./schema/authSchema.js";
import * as propertiesSchema from "./schema/propertiesSchema.js";
import * as availabilitySchema from "./schema/availabilitySchema.js";
import * as bookingsSchema from "./schema/bookingsSchema.js";
import * as paymentsSchema from "./schema/paymentsSchema.js";
import * as socialSchema from "./schema/socialSchema.js";

export const schema = {
  ...authSchema,
  ...propertiesSchema,
  ...availabilitySchema,
  ...bookingsSchema,
  ...paymentsSchema,
  ...socialSchema,
};

// Database connection client
const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export type DbType = typeof db;
export default db;
