import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { sendError } from "./utils/responseUtils.js";

// Import Routers
import { authRouter } from "./modules/router/authRouter.js";
import { villasRouter } from "./modules/router/villasRouter.js";
import { bookingsRouter } from "./modules/router/bookingsRouter.js";
import { paymentsRouter } from "./modules/router/paymentsRouter.js";
import { reviewsRouter } from "./modules/router/reviewsRouter.js";
import { wishlistsRouter } from "./modules/router/wishlistsRouter.js";
import { areasRouter } from "./modules/router/areasRouter.js";
import { usersRouter } from "./modules/router/usersRouter.js";

const app = express();

// Global Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// API Routes Registration (v1)
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/villas", villasRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/wishlists", wishlistsRouter);
apiRouter.use("/areas", areasRouter);
apiRouter.use("/users", usersRouter);

app.use("/api/v1", apiRouter);

// Wildcard 404 handler
app.use((req, res) => {
  sendError(res, `Route not found: ${req.method} ${req.path}`, 404);
});

// Global Error Middleware
app.use(errorMiddleware);

export { app };
export default app;
