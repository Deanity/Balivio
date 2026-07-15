import { Router } from "express";
import { sendSuccess } from "../../utils/responseUtils.js";

const wishlistsRouter = Router();

wishlistsRouter.get("/", (_req, res) => {
  sendSuccess(res, [], "Wishlist fetched successfully (stub)");
});

export { wishlistsRouter };
