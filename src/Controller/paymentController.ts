import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';


const prisma = new PrismaClient()


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        user: true,
        cart: {
          include: {
            product: true
          }
        }
      }
    });
  
    if (!order) {
      throw new Error('Order not found');
    }
  
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: order.cart.product.title,
          description: order.cart.product.description
        },
        unit_amount: Math.round(order.cart.product.price * 100)
      },
      quantity: order.cart.quantity
    }];
  
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      customer_email: order.user.email,
      metadata: {
        orderId: order.id
      },
      success_url: `${process.env.SUCCESS_URL}/order/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CANCEL_URL}/order/${order.id}/cancel`
    });
  
    res.json({ url: session.url });
  });
  

  export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    try {
      const sig = req.headers['stripe-signature']!;
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
  
      
  
      switch (event.type) {
        case 'checkout.session.completed':
        case 'payment_intent.succeeded':
        case 'charge.succeeded':
          const session = event.data.object;
          
          
          if (session.metadata?.orderId) {
            await prisma.order.update({
              where: { id: Number(session.metadata.orderId) },
              data: { status: 'PAID' }
            });
            
          }
          break;
      }
  
      res.status(200).json({ received: true });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  