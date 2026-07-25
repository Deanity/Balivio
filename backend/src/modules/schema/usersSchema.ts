import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(255).optional(),
  phone: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
