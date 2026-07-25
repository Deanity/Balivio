import { format } from 'date-fns';

/**
 * Generates a unique booking code in format: BK-YYYY-XXXX
 * where XXXX is a 4-char random alphanumeric suffix.
 *
 * Example: BK-2026-A7K2
 */
export function generateBookingCode(): string {
  const year = format(new Date(), 'yyyy');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const suffix = Array.from({ length: 4 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  return `BK-${year}-${suffix}`;
}
