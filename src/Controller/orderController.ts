import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import { AppError } from "../utils/appError";
import sendEmail from "../Services/emailService";
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';
import { getIO } from '../config/socket';



const prisma = new PrismaClient();

const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, cartId, shippingAddress } = req.body;
  
  // check if cart exist
  const cart = await prisma.cart.findUnique({
    where: {
      id: Number(cartId),
    },
  });

  if(!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // get tax and shipping price
  const tax = await prisma.tax.findFirst({})
  const taxPrice = (tax?.taxPrice as unknown as number) || 0;
  const shippingPrice = (tax?.shippingPrice as unknown as number) || 0;

  const totalPrice = cart.totalPrice as number + taxPrice + shippingPrice

  const order = await prisma.order.create({
    data: {
      userId,
      cartId,
      shippingAddress,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice
    },
  });


  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
  next();
});


const updateStatusOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: {
      id: Number(id),
    },
    data: {
      status: status.toUpperCase(),
    },
    include: {
        user: {
          select: {
            email: true
          }
        }
         
    }
  });



  if (!order.user) {
    return next(new AppError("User not found", 404));
  }

  //send email to user
  await sendEmail({
    email: order.user.email,
    subject: "Order Status",
    html: `<p>Order status: ${order.status}</p>`,
  });

    // Emit real-time update via Socket.IO
   
    try {
      const io = getIO(); 
      io.to(`order-${id}`).emit('order-status-update', {
        orderId: Number(id),
        status: order.status,
        updatedAt: order.updatedAt
      });
    } catch (err: any) {
      console.error('Socket.IO not initialized:', err.message);
    }

  res.status(201).json({
    status: "success",
    message: "Order updated successfully",
    data: order,
  });
  next();    
})

const updateAddressOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { shippingAddress } = req.body;

  const order = await prisma.order.update({
    where: {
      id: Number(id),
    },
    data: {
      shippingAddress,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Order updated successfully",
    data: order,
  });
  next();
});



const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.order.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
  });
  next();
});

const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {

        user:{
            select: {
                email: true
            }
        },

        cart: {
            select: {
                productId: true,
                quantity: true,
                totalPrice: true
            }
        } 
    }
  });

  res.status(200).json({
    status: "success",
    data: order,
  });
  next();
});

const getOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await prisma.order.findMany();

  res.status(200).json({
    status: "success",
    data: orders,
  });
  next();
});


const getOrderHistory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const orders = await prisma.order.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      cart: {
        include: {
          product: {
            select: {
              title: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  

  res.status(200).json({
    status: "success",
    data: orders,
  });
  next();
});

export const exportOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      cart: {
        include: {
          product: true
        }
      }
    }
  });

  const outputDir = path.join(__dirname, '../exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvFilePath = path.join(outputDir, 'orders.csv');
  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'orderId', title: 'Order ID' },
      { id: 'userId', title: 'User ID' },
      { id: 'productTitle', title: 'Product' },
      { id: 'shippingAddress', title: 'Shipping Address' },
      { id: 'totalPrice', title: 'Total Price' },
      { id: 'status', title: 'Status' },
      { id: 'createdAt', title: 'Created At' }
    ]
  });

  const records = orders.map((order) => ({
    orderId: order.id,
    userId: order.userId,
    productTitle: order.cart.product.title,
    shippingAddress: order.shippingAddress,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt
  }));

  await csvWriter.writeRecords(records);
  res.download(csvFilePath, 'orders.csv');
});


export { createOrder, updateAddressOrder, updateStatusOrder, deleteOrder, getOrder, getOrders, getOrderHistory  };