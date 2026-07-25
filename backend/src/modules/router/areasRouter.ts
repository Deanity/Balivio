import { Router } from 'express';
import * as areasController from '@/modules/controller/areasController';

export const areasRouter = Router();

areasRouter.get('/', areasController.listAreas);
