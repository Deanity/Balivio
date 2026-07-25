/**
 * paymentsService.ts
 *
 * Uses Xendit Invoice API the recommended approach for xendit-node v6.
 * Guest is redirected to a Xendit-hosted checkout page where they choose
 * their payment method (VA, eWallet, credit card, QRIS).
 *
 * Docs: https://developers.xendit.co/api-reference/#invoices
 */

import { Xendit } from 'xendit-node';
import { db, payments, bookings, villaAvailability, villas } from '@/db';
import { eq, and } from 'drizzle-orm';
import { env } from '@/config/env';
import { eachDayOfInterval, format, differenceInCalendarDays } from 'date-fns';
import type { InitiatePaymentDto } from '@/modules/schema/paymentsSchema';
import { sendBookingConfirmationEmail } from '@/utils/emailService';

const xenditClient = new Xendit({ secretKey: env.XENDIT_SECRET_KEY });

// =============================================
// INITIATE PAYMENT create Xendit Invoice
// =============================================
export async function initiatePayment(
  dto: InitiatePaymentDto,
  userId: string
): Promise<Record<string, unknown>> {
  // Get booking
  const [booking] = await db.select().from(bookings)
    .where(eq(bookings.id, dto.bookingId)).limit(1);

  if (!booking) {
    const err = new Error('Booking not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (booking.customerId !== userId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }
  if (!['pending', 'confirmed'].includes(booking.status)) {
    const err = new Error('This booking cannot be paid') as Error & { statusCode: number };
    err.statusCode = 422;
    throw err;
  }

  // Check if payment already exists for this booking
  const [existing] = await db.select().from(payments)
    .where(and(eq(payments.bookingId, dto.bookingId))).limit(1);

  if (existing && existing.status === 'pending') {
    const gw = (existing.gatewayResponse ?? {}) as Record<string, string>;
    return {
      payment: existing,
      invoiceUrl: gw.invoice_url ?? gw.invoiceUrl ?? '',
      invoiceId: gw.id ?? '',
    };
  }

  const paymentCode = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const amount = parseFloat(booking.totalPrice);

  // Build payment methods filter based on user's selection
  const paymentMethodsAllowed: string[] = [];
  if (dto.paymentMethod === 'transfer') {
    paymentMethodsAllowed.push('BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA');
  } else if (dto.paymentMethod === 'ewallet') {
    paymentMethodsAllowed.push('OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY');
  } else if (dto.paymentMethod === 'card') {
    paymentMethodsAllowed.push('CREDIT_CARD');
  }

  // Create Xendit Invoice
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoiceApi = (xenditClient as any).Invoice;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let invoice: any;

  if (invoiceApi) {
    invoice = await invoiceApi.createInvoice({
      data: {
        externalId: paymentCode,
        amount,
        currency: 'IDR',
        payerEmail: booking.customerEmail,
        description: `Balivio - ${booking.bookingCode} (${booking.checkIn} to ${booking.checkOut})`,
        successRedirectUrl: env.XENDIT_SUCCESS_REDIRECT_URL,
        failureRedirectUrl: env.XENDIT_FAILURE_REDIRECT_URL,
        ...(paymentMethodsAllowed.length > 0 ? { paymentMethods: paymentMethodsAllowed } : {}),
      },
    });
  } else {
    // Fallback: call Xendit REST API directly
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(env.XENDIT_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        external_id: paymentCode,
        amount,
        currency: 'IDR',
        payer_email: booking.customerEmail,
        description: `Balivio - ${booking.bookingCode}`,
        success_redirect_url: env.XENDIT_SUCCESS_REDIRECT_URL,
        failure_redirect_url: env.XENDIT_FAILURE_REDIRECT_URL,
      }),
    });
    invoice = await response.json();
  }

  // Save payment record
  const [payment] = await db.insert(payments).values({
    bookingId: dto.bookingId,
    paymentCode,
    paymentMethod: dto.paymentMethod,
    amount: String(amount),
    status: 'pending',
    gatewayResponse: invoice as Record<string, unknown>,
  }).returning();

  if (dto.paymentMethod === 'transfer' && payment) {
    const { paymentTransferDetails } = await import('@/db');
    await db.insert(paymentTransferDetails).values({
      paymentId: payment.id,
      bankName: dto.bankCode ?? 'BCA',
      virtualAccountNumber: `88012${Math.floor(100000000 + Math.random() * 900000000)}`,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).onConflictDoNothing();
  }

  return {
    payment,
    invoiceUrl: (invoice as Record<string, string>).invoice_url ?? (invoice as Record<string, string>).invoiceUrl,
    invoiceId: (invoice as Record<string, string>).id,
  };
}

// =============================================
// WEBHOOK HANDLER Xendit Invoice webhook
// =============================================
export async function handleWebhook(
  payload: Record<string, unknown>,
  callbackToken: string
): Promise<void> {
  if (callbackToken !== env.XENDIT_WEBHOOK_TOKEN) {
    const err = new Error('Invalid webhook token') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  // Xendit invoice webhook payload fields:
  // external_id, status, id, paid_amount, payment_method, etc.
  const externalId = payload['external_id'] as string;
  const xenditStatus = payload['status'] as string;

  if (!externalId) return;

  const [payment] = await db.select().from(payments)
    .where(eq(payments.paymentCode, externalId)).limit(1);

  if (!payment) return;

  const isPaid = ['PAID', 'SETTLED'].includes(xenditStatus);
  const isFailed = ['EXPIRED', 'FAILED'].includes(xenditStatus);

  if (isPaid) {
    await db.transaction(async (tx) => {
      await tx.update(payments).set({
        status: 'completed',
        paidAt: new Date(),
        gatewayResponse: payload,
      }).where(eq(payments.id, payment.id));

      const [booking] = await tx.select().from(bookings)
        .where(eq(bookings.id, payment.bookingId)).limit(1);

      if (booking) {
        await tx.update(bookings).set({ status: 'paid' })
          .where(eq(bookings.id, booking.id));

        // Lock availability dates
        const dateRange = eachDayOfInterval({
          start: new Date(booking.checkIn),
          end: new Date(booking.checkOut),
        });

        for (const d of dateRange) {
          const dateStr = format(d, 'yyyy-MM-dd');
          await tx.insert(villaAvailability)
            .values({ villaId: booking.villaId!, date: dateStr, status: 'booked' })
            .onConflictDoUpdate({
              target: [villaAvailability.villaId, villaAvailability.date],
              set: { status: 'booked' },
            });
        }

        // Send booking confirmation email via Resend
        const [villa] = await tx.select({ name: villas.name, address: villas.address })
          .from(villas).where(eq(villas.id, booking.villaId!)).limit(1);

        const nights = differenceInCalendarDays(
          new Date(booking.checkOut),
          new Date(booking.checkIn)
        );
        const total = parseFloat(booking.totalPrice);
        const subtotal = parseFloat(booking.subtotal);
        const serviceFee = parseFloat(booking.serviceFee);
        const taxFee = total - subtotal - serviceFee;

        // Fire and forget — don't block webhook response on email send
        sendBookingConfirmationEmail({
          customerName: booking.customerName ?? 'Tamu Balivio',
          customerEmail: booking.customerEmail,
          bookingCode: booking.bookingCode,
          villaName: villa?.name ?? 'Villa Balivio',
          villaLocation: villa?.address ?? 'Bali',
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights,
          guests: booking.guestsCount ?? 1,
          subtotal,
          serviceFee,
          taxFee,
          totalPrice: total,
          paymentMethod: payment.paymentMethod,
          paymentCode: payment.paymentCode,
        }).catch((err: unknown) => console.error('Email send failed (non-blocking):', err));
      }
    });
  } else if (isFailed) {
    await db.update(payments).set({
      status: 'failed',
      gatewayResponse: payload,
    }).where(eq(payments.id, payment.id));
  }
}

// =============================================
// GET PAYMENT STATUS
// =============================================
export async function getPaymentByCode(
  paymentCode: string,
  userId: string
): Promise<Record<string, unknown>> {
  const [payment] = await db.select().from(payments)
    .where(eq(payments.paymentCode, paymentCode)).limit(1);

  if (!payment) {
    const err = new Error('Payment not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  const [booking] = await db.select({ customerId: bookings.customerId }).from(bookings)
    .where(eq(bookings.id, payment.bookingId)).limit(1);

  if (booking?.customerId !== userId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }

  return payment as Record<string, unknown>;
}
