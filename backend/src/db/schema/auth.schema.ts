import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  text,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// =============================================
// USERS
// =============================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  role: varchar('role', { length: 50 }).notNull().default('guest'),
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
// USER PROFILES
// =============================================
export const userProfiles = pgTable('user_profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  avatarUrl: varchar('avatar_url', { length: 512 }),
  birthDate: date('birth_date'),
  gender: varchar('gender', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// USER SESSIONS (defined for schema completeness)
// =============================================
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  sessionToken: varchar('session_token', { length: 512 }).unique().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 512 }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// RELATIONS
// =============================================
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  sessions: many(userSessions),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));
