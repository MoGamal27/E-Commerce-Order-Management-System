import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, price, stock, categoryId } = req.body;

    const product = await prisma.product.create({
        data: {
            title,
            description,
            price,
            stock,
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


const createBulkProducts = asyncHandler(async(req: Request, res: Response, next: NextFunction) =>{
  
  const { title, description, price, stock, categoryId } = req.body;

  const products = await prisma.product.createMany({
    data: {
        title,
        description,
        price,
        stock,
        categoryId,
    },
    skipDuplicates: true //Skips records that already exist
});

     res.status(201).json({
    status: 'success',
    message: `Successfully created ${products.count} products`,
    data: {
    count: products.count
  }
 });
   next();
})

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
            stock: req.body.stock,
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

const getFilteredProducts = asyncHandler(async (req: Request, res: Response) => {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;
  
    const filters: any = {};
    
    // Category filter
    if (categoryId) {
      filters.categoryId = Number(categoryId);
    }
  
    // Price range filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }
  
 // Stock availability filter
if (inStock === 'true') {
    filters.stock = { gt: 0 };
  } else if (inStock === 'false') {
    filters.stock = { lte: 0 };
  }
  
    const skip = (Number(page) - 1) * Number(limit);

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: true
      },
      orderBy: {
        [sortBy as string]: order
      },
      skip,
      take: Number(limit)
    });
  
    const total = await prisma.product.count({ where: filters });
  
    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / Number(limit)),
          currentPage: Number(page),
          limit: Number(limit)
        }
      }
    });
  });
  

export { createProduct, updateProduct, deleteProduct, getProduct, getProducts, getFilteredProducts, createBulkProducts };