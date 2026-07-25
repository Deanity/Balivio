import { db, bookings, villas, villaAvailability } from '@/db';
import { eq, and, gte, lte, isNull, count } from 'drizzle-orm';
import { generateBookingCode } from '@/utils/bookingCodeUtils';
import { parsePagination, buildMeta } from '@/utils/paginationUtils';
import { differenceInDays, eachDayOfInterval, format } from 'date-fns';
import type { CreateBookingDto } from '@/modules/schema/bookingsSchema';

const SERVICE_FEE_RATE = 0.10;  // 10%
const TAX_RATE = 0.11;           // 11%

// =============================================
// CREATE BOOKING
// =============================================
export async function createBooking(
  dto: CreateBookingDto,
  customerId: string
): Promise<Record<string, unknown>> {
  return db.transaction(async (tx) => {
    // 1. Get villa price
    const [villa] = await tx
      .select({ id: villas.id, pricePerNight: villas.pricePerNight, status: villas.status })
      .from(villas)
      .where(and(eq(villas.id, dto.villaId), isNull(villas.deletedAt)))
      .limit(1);

    if (!villa) {
      const err = new Error('Villa not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    if (villa.status !== 'active') {
      const err = new Error('Villa is not available for booking') as Error & { statusCode: number };
      err.statusCode = 422;
      throw err;
    }

    // 2. Conflict check
    const conflicts = await tx
      .select({ id: villaAvailability.id })
      .from(villaAvailability)
      .where(
        and(
          eq(villaAvailability.villaId, dto.villaId),
          eq(villaAvailability.status, 'booked'),
          gte(villaAvailability.date, dto.checkIn),
          lte(villaAvailability.date, dto.checkOut)
        )
      );

    if (conflicts.length > 0) {
      const err = new Error('Selected dates are not available') as Error & { statusCode: number };
      err.statusCode = 409;
      throw err;
    }

    // 3. Calculate price
    const nights = differenceInDays(new Date(dto.checkOut), new Date(dto.checkIn));
    if (nights <= 0) {
      const err = new Error('Check-out must be after check-in') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    const pricePerNight = parseFloat(villa.pricePerNight);
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * SERVICE_FEE_RATE;
    const tax = subtotal * TAX_RATE;
    const totalPrice = subtotal + serviceFee + tax;

    // 4. Generate unique booking code
    let bookingCode: string;
    let codeExists = true;
    do {
      bookingCode = generateBookingCode();
      const existing = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .where(eq(bookings.bookingCode, bookingCode))
        .limit(1);
      codeExists = existing.length > 0;
    } while (codeExists);

    // 5. Insert booking
    const [booking] = await tx
      .insert(bookings)
      .values({
        bookingCode: bookingCode!,
        villaId: dto.villaId,
        customerId,
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        guestsCount: dto.guestsCount,
        subtotal: String(subtotal.toFixed(2)),
        serviceFee: String(serviceFee.toFixed(2)),
        tax: String(tax.toFixed(2)),
        totalPrice: String(totalPrice.toFixed(2)),
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        customerNotes: dto.customerNotes ?? null,
        status: 'pending',
      })
      .returning();

    return booking as Record<string, unknown>;
  });
}

// =============================================
// LIST USER BOOKINGS
// =============================================
export async function listUserBookings(
  customerId: string,
  page: number,
  limit: number
): Promise<Record<string, unknown>> {
  const { offset } = parsePagination(page, limit);

  const [bookingList, totalResult] = await Promise.all([
    db.select().from(bookings)
      .where(and(eq(bookings.customerId, customerId), isNull(bookings.deletedAt)))
      .limit(limit).offset(offset)
      .orderBy(bookings.createdAt),
    db.select({ count: count() }).from(bookings)
      .where(and(eq(bookings.customerId, customerId), isNull(bookings.deletedAt))),
  ]);

  return { data: bookingList, meta: buildMeta(totalResult[0]?.count ?? 0, page, limit) };
}

// =============================================
// GET BOOKING BY CODE
// =============================================
export async function getBookingByCode(
  bookingCode: string,
  userId: string,
  role: string
): Promise<Record<string, unknown>> {
  const [booking] = await db.select().from(bookings)
    .where(and(eq(bookings.bookingCode, bookingCode), isNull(bookings.deletedAt)))
    .limit(1);

  if (!booking) {
    const err = new Error('Booking not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  // Only allow customer, host, or admin to view
  if (role !== 'admin' && booking.customerId !== userId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }

  return booking as Record<string, unknown>;
}

// =============================================
// CANCEL BOOKING
// =============================================
export async function cancelBooking(bookingId: string, userId: string): Promise<Record<string, unknown>> {
  const [booking] = await db.select().from(bookings)
    .where(and(eq(bookings.id, bookingId), isNull(bookings.deletedAt)))
    .limit(1);

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
    const err = new Error('Cannot cancel a booking with status: ' + booking.status) as Error & { statusCode: number };
    err.statusCode = 422;
    throw err;
  }

  return db.transaction(async (tx) => {
    // Revert availability
    await tx.delete(villaAvailability).where(
      and(
        eq(villaAvailability.villaId, booking.villaId!),
        eq(villaAvailability.status, 'booked'),
        gte(villaAvailability.date, booking.checkIn),
        lte(villaAvailability.date, booking.checkOut)
      )
    );

    const [updated] = await tx.update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.id, bookingId))
      .returning();

    return updated as Record<string, unknown>;
  });
}

// =============================================
// HOST: LIST ALL BOOKINGS FOR HOST'S VILLAS
// =============================================
export async function listHostBookings(
  hostId: string,
  page: number,
  limit: number
): Promise<Record<string, unknown>> {
  const { offset } = parsePagination(page, limit);

  const hostVillas = await db.select({ id: villas.id }).from(villas)
    .where(and(eq(villas.hostId, hostId), isNull(villas.deletedAt)));
  const villaIds = hostVillas.map((v) => v.id);

  if (villaIds.length === 0) {
    return { data: [], meta: buildMeta(0, page, limit) };
  }

  const { inArray } = await import('drizzle-orm');

  const [bookingList, totalResult] = await Promise.all([
    db.select().from(bookings)
      .where(and(inArray(bookings.villaId, villaIds), isNull(bookings.deletedAt)))
      .limit(limit).offset(offset)
      .orderBy(bookings.createdAt),
    db.select({ count: count() }).from(bookings)
      .where(and(inArray(bookings.villaId, villaIds), isNull(bookings.deletedAt))),
  ]);

  return { data: bookingList, meta: buildMeta(totalResult[0]?.count ?? 0, page, limit) };
}

// =============================================
// HOST: CONFIRM BOOKING
// =============================================
export async function confirmBooking(
  bookingId: string,
  hostId: string
): Promise<Record<string, unknown>> {
  const [booking] = await db.select().from(bookings)
    .where(and(eq(bookings.id, bookingId), isNull(bookings.deletedAt)))
    .limit(1);

  if (!booking) {
    const err = new Error('Booking not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (booking.status !== 'pending') {
    const err = new Error('Only pending bookings can be confirmed') as Error & { statusCode: number };
    err.statusCode = 422;
    throw err;
  }

  // Verify host owns the villa
  const [villa] = await db.select({ hostId: villas.hostId }).from(villas)
    .where(eq(villas.id, booking.villaId!)).limit(1);
  if (villa?.hostId !== hostId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }

  return db.transaction(async (tx) => {
    // Lock dates in villa_availability
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

    const [updated] = await tx.update(bookings)
      .set({ status: 'confirmed' })
      .where(eq(bookings.id, bookingId))
      .returning();

    return updated as Record<string, unknown>;
  });
}

// =============================================
// ADMIN: LIST ALL BOOKINGS
// =============================================
export async function listAllBookings(page: number, limit: number): Promise<Record<string, unknown>> {
  const { offset } = parsePagination(page, limit);

  const [bookingList, totalResult] = await Promise.all([
    db.select().from(bookings).where(isNull(bookings.deletedAt)).limit(limit).offset(offset).orderBy(bookings.createdAt),
    db.select({ count: count() }).from(bookings).where(isNull(bookings.deletedAt)),
  ]);

  return { data: bookingList, meta: buildMeta(totalResult[0]?.count ?? 0, page, limit) };
}
