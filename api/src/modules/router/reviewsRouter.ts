import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const reviewsRouter = Router();

reviewsRouter.get("/", (_req, res) => {
  sendSuccess(res, [], "Reviews fetched successfully (stub)");
});

export { reviewsRouter };
