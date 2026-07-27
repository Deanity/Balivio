import { Router } from 'express';
import * as villasController from '../controller/villasController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleGuard } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validateMiddleware';
import {
  createVillaSchema,
  updateVillaSchema,
  villaQuerySchema,
  addImageSchema,
  availabilityQuerySchema,
  blockDatesSchema,
} from '../schema/villasSchema';

export const villasRouter = Router();

// Public routes
villasRouter.get('/', validate(villaQuerySchema, 'query'), villasController.listVillas);
villasRouter.get('/:slug', villasController.getVilla);
villasRouter.get('/:villaId/availability', validate(availabilityQuerySchema, 'query'), villasController.getAvailability);
villasRouter.get('/:villaId/reviews', villasController.getVillaReviews);

// Host-only routes
villasRouter.post('/', authMiddleware, roleGuard(['host', 'admin']), validate(createVillaSchema), villasController.createVilla);
villasRouter.put('/:villaId', authMiddleware, roleGuard(['host', 'admin']), validate(updateVillaSchema), villasController.updateVilla);
villasRouter.delete('/:villaId', authMiddleware, roleGuard(['host', 'admin']), villasController.deleteVilla);
villasRouter.post('/:villaId/images', authMiddleware, roleGuard(['host', 'admin']), validate(addImageSchema), villasController.addImage);
villasRouter.delete('/:villaId/images/:imageId', authMiddleware, roleGuard(['host', 'admin']), villasController.deleteImage);
villasRouter.put('/:villaId/availability', authMiddleware, roleGuard(['host', 'admin']), validate(blockDatesSchema), villasController.updateAvailability);
