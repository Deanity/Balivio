import { eq, and, isNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, userProfiles, userSessions } from "../../db/schema/authSchema.js";
import { comparePassword, hashPassword } from "../../utils/hashUtils.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwtUtils.js";
import { AppError } from "../../utils/appError.js";
import { RegisterInput, LoginInput, ChangePasswordInput, UpdateProfileInput } from "../schema/authSchema.js";

export const registerUser = async (input: RegisterInput) => {
  // 1. Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: and(
      eq(users.email, input.email.toLowerCase()),
      isNull(users.deletedAt)
    ),
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(input.password);

  // 3. Create user and profile in transaction
  return await db.transaction(async (tx) => {
    // Insert user
    const [newUser] = await tx
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash: hashedPassword,
        displayName: input.displayName,
        phone: input.phone,
        role: "guest",
        status: "active",
      })
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        phone: users.phone,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      });

    if (!newUser) {
      throw new AppError("Failed to register user", 500);
    }

    // Insert empty profile
    await tx.insert(userProfiles).values({
      userId: newUser.id,
    });

    return newUser;
  });
};

export const loginUser = async (
  input: LoginInput,
  ipAddress?: string,
  userAgent?: string
) => {
  // 1. Find user
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, input.email.toLowerCase()),
      isNull(users.deletedAt)
    ),
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "active") {
    throw new AppError(`Account is ${user.status}`, 403);
  }

  // 2. Verify password
  const isPasswordValid = await comparePassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Generate tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // 4. Save refresh token session in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await db.insert(userSessions).values({
    userId: user.id,
    sessionToken: refreshToken,
    ipAddress,
    userAgent,
    expiresAt,
  });

  // Get user profile detail
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, user.id),
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
      role: user.role,
      avatarUrl: profile?.avatarUrl || null,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const refreshAccessToken = async (
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    // 1. Verify token signature
    const decoded = verifyRefreshToken(refreshToken);

    // 2. Check session in DB
    const session = await db.query.userSessions.findFirst({
      where: eq(userSessions.sessionToken, refreshToken),
    });

    if (!session) {
      throw new AppError("Invalid session token", 401);
    }

    if (new Date() > new Date(session.expiresAt)) {
      // Clean up expired session
      await db.delete(userSessions).where(eq(userSessions.sessionToken, refreshToken));
      throw new AppError("Session expired", 401);
    }

    // 3. Get User details
    const user = await db.query.users.findFirst({
      where: and(eq(users.id, decoded.userId), isNull(users.deletedAt)),
    });

    if (!user || user.status !== "active") {
      throw new AppError("User not found or inactive", 401);
    }

    // 4. Sign a new access token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = signAccessToken(tokenPayload);

    // Optional: Update session IP/Agent
    await db
      .update(userSessions)
      .set({ ipAddress, userAgent, updatedAt: new Date() })
      .where(eq(userSessions.id, session.id));

    return {
      accessToken,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Unauthorized", 401, error);
  }
};

export const logoutUser = async (refreshToken: string) => {
  await db.delete(userSessions).where(eq(userSessions.sessionToken, refreshToken));
  return { success: true };
};

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), isNull(users.deletedAt)),
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify old password
  const isOldPasswordValid = await comparePassword(input.oldPassword, user.passwordHash);
  if (!isOldPasswordValid) {
    throw new AppError("Invalid old password", 400);
  }

  // Hash new password
  const newHashedPassword = await hashPassword(input.newPassword);

  // Update password and invalidate all sessions
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash: newHashedPassword })
      .where(eq(users.id, userId));

    // Force log out from all devices
    await tx.delete(userSessions).where(eq(userSessions.userId, userId));
  });

  return { success: true };
};

export const getUserProfile = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), isNull(users.deletedAt)),
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    phone: user.phone,
    role: user.role,
    avatarUrl: profile?.avatarUrl || null,
    birthDate: profile?.birthDate || null,
    gender: profile?.gender || null,
    address: profile?.address || null,
    city: profile?.city || null,
    country: profile?.country || null,
  };
};

export const updateUserProfile = async (userId: string, input: UpdateProfileInput) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), isNull(users.deletedAt)),
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await db.transaction(async (tx) => {
    // Update user display name and phone if provided
    if (input.displayName || input.phone) {
      await tx
        .update(users)
        .set({
          ...(input.displayName && { displayName: input.displayName }),
          ...(input.phone && { phone: input.phone }),
        })
        .where(eq(users.id, userId));
    }

    // Update profile fields
    const hasProfileUpdates =
      input.avatarUrl !== undefined ||
      input.birthDate !== undefined ||
      input.gender !== undefined ||
      input.address !== undefined ||
      input.city !== undefined ||
      input.country !== undefined;

    if (hasProfileUpdates) {
      await tx
        .update(userProfiles)
        .set({
          ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
          ...(input.birthDate !== undefined && { birthDate: input.birthDate }),
          ...(input.gender !== undefined && { gender: input.gender }),
          ...(input.address !== undefined && { address: input.address }),
          ...(input.city !== undefined && { city: input.city }),
          ...(input.country !== undefined && { country: input.country }),
        })
        .where(eq(userProfiles.userId, userId));
    }
  });

  return getUserProfile(userId);
};
