import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

export const getTotalRevenue = asyncHandler(async (req: Request, res: Response) => {
    const totalSales = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        totalRevenue: totalSales._sum.totalPrice || 0
      }
    });
  });
  
  export const getTotalOrders = asyncHandler(async (req: Request, res: Response) => {
    const totalOrders = await prisma.order.count();
    
    res.status(200).json({
      status: 'success',
      data: { totalOrders }
    });
  });
  
  export const getRecentOrders = asyncHandler(async (req: Request, res: Response) => {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        cart: {
          include: { 
            product: {
              select: {
                title: true,
                price: true
              }
            }
          }
        }
      }
    });
  
    res.status(200).json({
      status: 'success',
      data: { recentOrders }
    });
  });
  
  export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
    const topProducts = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: {
        cart: {
          select: {
            product: {
              select: {
                id: true,
                title: true,
                price: true
              }
            },
            quantity: true,
            totalPrice: true
          }
        }
      },
      orderBy: {
        cart: { totalPrice: 'desc' }
      },
      take: 5
    });
  
    res.status(200).json({
      status: 'success',
      data: { 
        topProducts: topProducts.map(order => ({
          productId: order.cart.product.id,
          title: order.cart.product.title,
          quantity: order.cart.quantity,
          totalSales: order.cart.totalPrice
        }))
      }
    });
  });
  
