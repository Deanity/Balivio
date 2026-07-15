import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const areasRouter = Router();

areasRouter.get("/", (_req, res) => {
  sendSuccess(res, [], "Areas fetched successfully (stub)");
});

export { areasRouter };
