import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { title, description } = req.body;

    const category = await prisma.category.create({
        data: {
            title,
            description,
        },
    });

    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        data: category,
    });
    next();
});


const UpdateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const category = await prisma.category.update({
        where: {
            id: Number(id),
        },
        data: {
            title: req.body.title,
            description: req.body.description,
        },
    });

    res.status(201).json({
        status: "success",
        message: "Category updated successfully",
        data: category,
    });
    next();
});


export { createCategory, UpdateCategory };