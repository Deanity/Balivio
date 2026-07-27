import { Router } from 'express';
import * as bookingsController from '../controller/bookingsController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleGuard } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validateMiddleware';
import { createBookingSchema } from '../schema/bookingsSchema';

export const bookingsRouter = Router();

// Host routes (must be placed before dynamic :bookingCode route)
bookingsRouter.get('/host/bookings', authMiddleware, roleGuard(['host', 'admin']), bookingsController.listHostBookings);
bookingsRouter.patch('/host/bookings/:id/confirm', authMiddleware, roleGuard(['host', 'admin']), bookingsController.confirmBooking);

// Admin routes
bookingsRouter.get('/admin/bookings', authMiddleware, roleGuard(['admin']), bookingsController.listAllBookings);

// Guest routes
bookingsRouter.post('/', authMiddleware, roleGuard(['guest', 'host', 'admin']), validate(createBookingSchema), bookingsController.createBooking);
bookingsRouter.get('/', authMiddleware, roleGuard(['guest', 'host', 'admin']), bookingsController.listMyBookings);
bookingsRouter.patch('/:id/cancel', authMiddleware, roleGuard(['guest', 'host', 'admin']), bookingsController.cancelBooking);
bookingsRouter.get('/:bookingCode', authMiddleware, bookingsController.getBooking);
