import type { Request, Response, NextFunction } from 'express';
import * as bookingsService from '@/modules/service/bookingsService';
import { successResponse, paginatedResponse } from '@/utils/responseUtils';
import type { CreateBookingDto } from '@/modules/schema/bookingsSchema';

export async function createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await bookingsService.createBooking(req.body as CreateBookingDto, req.user!.id);
    successResponse(res, booking, 'Booking created', 201);
  } catch (err) { next(err); }
}

export async function listMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? 1), 10);
    const limit = parseInt(String(req.query.limit ?? 10), 10);
    const result = await bookingsService.listUserBookings(req.user!.id, page, limit);
    paginatedResponse(res, result.data as unknown[], result.meta as Parameters<typeof paginatedResponse>[2], 'Bookings retrieved');
  } catch (err) { next(err); }
}

export async function getBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await bookingsService.getBookingByCode(req.params['bookingCode'] as string, req.user!.id, req.user!.role);
    successResponse(res, booking, 'Booking retrieved');
  } catch (err) { next(err); }
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await bookingsService.cancelBooking(req.params['id'] as string, req.user!.id);
    successResponse(res, booking, 'Booking cancelled');
  } catch (err) { next(err); }
}

export async function listHostBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? 1), 10);
    const limit = parseInt(String(req.query.limit ?? 10), 10);
    const result = await bookingsService.listHostBookings(req.user!.id, page, limit);
    paginatedResponse(res, result.data as unknown[], result.meta as Parameters<typeof paginatedResponse>[2], 'Host bookings retrieved');
  } catch (err) { next(err); }
}

export async function confirmBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await bookingsService.confirmBooking(req.params['id'] as string, req.user!.id);
    successResponse(res, booking, 'Booking confirmed');
  } catch (err) { next(err); }
}

export async function listAllBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? 1), 10);
    const limit = parseInt(String(req.query.limit ?? 10), 10);
    const result = await bookingsService.listAllBookings(page, limit);
    paginatedResponse(res, result.data as unknown[], result.meta as Parameters<typeof paginatedResponse>[2], 'All bookings retrieved');
  } catch (err) { next(err); }
}
