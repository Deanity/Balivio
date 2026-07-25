import {
  pgTable,
  uuid,
  varchar,
  numeric,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { bookings } from './bookings.schema';

// =============================================
// PAYMENTS
// =============================================
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .references(() => bookings.id, { onDelete: 'cascade' })
    .notNull(),
  paymentCode: varchar('payment_code', { length: 255 }).unique().notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  gatewayResponse: jsonb('gateway_response'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
});

// =============================================
// PAYMENT TRANSFER DETAILS (Virtual Account)
// =============================================
export const paymentTransferDetails = pgTable('payment_transfer_details', {
  paymentId: uuid('payment_id')
    .primaryKey()
    .references(() => payments.id, { onDelete: 'cascade' }),
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  virtualAccountNumber: varchar('virtual_account_number', { length: 100 }).notNull(),
  expiredAt: timestamp('expired_at', { withTimezone: true }).notNull(),
});

// =============================================
// PAYMENT CARD DETAILS
// =============================================
export const paymentCardDetails = pgTable('payment_card_details', {
  paymentId: uuid('payment_id')
    .primaryKey()
    .references(() => payments.id, { onDelete: 'cascade' }),
  cardHolderName: varchar('card_holder_name', { length: 255 }).notNull(),
  maskedCardNumber: varchar('masked_card_number', { length: 50 }).notNull(),
  cardBrand: varchar('card_brand', { length: 50 }).notNull(),
  authCode: varchar('auth_code', { length: 100 }),
});

// =============================================
// PAYMENT EWALLET DETAILS
// =============================================
export const paymentEwalletDetails = pgTable('payment_ewallet_details', {
  paymentId: uuid('payment_id')
    .primaryKey()
    .references(() => payments.id, { onDelete: 'cascade' }),
  providerName: varchar('provider_name', { length: 100 }).notNull(),
  externalTransactionId: varchar('external_transaction_id', { length: 255 }),
  qrCodeUrl: varchar('qr_code_url', { length: 512 }),
});

// =============================================
// RELATIONS
// =============================================
export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
  transferDetails: one(paymentTransferDetails, {
    fields: [payments.id],
    references: [paymentTransferDetails.paymentId],
  }),
  cardDetails: one(paymentCardDetails, {
    fields: [payments.id],
    references: [paymentCardDetails.paymentId],
  }),
  ewalletDetails: one(paymentEwalletDetails, {
    fields: [payments.id],
    references: [paymentEwalletDetails.paymentId],
  }),
}));

export const paymentTransferDetailsRelations = relations(
  paymentTransferDetails,
  ({ one }) => ({
    payment: one(payments, {
      fields: [paymentTransferDetails.paymentId],
      references: [payments.id],
    }),
  })
);

export const paymentCardDetailsRelations = relations(
  paymentCardDetails,
  ({ one }) => ({
    payment: one(payments, {
      fields: [paymentCardDetails.paymentId],
      references: [payments.id],
    }),
  })
);

export const paymentEwalletDetailsRelations = relations(
  paymentEwalletDetails,
  ({ one }) => ({
    payment: one(payments, {
      fields: [paymentEwalletDetails.paymentId],
      references: [payments.id],
    }),
  })
);
