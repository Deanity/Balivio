import { Router } from 'express';
import * as usersController from '@/modules/controller/usersController';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validate } from '@/middleware/validateMiddleware';
import { updateProfileSchema, changePasswordSchema } from '@/modules/schema/usersSchema';

export const usersRouter = Router();

usersRouter.get('/profile', authMiddleware, usersController.getProfile);
usersRouter.put('/profile', authMiddleware, validate(updateProfileSchema), usersController.updateProfile);
usersRouter.patch('/password', authMiddleware, validate(changePasswordSchema), usersController.changePassword);
