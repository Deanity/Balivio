import { Router } from "express";
import * as authController from "../controller/authController.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../../middleware/rateLimitMiddleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../schema/authSchema.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerLimiter,
  validate({ body: registerSchema }),
  authController.register
);

authRouter.post(
  "/login",
  loginLimiter,
  validate({ body: loginSchema }),
  authController.login
);

authRouter.post(
  "/refresh",
  validate({ body: refreshTokenSchema }),
  authController.refresh
);

authRouter.post(
  "/logout",
  authMiddleware,
  validate({ body: refreshTokenSchema }),
  authController.logout
);

authRouter.get(
  "/me",
  authMiddleware,
  authController.getMe
);

authRouter.patch(
  "/password",
  authMiddleware,
  validate({ body: changePasswordSchema }),
  authController.changePassword
);

authRouter.put(
  "/profile",
  authMiddleware,
  validate({ body: updateProfileSchema }),
  authController.updateProfile
);

export { authRouter };
