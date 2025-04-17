import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import { AppError } from "../utils/appError";
import sendEmail from "../Services/emailService";

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
        user: true
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

export { createOrder, updateAddressOrder, updateStatusOrder, deleteOrder, getOrder, getOrders, getOrderHistory  };