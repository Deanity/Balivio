import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { db, users } from '../db';
import { eq, isNull } from 'drizzle-orm';
import { errorResponse } from '../utils/responseUtils';

/**
 * authMiddleware
 * Extracts Bearer token → verifies via Supabase Auth → loads user role
 * from public.users → attaches req.user = { id, email, role }
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    errorResponse(res, 'Missing or invalid authorization header', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  // Verify token with Supabase Auth
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    errorResponse(res, 'Invalid or expired token', 401);
    return;
  }

  // Load role from public.users (not from Supabase auth.users)
  const [dbUser] = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, data.user.id))
    .limit(1);

  if (!dbUser) {
    errorResponse(res, 'User not found', 401);
    return;
  }

  req.user = {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
  };

  next();
}
