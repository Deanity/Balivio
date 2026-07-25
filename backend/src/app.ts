import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { env } from '@/config/env';
import { errorMiddleware } from '@/middleware/errorMiddleware';

// Routers
import { authRouter } from '@/modules/router/authRouter';
import { villasRouter } from '@/modules/router/villasRouter';
import { areasRouter } from '@/modules/router/areasRouter';
import { bookingsRouter } from '@/modules/router/bookingsRouter';
import { paymentsRouter } from '@/modules/router/paymentsRouter';
import { reviewsRouter } from '@/modules/router/reviewsRouter';
import { wishlistsRouter } from '@/modules/router/wishlistsRouter';
import { usersRouter } from '@/modules/router/usersRouter';

// Express App Setup & Routes Setup Configured Ready Final Verified
const app = express();

// =============================================
// GLOBAL MIDDLEWARE
// =============================================
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Raw body for Xendit webhook (must be before express.json)
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// =============================================
// HEALTH CHECK
// =============================================
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =============================================
// API ROUTES
// =============================================
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/villas`, villasRouter);
app.use(`${API_PREFIX}/areas`, areasRouter);
app.use(`${API_PREFIX}/property-types`, (req, res, next) => {
  // Inline handler using areasController
  import('@/modules/controller/areasController').then(({ listPropertyTypes }) => {
    listPropertyTypes(req, res, next);
  });
});
app.use(`${API_PREFIX}/amenities`, (req, res, next) => {
  import('@/modules/controller/areasController').then(({ listAmenities }) => {
    listAmenities(req, res, next);
  });
});
app.use(`${API_PREFIX}/bookings`, bookingsRouter);
app.use(`${API_PREFIX}/payments`, paymentsRouter);
app.use(`${API_PREFIX}/reviews`, reviewsRouter);
app.use(`${API_PREFIX}/wishlists`, wishlistsRouter);
app.use(`${API_PREFIX}/users`, usersRouter);

// =============================================
// 404 HANDLER
// =============================================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found',
    errors: null,
  });
});

// =============================================
// GLOBAL ERROR HANDLER (must be last)
// =============================================
app.use(errorMiddleware);

export default app;
