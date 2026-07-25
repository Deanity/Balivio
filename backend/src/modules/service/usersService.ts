import { db, users, userProfiles } from '@/db';
import { eq } from 'drizzle-orm';
import { supabaseAdmin } from '@/config/supabase';
import type { UpdateProfileDto, ChangePasswordDto } from '@/modules/schema/usersSchema';

export async function getProfile(userId: string): Promise<Record<string, unknown>> {
  const [result] = await db.select({
    id: users.id,
    email: users.email,
    displayName: users.displayName,
    phone: users.phone,
    role: users.role,
    status: users.status,
    createdAt: users.createdAt,
    avatarUrl: userProfiles.avatarUrl,
    birthDate: userProfiles.birthDate,
    gender: userProfiles.gender,
    address: userProfiles.address,
    city: userProfiles.city,
    country: userProfiles.country,
  })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(users.id, userId))
    .limit(1);

  if (!result) {
    const err = new Error('User not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  return result as Record<string, unknown>;
}

export async function updateProfile(userId: string, dto: UpdateProfileDto): Promise<Record<string, unknown>> {
  const { displayName, phone, avatarUrl, birthDate, gender, address, city, country } = dto;

  // Update public.users
  if (displayName !== undefined || phone !== undefined) {
    await db.update(users)
      .set({
        ...(displayName !== undefined ? { displayName } : {}),
        ...(phone !== undefined ? { phone } : {}),
      })
      .where(eq(users.id, userId));
  }

  // Upsert user_profiles
  await db.insert(userProfiles)
    .values({
      userId,
      avatarUrl: avatarUrl ?? null,
      birthDate: birthDate ?? null,
      gender: gender ?? null,
      address: address ?? null,
      city: city ?? null,
      country: country ?? null,
    })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: {
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(birthDate !== undefined ? { birthDate } : {}),
        ...(gender !== undefined ? { gender } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(country !== undefined ? { country } : {}),
      },
    });

  return getProfile(userId);
}

export async function changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: dto.newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}
