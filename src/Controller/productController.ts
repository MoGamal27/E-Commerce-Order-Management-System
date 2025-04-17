import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, price, quantity, categoryId } = req.body;

    const product = await prisma.product.create({
        data: {
            title,
            description,
            price,
            quantity,
            categoryId,
        },
    });

    res.status(201).json({
        status: "success",
        message: "Product created successfully",
        data: product,
    });
    next();
});

const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await prisma.product.update({
        where: {
            id: Number(id),
        },
        data: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            categoryId: req.body.categoryId,
        },
    });

    res.status(201).json({
        status: "success",
        message: "Product updated successfully",
        data: product,
    });
    next();
});

const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.product.delete({
        where: {
            id: Number(id),
        },
    });

    res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
    });
    next();
});

const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
        where: {
            id: Number(id),
        },
    });

    res.status(200).json({
        status: "success",
        data: product,
    });
    next();
});

const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const products = await prisma.product.findMany();

    res.status(200).json({
        status: "success",
        data: products,
    });
    next();
});

export { createProduct, updateProduct, deleteProduct, getProduct, getProducts };