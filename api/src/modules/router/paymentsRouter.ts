import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const paymentsRouter = Router();

paymentsRouter.get("/", (_req, res) => {
  sendSuccess(res, [], "Payments status fetched successfully (stub)");
});

export { paymentsRouter };
