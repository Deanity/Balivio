import { supabaseAdmin } from '@/config/supabase';
import { db, users, userProfiles } from '@/db';
import { eq } from 'drizzle-orm';
import { env } from '@/config/env';
import type { RegisterDto, LoginDto, RefreshDto } from '@/modules/schema/authSchema';

// =============================================
// REGISTER
// =============================================
export async function register(dto: RegisterDto): Promise<{
  user: Record<string, unknown>;
  session: Record<string, unknown>;
}> {
  // Create user in Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: dto.email,
    password: dto.password,
    email_confirm: true, // auto-confirm for now
    user_metadata: {
      display_name: dto.displayName,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      const conflict = new Error('Email already registered') as Error & {
        statusCode: number;
      };
      conflict.statusCode = 409;
      throw conflict;
    }
    throw new Error(error.message);
  }

  // Upsert display_name, email and phone in public.users (in case DB trigger hasn't fired yet)
  await db
    .insert(users)
    .values({
      id: data.user.id,
      email: dto.email,
      displayName: dto.displayName,
      phone: dto.phone ?? null,
      role: 'guest',
      status: 'active',
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        displayName: dto.displayName,
        phone: dto.phone ?? null,
      },
    });

  // Sign in immediately to get tokens
  const { data: sessionData, error: signInError } =
    await supabaseAdmin.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

  if (signInError || !sessionData.session) {
    throw new Error('Registration succeeded but failed to create session');
  }

  const { password_hash: _omit, ...safeUser } = data.user as unknown as Record<string, unknown>;

  return {
    user: safeUser,
    session: {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      expiresAt: sessionData.session.expires_at,
    },
  };
}

// =============================================
// LOGIN (email + password)
// =============================================
export async function login(dto: LoginDto): Promise<{
  user: Record<string, unknown>;
  session: Record<string, unknown>;
}> {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: dto.email,
    password: dto.password,
  });

  if (error || !data.session) {
    const err = new Error('Invalid email or password') as Error & {
      statusCode: number;
    };
    err.statusCode = 401;
    throw err;
  }

  // Load role from public.users
  const [dbUser] = await db
    .select({ role: users.role, displayName: users.displayName, phone: users.phone })
    .from(users)
    .where(eq(users.id, data.user.id))
    .limit(1);

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      role: dbUser?.role ?? 'guest',
      displayName: dbUser?.displayName,
    },
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  };
}

// =============================================
// GOOGLE OAUTH get redirect URL
// =============================================
export async function getGoogleOAuthUrl(): Promise<{ url: string }> {
  const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.FRONTEND_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error || !data.url) {
    throw new Error('Failed to generate Google OAuth URL');
  }

  return { url: data.url };
}

// =============================================
// REFRESH TOKEN
// =============================================
export async function refreshSession(dto: RefreshDto): Promise<{
  session: Record<string, unknown>;
}> {
  const { data, error } = await supabaseAdmin.auth.refreshSession({
    refresh_token: dto.refreshToken,
  });

  if (error || !data.session) {
    const err = new Error('Invalid or expired refresh token') as Error & {
      statusCode: number;
    };
    err.statusCode = 401;
    throw err;
  }

  return {
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  };
}

// =============================================
// LOGOUT
// =============================================
export async function logout(accessToken: string): Promise<void> {
  // Sign out the specific session using the access token
  // Create a user-scoped client for signOut
  const { createClient } = await import('@supabase/supabase-js');
  const userClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  await userClient.auth.signOut();
}

// =============================================
// ME get current user + profile
// =============================================
export async function getMe(userId: string): Promise<Record<string, unknown>> {
  const [result] = await db
    .select({
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
