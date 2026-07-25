import type { Request, Response, NextFunction } from 'express';
import * as villasService from '@/modules/service/villasService';
import { successResponse, paginatedResponse } from '@/utils/responseUtils';
import type { VillaQuery, CreateVillaDto, UpdateVillaDto } from '@/modules/schema/villasSchema';

export async function listVillas(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await villasService.listVillas(req.query as unknown as VillaQuery);
    paginatedResponse(res, result.data as unknown[], result.meta as Parameters<typeof paginatedResponse>[2], 'Villas retrieved');
  } catch (err) { next(err); }
}

export async function getVilla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const villa = await villasService.getVillaBySlug(req.params['slug'] as string);
    successResponse(res, villa, 'Villa retrieved');
  } catch (err) { next(err); }
}

export async function getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const start_date = req.query['start_date'] as string;
    const end_date = req.query['end_date'] as string;
    const data = await villasService.getAvailability(req.params['villaId'] as string, start_date, end_date);
    successResponse(res, data, 'Availability retrieved');
  } catch (err) { next(err); }
}

export async function getVillaReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query['page'] ?? 1), 10);
    const limit = parseInt(String(req.query['limit'] ?? 10), 10);
    const result = await villasService.getVillaReviews(req.params['villaId'] as string, page, limit);
    paginatedResponse(res, result.data as unknown[], result.meta as Parameters<typeof paginatedResponse>[2], 'Reviews retrieved');
  } catch (err) { next(err); }
}

export async function createVilla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const villa = await villasService.createVilla(req.body as CreateVillaDto, req.user!.id);
    successResponse(res, villa, 'Villa created', 201);
  } catch (err) { next(err); }
}

export async function updateVilla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const villa = await villasService.updateVilla(req.params['villaId'] as string, req.body as UpdateVillaDto, req.user!.id);
    successResponse(res, villa, 'Villa updated');
  } catch (err) { next(err); }
}

export async function deleteVilla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await villasService.deleteVilla(req.params['villaId'] as string, req.user!.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function addImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { imageUrl, sortOrder } = req.body as { imageUrl: string; sortOrder: number };
    const img = await villasService.addVillaImage(req.params['villaId'] as string, imageUrl, sortOrder);
    successResponse(res, img, 'Image added', 201);
  } catch (err) { next(err); }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await villasService.deleteVillaImage(req.params['imageId'] as string);
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function updateAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { dates, status } = req.body as { dates: string[]; status: 'available' | 'blocked' };
    await villasService.updateAvailability(req.params['villaId'] as string, dates, status);
    successResponse(res, null, 'Availability updated');
  } catch (err) { next(err); }
}
