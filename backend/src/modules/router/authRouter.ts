import { Router } from 'express';
import * as authController from '@/modules/controller/authController';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validate } from '@/middleware/validateMiddleware';
import { loginRateLimit, registerRateLimit } from '@/middleware/rateLimitMiddleware';
import { registerSchema, loginSchema, refreshSchema } from '@/modules/schema/authSchema';

export const authRouter = Router();

// POST /auth/register
authRouter.post(
  '/register',
  registerRateLimit,
  validate(registerSchema),
  authController.register
);

// POST /auth/login
authRouter.post(
  '/login',
  loginRateLimit,
  validate(loginSchema),
  authController.login
);

// GET /auth/google returns Google OAuth redirect URL
authRouter.get('/google', authController.googleOAuth);

// POST /auth/refresh
authRouter.post('/refresh', validate(refreshSchema), authController.refresh);

// POST /auth/logout
authRouter.post('/logout', authMiddleware, authController.logout);

// GET /auth/me
authRouter.get('/me', authMiddleware, authController.me);
