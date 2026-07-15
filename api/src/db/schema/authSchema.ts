import { pgTable, uuid, varchar, timestamp, text, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  displayName: varchar("display_name").notNull(),
  phone: varchar("phone"),
  role: varchar("role").notNull().default("guest"), // 'guest', 'host', 'admin'
  status: varchar("status").notNull().default("active"), // 'active', 'suspended', 'unverified'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  avatarUrl: varchar("avatar_url"),
  birthDate: date("birth_date"),
  gender: varchar("gender"),
  address: text("address"),
  city: varchar("city"),
  country: varchar("country"),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionToken: varchar("session_token").unique().notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
