import { z } from 'zod';

export const createBookingSchema = z.object({
  villaId: z.string().uuid('Invalid villa ID'),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  guestsCount: z.number().int().positive(),
  customerName: z.string().min(2).max(255),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7).max(50),
  customerNotes: z.string().max(1000).optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
