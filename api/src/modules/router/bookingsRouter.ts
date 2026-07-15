import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const bookingsRouter = Router();

bookingsRouter.get("/", (_req, res) => {
  sendSuccess(res, [], "Bookings list fetched successfully (stub)");
});

export { bookingsRouter };
