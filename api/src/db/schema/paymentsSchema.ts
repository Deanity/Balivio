import { pgTable, uuid, varchar, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { bookings } from "./bookingsSchema.js";
import { sql } from "drizzle-orm";

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
  paymentCode: varchar("payment_code").unique().notNull(),
  paymentMethod: varchar("payment_method").notNull(), // 'transfer', 'card', 'ewallet'
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  gatewayResponse: jsonb("gateway_response"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const paymentTransferDetails = pgTable("payment_transfer_details", {
  paymentId: uuid("payment_id").primaryKey().references(() => payments.id, { onDelete: "cascade" }),
  bankName: varchar("bank_name").notNull(),
  virtualAccountNumber: varchar("virtual_account_number").notNull(),
  expiredAt: timestamp("expired_at").notNull(),
});

export const paymentCardDetails = pgTable("payment_card_details", {
  paymentId: uuid("payment_id").primaryKey().references(() => payments.id, { onDelete: "cascade" }),
  cardHolderName: varchar("card_holder_name").notNull(),
  maskedCardNumber: varchar("masked_card_number").notNull(),
  cardBrand: varchar("card_brand").notNull(),
  authCode: varchar("auth_code"),
});

export const paymentEwalletDetails = pgTable("payment_ewallet_details", {
  paymentId: uuid("payment_id").primaryKey().references(() => payments.id, { onDelete: "cascade" }),
  providerName: varchar("provider_name").notNull(), // 'GoPay', 'OVO', 'DANA', 'ShopeePay'
  externalTransactionId: varchar("external_transaction_id"),
  qrCodeUrl: varchar("qr_code_url"),
});
