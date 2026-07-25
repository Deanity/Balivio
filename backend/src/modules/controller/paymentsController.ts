import type { Request, Response, NextFunction } from 'express';
import * as paymentsService from '@/modules/service/paymentsService';
import { successResponse } from '@/utils/responseUtils';
import type { InitiatePaymentDto } from '@/modules/schema/paymentsSchema';

export async function initiatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await paymentsService.initiatePayment(req.body as InitiatePaymentDto, req.user!.id);
    successResponse(res, result, 'Payment initiated', 201);
  } catch (err) { next(err); }
}

export async function webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = (req.headers['x-callback-token'] as string) ?? '';
    await paymentsService.handleWebhook(req.body as Record<string, unknown>, token);
    res.status(200).json({ received: true });
  } catch (err) { next(err); }
}

export async function getPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payment = await paymentsService.getPaymentByCode(req.params['paymentCode'] as string, req.user!.id);
    successResponse(res, payment, 'Payment retrieved');
  } catch (err) { next(err); }
}
