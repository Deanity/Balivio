import type { Request, Response, NextFunction } from 'express';
import * as areasService from '../service/areasService';
import { successResponse } from '../../utils/responseUtils';

export async function listAreas(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await areasService.listAreas();
    successResponse(res, data, 'Areas retrieved');
  } catch (err) { next(err); }
}

export async function listPropertyTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await areasService.listPropertyTypes();
    successResponse(res, data, 'Property types retrieved');
  } catch (err) { next(err); }
}

export async function listAmenities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await areasService.listAmenities();
    successResponse(res, data, 'Amenities retrieved');
  } catch (err) { next(err); }
}
