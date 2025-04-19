import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';


const prisma = new PrismaClient()


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  
  // Use Prisma transaction for data consistency
  const result = await prisma.$transaction(async (tx) => {
    // Find order with related data within transaction
    const order = await tx.order.findUnique({
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
    
    // Create line items for Stripe
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
    
    // Update order status to indicate checkout started
    await tx.order.update({
      where: { id: Number(orderId) },
      data: { status: 'PROCESSING' }
    });
    
    // Create Stripe checkout session
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
    
    return { url: session.url };
  });
  
  res.json({ url: result.url });
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
          
          // update order status
          if (session.metadata?.orderId) {
            await prisma.order.update({
              where: { id: Number(session.metadata.orderId) },
              data: { status: 'PAID' }
            });
            
          }
         
          // update stock product 
          const order = await prisma.order.findUnique({
            where: { id: Number(session.metadata?.orderId) },
            include: {
              cart: {
                include: {
                  product: true
                }
              },
              user: true
            }
          })


  
          if (order && order.cart.product.stock !== undefined) {
            await prisma.product.update({
              where: { id: order.cart.product.id },
              data: { stock: order.cart.product.stock - order.cart.quantity }
            });
          }

          // // reset Cart
           await prisma.cart.deleteMany({
            where: { userId: order?.user.id }
           })

  
          break;
      }
  
      res.status(200).json({ received: true });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  });  