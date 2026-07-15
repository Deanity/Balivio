import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const usersRouter = Router();

usersRouter.get("/profile", (_req, res) => {
  sendSuccess(res, {}, "User profile fetched successfully (stub)");
});

export { usersRouter };
