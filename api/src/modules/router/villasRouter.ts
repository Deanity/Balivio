import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const villasRouter = Router();

villasRouter.get("/", (_req, res) => {
  sendSuccess(res, [], "Villas list fetched successfully (stub)");
});

export { villasRouter };
