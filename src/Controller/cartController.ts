import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

const createCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, productId, quantity } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // check if product stock is enough
  if (product.stock < quantity) {
    return next(new AppError("Product stock is not enough", 400));
  }

  // calculate total price
  const totalPrice = quantity * product.price;

  const cart = await prisma.cart.create({
    data: {
      userId,
      productId,
      quantity,
      totalPrice
    },
  });

  res.status(201).json({
    status: "success",
    message: "Cart created successfully",
    data: cart,
  });
  next();
});



const updateCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const cart = await prisma.cart.update({
    where: {
      id: Number(id),
    },
    data: {
      quantity: req.body.quantity,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Cart updated successfully",
    data: cart,
  });
  next();
});

const deleteCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.cart.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json({
    status: "success",
    message: "Cart deleted successfully",
  });
  next();
});

const getCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const cart = await prisma.cart.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json({
    status: "success",
    data: cart,
  });
  next();
});

const getCarts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const carts = await prisma.cart.findMany();

  res.status(200).json({
    status: "success",
    data: carts,
  });
  next();
});

export { createCart, updateCart, deleteCart, getCart, getCarts };