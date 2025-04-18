import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../Controller/paymentController';
import express from 'express';

const router = Router();

router.post('/create-checkout-session/:orderId', createCheckoutSession);
//router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook)


export default router;
