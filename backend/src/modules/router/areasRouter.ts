import { Router } from 'express';
import * as areasController from '../controller/areasController';

export const areasRouter = Router();

areasRouter.get('/', areasController.listAreas);
