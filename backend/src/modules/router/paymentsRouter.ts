import { Router } from 'express';
import * as paymentsController from '@/modules/controller/paymentsController';
import { authMiddleware } from '@/middleware/authMiddleware';
import { roleGuard } from '@/middleware/roleGuard';
import { validate } from '@/middleware/validateMiddleware';
import { initiatePaymentSchema } from '@/modules/schema/paymentsSchema';

export const paymentsRouter = Router();

// Guest: initiate payment
paymentsRouter.post('/initiate', authMiddleware, roleGuard(['guest', 'host', 'admin']), validate(initiatePaymentSchema), paymentsController.initiatePayment);

// Xendit webhook — no auth (validated by x-callback-token header)
paymentsRouter.post('/webhook', paymentsController.webhook);

// Guest: get payment status
paymentsRouter.get('/:paymentCode', authMiddleware, paymentsController.getPayment);
