import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  bookingId: z.string().uuid(),
  paymentMethod: z.enum(['transfer', 'ewallet', 'card']),
  // For transfer: bank name
  bankCode: z.enum(['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA']).optional(),
  // For ewallet: provider
  ewalletType: z.enum(['GOPAY', 'OVO', 'DANA', 'SHOPEEPAY']).optional(),
});

export type InitiatePaymentDto = z.infer<typeof initiatePaymentSchema>;
